import siteData from "@content/site.json";
import roomsData from "@content/rooms.json";
import { fmt, formatDate, tr, type Dictionary, type Localized } from "./i18n";
import type { Locale } from "./locales";
import type { IconName } from "@/components/Icon";

export type RoomStatus = "available" | "soon" | "rented";

// An amenity is either a known key from the translations ("ac", "wifi"…)
// or free text, e.g. "Rooftop yoga deck" or { "en": "…", "km": "…" }.
export type Amenity = Localized;

export interface Room {
  slug: string;
  hidden?: boolean;
  name: Localized;
  summary?: Localized;
  description?: Localized;
  priceFrom?: number;
  size?: number;
  bed?: Localized;
  capacity?: number;
  status?: RoomStatus | string;
  availableFrom?: string;
  photos?: string[];
  amenities?: Amenity[];
}

export interface GalleryItem {
  src: string;
  caption?: Localized;
}

export interface Site {
  name: string;
  logo?: string;
  heroImage?: string;
  aboutImage?: string;
  currency: string;
  contact: {
    phone?: string;
    telegram?: string;
    whatsapp?: string;
    facebook?: string;
    wechatId?: string;
    wechatQr?: string;
    email?: string;
  };
  address?: Localized;
  map: {
    embedUrl?: string;
    searchQuery?: string;
    googleMapsLink?: string;
  };
  policies: {
    minLeaseMonths: number;
    depositMonths: number;
    petsAllowed: boolean;
    electricityRate?: string;
    waterRate?: string;
  };
  sharedAmenities?: Amenity[];
  gallery?: GalleryItem[];
  payment: {
    enabled: boolean;
    qrImage?: string;
    bankName?: string;
    accountName?: string;
    accountNumber?: string;
  };
}

export const site = siteData as Site;

export function getRooms(): Room[] {
  return (roomsData as Room[]).filter((room) => room.slug && !room.hidden);
}

export function getRoom(slug: string): Room | undefined {
  return getRooms().find((room) => room.slug === slug);
}

export function formatPrice(amount: number): string {
  return `${site.currency}${amount.toLocaleString("en-US")}`;
}

export function lowestPrice(rooms: Room[]): number | undefined {
  const prices = rooms.map((r) => r.priceFrom).filter((p): p is number => typeof p === "number");
  return prices.length ? Math.min(...prices) : undefined;
}

export function roomStatus(room: Room, dict: Dictionary, locale: Locale) {
  if (room.status === "rented") return { tone: "rented" as const, label: dict.rooms.statusRented };
  if (room.status === "soon") {
    const label = room.availableFrom
      ? fmt(dict.rooms.statusSoon, { date: formatDate(room.availableFrom, locale) })
      : dict.rooms.statusSoonNoDate;
    return { tone: "soon" as const, label };
  }
  return { tone: "available" as const, label: dict.rooms.statusAvailable };
}

const amenityIcons: Record<string, IconName> = {
  ac: "snowflake",
  wifi: "wifi",
  hotWater: "droplet",
  fridge: "fridge",
  kitchen: "cookingPot",
  kitchenette: "flame",
  washingMachine: "washer",
  tv: "tv",
  desk: "laptop",
  wardrobe: "wardrobe",
  bed: "bed",
  sofa: "sofa",
  diningTable: "utensils",
  balcony: "sun",
  privateBathroom: "bath",
  parking: "car",
  security: "shield",
  cleaning: "sparkles",
  laundry: "shirt",
  pool: "waves",
  garden: "leaf",
  elevator: "elevator",
  gym: "dumbbell",
  fan: "fan",
  microwave: "microwave",
  safe: "lock",
};

export function resolveAmenity(item: Amenity, dict: Dictionary, locale: Locale) {
  const labels = dict.amenities as Record<string, string>;
  if (typeof item === "string" && item in labels) {
    return { label: labels[item], icon: amenityIcons[item] ?? ("check" as IconName) };
  }
  return { label: tr(item, locale), icon: "check" as IconName };
}

export const contactLinks = {
  telegram: (username: string) => `https://t.me/${username.replace(/^@/, "")}`,
  whatsapp: (number: string, text?: string) =>
    `https://wa.me/${number.replace(/\D/g, "")}${text ? `?text=${encodeURIComponent(text)}` : ""}`,
  phone: (number: string) => `tel:${number.replace(/[^\d+]/g, "")}`,
  email: (address: string) => `mailto:${address}`,
};
