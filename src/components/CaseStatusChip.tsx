import type { Case, CaseOutcome, CaseStage } from "../types/case"

// The chip colour for each stage and outcome ('' is the plain grey chip)
const STAGE_TONE: Record<CaseStage, string> = {
    'Gathering documents': 'warn',
    'Ready to submit': 'good',
}

const OUTCOME_TONE: Record<CaseOutcome, string> = {
    Bound: 'good',
    'Quoted, not bound': '',
    'Declined by markets': 'bad',
}

type CaseStatusChipProps = {
    item: Case
}

// One chip that sums up where a case is: not started yet, its stage, or how it ended
function CaseStatusChip({ item }: CaseStatusChipProps) {
    if (item.status === 'new') {
        return <span className="chip">Not started</span>
    }

    if (item.status === 'open') {
        return <span className={`chip ${STAGE_TONE[item.stage]}`}>{item.stage}</span>
    }

    return <span className={`chip ${OUTCOME_TONE[item.outcome]}`}>{item.outcome}</span>
}

export default CaseStatusChip