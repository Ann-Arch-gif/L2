import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { FloatingContact } from "@/components/FloatingContact";
import { Header } from "@/components/Header";
import { getChannels } from "@/components/Contact";
import { MotionProvider } from "@/components/motion";
import { site } from "@/lib/content";
import { fontVariables } from "@/lib/fonts";
import { getDictionary } from "@/lib/i18n";
import { hasLocale, htmlLang, locales } from "@/lib/locales";
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
    title: { default: dict.meta.title, template: `%s · ${site.name}` },
    description: dict.meta.description,
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [htmlLang[l], `/${l}`])),
    },
    openGraph: { title: dict.meta.title, description: dict.meta.description, siteName: site.name, type: "website" },
  };
}

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const quickChannels = getChannels(dict).filter((c) => ["telegram", "whatsapp", "phone"].includes(c.id));

  return (
    <html lang={htmlLang[lang]} className={fontVariables}>
      <body className="min-h-dvh">
        <MotionProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-linen"
          >
            {site.name}
          </a>
          <Header lang={lang} siteName={site.name} logo={site.logo} nav={dict.nav} />
          <main id="main">{children}</main>
          <Footer lang={lang} dict={dict} />
          <FloatingContact label={dict.contact.floatingLabel} close={dict.contact.close} channels={quickChannels} />
        </MotionProvider>
      </body>
    </html>
  );
}
