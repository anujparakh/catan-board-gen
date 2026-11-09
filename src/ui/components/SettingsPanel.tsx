import { rules } from '../../engine';

export function SettingsPanel({
  values,
  onChange,
}: {
  values: Record<string, boolean>;
  onChange: (id: string, on: boolean) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-lg font-bold text-sand">Balance</legend>
      <ul className="divide-y divide-sand/10">
        {rules.map((r) => {
          const on = values[r.id] ?? r.defaultOn;
          const id = `rule-${r.id}`;
          return (
            <li key={r.id}>
              <label htmlFor={id} className="flex min-h-14 cursor-pointer items-center gap-4 py-3">
                <span className="flex-1">
                  <span className="block font-semibold text-sand">{r.label}</span>
                  <span className="block text-sm text-sand/65">{r.description}</span>
                </span>
                <input
                  id={id}
                  type="checkbox"
                  role="switch"
                  checked={on}
                  onChange={(e) => onChange(r.id, e.target.checked)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden="true"
                  className="relative h-7 w-12 shrink-0 rounded-full bg-sand/20 transition-colors peer-checked:bg-wheat peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-sand after:absolute after:top-1 after:left-1 after:size-5 after:rounded-full after:bg-token after:transition-transform peer-checked:after:translate-x-5"
                />
              </label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}
