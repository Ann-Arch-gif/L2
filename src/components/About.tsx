import type { Dictionary } from "@/lib/i18n";
import type { SiteSettings } from "@/sanity/types";
import { SanityImage } from "./SanityImage";

export function About({ dict, settings }: { dict: Dictionary; settings: SiteSettings }) {
  const { about } = dict;
  return (
    <section id="about" className="section scroll-mt-20 bg-paper">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="reveal relative aspect-[4/5] overflow-hidden bg-sand">
          <SanityImage
            image={settings.aboutImage}
            alt={about.title}
            sizes="(min-width: 1024px) 560px, 100vw"
            placeholderLabel={dict.photoPlaceholder}
          />
        </div>
        <div className="reveal">
          <p className="eyebrow">{about.eyebrow}</p>
          <h2 className="display mt-4 text-4xl sm:text-5xl">{about.title}</h2>
          <div className="mt-8 space-y-5 text-[1.0625rem] leading-relaxed">
            {about.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <p className="display mt-10 text-2xl italic text-gold">— {about.signature}</p>
        </div>
      </div>
    </section>
  );
}
