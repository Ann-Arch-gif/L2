import { notFound } from "next/navigation";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Faq } from "@/components/Faq";
import { Gallery } from "@/components/Gallery";
import { Hero } from "@/components/Hero";
import { HowToRent } from "@/components/HowToRent";
import { Location } from "@/components/Location";
import { Payment } from "@/components/Payment";
import { Policies } from "@/components/Policies";
import { Rooms } from "@/components/Rooms";
import { getRooms } from "@/lib/content";
import { getDictionary } from "@/lib/i18n";
import { hasLocale } from "@/lib/locales";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const rooms = getRooms();

  return (
    <>
      <Hero dict={dict} rooms={rooms} />
      <Rooms lang={lang} dict={dict} rooms={rooms} />
      <About dict={dict} />
      <Gallery lang={lang} dict={dict} />
      <HowToRent dict={dict} />
      <Policies dict={dict} />
      <Payment dict={dict} />
      <Faq dict={dict} />
      <Location lang={lang} dict={dict} />
      <Contact lang={lang} dict={dict} rooms={rooms} />
    </>
  );
}
