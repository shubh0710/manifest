import { Navigate, Outlet, useLocation } from "react-router"
import Logo from "../components/Logo"
import { useAuth } from "../context/authContext"
import "./AuthLayout.css"

// The frame around the log-in page: the logo and one card, with no sidebar.
// Once someone is logged in, it opens the app where they were going.
function AuthLayout() {
    const { user, status } = useAuth()
    const location = useLocation()

    if (status === 'checking') {
        return (
            <p className="page-loading" role="status">
                Loading…
            </p>
        )
    }

    if (user) {
        const from = (location.state as { from?: string } | null)?.from
        return <Navigate to={from ?? '/cases/open'} replace />
    }

    return (
        <main className="auth-page">
            <div className="auth-brand">
                <Logo size={36} />
                <span className="auth-brand-name">Manifest</span>
            </div>

            <div className="card auth-card">
                <Outlet />
            </div>
        </main>
    )
}

export default AuthLayout