import { stagger } from "@/lib/format";
import type { Dictionary } from "@/lib/i18n";
import { featureLabel, serviceIcons } from "@/lib/room-utils";
import { Icon } from "./Icon";
import { SectionHeader } from "./SectionHeader";

export function Services({ dict, services }: { dict: Dictionary; services: string[] }) {
  if (services.length === 0) return null;
  return (
    <section id="services" className="section scroll-mt-20">
      <div className="container-x">
        <SectionHeader eyebrow={dict.services.eyebrow} title={dict.services.title} />
        <ul className="mt-14 grid grid-cols-2 border-l border-t border-line md:grid-cols-4">
          {services.map((key, i) => (
            <li key={key} style={stagger(i % 4)} className="reveal flex flex-col gap-4 border-b border-r border-line p-6 sm:p-8">
              <Icon name={serviceIcons[key] ?? "check"} size={30} className="text-gold" />
              <span className="text-[0.9375rem] font-medium text-ink">{featureLabel(dict.serviceItems, key)}</span>
            </li>
          ))}
          {/* Empty cells so the last row keeps its borders (2 columns on phones, 4 from md up). */}
          {Array.from({ length: Math.max((4 - (services.length % 4)) % 4, services.length % 2) }, (_, i) => (
            <li
              key={`filler-${i}`}
              aria-hidden="true"
              className={`border-b border-r border-line ${i < services.length % 2 ? "" : "hidden"} ${
                i < (4 - (services.length % 4)) % 4 ? "md:block" : "md:hidden"
              }`}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
