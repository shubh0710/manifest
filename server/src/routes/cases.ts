import { Router } from "express"
import { listCases } from "../controllers/casesController.js"

// Every address that starts with /api/cases
const casesRouter = Router()

casesRouter.get('/', listCases)

export default casesRouter