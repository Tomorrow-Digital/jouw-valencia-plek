import { TranslatableInput } from "./TranslatableInput";
import { ImageUploadField } from "./ImageUploadField";
import { emptyTr } from "@/components/blocks/types";
import type { HeroBlockData } from "@/components/blocks/types";

interface Props {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
  pageId: string;
}

export function HeroEditor({ data, onChange, pageId }: Props) {
  const d = data as unknown as HeroBlockData;
  const update = (partial: Partial<HeroBlockData>) => onChange({ ...data, ...partial });

  return (
    <div className="space-y-4">
      <TranslatableInput label="Heading" value={d.heading || emptyTr()} onChange={(v) => update({ heading: v })} />
      <TranslatableInput label="Heading Italic Line" value={d.headingItalicLine || emptyTr()} onChange={(v) => update({ headingItalicLine: v })} />
      <TranslatableInput label="Subtitle" value={d.subtitle || emptyTr()} onChange={(v) => update({ subtitle: v })} multiline />
      <ImageUploadField label="Background Image" value={d.backgroundImage || ""} onChange={(v) => update({ backgroundImage: v })} pageId={pageId} />

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={d.fullHeight ?? false}
          onChange={(e) => update({ fullHeight: e.target.checked })}
          className="rounded border-input"
        />
        <label className="text-xs font-medium text-foreground">Full-height hero (h-screen)</label>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={d.showBookingBar ?? false}
          onChange={(e) => update({ showBookingBar: e.target.checked })}
          className="rounded border-input"
        />
        <label className="text-xs font-medium text-foreground">Show booking search bar</label>
      </div>

      <TranslatableInput label="CTA Text" value={d.ctaText || emptyTr()} onChange={(v) => update({ ctaText: v })} />
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground">CTA Link</label>
        <input type="text" value={d.ctaLink || ""} onChange={(e) => update({ ctaLink: e.target.value })} placeholder="#booking" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
      </div>
    </div>
  );
}
