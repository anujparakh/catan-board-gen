import { pips } from '../hex';
import type { Rule } from './types';

const MAX_PIPS = 11;

export const capCornerPips: Rule = {
  id: 'capCornerPips',
  label: `No corner worth more than ${MAX_PIPS} dots`,
  description: 'Caps the best starting spot so no one gets a runaway start.',
  layer: 'numbers',
  defaultOn: false,
  violations: (board, ctx) => {
    const bad = new Set<string>();
    for (const c of ctx.corners) {
      const tiles = c.tiles.map((i) => board.tiles[i]!);
      const value = tiles.reduce((s, t) => s + (t.number === null ? 0 : pips(t.number)), 0);
      if (value > MAX_PIPS) tiles.forEach((t) => t.number !== null && bad.add(t.id));
    }
    return [...bad];
  },
};
