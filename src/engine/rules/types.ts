import type { Board, Ctx } from '../types';

export type Layer = 'terrain' | 'numbers' | 'harbors';

export interface Rule {
  id: string;
  label: string; // toggle text
  description: string; // one-line help under the toggle
  layer: Layer; // which repair pass uses it
  defaultOn: boolean;
  violations(board: Board, ctx: Ctx): string[]; // ids of tiles that break it
}
