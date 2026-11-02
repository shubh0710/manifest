import { Outlet } from "react-router"
import Sidebar from "../components/Sidebar"
import { useCases } from "../context/casesContext"
import "./AppLayout.css"

function AppLayout() {
    const { status, reload } = useCases()

    return (
        <div className="shell">
            <Sidebar />

            <main className="main">
                {status === 'ready' && <Outlet />}

                {status === 'loading' && (
                    <p className="empty-state" role="status">
                        Loading cases…
                    </p>
                )}

                {status === 'error' && (
                    <div className="empty-state load-error" role="alert">
                        <p>Couldn't load the cases. The server may be down, or your connection dropped.</p>
                        <button type="button" className="btn btn-secondary" onClick={reload}>
                            Try again
                        </button>
                    </div>
                )}
            </main>
        </div>
    )
}

export default AppLayout