import { buildContext, hexId } from './hex';
import { pick, randInt, randomSeed, shuffle, bag, mulberry32, type Rng } from './rng';
import { activeRules } from './rules';
import type { Layer, Rule } from './rules/types';
import { specs } from './specs';
import type { Board, BoardSpec, Ctx, Settings } from './types';

export interface GenerateResult {
  board: Board;
  unmet: Rule[]; // enabled rules the repair loop could not satisfy
}

const ctxCache = new Map<string, Ctx>();

export function getSpec(specId: string): BoardSpec {
  const spec = specs[specId];
  if (!spec) throw new Error(`Unknown board: ${specId}`);
  return spec;
}

export function getContext(specId: string): Ctx {
  let ctx = ctxCache.get(specId);
  if (!ctx) {
    ctx = buildContext(getSpec(specId).rows);
    ctxCache.set(specId, ctx);
  }
  return ctx;
}

export function generateBoard(settings: Settings): GenerateResult {
  const spec = getSpec(settings.specId);
  const seed = settings.seed ?? randomSeed();
  const rng = mulberry32(seed);
  const ctx = getContext(spec.id);
  const rules = activeRules(settings.rules);

  let board = placeTerrain(spec, ctx, seed, rng);
  board = repair(board, 'terrain', rules, ctx, rng);
  board = placeNumbers(board, spec, rng);
  board = repair(board, 'numbers', rules, ctx, rng);
  board = placeHarbors(board, spec, ctx, rng);
  board = repair(board, 'harbors', rules, ctx, rng);

  return { board, unmet: rules.filter((r) => r.violations(board, ctx).length > 0) };
}

function placeTerrain(spec: BoardSpec, ctx: Ctx, seed: number, rng: Rng): Board {
  const terrain = shuffle(bag(spec.terrain), rng);
  return {
    specId: spec.id,
    seed,
    tiles: ctx.hexes.map((hex, i) => ({
      id: hexId(hex),
      hex,
      terrain: terrain[i]!,
      number: null,
    })),
    harbors: [],
  };
}

function placeNumbers(board: Board, spec: BoardSpec, rng: Rng): Board {
  const numbers = shuffle(spec.numbers, rng);
  let next = 0;
  return {
    ...board,
    tiles: board.tiles.map((t) => ({
      ...t,
      number: t.terrain === 'desert' ? null : numbers[next++]!,
    })),
  };
}

/** n evenly spaced coast edges from a random start, so harbors never touch. */
function placeHarbors(board: Board, spec: BoardSpec, ctx: Ctx, rng: Rng): Board {
  const types = shuffle(bag(spec.harbors), rng);
  const len = ctx.coast.length;
  const start = randInt(rng, len);
  return {
    ...board,
    harbors: types.map((type, i) => {
      const slot = ctx.coast[(start + Math.round((i * len) / types.length)) % len]!;
      return { hex: slot.hex, edge: slot.edge, type };
    }),
  };
}

function badCount(board: Board, rules: Rule[], ctx: Ctx): string[] {
  return [...new Set(rules.flatMap((r) => r.violations(board, ctx)))];
}

/** Swaps one layer's value between two slots. Bad ids are tile ids (or harbor indices). */
function swap(board: Board, layer: Layer, badId: string, rng: Rng, ctx: Ctx): Board {
  if (layer === 'harbors') {
    const a = Number(badId);
    const b = randInt(rng, board.harbors.length);
    const harbors = [...board.harbors];
    [harbors[a], harbors[b]] = [
      { ...harbors[a]!, type: harbors[b]!.type },
      { ...harbors[b]!, type: harbors[a]!.type },
    ];
    return { ...board, harbors };
  }
  const a = ctx.index.get(badId)!;
  const candidates =
    layer === 'numbers'
      ? board.tiles.flatMap((t, i) => (t.number !== null && i !== a ? [i] : []))
      : board.tiles.flatMap((_, i) => (i !== a ? [i] : []));
  const b = pick(candidates, rng);
  const tiles = [...board.tiles];
  const ta = tiles[a]!;
  const tb = tiles[b]!;
  if (layer === 'numbers') {
    tiles[a] = { ...ta, number: tb.number };
    tiles[b] = { ...tb, number: ta.number };
  } else {
    tiles[a] = { ...ta, terrain: tb.terrain };
    tiles[b] = { ...tb, terrain: ta.terrain };
  }
  return { ...board, tiles };
}

/** Random-swap hill climb: a swap that is not worse is kept, so it walks off flat spots. */
function repair(board: Board, layer: Layer, rules: Rule[], ctx: Ctx, rng: Rng, maxSteps = 5000) {
  const active = rules.filter((r) => r.layer === layer);
  let bad = badCount(board, active, ctx);
  for (let i = 0; i < maxSteps && bad.length > 0; i++) {
    const next = swap(board, layer, pick(bad, rng), rng, ctx);
    const nextBad = badCount(next, active, ctx);
    if (nextBad.length <= bad.length) {
      board = next;
      bad = nextBad;
    }
  }
  return board;
}
