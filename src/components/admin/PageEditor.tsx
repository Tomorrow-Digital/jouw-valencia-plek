import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { Navbar } from "@/components/redesign/Navbar";
import { Footer } from "@/components/redesign/Footer";
import { HeroEditor } from "./block-editors/HeroEditor";
import { TextEditor } from "./block-editors/TextEditor";
import { GalleryEditor } from "./block-editors/GalleryEditor";
import { PricingEditor } from "./block-editors/PricingEditor";
import { ReviewsEditor } from "./block-editors/ReviewsEditor";
import { AmenitiesEditor } from "./block-editors/AmenitiesEditor";
import { BookingCtaEditor } from "./block-editors/BookingCtaEditor";
import { LocationMapEditor } from "./block-editors/LocationMapEditor";
import { FaqEditor } from "./block-editors/FaqEditor";
import type { PageBlock, Page } from "@/components/blocks/types";
import {
  ArrowLeft, Plus, Pencil, Trash2, Eye, EyeOff, GripVertical,
  Check, Loader2, Globe, FileText,
  LayoutTemplate, Type, Image, Euro, Star, Coffee, Phone, MapPin, HelpCircle,
  Monitor, Tablet, Smartphone,
} from "lucide-react";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  useSortable, verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const BLOCK_TYPES = [
  { type: "hero", label: "Hero", icon: LayoutTemplate },
  { type: "text", label: "Tekst", icon: Type },
  { type: "gallery", label: "Galerij", icon: Image },
  { type: "pricing", label: "Prijzen", icon: Euro },
  { type: "reviews", label: "Reviews", icon: Star },
  { type: "amenities", label: "Voorzieningen", icon: Coffee },
  { type: "booking_cta", label: "Boeken CTA", icon: Phone },
  { type: "location_map", label: "Locatie", icon: MapPin },
  { type: "faq", label: "FAQ", icon: HelpCircle },
];

const PREVIEW_MODES = [
  { id: "desktop", label: "Desktop", icon: Monitor, width: "100%" },
  { id: "tablet", label: "Tablet", icon: Tablet, width: "768px" },
  { id: "mobile", label: "Mobiel", icon: Smartphone, width: "375px" },
] as const;

const PREVIEW_LANGS = [
  { code: "nl", label: "🇳🇱 NL" },
  { code: "en", label: "🇬🇧 EN" },
  { code: "es", label: "🇪🇸 ES" },
] as const;

