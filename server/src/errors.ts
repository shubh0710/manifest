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


// Thrown when no case has this number
export class CaseNotFoundError extends Error {
    caseId: string

    constructor(caseId: string) {
        super('There is no case with this number')
        this.name = 'CaseNotFoundError'
        this.caseId = caseId
    }
}

// Thrown when starting a case that isn't new any more (already open or closed)
export class CaseAlreadyStartedError extends Error {
    caseId: string

    constructor(caseId: string) {
        super('This case has already been started')
        this.name = 'CaseAlreadyStartedError'
        this.caseId = caseId
    }
}