import { formatPrice, lowestPrice, site, type Room } from "@/lib/content";
import { fmt, type Dictionary } from "@/lib/i18n";
import { HeroIllustration } from "./HeroIllustration";
import { Icon } from "./Icon";
import { Photo } from "./Photo";
import { DriftingGlow, FloatingPetals, HeroTitle, IdleSway, Magnetic } from "./motion";

export function Hero({ dict, rooms }: { dict: Dictionary; rooms: Room[] }) {
  const { hero } = dict;
  const price = lowestPrice(rooms);
  const availableNow = rooms.filter((r) => r.status !== "rented" && r.status !== "soon").length;

  const facts = [
    price !== undefined && { icon: "home" as const, text: fmt(hero.factFrom, { price: formatPrice(price) }) },
    { icon: "sofa" as const, text: hero.factFurnished },
    { icon: "calendar" as const, text: fmt(hero.factMinLease, { months: site.policies.minLeaseMonths }) },
  ].filter(Boolean) as { icon: "home" | "sofa" | "calendar"; text: string }[];

  return (
    <section className="relative -mt-18 overflow-hidden pt-18">
      <DriftingGlow />
      <FloatingPetals />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:pb-28 lg:pt-16">
        <div>
          <p className="eyebrow">{hero.eyebrow}</p>
          <HeroTitle
            text={hero.title}
            className="mt-4 font-display text-[2.6rem] font-semibold leading-[1.08] text-ink sm:text-6xl lg:text-[4.2rem]"
          />
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{hero.subtitle}</p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Magnetic>
              <a href="#rooms" className="btn-primary shimmer">
                {hero.ctaRooms}
                <Icon name="arrowRight" size={18} />
              </a>
            </Magnetic>
            <a href="#contact" className="btn-secondary">
              {hero.ctaContact}
            </a>
          </div>

          <ul className="mt-10 flex flex-wrap gap-2.5">
            {facts.map((fact) => (
              <li key={fact.text} className="chip">
                <Icon name={fact.icon} size={16} className="text-terracotta" />
                {fact.text}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-[26rem]">
          <IdleSway className="relative aspect-[440/520]">
            {site.heroImage ? (
              <div className="absolute inset-0 overflow-hidden rounded-t-[999px] rounded-b-3xl border-4 border-sand-deep">
                <Photo
                  src={site.heroImage}
                  alt={site.name}
                  placeholderLabel={dict.photoPlaceholder}
                  sizes="(min-width: 1024px) 420px, 90vw"
                  preload
                />
              </div>
            ) : (
              <HeroIllustration title={hero.illustration} />
            )}
          </IdleSway>

          {availableNow > 0 && (
            <div className="absolute -bottom-5 -left-2 flex items-center gap-3 rounded-2xl border border-sand-deep bg-card px-4 py-3 shadow-[0_18px_40px_-20px_rgba(78,52,36,0.45)] sm:-left-8">
              <span className="relative flex size-3">
                <span className="status-ping absolute inset-0 rounded-full bg-sage" />
                <span className="relative size-3 rounded-full bg-sage" />
              </span>
              <span className="text-sm font-semibold text-ink">
                {fmt(hero.availableCount, { n: availableNow })}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
