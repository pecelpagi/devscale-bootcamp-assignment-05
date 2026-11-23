import { defineConfig } from "drizzle-kit";

// DATABASE_URL comes from the root .env (loaded by the db:* scripts).
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  out: "./drizzle",
  dbCredentials: { url: process.env.DATABASE_URL! },
});
