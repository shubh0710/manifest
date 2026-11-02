import express, { type NextFunction, type Request, type Response } from "express"
import casesRouter from "./routes/cases.js"

// Builds the server and its routes. It doesn't start listening here,
// so the tests can use the same app without starting the real server.
export function createApp() {
    const app = express()

    app.get('/api/health', (_req, res) => {
        res.json({ status: 'ok' })
    })

    app.use('/api/cases', casesRouter)

    // Anything that goes wrong in a route ends up here
    app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
        console.error(error)
        res.status(500).json({ error: 'Something went wrong on the server' })
    })

    return app
}