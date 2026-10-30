import { useState } from "react"
import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react"
import { readSetting, saveSetting } from "../utils/storage"
import "./ThemeSwitch.css"

type Theme = 'system' | 'light' | 'dark'

type ThemeOption = {
    value: Theme
    label: string
    icon: LucideIcon
}

const THEME_KEY = 'manifest-theme'

const THEME_OPTIONS: ThemeOption[] = [
    { value: 'system', label: 'Use system setting', icon: Monitor },
    { value: 'light', label: 'Light theme', icon: Sun },
    { value: 'dark', label: 'Dark theme', icon: Moon },
]

// What was picked last time, or 'system' if nothing was saved
function readTheme(): Theme {
    const saved = readSetting(THEME_KEY)
    return saved === 'light' || saved === 'dark' ? saved : 'system'
}

// Light and dark are forced with data-theme on <html>.
// System removes it, so the colours follow the computer's setting.
function applyTheme(theme: Theme) {
    const root = document.documentElement

    if (theme === 'system') {
        delete root.dataset.theme
    } else {
        root.dataset.theme = theme
    }
}

function ThemeSwitch() {
    const [theme, setTheme] = useState(readTheme)

    function chooseTheme(next: Theme) {
        setTheme(next)
        applyTheme(next)
        saveSetting(THEME_KEY, next)
    }

    return (
        <div className="theme-switch" role="group" aria-label="Theme">
            {THEME_OPTIONS.map((option) => {
                const Icon = option.icon

                return (
                    <button
                        key={option.value}
                        type="button"
                        className="theme-option"
                        onClick={() => chooseTheme(option.value)}
                        aria-pressed={theme === option.value}
                        aria-label={option.label}
                        title={option.label}
                    >
                        <Icon size={16} aria-hidden="true" />
                    </button>
                )
            })}
        </div>
    )
}

export default ThemeSwitch