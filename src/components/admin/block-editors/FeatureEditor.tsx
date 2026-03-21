import { TranslatableInput } from "./TranslatableInput";
import { ResponsiveImageField } from "./ResponsiveImageField";
import { emptyTr } from "@/components/blocks/types";
import type { FeatureBlockData, FeatureSpec, ResponsiveImage } from "@/components/blocks/types";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
  pageId: string;
}

export function FeatureEditor({ data, onChange, pageId }: Props) {
  const d = data as unknown as FeatureBlockData;
  const update = (partial: Partial<FeatureBlockData>) => onChange({ ...data, ...partial });

  const image: ResponsiveImage =
    typeof d.image === "string"
      ? { desktop: d.image, tablet: "", mobile: "" }
      : d.image || { desktop: "", tablet: "", mobile: "" };

  const specs = d.specs || [];

  const updateSpec = (index: number, partial: Partial<FeatureSpec>) => {
    const updated = specs.map((s, i) => (i === index ? { ...s, ...partial } : s));
    update({ specs: updated });
  };

  return (
    <div className="space-y-4">
      <TranslatableInput label="Subtitel" value={d.subtitle || emptyTr()} onChange={(v) => update({ subtitle: v })} />
      <TranslatableInput label="Heading" value={d.heading || emptyTr()} onChange={(v) => update({ heading: v })} />
      <TranslatableInput label="Beschrijving" value={d.description || emptyTr()} onChange={(v) => update({ description: v })} multiline />
      <ResponsiveImageField label="Afbeelding" value={image} onChange={(v) => update({ image: v })} pageId={pageId} />

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground">Afbeelding positie</label>
        <select
          value={d.imagePosition || "right"}
          onChange={(e) => update({ imagePosition: e.target.value as "left" | "right" })}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="left">Links</option>
          <option value="right">Rechts</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-foreground">Specs / Details</label>
        {specs.map((spec, i) => (
          <div key={i} className="flex items-start gap-2 p-2 border border-border rounded-lg">
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={spec.icon || ""}
                onChange={(e) => updateSpec(i, { icon: e.target.value })}
                placeholder="Icon (bijv. ruler, users)"
                className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs"
              />
              <TranslatableInput label="Label" value={spec.label || emptyTr()} onChange={(v) => updateSpec(i, { label: v })} />
            </div>
            <button onClick={() => update({ specs: specs.filter((_, j) => j !== i) })} className="p-1 text-muted-foreground hover:text-destructive">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <button
          onClick={() => update({ specs: [...specs, { icon: "info", label: emptyTr() }] })}
          className="flex items-center gap-1 text-xs text-primary hover:text-primary/80"
        >
          <Plus size={14} /> Spec toevoegen
        </button>
      </div>

      <TranslatableInput label="CTA Tekst" value={d.ctaText || emptyTr()} onChange={(v) => update({ ctaText: v })} />
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground">CTA Link</label>
        <input type="text" value={d.ctaLink || ""} onChange={(e) => update({ ctaLink: e.target.value })} placeholder="/booking" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
      </div>
    </div>
  );
}
