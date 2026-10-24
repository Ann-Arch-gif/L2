"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Icon } from "./Icon";
import { Photo } from "./Photo";

export function RoomGallery({
  photos,
  name,
  labels,
}: {
  photos: string[];
  name: string;
  labels: { placeholder: string; previous: string; next: string };
}) {
  const [index, setIndex] = useState(0);
  const count = photos.length;
  const go = (step: number) => setIndex((i) => (i + step + count) % count);

  if (count === 0) {
    return (
      <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] border border-sand-deep">
        <Photo alt={name} placeholderLabel={labels.placeholder} />
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] border border-sand-deep bg-sand">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={photos[index]}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src={photos[index]}
              alt={`${name} — ${index + 1}/${count}`}
              fill
              sizes="(min-width: 1024px) 720px, 100vw"
              preload={index === 0}
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
        {count > 1 && (
          <>
            <button
              type="button"
              aria-label={labels.previous}
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-linen/90 text-ink shadow hover:bg-card"
            >
              <Icon name="chevronLeft" size={22} />
            </button>
            <button
              type="button"
              aria-label={labels.next}
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-linen/90 text-ink shadow hover:bg-card"
            >
              <Icon name="chevronRight" size={22} />
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-ink/70 px-3 py-1 text-xs font-semibold text-linen">
              {index + 1} / {count}
            </span>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {photos.map((src, i) => (
            <button
              key={src}
              type="button"
              aria-label={`${i + 1}/${count}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={`relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                i === index ? "border-terracotta" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={src} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
