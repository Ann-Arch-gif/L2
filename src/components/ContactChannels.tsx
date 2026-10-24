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

  const row = "group flex w-full items-center gap-4 border-b border-line py-4 text-left";

  return (
    <div>
      <p className="eyebrow">{labels.channels}</p>
      <ul className="mt-4 border-t border-line">
        {channels.map((c) => (
          <li key={c.id}>
            <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className={row}>
              <Icon name={c.icon} size={20} className="shrink-0 text-gold" />
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-muted">{c.label}</span>
                <span className="block truncate text-ink">{c.value}</span>
              </span>
              <Icon name="arrowRight" size={16} className="shrink-0 text-ink transition-transform group-hover:translate-x-1" />
            </a>
          </li>
        ))}
        {wechat && (
          <li>
            <button type="button" className={row} onClick={() => setOpen(true)}>
              <Icon name="wechat" size={20} className="shrink-0 text-gold" />
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-muted">{labels.wechat}</span>
                <span className="block truncate text-ink">{wechat.id}</span>
              </span>
              <Icon name="arrowRight" size={16} className="shrink-0 text-ink transition-transform group-hover:translate-x-1" />
            </button>
          </li>
        )}
      </ul>

      {open && wechat && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="wechat-title"
            className="relative w-full max-w-sm bg-white p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label={labels.close}
              onClick={() => setOpen(false)}
              autoFocus
              className="absolute right-3 top-3 flex size-10 items-center justify-center text-muted hover:text-ink"
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
