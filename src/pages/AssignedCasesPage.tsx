import { useState } from "react"
import { CASES } from "../fixtures/cases"
import AssignmentCard from "../components/AssignmentCard"
import SearchBox from "../components/SearchBox"
import { matchesSearch } from "../utils/search"

function AssignedCasesPage() {
    const [query, setQuery] = useState('')

    const assignedCases = CASES.filter((item) => item.status === 'new')
    const shownCases = assignedCases.filter((item) => matchesSearch(item, query))

    return (
        <>
            <header className="page-header">
                <div>
                    <h1 className="page-title">Assigned to me</h1>
                    <p className="page-subtitle">Picked for you by your admin. Start one to open a case.</p>
                </div>
                <SearchBox value={query} onChange={setQuery} label="Search assigned cases" />
            </header>

            {shownCases.length > 0 ? (
                shownCases.map((item) => <AssignmentCard key={item.id} assignment={item} />)
            ) : (
                <p className="empty-state">
                    {query ? 'No assigned cases match your search.' : 'Nothing assigned to you right now.'}
                </p>
            )}
        </>
    )
}

export default AssignedCasesPage