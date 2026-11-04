import { useCallback, useEffect, useState, type ReactNode } from "react"
import * as api from "../api/auth"
import type { User } from "../types/user"
import { AuthContext, type AuthStatus } from "./authContext"

type AuthProviderProps = {
    children: ReactNode
}

// Knows who's logged in, for the whole app
function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null)
    const [status, setStatus] = useState<AuthStatus>('checking')

    // When the app opens, ask the server whether this browser is already logged in.
    // The page can't read the login cookie itself, so it has to ask.
    useEffect(() => {
        let ignore = false

        api.fetchMe()
            .then((me) => {
                if (!ignore) {
                    setUser(me)
                }
            })
            .catch(() => {
                // The server couldn't be reached. Show the log-in page, which says so if it still can't.
            })
            .finally(() => {
                if (!ignore) {
                    setStatus('ready')
                }
            })

        return () => {
            ignore = true
        }
    }, [])

    async function logIn(email: string, password: string) {
        const me = await api.logIn(email, password)
        setUser(me)
    }

    // A new account is logged in straight away
    async function signUp(details: api.SignUpDetails) {
        const me = await api.signUp(details)
        setUser(me)
    }

    // Only forgets the person once the server has ended the session,
    // so a failed log out never looks like it worked
    async function logOut() {
        await api.logOut()
        setUser(null)
    }

    // Forgets who's logged in on this page, when the server says the login has ended.
    // useCallback keeps it the same function every time, so pages can safely use it in effects.
    const forgetUser = useCallback(() => {
        setUser(null)
    }, [])

    return <AuthContext value={{ user, status, logIn, signUp, logOut, forgetUser }}>{children}</AuthContext>
}

export default AuthProvider