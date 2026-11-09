import { pips } from '../../engine';

export function NumberToken({ n, x, y, r }: { n: number; x: number; y: number; r: number }) {
  const hot = n === 6 || n === 8;
  const color = hot ? 'var(--color-hot)' : 'var(--color-ink)';
  const count = pips(n);
  const dot = r * 0.085;
  const gap = dot * 2.5;
  return (
    <g aria-hidden="true">
      <circle cx={x} cy={y + r * 0.06} r={r} fill="rgb(0 0 0 / 0.25)" />
      <circle
        cx={x}
        cy={y}
        r={r}
        fill="var(--color-token)"
        stroke="#d9c79c"
        strokeWidth={r * 0.05}
      />
      <text
        x={x}
        y={y + r * 0.12}
        textAnchor="middle"
        fontFamily="var(--font-token)"
        fontWeight={800}
        fontSize={r * (hot ? 1.05 : 0.95)}
        fill={color}
      >
        {n}
      </text>
      {Array.from({ length: count }, (_, i) => (
        <circle
          key={i}
          cx={x + (i - (count - 1) / 2) * gap}
          cy={y + r * 0.55}
          r={dot}
          fill={color}
        />
      ))}
    </g>
  );
}
