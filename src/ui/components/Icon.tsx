import { ICON_SIZE } from '../theme/icons';

/** Draws one of our bundled game-icons.net icons, centred on (x, y). */
export function Icon({
  body,
  x,
  y,
  size,
  color,
  opacity,
}: {
  body: string;
  x: number;
  y: number;
  size: number;
  color: string;
  opacity?: number;
}) {
  return (
    <svg
      x={x - size / 2}
      y={y - size / 2}
      width={size}
      height={size}
      viewBox={`0 0 ${ICON_SIZE} ${ICON_SIZE}`}
      color={color}
      opacity={opacity}
      aria-hidden="true"
      // Static, bundled SVG markup from scripts/extract-icons.mjs.
      dangerouslySetInnerHTML={{ __html: body }}
    />
  );
}
