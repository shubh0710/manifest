import { NavLink } from "react-router"
import { Archive, Briefcase, Inbox, type LucideIcon } from "lucide-react"
import Logo from "./Logo"
import './Sidebar.css'

type NavItem = {
    label: string
    path: string
    icon: LucideIcon
    count?: number
}

const NAV_ITEMS: NavItem[] = [
    { label: 'Open cases', path: '/cases/open', icon: Briefcase },
    { label: 'Assigned to me', path: '/cases/assigned', icon: Inbox },
    { label: 'Closed cases', path: '/cases/closed', icon: Archive },
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
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon

                    return (
                        <NavLink key={item.path} to={item.path} end className="nav-item">
                            <Icon size={18} aria-hidden="true" />
                            {item.label}
                        </NavLink>
                    )
                })}
            </nav>
        </aside>
    )
}

export default Sidebar