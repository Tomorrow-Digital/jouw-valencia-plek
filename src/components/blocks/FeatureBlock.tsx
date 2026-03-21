import { tr, getResponsiveSources } from "./types";
import type { FeatureBlockData } from "./types";
import * as LucideIcons from "lucide-react";
import { Link } from "react-router-dom";

function getIcon(iconName: string) {
  const icons = LucideIcons as Record<string, any>;
  const pascal = iconName
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  return icons[pascal] || LucideIcons.Info;
}

export function FeatureBlock({ data, lang }: { data: Record<string, any>; lang: string }) {
  const d = data as unknown as FeatureBlockData;
  const subtitle = tr(d.subtitle, lang);
  const heading = tr(d.heading, lang);
  const description = tr(d.description, lang);
  const ctaText = tr(d.ctaText, lang);
  const imagePos = d.imagePosition || "right";
  const specs = d.specs || [];

  const sources = getResponsiveSources(d.image);
  const hasImage = sources.desktop || sources.tablet || sources.mobile;

  const imageEl = hasImage ? (
    <div className="w-full lg:w-1/2">
      <picture>
        {sources.mobile && <source media="(max-width: 767px)" srcSet={sources.mobile} />}
        {sources.tablet && <source media="(max-width: 1023px)" srcSet={sources.tablet} />}
        <img
          src={sources.desktop || sources.tablet || sources.mobile}
          alt={heading}
          className="w-full h-64 sm:h-80 lg:h-[28rem] object-cover rounded-2xl"
        />
      </picture>
    </div>
  ) : null;

  const textEl = (
    <div className="w-full lg:w-1/2 flex flex-col justify-center">
      {subtitle && (
        <p className="text-[11px] uppercase tracking-[0.2em] text-primary font-semibold mb-3">
          {subtitle}
        </p>
      )}
      {heading && (
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-foreground mb-4 leading-tight">
          {heading}
        </h2>
      )}
      {description && (
        <div
          className="text-on-surface-variant leading-relaxed mb-6"
          dangerouslySetInnerHTML={{ __html: description.replace(/\n/g, "<br/>") }}
        />
      )}
      {specs.length > 0 && (
        <div className="flex flex-wrap gap-4 mb-6">
          {specs.map((spec, i) => {
            const Icon = getIcon(spec.icon || "info");
            return (
              <div key={i} className="flex items-center gap-2 text-sm text-on-surface-variant">
                <Icon size={18} className="text-primary" />
                <span>{tr(spec.label, lang)}</span>
              </div>
            );
          })}
        </div>
      )}
      {ctaText && d.ctaLink && (
        <div>
          <Link
            to={d.ctaLink}
            className="inline-block bg-primary text-on-primary px-6 py-3 rounded-full font-medium text-sm tracking-wide hover:bg-primary/90 transition-colors"
          >
            {ctaText}
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <section className="py-16 md:py-24 px-6">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
        {imagePos === "left" ? (
          <>
            {imageEl}
            {textEl}
          </>
        ) : (
          <>
            {textEl}
            {imageEl}
          </>
        )}
      </div>
    </section>
  );
}
