import type { StatusTone } from "@/lib/room-utils";

const tones: Record<StatusTone, string> = {
  available: "bg-ok-bg text-ok",
  soon: "bg-soon-bg text-soon",
  rented: "bg-rented-bg text-rented",
};

const dots: Record<StatusTone, string> = {
  available: "bg-ok",
  soon: "bg-soon",
  rented: "bg-rented",
};

export function StatusBadge({ tone, label, className = "" }: { tone: StatusTone; label: string; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-[2px] px-2.5 py-1 text-xs font-semibold ${tones[tone]} ${className}`}
    >
      <span className={`size-1.5 rounded-full ${dots[tone]}`} />
      {label}
    </span>
  );
}
