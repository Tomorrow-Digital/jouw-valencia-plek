import { TranslatableInput } from "./TranslatableInput";
import { ResponsiveImageField } from "./ResponsiveImageField";
import { emptyTr } from "@/components/blocks/types";
import type { GalleryBlockData, GalleryImage, ResponsiveImage } from "@/components/blocks/types";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
  pageId: string;
}

export function GalleryEditor({ data, onChange, pageId }: Props) {
  const d = data as unknown as GalleryBlockData;
  const images = d.images || [];

  const updateImage = (idx: number, partial: Partial<GalleryImage>) => {
    const newImages = [...images];
    newImages[idx] = { ...newImages[idx], ...partial };
    onChange({ ...data, images: newImages });
  };

  const addImage = () => {
    const emptyImg: ResponsiveImage = { desktop: "", tablet: "", mobile: "" };
    onChange({ ...data, images: [...images, { src: emptyImg, alt: emptyTr(), caption: emptyTr() }] });
  };

  const removeImage = (idx: number) => {
    onChange({ ...data, images: images.filter((_: any, i: number) => i !== idx) });
  };

  // Normalize src to ResponsiveImage
  const normalizeImgSrc = (src: string | ResponsiveImage): ResponsiveImage =>
    typeof src === "string"
      ? { desktop: src, tablet: "", mobile: "" }
      : src || { desktop: "", tablet: "", mobile: "" };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">Layout</label>
          <select value={d.layout || "grid"} onChange={(e) => onChange({ ...data, layout: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="grid">Grid</option>
            <option value="carousel">Carousel</option>
            <option value="masonry">Masonry</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">Kolommen</label>
          <select value={d.columns || 3} onChange={(e) => onChange({ ...data, columns: Number(e.target.value) })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-medium text-foreground">Afbeeldingen ({images.length})</label>
        {images.map((img: GalleryImage, idx: number) => (
          <div key={idx} className="border border-border rounded-lg p-3 space-y-2 relative">
            <button type="button" onClick={() => removeImage(idx)} className="absolute top-2 right-2 text-destructive hover:text-destructive/80"><Trash2 size={14} /></button>
            <ResponsiveImageField
              label={`Afbeelding ${idx + 1}`}
              value={normalizeImgSrc(img.src)}
              onChange={(v) => updateImage(idx, { src: v })}
              pageId={pageId}
            />
            <TranslatableInput label="Alt text" value={img.alt || emptyTr()} onChange={(v) => updateImage(idx, { alt: v })} />
            <TranslatableInput label="Caption" value={img.caption || emptyTr()} onChange={(v) => updateImage(idx, { caption: v })} />
          </div>
        ))}
        <button type="button" onClick={addImage} className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 font-medium">
          <Plus size={14} /> Afbeelding toevoegen
        </button>
      </div>
    </div>
  );
}
