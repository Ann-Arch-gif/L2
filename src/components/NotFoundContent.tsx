import Link from "next/link";
import { getDictionary } from "@/lib/i18n";
import { locales } from "@/lib/locales";

// 404 pages don't know the visitor's language, so the message is shown in all three.
export function NotFoundContent() {
  return (
    <section className="container-x flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow">404</p>
      <div className="mt-6 space-y-6">
        {locales.map((locale) => {
          const t = getDictionary(locale).notFound;
          return (
            <div key={locale} lang={locale}>
              <h1 className="display text-4xl">{t.title}</h1>
              <p className="mt-1">{t.text}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {locales.map((locale) => (
          <Link key={locale} href={`/${locale}`} lang={locale} className="btn btn-outline">
            {getDictionary(locale).notFound.home}
          </Link>
        ))}
      </div>
    </section>
  );
}
