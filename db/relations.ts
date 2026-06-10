import { relations } from "drizzle-orm";
import { users, entries, readings } from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  entries: many(entries),
  readings: many(readings),
}));

export const entriesRelations = relations(entries, ({ one }) => ({
  user: one(users, {
    fields: [entries.userId],
    references: [users.id],
  }),
}));

export const readingsRelations = relations(readings, ({ one }) => ({
  user: one(users, {
    fields: [readings.userId],
    references: [users.id],
  }),
}));
