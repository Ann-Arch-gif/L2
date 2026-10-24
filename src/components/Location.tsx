import { site } from "@/lib/content";
import { tr, type Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { Icon } from "./Icon";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./motion";

function mapSrc(lang: Locale) {
  if (site.map.embedUrl) return site.map.embedUrl;
  const query = encodeURIComponent(site.map.searchQuery || tr(site.address, "en") || site.name);
  const hl = lang === "zh" ? "zh-CN" : lang;
  return `https://www.google.com/maps?q=${query}&hl=${hl}&z=15&output=embed`;
}

export function Location({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const address = tr(site.address, lang);
  const mapsLink =
    site.map.googleMapsLink ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.map.searchQuery || address)}`;

  return (
    <section id="location" className="scroll-mt-24 py-20 lg:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.25fr_0.75fr] lg:gap-14">
        <Reveal className="order-last lg:order-first">
          <div className="overflow-hidden rounded-[2rem] border-4 border-sand-deep bg-sand shadow-[0_30px_60px_-35px_rgba(78,52,36,0.5)]">
            <iframe
              title={dict.location.mapTitle}
              src={mapSrc(lang)}
              className="block aspect-[4/3] w-full lg:aspect-[5/4]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </Reveal>

        <div>
          <SectionHeading
            eyebrow={dict.location.eyebrow}
            title={dict.location.title}
            subtitle={dict.location.subtitle}
            align="left"
          />
          <Reveal>
            {address && (
              <p className="mt-8 flex items-start gap-3 rounded-2xl bg-card p-5 text-ink shadow-sm">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-terracotta text-linen">
                  <Icon name="mapPin" size={20} />
                </span>
                <span className="pt-2 font-medium">{address}</span>
              </p>
            )}
            <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="btn-secondary mt-6">
              {dict.location.openMaps}
              <Icon name="external" size={16} />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
