import type { IconName } from "@/components/Icon";
import type { RoomCardData } from "@/sanity/types";
import { fmt, formatDate } from "./format";
import type { Dictionary } from "./i18n";
import type { Locale } from "./locales";

type RoomLabels = Dictionary["rooms"];

// Shared view-transition name linking a room's card photo and its room page photo.
export const roomPhotoTransition = (slug: string) => `room-photo-${slug}`;

export type StatusTone = "available" | "soon" | "rented";

export function roomStatus(room: Pick<RoomCardData, "status" | "availableFrom">, t: RoomLabels, lang: Locale) {
  if (room.status === "rented") return { tone: "rented" as StatusTone, label: t.statusRented };
  if (room.status === "soon") {
    return {
      tone: "soon" as StatusTone,
      label: room.availableFrom
        ? fmt(t.statusSoon, { date: formatDate(room.availableFrom, lang) })
        : t.statusSoonNoDate,
    };
  }
  return { tone: "available" as StatusTone, label: t.statusAvailable };
}

export function bedroomsLabel(n: number | null, t: RoomLabels) {
  if (n === null || n === undefined) return null;
  if (n === 0) return t.studio;
  return n === 1 ? t.bedroomOne : fmt(t.bedroomsMany, { n });
}

export function bathroomsLabel(n: number | null, t: RoomLabels) {
  if (!n) return null;
  return n === 1 ? t.bathroomOne : fmt(t.bathroomsMany, { n });
}

export function capacityLabel(n: number | null, t: RoomLabels) {
  if (!n) return null;
  return n === 1 ? t.capacityOne : fmt(t.capacityValue, { n });
}

// Short "Studio · 28 m² · Up to 2 people" line for cards.
export function roomFacts(room: RoomCardData, t: RoomLabels) {
  return [
    bedroomsLabel(room.bedrooms, t),
    room.size ? fmt(t.sizeValue, { n: room.size }) : null,
    capacityLabel(room.capacity, t),
  ].filter(Boolean) as string[];
}

// True if the room can be moved into on or before the given date (YYYY-MM-DD).
export function availableBy(room: Pick<RoomCardData, "status" | "availableFrom">, date?: string) {
  if (room.status === "rented") return false;
  if (room.status !== "soon") return true;
  if (!room.availableFrom || !date) return false;
  return room.availableFrom <= date;
}

const statusRank: Record<string, number> = { available: 0, soon: 1, rented: 2 };
export const byAvailability = (a: RoomCardData, b: RoomCardData) =>
  (statusRank[a.status ?? "available"] ?? 0) - (statusRank[b.status ?? "available"] ?? 0);

export const furnitureIcons: Record<string, IconName> = {
  bed: "bed",
  wardrobe: "wardrobe",
  desk: "desk",
  sofa: "sofa",
  diningTable: "table",
  curtains: "curtains",
  airConditioner: "snowflake",
  ceilingFan: "fan",
  fridge: "fridge",
  stove: "flame",
  microwave: "microwave",
  kettle: "kettle",
  cookware: "utensils",
  tv: "tv",
  washingMachine: "washer",
  waterHeater: "shower",
  kitchen: "cookingPot",
  balcony: "sun",
  privateBathroom: "bath",
};

export const serviceIcons: Record<string, IconName> = {
  wifi: "wifi",
  cleaning: "sparkles",
  laundry: "shirt",
  linen: "layers",
  motorbikeParking: "motorbike",
  carParking: "car",
  security: "shield",
  smartKey: "key",
  beddingChange: "bed",
  cctv: "cctv",
  rubbish: "trash",
  drinkingWater: "droplet",
  maintenance: "wrench",
  cableTv: "tv",
  pool: "waves",
  gym: "dumbbell",
  garden: "leaf",
};

// Label for a checklist key, e.g. "airConditioner" → "Air conditioner" (translated).
export function featureLabel(labels: Record<string, string>, key: string) {
  return labels[key] ?? key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
}
