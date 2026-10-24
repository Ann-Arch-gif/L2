import { fmt } from "@/lib/format";
import type { Dictionary } from "@/lib/i18n";
import type { SiteSettings } from "@/sanity/types";
import { Icon, type IconName } from "./Icon";

export function leaseTerms(dict: Dictionary, settings: SiteSettings) {
  const t = dict.terms;
  const rates = [
    settings.electricityRate && fmt(t.electricity, { rate: settings.electricityRate }),
    settings.waterRate && fmt(t.water, { rate: settings.waterRate }),
  ].filter(Boolean);

  return [
    { icon: "calendar", label: t.minLease, value: fmt(t.minLeaseValue, { n: settings.minLeaseMonths ?? 3 }) },
    { icon: "shield", label: t.deposit, value: fmt(t.depositValue, { n: settings.depositMonths ?? 1 }) },
    { icon: "zap", label: t.utilities, value: t.utilitiesValue, note: rates.join(" · ") || undefined },
    { icon: "sofa", label: t.furnished, value: t.furnishedValue },
    { icon: "paw", label: t.pets, value: settings.petsAllowed === "yes" ? t.petsYes : t.petsNo },
  ] satisfies { icon: IconName; label: string; value: string; note?: string }[];
}

export function TermsFaq({ dict, settings }: { dict: Dictionary; settings: SiteSettings }) {
  const { terms, faq } = dict;
  return (
    <section id="terms" className="section scroll-mt-20">
      <div className="container-x grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <div className="reveal">
          <p className="eyebrow">{terms.eyebrow}</p>
          <h2 className="display mt-4 text-4xl sm:text-5xl">{terms.title}</h2>
          <dl className="mt-10 divide-y divide-line border-y border-line">
            {leaseTerms(dict, settings).map((term) => (
              <div key={term.label} className="flex gap-5 py-5">
                <Icon name={term.icon} size={22} className="mt-0.5 shrink-0 text-gold" />
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{term.label}</dt>
                  <dd className="mt-1 text-ink">{term.value}</dd>
                  {"note" in term && term.note && <dd className="mt-1 text-sm text-muted">{term.note}</dd>}
                </div>
              </div>
            ))}
          </dl>
          {terms.rules.length > 0 && (
            <>
              <h3 className="display mt-12 text-2xl">{terms.houseRules}</h3>
              <ul className="mt-5 space-y-3">
                {terms.rules.map((rule) => (
                  <li key={rule} className="flex gap-3">
                    <Icon name="check" size={18} className="mt-1 shrink-0 text-gold" />
                    {rule}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div id="faq" className="reveal scroll-mt-20">
          <p className="eyebrow">{faq.eyebrow}</p>
          <h2 className="display mt-4 text-4xl sm:text-5xl">{faq.title}</h2>
          <div className="mt-10 border-t border-line">
            {faq.items.map((item) => (
              <details key={item.q} className="faq-item group border-b border-line">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-[1.0625rem] font-semibold text-ink">
                  {item.q}
                  <span className="relative size-4 shrink-0">
                    <Icon name="plus" size={16} className="absolute inset-0 transition-transform duration-300 group-open:rotate-45" />
                  </span>
                </summary>
                <p className="pb-6 pr-10 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
