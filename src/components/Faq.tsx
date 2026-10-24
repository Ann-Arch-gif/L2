import type { Dictionary } from "@/lib/i18n";
import { Icon } from "./Icon";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./motion";

export function Faq({ dict }: { dict: Dictionary }) {
  const { faq } = dict;
  if (faq.items.length === 0) return null;

  return (
    <section id="faq" className="scroll-mt-24 bg-sand/60 py-20 lg:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading eyebrow={faq.eyebrow} title={faq.title} align="left" />
        </div>
        <div className="space-y-3">
          {faq.items.map((item, i) => (
            <Reveal key={item.q} index={i % 3}>
              <details className="faq-item group card px-5 sm:px-6" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left font-semibold text-ink">
                  {item.q}
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sand text-terracotta transition-transform duration-300 group-open:rotate-180">
                    <Icon name="chevronDown" size={18} />
                  </span>
                </summary>
                <p className="pb-5 leading-relaxed text-muted">{item.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
