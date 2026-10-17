import { Link } from "react-router"
import { Plus } from "lucide-react"
import './OpenCasesPage.css'

function OpenCasesPage() {
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
        </>
    )
}

export default OpenCasesPage