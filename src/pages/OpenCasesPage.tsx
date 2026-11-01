import { useState } from "react"
import { useCases } from "../context/casesContext"
import OpenCasesTable from "../components/OpenCasesTable"
import SearchBox from "../components/SearchBox"
import { matchesSearch } from "../utils/search"

function OpenCasesPage() {
    const { cases } = useCases()
    const [query, setQuery] = useState('')

    const openCases = cases.filter((item) => item.status === 'open')
    const shownCases = openCases.filter((item) => matchesSearch(item, query))

    return (
        <>
            <header className="page-header">
                <div>
                    <h1 className="page-title">Open cases</h1>
                    <p className="page-subtitle">Cases you're working on.</p>
                </div>
                <SearchBox value={query} onChange={setQuery} label="Search open cases" />
            </header>

            {shownCases.length > 0 ? (
                <OpenCasesTable cases={shownCases} />
            ) : (
                <p className="empty-state">
                    {query ? 'No open cases match your search.' : 'No open cases right now.'}
                </p>
            )}
        </>
    )
}

export default OpenCasesPage