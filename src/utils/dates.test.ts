import { describe, expect, it } from "vitest"
import { formatDate, formatEffectiveDate, formatUpdated } from "./dates"

describe('formatDate', () => {
    it('shows a date as month, day and year', () => {
        expect(formatDate('2026-11-20')).toBe('Nov 20, 2026')
    })
})

describe('formatEffectiveDate', () => {
    it('formats a date when there is one', () => {
        expect(formatEffectiveDate('2027-01-01')).toBe('Jan 1, 2027')
    })

    it('shows ASAP when there is no date', () => {
        expect(formatEffectiveDate(undefined)).toBe('ASAP')
    })
})

describe('formatUpdated', () => {
    const now = new Date('2026-10-18T12:00:00Z')

    it('shows "Just now" for under a minute', () => {
        expect(formatUpdated('2026-10-18T11:59:40Z', now)).toBe('Just now')
    })

    it('shows minutes for under an hour', () => {
        expect(formatUpdated('2026-10-18T11:45:00Z', now)).toBe('15 min ago')
    })

    it('says "1 hour" without an s', () => {
        expect(formatUpdated('2026-10-18T11:00:00Z', now)).toBe('1 hour ago')
    })

    it('shows hours for under a day', () => {
        expect(formatUpdated('2026-10-18T07:00:00Z', now)).toBe('5 hours ago')
    })

    it('shows "Yesterday" for the day before', () => {
        expect(formatUpdated('2026-10-17T11:00:00Z', now)).toBe('Yesterday')
    })

    it('shows the date for anything older', () => {
        expect(formatUpdated('2026-10-10T12:00:00Z', now)).toBe('Oct 10, 2026')
    })
})