import { describe, expect, it } from "vitest"
import { toApiCase, type CaseRow } from "./casesService.js"

// A plain open carrier case, as the database would return it.
// Each test changes only what it's about.
function makeRow(changes: Partial<CaseRow> = {}): CaseRow {
    return {
        id: 1,
        number: 'C-2026-0141',
        companyId: 1,
        status: 'open',
        assignedById: null,
        assignedAt: null,
        dueOn: null,
        note: null,
        stage: 'gathering_documents',
        effectiveDate: new Date('2026-11-20'),
        outcome: null,
        marketsSubmitted: null,
        closedOn: null,
        createdAt: new Date('2026-10-01T09:00:00Z'),
        updatedAt: new Date('2026-10-17T10:15:00Z'),
        company: {
            id: 1,
            type: 'carrier',
            name: 'J. B. HUNT TRANSPORT, INC.',
            dot: '80806',
            createdAt: new Date('2026-10-01T09:00:00Z'),
        },
        assignedBy: null,
        people: [
            {
                caseId: 1,
                userId: 1,
                addedAt: new Date('2026-10-01T09:00:00Z'),
                user: { id: 1, name: 'Alex Kim', email: 'alex.kim@example.com', createdAt: new Date() },
            },
        ],
        progress: [
            { caseId: 1, itemId: 'lossRuns', state: 'partial', detail: '3 of 5 years received', updatedAt: new Date() },
            { caseId: 1, itemId: 'fmcsa', state: 'done', detail: null, updatedAt: new Date() },
        ],
        ...changes,
    }
}

describe('toApiCase', () => {
    it('turns an open case into the shape the screens use', () => {
        expect(toApiCase(makeRow())).toEqual({
            id: 'C-2026-0141',
            type: 'carrier',
            name: 'J. B. HUNT TRANSPORT, INC.',
            dot: '80806',
            assignees: ['Alex Kim'],
            updatedAt: '2026-10-17T10:15:00.000Z',
            progress: {
                lossRuns: { state: 'partial', detail: '3 of 5 years received' },
                fmcsa: { state: 'done' },
            },
            status: 'open',
            stage: 'Gathering documents',
            effectiveDate: '2026-11-20',
        })
    })

    it('gives a new case its admin, due date and note', () => {
        const row = makeRow({
            status: 'new',
            stage: null,
            effectiveDate: null,
            assignedById: 4,
            assignedBy: { id: 4, name: 'Laura Chen', email: 'laura.chen@example.com', createdAt: new Date() },
            assignedAt: new Date('2026-10-18T09:30:00Z'),
            dueOn: new Date('2026-10-24'),
            note: 'Renewal in December.',
            progress: [],
        })

        expect(toApiCase(row)).toMatchObject({
            status: 'new',
            assignedBy: 'Laura Chen',
            assignedAt: '2026-10-18T09:30:00.000Z',
            dueOn: '2026-10-24',
            note: 'Renewal in December.',
            progress: undefined,
        })
    })

    it('shows a closed case with its outcome label', () => {
        const row = makeRow({
            status: 'closed',
            stage: null,
            outcome: 'quoted_not_bound',
            marketsSubmitted: 4,
            closedOn: new Date('2026-09-28'),
        })

        expect(toApiCase(row)).toMatchObject({
            status: 'closed',
            outcome: 'Quoted, not bound',
            marketsSubmitted: 4,
            closedOn: '2026-09-28',
        })
    })

    it('stops when a case is missing something its stage needs', () => {
        const row = makeRow({ stage: null })

        expect(() => toApiCase(row)).toThrow('Case C-2026-0141 is missing stage')
    })
})