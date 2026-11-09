import { useRef } from 'react';
import { Attribution } from './ui/components/Attribution';
import { BoardToggle } from './ui/components/BoardToggle';
import { BoardView } from './ui/components/BoardView';
import { FairnessCard } from './ui/components/FairnessCard';
import { SettingsPanel } from './ui/components/SettingsPanel';
import { useBoard } from './ui/hooks/useBoard';

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand';

export function App() {
  const { settings, board, unmet, score, ctx, newBoard, setSpec, setRule } = useBoard();
  const sheet = useRef<HTMLDialogElement>(null);

  const newBoardButton = (
    <button
      onClick={newBoard}
      className={`min-h-12 flex-1 rounded-full bg-wheat px-6 text-base font-bold text-ink shadow-[0_3px_0_#a67a17] transition active:translate-y-0.5 active:shadow-[0_1px_0_#a67a17] ${focusRing}`}
    >
      New board
    </button>
  );

  return (
    <div className="mx-auto flex min-h-dvh max-w-6xl flex-col px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-28 md:pb-8">
      <header className="flex flex-wrap items-center justify-between gap-3 pb-3">
        <h1 className="text-xl font-extrabold tracking-tight text-sand md:text-2xl">
          Catan board generator
        </h1>
        <BoardToggle value={settings.specId} onChange={setSpec} />
      </header>

      <div className="flex flex-1 flex-col md:grid md:grid-cols-[1fr_22rem] md:items-start md:gap-10">
        <main className="flex flex-1 flex-col justify-center">
          <BoardView board={board} ctx={ctx} />
          {unmet.length > 0 && (
            <p role="status" className="mt-2 rounded-xl bg-brick/25 px-4 py-3 text-sm text-sand">
              Couldn't meet: {unmet.map((r) => r.label.toLowerCase()).join(', ')}. Tap New board to
              try again, or turn a rule off.
            </p>
          )}
          <div className="mt-3 md:hidden">
            <FairnessCard score={score} />
          </div>
        </main>

        <aside className="hidden space-y-8 md:sticky md:top-6 md:block">
          <div className="flex">{newBoardButton}</div>
          <FairnessCard score={score} />
          <SettingsPanel values={settings.rules} onChange={setRule} />
          <Attribution />
        </aside>
      </div>

      <div className="mt-6 md:hidden">
        <Attribution />
      </div>

      {/* Phone action bar */}
      <nav
        aria-label="Board actions"
        className="fixed inset-x-0 bottom-0 flex gap-3 bg-sea/90 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden"
      >
        <button
          onClick={() => sheet.current?.showModal()}
          className={`min-h-12 rounded-full px-5 font-semibold text-sand ring-1 ring-sand/30 ${focusRing}`}
        >
          Settings
        </button>
        {newBoardButton}
      </nav>

      <dialog
        ref={sheet}
        className="sheet md:hidden"
        aria-label="Settings"
        onClick={(e) => e.target === e.currentTarget && sheet.current?.close()}
      >
        <div className="rounded-t-3xl bg-sea-deep px-5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-sand">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-sand/25" aria-hidden="true" />
          <SettingsPanel values={settings.rules} onChange={setRule} />
          <button
            onClick={() => sheet.current?.close()}
            className={`mt-4 min-h-12 w-full rounded-full bg-sand font-bold text-ink ${focusRing}`}
          >
            Done
          </button>
        </div>
      </dialog>
    </div>
  );
}
