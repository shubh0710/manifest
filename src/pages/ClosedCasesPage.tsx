import { useState } from "react"
import { CASES } from "../fixtures/cases"
import ClosedCasesTable from "../components/ClosedCasesTable"
import SearchBox from "../components/SearchBox"
import { matchesSearch } from "../utils/search"

function ClosedCasesPage() {
    const [query, setQuery] = useState('')

    const closedCases = CASES.filter((item) => item.status === 'closed')
    const shownCases = closedCases.filter((item) => matchesSearch(item, query))

    return (
        <>
            <header className="page-header">
                <div>
                    <h1 className="page-title">Closed cases</h1>
                    <p className="page-subtitle">Finished cases and how they ended.</p>
                </div>
                <SearchBox value={query} onChange={setQuery} label="Search closed cases" />
            </header>

            {shownCases.length > 0 ? (
                <ClosedCasesTable cases={shownCases} />
            ) : (
                <p className="empty-state">
                    {query ? 'No closed cases match your search.' : 'No closed cases yet.'}
                </p>
            )}
        </>
    )
}

export default ClosedCasesPage