import type { Dictionary } from "@/lib/i18n";
import { Icon, type IconName } from "./Icon";
import { Reveal } from "./motion";

const stepIcons: IconName[] = ["message", "video", "signature", "key"];

export function HowToRent({ dict }: { dict: Dictionary }) {
  const { steps } = dict;
  return (
    <section id="how-to-rent" className="scroll-mt-24 bg-terracotta-dark py-20 text-linen lg:py-28">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center !text-saffron">{steps.eyebrow}</p>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.75rem]">
            {steps.title}
          </h2>
        </Reveal>

        <ol className="relative mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <span
            aria-hidden="true"
            className="absolute left-[12.5%] right-[12.5%] top-8 hidden border-t-2 border-dashed border-linen/25 lg:block"
          />
          {steps.items.map((step, i) => (
            <li key={step.title} className="relative text-center">
              <Reveal variant="pop" index={i} className="relative mx-auto w-fit">
                <span className="flex size-16 items-center justify-center rounded-full bg-saffron text-ink shadow-[0_0_0_8px_var(--color-terracotta-dark)]">
                  <Icon name={stepIcons[i % stepIcons.length]} size={26} />
                </span>
                <span className="absolute -right-2 -top-2 flex size-7 items-center justify-center rounded-full bg-linen text-sm font-bold text-terracotta-dark">
                  {i + 1}
                </span>
              </Reveal>
              <Reveal index={i}>
                <h3 className="mt-5 font-display text-xl font-semibold">{step.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-linen/80">{step.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