/* ── Sortable block item ── */
function SortableBlockItem({
  block, isEditing, editingBlock, typeInfo, onEdit, onToggleVisibility, onDelete, onDataChange, pageId,
}: {
  block: PageBlock;
  isEditing: boolean;
  editingBlock: PageBlock | undefined;
  typeInfo: (typeof BLOCK_TYPES)[number] | undefined;
  onEdit: () => void;
  onToggleVisibility: () => void;
  onDelete: () => void;
  onDataChange: (data: Record<string, any>) => void;
  pageId: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
  const Icon = typeInfo?.icon || FileText;

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : undefined,
        position: "relative",
      }}
      {...attributes}
      className={`border rounded-lg transition-colors ${isEditing ? "border-primary bg-primary/5" : "border-border bg-background"} ${!block.is_visible ? "opacity-50" : ""}`}
    >
      <div className="flex items-center gap-2 px-3 py-2">
        <button
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none"
          tabIndex={-1}
        >
          <GripVertical size={14} />
        </button>
        <Icon size={16} className="text-muted-foreground flex-shrink-0" />
        <span className="text-sm font-medium flex-1 truncate">{typeInfo?.label || block.type}</span>
        <div className="flex items-center gap-0.5">
          <button onClick={onEdit} className={`p-1.5 rounded transition-colors ${isEditing ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}><Pencil size={13} /></button>
          <button onClick={onToggleVisibility} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">{block.is_visible ? <Eye size={13} /> : <EyeOff size={13} />}</button>
          <button onClick={onDelete} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={13} /></button>
        </div>
      </div>
      {isEditing && editingBlock && (
        <div className="px-3 pb-3 border-t border-border pt-3">
          <BlockEditorSwitch block={editingBlock} onChange={onDataChange} pageId={pageId} />
        </div>
      )}
    </div>
  );
}

/* ── Main editor ── */
interface Props {
  pageId: string;
  onBack: () => void;
}

export function PageEditor({ pageId, onBack }: Props) {
  const [page, setPage] = useState<Page | null>(null);
  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [showTypeChooser, setShowTypeChooser] = useState(false);
  const [saveState, setSaveState] = useState<"saved" | "saving" | "unsaved">("saved");
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [previewLang, setPreviewLang] = useState<string>("nl");
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const fetchData = useCallback(async () => {
    const [{ data: pageData }, { data: blocksData }] = await Promise.all([
      supabase.from("pages").select("*").eq("id", pageId).single(),
      supabase.from("page_blocks").select("*").eq("page_id", pageId).order("position", { ascending: true }),
    ]);
    if (pageData) setPage(pageData as unknown as Page);
    if (blocksData) setBlocks(blocksData as unknown as PageBlock[]);
    setLoading(false);
  }, [pageId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const saveBlock = useCallback(async (block: PageBlock) => {
    setSaveState("saving");
    await supabase.from("page_blocks").update({ data: block.data as any, is_visible: block.is_visible, position: block.position } as any).eq("id", block.id);
    setSaveState("saved");
  }, []);

  const handleBlockDataChange = (blockId: string, newData: Record<string, any>) => {
    setBlocks((prev) => prev.map((b) => (b.id === blockId ? { ...b, data: newData } : b)));
    setSaveState("unsaved");
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      const block = blocks.find((b) => b.id === blockId);
      if (block) saveBlock({ ...block, data: newData });
    }, 1000);
  };

  const handleAddBlock = async (type: string) => {
    const position = blocks.length;
    const { data } = await supabase.from("page_blocks").insert({
      page_id: pageId, type, position, data: {} as any, is_visible: true,
    } as any).select().single();
    if (data) {
      setBlocks((prev) => [...prev, data as unknown as PageBlock]);
      setEditingBlockId((data as any).id);
    }
    setShowTypeChooser(false);
  };

  const handleDeleteBlock = async (blockId: string) => {
    if (!confirm("Dit blok verwijderen?")) return;
    await supabase.from("page_blocks").delete().eq("id", blockId);
    setBlocks((prev) => prev.filter((b) => b.id !== blockId));
    if (editingBlockId === blockId) setEditingBlockId(null);
  };

  const handleToggleVisibility = async (block: PageBlock) => {
    const updated = { ...block, is_visible: !block.is_visible };
    setBlocks((prev) => prev.map((b) => (b.id === block.id ? updated : b)));
    await supabase.from("page_blocks").update({ is_visible: updated.is_visible } as any).eq("id", block.id);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = blocks.findIndex((b) => b.id === active.id);
    const newIdx = blocks.findIndex((b) => b.id === over.id);
    const reordered = arrayMove(blocks, oldIdx, newIdx).map((b, i) => ({ ...b, position: i }));
    setBlocks(reordered);
    await Promise.all(reordered.map((b) => supabase.from("page_blocks").update({ position: b.position } as any).eq("id", b.id)));
  };

  const handleToggleStatus = async () => {
    if (!page) return;
    const newStatus = page.status === "published" ? "draft" : "published";
    await supabase.from("pages").update({ status: newStatus } as any).eq("id", page.id);
    setPage({ ...page, status: newStatus as "draft" | "published" });
  };

  if (loading) return <p className="text-muted-foreground p-8">Laden...</p>;
  if (!page) return <p className="text-destructive p-8">Pagina niet gevonden</p>;

  const editingBlock = blocks.find((b) => b.id === editingBlockId);
  const activePreviewMode = PREVIEW_MODES.find((m) => m.id === previewMode)!;

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-background flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} /> Terug
          </button>
          <div className="h-4 w-px bg-border" />
          <h2 className="text-sm font-medium text-foreground truncate">{page.title}</h2>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${page.status === "published" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
            {page.status === "published" ? "Gepubliceerd" : "Concept"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            {saveState === "saved" && <><Check size={12} className="text-green-600" /> Opgeslagen</>}
            {saveState === "saving" && <><Loader2 size={12} className="animate-spin" /> Opslaan...</>}
            {saveState === "unsaved" && <><span className="w-2 h-2 rounded-full bg-amber-500" /> Niet opgeslagen</>}
          </span>
          <button onClick={handleToggleStatus} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${page.status === "published" ? "bg-amber-100 text-amber-700 hover:bg-amber-200" : "bg-green-100 text-green-700 hover:bg-green-200"}`}>
            <Globe size={12} />
            {page.status === "published" ? "Naar concept" : "Publiceren"}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Block list + editor */}
        <div className="w-[45%] border-r border-border flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
                {blocks.map((block) => {
                  const typeInfo = BLOCK_TYPES.find((t) => t.type === block.type);
                  return (
                    <SortableBlockItem
                      key={block.id}
                      block={block}
                      isEditing={editingBlockId === block.id}
                      editingBlock={editingBlockId === block.id ? editingBlock : undefined}
                      typeInfo={typeInfo}
                      onEdit={() => setEditingBlockId(editingBlockId === block.id ? null : block.id)}
                      onToggleVisibility={() => handleToggleVisibility(block)}
                      onDelete={() => handleDeleteBlock(block.id)}
                      onDataChange={(data) => handleBlockDataChange(block.id, data)}
                      pageId={pageId}
                    />
                  );
                })}
              </SortableContext>
            </DndContext>

            {blocks.length === 0 && !showTypeChooser && (
              <div className="text-center py-12 text-muted-foreground text-sm">
                Nog geen blokken. Voeg je eerste blok toe!
              </div>
            )}

            {showTypeChooser ? (
              <div className="border border-dashed border-primary/50 rounded-lg p-4">
                <p className="text-xs font-medium text-foreground mb-3">Kies een bloktype:</p>
                <div className="grid grid-cols-3 gap-2">
                  {BLOCK_TYPES.map((bt) => (
                    <button key={bt.type} onClick={() => handleAddBlock(bt.type)} className="flex flex-col items-center gap-1 p-3 rounded-lg border border-border bg-background hover:border-primary hover:bg-primary/5 transition-colors">
                      <bt.icon size={18} className="text-muted-foreground" />
                      <span className="text-xs font-medium">{bt.label}</span>
                    </button>
                  ))}
                </div>
                <button onClick={() => setShowTypeChooser(false)} className="mt-2 text-xs text-muted-foreground hover:text-foreground">Annuleren</button>
              </div>
            ) : (
              <button onClick={() => setShowTypeChooser(true)} className="w-full flex items-center justify-center gap-1 py-3 border-2 border-dashed border-border rounded-lg text-sm text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors">
                <Plus size={16} /> Blok toevoegen
              </button>
            )}
          </div>
        </div>

        {/* Right: Live preview */}
        <div className="flex-1 overflow-y-auto bg-muted/30">
          <div className="sticky top-0 z-10 bg-muted/80 backdrop-blur-sm px-4 py-2 border-b border-border flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-medium">Preview</p>
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5 bg-background rounded-lg border border-border p-0.5">
                {PREVIEW_LANGS.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setPreviewLang(l.code)}
                    className={`text-[10px] px-2 py-1 rounded-md transition-colors font-medium ${
                      previewLang === l.code ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-0.5 bg-background rounded-lg border border-border p-0.5">
                {PREVIEW_MODES.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPreviewMode(m.id)}
                    className={`p-1.5 rounded-md transition-colors ${
                      previewMode === m.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                    title={m.label}
                  >
                    <m.icon size={14} />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-center p-4">
            <div
              className={`bg-background transition-all duration-300 ${
                previewMode !== "desktop"
                  ? "border border-border rounded-xl shadow-lg overflow-hidden"
                  : "w-full"
              }`}
              style={previewMode !== "desktop" ? { width: activePreviewMode.width, maxWidth: "100%" } : undefined}
            >
              <Navbar lang={previewLang as any} onLangChange={(l) => setPreviewLang(l)} static />
              <BlockRenderer blocks={blocks} lang={previewLang} />
              {blocks.length === 0 && (
                <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">Geen blokken om te tonen</div>
              )}
              <Footer lang={previewLang as any} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BlockEditorSwitch({ block, onChange, pageId }: { block: PageBlock; onChange: (data: Record<string, any>) => void; pageId: string }) {
  switch (block.type) {
    case "hero": return <HeroEditor data={block.data} onChange={onChange} pageId={pageId} />;
    case "text": return <TextEditor data={block.data} onChange={onChange} />;
    case "gallery": return <GalleryEditor data={block.data} onChange={onChange} pageId={pageId} />;
    case "pricing": return <PricingEditor data={block.data} onChange={onChange} />;
    case "reviews": return <ReviewsEditor data={block.data} onChange={onChange} pageId={pageId} />;
    case "amenities": return <AmenitiesEditor data={block.data} onChange={onChange} />;
    case "booking_cta": return <BookingCtaEditor data={block.data} onChange={onChange} />;
    case "location_map": return <LocationMapEditor data={block.data} onChange={onChange} />;
    case "faq": return <FaqEditor data={block.data} onChange={onChange} />;
    default: return <p className="text-sm text-muted-foreground">Geen editor beschikbaar voor type: {block.type}</p>;
  }
}
