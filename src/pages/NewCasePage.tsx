import { useState, type SubmitEvent } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { Inbox } from "lucide-react"
import { useCases } from "../context/casesContext"
import { formatDate } from "../utils/dates"
import "./NewCasePage.css"

function NewCasePage() {
    const { cases, startCase } = useCases()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [pickedId, setPickedId] = useState(searchParams.get('assigned') ?? '')

    const assignedCases = cases.filter((item) => item.status === 'new')

    // The picked case if it's still on the list, otherwise the first one
    const picked = assignedCases.find((item) => item.id === pickedId) ?? assignedCases[0]

    function handleStart(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!picked) {
            return
        }

        startCase(picked.id)
        navigate(`/cases/${picked.id}`)
    }

    return (
        <>
            <header className="page-header">
                <div>
                    <h1 className="page-title">Start a new case</h1>
                    <p className="page-subtitle">
                        Pick something your admin assigned to you, or start a case yourself. Each company can
                        have only one case in progress at a time.
                    </p>
                </div>
            </header>

            <div className="new-case-panels">
                <section className="card new-case-panel" aria-labelledby="assigned-heading">
                    <h2 id="assigned-heading" className="panel-title">
                        <Inbox size={18} aria-hidden="true" />
                        From your assigned list
                    </h2>
                    <p className="panel-subtitle">Your admin picked these for you.</p>

                    {picked ? (
                        <form onSubmit={handleStart}>
                            <div className="pick-list" role="radiogroup" aria-labelledby="assigned-heading">
                                {assignedCases.map((item) => (
                                    <label key={item.id} className="pick-option">
                                        <input
                                            type="radio"
                                            name="assigned"
                                            value={item.id}
                                            checked={item.id === picked.id}
                                            onChange={() => setPickedId(item.id)}
                                        />
                                        <span className="pick-body">
                                            <span className="pick-name">{item.name}</span>
                                            <span className="pick-meta">
                                                {item.dot ? `DOT ${item.dot}` : 'Leasing company'} · Due {formatDate(item.dueOn)}
                                            </span>
                                            {item.note && <span className="pick-note">{item.note}</span>}
                                        </span>
                                    </label>
                                ))}
                            </div>

                            <button type="submit" className="btn btn-primary">
                                Start this case
                            </button>
                        </form>
                    ) : (
                        <p className="empty-state">Nothing assigned to you right now.</p>
                    )}
                </section>
            </div>
        </>
    )
}

export default NewCasePage