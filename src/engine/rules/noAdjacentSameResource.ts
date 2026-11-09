import type { Rule } from './types';

export const noAdjacentSameResource: Rule = {
  id: 'noAdjacentSameResource',
  label: 'Keep same resources apart',
  description: 'No two tiles of the same resource touch.',
  layer: 'terrain',
  defaultOn: true,
  violations: (board, ctx) =>
    board.tiles.flatMap((t, i) =>
      t.terrain !== 'desert' &&
      ctx.neighbours[i]?.some((j) => board.tiles[j]?.terrain === t.terrain)
        ? [t.id]
        : [],
    ),
};
