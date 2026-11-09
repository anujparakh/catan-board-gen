import type { Tile } from '../types';
import type { Rule } from './types';

export const isHot = (t: Tile | undefined) => t?.number === 6 || t?.number === 8;

export const noAdjacentHotNumbers: Rule = {
  id: 'noAdjacentHotNumbers',
  label: 'Spread out 6s and 8s',
  description: 'No 6 or 8 touches another 6 or 8.',
  layer: 'numbers',
  defaultOn: true,
  violations: (board, ctx) =>
    board.tiles.flatMap((t, i) =>
      isHot(t) && ctx.neighbours[i]?.some((j) => isHot(board.tiles[j])) ? [t.id] : [],
    ),
};
