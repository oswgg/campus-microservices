// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './src/infrastructure/db/schemas/**/*.schema.ts', // path to your schemas
    out: './src/infrastructure/db/migrations', // folder where migrations will be stored
    dialect: 'postgresql', // or "mysql" | "sqlite"
    dbCredentials: {
        url: process.env.DB_URL,
    },
    verbose: true,
    strict: true,
});
