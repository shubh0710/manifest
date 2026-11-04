import { useState, type SubmitEvent } from "react"
import { Link } from "react-router"
import { ApiError } from "../api/client"
import PasswordInput from "../components/PasswordInput"
import { useAuth } from "../context/authContext"

function LogInPage() {
    const { logIn } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loggingIn, setLoggingIn] = useState(false)

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()

        if (loggingIn) {
            return
        }

        setLoggingIn(true)
        setError('')
        try {
            await logIn(email, password)
            // Nothing else to do: AuthLayout sees someone is logged in and opens the app
        } catch (caught) {
            setLoggingIn(false)
            setError(caught instanceof ApiError ? caught.message : 'Something went wrong. Please try again.')
        }
    }

    return (
        <>
            <h1 className="auth-title">Log in</h1>
            <p className="auth-subtitle">Welcome back. Log in to see your cases.</p>

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
                <div>
                    <label htmlFor="email" className="field-label">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        className="text-input"
                        autoComplete="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="password" className="field-label">
                        Password
                    </label>
                    <PasswordInput
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={setPassword}
                    />
                </div>

                {error && (
                    <p className="field-error" role="alert">
                        {error}
                    </p>
                )}

                <button type="submit" className="btn btn-primary auth-submit" disabled={loggingIn}>
                    {loggingIn ? 'Logging in…' : 'Log in'}
                </button>
            </form>

            <p className="auth-switch">
                New here? <Link to="/signup">Create an account</Link>
            </p>
        </>
    )
}

export default LogInPage