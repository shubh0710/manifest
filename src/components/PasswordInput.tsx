import { useState } from "react"
import "./PasswordInput.css"

type PasswordInputProps = {
    id: string
    value: string
    onChange: (value: string) => void
    // 'current-password' to log in, 'new-password' to make an account
    autoComplete: 'current-password' | 'new-password'
    // The id of a hint about the password, read out with the box
    describedBy?: string
}

// A password box with a Show / Hide button, so people can check what they typed
function PasswordInput({ id, value, onChange, autoComplete, describedBy }: PasswordInputProps) {
    const [shown, setShown] = useState(false)

    return (
        <div className="password-box">
            <input
                id={id}
                type={shown ? 'text' : 'password'}
                className="password-input"
                autoComplete={autoComplete}
                aria-describedby={describedBy}
                value={value}
                onChange={(event) => onChange(event.target.value)}
            />
            <button
                type="button"
                className="password-toggle"
                onClick={() => setShown(!shown)}
                aria-label={shown ? 'Hide password' : 'Show password'}
            >
                {shown ? 'Hide' : 'Show'}
            </button>
        </div>
    )
}

export default PasswordInput