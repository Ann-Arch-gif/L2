import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { SITE_NAME } from "@/lib/site";
import type { SiteSettings } from "@/sanity/types";
import { Icon } from "./Icon";

function mapSrc(settings: SiteSettings, lang: Locale) {
  if (settings.mapEmbedUrl) return settings.mapEmbedUrl;
  const query = encodeURIComponent(settings.address || `${SITE_NAME}, Siem Reap`);
  return `https://www.google.com/maps?q=${query}&hl=${lang === "zh" ? "zh-CN" : lang}&z=15&output=embed`;
}

export function Location({ lang, dict, settings }: { lang: Locale; dict: Dictionary; settings: SiteSettings }) {
  const t = dict.location;
  const mapsLink =
    settings.mapLink ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address || "Siem Reap")}`;

  return (
    <section id="location" className="scroll-mt-20 bg-paper">
      <div className="grid lg:grid-cols-[1fr_1.4fr]">
        <div className="reveal flex flex-col justify-center px-5 py-20 sm:px-8 lg:py-28 lg:pl-[max(2rem,calc((100vw-1240px)/2+2rem))] lg:pr-16">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="display mt-4 text-4xl sm:text-5xl">{t.title}</h2>
          <p className="mt-4 text-lg">{t.subtitle}</p>
          {settings.address && (
            <p className="mt-8 flex items-start gap-3 text-ink">
              <Icon name="mapPin" size={20} className="mt-0.5 shrink-0 text-gold" />
              {settings.address}
            </p>
          )}
          <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="link-arrow mt-8 self-start">
            {t.openMaps}
            <Icon name="arrowUpRight" size={16} />
          </a>
        </div>
        <iframe
          title={t.mapTitle}
          src={mapSrc(settings, lang)}
          className="block h-[420px] w-full border-0 grayscale-[30%] lg:h-full lg:min-h-[560px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </section>
  );
}
