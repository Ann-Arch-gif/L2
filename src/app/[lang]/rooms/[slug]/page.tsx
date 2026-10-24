import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Contact } from "@/components/Contact";
import { Icon, type IconName } from "@/components/Icon";
import { RoomCard } from "@/components/RoomCard";
import { RoomGallery } from "@/components/RoomGallery";
import { StatusBadge } from "@/components/StatusBadge";
import { Reveal } from "@/components/motion";
import { formatPrice, getRoom, getRooms, resolveAmenity, roomStatus, site } from "@/lib/content";
import { fmt, getDictionary, tr } from "@/lib/i18n";
import { hasLocale } from "@/lib/locales";

export const dynamicParams = false;

export function generateStaticParams() {
  return getRooms().map((room) => ({ slug: room.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/rooms/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const room = getRoom(slug);
  if (!hasLocale(lang) || !room) return {};
  return {
    title: tr(room.name, lang),
    description: tr(room.summary, lang) || undefined,
    openGraph: room.photos?.[0] ? { images: [room.photos[0]] } : undefined,
  };
}

export default async function RoomPage({ params }: PageProps<"/[lang]/rooms/[slug]">) {
  const { lang, slug } = await params;
  const room = getRoom(slug);
  if (!hasLocale(lang) || !room) notFound();

  const dict = getDictionary(lang);
  const t = dict.room;
  const rooms = getRooms();
  const name = tr(room.name, lang);
  const status = roomStatus(room, dict, lang);
  const amenities = (room.amenities ?? []).map((a) => resolveAmenity(a, dict, lang));
  const description = tr(room.description, lang).split(/\n\s*\n/).filter(Boolean);
  const others = rooms.filter((r) => r.slug !== room.slug).slice(0, 3);

  const facts: { icon: IconName; label: string; value: string }[] = [];
  if (room.size) facts.push({ icon: "ruler", label: t.size, value: fmt(dict.rooms.sizeValue, { size: room.size }) });
  if (room.bed) facts.push({ icon: "bed", label: t.bed, value: tr(room.bed, lang) });
  if (room.capacity) facts.push({ icon: "users", label: t.capacity, value: fmt(t.capacityValue, { n: room.capacity }) });

  const terms = [
    { label: t.deposit, value: fmt(t.depositValue, { n: site.policies.depositMonths }) },
    { label: t.minLease, value: fmt(t.minLeaseValue, { n: site.policies.minLeaseMonths }) },
    { label: t.utilities, value: t.utilitiesValue },
  ];

  return (
    <>
      <article className="mx-auto max-w-6xl px-4 pb-20 pt-6 sm:px-6 lg:pb-28">
        <Link
          href={`/${lang}#rooms`}
          className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-terracotta hover:bg-sand"
        >
          <Icon name="arrowLeft" size={16} />
          {t.back}
        </Link>

        <div className="mt-4 grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-12">
          <div className="min-w-0">
            <Reveal>
              <RoomGallery
                photos={room.photos ?? []}
                name={name}
                labels={{ placeholder: dict.photoPlaceholder, previous: t.previousPhoto, next: t.nextPhoto }}
              />
            </Reveal>

            <Reveal className="mt-8">
              <StatusBadge tone={status.tone} label={status.label} />
              <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">{name}</h1>
              {room.summary && <p className="mt-3 text-xl text-muted">{tr(room.summary, lang)}</p>}
            </Reveal>

            {facts.length > 0 && (
              <Reveal className="mt-8">
                <h2 className="sr-only">{t.details}</h2>
                <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {facts.map((f) => (
                    <div key={f.label} className="card flex items-center gap-3 p-4">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-terracotta/10 text-terracotta">
                        <Icon name={f.icon} size={20} />
                      </span>
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-wider text-muted">{f.label}</dt>
                        <dd className="font-semibold text-ink">{f.value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </Reveal>
            )}

            {description.length > 0 && (
              <Reveal className="mt-10">
                <h2 className="font-display text-2xl font-semibold text-ink">{t.about}</h2>
                <div className="mt-4 space-y-4 text-lg leading-relaxed text-muted">
                  {description.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </Reveal>
            )}

            {amenities.length > 0 && (
              <Reveal className="mt-10">
                <h2 className="font-display text-2xl font-semibold text-ink">{t.amenities}</h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {amenities.map((a) => (
                    <li key={a.label} className="flex items-center gap-3 rounded-2xl bg-sand/70 px-4 py-3 text-ink">
                      <Icon name={a.icon} size={20} className="shrink-0 text-sage" />
                      {a.label}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Reveal variant="tilt" className="card p-6 shadow-[0_30px_60px_-35px_rgba(78,52,36,0.5)]">
              {room.priceFrom !== undefined && (
                <>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">{t.priceLabel}</p>
                  <p className="mt-1">
                    <span className="mr-1 text-sm text-muted">{dict.rooms.from}</span>
                    <span className="font-display text-4xl font-semibold text-terracotta">
                      {formatPrice(room.priceFrom)}
                    </span>
                    <span className="ml-1 text-muted">{dict.rooms.perMonth}</span>
                  </p>
                </>
              )}
              <dl className="mt-5 divide-y divide-sand-deep border-y border-sand-deep">
                {terms.map((term) => (
                  <div key={term.label} className="flex justify-between gap-4 py-3 text-sm">
                    <dt className="text-muted">{term.label}</dt>
                    <dd className="text-right font-semibold text-ink">{term.value}</dd>
                  </div>
                ))}
              </dl>
              <a href="#contact" className="btn-primary shimmer mt-6 w-full justify-center">
                {t.inquire}
                <Icon name="arrowRight" size={18} />
              </a>
            </Reveal>
          </aside>
        </div>
      </article>

      {others.length > 0 && (
        <section className="border-t border-sand-deep py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-display text-3xl font-semibold text-ink">{t.otherRooms}</h2>
            <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((r, i) => (
                <RoomCard key={r.slug} room={r} lang={lang} dict={dict} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Contact lang={lang} dict={dict} rooms={rooms} defaultRoom={room.slug} />
    </>
  );
}
