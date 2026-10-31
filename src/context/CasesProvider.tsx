import { useState, type ReactNode } from "react"
import { CASES } from "../fixtures/cases"
import type { OpenCase } from "../types/case"
import { CasesContext } from "./casesContext"

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

    return <CasesContext value={{ cases, startCase }}>{children}</CasesContext>
}

export default CasesProvider