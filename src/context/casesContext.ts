import { createContext, useContext } from "react"
import type { Case, CaseType } from "../types/case"

// What's needed to create a case yourself
export type CaseDetails = {
    type: CaseType
    name: string
    dot?: string
}

export type CasesContextValue = {
    cases: Case[]
    startCase: (id: string) => void
    createCase: (details: CaseDetails) => string
}

// The shared box every page reads the cases from. Starts empty (null)
// until CasesProvider fills it.
export const CasesContext = createContext<CasesContextValue | null>(null)

// Any component can call useCases() to get the shared list
export function useCases(): CasesContextValue {
    const value = useContext(CasesContext)

    if (value === null) {
        throw new Error('useCases must be used inside <CasesProvider>')
    }

    return value
}