import { generateBoard } from './generate';
import { bag } from './rng';
import { rules } from './rules';
import { specs } from './specs';

const sorted = <T>(xs: T[]) => [...xs].sort();
const allOff = Object.fromEntries(rules.map((r) => [r.id, false]));

describe.each(Object.values(specs))('generateBoard $id', (spec) => {
  it('is deterministic for a seed', () => {
    const a = generateBoard({ specId: spec.id, rules: {}, seed: 42 });
    const b = generateBoard({ specId: spec.id, rules: {}, seed: 42 });
    expect(a).toEqual(b);
  });

  it('uses exactly the spec bags', () => {
    for (let seed = 0; seed < 500; seed++) {
      const { board } = generateBoard({ specId: spec.id, rules: allOff, seed });
      expect(sorted(board.tiles.map((t) => t.terrain))).toEqual(sorted(bag(spec.terrain)));
      expect(sorted(board.tiles.flatMap((t) => t.number ?? []))).toEqual(sorted(spec.numbers));
      expect(sorted(board.harbors.map((h) => h.type))).toEqual(sorted(bag(spec.harbors)));
      expect(board.tiles.every((t) => (t.terrain === 'desert') === (t.number === null))).toBe(true);
    }
  });

  it('meets default rules on at least 99% of seeds, quickly', () => {
    const n = 1000;
    const start = performance.now();
    let met = 0;
    for (let seed = 0; seed < n; seed++) {
      if (generateBoard({ specId: spec.id, rules: {}, seed }).unmet.length === 0) met++;
    }
    expect(met / n).toBeGreaterThanOrEqual(0.99);
    expect((performance.now() - start) / n).toBeLessThan(50);
  }, 60_000);
});
