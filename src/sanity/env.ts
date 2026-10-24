// Public project settings. The dataset is public, so no token is needed to read published content.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "97y5asq7";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = "2026-10-01";

// The admin (Sanity Studio) is hosted by Sanity; /admin on the website redirects here.
export const studioUrl = "https://l2angkor.sanity.studio";
