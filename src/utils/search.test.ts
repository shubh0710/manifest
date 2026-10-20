import { describe, expect, it } from "vitest"
import { matchesSearch } from "./search"

describe('matchesSearch', () => {
    const carrier = { name: 'J. B. HUNT TRANSPORT, INC.', dot: '80806' }
    const leasing = { name: 'Bluefield Equipment Leasing LLC' }

    it('matches everything when the search is empty', () => {
        expect(matchesSearch(carrier, '')).toBe(true)
    })

    it('matches part of the name, ignoring capitals', () => {
        expect(matchesSearch(carrier, 'hunt')).toBe(true)
    })

    it('matches part of the DOT', () => {
        expect(matchesSearch(carrier, '8080')).toBe(true)
    })

    it('ignores spaces around the search', () => {
        expect(matchesSearch(carrier, '  hunt  ')).toBe(true)
    })

    it('does not match when nothing fits', () => {
        expect(matchesSearch(carrier, 'werner')).toBe(false)
    })

    it('handles cases with no DOT', () => {
        expect(matchesSearch(leasing, 'bluefield')).toBe(true)
        expect(matchesSearch(leasing, '123')).toBe(false)
    })
})