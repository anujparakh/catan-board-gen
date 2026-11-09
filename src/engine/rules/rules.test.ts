import { getContext } from '../generate';
import type { Board, Terrain } from '../types';
import { capCornerPips } from './capCornerPips';
import { noAdjacentHotNumbers } from './noAdjacentHotNumbers';
import { noAdjacentSameNumber } from './noAdjacentSameNumber';
import { noAdjacentSameResource } from './noAdjacentSameResource';
import { spreadHotAcrossResources } from './spreadHotAcrossResources';

const ctx = getContext('base');
// Base board hex order: row 0 has ids -2,0 0,0 2,0; row 1 starts at -3,1.
// Hexes 0 and 1 touch; hexes 0 and 2 do not.
const make = (cells: [Terrain, number | null][]): Board => ({
  specId: 'base',
  seed: 0,
  harbors: [],
  tiles: ctx.hexes.map((hex, i) => {
    const [terrain, number] = cells[i] ?? ['desert', null];
    return { id: `${hex.col},${hex.row}`, hex, terrain, number };
  }),
});

describe('rules', () => {
  it('noAdjacentHotNumbers', () => {
    expect(
      noAdjacentHotNumbers.violations(
        make([
          ['ore', 6],
          ['wood', 3],
          ['wheat', 8],
        ]),
        ctx,
      ),
    ).toEqual([]);
    expect(
      noAdjacentHotNumbers.violations(
        make([
          ['ore', 6],
          ['wood', 8],
        ]),
        ctx,
      ),
    ).toEqual(['-2,0', '0,0']);
  });

  it('noAdjacentSameNumber', () => {
    expect(
      noAdjacentSameNumber.violations(
        make([
          ['ore', 4],
          ['wood', 3],
          ['wheat', 4],
        ]),
        ctx,
      ),
    ).toEqual([]);
    expect(
      noAdjacentSameNumber.violations(
        make([
          ['ore', 4],
          ['wood', 4],
        ]),
        ctx,
      ),
    ).toHaveLength(2);
  });

  it('noAdjacentSameResource ignores deserts', () => {
    expect(
      noAdjacentSameResource.violations(
        make([
          ['ore', 4],
          ['wood', 3],
          ['ore', 4],
        ]),
        ctx,
      ),
    ).toEqual([]);
    expect(
      noAdjacentSameResource.violations(
        make([
          ['ore', 4],
          ['ore', 3],
        ]),
        ctx,
      ),
    ).toHaveLength(2);
  });

  it('spreadHotAcrossResources', () => {
    const ok = make([
      ['ore', 6],
      ['wood', 3],
      ['wheat', 8],
      ['brick', 2],
      ['sheep', 6],
      ['wood', 8],
    ]);
    expect(spreadHotAcrossResources.violations(ok, ctx)).toEqual([]);
    const bad = make([
      ['ore', 6],
      ['wood', 3],
      ['ore', 8],
      ['brick', 6],
      ['sheep', 8],
    ]);
    expect(spreadHotAcrossResources.violations(bad, ctx)).toEqual(['-2,0', '2,0']);
  });

  it('capCornerPips', () => {
    // -2,0 / 0,0 / -1,1 share a corner: 6 + 8 + 5 = 14 pips.
    const cells: [Terrain, number | null][] = Array(19).fill(['wood', 2]);
    cells[0] = ['ore', 6];
    cells[1] = ['wood', 8];
    cells[4] = ['wheat', 5];
    expect(capCornerPips.violations(make(cells), ctx)).toHaveLength(3);
    cells[4] = ['wheat', 2];
    expect(capCornerPips.violations(make(cells), ctx)).toEqual([]);
  });
});
