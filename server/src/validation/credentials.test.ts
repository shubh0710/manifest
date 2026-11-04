import { describe, expect, it } from "vitest"
import { checkLogIn, checkSignUp } from "./credentials.js"

const SIGN_UP = {
    name: '  Shubh  ',
    email: '  Shubh@Example.com ',
    password: 'correct horse battery',
    code: ' let-me-in ',
}

describe('checkSignUp', () => {
    it('accepts good details and tidies them', () => {
        expect(checkSignUp(SIGN_UP)).toEqual({
            ok: true,
            details: {
                name: 'Shubh',
                email: 'shubh@example.com',
                password: 'correct horse battery',
                code: 'let-me-in',
            },
        })
    })

    it('asks for a name', () => {
        expect(checkSignUp({ ...SIGN_UP, name: '   ' })).toEqual({ ok: false, error: 'Enter your name' })
    })

    it('turns down an email without an @ and a dot after it', () => {
        for (const email of ['shubh', 'shubh@example', 'shubh @example.com', 42]) {
            expect(checkSignUp({ ...SIGN_UP, email })).toEqual({ ok: false, error: 'Enter a valid email address' })
        }
    })

    it('needs a password of 8 to 72 characters', () => {
        const error = { ok: false, error: 'Use a password of 8 to 72 characters' }

        expect(checkSignUp({ ...SIGN_UP, password: 'short' })).toEqual(error)
        expect(checkSignUp({ ...SIGN_UP, password: 'a'.repeat(73) })).toEqual(error)
        // é takes 2 bytes, so 37 of them is 74 bytes: too long for bcrypt
        expect(checkSignUp({ ...SIGN_UP, password: 'é'.repeat(37) })).toEqual(error)
        expect(checkSignUp({ ...SIGN_UP, password: 'a'.repeat(72) }).ok).toBe(true)
    })

    it('asks for the sign-up code', () => {
        expect(checkSignUp({ ...SIGN_UP, code: '' })).toEqual({ ok: false, error: 'Enter the sign-up code' })
    })

    it('turns down anything that is not an object', () => {
        expect(checkSignUp('hello')).toEqual({ ok: false, error: 'Send the details as JSON' })
    })
})

describe('checkLogIn', () => {
    it('tidies the email but keeps the password exactly as typed', () => {
        expect(checkLogIn({ email: ' Shubh@Example.com ', password: ' secret ' })).toEqual({
            ok: true,
            details: { email: 'shubh@example.com', password: ' secret ' },
        })
    })

    it('asks for both the email and the password', () => {
        const error = { ok: false, error: 'Enter your email and password' }

        expect(checkLogIn({ email: 'shubh@example.com' })).toEqual(error)
        expect(checkLogIn({ password: 'secret' })).toEqual(error)
    })
})