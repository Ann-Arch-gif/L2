const tones = {
  available: { box: "bg-sage text-linen", dot: "bg-[#c9f0a8]", ping: true },
  soon: { box: "bg-saffron text-ink", dot: "bg-ink/70", ping: false },
  rented: { box: "bg-ink/80 text-linen", dot: "bg-linen/60", ping: false },
};

export function StatusBadge({
  tone,
  label,
  className = "",
}: {
  tone: keyof typeof tones;
  label: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${tones[tone].box} ${className}`}
    >
      <span className="relative flex size-2">
        {tones[tone].ping && <span className={`status-ping absolute inset-0 rounded-full ${tones[tone].dot}`} />}
        <span className={`relative size-2 rounded-full ${tones[tone].dot}`} />
      </span>
      {label}
    </span>
  );
}
