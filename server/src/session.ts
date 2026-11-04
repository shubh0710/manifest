import type { CookieOptions, Request, Response } from "express"
import jwt from "jsonwebtoken"

// The cookie that keeps someone logged in
export const SESSION_COOKIE = 'manifest_session'

// How long someone stays logged in
const SESSION_SECONDS = 7 * 24 * 60 * 60 // 7 days

const COOKIE_OPTIONS: CookieOptions = {
    // The page's own scripts can't read it, so an injected script can't steal it
    httpOnly: true,
    // Only sent over https when live. Your laptop uses plain http.
    secure: process.env.NODE_ENV === 'production',
    // Not sent with requests that other websites start
    sameSite: 'lax',
    path: '/',
}

// Logs this person in: a signed token with their id, saved in a cookie
export function startSession(res: Response, userId: number) {
    const token = jwt.sign({ userId }, getSecret(), { expiresIn: SESSION_SECONDS })
    res.cookie(SESSION_COOKIE, token, { ...COOKIE_OPTIONS, maxAge: SESSION_SECONDS * 1000 })
}

// The logged-in person's id, or null if there's no cookie, or it's fake or out of date
export function readSession(req: Request): number | null {
    const token: unknown = req.cookies?.[SESSION_COOKIE]
    if (typeof token !== 'string') {
        return null
    }

    const secret = getSecret()
    try {
        const contents = jwt.verify(token, secret, { algorithms: ['HS256'] })
        if (typeof contents === 'object' && typeof contents.userId === 'number') {
            return contents.userId
        }
        return null
    } catch {
        // A changed, badly signed or expired token
        return null
    }
}

// Logs this person out: the browser deletes the cookie
export function endSession(res: Response) {
    res.clearCookie(SESSION_COOKIE, COOKIE_OPTIONS)
}

// The key that signs the tokens. Anyone with it could log in as anyone, so it lives in .env only.
function getSecret() {
    const secret = process.env.JWT_SECRET
    if (!secret) {
        throw new Error('JWT_SECRET is missing from the settings')
    }
    return secret
}