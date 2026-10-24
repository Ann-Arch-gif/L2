import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { CONTENT_TAG } from "@/sanity/live";

// Called by a Sanity webhook whenever rooms or settings are published, so every page
// shows the change on its next visit. The secret must match SANITY_REVALIDATE_SECRET.
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return new Response("SANITY_REVALIDATE_SECRET is not set", { status: 500 });

  try {
    const { isValidSignature } = await parseBody(request, secret, true);
    if (!isValidSignature) return new Response("Invalid signature", { status: 401 });

    revalidateTag(CONTENT_TAG, { expire: 0 });
    return NextResponse.json({ revalidated: true });
  } catch (error) {
    return new Response((error as Error).message, { status: 500 });
  }
}
