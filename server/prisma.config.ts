import "dotenv/config"
import { defineConfig } from "prisma/config"

// Settings for the Prisma command-line tool (migrate, generate, seed).
// The app itself connects in a different way, set up later.
export default defineConfig({
    schema: 'prisma/schema.prisma',
    migrations: {
        path: 'prisma/migrations',
        // Fills the tables with sample data: npx prisma db seed
        seed: 'tsx prisma/seed.ts',
    },
    datasource: {
        // Changes to the tables need a direct connection, not the pooled one
        url: process.env.DIRECT_URL,
    },
})