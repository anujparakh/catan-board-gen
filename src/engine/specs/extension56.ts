import type { BoardSpec } from '../types';

export const extension56: BoardSpec = {
  id: 'extension56',
  name: '5-6 players',
  players: 6,
  rows: [3, 4, 5, 6, 5, 4, 3],
  terrain: { wood: 6, sheep: 6, wheat: 6, brick: 5, ore: 5, desert: 2 },
  numbers: [
    2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 8, 8, 8, 9, 9, 9, 10, 10, 10, 11, 11, 11, 12, 12,
  ],
  harbors: { any: 5, wood: 1, sheep: 2, wheat: 1, brick: 1, ore: 1 },
};
