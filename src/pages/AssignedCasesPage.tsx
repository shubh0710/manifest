import { CASES } from "../fixtures/cases"
import AssignmentCard from "../components/AssignmentCard"

function AssignedCasesPage() {
    const assignedCases = CASES.filter((item) => item.status === 'new')

    return (
        <>
            <header className="page-header">
                <div>
                    <h1 className="page-title">Assigned to me</h1>
                    <p className="page-subtitle">Picked for you by your admin. Start one to open a case.</p>
                </div>
            </header>

            {assignedCases.length > 0 ? (
                assignedCases.map((item) => <AssignmentCard key={item.id} assignment={item} />)
            ) : (
                <p className="empty-state">Nothing assigned to you right now.</p>
            )}
        </>
    )
}

export default AssignedCasesPage