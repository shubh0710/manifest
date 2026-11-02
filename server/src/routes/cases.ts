import { Router } from "express"
import { createCase, listCases, startCase } from "../controllers/casesController.js"

// Every address that starts with /api/cases
const casesRouter = Router()

casesRouter.get('/', listCases)
casesRouter.post('/', createCase)
casesRouter.post('/:id/start', startCase)

export default casesRouter