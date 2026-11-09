import { capCornerPips } from './capCornerPips';
import { noAdjacentHotNumbers } from './noAdjacentHotNumbers';
import { noAdjacentSameNumber } from './noAdjacentSameNumber';
import { noAdjacentSameResource } from './noAdjacentSameResource';
import { spreadHotAcrossResources } from './spreadHotAcrossResources';
import type { Rule } from './types';

export const rules: Rule[] = [
  noAdjacentHotNumbers,
  noAdjacentSameResource,
  noAdjacentSameNumber,
  spreadHotAcrossResources,
  capCornerPips,
];

export const activeRules = (on: Record<string, boolean>) =>
  rules.filter((r) => on[r.id] ?? r.defaultOn);
