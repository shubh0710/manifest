export type CaseType = 'carrier' | 'leasing'
export type CaseStatus = 'open' | 'closed'
export type CaseStage = 'Gathering documents' | 'Ready to submit'

export type Case = {
    id: string
    type: CaseType
    status: CaseStatus
    stage: CaseStage
    name: string
    dot?: string
    effectiveDate?: string
    updatedAt: string
}