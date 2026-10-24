import { defineQuery } from "next-sanity";

// Picks the visitor's language from a translated field, falling back to English.
const tr = (field: string) =>
  `"${field}": coalesce(${field}[language == $lang][0].value, ${field}[language == "en"][0].value)`;

const image = /* groq */ `
  alt,
  crop,
  hotspot,
  "asset": asset->{ _id, url, "lqip": metadata.lqip, "width": metadata.dimensions.width, "height": metadata.dimensions.height }
`;

const visibleRooms = /* groq */ `_type == "room" && showOnWebsite != false && defined(slug.current)`;

const roomCard = /* groq */ `
  _id,
  "slug": slug.current,
  ${tr("name")},
  ${tr("summary")},
  priceFrom,
  status,
  availableFrom,
  size,
  bedrooms,
  bathrooms,
  capacity,
  featured,
  furniture,
  services,
  "photo": photos[0]{ ${image} },
  "photoCount": count(photos)
`;

export const ROOMS_QUERY = defineQuery(/* groq */ `
  *[${visibleRooms}] | order(sortOrder asc, priceFrom asc) { ${roomCard} }
`);

export const ROOM_QUERY = defineQuery(/* groq */ `
  *[${visibleRooms} && slug.current == $slug][0] {
    ${roomCard},
    ${tr("description")},
    "photos": photos[]{ _key, ${image} },
    "extraFurniture": extraFurniture[]{ _key, ${tr("label")} },
    "extraServices": extraServices[]{ _key, ${tr("label")} }
  }
`);

export const ROOM_SLUGS_QUERY = defineQuery(/* groq */ `
  *[${visibleRooms}].slug.current
`);

export const SETTINGS_QUERY = defineQuery(/* groq */ `
  *[_id == "siteSettings"][0] {
    "heroImage": heroImage{ ${image} },
    "aboutImage": aboutImage{ ${image} },
    "logo": logo{ ${image} },
    "gallery": gallery[]{ _key, ${tr("caption")}, ${image} },
    phone,
    telegram,
    whatsapp,
    facebook,
    wechatId,
    "wechatQr": wechatQr{ ${image} },
    email,
    ${tr("address")},
    mapEmbedUrl,
    mapLink,
    minLeaseMonths,
    depositMonths,
    petsAllowed,
    electricityRate,
    waterRate,
    sharedServices,
    paymentEnabled,
    "paymentQr": paymentQr{ ${image} },
    bankName,
    accountName,
    accountNumber
  }
`);
