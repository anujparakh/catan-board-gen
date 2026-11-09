import { RESOURCES } from '../types';
import { isHot } from './noAdjacentHotNumbers';
import type { Rule } from './types';

export const spreadHotAcrossResources: Rule = {
  id: 'spreadHotAcrossResources',
  label: 'Share 6s and 8s across resources',
  description: 'No resource hogs the 6s and 8s.',
  layer: 'numbers',
  defaultOn: false,
  violations: (board) => {
    const hot = board.tiles.filter(isHot);
    const cap = Math.ceil(hot.length / RESOURCES.length);
    return RESOURCES.flatMap((r) => {
      const mine = hot.filter((t) => t.terrain === r);
      return mine.length > cap ? mine.map((t) => t.id) : [];
    });
  },
};
