import { describe, expect, it } from 'vitest';
import { shuffleTarotDeck } from './tarotRandom';

const ids = Array.from({ length: 78 }, (_, index) => `card-${index}`);

describe('78-card tarot shuffle', () => {
  it('preserves all 78 cards exactly once', () => {
    for (let run = 0; run < 100; run++) {
      const deck = shuffleTarotDeck(ids);
      expect(deck).toHaveLength(78);
      expect(new Set(deck).size).toBe(78);
      expect(new Set(deck)).toEqual(new Set(ids));
    }
  });

  it('does not modify the source deck', () => {
    const original = [...ids];
    shuffleTarotDeck(ids);
    expect(ids).toEqual(original);
  });

  it('produces four unique cards from the same shuffled deck', () => {
    for (let run = 0; run < 100; run++) {
      const four = shuffleTarotDeck(ids).slice(0, 4);
      expect(four).toHaveLength(4);
      expect(new Set(four).size).toBe(4);
    }
  });

  it('supports small decks and empty decks', () => {
    expect(shuffleTarotDeck([])).toEqual([]);
    expect(shuffleTarotDeck(['one'])).toEqual(['one']);
  });
});
