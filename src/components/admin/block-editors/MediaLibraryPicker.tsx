import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, Search, Image as ImageIcon } from "lucide-react";

interface MediaItem {
  url: string;
  name: string;
  bucket: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

const BUCKETS = ["page-assets", "photos"] as const;

export function MediaLibraryPicker({ open, onClose, onSelect }: Props) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [activeBucket, setActiveBucket] = useState<"all" | string>("all");
  const [uploading, setUploading] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const allItems: MediaItem[] = [];

    // Fetch from site_photos table (these are the managed photos)
    const { data: sitePhotos } = await supabase
      .from("site_photos")
      .select("url, category")
      .order("created_at", { ascending: false });

    if (sitePhotos) {
      sitePhotos.forEach((p) => {
        allItems.push({
          url: p.url,
          name: p.category,
          bucket: "photos",
        });
      });
    }

    // Fetch from page-assets bucket (list all files recursively)
    const { data: pageFiles } = await supabase.storage.from("page-assets").list("", {
      limit: 500,
      sortBy: { column: "created_at", order: "desc" },
    });

    if (pageFiles) {
      // page-assets has subdirectories per page
      for (const item of pageFiles) {
        if (item.id && !item.metadata) {
          // It's a folder, list its contents
          const { data: subFiles } = await supabase.storage.from("page-assets").list(item.name, {
            limit: 100,
            sortBy: { column: "created_at", order: "desc" },
          });
          if (subFiles) {
            subFiles.forEach((f) => {
              if (f.name && f.metadata) {
                const { data } = supabase.storage.from("page-assets").getPublicUrl(`${item.name}/${f.name}`);
                allItems.push({
                  url: data.publicUrl,
                  name: f.name,
                  bucket: "page-assets",
                });
              }
            });
          }
        } else if (item.name && item.metadata) {
          const { data } = supabase.storage.from("page-assets").getPublicUrl(item.name);
          allItems.push({
            url: data.publicUrl,
            name: item.name,
            bucket: "page-assets",
          });
        }
      }
    }

    // Deduplicate by URL
    const seen = new Set<string>();
    const unique = allItems.filter((item) => {
      if (seen.has(item.url)) return false;
      seen.add(item.url);
      return true;
    });

    setItems(unique);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (open) fetchAll();
  }, [open, fetchAll]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `library/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("page-assets").upload(path, file);
    if (!error) {
      const { data } = supabase.storage.from("page-assets").getPublicUrl(path);
      setItems((prev) => [{ url: data.publicUrl, name: file.name, bucket: "page-assets" }, ...prev]);
    }
    setUploading(false);
    e.target.value = "";
  };

  const filtered = items.filter((item) => {
    const matchesBucket = activeBucket === "all" || item.bucket === activeBucket;
    const matchesSearch = !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.url.toLowerCase().includes(search.toLowerCase());
    return matchesBucket && matchesSearch;
  });

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon size={18} />
            Mediabibliotheek
          </DialogTitle>
        </DialogHeader>

        {/* Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Zoek afbeelding..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-input bg-background pl-8 pr-3 py-2 text-sm"
            />
          </div>

          <div className="flex gap-1 bg-muted rounded-md p-0.5">
            {[
              { key: "all", label: "Alles" },
              { key: "photos", label: "Foto's" },
              { key: "page-assets", label: "Pagina's" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveBucket(tab.key)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  activeBucket === tab.key
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-1.5 bg-primary text-primary-foreground rounded-md px-3 py-2 text-xs font-medium cursor-pointer hover:bg-primary/90 transition-colors">
            <Upload size={14} />
            {uploading ? "Uploaden..." : "Upload"}
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
          </label>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
              Laden...
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground text-sm gap-2">
              <ImageIcon size={32} className="opacity-40" />
              Geen afbeeldingen gevonden
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 p-1">
              {filtered.map((item, i) => (
                <button
                  key={`${item.url}-${i}`}
                  type="button"
                  onClick={() => {
                    onSelect(item.url);
                    onClose();
                  }}
                  className="group relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-colors bg-muted focus:outline-none focus:border-primary"
                >
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end">
                    <span className="text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity p-1.5 truncate w-full">
                      {item.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
