"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { stagger } from "@/lib/format";
import type { Dictionary } from "@/lib/i18n";
import { LOCALE_COOKIE, localeLabels, localeShortLabels, locales, type Locale } from "@/lib/locales";
import type { SanityImage } from "@/sanity/types";
import { Icon } from "./Icon";
import { Logo } from "./Logo";

function rememberLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}

function useLocaleHref(lang: Locale) {
  const pathname = usePathname() ?? `/${lang}`;
  const rest = pathname.split("/").slice(2).join("/");
  return (locale: Locale) => `/${locale}${rest ? `/${rest}` : ""}`;
}

function LanguageMenu({ lang, label, light }: { lang: Locale; label: string; light: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hrefFor = useLocaleHref(lang);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`flex h-11 items-center gap-1.5 px-2 text-sm font-semibold transition-opacity hover:opacity-75 ${
          light ? "text-white" : "text-ink"
        }`}
      >
        <Icon name="globe" size={17} />
        {localeShortLabels[lang]}
        <Icon
          name="chevronDown"
          size={14}
          className={`transition-transform duration-(--dur-base) ease-(--ease-out) ${open ? "rotate-180" : ""}`}
        />
      </button>
      {/* Always rendered so it can animate out as well as in; hidden from focus while closed. */}
      <div
        data-open={open || undefined}
        inert={!open}
        className="menu-panel absolute right-0 top-full z-50 mt-3 w-52 border border-line bg-white shadow-[0_24px_48px_-20px_rgba(21,24,27,0.35)]"
      >
        <p className="border-b border-line px-5 pb-2.5 pt-3.5 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-muted">
          {label}
        </p>
        <ul className="py-1.5">
          {locales.map((locale, i) => {
            const current = locale === lang;
            return (
              <li key={locale} className="menu-item" style={stagger(i)}>
                <Link
                  href={hrefFor(locale)}
                  lang={locale}
                  hrefLang={locale}
                  aria-current={current ? "true" : undefined}
                  onClick={() => {
                    rememberLocale(locale);
                    setOpen(false);
                  }}
                  className={`group relative flex min-h-11 items-center justify-between gap-4 px-5 text-[0.9375rem] transition-colors duration-(--dur-base) hover:bg-paper ${
                    current ? "font-semibold text-ink" : "text-body hover:text-ink"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`absolute inset-y-2 left-0 w-0.5 bg-gold transition-transform duration-(--dur-base) ease-(--ease-out) ${
                      current ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100"
                    }`}
                  />
                  <span className="transition-transform duration-(--dur-base) ease-(--ease-out) group-hover:translate-x-1">
                    {localeLabels[locale]}
                  </span>
                  <Icon name="check" size={16} className={`text-gold ${current ? "" : "invisible"}`} />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export function Header({ lang, nav, logo }: { lang: Locale; nav: Dictionary["nav"]; logo?: SanityImage | null }) {
  const pathname = usePathname();
  const hrefFor = useLocaleHref(lang);
  const isHome = pathname === `/${lang}`;
  const isRoomPage = pathname?.startsWith(`/${lang}/rooms/`) ?? false;
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  // Solid background once the page moves; tucks away while scrolling down, returns on scroll up.
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > 240);
        lastY = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const overlay = isHome && !scrolled && !open;
  const links = [
    { href: `/${lang}/rooms`, label: nav.rooms },
    { href: `/${lang}#about`, label: nav.about },
    { href: `/${lang}#services`, label: nav.services },
    { href: `/${lang}#location`, label: nav.location },
    { href: `/${lang}#contact`, label: nav.contact },
  ];
  const enquireHref = isRoomPage ? "#contact" : `/${lang}#contact`;

  return (
    <header
      className={`${isHome ? "fixed" : "sticky"} inset-x-0 top-0 z-40 transition-[background-color,border-color,color,transform] duration-500 ease-[var(--ease-out)] ${
        overlay ? "border-b border-white/15 bg-transparent" : "border-b border-line bg-white"
      } ${hidden && !open ? "-translate-y-full" : ""}`}
    >
      <div className="container-x flex h-20 items-center justify-between gap-6">
        <Link href={`/${lang}`} aria-label="L2 Angkor" className="flex min-h-11 shrink-0 items-center">
          <Logo logo={logo} light={overlay} />
        </Link>

        <nav aria-label={nav.menu} className="hidden items-center gap-8 lg:flex">
          {links.map((link) => {
            const active = link.href === `/${lang}/rooms` && pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`hit relative py-2 text-[0.8125rem] font-semibold uppercase tracking-[0.12em] transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform hover:after:scale-x-100 ${
                  overlay ? "text-white" : "text-ink"
                } ${active ? "after:scale-x-100" : ""}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <LanguageMenu lang={lang} label={nav.language} light={overlay} />
          <Link href={enquireHref} className={`btn hidden sm:inline-flex ${overlay ? "btn-light" : "btn-dark"}`}>
            {nav.enquire}
          </Link>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? nav.close : nav.menu}
            onClick={() => setOpen((v) => !v)}
            className={`-mr-1.5 flex size-11 items-center justify-center lg:hidden ${overlay ? "text-white" : "text-ink"}`}
          >
            <Icon name={open ? "x" : "menu"} size={24} />
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="drop-in fixed inset-x-0 bottom-0 top-20 z-40 overflow-y-auto bg-white lg:hidden">
          <nav aria-label={nav.menu} className="container-x flex flex-col py-6">
            <Link href={`/${lang}`} className="stagger-in display border-b border-line py-4 text-3xl">
              {nav.home}
            </Link>
            {links.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                style={stagger(i + 1)}
                className="stagger-in display border-b border-line py-4 text-3xl"
              >
                {link.label}
              </Link>
            ))}
            <div className="stagger-in mt-8 flex flex-wrap gap-2" style={stagger(links.length + 1)}>
              {locales.map((locale) => (
                <Link
                  key={locale}
                  href={hrefFor(locale)}
                  lang={locale}
                  onClick={() => rememberLocale(locale)}
                  className={`border px-4 py-2 text-sm font-semibold transition-colors ${
                    locale === lang ? "border-ink bg-ink text-white" : "border-line text-ink"
                  }`}
                >
                  {localeLabels[locale]}
                </Link>
              ))}
            </div>
            <Link href={enquireHref} onClick={() => setOpen(false)} className="btn btn-dark mt-8">
              {nav.enquire}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
