import { Link } from "react-router"
import { Plus } from "lucide-react"
import { CASES } from "../fixtures/cases"
import OpenCasesTable from "../components/OpenCasesTable"
import './OpenCasesPage.css'

function OpenCasesPage() {
    const openCases = CASES.filter((item) => item.status === 'open')

    return (
        <>
            <header className="page-header">
                <div>
                    <h1 className="page-title">Open cases</h1>
                    <p className="page-subtitle">Cases you're working on.</p>
                </div>
                <Link to="/cases/new" className="btn btn-primary">
                    <Plus size={16} aria-hidden="true" />
                    Start new case
                </Link>
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