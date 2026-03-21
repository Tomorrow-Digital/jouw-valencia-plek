import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, Monitor, Tablet, Smartphone } from "lucide-react";
import type { ResponsiveImage } from "@/components/blocks/types";

interface Props {
  label: string;
  value: ResponsiveImage | string;
  onChange: (value: ResponsiveImage) => void;
  pageId: string;
}

const VIEWPORTS = [
  { key: "desktop" as const, label: "Desktop", icon: Monitor },
  { key: "tablet" as const, label: "Tablet", icon: Tablet },
  { key: "mobile" as const, label: "Mobiel", icon: Smartphone },
] as const;

export function ResponsiveImageField({ label, value, onChange, pageId }: Props) {
  // Normalize: if value is a plain string, treat it as desktop-only
  const normalized: ResponsiveImage =
    typeof value === "string"
      ? { desktop: value, tablet: "", mobile: "" }
      : { desktop: value?.desktop || "", tablet: value?.tablet || "", mobile: value?.mobile || "" };

  const [activeTab, setActiveTab] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, viewport: keyof ResponsiveImage) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${pageId}/${viewport}-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("page-assets").upload(path, file);
    if (!error) {
      const { data } = supabase.storage.from("page-assets").getPublicUrl(path);
      onChange({ ...normalized, [viewport]: data.publicUrl });
    }
    setUploading(false);
    e.target.value = "";
  };

  const clearImage = (viewport: keyof ResponsiveImage) => {
    onChange({ ...normalized, [viewport]: "" });
  };

  const currentUrl = normalized[activeTab];
  const fallbackInfo = !currentUrl && activeTab !== "desktop"
    ? `Gebruikt ${activeTab === "mobile" && normalized.tablet ? "tablet" : "desktop"} afbeelding als fallback`
    : null;

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-foreground">{label}</label>

      {/* Viewport tabs */}
      <div className="flex gap-1 bg-muted rounded-md p-0.5">
        {VIEWPORTS.map(({ key, label: vLabel, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium transition-colors flex-1 justify-center ${
              activeTab === key
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon size={13} />
            {vLabel}
            {normalized[key] && (
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Upload area for active viewport */}
      {currentUrl ? (
        <div className="relative rounded-md overflow-hidden border border-input">
          <img src={currentUrl} alt="" className="w-full h-32 object-cover" />
          <button
            type="button"
            onClick={() => clearImage(activeTab)}
            className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <div>
          <label className="flex items-center justify-center gap-2 border-2 border-dashed border-input rounded-md p-6 cursor-pointer hover:border-primary/50 transition-colors text-sm text-muted-foreground">
            <Upload size={16} />
            {uploading ? "Uploading..." : `Kies ${activeTab} afbeelding`}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleUpload(e, activeTab)}
              className="hidden"
              disabled={uploading}
            />
          </label>
          {fallbackInfo && (
            <p className="text-[10px] text-muted-foreground mt-1 italic">{fallbackInfo}</p>
          )}
        </div>
      )}
    </div>
  );
}
