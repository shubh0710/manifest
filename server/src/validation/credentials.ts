// What's needed to make an account, and to log in
export type SignUpDetails = { name: string; email: string; password: string; code: string }
export type LogInDetails = { email: string; password: string }

type CheckResult<Details> = { ok: true; details: Details } | { ok: false; error: string }

const MAX_NAME_LENGTH = 100
const MIN_PASSWORD_LENGTH = 8
// bcrypt only reads the first 72 bytes of a password, so longer ones are turned down
const MAX_PASSWORD_BYTES = 72

// Checks the sign-up form. The code itself is checked later, by the service.
export function checkSignUp(body: unknown): CheckResult<SignUpDetails> {
    if (typeof body !== 'object' || body === null) {
        return { ok: false, error: 'Send the details as JSON' }
    }
    const { name, email, password, code } = body as Record<string, unknown>

    if (typeof name !== 'string' || name.trim() === '') {
        return { ok: false, error: 'Enter your name' }
    }
    if (name.trim().length > MAX_NAME_LENGTH) {
        return { ok: false, error: `Keep your name under ${MAX_NAME_LENGTH} characters` }
    }
    if (typeof email !== 'string' || !looksLikeEmail(email)) {
        return { ok: false, error: 'Enter a valid email address' }
    }
    if (
        typeof password !== 'string' ||
        password.length < MIN_PASSWORD_LENGTH ||
        Buffer.byteLength(password) > MAX_PASSWORD_BYTES
    ) {
        return { ok: false, error: 'Use a password of 8 to 72 characters' }
    }
    if (typeof code !== 'string' || code.trim() === '') {
        return { ok: false, error: 'Enter the sign-up code' }
    }

    // The password is kept exactly as typed: spaces count
    return {
        ok: true,
        details: { name: name.trim(), email: cleanEmail(email), password, code: code.trim() },
    }
}

// Checks the log-in form. No password rules here: a wrong password is simply wrong.
export function checkLogIn(body: unknown): CheckResult<LogInDetails> {
    if (typeof body !== 'object' || body === null) {
        return { ok: false, error: 'Send the details as JSON' }
    }
    const { email, password } = body as Record<string, unknown>

    if (typeof email !== 'string' || email.trim() === '' || typeof password !== 'string' || password === '') {
        return { ok: false, error: 'Enter your email and password' }
    }
    return { ok: true, details: { email: cleanEmail(email), password } }
}

// Something before the @, something after it with a dot, and no spaces
function looksLikeEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

// Saved trimmed and in small letters, so Alex@Example.com and alex@example.com are one person
function cleanEmail(email: string) {
    return email.trim().toLowerCase()
}