import type { Case, CaseType } from "../types/case"
import { request } from "./client"

// What's needed to start a case yourself
export type CaseDetails = {
    type: CaseType
    name: string
    dot?: string
}

// Every case you may see
export function fetchCases(): Promise<Case[]> {
    return request('/api/cases')
}

// Starts a new open case, with you on it
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