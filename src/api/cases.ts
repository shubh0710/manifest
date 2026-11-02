import type { Case, CaseType } from "../types/case"

// What's needed to start a case yourself
export type CaseDetails = {
    type: CaseType
    name: string
    dot?: string
}

// A reply from the server that wasn't a success. It carries the status code,
// the server's message, and (for "already in progress") the case it's about.
export class ApiError extends Error {
    status: number
    caseId?: string

    constructor(status: number, message: string, caseId?: string) {
        super(message)
        this.name = 'ApiError'
        this.status = status
        this.caseId = caseId
    }
}

// Sends a request to the server and gives back its answer.
// Anything other than a success becomes an ApiError with the server's message.
async function request<T>(path: string, options?: RequestInit): Promise<T> {
    let response: Response
    try {
        response = await fetch(path, options)
    } catch {
        throw new ApiError(0, "Can't reach the server. Check your connection and try again.")
    }

    const body: unknown = await response.json().catch(() => null)
    if (!response.ok) {
        const problem = (body ?? {}) as { error?: string; caseId?: string }
        throw new ApiError(response.status, problem.error ?? 'Something went wrong. Please try again.', problem.caseId)
    }
    return body as T
}

// Every case
export function fetchCases(): Promise<Case[]> {
    return request('/api/cases')
}

// Starts a new open case, assigned to you
export function createCase(details: CaseDetails): Promise<Case> {
    return request('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details),
    })
}

// Turns an assigned (new) case into an open one
export function startCase(id: string): Promise<Case> {
    return request(`/api/cases/${encodeURIComponent(id)}/start`, { method: 'POST' })
}