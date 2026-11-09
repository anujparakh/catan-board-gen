import type { Tile } from '../../engine';
import { terrainTheme } from '../theme/resources';
import { Icon } from './Icon';
import { NumberToken } from './NumberToken';

/** Hexagon around (x, y): pointy-top at 0 degrees, turned clockwise by `turn`. */
export const hexagon = (x: number, y: number, r: number, turn = 0) =>
  Array.from({ length: 6 }, (_, k) => {
    const a = ((60 * k - 30 + turn) * Math.PI) / 180;
    return `${x + r * Math.cos(a)},${y + r * Math.sin(a)}`;
  }).join(' ');

export function HexTile({
  tile,
  x,
  y,
  turn,
  size,
  delay,
}: {
  tile: Tile;
  x: number;
  y: number;
  turn: number;
  size: number;
  delay: number;
}) {
  const theme = terrainTheme[tile.terrain];
  const title = tile.number === null ? theme.label : `${theme.label}, ${tile.number}`;
  return (
    <g className="tile-deal" style={{ animationDelay: `${delay}ms` }}>
      <title>{title}</title>
      <polygon points={hexagon(x, y, size * 0.93, turn)} fill={theme.color} />
      <polygon
        points={hexagon(x, y, size * 0.8, turn)}
        fill="none"
        stroke="rgb(255 255 255 / 0.14)"
        strokeWidth={size * 0.03}
      />
      {tile.number === null ? (
        <Icon body={theme.icon} x={x} y={y} size={size * 0.85} color="rgb(110 60 25 / 0.5)" />
      ) : (
        <>
          <Icon
            body={theme.icon}
            x={x}
            y={y - size * 0.56}
            size={size * 0.42}
            color="rgb(255 255 255 / 0.9)"
          />
          <NumberToken n={tile.number} x={x} y={y + size * 0.12} r={size * 0.44} />
        </>
      )}
    </g>
  );
}
