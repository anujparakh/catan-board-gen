import type { FairnessScore } from '../../engine';

const tone = { Great: 'bg-sheep', Good: 'bg-wheat', Uneven: 'bg-brick' } as const;

export function ScoreBadge({ score }: { score: FairnessScore }) {
  return (
    <span className="flex items-baseline gap-2">
      <span className="font-token text-3xl leading-none font-extrabold text-token">
        {score.total}
      </span>
      <span className="flex items-center gap-1.5 text-sm font-semibold text-sand/80">
        <span className={`size-2 rounded-full ${tone[score.label]}`} aria-hidden="true" />
        {score.label}
      </span>
    </span>
  );
}

export function FairnessParts({ score }: { score: FairnessScore }) {
  return (
    <ul className="space-y-3">
      {score.parts.map((p) => (
        <li key={p.id}>
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-semibold text-sand">{p.label}</span>
            <span className="text-sand/60 tabular-nums">{Math.round(p.value * 100)}</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-sand/10">
            <div
              className="h-full rounded-full bg-sand/70"
              style={{ width: `${p.value * 100}%` }}
            />
          </div>
          <p className="mt-1 text-sm text-sand/65">{p.detail}</p>
        </li>
      ))}
    </ul>
  );
}

/** Phone: a tappable pill that opens the breakdown. Desktop: always open. */
export function FairnessCard({ score }: { score: FairnessScore }) {
  return (
    <>
      <details className="group rounded-2xl bg-sea-deep/70 ring-1 ring-sand/10 md:hidden">
        <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between px-4 focus-visible:outline-2 focus-visible:outline-sand [&::-webkit-details-marker]:hidden">
          <span className="text-sm font-semibold text-sand/70">Fairness</span>
          <span className="flex items-center gap-3">
            <ScoreBadge score={score} />
            <span
              className="text-sand/50 transition-transform group-open:rotate-180"
              aria-hidden="true"
            >
              ▾
            </span>
          </span>
        </summary>
        <div className="px-4 pb-4">
          <FairnessParts score={score} />
        </div>
      </details>
      <section className="hidden md:block" aria-labelledby="fairness-heading">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 id="fairness-heading" className="text-lg font-bold text-sand">
            Fairness
          </h2>
          <ScoreBadge score={score} />
        </div>
        <FairnessParts score={score} />
      </section>
    </>
  );
}
