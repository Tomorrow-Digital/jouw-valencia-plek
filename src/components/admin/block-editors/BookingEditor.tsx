import { TranslatableInput } from "./TranslatableInput";

interface Props {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export function BookingEditor({ data, onChange }: Props) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Dit blok toont de volledige boekingskalender, prijsberekening en het reserveringsformulier. De data komt automatisch uit de database.
      </p>
      <TranslatableInput
        label="Koptekst (optioneel)"
        value={data.heading || { nl: "", en: "", es: "" }}
        onChange={(v) => onChange({ ...data, heading: v })}
      />
      <TranslatableInput
        label="Subtekst (optioneel)"
        value={data.subtitle || { nl: "", en: "", es: "" }}
        onChange={(v) => onChange({ ...data, subtitle: v })}
      />
    </div>
  );
}
