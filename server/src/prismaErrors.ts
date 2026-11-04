import { Prisma } from "./generated/prisma/client.js"

// P2002 is Prisma's code for "a unique rule turned this save down"
export function isUniqueClash(error: unknown): boolean {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'
}

// P2025 is Prisma's code for "no row matched, so nothing was changed"
export function isNotFound(error: unknown): boolean {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025'
}