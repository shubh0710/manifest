import { afterEach, describe, expect, it, vi } from "vitest"
import { fetchMe, logIn, logOut, signUp } from "./auth"

const USER = { id: 7, name: 'Shubh', email: 'shubh@example.com' }

// Stands in for the browser's fetch, so no real server is needed
function replyWith(status: number, body: unknown) {
    const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status }))
    vi.stubGlobal('fetch', fetch)
    return fetch
}

afterEach(() => {
    vi.unstubAllGlobals()
})

describe('fetchMe', () => {
    it('gives back the person who is logged in', async () => {
        replyWith(200, USER)

        await expect(fetchMe()).resolves.toEqual(USER)
    })

    it('gives back null when nobody is logged in', async () => {
        replyWith(401, { error: 'Log in to continue' })

        await expect(fetchMe()).resolves.toBeNull()
    })

    it('still fails for any other problem', async () => {
        replyWith(500, { error: 'Something went wrong on the server' })

        await expect(fetchMe()).rejects.toMatchObject({ status: 500 })
    })
})

describe('logIn', () => {
    it('sends the email and password as JSON', async () => {
        const fetch = replyWith(200, USER)

        await expect(logIn('shubh@example.com', 'correct horse battery')).resolves.toEqual(USER)
        expect(fetch).toHaveBeenCalledWith('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'shubh@example.com', password: 'correct horse battery' }),
        })
    })

    it("passes on the server's message for a wrong password", async () => {
        replyWith(401, { error: 'Wrong email or password' })

        await expect(logIn('shubh@example.com', 'wrong')).rejects.toMatchObject({
            status: 401,
            message: 'Wrong email or password',
        })
    })
})

describe('signUp', () => {
    const details = { name: 'Shubh', email: 'shubh@example.com', password: 'correct horse battery', code: 'let-me-in' }

    it('sends the details as JSON and gives back the new person', async () => {
        const fetch = replyWith(201, USER)

        await expect(signUp(details)).resolves.toEqual(USER)
        expect(fetch).toHaveBeenCalledWith('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(details),
        })
    })

    it("passes on the server's message for a wrong code", async () => {
        replyWith(403, { error: 'That sign-up code is not right' })

        await expect(signUp(details)).rejects.toMatchObject({
            status: 403,
            message: 'That sign-up code is not right',
        })
    })
})

describe('logOut', () => {
    it('asks the server to end the session', async () => {
        // Log out answers 204: done, with no body at all
        const fetch = vi.fn().mockResolvedValue(new Response(null, { status: 204 }))
        vi.stubGlobal('fetch', fetch)

        await expect(logOut()).resolves.toBeUndefined()
        expect(fetch).toHaveBeenCalledWith('/api/auth/logout', { method: 'POST' })
    })
})