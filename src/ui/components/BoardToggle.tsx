import { specs } from '../../engine';

export function BoardToggle({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Board size"
      className="inline-flex rounded-full bg-sea-deep p-1 ring-1 ring-sand/15"
    >
      {Object.values(specs).map((s) => {
        const on = s.id === value;
        return (
          <button
            key={s.id}
            role="radio"
            aria-checked={on}
            onClick={() => onChange(s.id)}
            className={`min-h-11 rounded-full px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand ${
              on ? 'bg-sand text-ink' : 'text-sand/75 hover:text-sand'
            }`}
          >
            {s.name}
          </button>
        );
      })}
    </div>
  );
}
