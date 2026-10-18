import { CASES } from "../fixtures/cases"
import ClosedCasesTable from "../components/ClosedCasesTable"

function ClosedCasesPage() {
    const closedCases = CASES.filter((item) => item.status === 'closed')

    return (
        <>
            <header className="page-header">
                <div>
                    <h1 className="page-title">Closed cases</h1>
                    <p className="page-subtitle">Finished cases, kept for reference.</p>
                </div>
            </header>

            {closedCases.length > 0 ? (
                <ClosedCasesTable cases={closedCases} />
            ) : (
                <p className="empty-state">No closed cases yet.</p>
            )}
        </>
    )
}

export default ClosedCasesPage