import Link from "next/link";
import { notFound } from "next/navigation";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Gallery } from "@/components/Gallery";
import { Hero } from "@/components/Hero";
import { HowToRent } from "@/components/HowToRent";
import { Icon } from "@/components/Icon";
import { Location } from "@/components/Location";
import { Payment } from "@/components/Payment";
import { RoomCard } from "@/components/RoomCard";
import { SectionHeader } from "@/components/SectionHeader";
import { Services } from "@/components/Services";
import { TermsFaq } from "@/components/TermsFaq";
import { getDictionary } from "@/lib/i18n";
import { hasLocale } from "@/lib/locales";
import { byAvailability } from "@/lib/room-utils";
import { getRooms, getSettings } from "@/sanity/fetch";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const [rooms, settings] = await Promise.all([getRooms(lang), getSettings(lang)]);

  // Rooms marked "Show on home page", topped up with others so there are always three.
  const featured = [...rooms.filter((r) => r.featured), ...[...rooms].sort(byAvailability).filter((r) => !r.featured)].slice(0, 3);

  return (
    <>
      <Hero lang={lang} dict={dict} settings={settings} rooms={rooms} />

      {featured.length > 0 && (
        <section id="rooms" className="section scroll-mt-20">
          <div className="container-x">
            <SectionHeader
              eyebrow={dict.featured.eyebrow}
              title={dict.featured.title}
              action={
                <Link href={`/${lang}/rooms`} className="link-arrow self-start md:self-auto">
                  {dict.featured.viewAll}
                  <Icon name="arrowRight" size={16} />
                </Link>
              }
            />
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((room) => (
                <div key={room._id} className="reveal">
                  <RoomCard room={room} lang={lang} t={dict.rooms} placeholder={dict.photoPlaceholder} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <About dict={dict} settings={settings} />
      <Services dict={dict} services={settings.sharedServices ?? []} />
      <Gallery dict={dict} settings={settings} />
      <HowToRent dict={dict} />
      <TermsFaq dict={dict} settings={settings} />
      <Payment dict={dict} settings={settings} />
      <Location lang={lang} dict={dict} settings={settings} />
      <Contact lang={lang} dict={dict} settings={settings} rooms={rooms} />
    </>
  );
}
