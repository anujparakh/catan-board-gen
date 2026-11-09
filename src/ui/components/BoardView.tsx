import { bounds, toPixel, type Board, type Ctx } from '../../engine';
import { HarborMarker } from './HarborMarker';
import { hexagon, HexTile } from './HexTile';

const HEX_SIZE = 100;

export function BoardView({ board, ctx }: { board: Board; ctx: Ctx }) {
  const { x, y, w, h } = bounds(ctx, HEX_SIZE);
  const mid = { x: x + w / 2, y: y + h / 2 };
  return (
    <svg
      // Remount on each new board so the deal animation replays.
      key={`${board.specId}-${board.seed}`}
      viewBox={`${x} ${y} ${w} ${h}`}
      className="h-auto max-h-[72dvh] w-full font-sans md:max-h-[calc(100dvh-8rem)]"
      role="img"
      aria-label="Catan board"
    >
      {/* Sand coastline: every hex slightly enlarged, merged into one island. */}
      <g fill="var(--color-sand)">
        {board.tiles.map((t) => {
          const p = toPixel(t.hex, HEX_SIZE);
          return <polygon key={t.id} points={hexagon(p.x, p.y, HEX_SIZE * 1.12)} />;
        })}
      </g>
      {board.harbors.map((hb) => (
        <HarborMarker key={`${hb.hex.col},${hb.hex.row},${hb.edge}`} harbor={hb} size={HEX_SIZE} />
      ))}
      {board.tiles.map((t) => {
        const p = toPixel(t.hex, HEX_SIZE);
        const dist = Math.hypot(p.x - mid.x, p.y - mid.y) / HEX_SIZE;
        return <HexTile key={t.id} tile={t} size={HEX_SIZE} delay={Math.round(dist * 45)} />;
      })}
    </svg>
  );
}
