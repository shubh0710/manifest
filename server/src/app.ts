import express from "express"

// Builds the server and its routes. It doesn't start listening here,
// so the tests can use the same app without taking up a port.
export function createApp() {
    const app = express()

    app.get('/api/health', (_req, res) => {
        res.json({ status: 'ok' })
    })

    return app
}