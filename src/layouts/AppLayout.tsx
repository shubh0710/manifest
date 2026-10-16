import { Outlet } from "react-router"
import './AppLayout.css'

function AppLayout() {
    return (
        <div className="shell">
            <aside className="sidebar">Sidebar</aside>

            <main className="main">
                <Outlet />
            </main>
        </div>
    )
}

export default AppLayout