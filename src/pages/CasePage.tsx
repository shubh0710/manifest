import { Link, useParams } from "react-router"
import CaseStatusChip from "../components/CaseStatusChip"
import { useCases } from "../context/casesContext"
import type { Case } from "../types/case"
import { formatDate, formatEffectiveDate, formatUpdated } from "../utils/dates"
import "./CasePage.css"

// The list each case lives on, for the link back
const LIST_LINK: Record<Case['status'], { label: string; path: string }> = {
    new: { label: 'Assigned to me', path: '/cases/assigned' },
    open: { label: 'Open cases', path: '/cases/open' },
    closed: { label: 'Closed cases', path: '/cases/closed' },
}

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

    const list = LIST_LINK[currentCase.status]

    return (
        <>
            <nav className="breadcrumb" aria-label="Breadcrumb">
                <Link to={list.path}>{list.label}</Link>
                <span aria-hidden="true">/</span>
                <span aria-current="page">{currentCase.name}</span>
            </nav>

            <header className="page-header">
                <div>
                    <h1 className="page-title">{currentCase.name}</h1>
                    <p className="case-meta">
                        {currentCase.dot && `USDOT ${currentCase.dot} · `}
                        {currentCase.type === 'carrier' ? 'Motor carrier' : 'Leasing company'}
                    </p>

                    <div className="case-chips">
                        <CaseStatusChip item={currentCase} />
                        <span className="chip">Assigned to {currentCase.assignees.join(', ')}</span>

                        {currentCase.status === 'new' && (
                            <span className="chip">Due {formatDate(currentCase.dueOn)}</span>
                        )}

                        {currentCase.status === 'open' && (
                            <span className="chip">Effective {formatEffectiveDate(currentCase.effectiveDate)}</span>
                        )}

                        {currentCase.status === 'closed' && (
                            <>
                                <span className="chip">Closed {formatDate(currentCase.closedOn)}</span>
                                <span className="chip">{currentCase.marketsSubmitted} markets</span>
                            </>
                        )}

                        <span className="chip">Updated {formatUpdated(currentCase.updatedAt)}</span>
                    </div>
                </div>
            </header>

            {currentCase.status === 'new' && (
                <section className="card start-banner" aria-labelledby="start-heading">
                    <div className="start-body">
                        <h2 id="start-heading" className="start-title">
                            Not started yet
                        </h2>
                        <p className="start-meta">
                            Assigned by {currentCase.assignedBy} · {formatUpdated(currentCase.assignedAt)}
                        </p>
                        {currentCase.note && <p className="start-note">{currentCase.note}</p>}
                    </div>
                    <Link to={`/cases/new?assigned=${currentCase.id}`} className="btn btn-primary">
                        Start this case
                    </Link>
                </section>
            )}
        </>
    )
}

export default CasePage