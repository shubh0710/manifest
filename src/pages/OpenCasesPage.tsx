import { CASES } from "../fixtures/cases"
import OpenCasesTable from "../components/OpenCasesTable"

function OpenCasesPage() {
    const openCases = CASES.filter((item) => item.status === 'open')

    return (
        <>
            <header className="page-header">
                <div>
                    <h1 className="page-title">Open cases</h1>
                    <p className="page-subtitle">Cases you're working on.</p>
                </div>
            </header>

            {openCases.length > 0 ? (
                <OpenCasesTable cases={openCases} />
            ) : (
                <p className="empty-state">No open cases right now.</p>
            )}
        </>
    )
}

export default OpenCasesPage