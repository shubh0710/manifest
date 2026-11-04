import type { User } from "../types/user"
import { ApiError, request } from "./client"

// What's needed to make an account
export type SignUpDetails = {
    name: string
    email: string
    password: string
    code: string
}

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

// Makes an account and logs straight in. The server sets the login cookie.
export function signUp(details: SignUpDetails): Promise<User> {
    return request('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details),
    })
}

// Logs out. The server tells the browser to delete the login cookie.
export async function logOut(): Promise<void> {
    await request('/api/auth/logout', { method: 'POST' })
}