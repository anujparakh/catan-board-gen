// Prints the 95th percentile of each raw fairness value over 10,000 unconstrained boards.
// Paste the output into WORST in src/engine/score.ts. Run with: npm run calibrate
import { generateBoard, getContext, rules, specs } from '../src/engine';
import { rawScores } from '../src/engine/score';

const allOff = Object.fromEntries(rules.map((r) => [r.id, false]));
const p95 = (xs: number[]) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length * 0.95)]!;
const round = (n: number) => Math.round(n * 100) / 100;

for (const spec of Object.values(specs)) {
  const ctx = getContext(spec.id);
  const raws = Array.from({ length: 10_000 }, (_, seed) =>
    rawScores(generateBoard({ specId: spec.id, rules: allOff, seed }).board, ctx),
  );
  console.log(
    `${spec.id}: ${JSON.stringify({
      numberSpread: p95(raws.map((r) => r.hotPairs + r.equalPairs)),
      resourceClumping: p95(raws.map((r) => r.clumps)),
      resourceBalance: round(p95(raws.map((r) => r.imbalance))),
      startGap: p95(raws.map((r) => Math.max(0, r.startGap - 2))),
    })},`,
  );
}
