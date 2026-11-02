import "dotenv/config"
import net from "node:net"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "./generated/prisma/client.js"

// Neon is in the US. From far away (like India), the first reply can take longer
// than the 0.25 seconds Node normally waits per attempt, so allow 2 seconds.
net.setDefaultAutoSelectFamilyAttemptTimeout(2000)

// The one connection to the database that the whole server shares
export const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
})