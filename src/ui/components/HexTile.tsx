import { toPixel, type Tile } from '../../engine';
import { terrainTheme } from '../theme/resources';
import { Icon } from './Icon';
import { NumberToken } from './NumberToken';

/** Pointy-top hexagon around (x, y). */
export const hexagon = (x: number, y: number, r: number) =>
  Array.from({ length: 6 }, (_, k) => {
    const a = ((60 * k - 30) * Math.PI) / 180;
    return `${x + r * Math.cos(a)},${y + r * Math.sin(a)}`;
  }).join(' ');

export function HexTile({ tile, size, delay }: { tile: Tile; size: number; delay: number }) {
  const theme = terrainTheme[tile.terrain];
  const { x, y } = toPixel(tile.hex, size);
  const title = tile.number === null ? theme.label : `${theme.label}, ${tile.number}`;
  return (
    <g className="tile-deal" style={{ animationDelay: `${delay}ms` }}>
      <title>{title}</title>
      <polygon points={hexagon(x, y, size * 0.93)} fill={theme.color} />
      <polygon
        points={hexagon(x, y, size * 0.8)}
        fill="none"
        stroke="rgb(255 255 255 / 0.14)"
        strokeWidth={size * 0.03}
      />
      {tile.number === null ? (
        <Icon body={theme.icon} x={x} y={y} size={size * 0.85} color="rgb(80 55 20 / 0.45)" />
      ) : (
        <>
          <Icon
            body={theme.icon}
            x={x}
            y={y - size * 0.48}
            size={size * 0.58}
            color="rgb(255 255 255 / 0.9)"
          />
          <NumberToken n={tile.number} x={x} y={y + size * 0.14} r={size * 0.36} />
        </>
      )}
    </g>
  );
}
