import { prisma } from "../db.js"
import type { Prisma } from "../generated/prisma/client.js"
import type { Case, CaseOutcome, CaseStage, ItemProgress } from "../types/case.js"

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