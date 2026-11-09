import { useMemo, useState } from 'react';
import { generateBoard, getContext, scoreBoard, type Settings } from '../../engine';

type Saved = Omit<Settings, 'seed'>;
const KEY = 'catan-gen:settings';
const DEFAULTS: Saved = { specId: 'base', rules: {} };

function load(): Saved {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULTS, ...(JSON.parse(raw) as Partial<Saved>) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

function save(s: Saved) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    // Storage blocked: settings just won't persist.
  }
}

const freshSeed = () => Math.floor(Math.random() * 2 ** 32);

export function useBoard() {
  const [settings, setSettingsState] = useState<Saved>(load);
  const [seed, setSeed] = useState(freshSeed);

  const result = useMemo(() => generateBoard({ ...settings, seed }), [settings, seed]);
  const score = useMemo(() => scoreBoard(result.board), [result.board]);
  const ctx = getContext(settings.specId);

  const setSettings = (next: Saved) => {
    setSettingsState(next);
    save(next);
    setSeed(freshSeed());
  };

  return {
    settings,
    board: result.board,
    unmet: result.unmet,
    score,
    ctx,
    newBoard: () => setSeed(freshSeed()),
    setSpec: (specId: string) => setSettings({ ...settings, specId }),
    setRule: (id: string, on: boolean) =>
      setSettings({ ...settings, rules: { ...settings.rules, [id]: on } }),
  };
}
