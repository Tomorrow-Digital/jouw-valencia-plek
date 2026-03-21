import { TranslatableInput } from "./TranslatableInput";
import { emptyTr } from "@/components/blocks/types";
import type { LocationMapBlockData, NearbyPlace } from "@/components/blocks/types";
import { Plus, Trash2 } from "lucide-react";

const ICON_OPTIONS = ["waves", "building", "shopping-cart", "map-pin", "plane", "train", "utensils", "hospital", "mountain", "tree"];

interface Props {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export function LocationMapEditor({ data, onChange }: Props) {
  const d = data as unknown as LocationMapBlockData;
  const places = d.nearbyPlaces || [];

  const update = (partial: Partial<LocationMapBlockData>) => onChange({ ...data, ...partial });

  const updatePlace = (idx: number, partial: Partial<NearbyPlace>) => {
    const n = [...places];
    n[idx] = { ...n[idx], ...partial };
    update({ nearbyPlaces: n });
  };

  return (
    <div className="space-y-4">
      <TranslatableInput label="Heading" value={d.heading || emptyTr()} onChange={(v) => update({ heading: v })} />
      <div className="grid grid-cols-3 gap-2">
        <div className="space-y-1"><label className="text-xs text-muted-foreground">Latitude</label><input type="number" step="any" value={d.latitude || 0} onChange={(e) => update({ latitude: Number(e.target.value) })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
        <div className="space-y-1"><label className="text-xs text-muted-foreground">Longitude</label><input type="number" step="any" value={d.longitude || 0} onChange={(e) => update({ longitude: Number(e.target.value) })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
        <div className="space-y-1"><label className="text-xs text-muted-foreground">Zoom</label><input type="number" value={d.zoom || 13} onChange={(e) => update({ zoom: Number(e.target.value) })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
      </div>
      <TranslatableInput label="Beschrijving" value={d.description || emptyTr()} onChange={(v) => update({ description: v })} multiline />
      <label className="flex items-center gap-2 text-xs">
        <input type="checkbox" checked={d.showExactLocation || false} onChange={(e) => update({ showExactLocation: e.target.checked })} />
        Exacte locatie tonen
      </label>

      <div className="space-y-3">
        <label className="text-xs font-medium text-foreground">Nabije plaatsen ({places.length})</label>
        {places.map((p, idx) => (
          <div key={idx} className="border border-border rounded-lg p-3 space-y-2 relative">
            <button type="button" onClick={() => update({ nearbyPlaces: places.filter((_, i) => i !== idx) })} className="absolute top-2 right-2 text-destructive hover:text-destructive/80"><Trash2 size={14} /></button>
            <TranslatableInput label="Naam" value={p.name || emptyTr()} onChange={(v) => updatePlace(idx, { name: v })} />
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1"><label className="text-xs text-muted-foreground">Afstand</label><input type="text" value={p.distance || ""} onChange={(e) => updatePlace(idx, { distance: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Icoon</label>
                <select value={p.icon || "map-pin"} onChange={(e) => updatePlace(idx, { icon: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  {ICON_OPTIONS.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => update({ nearbyPlaces: [...places, { name: emptyTr(), distance: "", icon: "map-pin" }] })} className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 font-medium"><Plus size={14} /> Plaats toevoegen</button>
      </div>
    </div>
  );
}
