# Velvet Tarot · Privacy-first analytics setup

## What was implemented
- An explicit consent banner, with refusal and a persistent "隐私设置" control.
- Consent is required before any events are sent. Decline/revoke disables analytics and clears PostHog persistence.
- Auto-capture, auto pageviews, page leave and session replay are disabled. Only an allowlist of event names + limited properties can leave the browser.
- Events: `site_visit`, `module_open`, `module_close`, `tarot_start`, `tarot_complete`, `tarot_interpretation_view`, `letter_saved`, `weekly_report_view`, `weekly_archive_expand`.
- No user-submitted writing, question, card identity, mood score, camera frame, or custom query string is sent to PostHog.
- Module identifiers: `draw` (tarot), `crystal` (crystal ball / memories overview), `past` (past memories), `index` (mood reports).

## Install and deploy
1. From project root run `npm install posthog-js` (this also updates `package-lock.json`).
2. Run `npm run check` and `npm run build`.
3. Ensure Vercel Production environment has `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST=https://us.i.posthog.com`.
4. Commit the modified source and newly updated lockfile, push to GitHub and deploy via Vercel.
5. In a new browser/private session open the site: before giving consent, PostHog should show no app events. Choose agree, perform one module visit and one complete reading, then verify those events in PostHog Live Events.
6. Choose 隐私设置 → 拒绝 and confirm new activity no longer appears in Live Events.

**Note:** Vercel environment variables only apply to a new build/deployment; saving them doesn't change an existing deployed bundle.

## Useful metrics
- Module users: unique distinct IDs for `module_open` filtered by `module`.
- Module visits: number of `module_open` events by `module`.
- Tarot completion funnel: `tarot_start` → `tarot_complete`, breakdown by `method`. Camera permission failures switch to auto mode, so use overall completion as the primary funnel.
- Letter saves: count of `letter_saved` after `tarot_interpretation_view`.
- Weekly analytics users: unique IDs for `weekly_report_view`.
- Returning visitors: unique anonymous distinct IDs with `site_visit` on different dates (cohort/retention analysis).

## Important limits
- Users must explicitly consent to analytics. Users who decline cannot be included in measurements.
- The app still has its preexisting independent cloud-sync code in `src/App.tsx`. This analytics integration doesn't modify it. Review that feature separately for its privacy disclosures and behavior.
- No data from visits before this integration can be retroactively recovered.
- Anonymous identifiers are created/managed by PostHog SDK (not real names).
- If no PostHog token is configured, the app works normally with no tracking.
