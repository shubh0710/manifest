import type { Request, Response } from "express"
import { ActiveCaseError, CaseAlreadyStartedError, CaseNotFoundError } from "../errors.js"
import { currentUser } from "../middleware/requireAuth.js"
import * as casesService from "../services/casesService.js"
import { checkCaseDetails } from "../validation/caseDetails.js"

// GET /api/cases
export async function listCases(req: Request, res: Response) {
    const cases = await casesService.listCases(currentUser(req).id)
    res.json(cases)
}

// POST /api/cases
export async function createCase(req: Request, res: Response) {
    const result = checkCaseDetails(req.body)
    if (!result.ok) {
        res.status(400).json({ error: result.error })
        return
    }

    try {
        const created = await casesService.createCase(result.details, currentUser(req).id)
        res.status(201).json(created)
    } catch (error) {
        if (error instanceof ActiveCaseError) {
            res.status(409).json({ error: error.message, caseId: error.caseId })
            return
        }
        throw error
    }
}

// POST /api/cases/:id/start
export async function startCase(req: Request<{ id: string }>, res: Response) {
    try {
        const started = await casesService.startCase(req.params.id, currentUser(req).id)
        res.json(started)
    } catch (error) {
        if (error instanceof CaseNotFoundError) {
            res.status(404).json({ error: error.message })
            return
        }
        if (error instanceof CaseAlreadyStartedError) {
            res.status(409).json({ error: error.message, caseId: error.caseId })
            return
        }
        throw error
    }
}