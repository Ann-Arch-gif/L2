import { NextResponse } from "next/server";
import { SITE_NAME } from "@/lib/site";

// Receives the inquiry form and forwards it by email (Resend) and Telegram.
// Configure with the variables in .env.example. With none set, it runs in test mode
// and only logs the message, so the form can be tried before the services are set up.

interface Inquiry {
  name: string;
  email: string;
  phone: string;
  room: string;
  roomName: string;
  moveIn: string;
  lease: string;
  message: string;
  lang: string;
  company: string;
}

const limits: Record<keyof Inquiry, number> = {
  name: 100,
  email: 200,
  phone: 50,
  room: 100,
  roomName: 200,
  moveIn: 20,
  lease: 30,
  message: 3000,
  lang: 5,
  company: 200,
};

// The form sends a few KB at most; anything bigger is refused before it is read.
const MAX_BODY_BYTES = 16_000;

function clean(body: unknown): Inquiry {
  const source = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const result = {} as Inquiry;
  for (const key of Object.keys(limits) as (keyof Inquiry)[]) {
    const value = source[key];
    let text = typeof value === "string" ? value.trim().slice(0, limits[key]) : "";
    // Only the message may span lines; elsewhere line breaks could forge email headers.
    if (key !== "message") text = text.replace(/[\r\n\t]+/g, " ");
    result[key] = text;
  }
  return result;
}

// Spam protection: each visitor may send a few enquiries per window. Kept in memory, so it is
// per server instance, which is enough to stop one script from flooding the family's inbox.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const recent = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const times = (recent.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  const limited = times.length >= RATE_LIMIT;
  if (!limited) times.push(now);
  recent.set(ip, times);
  if (recent.size > 5000) {
    for (const [key, list] of recent) if (list.every((t) => now - t >= RATE_WINDOW_MS)) recent.delete(key);
  }
  return limited;
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0].trim() || request.headers.get("x-real-ip") || "unknown";
}

// Browsers send Origin with every form post; reject posts from other websites.
function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === new URL(request.url).host || new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

function summary(i: Inquiry): string {
  return [
    `New inquiry from the ${SITE_NAME} website`,
    "",
    `Name: ${i.name}`,
    `Email: ${i.email}`,
    i.phone ? `Phone / chat: ${i.phone}` : null,
    `Room: ${i.roomName || i.room || "Not sure yet"}`,
    i.moveIn ? `Move-in date: ${i.moveIn}` : null,
    i.lease ? `Lease length: ${i.lease}` : null,
    `Website language: ${i.lang || "en"}`,
    "",
    "Message:",
    i.message,
  ]
    .filter((line) => line !== null)
    .join("\n");
}

async function sendEmail(inquiry: Inquiry, text: string) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_TO_EMAIL;
  if (!key || !to) return null;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.INQUIRY_FROM_EMAIL || `${SITE_NAME} Website <onboarding@resend.dev>`,
      to: to.split(",").map((s) => s.trim()),
      reply_to: inquiry.email,
      subject: `New inquiry: ${inquiry.name}${inquiry.roomName ? ` — ${inquiry.roomName}` : ""}`,
      text,
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
  return true;
}

async function sendTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return null;

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
  });
  if (!res.ok) throw new Error(`Telegram ${res.status}: ${await res.text()}`);
  return true;
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "too_large" }, { status: 413 });
  }
  if (isRateLimited(clientIp(request))) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let inquiry: Inquiry;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return NextResponse.json({ ok: false, error: "too_large" }, { status: 413 });
    inquiry = clean(JSON.parse(raw));
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Honeypot: real visitors never see this field.
  if (inquiry.company) return NextResponse.json({ ok: true });

  if (!inquiry.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiry.email) || !inquiry.message) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const text = summary(inquiry);
  const results = await Promise.allSettled([sendEmail(inquiry, text), sendTelegram(text)]);
  const delivered = results.some((r) => r.status === "fulfilled" && r.value === true);
  const configured = results.some((r) => r.status === "rejected" || r.value !== null);

  for (const r of results) {
    if (r.status === "rejected") console.error("[inquiry] delivery failed:", r.reason);
  }

  if (!configured) {
    console.info("[inquiry] test mode (no email/Telegram configured):\n" + text);
    return NextResponse.json({ ok: true, testMode: true });
  }

  if (!delivered) return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  return NextResponse.json({ ok: true });
}
