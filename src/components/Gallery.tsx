import { site } from "@/lib/content";
import { tr, type Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { Photo } from "./Photo";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./motion";

// Varied shapes give the grid a relaxed, scrapbook feel.
const shapes = ["aspect-[4/5]", "aspect-[4/3]", "aspect-square", "aspect-[3/4]", "aspect-[16/11]"];

export function Gallery({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const items = site.gallery ?? [];
  if (items.length === 0) return null;

  return (
    <section id="gallery" className="scroll-mt-24 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow={dict.gallery.eyebrow} title={dict.gallery.title} />
        <div className="mt-14 columns-2 gap-4 md:columns-3 [&>*]:mb-4">
          {items.map((item, i) => {
            const caption = tr(item.caption, lang);
            return (
              <Reveal key={i} index={i % 3} className="break-inside-avoid">
                <figure className={`group relative overflow-hidden rounded-3xl border border-sand-deep ${shapes[i % shapes.length]}`}>
                  <Photo
                    src={item.src}
                    alt={caption || dict.gallery.title}
                    placeholderLabel={dict.photoPlaceholder}
                    sizes="(min-width: 768px) 33vw, 50vw"
                    className="transition-transform duration-700 group-hover:scale-105"
                  />
                  {caption && (
                    <figcaption className="absolute inset-x-3 bottom-3 rounded-full bg-linen/90 px-3 py-1.5 text-center text-xs font-medium text-ink backdrop-blur-sm sm:inset-x-auto sm:left-3">
                      {caption}
                    </figcaption>
                  )}
                </figure>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
