import { cornerPixel, toPixel, type Harbor } from '../../engine';
import { harborLabel, terrainTheme } from '../theme/resources';
import { Icon } from './Icon';

/** Badge just off the coast, joined to the edge's two corners by docks. */
type Pt = { x: number; y: number };

export function HarborMarker({
  harbor,
  size,
  project,
}: {
  harbor: Harbor;
  size: number;
  project: (p: Pt) => Pt;
}) {
  const c = project(toPixel(harbor.hex, size));
  const a = project(cornerPixel(harbor.hex, harbor.edge, size));
  const b = project(cornerPixel(harbor.hex, (harbor.edge + 1) % 6, size));
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const out = 0.55; // distance past the edge, in hex sizes
  const len = Math.hypot(mx - c.x, my - c.y);
  const x = mx + ((mx - c.x) / len) * size * out;
  const y = my + ((my - c.y) / len) * size * out;
  const r = size * 0.38;
  const theme = harbor.type === 'any' ? null : terrainTheme[harbor.type];

  return (
    <g>
      <title>{harborLabel(harbor.type)}</title>
      {[a, b].map((p, i) => (
        <line
          key={i}
          x1={p.x}
          y1={p.y}
          x2={x}
          y2={y}
          stroke="var(--color-sand)"
          strokeWidth={size * 0.11}
          strokeLinecap="round"
        />
      ))}
      <circle
        cx={x}
        cy={y}
        r={r}
        fill={theme ? theme.color : 'var(--color-token)'}
        stroke="var(--color-sand)"
        strokeWidth={size * 0.05}
      />
      {theme ? (
        // The resource icon alone means 2:1; the <title> spells it out.
        <Icon body={theme.icon} x={x} y={y} size={r * 1.3} color="rgb(255 255 255 / 0.95)" />
      ) : (
        <text
          x={x}
          y={y + r * 0.22}
          textAnchor="middle"
          fontWeight={800}
          fontSize={r * 0.72}
          fill="var(--color-ink)"
          aria-hidden="true"
        >
          3:1
        </text>
      )}
    </g>
  );
}
