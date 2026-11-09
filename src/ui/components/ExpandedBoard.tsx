import { useEffect, useRef } from 'react';
import type { Board, Ctx } from '../../engine';
import { CloseIcon, DieIcon, RotateIcon } from './ActionIcons';
import { BoardView } from './BoardView';

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand';
const round = `flex items-center justify-center rounded-full active:scale-95 ${focusRing}`;
const quiet = `${round} size-12 bg-sea-deep/85 text-sand ring-1 ring-sand/25`;

/**
 * The board filling the whole screen, with floating controls. Uses the browser's real
 * fullscreen where allowed (Android, desktop) so the address bar goes away too; iPhone Safari
 * doesn't allow that for pages, so there it just covers the page.
 */
export function ExpandedBoard({
  board,
  ctx,
  rotation,
  onRotate,
  onNewBoard,
  onClose,
}: {
  board: Board;
  ctx: Ctx;
  rotation: number;
  onRotate: () => void;
  onNewBoard: () => void;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialog.current;
    if (d && !d.open) d.showModal();
    document.documentElement.requestFullscreen?.().catch(() => {});
    return () => {
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    };
  }, []);

  return (
    <dialog
      ref={dialog}
      aria-label="Board, full screen"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none border-0 bg-sea p-0"
    >
      <div className="flex h-full w-full items-center justify-center px-[max(0.5rem,env(safe-area-inset-left),env(safe-area-inset-right))] py-[max(0.5rem,env(safe-area-inset-top),env(safe-area-inset-bottom))]">
        <BoardView board={board} ctx={ctx} rotation={rotation} className="h-full w-full" />
      </div>

      <button
        onClick={onClose}
        aria-label="Exit full screen"
        title="Exit full screen"
        className={`${quiet} absolute top-[max(0.75rem,env(safe-area-inset-top))] left-[max(0.75rem,env(safe-area-inset-left))]`}
      >
        <CloseIcon />
      </button>

      <button
        onClick={onRotate}
        aria-label="Rotate board"
        title="Rotate board"
        className={`${quiet} absolute top-[max(0.75rem,env(safe-area-inset-top))] right-[max(0.75rem,env(safe-area-inset-right))]`}
      >
        <RotateIcon />
      </button>

      <button
        onClick={onNewBoard}
        aria-label="New board"
        title="New board"
        className={`${round} absolute right-[max(0.75rem,env(safe-area-inset-right))] bottom-[max(0.75rem,env(safe-area-inset-bottom))] size-14 bg-wheat text-ink shadow-[0_3px_0_#a67a17] active:shadow-[0_1px_0_#a67a17]`}
      >
        <DieIcon />
      </button>
    </dialog>
  );
}
