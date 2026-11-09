import type { Rule } from './types';

export const noAdjacentSameNumber: Rule = {
  id: 'noAdjacentSameNumber',
  label: 'No matching numbers touching',
  description: 'Two tiles with the same number never touch.',
  layer: 'numbers',
  defaultOn: true,
  violations: (board, ctx) =>
    board.tiles.flatMap((t, i) =>
      t.number !== null && ctx.neighbours[i]?.some((j) => board.tiles[j]?.number === t.number)
        ? [t.id]
        : [],
    ),
};
