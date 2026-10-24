import { resolveAmenity, site, type Room } from "@/lib/content";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { Icon } from "./Icon";
import { RoomCard } from "./RoomCard";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./motion";

export function Rooms({ lang, dict, rooms }: { lang: Locale; dict: Dictionary; rooms: Room[] }) {
  const shared = (site.sharedAmenities ?? []).map((a) => resolveAmenity(a, dict, lang));

  return (
    <section id="rooms" className="scroll-mt-24 bg-sand/60 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow={dict.rooms.eyebrow} title={dict.rooms.title} subtitle={dict.rooms.subtitle} />

        {rooms.length > 0 ? (
          <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room, i) => (
              <RoomCard key={room.slug} room={room} lang={lang} dict={dict} index={i} />
            ))}
          </div>
        ) : (
          <p className="mx-auto mt-12 max-w-md rounded-2xl bg-card p-6 text-center text-muted">{dict.rooms.empty}</p>
        )}

        {shared.length > 0 && (
          <Reveal className="mt-16 rounded-3xl border border-sand-deep bg-card/80 p-6 sm:p-8">
            <h3 className="text-center font-display text-xl font-semibold text-ink">{dict.rooms.sharedTitle}</h3>
            <ul className="mt-5 flex flex-wrap justify-center gap-2.5">
              {shared.map((a) => (
                <li key={a.label} className="chip">
                  <Icon name={a.icon} size={16} className="text-sage" />
                  {a.label}
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>
    </section>
  );
}
