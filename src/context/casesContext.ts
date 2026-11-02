import { createContext, useContext } from "react"
import type { CaseDetails } from "../api/cases"
import type { Case } from "../types/case"

// Where the list stands: still coming from the server, ready, or failed to load
export type LoadStatus = 'loading' | 'ready' | 'error'

export type CasesContextValue = {
    cases: Case[]
    status: LoadStatus
    reload: () => void
    startCase: (id: string) => Promise<void>
    createCase: (details: CaseDetails) => Promise<string>
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