import { tr } from "./types";
import type { TextBlockData } from "./types";

export function TextBlock({ data, lang }: { data: Record<string, any>; lang: string }) {
  const d = data as unknown as TextBlockData;
  const content = tr(d.content, lang);
  const alignment = d.alignment || "left";

  const alignClass = alignment === "center" ? "text-center" : alignment === "right" ? "text-right" : "text-left";

  return (
    <section className="py-16 px-6">
      <div className={`max-w-3xl mx-auto ${alignClass}`}>
        <div className="prose prose-lg max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, "<br/>") }} />
      </div>
    </section>
  );
}
