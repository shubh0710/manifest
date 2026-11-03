import { prisma } from "../db.js"
import { ActiveCaseError, CaseAlreadyStartedError, CaseNotFoundError } from "../errors.js"
import type { Prisma } from "../generated/prisma/client.js"
import { isNotFound, isUniqueClash } from "../prismaErrors.js"
import type { Case, CaseOutcome, CaseStage, ItemProgress } from "../types/case.js"
import type { CaseDetails } from "../validation/caseDetails.js"

// Everything a case needs from the other tables, fetched in the same request.
// From people, only their names: never their email or password hash.
const CASE_DETAILS = {
    company: true,
    assignedBy: { select: { name: true } },
    people: { include: { user: { select: { name: true } } }, orderBy: [{ addedAt: 'asc' }, { userId: 'asc' }] },
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

// Every case this person may see, the most recently changed first
export async function listCases(userId: number): Promise<Case[]> {
    const rows = await prisma.case.findMany({
        where: visibleTo(userId),
        include: CASE_DETAILS,
        orderBy: { updatedAt: 'desc' },
    })
    return rows.map(toApiCase)
}

// Starts a new open case with this person on it, and gives it back
export async function createCase(details: CaseDetails, userId: number): Promise<Case> {
    try {
        return await saveNewCase(details, userId)
    } catch (error) {
        // Someone else saved a case for the same company at the same moment, and
        // the database turned ours down. Look again: this time we'll see their case.
        if (isUniqueClash(error)) {
            return await saveNewCase(details, userId)
        }
        throw error
    }
}

async function saveNewCase(details: CaseDetails, userId: number): Promise<Case> {
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
            people: { create: { user: { connect: { id: userId } } } },
        },
        include: CASE_DETAILS,
    })
    return toApiCase(created)
}

// Turns a case assigned to this person (new) into an open one, and gives it back
export async function startCase(caseId: string, userId: number): Promise<Case> {
    try {
        const started = await prisma.case.update({
            // Only a case that is still new, and assigned to this person, can be started
            where: { number: caseId, status: 'new', people: { some: { userId } } },
            data: { status: 'open', stage: 'gathering_documents' },
            include: CASE_DETAILS,
        })
        return toApiCase(started)
    } catch (error) {
        if (!isNotFound(error)) {
            throw error
        }
        // Nothing was changed. A case this person can't see doesn't exist for them;
        // one they can see has already been started.
        const visible = await prisma.case.findFirst({ where: { number: caseId, ...visibleTo(userId) } })
        throw visible ? new CaseAlreadyStartedError(caseId) : new CaseNotFoundError(caseId)
    }
}

// The cases a person may see: everyone's open and closed cases, but only the
// new ones assigned to them
function visibleTo(userId: number) {
    return {
        OR: [{ status: { not: 'new' } }, { people: { some: { userId } } }],
    } satisfies Prisma.CaseWhereInput
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