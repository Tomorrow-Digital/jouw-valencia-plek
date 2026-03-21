import { TranslatableInput } from "./TranslatableInput";
import { emptyTr } from "@/components/blocks/types";
import type { FaqBlockData, FaqItem } from "@/components/blocks/types";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export function FaqEditor({ data, onChange }: Props) {
  const d = data as unknown as FaqBlockData;
  const items = d.items || [];

  return (
    <div className="space-y-4">
      <TranslatableInput label="Heading" value={d.heading || emptyTr()} onChange={(v) => onChange({ ...data, heading: v })} />

      <div className="space-y-3">
        <label className="text-xs font-medium text-foreground">Vragen ({items.length})</label>
        {items.map((item, idx) => (
          <div key={idx} className="border border-border rounded-lg p-3 space-y-2 relative">
            <button type="button" onClick={() => onChange({ ...data, items: items.filter((_, i) => i !== idx) })} className="absolute top-2 right-2 text-destructive hover:text-destructive/80"><Trash2 size={14} /></button>
            <TranslatableInput label="Vraag" value={item.question || emptyTr()} onChange={(v) => { const n = [...items]; n[idx] = { ...n[idx], question: v }; onChange({ ...data, items: n }); }} />
            <TranslatableInput label="Antwoord" value={item.answer || emptyTr()} onChange={(v) => { const n = [...items]; n[idx] = { ...n[idx], answer: v }; onChange({ ...data, items: n }); }} multiline />
          </div>
        ))}
        <button type="button" onClick={() => onChange({ ...data, items: [...items, { question: emptyTr(), answer: emptyTr() }] })} className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 font-medium"><Plus size={14} /> Vraag toevoegen</button>
      </div>
    </div>
  );
}
