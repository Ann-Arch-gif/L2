import { site } from "@/lib/content";
import type { Dictionary } from "@/lib/i18n";
import { Icon, type IconName } from "./Icon";
import { Photo } from "./Photo";
import { Reveal } from "./motion";

const highlightIcons: IconName[] = ["heart", "key", "globe"];

export function About({ dict }: { dict: Dictionary }) {
  const { about } = dict;
  return (
    <section id="about" className="scroll-mt-24 py-20 lg:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <Reveal className="relative order-last lg:order-first">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] rounded-tl-[7rem] border border-sand-deep">
            <Photo
              src={site.aboutImage}
              alt={about.title}
              placeholderLabel={dict.photoPlaceholder}
              sizes="(min-width: 1024px) 540px, 100vw"
            />
          </div>
          <div aria-hidden="true" className="lattice absolute -bottom-6 -right-4 -z-10 h-40 w-40 rounded-3xl sm:-right-6" />
        </Reveal>

        <div>
          <Reveal>
            <p className="eyebrow">{about.eyebrow}</p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl lg:text-[2.75rem]">
              {about.title}
            </h2>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted">
              {about.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>

          <ul className="mt-10 grid gap-5 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {about.highlights.map((item, i) => (
              <li key={item.title}>
                <Reveal variant="pop" index={i}>
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-sage-light text-sage">
                    <Icon name={highlightIcons[i % highlightIcons.length]} size={22} />
                  </span>
                </Reveal>
                <h3 className="mt-3 font-semibold text-ink">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
