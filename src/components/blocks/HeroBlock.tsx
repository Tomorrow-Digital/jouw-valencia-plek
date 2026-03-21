import { tr } from "./types";
import type { HeroBlockData } from "./types";

export function HeroBlock({ data, lang }: { data: Record<string, any>; lang: string }) {
  const d = data as unknown as HeroBlockData;
  const heading = tr(d.heading, lang);
  const subtitle = tr(d.subtitle, lang);
  const ctaText = tr(d.ctaText, lang);

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {d.backgroundImage && (
        <img
          src={d.backgroundImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        {heading && (
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">
            {heading}
          </h1>
        )}
        {subtitle && (
          <p className="text-lg md:text-xl text-white/90 mb-8">{subtitle}</p>
        )}
        {ctaText && d.ctaLink && (
          <a
            href={d.ctaLink}
            className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            {ctaText}
          </a>
        )}
      </div>
    </section>
  );
}
