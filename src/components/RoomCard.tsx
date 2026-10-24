import Link from "next/link";
import { formatPrice, resolveAmenity, roomStatus, type Room } from "@/lib/content";
import { fmt, tr, type Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { Icon } from "./Icon";
import { Photo } from "./Photo";
import { StatusBadge } from "./StatusBadge";
import { Reveal, TiltCard } from "./motion";

export function RoomCard({
  room,
  lang,
  dict,
  index,
}: {
  room: Room;
  lang: Locale;
  dict: Dictionary;
  index: number;
}) {
  const name = tr(room.name, lang);
  const status = roomStatus(room, dict, lang);
  const amenities = (room.amenities ?? []).slice(0, 4).map((a) => resolveAmenity(a, dict, lang));

  return (
    <Reveal variant="tilt" index={index} className="h-full">
      <TiltCard className="h-full">
        <Link
          href={`/${lang}/rooms/${room.slug}`}
          className="card group flex h-full flex-col overflow-hidden transition-shadow duration-300 hover:shadow-[0_30px_60px_-30px_rgba(78,52,36,0.5)]"
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            <Photo
              src={room.photos?.[0]}
              alt={name}
              placeholderLabel={dict.photoPlaceholder}
              sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
              className="transition-transform duration-700 group-hover:scale-105"
            />
            <StatusBadge tone={status.tone} label={status.label} className="absolute left-3 top-3" />
          </div>

          <div className="flex flex-1 flex-col p-5 sm:p-6">
            <h3 className="font-display text-2xl font-semibold text-ink">{name}</h3>
            {room.summary && (
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{tr(room.summary, lang)}</p>
            )}

            {(room.size || room.capacity) && (
              <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink/80">
                {room.size ? (
                  <li className="flex items-center gap-1.5">
                    <Icon name="ruler" size={16} className="text-terracotta" />
                    {fmt(dict.rooms.sizeValue, { size: room.size })}
                  </li>
                ) : null}
                {room.capacity ? (
                  <li className="flex items-center gap-1.5">
                    <Icon name="users" size={16} className="text-terracotta" />
                    {fmt(dict.rooms.capacityValue, { n: room.capacity })}
                  </li>
                ) : null}
              </ul>
            )}

            {amenities.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {amenities.map((a) => (
                  <li
                    key={a.label}
                    className="flex items-center gap-1 rounded-full bg-sand px-2.5 py-1 text-xs text-ink/80"
                  >
                    <Icon name={a.icon} size={13} className="text-sage" />
                    {a.label}
                  </li>
                ))}
              </ul>
            )}

            <div className="grow" />
            <div className="mt-6 flex items-end justify-between gap-4 border-t border-sand-deep pt-5">
              {room.priceFrom !== undefined ? (
                <p className="leading-tight">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-muted">
                    {dict.rooms.from}
                  </span>
                  <span className="font-display text-3xl font-semibold text-terracotta">
                    {formatPrice(room.priceFrom)}
                  </span>
                  <span className="ml-1 text-sm text-muted">{dict.rooms.perMonth}</span>
                </p>
              ) : (
                <span />
              )}
              <span className="flex items-center gap-1 text-sm font-semibold text-terracotta">
                <span className="hidden sm:inline">{dict.rooms.viewDetails}</span>
                <span className="flex size-9 items-center justify-center rounded-full bg-terracotta text-linen transition-transform duration-300 group-hover:translate-x-1">
                  <Icon name="arrowRight" size={16} />
                </span>
              </span>
            </div>
          </div>
        </Link>
      </TiltCard>
    </Reveal>
  );
}
