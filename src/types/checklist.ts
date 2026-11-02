// Where one checklist item stands
export type ItemState = 'done' | 'partial' | 'missing'

// One thing a top-tier submission needs
export type ChecklistItem = {
    id: string
    label: string
    hint: string
    required: boolean
}

// How far a case has got with one item, with an optional short note like "3 of 5 years received"
export type ItemProgress = {
    state: ItemState
    detail?: string
}