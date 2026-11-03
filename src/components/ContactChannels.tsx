"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Channel } from "@/lib/channels";
import type { Dictionary } from "@/lib/i18n";
import { urlFor } from "@/sanity/image";
import type { SanityImage } from "@/sanity/types";
import { Icon } from "./Icon";

export function ContactChannels({
  channels,
  wechat,
  labels,
}: {
  channels: Channel[];
  wechat?: { id: string; qr?: SanityImage | null };
  labels: Dictionary["contact"];
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function copyId() {
    if (!wechat) return;
    try {
      await navigator.clipboard.writeText(wechat.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the ID is still visible to copy by hand.
    }
  }

  // Icon-only buttons; the name shows in a small tooltip on hover or keyboard focus.
  const tile =
    "group relative flex aspect-square w-full items-center justify-center border border-line text-gold transition-[background-color,border-color,color,transform] duration-(--dur-base) ease-(--ease-out) hover:-translate-y-0.5 hover:border-ink hover:bg-ink hover:text-white focus-visible:border-ink sm:size-14";
  const tip = (text: string) => (
    <span
      aria-hidden
      className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 translate-y-1 whitespace-nowrap bg-ink px-2.5 py-1 text-xs font-semibold text-white opacity-0 transition-[opacity,transform] duration-(--dur-base) ease-(--ease-out) group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
    >
      {text}
    </span>
  );

  return (
    <div>
      <p className="eyebrow">{labels.channels}</p>
      <ul className="mt-5 grid grid-cols-6 gap-2 sm:flex sm:flex-wrap sm:gap-3">
        {channels.map((c) => (
          <li key={c.id}>
            <a
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              aria-label={`${c.label}: ${c.value}`}
              className={tile}
            >
              <Icon name={c.icon} size={22} />
              {tip(c.label)}
            </a>
          </li>
        ))}
        {wechat && (
          <li>
            <button type="button" aria-label={`${labels.wechat}: ${wechat.id}`} className={tile} onClick={() => setOpen(true)}>
              <Icon name="wechat" size={22} />
              {tip(labels.wechat)}
            </button>
          </li>
        )}
      </ul>

      {open && wechat && (
        <div
          className="fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="wechat-title"
            className="dialog-in relative w-full max-w-sm bg-white p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label={labels.close}
              onClick={() => setOpen(false)}
              autoFocus
              className="absolute right-2 top-2 flex size-11 items-center justify-center text-muted hover:text-ink"
            >
              <Icon name="x" size={20} />
            </button>
            <h3 id="wechat-title" className="display text-3xl">
              {labels.wechatTitle}
            </h3>
            <p className="mt-2 text-sm">{labels.wechatScan}</p>
            {wechat.qr?.asset && (
              <Image
                src={urlFor(wechat.qr).width(400).url()}
                alt={labels.wechatTitle}
                width={208}
                height={208}
                className="mx-auto mt-6 size-52 object-contain"
              />
            )}
            <div className="mt-6 flex items-center justify-center gap-3 border border-line px-4 py-3">
              <span className="font-semibold text-ink">{wechat.id}</span>
              <button type="button" onClick={copyId} className="flex items-center gap-1 text-sm font-semibold text-gold">
                <Icon name={copied ? "check" : "copy"} size={15} />
                {copied ? labels.copied : labels.copy}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
