import { prisma } from "../db.js"
import { ActiveCaseError, CaseAlreadyStartedError, CaseNotFoundError } from "../errors.js"
import { Prisma } from "../generated/prisma/client.js"
import type { Case, CaseOutcome, CaseStage, ItemProgress } from "../types/case.js"
import type { CaseDetails } from "../validation/caseDetails.js"

// Stands in for the logged-in employee until log-in exists (ticket 7)
const CURRENT_USER_EMAIL = 'alex.kim@example.com'

// Everything a case needs from the other tables, fetched in the same request
const CASE_DETAILS = {
    company: true,
    assignedBy: true,
    people: { include: { user: true }, orderBy: [{ addedAt: 'asc' }, { userId: 'asc' }] },
    progress: true,
} satisfies Prisma.CaseInclude

export type CaseRow = Prisma.CaseGetPayload<{ include: typeof CASE_DETAILS }>

// The database stores short codes; the screens show these words
const STAGE_LABEL: Record<NonNullable<CaseRow['stage']>, CaseStage> = {
    gathering_documents: 'Gathering documents',
    ready_to_submit: 'Ready to submit',
}

const OUTCOME_LABEL: Record<NonNullable<CaseRow['outcome']>, CaseOutcome> = {
    bound: 'Bound',
    quoted_not_bound: 'Quoted, not bound',
    declined: 'Declined by markets',
}

// Every case, the most recently changed first
export async function listCases(): Promise<Case[]> {
    const rows = await prisma.case.findMany({
        include: CASE_DETAILS,
        orderBy: { updatedAt: 'desc' },
    })
    return rows.map(toApiCase)
}

// Starts a new open case, assigned to you, and gives it back
export async function createCase(details: CaseDetails): Promise<Case> {
    try {
        return await saveNewCase(details)
    } catch (error) {
        // Someone else saved a case for the same company at the same moment, and
        // the database turned ours down. Look again: this time we'll see their case.
        if (isUniqueClash(error)) {
            return await saveNewCase(details)
        }
        throw error
    }
}

async function saveNewCase(details: CaseDetails): Promise<Case> {
    const company = await findCompany(details)
    const activeCase = company?.cases[0]
    if (activeCase) {
        throw new ActiveCaseError(activeCase.number)
    }

    const created = await prisma.case.create({
        data: {
            number: await nextCaseNumber(),
            status: 'open',
            stage: 'gathering_documents',
            company: company ? { connect: { id: company.id } } : { create: details },
            people: { create: { user: { connect: { email: CURRENT_USER_EMAIL } } } },
        },
        include: CASE_DETAILS,
    })
    return toApiCase(created)
}

// Turns an assigned (new) case into an open one, and gives it back
export async function startCase(caseId: string): Promise<Case> {
    try {
        const started = await prisma.case.update({
            // Only a case that is still new can be started
            where: { number: caseId, status: 'new' },
            data: { status: 'open', stage: 'gathering_documents' },
            include: CASE_DETAILS,
        })
        return toApiCase(started)
    } catch (error) {
        if (!isNotFound(error)) {
            throw error
        }
        // Nothing was changed: either there's no such case, or it's not new any more
        const existing = await prisma.case.findUnique({ where: { number: caseId } })
        throw existing ? new CaseAlreadyStartedError(caseId) : new CaseNotFoundError(caseId)
    }
}

// A company's case in progress (new or open), if it has one
const ACTIVE_CASE = {
    where: { status: { in: ['new', 'open'] } },
    select: { number: true },
    take: 1,
} satisfies Prisma.Company$casesArgs

// The company's existing record, if there is one. Carriers are matched by
// USDOT number; leasing companies by name, ignoring capitals.
function findCompany(details: CaseDetails) {
    if (details.type === 'carrier') {
        return prisma.company.findUnique({
            where: { dot: details.dot },
            include: { cases: ACTIVE_CASE },
        })
    }
    return prisma.company.findFirst({
        where: { type: 'leasing', name: { equals: details.name, mode: 'insensitive' } },
        include: { cases: ACTIVE_CASE },
    })
}

// Takes the next case number for this year. The counter goes up by one in a
// single step inside the database, so no two cases ever get the same number.
async function nextCaseNumber(): Promise<string> {
    const year = new Date().getFullYear()
    const counter = await prisma.caseCounter.upsert({
        where: { year },
        create: { year, last: 1 },
        update: { last: { increment: 1 } },
    })
    return formatCaseNumber(year, counter.last)
}

// 2026 and 150 → C-2026-0150
export function formatCaseNumber(year: number, count: number): string {
    return `C-${year}-${String(count).padStart(4, '0')}`
}

// P2002 is Prisma's code for "a unique rule turned this save down"
function isUniqueClash(error: unknown): boolean {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'
}

// P2025 is Prisma's code for "no row matched, so nothing was changed"
function isNotFound(error: unknown): boolean {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025'
}

// Turns one database row (with its company, people and checklist) into the
// shape the screens use
export function toApiCase(row: CaseRow): Case {
    const base = {
        id: row.number,
        type: row.company.type,
        name: row.company.name,
        dot: row.company.dot ?? undefined,
        assignees: row.people.map((person) => person.user.name),
        updatedAt: row.updatedAt.toISOString(),
        progress: toProgress(row.progress),
    }

    switch (row.status) {
        case 'new':
            return {
                ...base,
                status: 'new',
                assignedBy: must(row.assignedBy, 'assignedBy', row.number).name,
                assignedAt: must(row.assignedAt, 'assignedAt', row.number).toISOString(),
                dueOn: toDateOnly(must(row.dueOn, 'dueOn', row.number)),
                note: row.note ?? undefined,
            }
        case 'open':
            return {
                ...base,
                status: 'open',
                stage: STAGE_LABEL[must(row.stage, 'stage', row.number)],
                effectiveDate: row.effectiveDate ? toDateOnly(row.effectiveDate) : undefined,
            }
        case 'closed':
            return {
                ...base,
                status: 'closed',
                outcome: OUTCOME_LABEL[must(row.outcome, 'outcome', row.number)],
                marketsSubmitted: must(row.marketsSubmitted, 'marketsSubmitted', row.number),
                closedOn: toDateOnly(must(row.closedOn, 'closedOn', row.number)),
            }
    }
}

// { lossRuns: { state: 'done' } }, by item ID. Left out when nothing has arrived.
function toProgress(items: CaseRow['progress']): Record<string, ItemProgress> | undefined {
    if (items.length === 0) {
        return undefined
    }
    return Object.fromEntries(
        items.map((item) => [item.itemId, { state: item.state, detail: item.detail ?? undefined }]),
    )
}

// A date-only column comes back as midnight UTC; keep just '2026-10-24'
function toDateOnly(date: Date): string {
    return date.toISOString().slice(0, 10)
}

// The database allows these to be empty, but a case at this stage always has
// them. If one is missing, the data is broken, so stop instead of guessing.
function must<T>(value: T | null, field: string, caseNumber: string): T {
    if (value === null) {
        throw new Error(`Case ${caseNumber} is missing ${field}`)
    }
    return value
}