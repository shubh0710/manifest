import { createContext, useContext } from "react"
import type { SignUpDetails } from "../api/auth"
import type { User } from "../types/user"

// Whether we know yet: still asking the server, or we have the answer
export type AuthStatus = 'checking' | 'ready'

export type AuthContextValue = {
    user: User | null
    status: AuthStatus
    logIn: (email: string, password: string) => Promise<void>
    signUp: (details: SignUpDetails) => Promise<void>
    logOut: () => Promise<void>
    forgetUser: () => void
}

// Who's logged in, shared with the whole app. Starts empty (null) until AuthProvider fills it.
export const AuthContext = createContext<AuthContextValue | null>(null)

// Any component can call useAuth() to find out who's logged in
export function useAuth(): AuthContextValue {
    const value = useContext(AuthContext)

    if (value === null) {
        throw new Error('useAuth must be used inside <AuthProvider>')
    }

    return value
}