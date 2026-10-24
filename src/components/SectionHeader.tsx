import type { ReactNode } from "react";

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  action,
  align = "left",
  light = false,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  align?: "left" | "center";
  light?: boolean;
}) {
  const centered = align === "center";
  return (
    <div
      className={`reveal flex flex-col gap-6 ${centered ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"}`}
    >
      <div className={centered ? "max-w-2xl" : "max-w-2xl"}>
        <p className={`eyebrow ${light ? "!text-gold-light" : ""}`}>{eyebrow}</p>
        <h2 className={`display mt-4 text-4xl sm:text-5xl ${light ? "!text-white" : ""}`}>{title}</h2>
        {subtitle && <p className={`mt-4 text-lg ${light ? "text-white/70" : "text-body"}`}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
