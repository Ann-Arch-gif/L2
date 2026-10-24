import { client } from "./client";
import { sanityFetch } from "./live";
import { ROOM_QUERY, ROOM_SLUGS_QUERY, ROOMS_QUERY, SETTINGS_QUERY } from "./queries";
import type { RoomCardData, RoomDetailData, SiteSettings } from "./types";
import type { Locale } from "@/lib/locales";

export const getRooms = (lang: Locale) => sanityFetch<RoomCardData[]>(ROOMS_QUERY, { lang });

export const getRoom = (lang: Locale, slug: string) =>
  sanityFetch<RoomDetailData | null>(ROOM_QUERY, { lang, slug });

export async function getSettings(lang: Locale): Promise<SiteSettings> {
  const settings = await sanityFetch<SiteSettings | null>(SETTINGS_QUERY, { lang });
  return settings ?? ({} as SiteSettings);
}

// Used at build time to pre-render room pages; reads straight from the API, not the CDN.
export const getRoomSlugs = () =>
  client.withConfig({ useCdn: false }).fetch<string[]>(ROOM_SLUGS_QUERY);
