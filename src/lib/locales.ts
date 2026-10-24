// Locale constants that are safe to import anywhere (proxy, client and server).

export const locales = ["en", "km", "zh"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

// Cookie set by the language switcher so a visitor's choice wins over browser settings.
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const localeLabels: Record<Locale, string> = {
  en: "English",
  km: "ខ្មែរ",
  zh: "中文",
};

export const localeShortLabels: Record<Locale, string> = {
  en: "EN",
  km: "ខ្មែរ",
  zh: "中文",
};

// Values for <html lang>.
export const htmlLang: Record<Locale, string> = {
  en: "en",
  km: "km",
  zh: "zh-Hans",
};

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
