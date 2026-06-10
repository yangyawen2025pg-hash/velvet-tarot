import { authRouter } from "./auth-router";
import { entryRouter } from "./routers/entry";
import { readingRouter } from "./routers/reading";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  entry: entryRouter,
  reading: readingRouter,
});

export type AppRouter = typeof appRouter;
