import Image from "next/image";
import { site } from "@/lib/content";
import type { Dictionary } from "@/lib/i18n";
import { Icon } from "./Icon";
import { Reveal } from "./motion";

// Hidden until "payment.enabled" is set to true in site.json.
export function Payment({ dict }: { dict: Dictionary }) {
  const { payment } = site;
  if (!payment.enabled) return null;

  const details = [
    { label: dict.payment.bank, value: payment.bankName },
    { label: dict.payment.accountName, value: payment.accountName },
    { label: dict.payment.accountNumber, value: payment.accountNumber },
  ].filter((d) => d.value);

  return (
    <section id="payment" className="scroll-mt-24 pb-20 lg:pb-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="card grid items-center gap-8 p-6 sm:p-10 md:grid-cols-[auto_1fr]">
          {payment.qrImage && (
            <div className="relative mx-auto size-52 overflow-hidden rounded-2xl border border-sand-deep bg-linen p-3">
              <Image src={payment.qrImage} alt={dict.payment.title} fill sizes="208px" className="object-contain p-3" />
            </div>
          )}
          <div>
            <p className="eyebrow">{dict.payment.eyebrow}</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-ink">{dict.payment.title}</h2>
            <p className="mt-3 max-w-xl text-muted">{dict.payment.text}</p>
            {details.length > 0 && (
              <dl className="mt-6 grid gap-4 sm:grid-cols-3">
                {details.map((d) => (
                  <div key={d.label} className="rounded-2xl bg-sand/70 p-4">
                    <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
                      <Icon name="bank" size={14} />
                      {d.label}
                    </dt>
                    <dd className="mt-1 font-semibold text-ink">{d.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
