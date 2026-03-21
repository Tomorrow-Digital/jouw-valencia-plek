import { TranslatableInput } from "./TranslatableInput";
import { emptyTr } from "@/components/blocks/types";
import type { BookingCtaBlockData } from "@/components/blocks/types";

interface Props {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export function BookingCtaEditor({ data, onChange }: Props) {
  const d = data as unknown as BookingCtaBlockData;
  const update = (partial: Partial<BookingCtaBlockData>) => onChange({ ...data, ...partial });

  return (
    <div className="space-y-4">
      <TranslatableInput label="Heading" value={d.heading || emptyTr()} onChange={(v) => update({ heading: v })} />
      <TranslatableInput label="Beschrijving" value={d.description || emptyTr()} onChange={(v) => update({ description: v })} multiline />
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5"><label className="text-xs font-medium text-foreground">WhatsApp nummer</label><input type="text" value={d.whatsappNumber || ""} onChange={(e) => update({ whatsappNumber: e.target.value })} placeholder="+34612345678" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
        <div className="space-y-1.5"><label className="text-xs font-medium text-foreground">E-mail</label><input type="text" value={d.email || ""} onChange={(e) => update({ email: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
      </div>
      <TranslatableInput label="WhatsApp bericht" value={d.whatsappMessage || emptyTr()} onChange={(v) => update({ whatsappMessage: v })} multiline />
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">Stijl</label>
          <select value={d.style || "prominent"} onChange={(e) => update({ style: e.target.value as any })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="prominent">Prominent</option>
            <option value="subtle">Subtiel</option>
            <option value="inline">Inline</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-xs pt-5">
          <input type="checkbox" checked={d.showEmailAlternative || false} onChange={(e) => update({ showEmailAlternative: e.target.checked })} />
          Toon e-mail alternatief
        </label>
      </div>
    </div>
  );
}
