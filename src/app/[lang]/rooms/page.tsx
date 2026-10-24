import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageTransition } from "@/components/PageTransition";
import { RoomsExplorer } from "@/components/RoomsExplorer";
import { getDictionary } from "@/lib/i18n";
import { hasLocale } from "@/lib/locales";
import { getRooms } from "@/sanity/fetch";

export async function generateMetadata({ params }: PageProps<"/[lang]/rooms">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  return { title: dict.meta.roomsTitle, description: dict.rooms.subtitle };
}

export default async function RoomsPage({ params }: PageProps<"/[lang]/rooms">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const rooms = await getRooms(lang);

  return (
    <PageTransition>
      <section className="border-b border-line bg-paper">
        <div className="container-x py-14 lg:py-20">
          <nav aria-label="Breadcrumb" className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
            <Link href={`/${lang}`} className="hit hover:text-ink">
              {dict.room.home}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink">{dict.nav.rooms}</span>
          </nav>
          <h1 className="display mt-6 text-5xl sm:text-6xl">{dict.rooms.title}</h1>
          <p className="mt-4 max-w-2xl text-lg">{dict.rooms.subtitle}</p>
        </div>
      </section>
      <RoomsExplorer
        lang={lang}
        rooms={rooms}
        t={dict.rooms}
        furnitureLabels={dict.furnitureItems}
        serviceLabels={dict.serviceItems}
        placeholder={dict.photoPlaceholder}
        closeLabel={dict.nav.close}
        picker={dict.picker}
      />
    </PageTransition>
  );
}
