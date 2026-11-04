import { Router } from "express"
import { logIn, logOut, me, signUp } from "../controllers/authController.js"
import { requireAuth } from "../middleware/requireAuth.js"

// Every address that starts with /api/auth
const authRouter = Router()

authRouter.post('/signup', signUp)
authRouter.post('/login', logIn)
authRouter.post('/logout', logOut)
authRouter.get('/me', requireAuth, me)

export default authRouter