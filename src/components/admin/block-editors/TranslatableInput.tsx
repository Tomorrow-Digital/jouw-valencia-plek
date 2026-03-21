import { useState } from "react";
import type { TranslatableString } from "@/components/blocks/types";

interface TranslatableInputProps {
  label: string;
  value: TranslatableString;
  onChange: (val: TranslatableString) => void;
  multiline?: boolean;
  placeholder?: string;
}

const LANGS = ["nl", "en", "es"] as const;
const LANG_LABELS: Record<string, string> = { nl: "🇳🇱 NL", en: "🇬🇧 EN", es: "🇪🇸 ES" };

export function TranslatableInput({ label, value, onChange, multiline, placeholder }: TranslatableInputProps) {
  const [activeLang, setActiveLang] = useState<"nl" | "en" | "es">("nl");

  const handleChange = (text: string) => {
    onChange({ ...value, [activeLang]: text });
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-foreground">{label}</label>
        <div className="flex gap-0.5">
          {LANGS.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setActiveLang(l)}
              className={`text-[10px] px-1.5 py-0.5 rounded transition-colors ${
                activeLang === l
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {LANG_LABELS[l]}
            </button>
          ))}
        </div>
      </div>
      {multiline ? (
        <textarea
          value={value[activeLang] || ""}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      ) : (
        <input
          type="text"
          value={value[activeLang] || ""}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      )}
    </div>
  );
}
