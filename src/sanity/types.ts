// Shapes returned by the queries in ./queries.ts.

export interface SanityImage {
  alt?: string | null;
  crop?: { top: number; bottom: number; left: number; right: number } | null;
  hotspot?: { x: number; y: number; width: number; height: number } | null;
  asset?: {
    _id: string;
    url: string;
    lqip?: string | null;
    width?: number | null;
    height?: number | null;
  } | null;
}

export type RoomStatus = "available" | "soon" | "rented";

export interface RoomCardData {
  _id: string;
  slug: string;
  name: string | null;
  summary: string | null;
  priceFrom: number | null;
  status: RoomStatus | null;
  availableFrom: string | null;
  size: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  capacity: number | null;
  featured: boolean | null;
  furniture: string[] | null;
  services: string[] | null;
  photo: SanityImage | null;
  photoCount: number | null;
}

export interface RoomDetailData extends RoomCardData {
  description: string | null;
  photos: (SanityImage & { _key: string })[] | null;
  extraFurniture: { _key: string; label: string | null }[] | null;
  extraServices: { _key: string; label: string | null }[] | null;
}

export interface SiteSettings {
  heroImage: SanityImage | null;
  aboutImage: SanityImage | null;
  logo: SanityImage | null;
  gallery: (SanityImage & { _key: string; caption: string | null })[] | null;
  phone: string | null;
  telegram: string | null;
  whatsapp: string | null;
  facebook: string | null;
  wechatId: string | null;
  wechatQr: SanityImage | null;
  email: string | null;
  address: string | null;
  mapEmbedUrl: string | null;
  mapLink: string | null;
  minLeaseMonths: number | null;
  depositMonths: number | null;
  petsAllowed: "yes" | "no" | null;
  electricityRate: string | null;
  waterRate: string | null;
  sharedServices: string[] | null;
  paymentEnabled: boolean | null;
  paymentQr: SanityImage | null;
  bankName: string | null;
  accountName: string | null;
  accountNumber: string | null;
}
