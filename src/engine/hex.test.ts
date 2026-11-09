import { buildContext, coastEdges, hexesFromRows } from './hex';

describe('hex', () => {
  it('builds the base board shape', () => {
    const hexes = hexesFromRows([3, 4, 5, 4, 3]);
    expect(hexes).toHaveLength(19);
    expect(coastEdges(hexes)).toHaveLength(30);
  });

  it('builds the 5-6 player board shape', () => {
    const hexes = hexesFromRows([3, 4, 5, 6, 5, 4, 3]);
    expect(hexes).toHaveLength(30);
    expect(coastEdges(hexes)).toHaveLength(38);
  });

  it('gives an inner hex 6 neighbours and a corner hex 3', () => {
    const ctx = buildContext([3, 4, 5, 4, 3]);
    expect(ctx.neighbours[ctx.index.get('0,2')!]).toHaveLength(6);
    expect(ctx.neighbours[ctx.index.get('-2,0')!]).toHaveLength(3);
  });

  it('finds 54 corners on the base board', () => {
    expect(buildContext([3, 4, 5, 4, 3]).corners).toHaveLength(54);
  });
});
