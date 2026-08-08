import { defineConfig } from "drizzle-kit";
const url = process.env.DATABASE_MIGRATION_URL ?? process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_MIGRATION_URL or DATABASE_URL is required for Drizzle commands");
export default defineConfig({ schema: "./src/lib/db/schema.ts", out: "./drizzle", dialect: "postgresql", dbCredentials: { url } });
