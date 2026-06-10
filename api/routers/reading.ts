import { z } from "zod";
import { createRouter, authedQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { readings } from "@db/schema";
import { eq, desc, and } from "drizzle-orm";

export const readingRouter = createRouter({
  /* List all readings for current user */
  list: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const result = await db
      .select()
      .from(readings)
      .where(eq(readings.userId, ctx.user.id))
      .orderBy(desc(readings.timestamp));
    return result;
  }),

  /* Create a new reading */
  create: authedQuery
    .input(
      z.object({
        question: z.string().max(500).optional(),
        interpretation: z.string().optional(),
        cards: z
          .array(
            z.object({
              id: z.number(),
              name: z.string(),
              image: z.string(),
              position: z.string(),
            })
          )
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const result = await db.insert(readings).values({
        userId: ctx.user.id,
        question: input.question || null,
        interpretation: input.interpretation || null,
        cards: input.cards || [],
      });
      return { id: Number(result[0].insertId) };
    }),

  /* Delete a reading */
  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db
        .delete(readings)
        .where(and(eq(readings.id, input.id), eq(readings.userId, ctx.user.id)));
      return { success: true };
    }),
});
