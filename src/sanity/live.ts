import { defineLive } from "next-sanity/live";
import { client } from "./client";

// Published content only (no previews), so no tokens are needed.
const live = defineLive({ client, serverToken: false, browserToken: false });

export const SanityLive = live.SanityLive;

// Every query also carries the "sanity" tag, which /api/revalidate expires when content is published.
export const CONTENT_TAG = "sanity";

export function sanityFetch<T>(query: string, params: Record<string, unknown> = {}) {
  return live.sanityFetch({ query, params, tags: [CONTENT_TAG] }).then((res) => res.data as T);
}
