import { describe, expect, it } from "vitest"
import type { Case } from "../types/case"
import { findActiveCaseByDot, findActiveCaseByName, isValidDot } from "./cases"

// Small made-up cases with only the fields these helpers look at
const SAMPLE: Pick<Case, 'id' | 'name' | 'status' | 'dot'>[] = [
    { id: 'C-2026-0141', name: 'J. B. HUNT TRANSPORT, INC.', status: 'open', dot: '80806' },
    { id: 'C-2026-0147', name: 'WERNER ENTERPRISES INC', status: 'new', dot: '53467' },
    { id: 'C-2026-0138', name: 'MARTEN TRANSPORT LTD', status: 'closed', dot: '74432' },
    { id: 'C-2026-0145', name: 'Bluefield Equipment Leasing LLC', status: 'open' },
    { id: 'C-2026-0131', name: 'Harbor Point Equipment Leasing LLC', status: 'closed' },
]

describe('isValidDot', () => {
    it('accepts digits only', () => {
        expect(isValidDot('80806')).toBe(true)
    })

    it('rejects empty, letters, spaces and too many digits', () => {
        expect(isValidDot('')).toBe(false)
        expect(isValidDot('80a06')).toBe(false)
        expect(isValidDot(' 80806')).toBe(false)
        expect(isValidDot('123456789')).toBe(false)
    })
})

describe('findActiveCaseByDot', () => {
    it('finds an open case', () => {
        expect(findActiveCaseByDot(SAMPLE, '80806')?.id).toBe('C-2026-0141')
    })

    it('finds a new (assigned) case', () => {
        expect(findActiveCaseByDot(SAMPLE, '53467')?.id).toBe('C-2026-0147')
    })

    it('ignores closed cases', () => {
        expect(findActiveCaseByDot(SAMPLE, '74432')).toBeUndefined()
    })

    it('finds nothing for an unknown DOT', () => {
        expect(findActiveCaseByDot(SAMPLE, '99999')).toBeUndefined()
    })
})

describe('findActiveCaseByName', () => {
    it('matches ignoring capitals and spaces around', () => {
        expect(findActiveCaseByName(SAMPLE, '  bluefield equipment leasing llc ')?.id).toBe('C-2026-0145')
    })

    it('ignores closed cases', () => {
        expect(findActiveCaseByName(SAMPLE, 'Harbor Point Equipment Leasing LLC')).toBeUndefined()
    })
})