import { useState, type ReactNode } from "react"
import { CASES } from "../fixtures/cases"
import { CasesContext } from "./casesContext"

type CasesProviderProps = {
    children: ReactNode
}

// Holds the one list of cases for the whole app.
// For now it starts from the sample cases; later it will load them from the server.
function CasesProvider({ children }: CasesProviderProps) {
    const [cases] = useState(CASES)

    return <CasesContext value={{ cases }}>{children}</CasesContext>
}

export default CasesProvider