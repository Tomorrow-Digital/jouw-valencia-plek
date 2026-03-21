import { TranslatableInput } from "./TranslatableInput";
import { emptyTr } from "@/components/blocks/types";
import type { AmenitiesBlockData, AmenityCategory, TranslatableString } from "@/components/blocks/types";
import { Plus, Trash2, X } from "lucide-react";
import { useState } from "react";

interface Props {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

const ICON_OPTIONS = ["sun", "home", "utensils", "car", "wifi", "tv", "wind", "droplets", "flame", "mountain", "tree", "shield"];

export function AmenitiesEditor({ data, onChange }: Props) {
  const d = data as unknown as AmenitiesBlockData;
  const categories = d.categories || [];

  const updateCategory = (idx: number, partial: Partial<AmenityCategory>) => {
    const n = [...categories];
    n[idx] = { ...n[idx], ...partial };
    onChange({ ...data, categories: n });
  };

  return (
    <div className="space-y-4">
      <TranslatableInput label="Heading" value={d.heading || emptyTr()} onChange={(v) => onChange({ ...data, heading: v })} />

      <div className="space-y-3">
        <label className="text-xs font-medium text-foreground">Categorieën ({categories.length})</label>
        {categories.map((cat, idx) => (
          <div key={idx} className="border border-border rounded-lg p-3 space-y-2 relative">
            <button type="button" onClick={() => onChange({ ...data, categories: categories.filter((_, i) => i !== idx) })} className="absolute top-2 right-2 text-destructive hover:text-destructive/80"><Trash2 size={14} /></button>
            <TranslatableInput label="Categorie naam" value={cat.name || emptyTr()} onChange={(v) => updateCategory(idx, { name: v })} />
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Icoon</label>
              <select value={cat.icon || "home"} onChange={(e) => updateCategory(idx, { icon: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                {ICON_OPTIONS.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <AmenityItemsEditor items={cat.items || []} onChange={(items) => updateCategory(idx, { items })} />
          </div>
        ))}
        <button type="button" onClick={() => onChange({ ...data, categories: [...categories, { name: emptyTr(), icon: "home", items: [] }] })} className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 font-medium"><Plus size={14} /> Categorie toevoegen</button>
      </div>
    </div>
  );
}

function AmenityItemsEditor({ items, onChange }: { items: TranslatableString[]; onChange: (items: TranslatableString[]) => void }) {
  const [newItem, setNewItem] = useState("");

  const addItem = () => {
    if (!newItem.trim()) return;
    onChange([...items, { nl: newItem.trim(), en: "", es: "" }]);
    setNewItem("");
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-foreground">Items ({items.length})</label>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, idx) => (
          <span key={idx} className="inline-flex items-center gap-1 bg-muted rounded-full px-2.5 py-1 text-xs">
            {item.nl || item.en || "..."}
            <button type="button" onClick={() => onChange(items.filter((_, i) => i !== idx))} className="text-muted-foreground hover:text-destructive"><X size={10} /></button>
          </span>
        ))}
      </div>
      <div className="flex gap-1">
        <input type="text" value={newItem} onChange={(e) => setNewItem(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addItem())} placeholder="Nieuw item (NL)" className="flex-1 rounded-md border border-input bg-background px-2 py-1 text-xs" />
        <button type="button" onClick={addItem} className="text-xs text-primary font-medium px-2">+</button>
      </div>
    </div>
  );
}
