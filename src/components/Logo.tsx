import Image from "next/image";
import { urlFor } from "@/sanity/image";
import type { SanityImage } from "@/sanity/types";
import { SITE_NAME } from "@/lib/site";

// Uses the logo uploaded in the admin, otherwise a text wordmark.
export function Logo({ logo, light = false }: { logo?: SanityImage | null; light?: boolean }) {
  if (logo?.asset) {
    return (
      <Image
        src={urlFor(logo).height(96).url()}
        alt={SITE_NAME}
        width={Math.round(48 * ((logo.asset.width ?? 160) / (logo.asset.height ?? 48)))}
        height={48}
        className={`h-11 w-auto object-contain ${light ? "brightness-0 invert" : ""}`}
      />
    );
  }

  return (
    <span className={`flex flex-col leading-none ${light ? "text-white" : "text-ink"}`}>
      <span className="font-display text-[1.6rem] font-semibold tracking-[0.14em]">L2 ANGKOR</span>
      <span className={`mt-1 text-[0.6875rem] font-semibold tracking-[0.34em] ${light ? "text-white/75" : "text-gold"}`}>
        SIEM REAP
      </span>
    </span>
  );
}
