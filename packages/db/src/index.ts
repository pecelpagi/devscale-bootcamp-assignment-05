import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

// Database client. Pass it to DrizzleMemoryStore or query the tables directly.
export const db = drizzle(process.env.DATABASE_URL!, { schema });
