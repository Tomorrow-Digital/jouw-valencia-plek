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

  // Google Maps embed URL
  const mapUrl = d.latitude && d.longitude
    ? `https://www.google.com/maps/embed/v1/view?key=GOOGLE_MAPS_KEY&center=${d.latitude},${d.longitude}&zoom=${d.zoom || 13}`
    : null;

  // Fallback: static map link
  const mapsLink = d.latitude && d.longitude
    ? `https://www.google.com/maps?q=${d.latitude},${d.longitude}`
    : "#";

  return (
    <section className="max-w-screen-2xl mx-auto px-8 md:px-20 py-32">
      <div className="max-w-5xl mx-auto">
        {heading && (
          <h2 className="text-3xl font-serif font-bold text-foreground text-center mb-8">{heading}</h2>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Map */}
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

          {/* Info */}
          <div>
            {description && (
              <p className="text-foreground/80 mb-6">{description}</p>
            )}
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
