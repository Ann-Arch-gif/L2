"use client";

import { startTransition, useEffect, useMemo, useState, ViewTransition, type ReactNode } from "react";
import { fmt, formatPrice } from "@/lib/format";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { availableBy, byAvailability, featureLabel } from "@/lib/room-utils";
import type { RoomCardData } from "@/sanity/types";
import { Icon } from "./Icon";
import { RoomCard } from "./RoomCard";

type Availability = "any" | "now" | "by";
type Sort = "recommended" | "priceAsc" | "priceDesc" | "size";

interface Filters {
  min: number;
  max: number;
  avail: Availability;
  date: string;
  furniture: string[];
  services: string[];
  sort: Sort;
}

const VISIBLE_OPTIONS = 6;

function priceBounds(rooms: RoomCardData[]) {
  const prices = rooms.map((r) => r.priceFrom ?? 0);
  const lo = prices.length ? Math.floor(Math.min(...prices) / 50) * 50 : 0;
  let hi = prices.length ? Math.ceil(Math.max(...prices) / 50) * 50 : 1000;
  if (hi <= lo) hi = lo + 50;
  return { lo, hi };
}

// Keys used by at least one room, in the same order as the labels list.
function optionsFor(rooms: RoomCardData[], field: "furniture" | "services", labels: Record<string, string>) {
  const counts = new Map<string, number>();
  for (const room of rooms) for (const key of room[field] ?? []) counts.set(key, (counts.get(key) ?? 0) + 1);
  const order = Object.keys(labels);
  return [...counts.entries()]
    .sort(([a], [b]) => (order.indexOf(a) + 1 || 999) - (order.indexOf(b) + 1 || 999))
    .map(([key, count]) => ({ key, count, label: featureLabel(labels, key) }));
}

function readFilters(params: URLSearchParams, lo: number, hi: number): Filters {
  const num = (v: string | null, fallback: number) => {
    const n = Number(v);
    return v && Number.isFinite(n) ? Math.min(Math.max(n, lo), hi) : fallback;
  };
  const avail = params.get("avail");
  const sort = params.get("sort");
  const list = (v: string | null) => (v ? v.split(",").filter(Boolean) : []);
  return {
    min: num(params.get("min"), lo),
    max: num(params.get("max"), hi),
    avail: avail === "now" || avail === "by" ? avail : "any",
    date: params.get("date") ?? "",
    furniture: list(params.get("f")),
    services: list(params.get("s")),
    sort: sort === "priceAsc" || sort === "priceDesc" || sort === "size" ? sort : "recommended",
  };
}

function writeFilters(f: Filters, lo: number, hi: number) {
  const params = new URLSearchParams();
  if (f.min > lo) params.set("min", String(f.min));
  if (f.max < hi) params.set("max", String(f.max));
  if (f.avail !== "any") params.set("avail", f.avail);
  if (f.avail === "by" && f.date) params.set("date", f.date);
  if (f.furniture.length) params.set("f", f.furniture.join(","));
  if (f.services.length) params.set("s", f.services.join(","));
  if (f.sort !== "recommended") params.set("sort", f.sort);
  const query = params.toString();
  window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
}

function applyFilters(rooms: RoomCardData[], f: Filters) {
  const result = rooms.filter((room) => {
    const price = room.priceFrom ?? 0;
    if (price < f.min || price > f.max) return false;
    if (f.avail === "now" && room.status && room.status !== "available") return false;
    if (f.avail === "by" && !availableBy(room, f.date)) return false;
    if (f.furniture.some((k) => !room.furniture?.includes(k))) return false;
    if (f.services.some((k) => !room.services?.includes(k))) return false;
    return true;
  });
  const price = (r: RoomCardData) => r.priceFrom ?? 0;
  if (f.sort === "priceAsc") return result.sort((a, b) => price(a) - price(b));
  if (f.sort === "priceDesc") return result.sort((a, b) => price(b) - price(a));
  if (f.sort === "size") return result.sort((a, b) => (b.size ?? 0) - (a.size ?? 0));
  return result.sort(byAvailability);
}

