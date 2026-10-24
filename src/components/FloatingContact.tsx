"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Channel } from "./ContactChannels";
import { Icon } from "./Icon";
import { Bob } from "./motion";

// Round chat button in the corner that opens quick links to Telegram, WhatsApp and phone.
export function FloatingContact({ label, close, channels }: { label: string; close: string; channels: Channel[] }) {
  const [open, setOpen] = useState(false);
  if (channels.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 sm:bottom-7 sm:right-7">
      <AnimatePresence>
        {open &&
          channels.map((c, i) => (
            <motion.a
              key={c.id}
              href={c.href}
              target={c.href?.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20, scale: 0.6 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.6 }}
              transition={{ type: "spring", stiffness: 380, damping: 20, delay: (channels.length - 1 - i) * 0.05 }}
              className="flex items-center gap-2 rounded-full bg-card py-2 pl-4 pr-2 text-sm font-semibold text-ink shadow-[0_12px_30px_-12px_rgba(78,52,36,0.5)] hover:text-terracotta"
            >
              {c.label}
              <span className="flex size-9 items-center justify-center rounded-full bg-sand text-terracotta">
                <Icon name={c.icon} size={18} />
              </span>
            </motion.a>
          ))}
      </AnimatePresence>
      <motion.button
        type="button"
        aria-expanded={open}
        aria-label={open ? close : label}
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="flex size-15 items-center justify-center rounded-full bg-terracotta text-linen shadow-[0_16px_36px_-12px_rgba(122,60,32,0.8)]"
      >
        {open ? (
          <Icon name="x" size={26} />
        ) : (
          <Bob>
            <Icon name="message" size={26} />
          </Bob>
        )}
      </motion.button>
    </div>
  );
}
