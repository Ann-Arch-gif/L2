"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Icon, type IconName } from "./Icon";

export interface Channel {
  id: string;
  icon: IconName;
  label: string;
  value: string;
  href?: string;
}

export function ContactChannels({
  title,
  channels,
  wechat,
  labels,
}: {
  title: string;
  channels: Channel[];
  wechat?: { id: string; qr?: string };
  labels: { wechat: string; wechatTitle: string; wechatScan: string; copy: string; copied: string; close: string };
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

  if (channels.length === 0 && !wechat) return null;

  return (
    <div>
      <h3 className="font-display text-xl font-semibold text-ink">{title}</h3>
      <ul className="mt-5 grid gap-3">
        {channels.map((c) => (
          <li key={c.id}>
            <a
              href={c.href}
              target={c.href?.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="channel group"
            >
              <span className="channel-icon">
                <Icon name={c.icon} size={20} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-ink">{c.label}</span>
                <span className="block truncate text-sm text-muted">{c.value}</span>
              </span>
              <Icon name="arrowRight" size={16} className="ml-auto shrink-0 text-terracotta transition-transform group-hover:translate-x-1" />
            </a>
          </li>
        ))}
        {wechat && (
          <li>
            <button type="button" className="channel group w-full text-left" onClick={() => setOpen(true)}>
              <span className="channel-icon">
                <Icon name="wechat" size={20} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-ink">{labels.wechat}</span>
                <span className="block truncate text-sm text-muted">{wechat.id}</span>
              </span>
              <Icon name="arrowRight" size={16} className="ml-auto shrink-0 text-terracotta transition-transform group-hover:translate-x-1" />
            </button>
          </li>
        )}
      </ul>

      <AnimatePresence>
        {open && wechat && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="wechat-title"
              className="relative w-full max-w-sm rounded-3xl bg-card p-7 text-center shadow-2xl"
              initial={{ scale: 0.7, rotate: -4, y: 40 }}
              animate={{ scale: 1, rotate: 0, y: 0 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 16 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                aria-label={labels.close}
                className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-full text-muted hover:bg-sand"
                onClick={() => setOpen(false)}
                autoFocus
              >
                <Icon name="x" size={20} />
              </button>
              <h4 id="wechat-title" className="font-display text-2xl font-semibold text-ink">
                {labels.wechatTitle}
              </h4>
              <p className="mt-2 text-sm text-muted">{labels.wechatScan}</p>
              {wechat.qr && (
                <div className="relative mx-auto mt-5 size-52 overflow-hidden rounded-2xl border border-sand-deep bg-linen">
                  <Image src={wechat.qr} alt={labels.wechatTitle} fill sizes="208px" className="object-contain p-3" />
                </div>
              )}
              <div className="mt-5 flex items-center justify-center gap-2 rounded-full bg-sand px-4 py-2">
                <span className="font-semibold text-ink">{wechat.id}</span>
                <button
                  type="button"
                  onClick={copyId}
                  className="flex items-center gap-1 rounded-full px-2 py-1 text-sm font-semibold text-terracotta hover:bg-card"
                >
                  <Icon name={copied ? "check" : "copy"} size={15} />
                  {copied ? labels.copied : labels.copy}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
