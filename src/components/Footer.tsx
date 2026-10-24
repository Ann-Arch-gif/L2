import Link from "next/link";
import { getChannels } from "@/lib/channels";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { SITE_NAME } from "@/lib/site";
import type { SiteSettings } from "@/sanity/types";
import { Icon } from "./Icon";
import { Logo } from "./Logo";

export function Footer({ lang, dict, settings }: { lang: Locale; dict: Dictionary; settings: SiteSettings }) {
  const channels = getChannels(settings, dict);
  const links = [
    { href: `/${lang}/rooms`, label: dict.nav.rooms },
    { href: `/${lang}#about`, label: dict.nav.about },
    { href: `/${lang}#services`, label: dict.nav.services },
    { href: `/${lang}#location`, label: dict.nav.location },
    { href: `/${lang}#contact`, label: dict.nav.contact },
  ];

  return (
    <footer className="bg-night text-white/70">
      <div className="container-x grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1.2fr] lg:py-20">
        <div>
          <Logo logo={settings.logo} light />
          <p className="mt-6 max-w-xs text-sm leading-relaxed">{dict.footer.tagline}</p>
          {settings.address && (
            <p className="mt-5 flex items-start gap-2.5 text-sm">
              <Icon name="mapPin" size={17} className="mt-0.5 shrink-0 text-gold-light" />
              {settings.address}
            </p>
          )}
        </div>

        <nav aria-label={dict.footer.explore}>
          <p className="eyebrow !text-gold-light">{dict.footer.explore}</p>
          <ul className="mt-3 text-sm">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="flex min-h-11 items-center transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {(channels.length > 0 || settings.wechatId) && (
          <div>
            <p className="eyebrow !text-gold-light">{dict.footer.contact}</p>
            <ul className="mt-3 text-sm">
              {channels.map((c) => (
                <li key={c.id}>
                  <a
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="flex min-h-11 items-center gap-3 transition-colors hover:text-white"
                  >
                    <Icon name={c.icon} size={16} className="text-gold-light" />
                    {c.value}
                  </a>
                </li>
              ))}
              {settings.wechatId && (
                <li className="flex min-h-11 items-center gap-3">
                  <Icon name="wechat" size={16} className="text-gold-light" />
                  {dict.contact.wechat}: {settings.wechatId}
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col justify-between gap-2 py-6 text-xs text-white/50 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}. {dict.footer.rights}
          </p>
          <a href="/admin" className="hit hover:text-white">
            Admin
          </a>
        </div>
      </div>
    </footer>
  );
}
