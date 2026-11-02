import { useEffect, useState, type ReactNode } from "react"
import * as api from "../api/cases"
import type { Case } from "../types/case"
import { CasesContext, type LoadStatus } from "./casesContext"

type CasesProviderProps = {
    children: ReactNode
}

// Holds the one list of cases for the whole app, loaded from the server
function CasesProvider({ children }: CasesProviderProps) {
    const [cases, setCases] = useState<Case[]>([])
    const [status, setStatus] = useState<LoadStatus>('loading')
    // Goes up by one each time we ask for the list again
    const [attempt, setAttempt] = useState(0)

    useEffect(() => {
        // If the page goes away (or asks again) before the answer arrives, ignore that answer
        let ignore = false

        api.fetchCases()
            .then((loaded) => {
                if (!ignore) {
                    setCases(loaded)
                    setStatus('ready')
                }
            })
            .catch(() => {
                if (!ignore) {
                    setStatus('error')
                }
            })

        return () => {
            ignore = true
        }
    }, [attempt])

    function reload() {
        setStatus('loading')
        setAttempt((current) => current + 1)
    }

    // Fetches the latest list without the "Loading…" screen. Used when the server
    // knows something this page doesn't (someone else just changed a case).
    function refreshQuietly() {
        api.fetchCases()
            .then(setCases)
            .catch(() => { })
    }

    // Asks the server to start an assigned case, then swaps in the updated case
    async function startCase(id: string) {
        try {
            const started = await api.startCase(id)
            setCases((current) => current.map((item) => (item.id === id ? started : item)))
        } catch (error) {
            if (error instanceof api.ApiError && error.status === 409) {
                refreshQuietly()
            }
            throw error
        }
    }

    // Asks the server to create a case, adds it to the top of the list, and gives back its ID
    async function createCase(details: api.CaseDetails): Promise<string> {
        try {
            const created = await api.createCase(details)
            setCases((current) => [created, ...current])
            return created.id
        } catch (error) {
            if (error instanceof api.ApiError && error.status === 409) {
                refreshQuietly()
            }
            throw error
        }
    }

    return (
        <CasesContext value={{ cases, status, reload, startCase, createCase }}>{children}</CasesContext>
    )
}

export default CasesProvider