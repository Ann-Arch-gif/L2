import { contactLinks, site, type Room } from "@/lib/content";
import { tr, type Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { ContactChannels, type Channel } from "./ContactChannels";
import { InquiryForm } from "./InquiryForm";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./motion";

export function getChannels(dict: Dictionary): Channel[] {
  const c = site.contact;
  const channels: (Channel | false)[] = [
    !!c.telegram && {
      id: "telegram",
      icon: "telegram",
      label: dict.contact.telegram,
      value: `@${c.telegram.replace(/^@/, "")}`,
      href: contactLinks.telegram(c.telegram),
    },
    !!c.whatsapp && {
      id: "whatsapp",
      icon: "whatsapp",
      label: dict.contact.whatsapp,
      value: `+${c.whatsapp.replace(/\D/g, "")}`,
      href: contactLinks.whatsapp(c.whatsapp, dict.contact.whatsappGreeting),
    },
    !!c.phone && { id: "phone", icon: "phone", label: dict.contact.call, value: c.phone, href: contactLinks.phone(c.phone) },
    !!c.facebook && {
      id: "facebook",
      icon: "facebook",
      label: dict.contact.facebook,
      value: c.facebook.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""),
      href: c.facebook,
    },
    !!c.email && { id: "email", icon: "mail", label: dict.contact.email, value: c.email, href: contactLinks.email(c.email) },
  ];
  return channels.filter((ch): ch is Channel => ch !== false);
}

export function Contact({
  lang,
  dict,
  rooms,
  defaultRoom,
}: {
  lang: Locale;
  dict: Dictionary;
  rooms: Room[];
  defaultRoom?: string;
}) {
  const { contact } = dict;
  return (
    <section id="contact" className="scroll-mt-24 bg-sand/60 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow={contact.eyebrow} title={contact.title} subtitle={contact.subtitle} />
        <div className="mt-14 grid gap-10 lg:grid-cols-[1.45fr_0.55fr] lg:gap-12">
          <Reveal>
            <InquiryForm
              lang={lang}
              labels={dict.form}
              rooms={rooms.map((r) => ({ slug: r.slug, name: tr(r.name, lang) }))}
              defaultRoom={defaultRoom}
              minLeaseMonths={site.policies.minLeaseMonths}
            />
          </Reveal>
          <Reveal index={1}>
            <ContactChannels
              title={contact.channels}
              channels={getChannels(dict)}
              wechat={site.contact.wechatId ? { id: site.contact.wechatId, qr: site.contact.wechatQr } : undefined}
              labels={contact}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
