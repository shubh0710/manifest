import { Navigate, Outlet, useLocation } from "react-router"
import { useAuth } from "../context/authContext"
import CasesProvider from "../context/CasesProvider"

// Wraps every page that needs someone logged in. If nobody is, it sends them
// to the log-in page and remembers where they were going.
function RequireAuth() {
    const { user, status } = useAuth()
    const location = useLocation()

    if (status === 'checking') {
        return (
            <p className="page-loading" role="status">
                Loading…
            </p>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />
    }

    // The cases load only once someone is logged in. A different person gets a fresh list.
    return (
        <CasesProvider key={user.id}>
            <Outlet />
        </CasesProvider>
    )
}

export default RequireAuth