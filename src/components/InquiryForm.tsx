"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { Icon } from "./Icon";
import { DatePicker, Select } from "./Pickers";

type Status = "idle" | "sending" | "success" | "error" | "invalid";

const fill = (template: string, n: number) => template.replace("{n}", String(n));

export function InquiryForm({
  lang,
  labels,
  picker,
  rooms,
  defaultRoom = "",
  minLeaseMonths,
}: {
  lang: Locale;
  labels: Dictionary["form"];
  picker: Dictionary["picker"];
  rooms: { slug: string; name: string }[];
  defaultRoom?: string;
  minLeaseMonths: number;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [room, setRoom] = useState(defaultRoom);
  const [moveIn, setMoveIn] = useState("");
  const [lease, setLease] = useState("");

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
      setRoom(defaultRoom);
      setMoveIn("");
      setLease("");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="dialog-in flex min-h-[26rem] flex-col items-center justify-center border border-line p-10 text-center">
        <span className="flex size-14 items-center justify-center rounded-full border border-gold text-gold">
          <Icon name="check" size={26} />
        </span>
        <h3 className="display mt-6 text-3xl">{labels.successTitle}</h3>
        <p className="mt-2 max-w-sm">{labels.success}</p>
        <button type="button" className="btn btn-outline mt-8" onClick={() => setStatus("idle")}>
          {labels.sendAnother}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
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
      <Field label={labels.room} optional={labels.optional} custom>
        <Select
          name="room"
          value={room}
          onChange={setRoom}
          ariaLabel={labels.room}
          options={[{ value: "", label: labels.anyRoom }, ...rooms.map((r) => ({ value: r.slug, label: r.name }))]}
        />
      </Field>
      <Field label={labels.moveIn} optional={labels.optional} custom>
        <DatePicker
          name="moveIn"
          value={moveIn}
          onChange={setMoveIn}
          lang={lang}
          labels={picker}
          placeholder={picker.selectDate}
          ariaLabel={labels.moveIn}
        />
      </Field>
      <Field label={labels.lease} optional={labels.optional} custom>
        <Select
          name="lease"
          value={lease}
          onChange={setLease}
          ariaLabel={labels.lease}
          options={[
            { value: "", label: "—" },
            ...leaseOptions.map((n) => ({ value: `${n} months`, label: fill(labels.monthsOption, n) })),
            { value: "12+ months", label: labels.longerOption },
          ]}
        />
      </Field>
      <Field label={labels.message} className="sm:col-span-2">
        <textarea
          name="message"
          required
          rows={5}
          maxLength={3000}
          placeholder={labels.messagePlaceholder}
          className="field resize-y"
        />
      </Field>

      <div className="flex flex-col-reverse gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p aria-live="polite" key={status} className="fade-in text-sm text-[#a2341f]">
          {status === "invalid" && labels.invalid}
          {status === "error" && labels.error}
        </p>
        <button type="submit" disabled={status === "sending"} aria-busy={status === "sending"} className="btn btn-dark disabled:cursor-wait disabled:opacity-80">
          {status === "sending" ? labels.sending : labels.submit}
          {status === "sending" ? <span className="spinner" aria-hidden="true" /> : <Icon name="arrowRight" size={16} />}
        </button>
      </div>
    </form>
  );
}

// Native inputs sit inside a <label>; custom pickers (which name themselves) use a plain wrapper,
// because a <label> would re-open them when an option inside is clicked.
function Field({
  label,
  optional,
  custom = false,
  className = "",
  children,
}: {
  label: string;
  optional?: string;
  custom?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const Wrapper = custom ? "div" : "label";
  return (
    <Wrapper className={`block ${className}`}>
      <span className="label">
        {label}
        {optional && <span className="ml-1.5 font-normal normal-case tracking-normal text-muted">({optional})</span>}
      </span>
      {children}
    </Wrapper>
  );
}
