import { specs } from '.';

describe.each(Object.values(specs))('spec $id', (spec) => {
  const land = spec.rows.reduce((a, b) => a + b, 0);
  const total = (r: Record<string, number>) => Object.values(r).reduce((a, b) => a + b, 0);

  it('has one terrain per hex', () => expect(total(spec.terrain)).toBe(land));
  it('has one number per non-desert hex', () =>
    expect(spec.numbers).toHaveLength(land - spec.terrain.desert));
});
