import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { t } from "@/lib/i18n";
import { Plus, Pencil, Trash2, Globe, FileText, ExternalLink, LayoutTemplate } from "lucide-react";
import type { Page } from "@/components/blocks/types";

interface Props {
  onEditBlocks?: (pageId: string) => void;
}

export function PagesSection({ onEditBlocks }: Props) {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ title: string; slug: string; meta_description: string }>({ title: "", slug: "", meta_description: "" });

  const fetchPages = useCallback(async () => {
    const { data } = await supabase
      .from("pages")
      .select("*")
      .order("updated_at", { ascending: false });
    if (data) setPages(data as unknown as Page[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPages(); }, [fetchPages]);

  const slugify = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setCreating(true);
    const slug = newSlug.trim() || slugify(newTitle);
    await supabase.from("pages").insert({ title: newTitle.trim(), slug, status: "draft" } as any);
    setNewTitle("");
    setNewSlug("");
    setCreating(false);
    fetchPages();
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("pages.confirmDelete"))) return;
    await supabase.from("pages").delete().eq("id", id);
    fetchPages();
  };

  const handleToggleStatus = async (page: Page) => {
    const newStatus = page.status === "published" ? "draft" : "published";
    await supabase.from("pages").update({ status: newStatus } as any).eq("id", page.id);
    fetchPages();
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    await supabase.from("pages").update({
      title: editData.title,
      slug: editData.slug,
      meta_description: editData.meta_description,
    } as any).eq("id", editingId);
    setEditingId(null);
    fetchPages();
  };

  if (loading) return <p className="text-muted-foreground">{t("common.loading")}</p>;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground">{t("pages.title")}</h2>
        <p className="text-sm text-muted-foreground mt-0.5">{t("pages.subtitle")}</p>
      </div>

      {/* Create form */}
      <form onSubmit={handleCreate} className="bg-background rounded-xl border border-border p-4 mb-6 flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-xs font-medium mb-1">{t("pages.pageTitle")}</label>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => {
              setNewTitle(e.target.value);
              if (!newSlug || newSlug === slugify(newTitle)) {
                setNewSlug(slugify(e.target.value));
              }
            }}
            placeholder={t("pages.titlePlaceholder")}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm w-64"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Slug</label>
          <input
            type="text"
            value={newSlug}
            onChange={(e) => setNewSlug(slugify(e.target.value))}
            placeholder="mijn-pagina"
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm w-48"
          />
        </div>
        <button
          type="submit"
          disabled={creating}
          className="flex items-center gap-1 bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <Plus size={16} /> {t("pages.newPage")}
        </button>
      </form>

      {/* Pages list */}
      <div className="space-y-2">
        {pages.map((page) => (
          <div key={page.id} className="bg-background border border-border rounded-xl p-4">
            {editingId === page.id ? (
              <div className="space-y-3">
                <div className="flex gap-3">
                  <input
                    value={editData.title}
                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    className="rounded border border-input bg-background px-2 py-1 text-sm flex-1"
                    placeholder="Titel"
                  />
                  <input
                    value={editData.slug}
                    onChange={(e) => setEditData({ ...editData, slug: slugify(e.target.value) })}
                    className="rounded border border-input bg-background px-2 py-1 text-sm w-48"
                    placeholder="slug"
                  />
                </div>
                <input
                  value={editData.meta_description}
                  onChange={(e) => setEditData({ ...editData, meta_description: e.target.value })}
                  className="rounded border border-input bg-background px-2 py-1 text-sm w-full"
                  placeholder="Meta description"
                />
                <div className="flex gap-2">
                  <button onClick={handleSaveEdit} className="bg-primary text-primary-foreground rounded px-3 py-1 text-sm">{t("common.save")}</button>
                  <button onClick={() => setEditingId(null)} className="text-sm text-muted-foreground">{t("common.cancel")}</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <FileText size={18} className="text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">{page.title}</p>
                    <p className="text-xs text-muted-foreground">/p/{page.slug}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                      page.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {page.status === "published" ? t("pages.published") : t("pages.draft")}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {onEditBlocks && (
                    <button
                      onClick={() => onEditBlocks(page.id)}
                      className="p-2 text-primary hover:text-primary/80 transition-colors"
                      title="Blokken bewerken"
                    >
                      <LayoutTemplate size={14} />
                    </button>
                  )}
                  <a
                    href={`/p/${page.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                    title={t("pages.preview")}
                  >
                    <ExternalLink size={14} />
                  </a>
                  <button
                    onClick={() => handleToggleStatus(page)}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                    title={page.status === "published" ? t("pages.unpublish") : t("pages.publish")}
                  >
                    <Globe size={14} />
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(page.id);
                      setEditData({ title: page.title, slug: page.slug, meta_description: page.meta_description || "" });
                    }}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(page.id)}
                    className="p-2 text-destructive hover:text-destructive/80 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {pages.length === 0 && (
          <p className="text-muted-foreground text-sm text-center py-8">{t("pages.none")}</p>
        )}
      </div>
    </div>
  );
}
