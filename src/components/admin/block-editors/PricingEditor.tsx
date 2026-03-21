import { TranslatableInput } from "./TranslatableInput";
import { emptyTr } from "@/components/blocks/types";
import type { PricingBlockData, PricingSeason, PricingExtra } from "@/components/blocks/types";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export function PricingEditor({ data, onChange }: Props) {
  const d = data as unknown as PricingBlockData;
  const seasons = d.seasons || [];
  const extras = d.extras || [];

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground">Valuta</label>
        <input type="text" value={d.currency || "EUR"} onChange={(e) => onChange({ ...data, currency: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
      </div>

      {/* Seasons */}
      <div className="space-y-3">
        <label className="text-xs font-medium text-foreground">Seizoenen ({seasons.length})</label>
        {seasons.map((s, idx) => (
          <div key={idx} className="border border-border rounded-lg p-3 space-y-2 relative">
            <button type="button" onClick={() => onChange({ ...data, seasons: seasons.filter((_, i) => i !== idx) })} className="absolute top-2 right-2 text-destructive hover:text-destructive/80"><Trash2 size={14} /></button>
            <TranslatableInput label="Naam" value={s.name || emptyTr()} onChange={(v) => { const n = [...seasons]; n[idx] = { ...n[idx], name: v }; onChange({ ...data, seasons: n }); }} />
            <TranslatableInput label="Periode" value={s.period || emptyTr()} onChange={(v) => { const n = [...seasons]; n[idx] = { ...n[idx], period: v }; onChange({ ...data, seasons: n }); }} />
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1"><label className="text-xs text-muted-foreground">Prijs/nacht</label><input type="number" value={s.pricePerNight || 0} onChange={(e) => { const n = [...seasons]; n[idx] = { ...n[idx], pricePerNight: Number(e.target.value) }; onChange({ ...data, seasons: n }); }} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
              <div className="space-y-1"><label className="text-xs text-muted-foreground">Min. nachten</label><input type="number" value={s.minNights || 1} onChange={(e) => { const n = [...seasons]; n[idx] = { ...n[idx], minNights: Number(e.target.value) }; onChange({ ...data, seasons: n }); }} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => onChange({ ...data, seasons: [...seasons, { name: emptyTr(), period: emptyTr(), pricePerNight: 0, minNights: 1 }] })} className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 font-medium"><Plus size={14} /> Seizoen toevoegen</button>
      </div>

      {/* Extras */}
      <div className="space-y-3">
        <label className="text-xs font-medium text-foreground">Extra kosten ({extras.length})</label>
        {extras.map((ex, idx) => (
          <div key={idx} className="border border-border rounded-lg p-3 space-y-2 relative">
            <button type="button" onClick={() => onChange({ ...data, extras: extras.filter((_, i) => i !== idx) })} className="absolute top-2 right-2 text-destructive hover:text-destructive/80"><Trash2 size={14} /></button>
            <TranslatableInput label="Naam" value={ex.name || emptyTr()} onChange={(v) => { const n = [...extras]; n[idx] = { ...n[idx], name: v }; onChange({ ...data, extras: n }); }} />
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1"><label className="text-xs text-muted-foreground">Prijs</label><input type="number" value={ex.price || 0} onChange={(e) => { const n = [...extras]; n[idx] = { ...n[idx], price: Number(e.target.value) }; onChange({ ...data, extras: n }); }} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
              <label className="flex items-center gap-2 text-xs pt-5"><input type="checkbox" checked={ex.required || false} onChange={(e) => { const n = [...extras]; n[idx] = { ...n[idx], required: e.target.checked }; onChange({ ...data, extras: n }); }} />Verplicht</label>
              <label className="flex items-center gap-2 text-xs pt-5"><input type="checkbox" checked={ex.perPerson || false} onChange={(e) => { const n = [...extras]; n[idx] = { ...n[idx], perPerson: e.target.checked }; onChange({ ...data, extras: n }); }} />Per persoon</label>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => onChange({ ...data, extras: [...extras, { name: emptyTr(), price: 0, required: false, perPerson: false }] })} className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 font-medium"><Plus size={14} /> Extra toevoegen</button>
      </div>

      <TranslatableInput label="Voetnoot" value={d.footnote || emptyTr()} onChange={(v) => onChange({ ...data, footnote: v })} multiline />
    </div>
  );
}
