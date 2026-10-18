export function formatDate(value: string): string {
    return new Date(value).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC',
    })
}

export function formatEffectiveDate(value?: string): string {
    return value ? formatDate(value) : 'ASAP'
}

export function formatUpdated(value: string, now = new Date()): string {
    const updated = new Date(value)
    const minutes = Math.floor((now.getTime() - updated.getTime()) / 60000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes} min ago`

    const hours = Math.floor(minutes / 60)
    if (hours < 24) return hours === 1 ? '1 hour ago' : `${hours} hours ago`

    const startOfYesterday = new Date(now)
    startOfYesterday.setHours(0, 0, 0, 0)
    startOfYesterday.setDate(startOfYesterday.getDate() - 1)
    if (updated.getTime() >= startOfYesterday.getTime()) return 'Yesterday'

    return updated.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })
}

export function daysUntil(dateOnly: string, now = new Date()): number {
    const [year, month, day] = dateOnly.split('-').map(Number)
    const due = Date.UTC(year, month - 1, day)
    const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
    return Math.round((due - today) / 86400000)
}