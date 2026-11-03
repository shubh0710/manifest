import { Router } from "express"
import { logIn, signUp } from "../controllers/authController.js"

// Every address that starts with /api/auth
const authRouter = Router()

authRouter.post('/signup', signUp)
authRouter.post('/login', logIn)

export default authRouter