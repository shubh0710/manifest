import { useState, type ReactNode } from "react"
import { CASES } from "../fixtures/cases"
import type { OpenCase } from "../types/case"
import { nextCaseId } from "../utils/cases"
import { CasesContext, type CaseDetails } from "./casesContext"

// Stands in for the logged-in employee until log-in exists
const CURRENT_USER = 'Alex Kim'

type CasesProviderProps = {
    children: ReactNode
}

// Holds the one list of cases for the whole app.
// For now it starts from the sample cases; later it will load them from the server.
function CasesProvider({ children }: CasesProviderProps) {
    const [cases, setCases] = useState(CASES)

    // Turns an assigned (new) case into an open one. It keeps its ID, company and people.
    function startCase(id: string) {
        setCases((current) =>
            current.map((item) => {
                if (item.id !== id || item.status !== 'new') {
                    return item
                }

                const started: OpenCase = {
                    id: item.id,
                    type: item.type,
                    name: item.name,
                    dot: item.dot,
                    assignees: item.assignees,
                    status: 'open',
                    stage: 'Gathering documents',
                    updatedAt: new Date().toISOString(),
                }

                return started
            }),
        )
    }

    // Creates a brand-new open case, assigned to you, and gives back its ID
    function createCase(details: CaseDetails): string {
        const created: OpenCase = {
            id: nextCaseId(cases),
            type: details.type,
            name: details.name,
            dot: details.dot,
            assignees: [CURRENT_USER],
            status: 'open',
            stage: 'Gathering documents',
            updatedAt: new Date().toISOString(),
        }

        setCases((current) => [created, ...current])
        return created.id
    }

    return <CasesContext value={{ cases, startCase, createCase }}>{children}</CasesContext>
}

export default CasesProvider