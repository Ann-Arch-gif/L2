"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALE_COOKIE, localeLabels, localeShortLabels, locales, type Locale } from "@/lib/locales";

function rememberLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}

export function LanguageSwitcher({ lang, label }: { lang: Locale; label: string }) {
  const pathname = usePathname() ?? `/${lang}`;
  const rest = pathname.split("/").slice(2).join("/");

  return (
    <nav aria-label={label} className="flex items-center rounded-full border border-sand-deep bg-card/70 p-1">
      {locales.map((locale) => {
        const active = locale === lang;
        return (
          <Link
            key={locale}
            href={`/${locale}${rest ? `/${rest}` : ""}`}
            hrefLang={locale}
            lang={locale}
            title={localeLabels[locale]}
            aria-current={active ? "true" : undefined}
            onClick={() => rememberLocale(locale)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              active ? "bg-terracotta text-linen" : "text-muted hover:text-terracotta"
            }`}
          >
            {localeShortLabels[locale]}
          </Link>
        );
      })}
    </nav>
  );
}
