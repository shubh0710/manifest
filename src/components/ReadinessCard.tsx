import { CircleCheck, CircleDashed, TriangleAlert, type LucideIcon } from "lucide-react"
import type { Case } from "../types/case"
import type { ChecklistItem, ItemState } from "../types/checklist"
import { CHECKLISTS, progressOf, readiness } from "../utils/checklist"
import "./ReadinessCard.css"

// How each state looks: the icon, the chip's words and the chip's colour
const STATE_DISPLAY: Record<ItemState, { icon: LucideIcon; label: string; tone: string }> = {
    done: { icon: CircleCheck, label: 'Received', tone: 'good' },
    partial: { icon: TriangleAlert, label: 'Partly received', tone: 'warn' },
    missing: { icon: CircleDashed, label: 'Missing', tone: '' },
}

// "1 item", "3 items"
function count(amount: number, word: string): string {
    return `${amount} ${word}${amount === 1 ? '' : 's'}`
}

type ReadinessCardProps = {
    item: Case
}

function ReadinessCard({ item }: ReadinessCardProps) {
    const checklist = CHECKLISTS[item.type]
    const { percent, itemsLeft, requiredLeft } = readiness(checklist, item.progress)

    const groups = [
        { title: 'Required to submit', items: checklist.filter((entry) => entry.required) },
        { title: 'Makes the quote stronger', items: checklist.filter((entry) => !entry.required) },
    ]

    let summary = 'Everything is in. This is a top-tier submission.'

    if (requiredLeft > 0) {
        summary = `${count(itemsLeft, 'item')} left for a top-tier submission. ${requiredLeft} of them must be done before you can submit.`
    } else if (itemsLeft > 0) {
        summary = `Ready to submit. ${count(itemsLeft, 'more item')} would make the quote stronger.`
    }

    return (
        <section className="card readiness" aria-labelledby="readiness-heading">
            <div className="readiness-top">
                <div>
                    <h2 id="readiness-heading" className="readiness-title">
                        Submission readiness
                    </h2>
                    <p className="readiness-summary">{summary}</p>
                </div>

                <div className="readiness-score">
                    <span className="readiness-percent">{percent}%</span>
                    <div
                        className="meter"
                        role="progressbar"
                        aria-label="Submission readiness"
                        aria-valuenow={percent}
                        aria-valuemin={0}
                        aria-valuemax={100}
                    >
                        <div className="meter-fill" style={{ width: `${percent}%` }} />
                    </div>
                </div>
            </div>

            {groups.map((group) => (
                <div key={group.title}>
                    <h3 className="check-group">{group.title}</h3>
                    <ul className="check-list">
                        {group.items.map((entry) => (
                            <ChecklistRow key={entry.id} entry={entry} item={item} />
                        ))}
                    </ul>
                </div>
            ))}
        </section>
    )
}

type ChecklistRowProps = {
    entry: ChecklistItem
    item: Case
}

// One line of the checklist: icon, name, a short note, and a chip saying where it stands
function ChecklistRow({ entry, item }: ChecklistRowProps) {
    const progress = progressOf(item.progress, entry.id)
    const display = STATE_DISPLAY[progress.state]
    const Icon = display.icon

    return (
        <li className="check-row">
            <Icon size={18} className={`check-icon ${progress.state}`} aria-hidden="true" />
            <div className="check-body">
                <p className="check-label">{entry.label}</p>
                <p className="check-detail">{progress.detail ?? entry.hint}</p>
            </div>
            <span className={`chip ${display.tone}`}>{display.label}</span>
        </li>
    )
}

export default ReadinessCard