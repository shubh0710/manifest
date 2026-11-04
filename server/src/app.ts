import express, { type NextFunction, type Request, type Response } from "express"
import casesRouter from "./routes/cases.js"
import authRouter from "./routes/auth.js"
import cookieParser from "cookie-parser"

// Builds the server and its routes. It doesn't start listening here,
// so the tests can use the same app without starting the real server.
export function createApp() {
    const app = express()

    // Reads JSON sent with a request into req.body
    app.use(express.json())

    // Reads the cookies sent with a request into req.cookies
    app.use(cookieParser())

    app.get('/api/health', (_req, res) => {
        res.json({ status: 'ok' })
    })

    app.use('/api/auth', authRouter)
    app.use('/api/cases', casesRouter)

    // Anything that goes wrong in a route ends up here
    app.use((error: Error & { status?: number }, _req: Request, res: Response, _next: NextFunction) => {
        // Broken JSON in the request is the sender's mistake, not the server's
        if (error.status === 400) {
            res.status(400).json({ error: 'The request was not valid JSON' })
            return
        }
        console.error(error)
        res.status(500).json({ error: 'Something went wrong on the server' })
    })

    return app
}