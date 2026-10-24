import Image from "next/image";
import { Icon } from "./Icon";

// Fills its (relative) parent. Shows a warm placeholder until a real photo path is set.
export function Photo({
  src,
  alt,
  placeholderLabel,
  sizes = "100vw",
  preload = false,
  className = "",
}: {
  src?: string;
  alt: string;
  placeholderLabel: string;
  sizes?: string;
  preload?: boolean;
  className?: string;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        preload={preload}
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={`photo-placeholder absolute inset-0 flex flex-col items-center justify-center gap-2 text-terracotta/70 ${className}`}
    >
      <Icon name="camera" size={30} />
      <span className="px-4 text-center text-xs font-medium tracking-wide">{placeholderLabel}</span>
    </div>
  );
}
