import { describe, expect, it } from "vitest"
import { checkCaseDetails } from "./caseDetails.js"

describe('checkCaseDetails', () => {
    it('accepts a carrier and tidies the spaces', () => {
        expect(checkCaseDetails({ type: 'carrier', name: '  WERNER ENTERPRISES INC ', dot: ' 53467 ' })).toEqual({
            ok: true,
            details: { type: 'carrier', name: 'WERNER ENTERPRISES INC', dot: '53467' },
        })
    })

    it('accepts a leasing company and ignores any DOT sent with it', () => {
        expect(checkCaseDetails({ type: 'leasing', name: 'Summit Ridge Trailer Leasing Inc', dot: '123' })).toEqual({
            ok: true,
            details: { type: 'leasing', name: 'Summit Ridge Trailer Leasing Inc' },
        })
    })

    it('turns down a carrier without a proper USDOT number', () => {
        expect(checkCaseDetails({ type: 'carrier', name: 'WERNER', dot: '12a' })).toEqual({
            ok: false,
            error: 'Enter a USDOT number of 1 to 8 digits',
        })
        expect(checkCaseDetails({ type: 'carrier', name: 'WERNER' }).ok).toBe(false)
    })

    it('turns down a missing or blank name', () => {
        expect(checkCaseDetails({ type: 'leasing', name: '   ' }).ok).toBe(false)
        expect(checkCaseDetails({ type: 'leasing' }).ok).toBe(false)
    })

    it('turns down an unknown type', () => {
        expect(checkCaseDetails({ type: 'trucker', name: 'WERNER' })).toEqual({
            ok: false,
            error: "Choose 'carrier' or 'leasing'",
        })
    })

    it('turns down something that is not an object', () => {
        expect(checkCaseDetails(null).ok).toBe(false)
        expect(checkCaseDetails('WERNER').ok).toBe(false)
    })
})