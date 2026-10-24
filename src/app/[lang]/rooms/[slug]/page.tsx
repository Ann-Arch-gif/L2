import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageTransition } from "@/components/PageTransition";
import { Contact } from "@/components/Contact";
import { Icon, type IconName } from "@/components/Icon";
import { RoomCard } from "@/components/RoomCard";
import { RoomGallery } from "@/components/RoomGallery";
import { StatusBadge } from "@/components/StatusBadge";
import { leaseTerms } from "@/components/TermsFaq";
import { getChannels } from "@/lib/channels";
import { fmt, formatPrice, stagger } from "@/lib/format";
import { getDictionary } from "@/lib/i18n";
import { hasLocale } from "@/lib/locales";
import {
  bathroomsLabel,
  bedroomsLabel,
  byAvailability,
  capacityLabel,
  featureLabel,
  furnitureIcons,
  roomStatus,
  serviceIcons,
} from "@/lib/room-utils";
import { urlFor } from "@/sanity/image";
import { getRoom, getRooms, getRoomSlugs, getSettings } from "@/sanity/fetch";

export async function generateStaticParams() {
  const slugs = await getRoomSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/rooms/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const room = await getRoom(lang, slug);
  if (!room) return {};
  const image = room.photos?.[0];
  return {
    title: room.name ?? undefined,
    description: room.summary ?? undefined,
    openGraph: image?.asset ? { images: [urlFor(image).width(1200).height(630).url()] } : undefined,
  };
}

function FeatureList({ items }: { items: { key: string; icon: IconName; label: string }[] }) {
  return (
    <ul className="mt-6 grid gap-x-10 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item.key} className="flex items-center gap-4 border-b border-line py-3.5 text-ink">
          <Icon name={item.icon} size={22} className="shrink-0 text-gold" />
          {item.label}
        </li>
      ))}
    </ul>
  );
}

