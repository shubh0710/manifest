import { Link } from "react-router"
import type { NewCase } from "../types/case"
import { daysUntil, formatDate, formatUpdated } from "../utils/dates"
import CaseName from "./CaseName"
import "./AssignmentCard.css"

type AssignmentCardProps = {
    assignment: NewCase
}

function AssignmentCard({ assignment }: AssignmentCardProps) {
    const days = daysUntil(assignment.dueOn)
    const dueTone = days < 0 ? 'bad' : days <= 5 ? 'warn' : ''

    return (
        <article className="card assignment">
            <div className="assignment-body">
                <CaseName item={assignment} />
                {assignment.note && <p className="assignment-note">{assignment.note}</p>}
                <div className="assignment-meta">
                    <span>
                        Assigned by {assignment.assignedBy} · {formatUpdated(assignment.assignedAt)}
                    </span>
                    <span className={`chip ${dueTone}`}>
                        {days < 0 ? 'Overdue · ' : 'Due '}
                        {formatDate(assignment.dueOn)}
                    </span>
                </div>
            </div>
            <Link to="/cases/new" className="btn btn-primary">
                Start case
            </Link>
        </article>
    )
}

export default AssignmentCard