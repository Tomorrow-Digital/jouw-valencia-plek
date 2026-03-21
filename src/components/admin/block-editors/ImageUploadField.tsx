import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X } from "lucide-react";

interface Props {
  label: string;
  value: string;
  onChange: (url: string) => void;
  pageId: string;
}

export function ImageUploadField({ label, value, onChange, pageId }: Props) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${pageId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("page-assets").upload(path, file);
    if (!error) {
      const { data } = supabase.storage.from("page-assets").getPublicUrl(path);
      onChange(data.publicUrl);
    }
    setUploading(false);
    e.target.value = "";
  };

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-foreground">{label}</label>
      {value ? (
        <div className="relative rounded-md overflow-hidden border border-input">
          <img src={value} alt="" className="w-full h-32 object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <label className="flex items-center justify-center gap-2 border-2 border-dashed border-input rounded-md p-6 cursor-pointer hover:border-primary/50 transition-colors text-sm text-muted-foreground">
          <Upload size={16} />
          {uploading ? "Uploading..." : "Kies afbeelding"}
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      )}
    </div>
  );
}
