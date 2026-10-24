import type { IconName } from "@/components/Icon";
import type { SiteSettings } from "@/sanity/types";
import type { Dictionary } from "./i18n";
import { contactLinks } from "./site";

export interface Channel {
  id: string;
  icon: IconName;
  label: string;
  value: string;
  href: string;
}

// Contact buttons for every channel filled in on the admin's settings page.
export function getChannels(s: SiteSettings, dict: Dictionary): Channel[] {
  const t = dict.contact;
  const list: (Channel | false)[] = [
    !!s.telegram && {
      id: "telegram",
      icon: "telegram",
      label: t.telegram,
      value: `@${s.telegram.replace(/^@/, "")}`,
      href: contactLinks.telegram(s.telegram),
    },
    !!s.whatsapp && {
      id: "whatsapp",
      icon: "whatsapp",
      label: t.whatsapp,
      value: `+${s.whatsapp.replace(/\D/g, "")}`,
      href: contactLinks.whatsapp(s.whatsapp, t.whatsappGreeting),
    },
    !!s.phone && { id: "phone", icon: "phone", label: t.call, value: s.phone, href: contactLinks.phone(s.phone) },
    !!s.facebook && {
      id: "facebook",
      icon: "facebook",
      label: t.facebook,
      value: s.facebook.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""),
      href: s.facebook,
    },
    !!s.email && { id: "email", icon: "mail", label: t.email, value: s.email, href: contactLinks.email(s.email) },
  ];
  return list.filter((c): c is Channel => c !== false);
}
