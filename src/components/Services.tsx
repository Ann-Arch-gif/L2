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
        <ul className="reveal mt-14 grid grid-cols-2 border-l border-t border-line md:grid-cols-4">
          {services.map((key) => (
            <li key={key} className="flex flex-col gap-4 border-b border-r border-line p-6 sm:p-8">
              <Icon name={serviceIcons[key] ?? "check"} size={30} className="text-gold" />
              <span className="text-[0.9375rem] font-medium text-ink">{featureLabel(dict.serviceItems, key)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
