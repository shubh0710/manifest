import { afterEach, describe, expect, it, vi } from "vitest"
import { ApiError, createCase, fetchCases } from "./cases"

// Stands in for the browser's fetch, so no real server is needed
function replyWith(status: number, body: unknown) {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status })))
}

afterEach(() => {
    vi.unstubAllGlobals()
})

describe('the cases API', () => {
    it('gives back what the server sent', async () => {
        replyWith(200, [{ id: 'C-2026-0141' }])

        await expect(fetchCases()).resolves.toEqual([{ id: 'C-2026-0141' }])
    })

    it("turns a refusal into an ApiError with the server's message and case", async () => {
        replyWith(409, { error: 'This company already has a case in progress', caseId: 'C-2026-0147' })

        const error = await createCase({ type: 'carrier', name: 'WERNER', dot: '53467' }).catch((caught) => caught)

        expect(error).toBeInstanceOf(ApiError)
        expect(error).toMatchObject({
            status: 409,
            message: 'This company already has a case in progress',
            caseId: 'C-2026-0147',
        })
    })

    it("says so when the server can't be reached", async () => {
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))

        await expect(fetchCases()).rejects.toMatchObject({ status: 0 })
    })
})