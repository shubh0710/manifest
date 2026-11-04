import { describe, expect, it } from "vitest"
import { initials } from "./people"

describe('initials', () => {
    it('takes the first letter of the first and last names', () => {
        expect(initials('Alex Kim')).toBe('AK')
        expect(initials('Mary Jane Watson')).toBe('MW')
    })

    it('uses one letter for a one-word name, in capitals', () => {
        expect(initials('shubh')).toBe('S')
    })

    it('ignores extra spaces, and copes with an empty name', () => {
        expect(initials('  Priya   Shah ')).toBe('PS')
        expect(initials('   ')).toBe('?')
    })
})