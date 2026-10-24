"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { fmt, formatPrice } from "@/lib/format";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { Icon } from "./Icon";

// Quick search on the home page; opens the Rooms page with the filters filled in.
export function HeroSearch({
  lang,
  t,
  budgets,
}: {
  lang: Locale;
  t: Dictionary["hero"];
  budgets: number[];
}) {
  const router = useRouter();
  const [moveIn, setMoveIn] = useState("");
  const [max, setMax] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (moveIn) {
      params.set("avail", "by");
      params.set("date", moveIn);
    }
    if (max) params.set("max", max);
    const query = params.toString();
    router.push(`/${lang}/rooms${query ? `?${query}` : ""}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid w-full max-w-3xl gap-px bg-line shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] sm:grid-cols-[1fr_1fr_auto]"
    >
      <label className="block bg-white px-5 py-3">
        <span className="label !mb-1 !text-[0.6875rem] !text-muted">{t.moveIn}</span>
        <input
          type="date"
          value={moveIn}
          onChange={(e) => setMoveIn(e.target.value)}
          className="w-full bg-transparent text-[0.9375rem] font-medium text-ink outline-none"
        />
      </label>
      <label className="block bg-white px-5 py-3">
        <span className="label !mb-1 !text-[0.6875rem] !text-muted">{t.budget}</span>
        <select
          value={max}
          onChange={(e) => setMax(e.target.value)}
          className="w-full bg-transparent text-[0.9375rem] font-medium text-ink outline-none"
        >
          <option value="">{t.anyBudget}</option>
          {budgets.map((b) => (
            <option key={b} value={b}>
              {fmt(t.upTo, { price: formatPrice(b) })}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" className="btn btn-dark h-full min-h-14 rounded-none px-8">
        <Icon name="search" size={18} />
        {t.search}
      </button>
    </form>
  );
}
