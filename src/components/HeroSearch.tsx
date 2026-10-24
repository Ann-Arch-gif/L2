"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { fmt, formatPrice } from "@/lib/format";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { Icon } from "./Icon";
import { DatePicker, Select } from "./Pickers";

// Quick search on the home page; opens the Rooms page with the filters filled in.
export function HeroSearch({
  lang,
  t,
  picker,
  budgets,
}: {
  lang: Locale;
  t: Dictionary["hero"];
  picker: Dictionary["picker"];
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
      <div className="bg-white px-5 py-2">
        <span className="label !mb-0.5 !text-xs !text-muted">{t.moveIn}</span>
        <DatePicker
          variant="bare"
          value={moveIn}
          onChange={setMoveIn}
          lang={lang}
          labels={picker}
          placeholder={picker.anyDate}
          ariaLabel={t.moveIn}
        />
      </div>
      <div className="bg-white px-5 py-2">
        <span className="label !mb-0.5 !text-xs !text-muted">{t.budget}</span>
        <Select
          variant="bare"
          value={max}
          onChange={setMax}
          ariaLabel={t.budget}
          options={[
            { value: "", label: t.anyBudget },
            ...budgets.map((b) => ({ value: String(b), label: fmt(t.upTo, { price: formatPrice(b) }) })),
          ]}
        />
      </div>
      <button type="submit" className="btn btn-dark h-full min-h-14 rounded-none px-8">
        <Icon name="search" size={18} />
        {t.search}
      </button>
    </form>
  );
}
