import { useState } from 'react';
import { Attribution } from './ui/components/Attribution';
import { BoardToggle } from './ui/components/BoardToggle';
import { BoardView } from './ui/components/BoardView';
import { FairnessCard } from './ui/components/FairnessCard';
import { SettingsPanel } from './ui/components/SettingsPanel';
import { SettingsSheet } from './ui/components/SettingsSheet';
import { useBoard } from './ui/hooks/useBoard';

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand';

export function App() {
  const { settings, board, unmet, score, ctx, newBoard, setSpec, setRule } = useBoard();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [rotation, setRotation] = useState(0);

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
          <div className="relative">
            <BoardView board={board} ctx={ctx} rotation={rotation} />
            <button
              onClick={() => setRotation((r) => (r + 90) % 360)}
              aria-label="Rotate board"
              title="Rotate board"
              className={`absolute top-0 right-0 flex size-11 items-center justify-center rounded-full bg-sea-deep/80 text-sand ring-1 ring-sand/25 hover:bg-sea-deep active:scale-95 ${focusRing}`}
            >
              <svg
                viewBox="0 0 24 24"
                className="size-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 12a8 8 0 1 1-2.34-5.66" />
                <path d="M20 4v5h-5" />
              </svg>
            </button>
          </div>
          {unmet.length > 0 && (
            <p role="status" className="mt-2 rounded-xl bg-brick/25 px-4 py-3 text-sm text-sand">
              Couldn't meet: {unmet.map((r) => r.label.toLowerCase()).join(', ')}. Tap New board to
              try again, or turn a rule off.
            </p>
          )}
          <div className="mt-6 md:hidden">
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
        className="fixed inset-x-0 bottom-0 flex gap-3 bg-sea px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden"
      >
        <button
          onClick={() => setSettingsOpen(true)}
          className={`min-h-12 rounded-full px-5 font-semibold text-sand ring-1 ring-sand/30 ${focusRing}`}
        >
          Settings
        </button>
        {newBoardButton}
      </nav>

      <SettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)}>
        <SettingsPanel values={settings.rules} onChange={setRule} />
      </SettingsSheet>
    </div>
  );
}
