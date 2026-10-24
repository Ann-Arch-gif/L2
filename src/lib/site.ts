export const SITE_NAME = "L2 Angkor";

export const contactLinks = {
  telegram: (username: string) => `https://t.me/${username.replace(/^@/, "")}`,
  whatsapp: (number: string, text?: string) =>
    `https://wa.me/${number.replace(/\D/g, "")}${text ? `?text=${encodeURIComponent(text)}` : ""}`,
  phone: (number: string) => `tel:${number.replace(/[^\d+]/g, "")}`,
  email: (address: string) => `mailto:${address}`,
};
