import { Link, useParams } from "react-router"
import { useCases } from "../context/casesContext"

function CasePage() {
    const { cases } = useCases()
    const { caseId } = useParams()
    const currentCase = cases.find((item) => item.id === caseId)

    if (!currentCase) {
        return (
            <>
                <h1 className="page-title">Case not found</h1>
                <p className="page-subtitle">
                    This case doesn't exist, or the link is wrong.{' '}
                    <Link to="/cases/open">Back to open cases</Link>
                </p>
            </>
        )
    }

    return (
        <header className="page-header">
            <div>
                <h1 className="page-title">{currentCase.name}</h1>
                {currentCase.dot && <p className="page-subtitle">DOT {currentCase.dot}</p>}
            </div>
        </header>
    )
}

export default CasePage