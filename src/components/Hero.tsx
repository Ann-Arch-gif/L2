import { fmt, formatPrice } from "@/lib/format";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import type { RoomCardData, SiteSettings } from "@/sanity/types";
import { HeroSearch } from "./HeroSearch";
import { Icon, type IconName } from "./Icon";
import { SanityImage } from "./SanityImage";

// Budget steps for the search box, based on the room prices.
function budgetSteps(prices: number[]) {
  if (prices.length === 0) return [];
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const steps: number[] = [];
  for (let v = Math.ceil(min / 100) * 100; v < max; v += 100) steps.push(v);
  steps.push(Math.ceil(max / 50) * 50);
  return [...new Set(steps)];
}

export function Hero({
  lang,
  dict,
  settings,
  rooms,
}: {
  lang: Locale;
  dict: Dictionary;
  settings: SiteSettings;
  rooms: RoomCardData[];
}) {
  const { hero, highlights } = dict;
  const prices = rooms.map((r) => r.priceFrom).filter((p): p is number => typeof p === "number");
  const lowest = prices.length ? Math.min(...prices) : null;

  const items: { icon: IconName; label: string; value: string }[] = [
    ...(lowest !== null
      ? [{ icon: "home" as const, label: highlights.fromLabel, value: fmt(highlights.fromValue, { price: formatPrice(lowest) }) }]
      : []),
    { icon: "sofa", label: highlights.furnishedLabel, value: highlights.furnishedValue },
    {
      icon: "calendar",
      label: highlights.leaseLabel,
      value: fmt(highlights.leaseValue, { n: settings.minLeaseMonths ?? 3 }),
    },
    { icon: "key", label: highlights.familyLabel, value: highlights.familyValue },
  ];

  return (
    <>
      <section className="relative flex min-h-[640px] items-end bg-night h-[92svh]">
        <SanityImage image={settings.heroImage} alt={hero.title} preload sizes="100vw" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/35" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/10 to-transparent" />

        <div className="container-x relative pb-14 pt-32 sm:pb-20">
          <p className="eyebrow !text-white/90">{hero.eyebrow}</p>
          <h1 className="display mt-5 max-w-3xl text-5xl !text-white sm:text-7xl lg:text-[5.5rem]">{hero.title}</h1>
          <p className="mt-5 max-w-xl text-lg text-white/85">{hero.subtitle}</p>
          <div className="mt-10">
            <HeroSearch lang={lang} t={hero} budgets={budgetSteps(prices)} />
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <ul className="container-x grid grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <li
              key={item.label}
              className={`flex items-center gap-4 py-7 lg:py-9 ${i % 2 ? "pl-4 sm:pl-8" : ""} ${
                i > 0 ? "lg:border-l lg:border-line lg:pl-8" : ""
              } ${i < 2 ? "border-b border-line lg:border-b-0" : ""}`}
            >
              <Icon name={item.icon} size={26} className="hidden shrink-0 text-gold sm:block" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{item.label}</p>
                <p className="display mt-1 text-xl sm:text-2xl">{item.value}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
