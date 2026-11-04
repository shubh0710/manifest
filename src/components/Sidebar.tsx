import { useState } from "react"
import { Link, NavLink } from "react-router"
import { Archive, Briefcase, Inbox, LogOut, PanelLeftClose, PanelLeftOpen, Plus, type LucideIcon } from "lucide-react"
import { useAuth } from "../context/authContext"
import { useCases } from "../context/casesContext"
import { initials } from "../utils/people"
import { readSetting, saveSetting } from "../utils/storage"
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

const SIDEBAR_KEY = 'manifest-sidebar'

function Sidebar() {
    const { cases, status } = useCases()
    const { user, logOut } = useAuth()
    const [collapsed, setCollapsed] = useState(() => readSetting(SIDEBAR_KEY) === 'collapsed')
    const [loggingOut, setLoggingOut] = useState(false)
    const [logOutError, setLogOutError] = useState('')

    const ToggleIcon = collapsed ? PanelLeftOpen : PanelLeftClose
    const toggleLabel = collapsed ? 'Expand sidebar' : 'Collapse sidebar'

    function toggleSidebar() {
        const next = !collapsed
        setCollapsed(next)
        saveSetting(SIDEBAR_KEY, next ? 'collapsed' : 'open')
    }

    async function handleLogOut() {
        setLoggingOut(true)
        setLogOutError('')
        try {
            await logOut()
            // Nothing else to do: with nobody logged in, the app shows the log-in page
        } catch {
            setLoggingOut(false)
            setLogOutError("Couldn't log out. Check your connection and try again.")
        }
    }

    return (
        <aside className={collapsed ? 'sidebar collapsed' : 'sidebar'}>
            <div className="brand">
                <Logo />
                <span className="brand-name">Manifest</span>
                <button
                    type="button"
                    className="sidebar-toggle"
                    onClick={toggleSidebar}
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
                    const count = cases.filter((c) => c.status === item.status).length
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
                            {/* No numbers until the list has loaded, so nothing shows a wrong 0 */}
                            {status === 'ready' && (
                                <span className={needsAttention ? 'badge strong' : 'badge'}>{count}</span>
                            )}
                            {collapsed && needsAttention && <span className="nav-dot" aria-hidden="true" />}
                        </NavLink>
                    )
                })}
            </nav>

            <div className="sidebar-footer">
                <span className="nav-label">Theme</span>
                <ThemeSwitch />
            </div>

            {user && (
                <div className="sidebar-user">
                    <div className="sidebar-user-row">
                        <span className="avatar" aria-hidden="true">
                            {initials(user.name)}
                        </span>
                        <span className="sidebar-user-text">
                            <span className="sidebar-user-name">{user.name}</span>
                            <span className="sidebar-user-email">{user.email}</span>
                        </span>
                        <button
                            type="button"
                            className="sidebar-logout"
                            onClick={handleLogOut}
                            disabled={loggingOut}
                            aria-label="Log out"
                            title="Log out"
                        >
                            <LogOut size={18} aria-hidden="true" />
                        </button>
                    </div>

                    {logOutError && (
                        <p className="field-error" role="alert">
                            {logOutError}
                        </p>
                    )}
                </div>
            )}
        </aside>
    )
}

export default Sidebar