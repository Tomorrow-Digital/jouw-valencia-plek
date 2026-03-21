import { TranslatableInput } from "./TranslatableInput";
import { ResponsiveImageField } from "./ResponsiveImageField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

const ICON_OPTIONS = [
  { value: "train", label: "Trein / Metro" },
  { value: "car", label: "Auto" },
  { value: "plane", label: "Vliegtuig" },
  { value: "bus", label: "Bus" },
  { value: "walk", label: "Lopen" },
  { value: "bike", label: "Fiets" },
];

interface Props {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
  pageId: string;
}

export function DestinationsEditor({ data, onChange, pageId }: Props) {
  const destinations = data.destinations || [];

  const updateDest = (index: number, field: string, value: any) => {
    const updated = [...destinations];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, destinations: updated });
  };

  const addDest = () => {
    onChange({
      ...data,
      destinations: [
        ...destinations,
        {
          title: { nl: "", en: "", es: "" },
          description: { nl: "", en: "", es: "" },
          travelTime: { nl: "", en: "", es: "" },
          icon: "car",
          image: "",
        },
      ],
    });
  };

  const removeDest = (index: number) => {
    onChange({ ...data, destinations: destinations.filter((_: any, i: number) => i !== index) });
  };

  return (
    <div className="space-y-6">
      {destinations.map((dest: any, i: number) => (
        <div key={i} className="border rounded-lg p-4 space-y-4 bg-white/50">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-sm">Bestemming {i + 1}</h4>
            <Button variant="ghost" size="sm" onClick={() => removeDest(i)}>
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>

          <TranslatableInput label="Titel" value={dest.title} onChange={(v) => updateDest(i, "title", v)} />
          <TranslatableInput label="Beschrijving" value={dest.description} onChange={(v) => updateDest(i, "description", v)} multiline />
          <TranslatableInput label="Reistijd" value={dest.travelTime} onChange={(v) => updateDest(i, "travelTime", v)} />

          <div>
            <Label>Icoon</Label>
            <Select value={dest.icon || "car"} onValueChange={(v) => updateDest(i, "icon", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ICON_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <ResponsiveImageField label="Afbeelding" value={dest.image} onChange={(v) => updateDest(i, "image", v)} pageId={pageId} />
        </div>
      ))}

      <Button variant="outline" size="sm" onClick={addDest} className="w-full">
        <Plus className="w-4 h-4 mr-2" /> Bestemming toevoegen
      </Button>
    </div>
  );
}
