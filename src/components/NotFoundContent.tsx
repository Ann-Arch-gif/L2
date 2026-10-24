import Link from "next/link";
import { getDictionary } from "@/lib/i18n";
import { locales } from "@/lib/locales";
import { Icon } from "./Icon";

// 404 pages don't know the visitor's language, so the message is shown in all three.
export function NotFoundContent() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-24 text-center">
      <p className="font-display text-8xl font-semibold text-terracotta/30">404</p>
      <div className="mt-6 space-y-5">
        {locales.map((locale) => {
          const t = getDictionary(locale).notFound;
          return (
            <div key={locale} lang={locale}>
              <h1 className="font-display text-2xl font-semibold text-ink">{t.title}</h1>
              <p className="mt-1 text-muted">{t.text}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {locales.map((locale) => (
          <Link key={locale} href={`/${locale}`} lang={locale} className="btn-secondary text-sm">
            <Icon name="home" size={16} />
            {getDictionary(locale).notFound.home}
          </Link>
        ))}
      </div>
    </section>
  );
}
