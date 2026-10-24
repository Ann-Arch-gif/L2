import Link from "next/link";
import { site } from "@/lib/content";
import { tr, type Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { getChannels } from "./Contact";
import { Icon } from "./Icon";
import { Logo } from "./Logo";

export function Footer({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const channels = getChannels(dict);
  const links = [
    { id: "rooms", label: dict.nav.rooms },
    { id: "about", label: dict.nav.about },
    { id: "how-to-rent", label: dict.nav.howToRent },
    { id: "faq", label: dict.nav.faq },
    { id: "location", label: dict.nav.location },
    { id: "contact", label: dict.nav.contact },
  ];

  return (
    <footer className="relative overflow-hidden bg-ink text-linen/80">
      <div aria-hidden="true" className="lattice-light absolute inset-0 opacity-[0.06]" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Logo name={site.name} logo={site.logo} light />
          <p className="mt-4 max-w-xs text-sm leading-relaxed">{dict.footer.tagline}</p>
          {site.address && (
            <p className="mt-4 flex items-start gap-2 text-sm">
              <Icon name="mapPin" size={16} className="mt-0.5 shrink-0 text-saffron" />
              {tr(site.address, lang)}
            </p>
          )}
        </div>

        <nav aria-label={dict.nav.menu}>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm md:grid-cols-1">
            {links.map((link) => (
              <li key={link.id}>
                <Link href={`/${lang}#${link.id}`} className="hover:text-saffron">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {channels.length > 0 && (
          <ul className="space-y-2.5 text-sm">
            {channels.map((c) => (
              <li key={c.id}>
                <a
                  href={c.href}
                  target={c.href?.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 hover:text-saffron"
                >
                  <Icon name={c.icon} size={16} className="text-saffron" />
                  {c.value}
                </a>
              </li>
            ))}
            {site.contact.wechatId && (
              <li className="flex items-center gap-2.5">
                <Icon name="wechat" size={16} className="text-saffron" />
                {dict.contact.wechat}: {site.contact.wechatId}
              </li>
            )}
          </ul>
        )}
      </div>
      <div className="relative border-t border-linen/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-linen/60 sm:px-6">
          © {new Date().getFullYear()} {site.name}. {dict.footer.rights}
        </p>
      </div>
    </footer>
  );
}
