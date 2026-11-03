import type { NextFunction, Request, Response } from "express"
import { findUser, type PublicUser } from "../services/authService.js"
import { endSession, readSession } from "../session.js"

// Goes in front of any route that needs someone logged in. It finds who's asking
// and puts them on req.user, or answers 401 so the route never runs.
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    const userId = readSession(req)
    if (userId === null) {
        res.status(401).json({ error: 'Log in to continue' })
        return
    }

    // The token can outlive the person: they may have been removed since
    const user = await findUser(userId)
    if (!user) {
        endSession(res)
        res.status(401).json({ error: 'Your session has ended. Log in again' })
        return
    }

    req.user = user
    next()
}

// The logged-in person, in a route behind requireAuth
export function currentUser(req: Request): PublicUser {
    if (!req.user) {
        throw new Error('This route needs requireAuth in front of it')
    }
    return req.user
}