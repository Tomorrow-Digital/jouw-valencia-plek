import { tr } from "./types";
import type { PricingBlockData } from "./types";

export function PricingBlock({ data, lang }: { data: Record<string, any>; lang: string }) {
  const d = data as unknown as PricingBlockData;
  const seasons = d.seasons || [];
  const extras = d.extras || [];
  const currency = d.currency || "EUR";
  const symbol = currency === "EUR" ? "€" : currency;

  return (
    <section className="py-16 px-6 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        {seasons.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-border bg-background">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                    {lang === "nl" ? "Seizoen" : lang === "es" ? "Temporada" : "Season"}
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                    {lang === "nl" ? "Periode" : lang === "es" ? "Periodo" : "Period"}
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-foreground">
                    {lang === "nl" ? "Per nacht" : lang === "es" ? "Por noche" : "Per night"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {seasons.map((s, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="px-6 py-4 font-medium text-foreground">{tr(s.name, lang)}</td>
                    <td className="px-6 py-4 text-muted-foreground">{tr(s.period, lang)}</td>
                    <td className="px-6 py-4 text-right font-semibold text-primary">
                      {symbol}{s.pricePerNight}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {extras.length > 0 && (
          <div className="mt-6 space-y-2">
            {extras.map((e, i) => (
              <div key={i} className="flex justify-between items-center px-4 py-2 rounded-lg bg-background border border-border">
                <span className="text-sm text-foreground">
                  {tr(e.name, lang)}
                  {e.required && <span className="text-muted-foreground ml-1">*</span>}
                  {e.perPerson && <span className="text-muted-foreground text-xs ml-1">({lang === "nl" ? "p.p." : lang === "es" ? "p.p." : "p.p."})</span>}
                </span>
                <span className="text-sm font-medium">{symbol}{e.price}</span>
              </div>
            ))}
          </div>
        )}

        {tr(d.footnote, lang) && (
          <p className="mt-4 text-sm text-muted-foreground italic">{tr(d.footnote, lang)}</p>
        )}
      </div>
    </section>
  );
}
