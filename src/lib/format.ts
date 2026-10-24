import type { CSSProperties } from "react";
import type { Locale } from "./locales";

// Position in a staggered sequence (read by the .reveal / .hero-rise / .stagger-in CSS).
export const stagger = (i: number) => ({ "--i": i }) as CSSProperties;

const months: Record<Exclude<Locale, "zh">, string[]> = {
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  km: ["មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"],
};

// Fills "{name}" placeholders: fmt("From {price}", { price: "$250" }).
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}

export function monthName(month: number, locale: Locale): string {
  return locale === "zh" ? `${month}月` : months[locale][month - 1];
}

// Formats "2026-12-01" by hand: Intl output for Khmer differs between Node and browsers,
// which would make the server and browser render different text.
export function formatDate(iso: string, locale: Locale): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!match) return iso;
  const [, year, month, day] = match.map(Number);
  if (locale === "zh") return `${year}年${month}月${day}日`;
  return `${day} ${months[locale][month - 1]} ${year}`;
}

export function formatPrice(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}
