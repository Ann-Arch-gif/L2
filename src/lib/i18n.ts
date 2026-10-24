import en from "@content/translations/en.json";
import km from "@content/translations/km.json";
import zh from "@content/translations/zh.json";
import type { Locale } from "./locales";

export type Dictionary = typeof en;

// Typed against the English file, so a missing key in km.json or zh.json fails the build.
const dictionaries: Record<Locale, Dictionary> = { en, km, zh };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
