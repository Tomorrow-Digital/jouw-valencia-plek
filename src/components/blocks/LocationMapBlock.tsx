import { tr } from "./types";
import type { LocationMapBlockData } from "./types";
import * as LucideIcons from "lucide-react";

function getIcon(iconName: string) {
  const icons = LucideIcons as Record<string, any>;
  const pascal = iconName
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  return icons[pascal] || LucideIcons.MapPin;
}

export function LocationMapBlock({ data, lang }: { data: Record<string, any>; lang: string }) {
  const d = data as unknown as LocationMapBlockData;
  const heading = tr(d.heading, lang);
  const description = tr(d.description, lang);
  const nearbyPlaces = d.nearbyPlaces || [];
  const bgImage = (d as any).backgroundImage;

  const mapsLink = d.latitude && d.longitude
    ? `https://www.google.com/maps?q=${d.latitude},${d.longitude}`
    : "#";

  const ctaLabel = lang === "nl" ? "Bekijk Route in Maps" : lang === "es" ? "Ver Ruta en Maps" : "View Route in Maps";

  // Editorial card-on-background style
  if (bgImage) {
    return (
      <section className="max-w-screen-2xl mx-auto px-8 md:px-20 py-32">
        <div className="bg-surface-container-highest rounded-2xl p-12 overflow-hidden relative min-h-[500px] flex flex-col justify-center">
          <div className="absolute inset-0 z-0">
            <img src={bgImage} alt="" className="w-full h-full object-cover opacity-30 grayscale" />
          </div>
          <div className="relative z-10 max-w-lg bg-white/80 p-10 rounded-xl backdrop-blur-lg shadow-xl">
            {heading && <h2 className="text-4xl font-headline font-bold mb-6">{heading}</h2>}
            {description && <p className="text-on-surface-variant mb-8">{description}</p>}
            {nearbyPlaces.length > 0 && (
              <div className="space-y-4 mb-8">
                {nearbyPlaces.map((place, i) => {
                  const Icon = getIcon(place.icon || "map-pin");
                  return (
                    <div key={i} className="flex items-center gap-4">
                      <Icon size={20} className="text-primary flex-shrink-0" />
                      <span className="text-sm font-medium">{tr(place.name, lang)}{place.distance ? `, ${place.distance}` : ""}</span>
                    </div>
                  );
                })}
              </div>
            )}
            <a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center border-2 border-primary text-primary font-bold py-4 rounded-xl hover:bg-primary hover:text-white transition-all duration-300 uppercase tracking-widest text-xs"
            >
              {ctaLabel}
            </a>
          </div>
        </div>
      </section>
    );
  }

  // Default map embed style
  return (
    <section className="max-w-screen-2xl mx-auto px-8 md:px-20 py-32">
      <div className="max-w-5xl mx-auto">
        {heading && (
          <h2 className="text-3xl font-headline font-bold text-foreground text-center mb-8">{heading}</h2>
        )}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted border border-border">
            {d.latitude && d.longitude ? (
              <iframe
                src={`https://maps.google.com/maps?q=${d.latitude},${d.longitude}&z=${d.zoom || 13}&output=embed`}
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                title="Location map"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <LucideIcons.MapPin size={48} />
              </div>
            )}
          </div>
          <div>
            {description && <p className="text-foreground/80 mb-6">{description}</p>}
            {nearbyPlaces.length > 0 && (
              <div className="space-y-3">
                {nearbyPlaces.map((place, i) => {
                  const Icon = getIcon(place.icon || "map-pin");
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon size={16} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{tr(place.name, lang)}</p>
                      </div>
                      <span className="text-sm text-muted-foreground flex-shrink-0">{place.distance}</span>
                    </div>
                  );
                })}
              </div>
            )}
            <a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 text-primary hover:text-primary/80 font-medium text-sm"
            >
              <LucideIcons.ExternalLink size={16} />
              {lang === "nl" ? "Open in Google Maps" : lang === "es" ? "Abrir en Google Maps" : "Open in Google Maps"}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
