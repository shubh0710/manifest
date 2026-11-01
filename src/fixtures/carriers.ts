import type { CarrierRecord } from "../types/carrier"

// A stand-in for the FMCSA lookup until the server can fetch real records.
// Public USDOT numbers and legal names only. None of these is a client of the firm.
export const CARRIERS: CarrierRecord[] = [
    { dot: '53467', name: 'WERNER ENTERPRISES INC' },
    { dot: '428823', name: 'KNIGHT TRANSPORTATION INC' },
    { dot: '80806', name: 'J. B. HUNT TRANSPORT, INC.' },
    { dot: '264184', name: 'SCHNEIDER NATIONAL CARRIERS INC' },
    { dot: '90849', name: 'OLD DOMINION FREIGHT LINE INC' },
    { dot: '1864030', name: 'PATRIOT CARRIERS INC' },
    { dot: '74432', name: 'MARTEN TRANSPORT LTD' },
    { dot: '54283', name: 'SWIFT TRANSPORTATION CO OF ARIZONA LLC' },
    { dot: '3706', name: 'NEW PRIME INC' },
    { dot: '134697', name: 'HEARTLAND EXPRESS INC OF IOWA' },
]