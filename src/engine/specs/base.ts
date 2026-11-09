import type { BoardSpec } from '../types';

export const base: BoardSpec = {
  id: 'base',
  name: '3-4 players',
  players: 4,
  rows: [3, 4, 5, 4, 3],
  terrain: { wood: 4, sheep: 4, wheat: 4, brick: 3, ore: 3, desert: 1 },
  numbers: [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12],
  harbors: { any: 4, wood: 1, sheep: 1, wheat: 1, brick: 1, ore: 1 },
};
