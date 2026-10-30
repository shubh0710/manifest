import { useState } from "react"
import { Link, NavLink } from "react-router"
import { Archive, Briefcase, Inbox, PanelLeftClose, PanelLeftOpen, Plus, type LucideIcon } from "lucide-react"
import { CASES } from "../fixtures/cases"
import type { Case } from "../types/case"
import Logo from "./Logo"
import ThemeSwitch from "./ThemeSwitch"
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
    const [collapsed, setCollapsed] = useState(false)

    const ToggleIcon = collapsed ? PanelLeftOpen : PanelLeftClose
    const toggleLabel = collapsed ? 'Expand sidebar' : 'Collapse sidebar'

    return (
        <aside className={collapsed ? 'sidebar collapsed' : 'sidebar'}>
            <div className="brand">
                <Logo />
                <span className="brand-name">Manifest</span>
                <button
                    type="button"
                    className="sidebar-toggle"
                    onClick={() => setCollapsed((current) => !current)}
                    aria-label={toggleLabel}
                    title={toggleLabel}
                >
                    <ToggleIcon size={18} aria-hidden="true" />
                </button>
            </div>

            <Link
                to="/cases/new"
                className="btn btn-primary sidebar-new"
                title={collapsed ? 'Start new case' : undefined}
            >
                <Plus size={16} aria-hidden="true" />
                <span className="sidebar-new-text">Start new case</span>
            </Link>

            <nav className="nav" aria-label="Case lists">
                <span className="nav-label">Work</span>
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon
                    const count = CASES.filter((c) => c.status === item.status).length
                    const needsAttention = item.status === 'new' && count > 0

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end
                            className="nav-item"
                            title={collapsed ? item.label : undefined}
                        >
                            <Icon size={18} aria-hidden="true" />
                            <span className="nav-text">{item.label}</span>
                            <span className={needsAttention ? 'badge strong' : 'badge'}>{count}</span>
                            {collapsed && needsAttention && <span className="nav-dot" aria-hidden="true" />}
                        </NavLink>
                    )
                })}
            </nav>

            <div className="sidebar-footer">
                <span className="nav-label">Theme</span>
                <ThemeSwitch />
            </div>
        </aside>
    )
}

export default Sidebar