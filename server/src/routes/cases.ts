import { Router } from "express"
import { createCase, listCases, startCase } from "../controllers/casesController.js"
import { requireAuth } from "../middleware/requireAuth.js"

// Every address that starts with /api/cases
const casesRouter = Router()

// Every cases route needs someone logged in
casesRouter.use(requireAuth)

casesRouter.get('/', listCases)
casesRouter.post('/', createCase)
casesRouter.post('/:id/start', startCase)

export default casesRouter