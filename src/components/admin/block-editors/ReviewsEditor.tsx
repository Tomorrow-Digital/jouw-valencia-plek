import { TranslatableInput } from "./TranslatableInput";
import { ImageUploadField } from "./ImageUploadField";
import { emptyTr } from "@/components/blocks/types";
import type { ReviewsBlockData, Testimonial } from "@/components/blocks/types";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
  pageId: string;
}

export function ReviewsEditor({ data, onChange, pageId }: Props) {
  const d = data as unknown as ReviewsBlockData;
  const testimonials = d.testimonials || [];

  const updateTestimonial = (idx: number, partial: Partial<Testimonial>) => {
    const n = [...testimonials];
    n[idx] = { ...n[idx], ...partial };
    onChange({ ...data, testimonials: n });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">Layout</label>
          <select value={d.layout || "cards"} onChange={(e) => onChange({ ...data, layout: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="cards">Cards</option>
            <option value="list">List</option>
            <option value="carousel">Carousel</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-xs pt-5">
          <input type="checkbox" checked={d.showRating !== false} onChange={(e) => onChange({ ...data, showRating: e.target.checked })} />
          Toon beoordeling
        </label>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-medium text-foreground">Reviews ({testimonials.length})</label>
        {testimonials.map((t, idx) => (
          <div key={idx} className="border border-border rounded-lg p-3 space-y-2 relative">
            <button type="button" onClick={() => onChange({ ...data, testimonials: testimonials.filter((_, i) => i !== idx) })} className="absolute top-2 right-2 text-destructive hover:text-destructive/80"><Trash2 size={14} /></button>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1"><label className="text-xs text-muted-foreground">Naam</label><input type="text" value={t.name || ""} onChange={(e) => updateTestimonial(idx, { name: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
              <div className="space-y-1"><label className="text-xs text-muted-foreground">Land</label><input type="text" value={t.country || ""} onChange={(e) => updateTestimonial(idx, { country: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1"><label className="text-xs text-muted-foreground">Rating (1-5)</label><input type="number" min={1} max={5} value={t.rating || 5} onChange={(e) => updateTestimonial(idx, { rating: Number(e.target.value) })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
              <div className="space-y-1"><label className="text-xs text-muted-foreground">Datum</label><input type="text" value={t.date || ""} onChange={(e) => updateTestimonial(idx, { date: e.target.value })} placeholder="2025-08" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
            </div>
            <TranslatableInput label="Review tekst" value={t.text || emptyTr()} onChange={(v) => updateTestimonial(idx, { text: v })} multiline />
            <ImageUploadField label="Avatar" value={t.avatar || ""} onChange={(v) => updateTestimonial(idx, { avatar: v })} pageId={pageId} />
          </div>
        ))}
        <button type="button" onClick={() => onChange({ ...data, testimonials: [...testimonials, { name: "", country: "", rating: 5, text: emptyTr(), date: "", avatar: "" }] })} className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 font-medium"><Plus size={14} /> Review toevoegen</button>
      </div>
    </div>
  );
}
