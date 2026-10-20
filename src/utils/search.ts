export function matchesSearch(item: { name: string; dot?: string }, query: string): boolean {
    const q = query.trim().toLowerCase()
    if (q === '') return true
    return item.name.toLowerCase().includes(q) || (item.dot ?? '').includes(q)
}