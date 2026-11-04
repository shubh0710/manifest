import { useState, type SubmitEvent } from "react"
import { Link } from "react-router"
import { ApiError } from "../api/client"
import PasswordInput from "../components/PasswordInput"
import { useAuth } from "../context/authContext"

function SignUpPage() {
    const { signUp } = useAuth()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [code, setCode] = useState('')
    const [error, setError] = useState('')
    const [creating, setCreating] = useState(false)

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()

        if (creating) {
            return
        }

        setCreating(true)
        setError('')
        try {
            await signUp({ name, email, password, code })
            // Nothing else to do: AuthLayout sees someone is logged in and opens the app
        } catch (caught) {
            setCreating(false)
            setError(caught instanceof ApiError ? caught.message : 'Something went wrong. Please try again.')
        }
    }

    return (
        <>
            <h1 className="auth-title">Create an account</h1>
            <p className="auth-subtitle">You'll need the sign-up code from the person who invited you.</p>

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
                <div>
                    <label htmlFor="name" className="field-label">
                        Your name
                    </label>
                    <input
                        id="name"
                        className="text-input"
                        autoComplete="name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                </div>

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
                        autoComplete="new-password"
                        describedBy="password-hint"
                        value={password}
                        onChange={setPassword}
                    />
                    <p id="password-hint" className="field-hint">
                        8 to 72 characters.
                    </p>
                </div>

                <div>
                    <label htmlFor="code" className="field-label">
                        Sign-up code
                    </label>
                    <input
                        id="code"
                        className="text-input"
                        autoComplete="off"
                        value={code}
                        onChange={(event) => setCode(event.target.value)}
                    />
                </div>

                {error && (
                    <p className="field-error" role="alert">
                        {error}
                    </p>
                )}

                <button type="submit" className="btn btn-primary auth-submit" disabled={creating}>
                    {creating ? 'Creating account…' : 'Create account'}
                </button>
            </form>

            <p className="auth-switch">
                Already have an account? <Link to="/login">Log in</Link>
            </p>
        </>
    )
}

export default SignUpPage