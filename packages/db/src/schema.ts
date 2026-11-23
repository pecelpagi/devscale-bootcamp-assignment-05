// Memory tables for Anvia agent conversations.
// Local copy of the tables in @anvia/memory-drizzle@1.2.1: drizzle-kit loads this file as CommonJS
// and that package is ESM-only, so a re-export fails. Keep in sync with the package;
// `memoryStore.validate()` in the API fails fast if the database and the package disagree.
import { sql } from "drizzle-orm";
import { integer, jsonb, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

export const agentMemorySessions = pgTable(
  "agent_memory_sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    scopeKey: text("scope_key").notNull(),
    sessionId: text("session_id").notNull(),
    userId: text("user_id"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default(sql`'{}'::jsonb`),
    compactionState: jsonb("compaction_state").$type<unknown>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("agent_memory_sessions_scope_key_key").on(table.scopeKey)],
);

export const agentMemoryMessages = pgTable(
  "agent_memory_messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    memorySessionId: uuid("memory_session_id")
      .notNull()
      .references(() => agentMemorySessions.id, { onDelete: "cascade" }),
    runId: text("run_id").notNull(),
    turn: integer("turn").notNull(),
    position: integer("position").notNull(),
    role: text("role").notNull(),
    message: jsonb("message").$type<unknown>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("agent_memory_messages_session_position_key").on(table.memorySessionId, table.position),
  ],
);

export const agentMemoryErrors = pgTable("agent_memory_errors", {
  id: uuid("id").defaultRandom().primaryKey(),
  memorySessionId: uuid("memory_session_id")
    .notNull()
    .references(() => agentMemorySessions.id, { onDelete: "cascade" }),
  runId: text("run_id").notNull(),
  error: jsonb("error").$type<unknown>().notNull(),
  messages: jsonb("messages").$type<unknown>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const agentMemoryWrites = pgTable(
  "agent_memory_writes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    scopeKey: text("scope_key").notNull(),
    idempotencyKey: text("idempotency_key").notNull(),
    fingerprint: text("fingerprint").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("agent_memory_writes_scope_key_idempotency_key_key").on(table.scopeKey, table.idempotencyKey),
  ],
);
