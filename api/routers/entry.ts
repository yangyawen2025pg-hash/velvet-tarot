import { z } from "zod";
import { createRouter, authedQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { entries } from "@db/schema";
import { eq, desc, and } from "drizzle-orm";

export const entryRouter = createRouter({
  /* List all entries for current user */
  list: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const result = await db
      .select()
      .from(entries)
      .where(eq(entries.userId, ctx.user.id))
      .orderBy(desc(entries.timestamp));
    return result;
  }),

  /* Create a new entry */
  create: authedQuery
    .input(
      z.object({
        text: z.string().min(1).max(5000),
        question: z.string().max(500).optional(),
        score: z.number().min(0).max(100).default(50),
        keywords: z.string().max(500).optional(),
        sentiment: z.enum(["positive", "negative", "neutral"]).default("neutral"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const result = await db.insert(entries).values({
        userId: ctx.user.id,
        text: input.text,
        question: input.question || null,
        score: input.score,
        keywords: input.keywords || null,
        sentiment: input.sentiment,
      });
      return { id: Number(result[0].insertId) };
    }),

  /* Delete an entry */
  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db
        .delete(entries)
        .where(and(eq(entries.id, input.id), eq(entries.userId, ctx.user.id)));
      return { success: true };
    }),

  /* Sync entries from localStorage to cloud */
  sync: authedQuery
    .input(
      z.object({
        entries: z.array(
          z.object({
            id: z.string().optional(),
            text: z.string(),
            question: z.string().optional(),
            score: z.number(),
            keywords: z.string().optional(),
            sentiment: z.enum(["positive", "negative", "neutral"]).optional(),
            timestamp: z.union([z.string(), z.number()]).optional(),
          })
        ),
        readings: z.array(
          z.object({
            id: z.string().optional(),
            question: z.string().optional(),
            interpretation: z.string().optional(),
            cards: z.array(z.any()).optional(),
            timestamp: z.union([z.string(), z.number()]).optional(),
          })
        ).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const userId = ctx.user.id;

      // Insert entries
      if (input.entries.length > 0) {
        const values = input.entries.map((e) => ({
          userId,
          text: e.text,
          question: e.question || null,
          score: e.score,
          keywords: e.keywords || null,
          sentiment: e.sentiment || "neutral",
          timestamp: e.timestamp
            ? new Date(typeof e.timestamp === "number" ? e.timestamp : e.timestamp)
            : new Date(),
        }));

        for (const v of values) {
          try {
            await db.insert(entries).values(v);
          } catch {
            // Skip duplicates
          }
        }
      }

      // Insert readings
      if (input.readings && input.readings.length > 0) {
        const { readings: readingsTable } = await import("@db/schema");
        const values = input.readings.map((r) => ({
          userId,
          question: r.question || null,
          interpretation: r.interpretation || null,
          cards: r.cards || [],
          timestamp: r.timestamp
            ? new Date(typeof r.timestamp === "number" ? r.timestamp : r.timestamp)
            : new Date(),
        }));

        for (const v of values) {
          try {
            await db.insert(readingsTable).values(v);
          } catch {
            // Skip duplicates
          }
        }
      }

      return { success: true, count: input.entries.length };
    }),
});
