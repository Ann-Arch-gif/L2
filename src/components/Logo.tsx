import Image from "next/image";

// Uses the logo image from site.json when set, otherwise a simple temple-mark wordmark.
export function Logo({ name, logo, light = false }: { name: string; logo?: string; light?: boolean }) {
  if (logo) {
    return (
      <Image src={logo} alt={name} width={160} height={48} className="h-10 w-auto object-contain" />
    );
  }

  return (
    <span className="flex items-center gap-2.5">
      <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden="true">
        <rect width="40" height="40" rx="11" fill={light ? "#faf7f2" : "#9a4f2c"} />
        <path
          d="M20 7c2.2 4 3.6 6.6 3.6 9.4v1.4h2.1v3h1.8V31h-15V20.8h1.8v-3h2.1v-1.4C16.4 13.6 17.8 11 20 7Z"
          fill={light ? "#9a4f2c" : "#faf7f2"}
        />
        <path d="M10 31h20" stroke={light ? "#9a4f2c" : "#faf7f2"} strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span
        className={`font-display text-xl font-semibold tracking-tight ${light ? "text-linen" : "text-ink"}`}
      >
        {name}
      </span>
    </span>
  );
}
