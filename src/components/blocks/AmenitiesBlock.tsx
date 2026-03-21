import { tr } from "./types";
import type { AmenitiesBlockData } from "./types";
import * as LucideIcons from "lucide-react";

function getIcon(iconName: string) {
  const icons = LucideIcons as Record<string, any>;
  // Convert kebab-case to PascalCase
  const pascal = iconName
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  return icons[pascal] || LucideIcons.CheckCircle;
}

export function AmenitiesBlock({ data, lang }: { data: Record<string, any>; lang: string }) {
  const d = data as unknown as AmenitiesBlockData;
  const heading = tr(d.heading, lang);
  const categories = d.categories || [];

  return (
    <section className="py-16 px-6 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        {heading && (
          <h2 className="text-3xl font-serif font-bold text-foreground text-center mb-12">{heading}</h2>
        )}
        <div className={`grid gap-8 ${categories.length === 1 ? "max-w-md mx-auto" : "md:grid-cols-2"}`}>
          {categories.map((cat, i) => {
            const Icon = getIcon(cat.icon || "check-circle");
            return (
              <div key={i} className="bg-background rounded-2xl border border-border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon size={20} className="text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground">{tr(cat.name, lang)}</h3>
                </div>
                <ul className="space-y-2">
                  {(cat.items || []).map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-foreground/80">
                      <LucideIcons.Check size={16} className="text-primary flex-shrink-0" />
                      <span>{tr(item, lang)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
