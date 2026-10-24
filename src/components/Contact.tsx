import { getChannels } from "@/lib/channels";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import type { RoomCardData, SiteSettings } from "@/sanity/types";
import { ContactChannels } from "./ContactChannels";
import { InquiryForm } from "./InquiryForm";

export function Contact({
  lang,
  dict,
  settings,
  rooms,
  defaultRoom,
}: {
  lang: Locale;
  dict: Dictionary;
  settings: SiteSettings;
  rooms: RoomCardData[];
  defaultRoom?: string;
}) {
  const t = dict.contact;
  return (
    <section id="contact" className="section scroll-mt-20">
      <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.5fr] lg:gap-24">
        <div className="reveal">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="display mt-4 text-4xl sm:text-5xl">{t.title}</h2>
          <p className="mt-4 text-lg">{t.subtitle}</p>
          <div className="mt-12">
            <ContactChannels
              channels={getChannels(settings, dict)}
              wechat={settings.wechatId ? { id: settings.wechatId, qr: settings.wechatQr } : undefined}
              labels={t}
            />
          </div>
        </div>
        <div className="reveal">
          <InquiryForm
            lang={lang}
            labels={dict.form}
            rooms={rooms.map((r) => ({ slug: r.slug, name: r.name ?? r.slug }))}
            defaultRoom={defaultRoom}
            minLeaseMonths={settings.minLeaseMonths ?? 3}
          />
        </div>
      </div>
    </section>
  );
}
