import type { User } from "../types/user"
import { ApiError, request } from "./client"

// Who's logged in in this browser, or null if nobody is
export async function fetchMe(): Promise<User | null> {
    try {
        return await request<User>('/api/auth/me')
    } catch (error) {
        // 401 isn't a failure here: it's the answer "nobody"
        if (error instanceof ApiError && error.status === 401) {
            return null
        }
        throw error
    }
}

// Logs in. The server answers with the person and sets the login cookie.
export function logIn(email: string, password: string): Promise<User> {
    return request('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    })
}