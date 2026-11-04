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

// Thrown when the sign-up code is missing or wrong
export class WrongSignUpCodeError extends Error {
    constructor() {
        super('That sign-up code is not right')
        this.name = 'WrongSignUpCodeError'
    }
}

// Thrown when someone signs up with an email that already has an account
export class EmailTakenError extends Error {
    constructor() {
        super('An account with this email already exists')
        this.name = 'EmailTakenError'
    }
}

// Thrown when the email or the password is wrong. One message for both,
// so nobody can find out which emails have an account.
export class WrongLogInError extends Error {
    constructor() {
        super('Wrong email or password')
        this.name = 'WrongLogInError'
    }
}