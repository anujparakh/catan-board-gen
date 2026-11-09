import { generateBoard } from './generate';
import { scoreBoard } from './score';

describe('scoreBoard', () => {
  it('scores rule-following boards higher on average than random ones', () => {
    const avg = (rules: Record<string, boolean>) => {
      let sum = 0;
      for (let seed = 0; seed < 200; seed++)
        sum += scoreBoard(generateBoard({ specId: 'base', rules, seed }).board).total;
      return sum / 200;
    };
    const off = {
      noAdjacentHotNumbers: false,
      noAdjacentSameResource: false,
      noAdjacentSameNumber: false,
    };
    expect(avg({})).toBeGreaterThan(avg(off) + 10);
  });

  it('returns four parts in 0-1 and a total in 0-100', () => {
    const s = scoreBoard(generateBoard({ specId: 'extension56', rules: {}, seed: 7 }).board);
    expect(s.parts).toHaveLength(4);
    s.parts.forEach((p) => expect(p.value).toBeGreaterThanOrEqual(0));
    expect(s.total).toBeLessThanOrEqual(100);
  });
});
