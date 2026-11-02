// The shape of a case as the API sends it to the screens.
// It must match src/types/case.ts in the front end.

export type CaseType = 'carrier' | 'leasing'
export type CaseStage = 'Gathering documents' | 'Ready to submit'
export type CaseOutcome = 'Bound' | 'Quoted, not bound' | 'Declined by markets'
export type ItemState = 'done' | 'partial' | 'missing'

export type ItemProgress = {
    state: ItemState
    detail?: string
}

type BaseCase = {
    id: string
    type: CaseType
    name: string
    dot?: string
    assignees: string[]
    updatedAt: string
    progress?: Record<string, ItemProgress>
}

export type NewCase = BaseCase & {
    status: 'new'
    assignedBy: string
    assignedAt: string
    dueOn: string
    note?: string
}

export type OpenCase = BaseCase & {
    status: 'open'
    stage: CaseStage
    effectiveDate?: string
}

export type ClosedCase = BaseCase & {
    status: 'closed'
    outcome: CaseOutcome
    marketsSubmitted: number
    closedOn: string
}

export type Case = NewCase | OpenCase | ClosedCase