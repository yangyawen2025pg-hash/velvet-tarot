# Velvet Tarot - 78-card random draw improvement

## Goal
Replace biased `sort(() => Math.random() - 0.5)` and ad hoc single-card random picks with one Fisher–Yates shuffled deck (using Web Crypto unbiased random indices) **per reading**. Hand gesture mode draws cards from successive positions of the same deck; automatic mode takes the first four. The camera-failure fallback uses the deck prepared for the same reading. No private data is uploaded.

## Apply
From `~/Downloads/velvet-tarot` (on a new branch):

```bash
unzip -o ~/Downloads/velvet-tarot-random-v1.zip -d ~/Downloads/velvet-tarot
python3 apply_tarot_patch.py
npm run check
npm test -- src/lib/tarotRandom.test.ts
npm run build
```

## Expected changed files
- `src/sections/CardDrawSection.tsx` (patched after running script)
- `src/lib/tarotRandom.ts` (new)
- `src/lib/tarotRandom.test.ts` (new)
- `apply_tarot_patch.py` and this README may be committed as reproducible documentation, or omit them.

## Preview acceptance
1. Verify 78 card IDs are unique (existing source includes 22 major + four suites of 14).
2. Test automatic reading: 4 different cards, all from 78; repeat several times.
3. Test hand gestures: select 4 different cards, in the right positions.
4. Test camera access denied: fallback still produces 4 different cards.
5. Test reset/re-reading: begins a fresh shuffled deck; user input, results, and letter saving still work.
6. Test anonymous analytics does not send card ID, card meaning, user question, or letter text.

## Caveats
- Uniform shuffle mathematically relies on the browser's secure random generator. Results do not have to look evenly distributed in a small sample; repeats across different readings are normal.
- No card upright/reversed state is added; interpretation and deck assets remain unchanged.
- This patch intentionally does not add shuffle events to PostHog to avoid changing existing event semantics.
- The on-screen random decorative card stack remains unchanged; it is visual only.
