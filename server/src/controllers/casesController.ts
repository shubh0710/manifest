import type { Request, Response } from "express"
import { ActiveCaseError } from "../errors.js"
import * as casesService from "../services/casesService.js"
import { checkCaseDetails } from "../validation/caseDetails.js"

// GET /api/cases
export async function listCases(_req: Request, res: Response) {
    const cases = await casesService.listCases()
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
        const created = await casesService.createCase(result.details)
        res.status(201).json(created)
    } catch (error) {
        if (error instanceof ActiveCaseError) {
            res.status(409).json({ error: error.message, caseId: error.caseId })
            return
        }
        throw error
    }
}