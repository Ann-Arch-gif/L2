import Image from "next/image";
import { urlFor } from "@/sanity/image";
import type { SanityImage as SanityImageData } from "@/sanity/types";
import { Icon } from "./Icon";

// Fills its (relative) parent. Shows a neutral placeholder when no photo has been uploaded.
export function SanityImage({
  image,
  alt,
  sizes = "100vw",
  preload = false,
  placeholderLabel,
  className = "",
}: {
  image?: SanityImageData | null;
  alt: string;
  sizes?: string;
  preload?: boolean;
  placeholderLabel?: string;
  className?: string;
}) {
  if (!image?.asset) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-sand text-muted"
      >
        <Icon name="camera" size={26} />
        {placeholderLabel && <span className="text-xs">{placeholderLabel}</span>}
      </div>
    );
  }

  const { hotspot, asset } = image;
  return (
    <Image
      src={urlFor(image).url()}
      alt={image.alt || alt}
      fill
      sizes={sizes}
      preload={preload}
      placeholder={asset.lqip ? "blur" : "empty"}
      blurDataURL={asset.lqip ?? undefined}
      className={`object-cover ${className}`}
      style={hotspot ? { objectPosition: `${hotspot.x * 100}% ${hotspot.y * 100}%` } : undefined}
    />
  );
}
