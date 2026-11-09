import { pips } from './hex';
import { getContext, getSpec } from './generate';
import { RESOURCES, type Board, type Ctx, type Tile } from './types';

export interface ScorePart {
  id: string;
  label: string;
  value: number; // 0-1
  detail: string;
}
export interface FairnessScore {
  total: number; // 0-100
  label: 'Great' | 'Good' | 'Uneven';
  parts: ScorePart[];
}

// 95th percentile of each raw value over 10,000 unconstrained boards (npm run calibrate).
export const WORST = {
  base: { numberSpread: 7, resourceClumping: 9, resourceBalance: 0.26, startGap: 3 },
  extension56: { numberSpread: 11, resourceClumping: 15, resourceBalance: 0.22, startGap: 3 },
};
type Worst = (typeof WORST)['base'];

const clamp = (n: number) => Math.min(1, Math.max(0, n));
const isHot = (t: Tile | undefined) => t?.number === 6 || t?.number === 8;
const tilePips = (t: Tile) => (t.number === null ? 0 : pips(t.number));
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

/** Each touching pair once. */
function pairs(board: Board, ctx: Ctx, same: (a: Tile, b: Tile) => boolean): number {
  let n = 0;
  ctx.neighbours.forEach((ns, i) =>
    ns.forEach((j) => {
      if (j > i && same(board.tiles[i]!, board.tiles[j]!)) n++;
    }),
  );
  return n;
}

export function rawScores(board: Board, ctx: Ctx) {
  const hotPairs = pairs(board, ctx, (a, b) => isHot(a) && isHot(b));
  const equalPairs = pairs(board, ctx, (a, b) => a.number !== null && a.number === b.number);
  const clumps = pairs(board, ctx, (a, b) => a.terrain !== 'desert' && a.terrain === b.terrain);

  const land = board.tiles.filter((t) => t.terrain !== 'desert');
  const totalPips = land.reduce((s, t) => s + tilePips(t), 0);
  const shares = RESOURCES.map((r) => {
    const mine = land.filter((t) => t.terrain === r);
    const pipShare = mine.reduce((s, t) => s + tilePips(t), 0) / totalPips;
    return { r, gap: pipShare - mine.length / land.length };
  });
  const imbalance = shares.reduce((s, x) => s + Math.abs(x.gap), 0);

  const players = getSpec(board.specId).players;
  const corners = ctx.corners
    .map((c) => c.tiles.reduce((s, i) => s + tilePips(board.tiles[i]!), 0))
    .sort((a, b) => b - a);
  const best = corners[0] ?? 0;
  const nth = corners[2 * players - 1] ?? 0;

  return { hotPairs, equalPairs, clumps, shares, imbalance, best, nth, startGap: best - nth };
}

export function scoreBoard(board: Board): FairnessScore {
  const ctx = getContext(board.specId);
  const worst: Worst = WORST[board.specId as keyof typeof WORST] ?? WORST.base;
  const raw = rawScores(board, ctx);
  const scaled = (n: number, w: number) => (w <= 0 ? (n === 0 ? 1 : 0) : clamp(1 - n / w));

  const spread = raw.hotPairs + raw.equalPairs;
  const richest = [...raw.shares].sort((a, b) => b.gap - a.gap)[0]!;
  const poorest = [...raw.shares].sort((a, b) => a.gap - b.gap)[0]!;

  const parts: ScorePart[] = [
    {
      id: 'numberSpread',
      label: 'Number spread',
      value: scaled(spread, worst.numberSpread),
      detail:
        spread === 0
          ? 'No 6s, 8s or matching numbers touch.'
          : `${plural(raw.hotPairs, 'touching 6/8 pair')}, ${plural(raw.equalPairs, 'matching pair')}.`,
    },
    {
      id: 'resourceClumping',
      label: 'Resource clumping',
      value: scaled(raw.clumps, worst.resourceClumping),
      detail:
        raw.clumps === 0
          ? 'No same-resource tiles touch.'
          : `${plural(raw.clumps, 'same-resource pair')} touching.`,
    },
    {
      id: 'resourceBalance',
      label: 'Resource balance',
      value: scaled(raw.imbalance, worst.resourceBalance),
      detail:
        richest.gap - poorest.gap < 0.06
          ? 'Every resource gets about its share of the dice.'
          : `${cap(richest.r)} gets the most pips, ${poorest.r} the fewest.`,
    },
    {
      id: 'startSpotFairness',
      label: 'Starting spots',
      value: raw.startGap <= 2 ? 1 : scaled(raw.startGap - 2, worst.startGap),
      detail: `Best spot is ${raw.best} pips, the ${ordinal(2 * getSpec(board.specId).players)} best is ${raw.nth}.`,
    },
  ];

  const total = Math.round((100 * parts.reduce((s, p) => s + p.value, 0)) / parts.length);
  return { total, label: total >= 85 ? 'Great' : total >= 70 ? 'Good' : 'Uneven', parts };
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const ordinal = (n: number) => `${n}${n % 10 === 2 && n !== 12 ? 'nd' : 'th'}`;
