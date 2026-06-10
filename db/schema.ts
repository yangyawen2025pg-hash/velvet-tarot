import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  int,
  json,
  bigint,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/* ── Mood / Journal Entries ── */
export const entries = mysqlTable("entries", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  text: text("text").notNull(),
  question: varchar("question", { length: 500 }),
  score: int("score").default(50).notNull(),
  keywords: varchar("keywords", { length: 500 }),
  sentiment: mysqlEnum("sentiment", ["positive", "negative", "neutral"]).default("neutral").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type Entry = typeof entries.$inferSelect;
export type InsertEntry = typeof entries.$inferInsert;

/* ── Tarot Readings ── */
export const readings = mysqlTable("readings", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  question: varchar("question", { length: 500 }),
  interpretation: text("interpretation"),
  cards: json("cards").$type<{ id: number; name: string; image: string; position: string }[]>(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type Reading = typeof readings.$inferSelect;
export type InsertReading = typeof readings.$inferInsert;
