"use client";

import { useCallback, useEffect, useState, ViewTransition } from "react";
import { fmt } from "@/lib/format";
import type { Dictionary } from "@/lib/i18n";
import { roomPhotoTransition } from "@/lib/room-utils";
import type { SanityImage as SanityImageData } from "@/sanity/types";
import { Icon } from "./Icon";
import { SanityImage } from "./SanityImage";

type Photo = SanityImageData & { _key: string };

// Desktop layout by photo count: one large photo plus up to four smaller ones.
function tileClass(i: number, count: number) {
  if (count === 1) return "col-span-4 row-span-2";
  if (count === 2) return "col-span-2 row-span-2";
  if (i === 0) return "col-span-2 row-span-2";
  if (count === 3) return "col-span-2";
  if (count === 4 && i === 1) return "col-span-2";
  return "";
}

export function RoomGallery({
  slug,
  photos,
  name,
  t,
  placeholder,
}: {
  slug: string;
  photos: Photo[];
  name: string;
  t: Dictionary["room"];
  placeholder: string;
}) {
  const [index, setIndex] = useState<number | null>(null);
  const count = photos.length;
  const go = useCallback((step: number) => setIndex((i) => (i === null ? i : (i + step + count) % count)), [count]);

  useEffect(() => {
    if (index === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [index, go]);

  if (count === 0) {
    return (
      <ViewTransition name={roomPhotoTransition(slug)} share="morph" default="none">
        <div className="relative aspect-[16/9] bg-sand">
          <SanityImage alt={name} placeholderLabel={placeholder} />
        </div>
      </ViewTransition>
    );
  }

  const tiles = photos.slice(0, 5);

  return (
    <>
      {/* Phones: swipeable strip */}
      <div className="-mx-5 flex snap-x snap-mandatory gap-2 overflow-x-auto px-5 sm:-mx-8 sm:px-8 md:hidden">
        {photos.map((photo, i) => (
          <button
            key={photo._key}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={fmt(t.photoOf, { i: i + 1, n: count })}
            className="relative aspect-[4/3] w-[85%] shrink-0 snap-center overflow-hidden bg-sand"
          >
            <SanityImage image={photo} alt={name} sizes="85vw" preload={i === 0} />
            <span className="absolute bottom-3 right-3 bg-black/55 px-2 py-0.5 text-xs text-white">
              {i + 1} / {count}
            </span>
          </button>
        ))}
      </div>

      {/* Tablets and up: grid */}
      <div className="relative hidden h-[460px] grid-cols-4 grid-rows-2 gap-2 md:grid lg:h-[540px]">
        {tiles.map((photo, i) => {
          const tile = (
            <button
              key={photo._key}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={fmt(t.photoOf, { i: i + 1, n: count })}
              className={`group relative cursor-zoom-in overflow-hidden bg-sand ${tileClass(i, tiles.length)}`}
            >
              <SanityImage
                image={photo}
                alt={name}
                sizes={i === 0 ? "(min-width: 1024px) 620px, 50vw" : "(min-width: 1024px) 310px, 25vw"}
                preload={i === 0}
                className="img-zoom"
              />
            </button>
          );
          // The main photo continues the card photo the visitor clicked on the previous page.
          return i === 0 ? (
            <ViewTransition key={photo._key} name={roomPhotoTransition(slug)} share="morph" default="none">
              {tile}
            </ViewTransition>
          ) : (
            tile
          );
        })}
        {count > 1 && (
          <button
            type="button"
            onClick={() => setIndex(0)}
            className="btn btn-light absolute bottom-5 right-5 min-h-10 border border-ink px-4 shadow-sm"
          >
            <Icon name="grid" size={16} />
            {fmt(t.showAllPhotos, { n: count })}
          </button>
        )}
      </div>

      {index !== null && (
        <div role="dialog" aria-modal="true" aria-label={name} className="fade-in fixed inset-0 z-50 flex flex-col bg-black">
          <div className="flex h-16 shrink-0 items-center justify-between px-4 text-white sm:px-6">
            <span className="text-sm">{fmt(t.photoOf, { i: index + 1, n: count })}</span>
            <button
              type="button"
              onClick={() => setIndex(null)}
              aria-label={t.close}
              autoFocus
              className="flex size-11 items-center justify-center hover:bg-white/10"
            >
              <Icon name="x" size={24} />
            </button>
          </div>
          <div className="relative flex-1">
            {/* Keyed so each photo fades in fresh instead of the previous one lingering. */}
            <div key={photos[index]._key} className="photo-in absolute inset-0">
              <SanityImage image={photos[index]} alt={name} sizes="100vw" className="!object-contain" />
            </div>
            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label={t.previous}
                  className="absolute left-2 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center bg-black/40 text-white hover:bg-black/70 sm:left-6"
                >
                  <Icon name="chevronLeft" size={26} />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label={t.next}
                  className="absolute right-2 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center bg-black/40 text-white hover:bg-black/70 sm:right-6"
                >
                  <Icon name="chevronRight" size={26} />
                </button>
              </>
            )}
          </div>
          <div className="flex shrink-0 justify-center gap-2 overflow-x-auto p-4">
            {photos.map((photo, i) => (
              <button
                key={photo._key}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={fmt(t.photoOf, { i: i + 1, n: count })}
                aria-current={i === index}
                className={`relative h-14 w-20 shrink-0 overflow-hidden transition-opacity ${
                  i === index ? "opacity-100 ring-1 ring-white" : "opacity-50 hover:opacity-100"
                }`}
              >
                <SanityImage image={photo} alt="" sizes="80px" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
