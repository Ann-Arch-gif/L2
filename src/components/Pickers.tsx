"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { formatDate, monthName } from "@/lib/format";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { Icon } from "./Icon";

// Branded replacements for the browser's <select> and date picker.
// "bare" sits inside another box (home search, sort bar); "field" looks like the form fields.
type Variant = "bare" | "field";

const triggerStyles: Record<Variant, string> = {
  bare: "flex h-10 w-full items-center justify-between gap-3 text-left text-base font-medium text-ink outline-none",
  field: "field flex items-center justify-between gap-3 text-left",
};

// Closes a popover on outside click or Escape and returns focus to its trigger.
function usePopover() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    trigger.current?.focus();
  };
  return { open, setOpen, close, root, trigger };
}

// Shifts an open popover sideways so it never touches the screen edge on small phones.
function useKeepInView(open: boolean) {
  const ref = useRef<HTMLElement | null>(null);
  const [shift, setShift] = useState(0);
  useLayoutEffect(() => {
    if (!open || !ref.current) return setShift(0);
    const r = ref.current.getBoundingClientRect();
    const margin = 12;
    const vw = document.documentElement.clientWidth;
    if (r.right > vw - margin) setShift(vw - margin - r.right);
    else if (r.left < margin) setShift(margin - r.left);
  }, [open]);
  return { ref, style: shift ? { marginLeft: shift } : undefined };
}

// ---------------------------------------------------------------- Select

export interface Option {
  value: string;
  label: string;
}

