import type { Dictionary } from "@/lib/i18n";
import type { SiteSettings } from "@/sanity/types";
import { SanityImage } from "./SanityImage";
import { SectionHeader } from "./SectionHeader";

// Editorial grid: the first photo is large (2×2), the rest fill in around it.
function spanFor(i: number, count: number) {
  if (i === 0) return "col-span-2 row-span-2";
  // On phones (2 columns) the last photo spans the full width when it would be alone.
  const lastAlone = i === count - 1 && (count - 1) % 2 === 1;
  return lastAlone ? "col-span-2 md:col-span-1" : "";
}

export function Gallery({ dict, settings }: { dict: Dictionary; settings: SiteSettings }) {
  const photos = (settings.gallery ?? []).filter((p) => p.asset);
  if (photos.length === 0) return null;

  return (
    <section id="gallery" className="section scroll-mt-20 bg-paper">
      <div className="container-x">
        <SectionHeader eyebrow={dict.gallery.eyebrow} title={dict.gallery.title} />
        <div className="mt-14 grid auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[240px] md:grid-cols-3 lg:auto-rows-[300px]">
          {photos.map((photo, i) => (
            <figure
              key={photo._key}
              className={`reveal group relative overflow-hidden bg-sand ${spanFor(i, photos.length)}`}
            >
              <SanityImage
                image={photo}
                alt={photo.caption || dict.gallery.title}
                sizes={i === 0 ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 50vw"}
                className="img-zoom"
              />
              {photo.caption && (
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 pb-3 pt-10 text-sm font-medium text-white">
                  {photo.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
