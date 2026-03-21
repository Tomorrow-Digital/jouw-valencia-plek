import { tr } from "./types";
import type { BookingCtaBlockData } from "./types";
import { MessageCircle, Mail } from "lucide-react";

export function BookingCtaBlock({ data, lang }: { data: Record<string, any>; lang: string }) {
  const d = data as unknown as BookingCtaBlockData;
  const heading = tr(d.heading, lang);
  const description = tr(d.description, lang);
  const waMessage = tr(d.whatsappMessage, lang);
  const style = d.style || "prominent";

  const waUrl = d.whatsappNumber
    ? `https://wa.me/${d.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(waMessage)}`
    : "#";

  if (style === "inline") {
    return (
      <section className="py-8 px-6">
        <div className="max-w-3xl mx-auto flex flex-wrap items-center gap-4 justify-center">
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#20bd5a] transition-colors">
            <MessageCircle size={20} /> WhatsApp
          </a>
          {d.showEmailAlternative && d.email && (
            <a href={`mailto:${d.email}`} className="inline-flex items-center gap-2 border border-border px-6 py-3 rounded-lg font-medium hover:bg-muted transition-colors text-foreground">
              <Mail size={20} /> {d.email}
            </a>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className={`py-16 px-6 ${style === "prominent" ? "bg-primary/5" : ""}`}>
      <div className="max-w-2xl mx-auto text-center">
        {heading && <h2 className="text-3xl font-serif font-bold text-foreground mb-4">{heading}</h2>}
        {description && <p className="text-muted-foreground mb-8">{description}</p>}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#20bd5a] transition-colors shadow-lg"
          >
            <MessageCircle size={24} />
            WhatsApp
          </a>
          {d.showEmailAlternative && d.email && (
            <a
              href={`mailto:${d.email}`}
              className="inline-flex items-center justify-center gap-2 border-2 border-border px-8 py-4 rounded-xl font-medium hover:bg-muted transition-colors text-foreground"
            >
              <Mail size={20} />
              {d.email}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