export function Select({
  value,
  onChange,
  options,
  name,
  ariaLabel,
  variant = "field",
  align = "left",
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  name?: string;
  ariaLabel?: string;
  variant?: Variant;
  align?: "left" | "right";
  className?: string;
}) {
  const { open, setOpen, close, root, trigger } = usePopover();
  const listId = useId();
  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));
  const [active, setActive] = useState(selectedIndex);
  const list = useRef<HTMLUListElement>(null);
  const keep = useKeepInView(open);

  useEffect(() => {
    if (!open) return;
    setActive(selectedIndex);
    list.current?.focus({ preventScroll: true });
  }, [open, selectedIndex]);

  useEffect(() => {
    if (open) list.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  function choose(i: number) {
    onChange(options[i].value);
    close();
  }

  function onListKey(e: KeyboardEvent) {
    const last = options.length - 1;
    const moves: Record<string, number> = {
      ArrowDown: Math.min(active + 1, last),
      ArrowUp: Math.max(active - 1, 0),
      Home: 0,
      End: last,
    };
    if (e.key in moves) {
      e.preventDefault();
      setActive(moves[e.key]);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      choose(active);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  }

  return (
    <div ref={root} className={`relative ${className}`}>
      {name && <input type="hidden" name={name} value={value} />}
      <button
        ref={trigger}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ariaLabel}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className={`${triggerStyles[variant]} cursor-pointer`}
      >
        <span className="truncate">{options[selectedIndex]?.label}</span>
        <Icon
          name="chevronDown"
          size={16}
          className={`shrink-0 text-muted transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <ul
          ref={(el) => {
            list.current = el;
            keep.ref.current = el;
          }}
          style={keep.style}
          id={listId}
          role="listbox"
          tabIndex={-1}
          aria-label={ariaLabel}
          aria-activedescendant={`${listId}-${active}`}
          onKeyDown={onListKey}
          className={`pop-in absolute top-full z-50 mt-2 max-h-72 min-w-full overflow-y-auto border border-line bg-white py-1.5 shadow-[0_24px_48px_-20px_rgba(21,24,27,0.35)] outline-none ${
            align === "right" ? "right-0 origin-top-right" : "left-0 origin-top-left"
          }`}
        >
          {options.map((o, i) => {
            const selected = i === selectedIndex;
            return (
              <li
                key={o.value}
                id={`${listId}-${i}`}
                data-index={i}
                role="option"
                aria-selected={selected}
                onPointerEnter={() => setActive(i)}
                onClick={() => choose(i)}
                className={`flex min-h-11 cursor-pointer items-center justify-between gap-6 whitespace-nowrap px-4 text-[0.9375rem] transition-colors ${
                  i === active ? "bg-paper" : ""
                } ${selected ? "font-semibold text-ink" : "text-body"}`}
              >
                {o.label}
                <Icon name="check" size={16} className={`text-gold ${selected ? "" : "invisible"}`} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- Date picker

const weekdays: Record<Locale, string[]> = {
  en: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
  km: ["ច", "អ", "ព", "ព្រ", "សុ", "ស", "អា"],
  zh: ["一", "二", "三", "四", "五", "六", "日"],
};

const pad = (n: number) => String(n).padStart(2, "0");
const toIso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromIso = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const addMonths = (d: Date, n: number) => {
  const target = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(d.getDate(), lastDay));
};

export function DatePicker({
  value,
  onChange,
  lang,
  labels,
  placeholder,
  name,
  ariaLabel,
  variant = "field",
}: {
  value: string;
  onChange: (iso: string) => void;
  lang: Locale;
  labels: Dictionary["picker"];
  placeholder: string;
  name?: string;
  ariaLabel?: string;
  variant?: Variant;
}) {
  const { open, setOpen, close, root, trigger } = usePopover();
  const [today, setToday] = useState<Date | null>(null);
  const [focused, setFocused] = useState<Date>(() => (value ? fromIso(value) : new Date()));
  const grid = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const keep = useKeepInView(open);

  useEffect(() => {
    if (!open) return;
    const now = new Date();
    const t = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    setToday(t);
    const start = value ? fromIso(value) : t;
    setFocused(start < t ? t : start);
  }, [open, value]);

  // Keep keyboard focus on the highlighted day.
  useEffect(() => {
    if (open) grid.current?.querySelector<HTMLElement>(`[data-date="${toIso(focused)}"]`)?.focus({ preventScroll: true });
  }, [focused, open]);

  const isPast = (d: Date) => !!today && d < today;

  function pick(d: Date) {
    if (isPast(d)) return;
    onChange(toIso(d));
    close();
  }

  function onGridKey(e: KeyboardEvent) {
    const moves: Record<string, () => Date> = {
      ArrowLeft: () => addDays(focused, -1),
      ArrowRight: () => addDays(focused, 1),
      ArrowUp: () => addDays(focused, -7),
      ArrowDown: () => addDays(focused, 7),
      PageUp: () => addMonths(focused, -1),
      PageDown: () => addMonths(focused, 1),
      Home: () => addDays(focused, -((focused.getDay() + 6) % 7)),
      End: () => addDays(focused, 6 - ((focused.getDay() + 6) % 7)),
    };
    if (e.key in moves) {
      e.preventDefault();
      const next = moves[e.key]();
      if (!isPast(next)) setFocused(next);
    }
  }

  // Six weeks starting on the Monday on/before the 1st of the shown month.
  const first = new Date(focused.getFullYear(), focused.getMonth(), 1);
  const gridStart = addDays(first, -((first.getDay() + 6) % 7));
  const days = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  const canGoBack = !today || new Date(focused.getFullYear(), focused.getMonth(), 0) >= today;

  return (
    <div ref={root} className="relative">
      {name && <input type="hidden" name={name} value={value} />}
      <button
        ref={trigger}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={ariaLabel ? `${ariaLabel}${value ? `: ${formatDate(value, lang)}` : ""}` : undefined}
        onClick={() => setOpen((v) => !v)}
        className={`${triggerStyles[variant]} cursor-pointer`}
      >
        <span className={`truncate ${value ? "" : "text-muted"}`}>{value ? formatDate(value, lang) : placeholder}</span>
        <Icon name="calendar" size={17} className="shrink-0 text-muted" />
      </button>

      {open && (
        <div
          ref={(el) => {
            keep.ref.current = el;
          }}
          style={keep.style}
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          className="pop-in absolute left-0 top-full z-50 mt-2 w-[min(20rem,calc(100vw-2.5rem))] origin-top-left border border-line bg-white p-4 shadow-[0_24px_48px_-20px_rgba(21,24,27,0.35)]"
        >
          <div className="flex items-center justify-between">
            <p id={titleId} aria-live="polite" className="display text-2xl">
              {monthName(focused.getMonth() + 1, lang)} {focused.getFullYear()}
            </p>
            <div className="flex">
              <button
                type="button"
                aria-label={labels.prevMonth}
                disabled={!canGoBack}
                onClick={() => setFocused(addMonths(focused, -1))}
                className="flex size-10 items-center justify-center text-ink transition-colors hover:bg-paper disabled:cursor-default disabled:text-line disabled:hover:bg-transparent"
              >
                <Icon name="chevronLeft" size={18} />
              </button>
              <button
                type="button"
                aria-label={labels.nextMonth}
                onClick={() => setFocused(addMonths(focused, 1))}
                className="flex size-10 items-center justify-center text-ink transition-colors hover:bg-paper"
              >
                <Icon name="chevronRight" size={18} />
              </button>
            </div>
          </div>

          <div ref={grid} role="grid" onKeyDown={onGridKey} className="mt-3 grid grid-cols-7 gap-y-1 text-center">
            {weekdays[lang].map((d) => (
              <span key={d} role="columnheader" className="pb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                {d}
              </span>
            ))}
            {days.map((d) => {
              const iso = toIso(d);
              const inMonth = d.getMonth() === focused.getMonth();
              const selected = iso === value;
              const isToday = !!today && iso === toIso(today);
              const past = isPast(d);
              return (
                <button
                  key={iso}
                  type="button"
                  role="gridcell"
                  data-date={iso}
                  tabIndex={iso === toIso(focused) ? 0 : -1}
                  aria-selected={selected}
                  aria-current={isToday ? "date" : undefined}
                  aria-label={formatDate(iso, lang)}
                  disabled={past}
                  onClick={() => pick(d)}
                  className={`mx-auto flex size-10 items-center justify-center rounded-full text-sm tabular-nums transition-colors ${
                    selected
                      ? "bg-ink font-semibold text-white"
                      : past
                        ? "cursor-default text-line"
                        : `${inMonth ? "text-ink" : "text-muted/60"} hover:bg-paper`
                  } ${isToday && !selected ? "ring-1 ring-gold" : ""}`}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-sm font-semibold">
            <button
              type="button"
              onClick={() => {
                onChange("");
                close();
              }}
              className="hit text-muted transition-colors hover:text-ink"
            >
              {labels.clear}
            </button>
            <button type="button" onClick={() => today && pick(today)} className="hit text-gold transition-colors hover:text-ink">
              {labels.today}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
