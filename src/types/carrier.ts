// One carrier's public record, as FMCSA shows it.
// For now just the basics; the real lookup will add more (authority, fleet size, address…).
export type CarrierRecord = {
    dot: string
    name: string
}