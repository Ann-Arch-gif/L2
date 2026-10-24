"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { Icon } from "./Icon";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";

export function Header({
  lang,
  siteName,
  logo,
  nav,
}: {
  lang: Locale;
  siteName: string;
  logo?: string;
  nav: Dictionary["nav"];
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { id: "rooms", label: nav.rooms },
    { id: "about", label: nav.about },
    { id: "how-to-rent", label: nav.howToRent },
    { id: "faq", label: nav.faq },
    { id: "location", label: nav.location },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,box-shadow] duration-300 ${
        scrolled || open ? "bg-linen/90 shadow-[0_6px_24px_-12px_rgba(78,52,36,0.25)] backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href={`/${lang}`} aria-label={siteName} onClick={() => setOpen(false)}>
          <Logo name={siteName} logo={logo} />
        </Link>

        <nav aria-label={nav.menu} className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link key={link.id} href={`/${lang}#${link.id}`} className="nav-pop">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher lang={lang} label={nav.language} />
          <Link href={`/${lang}#contact`} className="btn-primary !px-5 !py-2.5 text-sm">
            {nav.inquire}
          </Link>
        </div>

        <button
          type="button"
          className="flex size-11 items-center justify-center rounded-full text-ink hover:bg-sand lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? nav.close : nav.menu}
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? "x" : "menu"} size={24} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="absolute inset-x-0 top-full overflow-hidden border-t border-sand-deep bg-linen shadow-[0_24px_40px_-20px_rgba(78,52,36,0.35)] lg:hidden"
          >
            <nav aria-label={nav.menu} className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 sm:px-6">
              {[...links, { id: "contact", label: nav.contact }].map((link, i) => (
                <motion.div
                  key={link.id}
                  initial={{ x: -24, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.04 * i, type: "spring", stiffness: 300, damping: 24 }}
                >
                  <Link
                    href={`/${lang}#${link.id}`}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-3 text-lg font-medium text-ink hover:bg-sand"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-sand-deep pt-4">
                <LanguageSwitcher lang={lang} label={nav.language} />
                <Link href={`/${lang}#contact`} onClick={() => setOpen(false)} className="btn-primary text-sm">
                  {nav.inquire}
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
