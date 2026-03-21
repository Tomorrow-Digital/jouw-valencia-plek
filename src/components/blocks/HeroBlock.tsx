import { Link } from "react-router-dom";
import { tr } from "./types";
import type { HeroBlockData } from "./types";

export function HeroBlock({ data, lang }: { data: Record<string, any>; lang: string }) {
  const d = data as unknown as HeroBlockData;
  const heading = tr(d.heading, lang);
  const headingItalic = tr(d.headingItalicLine, lang);
  const subtitle = tr(d.subtitle, lang);
  const ctaText = tr(d.ctaText, lang);

  const arrivalLabel = tr(d.bookingBarArrivalLabel, lang) || (lang === "nl" ? "Aankomst" : lang === "es" ? "Llegada" : "Arrival");
  const arrivalPlaceholder = tr(d.bookingBarArrivalPlaceholder, lang) || (lang === "nl" ? "Kies je datum" : lang === "es" ? "Elige tu fecha" : "Choose your date");
  const guestsLabel = tr(d.bookingBarGuestsLabel, lang) || (lang === "nl" ? "Gasten" : lang === "es" ? "Huéspedes" : "Guests");
  const guestsDefault = tr(d.bookingBarGuestsDefault, lang) || (lang === "nl" ? "2 Volwassenen" : lang === "es" ? "2 Adultos" : "2 Adults");

  const heightClass = d.fullHeight ? "h-screen" : "min-h-[70vh]";

  return (
    <section className={`relative ${heightClass} w-full flex items-center justify-center overflow-hidden`}>
      {d.backgroundImage && (
        <div className="absolute inset-0 z-0">
          <img
            src={d.backgroundImage}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/20" />
        </div>
      )}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {heading && (
          <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl text-white mb-4 tracking-tight leading-tight">
            {heading}
            {headingItalic && (
              <>
                <br />
                <span className="italic">{headingItalic}</span>
              </>
            )}
          </h1>
        )}
        {subtitle && !d.showBookingBar && (
          <p className="text-lg md:text-xl text-white/90 mb-8">{subtitle}</p>
        )}

        {d.showBookingBar ? (
          <div className="mt-12 bg-surface/90 backdrop-blur-md p-2 md:p-3 rounded-full inline-flex flex-wrap md:flex-nowrap items-center gap-2 shadow-2xl">
            <div className="flex items-center gap-3 px-6 py-3 border-r border-outline-variant/30">
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold">{arrivalLabel}</p>
                <p className="text-sm font-medium">{arrivalPlaceholder}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 border-r border-outline-variant/30">
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold">{guestsLabel}</p>
                <p className="text-sm font-medium">{guestsDefault}</p>
              </div>
            </div>
            <Link
              to={d.ctaLink || "/booking"}
              className="bg-primary-container text-white px-8 py-4 rounded-full font-body font-bold text-sm tracking-widest uppercase hover:bg-primary transition-colors"
            >
              {ctaText}
            </Link>
          </div>
        ) : (
          ctaText && d.ctaLink && (
            <Link
              to={d.ctaLink}
              className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              {ctaText}
            </Link>
          )
        )}
      </div>
    </section>
  );
}
