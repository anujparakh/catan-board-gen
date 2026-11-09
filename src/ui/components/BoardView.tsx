import { useLayoutEffect, useRef } from 'react';
import { bounds, toPixel, type Board, type Ctx } from '../../engine';
import { HarborMarker } from './HarborMarker';
import { hexagon, HexTile } from './HexTile';

const HEX_SIZE = 100;

/**
 * The board, turned clockwise by `rotation` degrees (a multiple of 90). Positions are rotated
 * but tokens, icons and badges stay upright, so numbers are always readable.
 */
export function BoardView({
  board,
  ctx,
  rotation,
  className = 'h-auto max-h-[max(18rem,calc(100dvh-17rem))] w-full md:max-h-[calc(100dvh-7rem)]',
}: {
  board: Board;
  ctx: Ctx;
  rotation: number;
  className?: string;
}) {
  const b = bounds(ctx, HEX_SIZE);
  const mid = { x: b.x + b.w / 2, y: b.y + b.h / 2 };
  const rad = (rotation * Math.PI) / 180;
  const project = (p: { x: number; y: number }) => {
    const dx = p.x - mid.x;
    const dy = p.y - mid.y;
    return {
      x: mid.x + dx * Math.cos(rad) - dy * Math.sin(rad),
      y: mid.y + dx * Math.sin(rad) + dy * Math.cos(rad),
    };
  };
  const sideways = rotation % 180 !== 0;
  const w = sideways ? b.h : b.w;
  const h = sideways ? b.w : b.h;
  const centres = board.tiles.map((t) => project(toPixel(t.hex, HEX_SIZE)));

  // Show the turn: start from the previous orientation and swing into place.
  const turnGroup = useRef<SVGGElement>(null);
  const lastRotation = useRef(rotation);
  useLayoutEffect(() => {
    if (lastRotation.current === rotation) return;
    lastRotation.current = rotation;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    turnGroup.current?.animate([{ transform: 'rotate(-90deg)' }, { transform: 'rotate(0deg)' }], {
      duration: 320,
      easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    });
  }, [rotation]);

  return (
    <svg
      // Remount on each new board so the deal animation replays.
      key={`${board.specId}-${board.seed}`}
      viewBox={`${mid.x - w / 2} ${mid.y - h / 2} ${w} ${h}`}
      className={`overflow-visible font-sans ${className}`}
      role="img"
      aria-label="Catan board"
    >
      <g
        ref={turnGroup}
        style={{ transformBox: 'view-box', transformOrigin: `${mid.x}px ${mid.y}px` }}
      >
        {/* Shallow water: every hex much enlarged, rounded, merged around the island. */}
        <g
          fill="var(--color-shallows)"
          stroke="var(--color-shallows)"
          strokeWidth={HEX_SIZE * 0.3}
          strokeLinejoin="round"
        >
          {centres.map((p, i) => (
            <polygon key={i} points={hexagon(p.x, p.y, HEX_SIZE * 1.5, rotation)} />
          ))}
        </g>
        {/* Sand coastline: every hex slightly enlarged, merged into one island. */}
        <g fill="var(--color-sand)">
          {centres.map((p, i) => (
            <polygon key={i} points={hexagon(p.x, p.y, HEX_SIZE * 1.12, rotation)} />
          ))}
        </g>
        {board.harbors.map((hb) => (
          <HarborMarker
            key={`${hb.hex.col},${hb.hex.row},${hb.edge}`}
            harbor={hb}
            size={HEX_SIZE}
            project={project}
          />
        ))}
        {board.tiles.map((t, i) => {
          const p = centres[i]!;
          const dist = Math.hypot(p.x - mid.x, p.y - mid.y) / HEX_SIZE;
          return (
            <HexTile
              key={t.id}
              tile={t}
              x={p.x}
              y={p.y}
              turn={rotation}
              size={HEX_SIZE}
              delay={Math.round(dist * 45)}
            />
          );
        })}
      </g>
    </svg>
  );
}
