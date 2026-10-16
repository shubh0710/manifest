import { Outlet } from "react-router"
import Sidebar from "../components/Sidebar"
import './AppLayout.css'

function AppLayout() {
    return (
        <div className="shell">
            <Sidebar />

            <main className="main">
                <Outlet />
            </main>
        </div>
    )
}

export default AppLayout