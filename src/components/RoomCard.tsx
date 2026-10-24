import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { roomFacts, roomStatus } from "@/lib/room-utils";
import type { RoomCardData } from "@/sanity/types";
import { Icon } from "./Icon";
import { SanityImage } from "./SanityImage";
import { StatusBadge } from "./StatusBadge";

export function RoomCard({
  room,
  lang,
  t,
  placeholder,
  sizes = "(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw",
}: {
  room: RoomCardData;
  lang: Locale;
  t: Dictionary["rooms"];
  placeholder: string;
  sizes?: string;
}) {
  const name = room.name ?? "";
  const status = roomStatus(room, t, lang);
  const facts = roomFacts(room, t);

  return (
    <Link href={`/${lang}/rooms/${room.slug}`} className="group flex h-full flex-col bg-white">
      <div className="relative aspect-[4/3] overflow-hidden bg-sand">
        <SanityImage
          image={room.photo}
          alt={name}
          sizes={sizes}
          placeholderLabel={placeholder}
          className={`img-zoom ${room.status === "rented" ? "grayscale-[35%]" : ""}`}
        />
        <StatusBadge tone={status.tone} label={status.label} className="absolute left-4 top-4 shadow-sm" />
        {(room.photoCount ?? 0) > 1 && (
          <span className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-black/55 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <Icon name="camera" size={13} />
            {room.photoCount}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col border-x border-b border-line px-6 pb-6 pt-5">
        {facts.length > 0 && (
          <p className="text-[0.8125rem] font-medium text-muted">{facts.join("  ·  ")}</p>
        )}
        <h3 className="display mt-2 text-[1.75rem]">{name}</h3>
        {room.summary && <p className="mt-2 line-clamp-2 text-[0.9375rem] text-body">{room.summary}</p>}
        <div className="grow" />
        <div className="mt-6 flex items-end justify-between gap-4 border-t border-line pt-5">
          {room.priceFrom !== null ? (
            <p className="leading-none">
              <span className="text-xs text-muted">{t.from} </span>
              <span className="display text-3xl">{formatPrice(room.priceFrom)}</span>
              <span className="text-sm text-muted"> {t.perMonth}</span>
            </p>
          ) : (
            <span />
          )}
          <span className="flex items-center gap-1.5 text-sm font-semibold text-ink">
            {t.viewRoom}
            <Icon name="arrowRight" size={16} className="transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}
