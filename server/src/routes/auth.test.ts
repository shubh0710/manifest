import jwt from "jsonwebtoken"
import request from "supertest"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { createApp } from "../app.js"
import { EmailTakenError, WrongLogInError, WrongSignUpCodeError } from "../errors.js"
import { logIn, signUp } from "../services/authService.js"

// Swap the service for a stand-in, so these tests never touch the database
vi.mock('../services/authService.js', () => ({
    signUp: vi.fn(),
    logIn: vi.fn(),
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