import { prisma } from "../src/db.js"
import type { ItemState, Prisma } from "../src/generated/prisma/client.js"
import { hashPassword } from "../src/passwords.js"

// Fills the database with sample data: made-up people, public carriers and
// made-up leasing companies. It empties the tables first, so it's safe to run again.

const USERS = [
    { name: 'Alex Kim', email: 'alex.kim@example.com' },
    { name: 'Priya Shah', email: 'priya.shah@example.com' },
    { name: 'Daniel Ortiz', email: 'daniel.ortiz@example.com' },
    { name: 'Laura Chen', email: 'laura.chen@example.com' },
    { name: 'Marcus Reid', email: 'marcus.reid@example.com' },
]

// Puts these people on the case, found by email
function people(...emails: string[]) {
    return { create: emails.map((email) => ({ user: { connect: { email } } })) }
}

// Turns { lossRuns: { state: 'done' } } into one checklist row per item
function progress(items: Record<string, { state: ItemState; detail?: string }>) {
    return { create: Object.entries(items).map(([itemId, item]) => ({ itemId, ...item })) }
}

const CASES: Prisma.CaseCreateInput[] = [
    {
        number: 'C-2026-0147',
        status: 'new',
        company: { create: { type: 'carrier', name: 'WERNER ENTERPRISES INC', dot: '53467' } },
        people: people('alex.kim@example.com'),
        assignedBy: { connect: { email: 'laura.chen@example.com' } },
        assignedAt: new Date('2026-10-18T09:30:00Z'),
        dueOn: new Date('2026-10-24'),
        note: 'Renewal in December. Client wants quotes by month end.',
        updatedAt: new Date('2026-10-18T09:30:00Z'),
    },
    {
        number: 'C-2026-0148',
        status: 'new',
        company: { create: { type: 'carrier', name: 'KNIGHT TRANSPORTATION INC', dot: '428823' } },
        people: people('alex.kim@example.com', 'priya.shah@example.com'),
        assignedBy: { connect: { email: 'laura.chen@example.com' } },
        assignedAt: new Date('2026-10-17T14:00:00Z'),
        dueOn: new Date('2026-10-22'),
        note: 'New venture. Authority was just granted.',
        updatedAt: new Date('2026-10-17T14:00:00Z'),
    },
    {
        number: 'C-2026-0149',
        status: 'new',
        company: { create: { type: 'leasing', name: 'Summit Ridge Trailer Leasing Inc' } },
        people: people('alex.kim@example.com'),
        assignedBy: { connect: { email: 'marcus.reid@example.com' } },
        assignedAt: new Date('2026-10-15T11:00:00Z'),
        dueOn: new Date('2026-10-30'),
        note: 'Physical damage on leased trailers.',
        updatedAt: new Date('2026-10-15T11:00:00Z'),
    },
    {
        number: 'C-2026-0141',
        status: 'open',
        stage: 'gathering_documents',
        company: { create: { type: 'carrier', name: 'J. B. HUNT TRANSPORT, INC.', dot: '80806' } },
        people: people('alex.kim@example.com'),
        effectiveDate: new Date('2026-11-20'),
        updatedAt: new Date('2026-10-17T10:15:00Z'),
        progress: progress({
            lossRuns: { state: 'partial', detail: '3 of 5 years received' },
            ifta: { state: 'done', detail: 'Last 4 quarters received' },
            vehicles: { state: 'done' },
            fmcsa: { state: 'done' },
        }),
    },
    {
        number: 'C-2026-0142',
        status: 'open',
        stage: 'ready_to_submit',
        company: { create: { type: 'carrier', name: 'SCHNEIDER NATIONAL CARRIERS INC', dot: '264184' } },
        people: people('alex.kim@example.com', 'daniel.ortiz@example.com'),
        effectiveDate: new Date('2026-12-01'),
        updatedAt: new Date('2026-10-16T15:40:00Z'),
        progress: progress({
            lossRuns: { state: 'done' },
            ifta: { state: 'done' },
            drivers: { state: 'done' },
            vehicles: { state: 'done' },
            fmcsa: { state: 'done' },
            safety: { state: 'done' },
        }),
    },
    {
        number: 'C-2026-0143',
        status: 'open',
        stage: 'gathering_documents',
        company: { create: { type: 'carrier', name: 'OLD DOMINION FREIGHT LINE INC', dot: '90849' } },
        people: people('alex.kim@example.com'),
        effectiveDate: new Date('2027-01-01'),
        updatedAt: new Date('2026-10-15T09:05:00Z'),
        progress: progress({
            lossRuns: { state: 'done' },
            fmcsa: { state: 'done' },
        }),
    },
    {
        number: 'C-2026-0144',
        status: 'open',
        stage: 'gathering_documents',
        company: { create: { type: 'carrier', name: 'PATRIOT CARRIERS INC', dot: '1864030' } },
        people: people('alex.kim@example.com'),
        updatedAt: new Date('2026-10-17T12:30:00Z'),
        progress: progress({
            lossRuns: { state: 'missing', detail: 'New venture: no prior policy' },
            drivers: { state: 'partial', detail: '2 of 3 MVRs pulled' },
            fmcsa: { state: 'done' },
        }),
    },
    {
        number: 'C-2026-0145',
        status: 'open',
        stage: 'ready_to_submit',
        company: { create: { type: 'leasing', name: 'Bluefield Equipment Leasing LLC' } },
        people: people('alex.kim@example.com'),
        effectiveDate: new Date('2026-12-15'),
        updatedAt: new Date('2026-10-14T11:20:00Z'),
        progress: progress({
            lossRuns: { state: 'done' },
            equipment: { state: 'done' },
            leaseAgreement: { state: 'done' },
        }),
    },
    {
        number: 'C-2026-0138',
        status: 'closed',
        outcome: 'bound',
        marketsSubmitted: 4,
        closedOn: new Date('2026-09-28'),
        company: { create: { type: 'carrier', name: 'MARTEN TRANSPORT LTD', dot: '74432' } },
        people: people('alex.kim@example.com'),
        updatedAt: new Date('2026-09-28T16:00:00Z'),
        progress: progress({
            lossRuns: { state: 'done' },
            ifta: { state: 'done' },
            drivers: { state: 'done' },
            vehicles: { state: 'done' },
            fmcsa: { state: 'done' },
            safety: { state: 'done' },
            explanations: { state: 'done' },
        }),
    },
    {
        number: 'C-2026-0131',
        status: 'closed',
        outcome: 'declined',
        marketsSubmitted: 3,
        closedOn: new Date('2026-09-12'),
        company: { create: { type: 'leasing', name: 'Harbor Point Equipment Leasing LLC' } },
        people: people('alex.kim@example.com', 'priya.shah@example.com'),
        updatedAt: new Date('2026-09-12T10:30:00Z'),
        progress: progress({
            lossRuns: { state: 'done' },
            equipment: { state: 'done' },
            leaseAgreement: { state: 'done' },
        }),
    },
]

async function seed() {
    // The sample people share one password. It lives in .env, never in the repo.
    const password = process.env.SEED_PASSWORD
    if (!password) {
        throw new Error('Add SEED_PASSWORD to server/.env first')
    }
    const passwordHash = await hashPassword(password)

    // Empty the tables, the ones that point at others first
    await prisma.checklistProgress.deleteMany()
    await prisma.casePerson.deleteMany()
    await prisma.case.deleteMany()
    await prisma.company.deleteMany()
    await prisma.user.deleteMany()
    await prisma.caseCounter.deleteMany()

    await prisma.user.createMany({ data: USERS.map((user) => ({ ...user, passwordHash })) })
    for (const data of CASES) {
        await prisma.case.create({ data })
    }

    // The sample cases go up to C-2026-0149, so the next new case is 0150
    await prisma.caseCounter.create({ data: { year: 2026, last: 149 } })

    console.log(`Added ${USERS.length} people and ${CASES.length} cases`)
}

try {
    await seed()
} finally {
    // Always hang up, even if something failed
    await prisma.$disconnect()
}