

export function timestampToLocalDateTime(timestamp: number): string {
    const date = new Date(timestamp)
    return `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`
}