export function RoomsExplorer({
  lang,
  rooms,
  t,
  furnitureLabels,
  serviceLabels,
  placeholder,
  closeLabel,
}: {
  lang: Locale;
  rooms: RoomCardData[];
  t: Dictionary["rooms"];
  furnitureLabels: Record<string, string>;
  serviceLabels: Record<string, string>;
  placeholder: string;
  closeLabel: string;
}) {
  const { lo, hi } = useMemo(() => priceBounds(rooms), [rooms]);
  // `filters` drives the controls and updates instantly; `applied` drives the results and
  // updates inside a transition, so the cards animate without the controls lagging.
  const [filters, setFilters] = useState<Filters>(() => readFilters(new URLSearchParams(), lo, hi));
  const [applied, setApplied] = useState<Filters>(filters);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // The page is pre-rendered with every room; filters from the address bar apply once it loads.
  useEffect(() => {
    const fromUrl = readFilters(new URLSearchParams(window.location.search), lo, hi);
    setFilters(fromUrl);
    setApplied(fromUrl);
  }, [lo, hi]);

  const furnitureOptions = useMemo(() => optionsFor(rooms, "furniture", furnitureLabels), [rooms, furnitureLabels]);
  const serviceOptions = useMemo(() => optionsFor(rooms, "services", serviceLabels), [rooms, serviceLabels]);
  const results = useMemo(() => applyFilters(rooms, applied), [rooms, applied]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  // Changes run as a transition so the room cards animate into their new places.
  // The price slider updates instantly instead, to follow the thumb while dragging.
  function update(patch: Partial<Filters>, animate = true) {
    const next = { ...filters, ...patch };
    setFilters(next);
    if (animate) startTransition(() => setApplied(next));
    else setApplied(next);
    writeFilters(next, lo, hi);
  }

  const toggle = (field: "furniture" | "services", key: string) =>
    update({
      [field]: filters[field].includes(key) ? filters[field].filter((k) => k !== key) : [...filters[field], key],
    });

  const clearAll = () =>
    update({ min: lo, max: hi, avail: "any", date: "", furniture: [], services: [] });

  // Removable chips for every active filter.
  const chips: { label: string; remove: () => void }[] = [];
  if (filters.min > lo || filters.max < hi) {
    chips.push({
      label: `${formatPrice(filters.min)} – ${formatPrice(filters.max)}`,
      remove: () => update({ min: lo, max: hi }),
    });
  }
  if (filters.avail === "now") chips.push({ label: t.availableNow, remove: () => update({ avail: "any" }) });
  if (filters.avail === "by") {
    chips.push({
      label: filters.date ? `${t.availableBy} ${filters.date}` : t.availableBy,
      remove: () => update({ avail: "any", date: "" }),
    });
  }
  for (const key of filters.furniture) {
    chips.push({ label: featureLabel(furnitureLabels, key), remove: () => toggle("furniture", key) });
  }
  for (const key of filters.services) {
    chips.push({ label: featureLabel(serviceLabels, key), remove: () => toggle("services", key) });
  }

  const countLabel = results.length === 1 ? t.resultsOne : fmt(t.resultsMany, { n: results.length });

  // Rendered twice (sidebar and phone drawer), so each copy gets its own radio group name.
  const panel = (place: "side" | "drawer") => (
    <div className="divide-y divide-line">
      <FilterGroup title={t.price}>
        <p className="flex justify-between text-sm font-semibold text-ink">
          <span>{formatPrice(filters.min)}</span>
          <span>{formatPrice(filters.max)}</span>
        </p>
        <div className="relative mt-4 h-5">
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-line" />
          <div
            className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-ink"
            style={{
              left: `${((filters.min - lo) / (hi - lo)) * 100}%`,
              right: `${100 - ((filters.max - lo) / (hi - lo)) * 100}%`,
            }}
          />
          <input
            type="range"
            aria-label={`${t.price} – ${t.min}`}
            min={lo}
            max={hi}
            step={10}
            value={filters.min}
            onChange={(e) => update({ min: Math.min(Number(e.target.value), filters.max - 10) }, false)}
            className="range"
          />
          <input
            type="range"
            aria-label={`${t.price} – ${t.max}`}
            min={lo}
            max={hi}
            step={10}
            value={filters.max}
            onChange={(e) => update({ max: Math.max(Number(e.target.value), filters.min + 10) }, false)}
            className="range"
          />
        </div>
        <p className="mt-2 flex justify-between text-xs text-muted">
          <span>{t.min}</span>
          <span>{t.max}</span>
        </p>
      </FilterGroup>

      <FilterGroup title={t.availability}>
        <div>
          {(
            [
              ["any", t.any],
              ["now", t.availableNow],
              ["by", t.availableBy],
            ] as const
          ).map(([value, label]) => (
            <label key={value} className="flex min-h-11 cursor-pointer items-center gap-3 text-[0.9375rem] text-ink">
              <input
                type="radio"
                name={`avail-${place}`}
                className="check"
                checked={filters.avail === value}
                onChange={() => update({ avail: value })}
              />
              {label}
            </label>
          ))}
          {filters.avail === "by" && (
            <input
              type="date"
              aria-label={t.availableBy}
              value={filters.date}
              onChange={(e) => update({ date: e.target.value })}
              className="field mt-1"
            />
          )}
        </div>
      </FilterGroup>

      {furnitureOptions.length > 0 && (
        <FilterGroup title={t.inTheRoom}>
          <CheckList
            options={furnitureOptions}
            selected={filters.furniture}
            onToggle={(key) => toggle("furniture", key)}
            moreLabel={t.showMore}
            lessLabel={t.showLess}
          />
        </FilterGroup>
      )}

      {serviceOptions.length > 0 && (
        <FilterGroup title={t.services}>
          <CheckList
            options={serviceOptions}
            selected={filters.services}
            onToggle={(key) => toggle("services", key)}
            moreLabel={t.showMore}
            lessLabel={t.showLess}
          />
        </FilterGroup>
      )}
    </div>
  );

  return (
    <div className="container-x grid gap-10 pb-24 pt-10 lg:grid-cols-[280px_1fr] lg:gap-14">
      <aside className="hidden lg:block">
        <div className="sticky top-28">
          <div className="flex items-center justify-between border-b border-ink pb-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink">{t.filters}</h2>
            {chips.length > 0 && (
              <button type="button" onClick={clearAll} className="hit text-xs font-semibold text-muted underline hover:text-ink">
                {t.clear}
              </button>
            )}
          </div>
          {panel("side")}
        </div>
      </aside>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="btn btn-outline min-h-10 px-4 lg:hidden"
            >
              <Icon name="sliders" size={16} />
              {t.filters}
              {chips.length > 0 && <span className="text-gold">({chips.length})</span>}
            </button>
            <p aria-live="polite" className="text-sm font-semibold text-ink">
              {countLabel}
            </p>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <span className="text-muted">{t.sort}</span>
            <select
              value={filters.sort}
              onChange={(e) => update({ sort: e.target.value as Sort })}
              className="min-h-11 cursor-pointer bg-transparent text-base font-semibold text-ink outline-none"
            >
              <option value="recommended">{t.sortRecommended}</option>
              <option value="priceAsc">{t.sortPriceAsc}</option>
              <option value="priceDesc">{t.sortPriceDesc}</option>
              <option value="size">{t.sortSize}</option>
            </select>
          </label>
        </div>

        {chips.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <li key={chip.label}>
                <button
                  type="button"
                  onClick={chip.remove}
                  className="pop-in flex min-h-10 items-center gap-2 border border-line bg-paper px-3 py-1.5 text-sm text-ink transition-colors hover:border-ink"
                >
                  {chip.label}
                  <Icon name="x" size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}

        {results.length > 0 ? (
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {results.map((room) => (
              <ViewTransition
                key={room._id}
                name={`card-${room._id}`}
                enter="card"
                exit="card"
                update="card"
                default="none"
              >
                <div className="h-full">
                  <RoomCard
                    room={room}
                    lang={lang}
                    t={t}
                    placeholder={placeholder}
                    sizes="(min-width: 1024px) 460px, (min-width: 768px) 50vw, 100vw"
                  />
                </div>
              </ViewTransition>
            ))}
          </div>
        ) : (
          <div className="fade-in mt-8 border border-line px-6 py-20 text-center">
            <Icon name="search" size={30} className="mx-auto text-gold" />
            <h3 className="display mt-5 text-3xl">{t.noResults}</h3>
            <p className="mx-auto mt-3 max-w-md">{t.noResultsHint}</p>
            <button type="button" onClick={clearAll} className="btn btn-outline mt-8">
              {t.clear}
            </button>
          </div>
        )}
      </div>

      {drawerOpen && (
        <div role="dialog" aria-modal="true" aria-label={t.filters} className="sheet-in fixed inset-0 z-50 flex flex-col bg-white lg:hidden">
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink">{t.filters}</h2>
            <button
              type="button"
              aria-label={closeLabel}
              onClick={() => setDrawerOpen(false)}
              className="-mr-2 flex size-11 items-center justify-center text-ink"
            >
              <Icon name="x" size={22} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5">{panel("drawer")}</div>
          <div className="flex shrink-0 items-center gap-3 border-t border-line p-4">
            <button type="button" onClick={clearAll} className="btn btn-outline flex-1">
              {t.clear}
            </button>
            <button type="button" onClick={() => setDrawerOpen(false)} className="btn btn-dark flex-[2]">
              {t.showResults} ({results.length})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="py-6">
      <legend className="sr-only">{title}</legend>
      <p aria-hidden="true" className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-ink">
        {title}
      </p>
      {children}
    </fieldset>
  );
}

function CheckList({
  options,
  selected,
  onToggle,
  moreLabel,
  lessLabel,
}: {
  options: { key: string; label: string; count: number }[];
  selected: string[];
  onToggle: (key: string) => void;
  moreLabel: string;
  lessLabel: string;
}) {
  const [expanded, setExpanded] = useState(false);
  // Always show selected options, even when the list is collapsed.
  const visible = expanded
    ? options
    : options.filter((o, i) => i < VISIBLE_OPTIONS || selected.includes(o.key));

  return (
    <div>
      <ul>
        {visible.map((option) => (
          <li key={option.key}>
            <label className="flex min-h-11 cursor-pointer items-center gap-3 text-[0.9375rem] text-ink">
              <input
                type="checkbox"
                className="check"
                checked={selected.includes(option.key)}
                onChange={() => onToggle(option.key)}
              />
              <span className="flex-1">{option.label}</span>
              <span className="text-xs text-muted">{option.count}</span>
            </label>
          </li>
        ))}
      </ul>
      {options.length > VISIBLE_OPTIONS && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 flex min-h-11 items-center gap-1 text-sm font-semibold text-ink underline underline-offset-4"
        >
          {expanded ? lessLabel : `${moreLabel} (${options.length - VISIBLE_OPTIONS})`}
        </button>
      )}
    </div>
  );
}
