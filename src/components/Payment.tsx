import type { Dictionary } from "@/lib/i18n";
import type { SiteSettings } from "@/sanity/types";
import { SanityImage } from "./SanityImage";

// Hidden until "Show payment section" is turned on in the admin.
export function Payment({ dict, settings }: { dict: Dictionary; settings: SiteSettings }) {
  if (!settings.paymentEnabled) return null;
  const t = dict.payment;
  const details = [
    { label: t.bank, value: settings.bankName },
    { label: t.accountName, value: settings.accountName },
    { label: t.accountNumber, value: settings.accountNumber },
  ].filter((d) => d.value);

  return (
    <section id="payment" className="scroll-mt-20 pb-20 lg:pb-28">
      <div className="container-x">
        <div className="reveal grid items-center gap-10 border border-line p-8 sm:p-12 md:grid-cols-[auto_1fr]">
          {settings.paymentQr?.asset && (
            <div className="relative mx-auto size-52 bg-white">
              <SanityImage image={settings.paymentQr} alt={t.title} sizes="208px" className="!object-contain" />
            </div>
          )}
          <div>
            <p className="eyebrow">{t.eyebrow}</p>
            <h2 className="display mt-3 text-4xl">{t.title}</h2>
            <p className="mt-4 max-w-xl">{t.text}</p>
            {details.length > 0 && (
              <dl className="mt-8 grid gap-6 sm:grid-cols-3">
                {details.map((d) => (
                  <div key={d.label}>
                    <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{d.label}</dt>
                    <dd className="mt-1 font-semibold text-ink">{d.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
