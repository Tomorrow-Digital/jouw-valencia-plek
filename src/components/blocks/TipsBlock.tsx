import { tr, resolveImage, getResponsiveSources } from "./types";
import type { TipsBlockData } from "./types";

export function TipsBlock({ data, lang }: { data: Record<string, any>; lang: string }) {
  const d = data as unknown as TipsBlockData;
  const tips = d.tips || [];

  return (
    <section className="bg-surface-container-low py-32 overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-8 md:px-20">
        <div className="flex flex-col md:flex-row gap-20 items-start">
          {/* Sidebar */}
          <div className="w-full md:w-1/3 md:sticky md:top-32">
            {tr(d.sidebarLabel, lang) && (
              <span className="text-primary font-body text-sm uppercase tracking-widest font-bold mb-6 block">
                {tr(d.sidebarLabel, lang)}
              </span>
            )}
            <h2 className="text-5xl font-headline font-bold leading-tight mb-8">
              {tr(d.heading, lang)}
            </h2>
            <p className="text-on-surface-variant leading-relaxed mb-10">
              {tr(d.description, lang)}
            </p>
            <div className="h-px bg-outline-variant/30 w-full mb-10" />
            {tr(d.highlightTitle, lang) && (
              <div className="flex items-start gap-4">
                <span
                  className="material-symbols-outlined text-primary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  favorite
                </span>
                <div>
                  <h4 className="font-bold">{tr(d.highlightTitle, lang)}</h4>
                  <p className="text-sm text-on-surface-variant">{tr(d.highlightDescription, lang)}</p>
                </div>
              </div>
            )}
          </div>

          {/* Tip Cards Grid */}
          <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
            {tips.map((tip, i) => {
              const imgSrc = resolveImage(tip.image);
              return (
                <div
                  key={i}
                  className={`bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10 ${
                    i % 2 === 1 ? "md:mt-12" : ""
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-widest text-primary mb-4 block">
                    {tr(tip.category, lang)}
                  </span>
                  <h3 className="text-2xl font-headline font-bold mb-4">{tip.name}</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                    {tr(tip.description, lang)}
                  </p>
                  {imgSrc && (
                    <img
                      src={imgSrc}
                      alt={tip.name}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
