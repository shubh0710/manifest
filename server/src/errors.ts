// Thrown when a company already has a case in progress (new or open).
// It carries that case's number, so the screen can link to it.
export class ActiveCaseError extends Error {
    caseId: string

    constructor(caseId: string) {
        super('This company already has a case in progress')
        this.name = 'ActiveCaseError'
        this.caseId = caseId
    }
}