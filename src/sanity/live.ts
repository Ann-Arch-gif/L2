import { defineLive } from "next-sanity/live";
import { client } from "./client";

// Published content only (no previews), so no tokens are needed.
const live = defineLive({ client, serverToken: false, browserToken: false });

export const SanityLive = live.SanityLive;

// Every query also carries the "sanity" tag, which /api/revalidate expires when content is published.
export const CONTENT_TAG = "sanity";

const RETRY_DELAYS = [400, 1200];

// Network errors (e.g. "fetch failed" during a brief connection drop) are retried before giving up;
// if they still fail, the page's error screen asks the visitor to try again.
export async function sanityFetch<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await live.sanityFetch({ query, params, tags: [CONTENT_TAG] });
      return res.data as T;
    } catch (error) {
      const isNetworkError = error instanceof TypeError || (error as { code?: string }).code === "ECONNRESET";
      if (!isNetworkError || attempt >= RETRY_DELAYS.length) throw error;
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS[attempt]));
    }
  }
}
