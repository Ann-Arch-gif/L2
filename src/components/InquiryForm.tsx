"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, type FormEvent, type ReactNode } from "react";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { Icon } from "./Icon";

type Status = "idle" | "sending" | "success" | "error" | "invalid";

const fill = (template: string, n: number) => template.replace("{n}", String(n));

export function InquiryForm({
  lang,
  labels,
  rooms,
  defaultRoom = "",
  minLeaseMonths,
}: {
  lang: Locale;
  labels: Dictionary["form"];
  rooms: { slug: string; name: string }[];
  defaultRoom?: string;
  minLeaseMonths: number;
}) {
  const [status, setStatus] = useState<Status>("idle");

  const leaseOptions = Array.from(new Set([minLeaseMonths, 6, 12]))
    .filter((n) => n >= minLeaseMonths)
    .sort((a, b) => a - b);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    if (!data.name?.trim() || !/^\S+@\S+\.\S+$/.test(data.email ?? "") || !data.message?.trim()) {
      setStatus("invalid");
      return;
    }

    setStatus("sending");
    try {
      const roomName = rooms.find((r) => r.slug === data.room)?.name ?? "";
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, roomName, lang }),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="card relative overflow-hidden p-6 sm:p-8">
      <AnimatePresence mode="wait" initial={false}>
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.6, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 140, damping: 11 }}
            className="flex min-h-[24rem] flex-col items-center justify-center text-center"
            role="status"
          >
            <span className="flex size-16 items-center justify-center rounded-full bg-sage text-linen">
              <Icon name="check" size={32} />
            </span>
            <h3 className="mt-5 font-display text-2xl font-semibold text-ink">{labels.successTitle}</h3>
            <p className="mt-2 max-w-sm text-muted">{labels.success}</p>
            <button type="button" className="btn-secondary mt-6" onClick={() => setStatus("idle")}>
              {labels.sendAnother}
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={onSubmit}
            noValidate
            className="grid gap-5 sm:grid-cols-2"
          >
            {/* Hidden from people; bots that fill it in are ignored. */}
            <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

            <Field label={labels.name}>
              <input name="name" required autoComplete="name" maxLength={100} className="field" />
            </Field>
            <Field label={labels.email}>
              <input name="email" type="email" required autoComplete="email" maxLength={200} className="field" />
            </Field>
            <Field label={labels.phone} optional={labels.optional}>
              <input name="phone" type="tel" autoComplete="tel" maxLength={50} className="field" />
            </Field>
            <Field label={labels.room} optional={labels.optional}>
              <select name="room" defaultValue={defaultRoom} className="field">
                <option value="">{labels.anyRoom}</option>
                {rooms.map((r) => (
                  <option key={r.slug} value={r.slug}>
                    {r.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={labels.moveIn} optional={labels.optional}>
              <input name="moveIn" type="date" className="field" />
            </Field>
            <Field label={labels.lease} optional={labels.optional}>
              <select name="lease" defaultValue="" className="field">
                <option value="">—</option>
                {leaseOptions.map((n) => (
                  <option key={n} value={`${n} months`}>
                    {fill(labels.monthsOption, n)}
                  </option>
                ))}
                <option value="12+ months">{labels.longerOption}</option>
              </select>
            </Field>
            <Field label={labels.message} className="sm:col-span-2">
              <textarea
                name="message"
                required
                rows={4}
                maxLength={3000}
                placeholder={labels.messagePlaceholder}
                className="field resize-y"
              />
            </Field>

            <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
              <p aria-live="polite" className="text-sm text-terracotta">
                {status === "invalid" && labels.invalid}
                {status === "error" && labels.error}
              </p>
              <button type="submit" disabled={status === "sending"} className="btn-primary justify-center disabled:opacity-70">
                {status === "sending" ? labels.sending : labels.submit}
                <Icon name="telegram" size={18} />
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({
  label,
  optional,
  className = "",
  children,
}: {
  label: string;
  optional?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
        {optional && <span className="ml-1.5 font-normal text-muted">({optional})</span>}
      </span>
      {children}
    </label>
  );
}
