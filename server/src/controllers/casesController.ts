import type { Request, Response } from "express"
import * as casesService from "../services/casesService.js"

// GET /api/cases
export async function listCases(_req: Request, res: Response) {
    const cases = await casesService.listCases()
    res.json(cases)
}