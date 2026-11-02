import { describe, expect, it } from "vitest"
import type { ChecklistItem } from "../types/checklist"
import { CHECKLISTS, progressOf, readiness } from "./checklist"

// A tiny made-up checklist: two required items, two extras
const ITEMS: ChecklistItem[] = [
    { id: 'a', label: 'A', hint: '', required: true },
    { id: 'b', label: 'B', hint: '', required: true },
    { id: 'c', label: 'C', hint: '', required: false },
    { id: 'd', label: 'D', hint: '', required: false },
]

describe('progressOf', () => {
    it('treats anything not recorded as missing', () => {
        expect(progressOf(undefined, 'a').state).toBe('missing')
        expect(progressOf({ b: { state: 'done' } }, 'a').state).toBe('missing')
    })

    it('returns what was recorded', () => {
        expect(progressOf({ a: { state: 'partial', detail: '3 of 5' } }, 'a')).toEqual({
            state: 'partial',
            detail: '3 of 5',
        })
    })
})

describe('readiness', () => {
    it('is 0% when nothing has been received', () => {
        expect(readiness(ITEMS)).toEqual({ percent: 0, itemsLeft: 4, requiredLeft: 2 })
    })

    it('is 100% when everything is done', () => {
        const progress = {
            a: { state: 'done' as const },
            b: { state: 'done' as const },
            c: { state: 'done' as const },
            d: { state: 'done' as const },
        }
        expect(readiness(ITEMS, progress)).toEqual({ percent: 100, itemsLeft: 0, requiredLeft: 0 })
    })

    it('counts a partly received item as half', () => {
        const progress = { a: { state: 'done' as const }, b: { state: 'partial' as const } }
        // (1 + 0.5) out of 4 items = 37.5%, rounded to 38
        expect(readiness(ITEMS, progress)).toEqual({ percent: 38, itemsLeft: 3, requiredLeft: 1 })
    })

    it('only counts required items in requiredLeft', () => {
        const progress = { a: { state: 'done' as const }, b: { state: 'done' as const } }
        expect(readiness(ITEMS, progress).requiredLeft).toBe(0)
    })
})

describe('the checklists', () => {
    it('has no repeated item IDs in a checklist', () => {
        for (const items of Object.values(CHECKLISTS)) {
            const ids = items.map((item) => item.id)
            expect(new Set(ids).size).toBe(ids.length)
        }
    })
})