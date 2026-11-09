export type Rng = () => number;

/** mulberry32: tiny, fast, good enough for shuffling board tiles. */
export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const randomSeed = () => Math.floor(Math.random() * 2 ** 32);

export const randInt = (rng: Rng, n: number) => Math.floor(rng() * n);

export function pick<T>(items: readonly T[], rng: Rng): T {
  return items[randInt(rng, items.length)] as T;
}

/** Fisher-Yates shuffle, returns a new array. */
export function shuffle<T>(items: readonly T[], rng: Rng): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = randInt(rng, i + 1);
    [out[i], out[j]] = [out[j] as T, out[i] as T];
  }
  return out;
}

/** Expands { a: 2, b: 1 } into ['a', 'a', 'b']. */
export function bag<K extends string>(counts: Record<K, number>): K[] {
  return (Object.entries(counts) as [K, number][]).flatMap(([k, n]) => Array<K>(n).fill(k));
}
