import jwt from "jsonwebtoken"
import request from "supertest"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { createApp } from "../app.js"
import { EmailTakenError, WrongLogInError, WrongSignUpCodeError } from "../errors.js"
import { findUser, logIn, signUp } from "../services/authService.js"

// Swap the service for a stand-in, so these tests never touch the database
vi.mock('../services/authService.js', () => ({
    signUp: vi.fn(),
    logIn: vi.fn(),
    findUser: vi.fn(),
}))

const USER = { id: 7, name: 'Shubh', email: 'shubh@example.com' }
const TEST_SECRET = 'a-secret-for-tests-only'

beforeEach(() => {
    vi.stubEnv('JWT_SECRET', TEST_SECRET)
})

afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
})

// The session cookie the server sent back, if any
function sessionCookie(response: request.Response) {
    const cookies = ([] as string[]).concat(response.headers['set-cookie'] ?? [])
    return cookies.find((cookie) => cookie.startsWith('manifest_session='))
}

describe('POST /api/auth/signup', () => {
    const details = { name: 'Shubh', email: 'shubh@example.com', password: 'correct horse battery', code: 'let-me-in' }

    it('makes the account and logs the person in with a safe cookie', async () => {
        vi.mocked(signUp).mockResolvedValue(USER)

        const response = await request(createApp()).post('/api/auth/signup').send(details)

        expect(response.status).toBe(201)
        expect(response.body).toEqual(USER)

        const cookie = sessionCookie(response)
        expect(cookie).toContain('HttpOnly')
        expect(cookie).toContain('SameSite=Lax')
        expect(cookie).toContain('Max-Age=604800')

        // The cookie holds a token signed with our secret, carrying the person's id
        const token = cookie!.split(';')[0].replace('manifest_session=', '')
        expect(jwt.verify(token, TEST_SECRET)).toMatchObject({ userId: 7 })
    })

    it('answers 400 for bad details, without calling the service', async () => {
        const response = await request(createApp()).post('/api/auth/signup').send({ ...details, password: 'short' })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({ error: 'Use a password of 8 to 72 characters' })
        expect(signUp).not.toHaveBeenCalled()
    })

    it('answers 403 for a wrong sign-up code', async () => {
        vi.mocked(signUp).mockRejectedValue(new WrongSignUpCodeError())

        const response = await request(createApp()).post('/api/auth/signup').send(details)

        expect(response.status).toBe(403)
        expect(response.body).toEqual({ error: 'That sign-up code is not right' })
        expect(sessionCookie(response)).toBeUndefined()
    })

    it('answers 409 when the email already has an account', async () => {
        vi.mocked(signUp).mockRejectedValue(new EmailTakenError())

        const response = await request(createApp()).post('/api/auth/signup').send(details)

        expect(response.status).toBe(409)
        expect(response.body).toEqual({ error: 'An account with this email already exists' })
    })
})

describe('POST /api/auth/login', () => {
    const details = { email: 'shubh@example.com', password: 'correct horse battery' }

    it('logs the person in', async () => {
        vi.mocked(logIn).mockResolvedValue(USER)

        const response = await request(createApp()).post('/api/auth/login').send(details)

        expect(response.status).toBe(200)
        expect(response.body).toEqual(USER)
        expect(sessionCookie(response)).toBeDefined()
    })

    it('answers 401 with one message for a wrong email or password', async () => {
        vi.mocked(logIn).mockRejectedValue(new WrongLogInError())

        const response = await request(createApp()).post('/api/auth/login').send(details)

        expect(response.status).toBe(401)
        expect(response.body).toEqual({ error: 'Wrong email or password' })
        expect(sessionCookie(response)).toBeUndefined()
    })

    it('answers 500 when the secret is missing, instead of making an unsafe token', async () => {
        vi.mocked(logIn).mockResolvedValue(USER)
        vi.stubEnv('JWT_SECRET', '')
        // Keep the expected error out of the test output
        vi.spyOn(console, 'error').mockImplementation(() => { })

        const response = await request(createApp()).post('/api/auth/login').send(details)

        expect(response.status).toBe(500)
        expect(sessionCookie(response)).toBeUndefined()
    })
})

describe('GET /api/auth/me', () => {
    // A cookie header carrying a token, as the browser would send it
    function cookieWith(token: string) {
        return `manifest_session=${token}`
    }

    it('says who is logged in', async () => {
        vi.mocked(findUser).mockResolvedValue(USER)
        const token = jwt.sign({ userId: 7 }, TEST_SECRET)

        const response = await request(createApp()).get('/api/auth/me').set('Cookie', cookieWith(token))

        expect(response.status).toBe(200)
        expect(response.body).toEqual(USER)
        expect(findUser).toHaveBeenCalledWith(7)
    })

    it('answers 401 when there is no cookie', async () => {
        const response = await request(createApp()).get('/api/auth/me')

        expect(response.status).toBe(401)
        expect(response.body).toEqual({ error: 'Log in to continue' })
        expect(findUser).not.toHaveBeenCalled()
    })

    it('answers 401 for a fake, changed or expired token', async () => {
        const fake = jwt.sign({ userId: 7 }, 'someone-elses-secret')
        // A real token with its contents swapped for "I'm person 8"
        const [header, , signature] = jwt.sign({ userId: 7 }, TEST_SECRET).split('.')
        const changed = [header, Buffer.from('{"userId":8}').toString('base64url'), signature].join('.')
        const expired = jwt.sign({ userId: 7, exp: Math.floor(Date.now() / 1000) - 60 }, TEST_SECRET)

        for (const token of [fake, changed, expired, 'not-a-token']) {
            const response = await request(createApp()).get('/api/auth/me').set('Cookie', cookieWith(token))
            expect(response.status).toBe(401)
        }
        expect(findUser).not.toHaveBeenCalled()
    })

    it('logs out someone whose account no longer exists', async () => {
        vi.mocked(findUser).mockResolvedValue(null)
        const token = jwt.sign({ userId: 7 }, TEST_SECRET)

        const response = await request(createApp()).get('/api/auth/me').set('Cookie', cookieWith(token))

        expect(response.status).toBe(401)
        expect(response.body).toEqual({ error: 'Your session has ended. Log in again' })
        expect(sessionCookie(response)).toContain('Expires=Thu, 01 Jan 1970')
    })
})

describe('POST /api/auth/logout', () => {
    it('tells the browser to delete the cookie', async () => {
        const response = await request(createApp()).post('/api/auth/logout')

        expect(response.status).toBe(204)
        // A cookie that expired in 1970 is deleted by the browser straight away
        expect(sessionCookie(response)).toContain('Expires=Thu, 01 Jan 1970')
    })
})

describe('logging in, then out', () => {
    it('remembers the person until they log out', async () => {
        vi.mocked(logIn).mockResolvedValue(USER)
        vi.mocked(findUser).mockResolvedValue(USER)
        // An agent keeps cookies between requests, like a browser
        const browser = request.agent(createApp())

        await browser.post('/api/auth/login').send({ email: 'shubh@example.com', password: 'correct horse battery' })
        expect((await browser.get('/api/auth/me')).status).toBe(200)

        await browser.post('/api/auth/logout')
        expect((await browser.get('/api/auth/me')).status).toBe(401)
    })
})