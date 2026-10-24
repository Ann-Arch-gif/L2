import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RevealObserver } from "@/components/RevealObserver";
import { fontVariables } from "@/lib/fonts";
import { getDictionary } from "@/lib/i18n";
import { hasLocale, htmlLang, locales } from "@/lib/locales";
import { SITE_NAME } from "@/lib/site";
import { getSettings } from "@/sanity/fetch";
import { SanityLive } from "@/sanity/live";
import "../globals.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  return {
    title: { default: dict.meta.title, template: `%s · ${SITE_NAME}` },
    description: dict.meta.description,
    alternates: { languages: Object.fromEntries(locales.map((l) => [htmlLang[l], `/${l}`])) },
    openGraph: { title: dict.meta.title, description: dict.meta.description, siteName: SITE_NAME, type: "website" },
  };
}

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const settings = await getSettings(lang);

  return (
    <html lang={htmlLang[lang]} className={fontVariables} suppressHydrationWarning>
      <head>
        {/* Lets the CSS hide scroll-reveal content only when JavaScript can show it again. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
        >
          {SITE_NAME}
        </a>
        <Header lang={lang} nav={dict.nav} logo={settings.logo} />
        <main id="main">{children}</main>
        <Footer lang={lang} dict={dict} settings={settings} />
        <RevealObserver />
        <SanityLive />
      </body>
    </html>
  );
}
