import type { PublicUser } from "../services/authService.ts"

// Teaches TypeScript that requests can carry the logged-in person (set by requireAuth)
declare global {
    namespace Express {
        interface Request {
            user?: PublicUser
        }
    }
}