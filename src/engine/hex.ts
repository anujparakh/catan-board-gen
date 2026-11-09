import type { Corner, Ctx, Edge, Hex } from './types';

// Pointy-top hexes in doubled-width coordinates. Edge e joins corner e and corner e + 1.
const DELTAS: Record<Edge, [number, number]> = {
  0: [2, 0], // E
  1: [1, 1], // SE
  2: [-1, 1], // SW
  3: [-2, 0], // W
  4: [-1, -1], // NW
  5: [1, -1], // NE
};
const EDGES: Edge[] = [0, 1, 2, 3, 4, 5];
const SQRT3 = Math.sqrt(3);

export const hexId = (h: Hex) => `${h.col},${h.row}`;

export const pips = (n: number) => 6 - Math.abs(7 - n); // 6 and 8 = 5 pips

export function hexesFromRows(rows: number[]): Hex[] {
  return rows.flatMap((len, row) =>
    Array.from({ length: len }, (_, i) => ({ col: 2 * i - (len - 1), row })),
  );
}

export const step = (h: Hex, e: Edge): Hex => {
  const [dc, dr] = DELTAS[e];
  return { col: h.col + dc, row: h.row + dr };
};

export function neighbours(h: Hex, all: Set<string>): Hex[] {
  return EDGES.map((e) => step(h, e)).filter((n) => all.has(hexId(n)));
}

export function toPixel(h: Hex, size: number): { x: number; y: number } {
  return { x: (h.col * SQRT3 * size) / 2, y: h.row * 1.5 * size };
}

/** Corner k of a hex, k = 0 at upper right, going clockwise. */
export function cornerPixel(h: Hex, k: number, size: number): { x: number; y: number } {
  const c = toPixel(h, size);
  const a = ((60 * k - 30) * Math.PI) / 180;
  return { x: c.x + size * Math.cos(a), y: c.y + size * Math.sin(a) };
}

function centre(hexes: Hex[]) {
  const ps = hexes.map((h) => toPixel(h, 1));
  return {
    x: ps.reduce((s, p) => s + p.x, 0) / ps.length,
    y: ps.reduce((s, p) => s + p.y, 0) / ps.length,
  };
}

/** Every outer edge, sorted clockwise by angle from the board centre. */
export function coastEdges(hexes: Hex[]): { hex: Hex; edge: Edge }[] {
  const all = new Set(hexes.map(hexId));
  const mid = centre(hexes);
  const out = hexes.flatMap((hex) =>
    EDGES.filter((e) => !all.has(hexId(step(hex, e)))).map((edge) => {
      const a = cornerPixel(hex, edge, 1);
      const b = cornerPixel(hex, (edge + 1) % 6, 1);
      const angle = Math.atan2((a.y + b.y) / 2 - mid.y, (a.x + b.x) / 2 - mid.x);
      return { hex, edge, angle };
    }),
  );
  return out.sort((p, q) => p.angle - q.angle).map(({ hex, edge }) => ({ hex, edge }));
}

function cornersOf(hexes: Hex[]): Corner[] {
  const byKey = new Map<string, Corner>();
  hexes.forEach((h, i) => {
    for (let k = 0; k < 6; k++) {
      const p = cornerPixel(h, k, 1);
      const key = `${Math.round(p.x * 1000)},${Math.round(p.y * 1000)}`;
      const corner = byKey.get(key) ?? { x: p.x, y: p.y, tiles: [] };
      corner.tiles.push(i);
      byKey.set(key, corner);
    }
  });
  return [...byKey.values()];
}

export function buildContext(rows: number[]): Ctx {
  const hexes = hexesFromRows(rows);
  const all = new Set(hexes.map(hexId));
  const index = new Map(hexes.map((h, i) => [hexId(h), i]));
  return {
    hexes,
    index,
    neighbours: hexes.map((h) => neighbours(h, all).map((n) => index.get(hexId(n)) as number)),
    coast: coastEdges(hexes),
    corners: cornersOf(hexes),
  };
}

/** Board bounds in pixels, padded so harbors fit outside the coast. */
export function bounds(ctx: Ctx, size: number, pad = size * 1.0) {
  const xs = ctx.hexes.map((h) => toPixel(h, size).x);
  const ys = ctx.hexes.map((h) => toPixel(h, size).y);
  const hw = (SQRT3 * size) / 2;
  const x = Math.min(...xs) - hw - pad;
  const y = Math.min(...ys) - size - pad;
  return { x, y, w: Math.max(...xs) + hw + pad - x, h: Math.max(...ys) + size + pad - y };
}