export default async function RoomPage({ params }: PageProps<"/[lang]/rooms/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const [room, rooms, settings] = await Promise.all([getRoom(lang, slug), getRooms(lang), getSettings(lang)]);
  if (!room) notFound();

  const dict = getDictionary(lang);
  const t = dict.room;
  const name = room.name ?? "";
  const status = roomStatus(room, dict.rooms, lang);
  const description = (room.description ?? "").split(/\n\s*\n/).filter(Boolean);
  const others = rooms.filter((r) => r._id !== room._id).sort(byAvailability).slice(0, 3);
  const quickChannels = getChannels(settings, dict).filter((c) => c.id === "whatsapp" || c.id === "telegram");

  const facts: { icon: IconName; label: string; value: string }[] = [];
  if (room.size) facts.push({ icon: "ruler", label: t.size, value: fmt(dict.rooms.sizeValue, { n: room.size }) });
  const bedrooms = bedroomsLabel(room.bedrooms, dict.rooms);
  if (bedrooms) facts.push({ icon: "bed", label: t.bedrooms, value: bedrooms });
  const bathrooms = bathroomsLabel(room.bathrooms, dict.rooms);
  if (bathrooms) facts.push({ icon: "bath", label: t.bathrooms, value: bathrooms });
  const capacity = capacityLabel(room.capacity, dict.rooms);
  if (capacity) facts.push({ icon: "users", label: t.capacity, value: capacity });

  const furniture = [
    ...(room.furniture ?? []).map((key) => ({
      key,
      icon: furnitureIcons[key] ?? ("check" as IconName),
      label: featureLabel(dict.furnitureItems, key),
    })),
    ...(room.extraFurniture ?? [])
      .filter((x) => x.label)
      .map((x) => ({ key: x._key, icon: "check" as IconName, label: x.label as string })),
  ];
  const services = [
    ...(room.services ?? []).map((key) => ({
      key,
      icon: serviceIcons[key] ?? ("check" as IconName),
      label: featureLabel(dict.serviceItems, key),
    })),
    ...(room.extraServices ?? [])
      .filter((x) => x.label)
      .map((x) => ({ key: x._key, icon: "check" as IconName, label: x.label as string })),
  ];
  const terms = leaseTerms(dict, settings).slice(0, 3);

  const price =
    room.priceFrom !== null ? (
      <p className="leading-none">
        <span className="text-sm text-muted">{dict.rooms.from} </span>
        <span className="display text-4xl">{formatPrice(room.priceFrom)}</span>
        <span className="text-muted"> {dict.rooms.perMonth}</span>
      </p>
    ) : null;

  return (
    <PageTransition>
      <article className="container-x pb-16 pt-8 lg:pb-24">
        <nav aria-label="Breadcrumb" className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
          <Link href={`/${lang}`} className="hover:text-ink">
            {t.home}
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/${lang}/rooms`} className="hover:text-ink">
            {t.allRooms}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{name}</span>
        </nav>

        <header className="mt-6">
          <StatusBadge tone={status.tone} label={status.label} />
          <h1 className="display mt-4 text-5xl sm:text-6xl">{name}</h1>
          {room.summary && <p className="mt-3 max-w-2xl text-lg">{room.summary}</p>}
        </header>

        <div className="mt-8">
          <RoomGallery slug={room.slug} photos={room.photos ?? []} name={name} t={t} placeholder={dict.photoPlaceholder} />
        </div>

        <div className="mt-12 grid gap-14 lg:grid-cols-[1fr_380px] lg:gap-20">
          <div className="min-w-0">
            {facts.length > 0 && (
              <dl className="grid grid-cols-2 border-y border-line sm:grid-cols-4">
                {facts.map((fact, i) => (
                  <div
                    key={fact.label}
                    className={`py-6 ${i % 2 ? "pl-5" : ""} sm:pl-0 ${i > 0 ? "sm:border-l sm:border-line sm:pl-6" : ""}`}
                  >
                    <Icon name={fact.icon} size={22} className="text-gold" />
                    <dt className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted">{fact.label}</dt>
                    <dd className="mt-1 font-semibold text-ink">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {description.length > 0 && (
              <section className="mt-12">
                <h2 className="display text-3xl">{t.about}</h2>
                <div className="mt-5 space-y-4 text-[1.0625rem] leading-relaxed">
                  {description.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </section>
            )}

            {furniture.length > 0 && (
              <section className="mt-14">
                <h2 className="display text-3xl">{t.inTheRoom}</h2>
                <FeatureList items={furniture} />
              </section>
            )}

            {services.length > 0 && (
              <section className="mt-14">
                <h2 className="display text-3xl">{t.services}</h2>
                <FeatureList items={services} />
              </section>
            )}

            <section className="mt-14">
              <h2 className="display text-3xl">{t.terms}</h2>
              <dl className="mt-6 border-t border-line">
                {terms.map((term) => (
                  <div key={term.label} className="flex gap-4 border-b border-line py-4">
                    <Icon name={term.icon} size={22} className="mt-0.5 shrink-0 text-gold" />
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{term.label}</dt>
                      <dd className="mt-1 text-ink">{term.value}</dd>
                      {"note" in term && term.note && <dd className="mt-1 text-sm text-muted">{term.note}</dd>}
                    </div>
                  </div>
                ))}
              </dl>
            </section>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-28 border border-line p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{t.priceLabel}</p>
              <div className="mt-3">{price}</div>
              <StatusBadge tone={status.tone} label={status.label} className="mt-5" />
              <dl className="mt-6 border-t border-line text-sm">
                {[
                  [dict.terms.minLease, fmt(dict.terms.minLeaseValue, { n: settings.minLeaseMonths ?? 3 })],
                  [dict.terms.deposit, fmt(t.depositShort, { n: settings.depositMonths ?? 1 })],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 border-b border-line py-3">
                    <dt className="text-muted">{label}</dt>
                    <dd className="text-right font-semibold text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
              <a href="#contact" className="btn btn-dark mt-6 w-full">
                {t.enquire}
              </a>
              {quickChannels.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {quickChannels.map((c) => (
                    <a key={c.id} href={c.href} target="_blank" rel="noopener noreferrer" className="btn btn-outline min-h-11 px-3">
                      <Icon name={c.icon} size={17} />
                      {c.label}
                    </a>
                  ))}
                </div>
              )}
              <p className="mt-4 text-center text-xs text-muted">{t.noCommitment}</p>
            </div>
          </aside>
        </div>
      </article>

      {others.length > 0 && (
        <section className="section bg-paper">
          <div className="container-x">
            <h2 className="display text-4xl">{t.otherRooms}</h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((r, i) => (
                <div key={r._id} className="reveal" style={stagger(i)}>
                  <RoomCard room={r} lang={lang} t={dict.rooms} placeholder={dict.photoPlaceholder} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Contact lang={lang} dict={dict} settings={settings} rooms={rooms} defaultRoom={room.slug} />

      {/* Phones: price and Enquire button stay at the bottom of the screen. */}
      <div className="h-20 lg:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t border-line bg-white px-5 py-3 lg:hidden">
        {price}
        <a href="#contact" className="btn btn-dark min-h-11 px-5">
          {t.enquireShort}
        </a>
      </div>
    </PageTransition>
  );
}
