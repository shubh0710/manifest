// Small helpers for remembering settings in this browser.
// The browser can block storage (for example in some private windows),
// so we never let that break the app. It just won't remember.

export function readSetting(key: string): string | null {
    try {
        return localStorage.getItem(key)
    } catch {
        return null
    }
}

export function saveSetting(key: string, value: string): void {
    try {
        localStorage.setItem(key, value)
    } catch {
        // Storage is blocked, so the choice only lasts until the page is refreshed
    }
}