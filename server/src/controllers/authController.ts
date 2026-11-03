import type { Request, Response } from "express"
import { EmailTakenError, WrongLogInError, WrongSignUpCodeError } from "../errors.js"
import * as authService from "../services/authService.js"
import { startSession } from "../session.js"
import { checkLogIn, checkSignUp } from "../validation/credentials.js"

// POST /api/auth/signup
export async function signUp(req: Request, res: Response) {
    const result = checkSignUp(req.body)
    if (!result.ok) {
        res.status(400).json({ error: result.error })
        return
    }

    try {
        const user = await authService.signUp(result.details)
        startSession(res, user.id)
        res.status(201).json(user)
    } catch (error) {
        if (error instanceof WrongSignUpCodeError) {
            res.status(403).json({ error: error.message })
            return
        }
        if (error instanceof EmailTakenError) {
            res.status(409).json({ error: error.message })
            return
        }
        throw error
    }
}

// POST /api/auth/login
export async function logIn(req: Request, res: Response) {
    const result = checkLogIn(req.body)
    if (!result.ok) {
        res.status(400).json({ error: result.error })
        return
    }

    try {
        const user = await authService.logIn(result.details)
        startSession(res, user.id)
        res.json(user)
    } catch (error) {
        if (error instanceof WrongLogInError) {
            res.status(401).json({ error: error.message })
            return
        }
        throw error
    }
}