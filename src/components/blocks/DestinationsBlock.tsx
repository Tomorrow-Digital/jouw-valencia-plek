import { tr, resolveImage, getResponsiveSources } from "./types";
import type { DestinationsBlockData } from "./types";

export function DestinationsBlock({ data, lang }: { data: Record<string, any>; lang: string }) {
  const d = data as unknown as DestinationsBlockData;
  const destinations = d.destinations || [];

  const iconMap: Record<string, string> = {
    train: "directions_subway",
    car: "directions_car",
    plane: "flight",
    bus: "directions_bus",
    walk: "directions_walk",
    bike: "pedal_bike",
  };

  return (
    <section className="max-w-screen-2xl mx-auto px-8 md:px-20 pb-32">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {destinations.map((dest, i) => {
          const sources = getResponsiveSources(dest.image);
          const fallback = resolveImage(dest.image);
          const materialIcon = iconMap[dest.icon] || "place";

          return (
            <div key={i} className={`group ${i === 1 ? "md:mt-16" : ""}`}>
              <div className="aspect-[4/5] overflow-hidden rounded-xl mb-6 relative">
                <picture>
                  {sources.mobile && <source media="(max-width: 640px)" srcSet={sources.mobile} />}
                  {sources.tablet && <source media="(max-width: 1024px)" srcSet={sources.tablet} />}
                  <img
                    src={fallback}
                    alt={tr(dest.title, lang)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </picture>
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/30 backdrop-blur-lg rounded-lg">
                  <div className="flex items-center gap-2 font-semibold text-foreground">
                    <span className="material-symbols-outlined text-sm">{materialIcon}</span>
                    <span className="text-xs uppercase tracking-widest font-body">{tr(dest.travelTime, lang)}</span>
                  </div>
                </div>
              </div>
              <h3 className="text-3xl font-headline font-bold mb-3">{tr(dest.title, lang)}</h3>
              <p className="text-on-surface-variant leading-relaxed">{tr(dest.description, lang)}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
