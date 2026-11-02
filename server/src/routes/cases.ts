import { Router } from "express"
import { createCase, listCases } from "../controllers/casesController.js"

// Every address that starts with /api/cases
const casesRouter = Router()

casesRouter.get('/', listCases)
casesRouter.post('/', createCase)

export default casesRouter