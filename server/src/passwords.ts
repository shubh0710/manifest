import bcrypt from "bcryptjs"

// How slow hashing is on purpose. Each +1 doubles the time; 10 takes about 0.1 seconds.
// Fast for one person logging in, far too slow for someone guessing millions of passwords.
const COST = 10

// Turns a password into a hash that's safe to store. The password itself is never saved.
export function hashPassword(password: string) {
    return bcrypt.hash(password, COST)
}

// True if the password is the one this hash was made from
export function checkPassword(password: string, hash: string) {
    return bcrypt.compare(password, hash)
}