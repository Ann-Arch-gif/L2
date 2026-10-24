import en from "@content/translations/en.json";
import km from "@content/translations/km.json";
import zh from "@content/translations/zh.json";
import { intlLocale, type Locale } from "./locales";

export type Dictionary = typeof en;

// Typed against the English file, so a missing key in km.json or zh.json fails the build.
const dictionaries: Record<Locale, Dictionary> = { en, km, zh };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

// Text that can be the same in every language ("L2 Angkor") or translated ({ en, km, zh }).
export type Localized = string | Partial<Record<Locale, string>>;

export function tr(value: Localized | undefined, locale: Locale): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[locale] || value.en || Object.values(value).find(Boolean) || "";
}

// Fills "{name}" placeholders: fmt("From {price}", { price: "$250" }).
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}

export function formatDate(iso: string, locale: Locale): string {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(intlLocale[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
