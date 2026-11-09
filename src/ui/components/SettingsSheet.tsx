import { useEffect, useRef, type ReactNode } from 'react';

const EASE = 'transform 260ms cubic-bezier(0.2, 0.8, 0.2, 1)';
const CLOSE_DISTANCE = 100; // px dragged down before letting go closes the sheet
const CLOSE_SPEED = 0.5; // px/ms, a quick flick closes it too

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Phone bottom sheet: slides up, slides down, and closes when dragged down by its handle. */
export function SettingsSheet({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const drag = useRef<{ startY: number; y: number; t: number } | null>(null);

  // Transform changes go straight to the DOM so dragging never re-renders React.
  const moveTo = (y: string, animate: boolean) => {
    const p = panel.current!;
    p.style.transition = animate && !reducedMotion() ? EASE : 'none';
    p.style.transform = `translate3d(0, ${y}, 0)`;
  };

  useEffect(() => {
    const d = dialog.current!;
    if (open && !d.open) {
      d.showModal();
      moveTo('100%', false);
      panel.current!.getBoundingClientRect(); // commit the start position before animating
      moveTo('0px', true);
    } else if (!open && d.open) {
      d.close();
    }
  }, [open]);

  const close = () => {
    moveTo('100%', true);
    window.setTimeout(onClose, reducedMotion() ? 0 : 260);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { startY: e.clientY, y: 0, t: performance.now() };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    drag.current.y = Math.max(0, e.clientY - drag.current.startY);
    moveTo(`${drag.current.y}px`, false);
  };
  const onPointerUp = () => {
    if (!drag.current) return;
    const { y, t } = drag.current;
    drag.current = null;
    if (y > CLOSE_DISTANCE || y / (performance.now() - t) > CLOSE_SPEED) close();
    else moveTo('0px', true);
  };

  return (
    <dialog
      ref={dialog}
      className="sheet md:hidden"
      aria-label="Settings"
      onClick={(e) => e.target === e.currentTarget && close()}
      onCancel={(e) => {
        e.preventDefault(); // Esc: animate out instead of vanishing
        close();
      }}
    >
      <div
        ref={panel}
        className="flex max-h-[85dvh] flex-col rounded-t-3xl bg-sea-deep text-sand will-change-transform"
      >
        <div
          className="flex h-11 shrink-0 cursor-grab touch-none items-center justify-center active:cursor-grabbing"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          aria-hidden="true"
        >
          <div className="h-1.5 w-10 rounded-full bg-sand/30" />
        </div>
        <div className="overflow-y-auto overscroll-contain px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          {children}
          <button
            onClick={close}
            className="mt-4 min-h-12 w-full rounded-full bg-sand font-bold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand"
          >
            Done
          </button>
        </div>
      </div>
    </dialog>
  );
}
