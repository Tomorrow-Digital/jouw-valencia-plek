import { tr } from "./types";
import type { ReviewsBlockData } from "./types";
import { Star } from "lucide-react";

export function ReviewsBlock({ data, lang }: { data: Record<string, any>; lang: string }) {
  const d = data as unknown as ReviewsBlockData;
  const testimonials = d.testimonials || [];

  if (testimonials.length === 0) return null;

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className={`grid gap-6 ${testimonials.length === 1 ? "max-w-2xl mx-auto" : "md:grid-cols-2 lg:grid-cols-3"}`}>
          {testimonials.map((t_item, i) => (
            <div key={i} className="bg-background border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                {t_item.avatar && (
                  <img src={t_item.avatar} alt={t_item.name} className="w-12 h-12 rounded-full object-cover" />
                )}
                <div>
                  <p className="font-medium text-foreground">{t_item.name}</p>
                  {t_item.country && (
                    <p className="text-sm text-muted-foreground">{t_item.country}</p>
                  )}
                </div>
              </div>
              {d.showRating && t_item.rating > 0 && (
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      size={16}
                      className={j < t_item.rating ? "fill-amber-400 text-amber-400" : "text-muted"}
                    />
                  ))}
                </div>
              )}
              <p className="text-foreground/80 italic">"{tr(t_item.text, lang)}"</p>
              {t_item.date && (
                <p className="text-xs text-muted-foreground mt-3">{t_item.date}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
