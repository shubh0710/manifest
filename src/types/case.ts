export type CaseType = 'carrier' | 'leasing'
export type CaseStage = 'Gathering documents' | 'Ready to submit'
export type CaseOutcome = 'Bound' | 'Quoted, not bound' | 'Declined by markets'

type BaseCase = {
    id: string
    type: CaseType
    name: string
    dot?: string
    updatedAt: string
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

export type Case = OpenCase | ClosedCase