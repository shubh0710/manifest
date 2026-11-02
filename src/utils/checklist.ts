import type { CaseType } from "../types/case"
import type { ChecklistItem, ItemProgress } from "../types/checklist"

// What a top-tier submission needs, for each kind of company
export const CHECKLISTS: Record<CaseType, ChecklistItem[]> = {
    carrier: [
        { id: 'lossRuns', label: 'Loss runs', hint: 'Last 5 years, currently valued', required: true },
        { id: 'ifta', label: 'IFTA reports', hint: 'Last 4 quarters, for mileage', required: true },
        { id: 'drivers', label: 'Drivers and MVRs', hint: 'Driver list with a motor vehicle record for each', required: true },
        { id: 'vehicles', label: 'Vehicle schedule', hint: 'VINs, years and values', required: true },
        { id: 'fmcsa', label: 'FMCSA carrier data', hint: 'Authority, fleet size and safety record', required: true },
        { id: 'safety', label: 'Safety practices', hint: 'Dash cams, hiring criteria, maintenance, drug testing', required: false },
        { id: 'explanations', label: 'Explanations for flagged items', hint: 'Past claims or violations, explained by the client', required: false },
        { id: 'coverLetter', label: 'Cover letter', hint: 'A short story of the business for underwriters', required: false },
    ],
    leasing: [
        { id: 'lossRuns', label: 'Loss runs', hint: 'Last 5 years, currently valued', required: true },
        { id: 'equipment', label: 'Equipment schedule', hint: 'Every leased unit, with its value', required: true },
        { id: 'leaseAgreement', label: 'Sample lease agreement', hint: 'The contract lessees sign', required: true },
        { id: 'screening', label: 'Lessee screening', hint: 'How lessees are checked before they lease', required: false },
        { id: 'coverLetter', label: 'Cover letter', hint: 'A short story of the business for underwriters', required: false },
    ],
}

// Where a case stands on one item. Anything not recorded hasn't been received yet.
export function progressOf(progress: Record<string, ItemProgress> | undefined, id: string): ItemProgress {
    return progress?.[id] ?? { state: 'missing' }
}

export type Readiness = {
    percent: number
    itemsLeft: number
    requiredLeft: number
}

// How close a case is to a top-tier submission.
// Each item counts equally: done is a full point, partly received is half a point.
export function readiness(items: ChecklistItem[], progress?: Record<string, ItemProgress>): Readiness {
    const stateOf = (item: ChecklistItem) => progressOf(progress, item.id).state

    const done = items.filter((item) => stateOf(item) === 'done').length
    const partial = items.filter((item) => stateOf(item) === 'partial').length
    const requiredLeft = items.filter((item) => item.required && stateOf(item) !== 'done').length

    return {
        percent: Math.round(((done + partial / 2) / items.length) * 100),
        itemsLeft: items.length - done,
        requiredLeft,
    }
}