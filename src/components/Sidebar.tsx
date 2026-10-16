import { NavLink } from "react-router"
import Logo from "./Logo"
import './Sidebar.css'

type NavItem = {
    label: string
    path: string
    count?: number
}

const NAV_ITEMS: NavItem[] = [
    { label: 'Open cases', path: '/cases/open' },
    { label: 'Assigned to me', path: '/cases/assigned' },
    { label: 'Closed cases', path: '/cases/closed' },
]

function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="brand">
                <Logo />
                <span className="brand-name">Manifest</span>
            </div>

            <nav className="nav" aria-label="Case lists">
                <span className="nav-label">Work</span>
                {NAV_ITEMS.map((item) => (
                    <NavLink key={item.path} to={item.path} end className="nav-item">
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    )
}

export default Sidebar