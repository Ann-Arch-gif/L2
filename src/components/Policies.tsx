import { site } from "@/lib/content";
import { fmt, type Dictionary } from "@/lib/i18n";
import { Icon, type IconName } from "./Icon";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./motion";

export function Policies({ dict }: { dict: Dictionary }) {
  const p = dict.policies;
  const { policies } = site;

  const rates = [
    policies.electricityRate && fmt(p.electricity, { rate: policies.electricityRate }),
    policies.waterRate && fmt(p.water, { rate: policies.waterRate }),
  ].filter(Boolean);

  const terms: { icon: IconName; label: string; value: string; note?: string }[] = [
    { icon: "calendar", label: p.minLease, value: fmt(p.minLeaseValue, { n: policies.minLeaseMonths }) },
    { icon: "shield", label: p.deposit, value: fmt(p.depositValue, { n: policies.depositMonths }) },
    { icon: "zap", label: p.utilities, value: p.utilitiesValue, note: rates.join(" · ") || undefined },
    { icon: "sofa", label: p.furnished, value: p.furnishedValue },
    { icon: "paw", label: p.pets, value: policies.petsAllowed ? p.petsYes : p.petsNo },
  ];

  return (
    <section id="terms" className="scroll-mt-24 py-20 lg:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <SectionHeading eyebrow={p.eyebrow} title={p.title} align="left" />
          {p.extra.length > 0 && (
            <Reveal className="mt-10 rounded-3xl bg-sage-light/70 p-6 sm:p-7">
              <h3 className="font-display text-xl font-semibold text-ink">{p.extraTitle}</h3>
              <ul className="mt-4 space-y-3">
                {p.extra.map((rule) => (
                  <li key={rule} className="flex gap-3 text-ink/85">
                    <Icon name="checkSquare" size={20} className="mt-0.5 shrink-0 text-sage" />
                    {rule}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>

        <dl className="grid gap-4 sm:grid-cols-2">
          {terms.map((term, i) => (
            <Reveal
              key={term.label}
              variant="tilt"
              index={i}
              className={`card p-6 ${i === terms.length - 1 && terms.length % 2 ? "sm:col-span-2" : ""}`}
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-terracotta/10 text-terracotta">
                <Icon name={term.icon} size={22} />
              </span>
              <dt className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted">{term.label}</dt>
              <dd className="mt-1 text-lg font-medium leading-snug text-ink">{term.value}</dd>
              {term.note && <dd className="mt-2 text-sm text-muted">{term.note}</dd>}
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
