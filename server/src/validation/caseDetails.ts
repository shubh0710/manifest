// What's needed to start a case yourself. Carriers have a USDOT number;
// leasing companies don't.
export type CaseDetails =
    | { type: 'carrier'; name: string; dot: string }
    | { type: 'leasing'; name: string }

type CheckResult = { ok: true; details: CaseDetails } | { ok: false; error: string }

const MAX_NAME_LENGTH = 200

// Checks the details sent from the screen. Anything can arrive in a request,
// so nothing is trusted until it passes these checks.
export function checkCaseDetails(body: unknown): CheckResult {
    if (typeof body !== 'object' || body === null) {
        return { ok: false, error: 'Send the case details as JSON' }
    }
    const { type, name, dot } = body as Record<string, unknown>

    if (typeof name !== 'string' || name.trim() === '') {
        return { ok: false, error: 'Enter the company name' }
    }
    if (name.trim().length > MAX_NAME_LENGTH) {
        return { ok: false, error: `Keep the company name under ${MAX_NAME_LENGTH} characters` }
    }

    if (type === 'carrier') {
        if (typeof dot !== 'string' || !/^\d{1,8}$/.test(dot.trim())) {
            return { ok: false, error: 'Enter a USDOT number of 1 to 8 digits' }
        }
        return { ok: true, details: { type, name: name.trim(), dot: dot.trim() } }
    }
    if (type === 'leasing') {
        return { ok: true, details: { type, name: name.trim() } }
    }
    return { ok: false, error: "Choose 'carrier' or 'leasing'" }
}