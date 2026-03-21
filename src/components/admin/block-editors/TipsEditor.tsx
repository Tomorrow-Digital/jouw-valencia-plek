import { TranslatableInput } from "./TranslatableInput";
import { ResponsiveImageField } from "./ResponsiveImageField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
  pageId: string;
}

export function TipsEditor({ data, onChange, pageId }: Props) {
  const tips = data.tips || [];

  const updateField = (field: string, value: any) => onChange({ ...data, [field]: value });

  const updateTip = (index: number, field: string, value: any) => {
    const updated = [...tips];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, tips: updated });
  };

  const addTip = () => {
    onChange({
      ...data,
      tips: [
        ...tips,
        {
          category: { nl: "", en: "", es: "" },
          name: "",
          description: { nl: "", en: "", es: "" },
          image: "",
        },
      ],
    });
  };

  const removeTip = (index: number) => {
    onChange({ ...data, tips: tips.filter((_: any, i: number) => i !== index) });
  };

  return (
    <div className="space-y-6">
      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Zijbalk</h4>
      <TranslatableInput label="Label" value={data.sidebarLabel} onChange={(v) => updateField("sidebarLabel", v)} />
      <TranslatableInput label="Kop" value={data.heading} onChange={(v) => updateField("heading", v)} />
      <TranslatableInput label="Beschrijving" value={data.description} onChange={(v) => updateField("description", v)} multiline />
      <TranslatableInput label="Highlight titel" value={data.highlightTitle} onChange={(v) => updateField("highlightTitle", v)} />
      <TranslatableInput label="Highlight beschrijving" value={data.highlightDescription} onChange={(v) => updateField("highlightDescription", v)} />

      <hr />
      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Tips</h4>

      {tips.map((tip: any, i: number) => (
        <div key={i} className="border rounded-lg p-4 space-y-4 bg-white/50">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-sm">Tip {i + 1}</h4>
            <Button variant="ghost" size="sm" onClick={() => removeTip(i)}>
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>

          <TranslatableInput label="Categorie" value={tip.category} onChange={(v) => updateTip(i, "category", v)} />
          <div>
            <Label>Naam</Label>
            <Input value={tip.name || ""} onChange={(e) => updateTip(i, "name", e.target.value)} />
          </div>
          <TranslatableInput label="Beschrijving" value={tip.description} onChange={(v) => updateTip(i, "description", v)} multiline />
          <ResponsiveImageField label="Afbeelding" value={tip.image} onChange={(v) => updateTip(i, "image", v)} pageId={pageId} />
        </div>
      ))}

      <Button variant="outline" size="sm" onClick={addTip} className="w-full">
        <Plus className="w-4 h-4 mr-2" /> Tip toevoegen
      </Button>
    </div>
  );
}
