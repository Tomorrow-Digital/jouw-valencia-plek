import { tr } from "./types";
import type { FaqBlockData } from "./types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FaqBlock({ data, lang }: { data: Record<string, any>; lang: string }) {
  const d = data as unknown as FaqBlockData;
  const heading = tr(d.heading, lang);
  const items = d.items || [];

  if (items.length === 0) return null;

  return (
    <section className="py-16 px-6">
      <div className="max-w-3xl mx-auto">
        {heading && (
          <h2 className="text-3xl font-serif font-bold text-foreground text-center mb-10">{heading}</h2>
        )}
        <Accordion type="single" collapsible className="space-y-3">
          {items.map((item, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="border border-border rounded-xl px-6 bg-background"
            >
              <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline py-4">
                {tr(item.question, lang)}
              </AccordionTrigger>
              <AccordionContent className="text-foreground/80 pb-4">
                {tr(item.answer, lang)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
