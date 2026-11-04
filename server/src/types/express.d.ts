import type { PublicUser } from "../services/authService.js"

// Teaches TypeScript that requests can carry the logged-in person (set by requireAuth)
declare global {
    namespace Express {
        interface Request {
            user?: PublicUser
        }
    }
}