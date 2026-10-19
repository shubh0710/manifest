import { Link, NavLink } from "react-router"
import { Archive, Briefcase, Inbox, Plus, type LucideIcon } from "lucide-react"
import { CASES } from "../fixtures/cases"
import type { Case } from "../types/case"
import Logo from "./Logo"
import './Sidebar.css'

type NavItem = {
    label: string
    path: string
    icon: LucideIcon
    status: Case['status']
}

const NAV_ITEMS: NavItem[] = [
    { label: 'Open cases', path: '/cases/open', icon: Briefcase, status: 'open' },
    { label: 'Assigned to me', path: '/cases/assigned', icon: Inbox, status: 'new' },
    { label: 'Closed cases', path: '/cases/closed', icon: Archive, status: 'closed' },
]

function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="brand">
                <Logo />
                <span className="brand-name">Manifest</span>
            </div>

            <Link to="/cases/new" className="btn btn-primary sidebar-new">
                <Plus size={16} aria-hidden="true" />
                Start new case
            </Link>

            <nav className="nav" aria-label="Case lists">
                <span className="nav-label">Work</span>
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon
                    const count = CASES.filter((c) => c.status === item.status).length

                    return (
                        <NavLink key={item.path} to={item.path} end className="nav-item">
                            <Icon size={18} aria-hidden="true" />
                            <span className="nav-text">{item.label}</span>
                            <span className={item.status === 'new' && count > 0 ? 'badge strong' : 'badge'}>
                                {count}
                            </span>
                        </NavLink>
                    )
                })}
            </nav>
        </aside>
    )
}

export default Sidebar