import { stagger } from "@/lib/format";
import type { Dictionary } from "@/lib/i18n";
import { SectionHeader } from "./SectionHeader";

export function HowToRent({ dict }: { dict: Dictionary }) {
  const { steps } = dict;
  return (
    <section id="how-to-rent" className="section scroll-mt-20 bg-night">
      <div className="container-x">
        <SectionHeader eyebrow={steps.eyebrow} title={steps.title} light />
        <ol className="mt-14 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.items.map((step, i) => (
            <li key={step.title} style={stagger(i)} className="reveal bg-night py-8 sm:p-8 lg:p-10">
              <span className="display text-6xl text-gold-light">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="display mt-6 text-2xl !text-white">{step.title}</h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-white/65">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
