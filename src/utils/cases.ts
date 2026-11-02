import type { Case } from "../types/case"

// A USDOT number is digits only, and at most 8 digits long
export function isValidDot(value: string): boolean {
    return /^\d{1,8}$/.test(value)
}

// A company can have only one case in progress at a time:
// new (assigned, not started yet) or open (being worked on)
function isActive(item: { status: Case['status'] }): boolean {
    return item.status === 'new' || item.status === 'open'
}

// The case already in progress for this DOT, if there is one
export function findActiveCaseByDot<T extends { status: Case['status']; dot?: string }>(
    cases: T[],
    dot: string,
): T | undefined {
    return cases.find((item) => isActive(item) && item.dot === dot)
}

// Leasing companies have no DOT, so they're matched by name instead,
// ignoring capitals and spaces at the start or end
export function findActiveCaseByName<T extends { status: Case['status']; name: string }>(
    cases: T[],
    name: string,
): T | undefined {
    const wanted = name.trim().toLowerCase()
    return cases.find((item) => isActive(item) && item.name.toLowerCase() === wanted)
}