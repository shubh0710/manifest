import { useState, type SubmitEvent } from "react"
import { Link, useNavigate } from "react-router"
import { CircleCheck, Plus, TriangleAlert } from "lucide-react"
import { ApiError } from "../api/cases"
import { useCases } from "../context/casesContext"
import { CARRIERS } from "../fixtures/carriers"
import type { CaseType } from "../types/case"
import { findActiveCaseByDot, findActiveCaseByName, isValidDot } from "../utils/cases"
import "./SelfStartPanel.css"

type TypeOption = {
    value: CaseType
    label: string
    hint: string
}

const TYPE_OPTIONS: TypeOption[] = [
    { value: 'carrier', label: 'Motor carrier', hint: 'Has a USDOT number' },
    { value: 'leasing', label: 'Leasing company', hint: 'No USDOT number' },
]

function SelfStartPanel() {
    const { cases, createCase } = useCases()
    const navigate = useNavigate()

    const [caseType, setCaseType] = useState<CaseType>('carrier')
    const [dotInput, setDotInput] = useState('')
    const [lookedUpDot, setLookedUpDot] = useState('')
    const [leasingName, setLeasingName] = useState('')
    const [error, setError] = useState('')
    const [saving, setSaving] = useState(false)
    // A case in progress the server told us about, that this page didn't know of yet
    // (someone else at the firm may have just started one)
    const [serverCaseId, setServerCaseId] = useState('')

    // Carrier: the record found for the looked-up DOT, and any case already in progress for it
    const carrier = CARRIERS.find((item) => item.dot === lookedUpDot)
    const carrierCase = lookedUpDot ? findActiveCaseByDot(cases, lookedUpDot) : undefined

    // Leasing: any case already in progress under this name, checked as you type
    const leasingCase = leasingName.trim() ? findActiveCaseByName(cases, leasingName) : undefined

    // Clears any message from an earlier try
    function clearMessages() {
        setError('')
        setServerCaseId('')
    }

    function chooseType(next: CaseType) {
        setCaseType(next)
        clearMessages()
    }

    function handleDotChange(value: string) {
        setDotInput(value)
        // A different number needs a new lookup
        setLookedUpDot('')
        clearMessages()
    }

    function handleLookUp(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()
        const dot = dotInput.trim()

        clearMessages()
        if (!isValidDot(dot)) {
            setLookedUpDot('')
            setError('Enter a USDOT number: digits only, up to 8.')
            return
        }

        setLookedUpDot(dot)
    }

    function handleCreateLeasing(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()
        const name = leasingName.trim()

        if (name === '') {
            setError("Enter the leasing company's name.")
            return
        }

        if (leasingCase || serverCaseId) {
            return
        }

        openNewCase('leasing', name)
    }

    async function openNewCase(type: CaseType, name: string, dot?: string) {
        if (saving) {
            return
        }

        setSaving(true)
        clearMessages()
        try {
            const id = await createCase({ type, name, dot })
            navigate(`/cases/${id}`)
        } catch (caught) {
            setSaving(false)
            if (caught instanceof ApiError && caught.status === 409 && caught.caseId) {
                setServerCaseId(caught.caseId)
            } else {
                setError(caught instanceof ApiError ? caught.message : 'Something went wrong. Please try again.')
            }
        }
    }

    return (
        <section className="card new-case-panel" aria-labelledby="self-heading">
            <h2 id="self-heading" className="panel-title">
                <Plus size={18} aria-hidden="true" />
                Start a case yourself
            </h2>
            <p className="panel-subtitle">
                Look the company up and check nobody at the firm is already working on it.
            </p>

            <div className="type-switch" role="group" aria-label="What are you quoting?">
                {TYPE_OPTIONS.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        className="type-option"
                        aria-pressed={caseType === option.value}
                        onClick={() => chooseType(option.value)}
                    >
                        <span className="type-label">{option.label}</span>
                        <span className="type-hint">{option.hint}</span>
                    </button>
                ))}
            </div>

            {caseType === 'carrier' ? (
                <>
                    <form onSubmit={handleLookUp} noValidate>
                        <label htmlFor="dot-input" className="field-label">
                            USDOT number
                        </label>
                        <div className="field-row">
                            <input
                                id="dot-input"
                                className="text-input mono"
                                inputMode="numeric"
                                autoComplete="off"
                                value={dotInput}
                                onChange={(event) => handleDotChange(event.target.value)}
                                placeholder="e.g. 54283"
                            />
                            <button type="submit" className="btn btn-secondary">
                                Look up
                            </button>
                        </div>
                    </form>

                    {error && (
                        <p className="field-error" role="alert">
                            {error}
                        </p>
                    )}

                    <div aria-live="polite">
                        {lookedUpDot && !carrier && (
                            <p className="lookup-message bad">
                                <TriangleAlert size={16} aria-hidden="true" />
                                No carrier found with USDOT {lookedUpDot}. Check the number and try again.
                            </p>
                        )}

                        {carrier && (
                            <div className="lookup-result">
                                <p className="lookup-found">
                                    <CircleCheck size={16} aria-hidden="true" />
                                    Match found
                                </p>
                                <p className="lookup-name">{carrier.name}</p>
                                <p className="lookup-dot">USDOT {carrier.dot}</p>

                                {carrierCase ? (
                                    <p className="lookup-message warn">
                                        <TriangleAlert size={16} aria-hidden="true" />
                                        <span>
                                            {carrierCase.status === 'new'
                                                ? 'This carrier is already assigned and waiting to be started.'
                                                : 'This carrier already has an open case.'}{' '}
                                            <Link to={`/cases/${carrierCase.id}`}>Open that case</Link>
                                        </span>
                                    </p>
                                ) : serverCaseId ? (
                                    <JustStartedMessage caseId={serverCaseId} />
                                ) : (
                                    <>
                                        <p className="lookup-message good">
                                            <CircleCheck size={16} aria-hidden="true" />
                                            Nobody at the firm has a case in progress for this DOT.
                                        </p>
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            disabled={saving}
                                            onClick={() => openNewCase('carrier', carrier.name, carrier.dot)}
                                        >
                                            {saving ? 'Creating…' : 'Create case and assign to me'}
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <form onSubmit={handleCreateLeasing} noValidate>
                    <label htmlFor="leasing-name" className="field-label">
                        Company name
                    </label>
                    <input
                        id="leasing-name"
                        className="text-input"
                        autoComplete="off"
                        value={leasingName}
                        onChange={(event) => {
                            setLeasingName(event.target.value)
                            clearMessages()
                        }}
                        placeholder="e.g. Granite Peak Trailer Leasing LLC"
                    />

                    {error && (
                        <p className="field-error" role="alert">
                            {error}
                        </p>
                    )}

                    {leasingCase && (
                        <p className="lookup-message warn" role="alert">
                            <TriangleAlert size={16} aria-hidden="true" />
                            <span>
                                This company already has a case in progress.{' '}
                                <Link to={`/cases/${leasingCase.id}`}>Open that case</Link>
                            </span>
                        </p>
                    )}

                    {!leasingCase && serverCaseId && <JustStartedMessage caseId={serverCaseId} />}

                    <button
                        type="submit"
                        className="btn btn-primary form-submit"
                        disabled={Boolean(leasingCase || serverCaseId) || saving}
                    >
                        {saving ? 'Creating…' : 'Create case and assign to me'}
                    </button>
                </form>
            )}
        </section>
    )
}

type JustStartedMessageProps = {
    caseId: string
}

// Shown when the server turns a new case down because someone else at the firm
// started one for this company a moment ago
function JustStartedMessage({ caseId }: JustStartedMessageProps) {
    return (
        <p className="lookup-message warn" role="alert">
            <TriangleAlert size={16} aria-hidden="true" />
            <span>
                Someone at the firm has just started a case for this company.{' '}
                <Link to={`/cases/${caseId}`}>Open that case</Link>
            </span>
        </p>
    )
}

export default SelfStartPanel