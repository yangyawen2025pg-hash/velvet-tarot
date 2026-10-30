/**
 * Uniformly shuffle the supplied deck via Fisher–Yates.
 * Browser Web Crypto supplies unbiased indices through rejection sampling.
 * Does not change the input array or store/send any draw results.
 */
function secureRandomIndex(upperExclusive: number): number {
  if (!Number.isSafeInteger(upperExclusive) || upperExclusive < 1 || upperExclusive > 0x100000000) {
    throw new RangeError('Invalid shuffle range');
  }
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error('Secure randomness is unavailable. Please use HTTPS or localhost.');
  }
  const span = 0x100000000;
  const limit = span - (span % upperExclusive);
  const buffer = new Uint32Array(1);
  let value: number;
  do {
    globalThis.crypto.getRandomValues(buffer);
    value = buffer[0];
  } while (value >= limit);
  return value % upperExclusive;
}

export function shuffleTarotDeck<T>(cards: readonly T[]): T[] {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = secureRandomIndex(i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
