import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout, type AdminSection } from "@/components/admin/AdminLayout";
import { DashboardSection } from "@/components/admin/DashboardSection";
import { IntegrationWhatsApp } from "@/components/admin/integrations/IntegrationWhatsApp";
import { IntegrationN8N } from "@/components/admin/integrations/IntegrationN8N";
import { IntegrationPlaceholder } from "@/components/admin/integrations/IntegrationPlaceholder";
import { CrmInbox } from "@/components/admin/crm/CrmInbox";
import { CrmGuests } from "@/components/admin/crm/CrmGuests";
import { CrmTemplates } from "@/components/admin/crm/CrmTemplates";
import { PagesSection } from "@/components/admin/PagesSection";
import { PageEditor } from "@/components/admin/PageEditor";
import { t } from "@/lib/i18n";
import {
  Trash2, Plus, Upload, Save, X, Pencil, Check, UserX, Link2, Copy, Clock,
} from "lucide-react";

export default function Admin() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const sectionParam = (searchParams.get("section") as AdminSection) || "dashboard";
  const [section, setSection] = useState<AdminSection>(sectionParam);
  const [editingPageId, setEditingPageId] = useState<string | null>(searchParams.get("pageId") || null);

  const handleSectionChange = (s: AdminSection) => {
    setSection(s);
    if (s !== "page-editor") setEditingPageId(null);
    setSearchParams(s === "page-editor" && editingPageId ? { section: s, pageId: editingPageId } : { section: s });
  };

  const handleEditBlocks = (pageId: string) => {
    setEditingPageId(pageId);
    setSection("page-editor");
    setSearchParams({ section: "page-editor", pageId });
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) navigate("/login");
      else setUser(session.user);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/login");
      else setUser(session.user);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">{t('common.loading')}</p></div>;
  if (!user) return null;

  return (
    <AdminLayout section={section} onSectionChange={handleSectionChange}>
      {section === "dashboard" && <DashboardSection onNavigate={handleSectionChange} />}
      {section === "bookings" && <BookingsSection />}
      {section === "messages" && <MessagesSection />}
      {section === "photos" && <PhotosSection />}
      {section === "calendar" && <CalendarSection />}
      {section === "pricing" && <PricingSection />}
      {section === "pages" && <PagesSection onEditBlocks={handleEditBlocks} />}
      {section === "page-editor" && editingPageId && (
        <PageEditor pageId={editingPageId} onBack={() => handleSectionChange("pages")} />
      )}
      {section === "deletion" && <DeletionRequestsSection />}
      {section === "users" && <UsersSection />}
      {section === "crm-inbox" && <CrmInbox />}
      {section === "crm-guests" && <CrmGuests />}
      {section === "crm-templates" && <CrmTemplates />}
      {section === "integrations-whatsapp" && <IntegrationWhatsApp />}
      {section === "integrations-n8n" && <IntegrationN8N />}
      {section === "integrations-email" && <IntegrationPlaceholder type="email" />}
      {section === "integrations-payments" && <IntegrationPlaceholder type="payments" />}
      {section === "integrations-calendar" && <IntegrationPlaceholder type="calendar" />}
    </AdminLayout>
  );
}

// ═══════════════════════════════════════
// SECTION WRAPPER
// ═══════════════════════════════════════

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
    </div>
  );
}

// ═══════════════════════════════════════
// PHOTOS
// ═══════════════════════════════════════

const CATEGORIES = [
  { id: "hero", label: t('photos.hero') },
  { id: "room", label: t('photos.room') },
  { id: "bathroom", label: t('photos.bathroom') },
  { id: "kitchen", label: t('photos.kitchen') },
  { id: "host", label: t('photos.host') },
];

function PhotosSection() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("hero");

  const fetchPhotos = useCallback(async () => {
    const { data } = await supabase.from("site_photos").select("*").order("category").order("sort_order");
    if (data) setPhotos(data);
  }, []);

  useEffect(() => { fetchPhotos(); }, [fetchPhotos]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `${selectedCategory}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("photos").upload(path, file);
      if (uploadError) continue;

      const { data: { publicUrl } } = supabase.storage.from("photos").getPublicUrl(path);
      const existingForCategory = photos.filter(p => p.category === selectedCategory);
      const isPrimary = existingForCategory.length === 0;

      await supabase.from("site_photos").insert({
        category: selectedCategory,
        url: publicUrl,
        sort_order: existingForCategory.length,
        is_primary: isPrimary,
      });
    }

    setUploading(false);
    fetchPhotos();
    e.target.value = "";
  };

  const handleDelete = async (photo: any) => {
    const url = new URL(photo.url);
    const pathParts = url.pathname.split("/storage/v1/object/public/photos/");
    if (pathParts[1]) await supabase.storage.from("photos").remove([pathParts[1]]);
    await supabase.from("site_photos").delete().eq("id", photo.id);
    fetchPhotos();
  };

  const handleSetPrimary = async (photo: any) => {
    await supabase.from("site_photos").update({ is_primary: false }).eq("category", photo.category);
    await supabase.from("site_photos").update({ is_primary: true }).eq("id", photo.id);
    fetchPhotos();
  };

  return (
    <div>
      <SectionHeader title={t('photos.title')} subtitle={t('photos.subtitle')} />
      <div className="flex items-center gap-4 mb-6">
        <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
          {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <label className="flex items-center gap-2 bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium cursor-pointer hover:bg-primary/90 transition-colors active:scale-[0.97]">
          <Upload size={16} />
          {uploading ? t('photos.uploading') : t('photos.upload')}
          <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      {CATEGORIES.map(cat => {
        const catPhotos = photos.filter(p => p.category === cat.id);
        if (catPhotos.length === 0) return null;
        return (
          <div key={cat.id} className="mb-8">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">{cat.label}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {catPhotos.map(photo => (
                <div key={photo.id} className="relative group rounded-xl overflow-hidden bg-muted aspect-[4/3]">
                  <img src={photo.url} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    {!photo.is_primary && (
                      <button onClick={() => handleSetPrimary(photo)} className="bg-background/90 rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-background transition-colors">{t('photos.mainPhoto')}</button>
                    )}
                    <button onClick={() => handleDelete(photo)} className="bg-destructive/90 text-destructive-foreground rounded-lg p-2 hover:bg-destructive transition-colors"><Trash2 size={14} /></button>
                  </div>
                  {photo.is_primary && <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-md">{t('photos.mainPhoto')}</span>}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {photos.length === 0 && <p className="text-muted-foreground text-sm text-center py-12">{t('photos.none')}</p>}
    </div>
  );
}

// ═══════════════════════════════════════
// CALENDAR
// ═══════════════════════════════════════

function CalendarSection() {
  const [blockedDates, setBlockedDates] = useState<any[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editing, setEditing] = useState<any>(null);

  const fetchBlocked = useCallback(async () => {
    const { data } = await supabase.from("blocked_dates").select("*").order("start_date");
    if (data) setBlockedDates(data);
  }, []);

  useEffect(() => { fetchBlocked(); }, [fetchBlocked]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) return;
    setSaving(true);
    await supabase.from("blocked_dates").insert({ start_date: startDate, end_date: endDate, reason });
    setStartDate(""); setEndDate(""); setReason("");
    setSaving(false);
    fetchBlocked();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("blocked_dates").delete().eq("id", id);
    fetchBlocked();
  };

  const handleEdit = (b: any) => {
    setEditingId(b.id);
    setEditing({ start_date: b.start_date, end_date: b.end_date, reason: b.reason || "" });
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editing) return;
    await supabase.from("blocked_dates").update({ start_date: editing.start_date, end_date: editing.end_date, reason: editing.reason }).eq("id", editingId);
    setEditingId(null); setEditing(null);
    fetchBlocked();
  };

  return (
    <div>
      <SectionHeader title={t('calendar.title')} subtitle={t('calendar.subtitle')} />
      <form onSubmit={handleAdd} className="bg-background rounded-xl border border-border p-4 mb-6 flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-xs font-medium mb-1">{t('calendar.startDate')}</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" required />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">{t('calendar.endDate')}</label>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" required />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">{t('calendar.reason')}</label>
          <input type="text" value={reason} onChange={e => setReason(e.target.value)} placeholder={t('calendar.reasonPlaceholder')} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        </div>
        <button type="submit" disabled={saving} className="flex items-center gap-1 bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 active:scale-[0.97]">
          <Plus size={16} /> {t('common.add')}
        </button>
      </form>

      <div className="space-y-2">
        {blockedDates.map(b => (
          <div key={b.id} className="bg-background border border-border rounded-xl p-4 flex items-center justify-between gap-2">
            {editingId === b.id ? (
              <>
                <div className="flex flex-wrap gap-2 flex-1 items-center text-sm">
                  <input type="date" value={editing.start_date} onChange={e => setEditing({ ...editing, start_date: e.target.value })} className="rounded border border-input bg-background px-2 py-1 text-sm" />
                  <span>→</span>
                  <input type="date" value={editing.end_date} onChange={e => setEditing({ ...editing, end_date: e.target.value })} className="rounded border border-input bg-background px-2 py-1 text-sm" />
                  <input type="text" value={editing.reason} onChange={e => setEditing({ ...editing, reason: e.target.value })} placeholder="Reden" className="rounded border border-input bg-background px-2 py-1 text-sm w-32" />
                </div>
                <div className="flex gap-1">
                  <button onClick={handleSaveEdit} className="text-primary hover:text-primary/80"><Check size={16} /></button>
                  <button onClick={() => setEditingId(null)} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <span className="text-sm font-medium">{b.start_date} → {b.end_date}</span>
                  {b.reason && <span className="text-sm text-muted-foreground ml-3">{b.reason}</span>}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(b)} className="text-muted-foreground hover:text-foreground transition-colors"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(b.id)} className="text-destructive hover:text-destructive/80 transition-colors"><Trash2 size={16} /></button>
                </div>
              </>
            )}
          </div>
        ))}
        {blockedDates.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">{t('calendar.none')}</p>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// PRICING
// ═══════════════════════════════════════

function PricingSection() {
  const [config, setConfig] = useState<any>(null);
  const [seasonal, setSeasonal] = useState<any[]>([]);
  const [custom, setCustom] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [newSeasonal, setNewSeasonal] = useState({ label: "", label_en: "", start_date: "", end_date: "", price_per_night: "" });
  const [newCustom, setNewCustom] = useState({ label: "", start_date: "", end_date: "", price_per_night: "" });
  const [editingSeasonalId, setEditingSeasonalId] = useState<string | null>(null);
  const [editingSeasonal, setEditingSeasonal] = useState<any>(null);
  const [editingCustomId, setEditingCustomId] = useState<string | null>(null);
  const [editingCustom, setEditingCustom] = useState<any>(null);

  const fetchAll = useCallback(async () => {
    const [{ data: cfg }, { data: sea }, { data: cus }] = await Promise.all([
      supabase.from("pricing_config").select("*").limit(1).single(),
      supabase.from("seasonal_pricing").select("*").order("start_date"),
      supabase.from("custom_pricing").select("*").order("start_date"),
    ]);
    if (cfg) setConfig(cfg);
    if (sea) setSeasonal(sea);
    if (cus) setCustom(cus);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleSaveConfig = async () => {
    if (!config) return;
    setSaving(true);
    await supabase.from("pricing_config").update({
      default_price_per_night: config.default_price_per_night,
      cleaning_fee: config.cleaning_fee,
      minimum_stay: config.minimum_stay,
      maximum_stay: config.maximum_stay,
      weekly_discount: config.weekly_discount,
      monthly_discount: config.monthly_discount,
    }).eq("id", config.id);
    setSaving(false);
  };

  const handleAddSeasonal = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from("seasonal_pricing").insert({ label: newSeasonal.label, label_en: newSeasonal.label_en, start_date: newSeasonal.start_date, end_date: newSeasonal.end_date, price_per_night: Number(newSeasonal.price_per_night) });
    setNewSeasonal({ label: "", label_en: "", start_date: "", end_date: "", price_per_night: "" });
    fetchAll();
  };

  const handleDeleteSeasonal = async (id: string) => { await supabase.from("seasonal_pricing").delete().eq("id", id); fetchAll(); };

  const handleEditSeasonal = (s: any) => {
    setEditingSeasonalId(s.id);
    setEditingSeasonal({ label: s.label, label_en: s.label_en || "", start_date: s.start_date, end_date: s.end_date, price_per_night: s.price_per_night });
  };

  const handleSaveSeasonal = async () => {
    if (!editingSeasonalId || !editingSeasonal) return;
    await supabase.from("seasonal_pricing").update({ label: editingSeasonal.label, label_en: editingSeasonal.label_en, start_date: editingSeasonal.start_date, end_date: editingSeasonal.end_date, price_per_night: Number(editingSeasonal.price_per_night) }).eq("id", editingSeasonalId);
    setEditingSeasonalId(null); setEditingSeasonal(null);
    fetchAll();
  };

  const handleAddCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from("custom_pricing").insert({ label: newCustom.label, start_date: newCustom.start_date, end_date: newCustom.end_date, price_per_night: Number(newCustom.price_per_night) });
    setNewCustom({ label: "", start_date: "", end_date: "", price_per_night: "" });
    fetchAll();
  };

  const handleDeleteCustom = async (id: string) => { await supabase.from("custom_pricing").delete().eq("id", id); fetchAll(); };

  const handleEditCustom = (c: any) => {
    setEditingCustomId(c.id);
    setEditingCustom({ label: c.label, start_date: c.start_date, end_date: c.end_date, price_per_night: c.price_per_night });
  };

  const handleSaveCustom = async () => {
    if (!editingCustomId || !editingCustom) return;
    await supabase.from("custom_pricing").update({ label: editingCustom.label, start_date: editingCustom.start_date, end_date: editingCustom.end_date, price_per_night: Number(editingCustom.price_per_night) }).eq("id", editingCustomId);
    setEditingCustomId(null); setEditingCustom(null);
    fetchAll();
  };

  if (!config) return <p className="text-muted-foreground text-sm">{t('common.loading')}</p>;

  return (
    <div className="space-y-8">
      <SectionHeader title={t('pricing.title')} subtitle={t('pricing.subtitle')} />

      {/* General config */}
      <div className="bg-background rounded-xl border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">{t('pricing.general')}</h3>
        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          {[
            { key: "default_price_per_night", label: t('pricing.defaultPrice') },
            { key: "cleaning_fee", label: t('pricing.cleaningFee') },
            { key: "minimum_stay", label: t('pricing.minStay') },
            { key: "maximum_stay", label: t('pricing.maxStay') },
            { key: "weekly_discount", label: t('pricing.weeklyDiscount') },
            { key: "monthly_discount", label: t('pricing.monthlyDiscount') },
          ].map(field => (
            <div key={field.key}>
              <label className="block text-xs font-medium mb-1">{field.label}</label>
              <input type="number" value={config[field.key]} onChange={e => setConfig({ ...config, [field.key]: Number(e.target.value) })} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
            </div>
          ))}
        </div>
        <button onClick={handleSaveConfig} disabled={saving} className="flex items-center gap-2 bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 active:scale-[0.97]">
          <Save size={16} /> {saving ? t('common.saving') : t('common.save')}
        </button>
      </div>

      {/* Seasonal pricing */}
      <div className="bg-background rounded-xl border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">{t('pricing.seasonal')}</h3>
        <div className="space-y-2 mb-4">
          {seasonal.map(s => (
            <div key={s.id} className="flex items-center justify-between bg-muted/40 rounded-lg p-3 gap-2">
              {editingSeasonalId === s.id ? (
                <>
                  <div className="flex flex-wrap gap-2 flex-1 items-center text-sm">
                    <input value={editingSeasonal.label} onChange={e => setEditingSeasonal({ ...editingSeasonal, label: e.target.value })} className="rounded border border-input bg-background px-2 py-1 text-sm w-32" />
                    <input value={editingSeasonal.label_en} onChange={e => setEditingSeasonal({ ...editingSeasonal, label_en: e.target.value })} className="rounded border border-input bg-background px-2 py-1 text-sm w-32" placeholder="EN" />
                    <input type="date" value={editingSeasonal.start_date} onChange={e => setEditingSeasonal({ ...editingSeasonal, start_date: e.target.value })} className="rounded border border-input bg-background px-2 py-1 text-sm" />
                    <input type="date" value={editingSeasonal.end_date} onChange={e => setEditingSeasonal({ ...editingSeasonal, end_date: e.target.value })} className="rounded border border-input bg-background px-2 py-1 text-sm" />
                    <div className="flex items-center gap-1"><span className="text-xs">€</span><input type="number" value={editingSeasonal.price_per_night} onChange={e => setEditingSeasonal({ ...editingSeasonal, price_per_night: e.target.value })} className="rounded border border-input bg-background px-2 py-1 text-sm w-20" /></div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={handleSaveSeasonal} className="text-primary hover:text-primary/80"><Check size={16} /></button>
                    <button onClick={() => setEditingSeasonalId(null)} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-sm"><span className="font-medium">{s.label}</span><span className="text-muted-foreground ml-2">{s.start_date} → {s.end_date}</span><span className="ml-2 font-medium">€{s.price_per_night}/nacht</span></div>
                  <div className="flex gap-1">
                    <button onClick={() => handleEditSeasonal(s)} className="text-muted-foreground hover:text-foreground"><Pencil size={14} /></button>
                    <button onClick={() => handleDeleteSeasonal(s.id)} className="text-destructive hover:text-destructive/80"><Trash2 size={14} /></button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        <form onSubmit={handleAddSeasonal} className="flex flex-wrap gap-2 items-end">
          <div><label className="block text-xs font-medium mb-1">Label (NL)</label><input type="text" value={newSeasonal.label} onChange={e => setNewSeasonal({ ...newSeasonal, label: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" required /></div>
          <div><label className="block text-xs font-medium mb-1">Label (EN)</label><input type="text" value={newSeasonal.label_en} onChange={e => setNewSeasonal({ ...newSeasonal, label_en: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" /></div>
          <div><label className="block text-xs font-medium mb-1">Start</label><input type="date" value={newSeasonal.start_date} onChange={e => setNewSeasonal({ ...newSeasonal, start_date: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" required /></div>
          <div><label className="block text-xs font-medium mb-1">Eind</label><input type="date" value={newSeasonal.end_date} onChange={e => setNewSeasonal({ ...newSeasonal, end_date: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" required /></div>
          <div><label className="block text-xs font-medium mb-1">€/nacht</label><input type="number" value={newSeasonal.price_per_night} onChange={e => setNewSeasonal({ ...newSeasonal, price_per_night: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm w-24" required /></div>
          <button type="submit" className="flex items-center gap-1 bg-primary text-primary-foreground rounded-lg px-3 py-2 text-sm font-medium hover:bg-primary/90 active:scale-[0.97]"><Plus size={14} /> Toevoegen</button>
        </form>
      </div>

      {/* Custom pricing */}
      <div className="bg-background rounded-xl border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">{t('pricing.special')}</h3>
        <div className="space-y-2 mb-4">
          {custom.map(c => (
            <div key={c.id} className="flex items-center justify-between bg-muted/40 rounded-lg p-3 gap-2">
              {editingCustomId === c.id ? (
                <>
                  <div className="flex flex-wrap gap-2 flex-1 items-center text-sm">
                    <input value={editingCustom.label} onChange={e => setEditingCustom({ ...editingCustom, label: e.target.value })} className="rounded border border-input bg-background px-2 py-1 text-sm w-32" />
                    <input type="date" value={editingCustom.start_date} onChange={e => setEditingCustom({ ...editingCustom, start_date: e.target.value })} className="rounded border border-input bg-background px-2 py-1 text-sm" />
                    <input type="date" value={editingCustom.end_date} onChange={e => setEditingCustom({ ...editingCustom, end_date: e.target.value })} className="rounded border border-input bg-background px-2 py-1 text-sm" />
                    <div className="flex items-center gap-1"><span className="text-xs">€</span><input type="number" value={editingCustom.price_per_night} onChange={e => setEditingCustom({ ...editingCustom, price_per_night: e.target.value })} className="rounded border border-input bg-background px-2 py-1 text-sm w-20" /></div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={handleSaveCustom} className="text-primary hover:text-primary/80"><Check size={16} /></button>
                    <button onClick={() => setEditingCustomId(null)} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-sm"><span className="font-medium">{c.label}</span><span className="text-muted-foreground ml-2">{c.start_date} → {c.end_date}</span><span className="ml-2 font-medium">€{c.price_per_night}/nacht</span></div>
                  <div className="flex gap-1">
                    <button onClick={() => handleEditCustom(c)} className="text-muted-foreground hover:text-foreground"><Pencil size={14} /></button>
                    <button onClick={() => handleDeleteCustom(c.id)} className="text-destructive hover:text-destructive/80"><Trash2 size={14} /></button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        <form onSubmit={handleAddCustom} className="flex flex-wrap gap-2 items-end">
          <div><label className="block text-xs font-medium mb-1">Label</label><input type="text" value={newCustom.label} onChange={e => setNewCustom({ ...newCustom, label: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" required /></div>
          <div><label className="block text-xs font-medium mb-1">Start</label><input type="date" value={newCustom.start_date} onChange={e => setNewCustom({ ...newCustom, start_date: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" required /></div>
          <div><label className="block text-xs font-medium mb-1">Eind</label><input type="date" value={newCustom.end_date} onChange={e => setNewCustom({ ...newCustom, end_date: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" required /></div>
          <div><label className="block text-xs font-medium mb-1">€/nacht</label><input type="number" value={newCustom.price_per_night} onChange={e => setNewCustom({ ...newCustom, price_per_night: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm w-24" required /></div>
          <button type="submit" className="flex items-center gap-1 bg-primary text-primary-foreground rounded-lg px-3 py-2 text-sm font-medium hover:bg-primary/90 active:scale-[0.97]"><Plus size={14} /> Toevoegen</button>
        </form>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// BOOKINGS
// ═══════════════════════════════════════

function BookingsSection() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
    if (data) setBookings(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("bookings").update({ status }).eq("id", id);
    fetchBookings();
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('bookings.confirmDelete'))) return;
    await supabase.from("bookings").delete().eq("id", id);
    fetchBookings();
  };

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const statusLabels: Record<string, string> = {
    pending: t('bookings.statusPending'),
    confirmed: t('bookings.statusConfirmed'),
    cancelled: t('bookings.statusCancelled'),
  };

  if (loading) return <p className="text-muted-foreground text-sm text-center py-12">{t('common.loading')}</p>;

  return (
    <div>
      <SectionHeader title={t('bookings.title')} subtitle={`${bookings.length} ${t('bookings.subtitle')}`} />
      {bookings.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-12">{t('bookings.none')}</p>
      ) : (
        <div className="space-y-4">
          {bookings.map(b => (
            <div key={b.id} className="bg-background border border-border rounded-xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <h4 className="font-medium text-base">{b.first_name} {b.last_name}</h4>
                  <p className="text-sm text-muted-foreground">{b.email} · {b.phone}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[b.status] || "bg-muted text-muted-foreground"}`}>{statusLabels[b.status] || b.status}</span>
                  <select value={b.status} onChange={e => updateStatus(b.id, e.target.value)} className="rounded border border-input bg-background px-2 py-1 text-xs">
                    <option value="pending">{t('bookings.statusPending')}</option>
                    <option value="confirmed">{t('bookings.statusConfirmed')}</option>
                    <option value="cancelled">{t('bookings.statusCancelled')}</option>
                  </select>
                  <button onClick={() => handleDelete(b.id)} className="text-destructive hover:text-destructive/80 transition-colors ml-1"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div><span className="text-muted-foreground text-xs">{t('bookings.checkIn')}</span><p className="font-medium">{b.check_in}</p></div>
                <div><span className="text-muted-foreground text-xs">{t('bookings.checkOut')}</span><p className="font-medium">{b.check_out}</p></div>
                <div><span className="text-muted-foreground text-xs">{t('bookings.guests')}</span><p className="font-medium">{b.guests}</p></div>
                <div><span className="text-muted-foreground text-xs">{t('bookings.totalPrice')}</span><p className="font-medium">{b.total_price ? `€${b.total_price}` : "—"}</p></div>
              </div>
              {b.message && <div className="mt-3 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3"><span className="text-xs font-medium text-foreground">{t('bookings.message')}</span> {b.message}</div>}
              <p className="text-xs text-muted-foreground mt-3">{t('bookings.received')} {new Date(b.created_at).toLocaleString("nl-NL", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════
// MESSAGES
// ═══════════════════════════════════════

function MessagesSection() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    setMessages(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const handleDelete = async (id: string) => {
    await supabase.from("contact_messages").delete().eq("id", id);
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  if (loading) return <p className="text-muted-foreground">{t('common.loading')}</p>;

  return (
    <div>
      <SectionHeader title={t('messages.title')} subtitle={`${messages.length} ${t('messages.subtitle')}`} />
      {messages.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-12">{t('messages.none')}</p>
      ) : (
        <div className="space-y-3">
          {messages.map(m => (
            <div key={m.id} className="bg-background border border-border rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{m.name}</p>
                  <p className="text-sm text-muted-foreground">{m.phone}</p>
                </div>
                <button onClick={() => handleDelete(m.id)} className="text-muted-foreground hover:text-destructive transition-colors p-1"><Trash2 size={16} /></button>
              </div>
              <p className="mt-3 text-sm text-foreground whitespace-pre-wrap">{m.message}</p>
              <p className="text-xs text-muted-foreground mt-3">{new Date(m.created_at).toLocaleString("nl-NL", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════
// DELETION REQUESTS
// ═══════════════════════════════════════

function DeletionRequestsSection() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchRequests = useCallback(async () => {
    const { data } = await supabase.from("deletion_requests").select("*").order("created_at", { ascending: false });
    setRequests(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("deletion_requests").update({ status, updated_at: new Date().toISOString(), ...(status === "completed" ? { completed_at: new Date().toISOString() } : {}) }).eq("id", id);
    fetchRequests();
  };

  const handleDeleteRequest = async (id: string) => {
    if (!confirm("Weet je zeker dat je dit verwijderverzoek wilt verwijderen?")) return;
    await supabase.from("deletion_requests").delete().eq("id", id);
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  const handleDeletePersonData = async (request: any) => {
    if (!confirm(`Dit verwijdert/anonimiseert alle persoonsgegevens van ${request.email || request.name || "deze persoon"} uit boekingen en contactberichten. Financiële gegevens (totaalprijs) worden bewaard. Doorgaan?`)) return;
    setProcessing(request.id);
    try {
      if (request.email) {
        const { data: bookings } = await supabase.from("bookings").select("id").eq("email", request.email);
        if (bookings && bookings.length > 0) {
          for (const b of bookings) {
            await supabase.from("bookings").update({ first_name: "Verwijderd", last_name: "Verwijderd", email: `deleted-${b.id.slice(0, 8)}@verwijderd.nl`, phone: null, message: null, arrival_time: null }).eq("id", b.id);
          }
        }
      }
      if (request.phone) {
        await supabase.from("contact_messages").delete().eq("phone", request.phone);
      }
      await supabase.from("deletion_requests").update({ status: "completed", completed_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", request.id);
      fetchRequests();
    } catch {
      alert("Er is een fout opgetreden bij het verwijderen van de gegevens.");
    } finally {
      setProcessing(null);
    }
  };

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    email_sent: "bg-blue-100 text-blue-800",
    verified: "bg-purple-100 text-purple-800",
    processing: "bg-orange-100 text-orange-800",
    completed: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  const statusLabels: Record<string, string> = {
    pending: "In afwachting",
    email_sent: "E-mail verstuurd",
    verified: "Geverifieerd",
    processing: "In verwerking",
    completed: "Afgerond",
    rejected: "Afgewezen",
  };

  const typeLabels: Record<string, string> = {
    delete_all: "Alles verwijderen",
    delete_specific: "Specifiek verwijderen",
    data_access: "Inzageverzoek",
    meta_callback: "Meta callback",
  };

  if (loading) return <p className="text-muted-foreground text-sm text-center py-12">Laden...</p>;

  return (
    <div>
      <SectionHeader title="Verwijderverzoeken" subtitle={`${requests.length} verzoeken — beheer AVG/GDPR data deletion requests.`} />

      {/* Status filter */}
      <div className="mb-4 flex items-center gap-3">
        <label className="text-sm font-medium text-muted-foreground">Filter:</label>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
          <option value="all">Alle</option>
          <option value="pending">In afwachting</option>
          <option value="verified">Geverifieerd</option>
          <option value="processing">In verwerking</option>
          <option value="completed">Afgerond</option>
          <option value="rejected">Afgewezen</option>
        </select>
      </div>

      {requests.filter(r => statusFilter === "all" || r.status === statusFilter).length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-12">Geen verwijderverzoeken gevonden.</p>
      ) : (
        <div className="space-y-4">
          {requests.filter(r => statusFilter === "all" || r.status === statusFilter).map(r => (
            <div key={r.id} className="bg-background border border-border rounded-xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <h4 className="font-medium text-base">{r.name || "(Geen naam)"}</h4>
                  <p className="text-sm text-muted-foreground">{r.email || "(Geen e-mail)"}{r.phone ? ` · ${r.phone}` : ""}</p>
                  {r.meta_user_id && <p className="text-xs text-muted-foreground mt-0.5">Meta ID: {r.meta_user_id}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[r.status] || "bg-muted text-muted-foreground"}`}>{statusLabels[r.status] || r.status}</span>
                  <select value={r.status} onChange={e => updateStatus(r.id, e.target.value)} className="rounded border border-input bg-background px-2 py-1 text-xs">
                    <option value="pending">In afwachting</option>
                    <option value="email_sent">E-mail verstuurd</option>
                    <option value="verified">Geverifieerd</option>
                    <option value="processing">In verwerking</option>
                    <option value="completed">Afgerond</option>
                    <option value="rejected">Afgewezen</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-3">
                <div><span className="text-muted-foreground text-xs">Type</span><p className="font-medium">{typeLabels[r.request_type] || r.request_type}</p></div>
                <div><span className="text-muted-foreground text-xs">Bron</span><p className="font-medium">{r.source === "meta_callback" ? "Meta/Facebook" : "Website"}</p></div>
                <div><span className="text-muted-foreground text-xs">Bevestigingscode</span><p className="font-medium font-mono text-xs">{r.confirmation_code || "—"}</p></div>
                <div><span className="text-muted-foreground text-xs">Meta User ID</span><p className="font-medium font-mono text-xs">{r.meta_user_id || "—"}</p></div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-3">
                <div><span className="text-muted-foreground text-xs">Taal</span><p className="font-medium">{r.language?.toUpperCase() || "NL"}</p></div>
                <div><span className="text-muted-foreground text-xs">Geverifieerd op</span><p className="font-medium">{r.verified_at ? new Date(r.verified_at).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" }) : "—"}</p></div>
                <div><span className="text-muted-foreground text-xs">Afgerond op</span><p className="font-medium">{r.completed_at ? new Date(r.completed_at).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" }) : "—"}</p></div>
              </div>

              {r.details && <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3 mb-3"><span className="text-xs font-medium text-foreground">Toelichting:</span> {r.details}</div>}

              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Ontvangen: {new Date(r.created_at).toLocaleString("nl-NL", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  {r.completed_at && <> · Afgerond: {new Date(r.completed_at).toLocaleString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}</>}
                </p>
                <div className="flex gap-2">
                  {r.status !== "completed" && (
                    <button onClick={() => updateStatus(r.id, "completed")} className="flex items-center gap-1 text-xs bg-green-100 text-green-800 hover:bg-green-200 rounded-lg px-3 py-1.5 font-medium transition-colors active:scale-[0.97]">
                      <Check size={14} /> Markeer als afgerond
                    </button>
                  )}
                  {(r.status === "pending" || r.status === "email_sent") && (
                    <button onClick={() => updateStatus(r.id, "rejected")} className="flex items-center gap-1 text-xs bg-red-100 text-red-800 hover:bg-red-200 rounded-lg px-3 py-1.5 font-medium transition-colors active:scale-[0.97]">
                      <X size={14} /> Wijs af
                    </button>
                  )}
                  {r.status !== "completed" && (
                    <button onClick={() => handleDeletePersonData(r)} disabled={processing === r.id} className="flex items-center gap-1 text-xs bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-lg px-3 py-1.5 font-medium transition-colors disabled:opacity-50 active:scale-[0.97]">
                      <UserX size={14} /> {processing === r.id ? "Bezig..." : "Data verwijderen"}
                    </button>
                  )}
                  <button onClick={() => handleDeleteRequest(r.id)} className="text-muted-foreground hover:text-destructive transition-colors p-1" title="Verzoek verwijderen"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════
// USERS MANAGEMENT
// ═══════════════════════════════════════

interface AuthUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
}

interface Profile {
  id: string;
  phone: string | null;
  display_name: string | null;
}

function UsersSection() {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPhone, setEditPhone] = useState("");
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteCopied, setInviteCopied] = useState(false);
  const [invites, setInvites] = useState<any[]>([]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setCurrentUserId(session.user.id);
      const [usersResponse, { data: profilesData }, { data: invitesData }] = await Promise.all([
        supabase.functions.invoke("manage-users", { method: "GET" }),
        supabase.from("profiles").select("*"),
        supabase.from("invite_tokens").select("*").order("created_at", { ascending: false }).limit(10),
      ]);
      if (usersResponse.data?.users) setUsers(usersResponse.data.users);
      if (profilesData) {
        const map: Record<string, Profile> = {};
        profilesData.forEach((p: Profile) => { map[p.id] = p; });
        setProfiles(map);
      }
      if (invitesData) setInvites(invitesData);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleGenerateInvite = async () => {
    setInviteLoading(true);
    setInviteCopied(false);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase.from("invite_tokens").insert({
      created_by: session.user.id,
    }).select().single();

    if (data && !error) {
      const url = `${window.location.origin}/register?token=${data.token}`;
      setInviteUrl(url);
      fetchUsers();
    }
    setInviteLoading(false);
  };

  const handleCopyInvite = async () => {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl);
    setInviteCopied(true);
    setTimeout(() => setInviteCopied(false), 3000);
  };

  const handleDeleteInvite = async (id: string) => {
    await supabase.from("invite_tokens").delete().eq("id", id);
    fetchUsers();
  };

  const handleDelete = async (userId: string, email: string) => {
    if (!confirm(`Weet je zeker dat je het account van ${email} wilt verwijderen? Dit kan niet ongedaan worden gemaakt.`)) return;
    setDeleting(userId);
    try {
      const { data, error } = await supabase.functions.invoke("manage-users", {
        method: "DELETE",
        body: { userId },
      });
      if (error) throw error;
      if (data?.error) {
        alert(data.error);
      } else {
        setUsers(prev => prev.filter(u => u.id !== userId));
      }
    } catch {
      alert("Er is een fout opgetreden bij het verwijderen.");
    } finally {
      setDeleting(null);
    }
  };

  const handleEdit = (userId: string) => {
    const profile = profiles[userId];
    setEditingId(userId);
    setEditPhone(profile?.phone || "");
    setEditName(profile?.display_name || "");
  };

  const handleSaveProfile = async () => {
    if (!editingId) return;
    setSaving(true);
    const existing = profiles[editingId];
    if (existing) {
      await supabase.from("profiles").update({
        phone: editPhone || null,
        display_name: editName || null,
        updated_at: new Date().toISOString(),
      }).eq("id", editingId);
    } else {
      await supabase.from("profiles").insert({
        id: editingId,
        phone: editPhone || null,
        display_name: editName || null,
      });
    }
    setEditingId(null);
    setSaving(false);
    fetchUsers();
  };

  if (loading) return <p className="text-muted-foreground text-sm text-center py-12">Laden...</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <SectionHeader title="Gebruikers" subtitle={`${users.length} admin-gebruiker(s). Registratie is alleen mogelijk via uitnodiging.`} />
        <button
          onClick={handleGenerateInvite}
          disabled={inviteLoading}
          className="flex items-center gap-2 bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 active:scale-[0.97] flex-shrink-0"
        >
          <Link2 size={16} /> {inviteLoading ? "Genereren..." : "Uitnodigingslink genereren"}
        </button>
      </div>

      {/* Generated invite URL */}
      {inviteUrl && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-primary mb-1">Uitnodigingslink (48 uur geldig)</p>
            <p className="text-sm text-foreground font-mono truncate">{inviteUrl}</p>
          </div>
          <button
            onClick={handleCopyInvite}
            className="flex items-center gap-1 bg-primary text-primary-foreground rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-primary/90 transition-colors active:scale-[0.97]"
          >
            <Copy size={14} /> {inviteCopied ? "Gekopieerd!" : "Kopiëren"}
          </button>
        </div>
      )}

      {/* Active invites */}
      {invites.length > 0 && (
        <div className="bg-background border border-border rounded-xl p-4">
          <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2"><Clock size={14} /> Uitnodigingen</h3>
          <div className="space-y-2">
            {invites.map(inv => {
              const isExpired = new Date(inv.expires_at) < new Date();
              const isUsed = !!inv.used_at;
              return (
                <div key={inv.id} className="flex items-center justify-between text-sm gap-2 py-1.5 border-b border-border last:border-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isUsed ? "bg-primary/10 text-primary" : isExpired ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"}`}>
                      {isUsed ? "Gebruikt" : isExpired ? "Verlopen" : "Actief"}
                    </span>
                    <span className="text-muted-foreground text-xs truncate font-mono">{inv.token.slice(0, 8)}...</span>
                    <span className="text-xs text-muted-foreground">
                      Verloopt: {new Date(inv.expires_at).toLocaleString("nl-NL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  {!isUsed && (
                    <button onClick={() => handleDeleteInvite(inv.id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={14} /></button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Users list */}
      {users.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-12">Geen gebruikers gevonden.</p>
      ) : (
        <div className="space-y-3">
          {users.map(u => {
            const profile = profiles[u.id];
            const isEditing = editingId === u.id;

            return (
              <div key={u.id} className="bg-background border border-border rounded-xl p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {profile?.display_name ? `${profile.display_name} · ` : ""}{u.email}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                      <span>Aangemaakt: {new Date(u.created_at).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}</span>
                      {u.last_sign_in_at && (
                        <span>Laatst ingelogd: {new Date(u.last_sign_in_at).toLocaleString("nl-NL", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                      )}
                      {profile?.phone ? (
                        <span className="text-primary">📱 {profile.phone}</span>
                      ) : (
                        <span className="text-muted-foreground/60">Geen telefoonnummer</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {u.id === currentUserId ? (
                      <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">Jij</span>
                    ) : null}
                    <button
                      onClick={() => isEditing ? setEditingId(null) : handleEdit(u.id)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    {u.id !== currentUserId && (
                      <button
                        onClick={() => handleDelete(u.id, u.email || "")}
                        disabled={deleting === u.id}
                        className="flex items-center gap-1 text-xs bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-lg px-3 py-1.5 font-medium transition-colors disabled:opacity-50 active:scale-[0.97]"
                      >
                        <Trash2 size={14} /> {deleting === u.id ? "Verwijderen..." : "Verwijderen"}
                      </button>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex flex-wrap gap-3 items-end pt-2 border-t border-border">
                    <div>
                      <label className="block text-xs font-medium mb-1">Naam</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Weergavenaam"
                        className="rounded-lg border border-input bg-background px-3 py-2 text-sm w-40"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Telefoonnummer (WhatsApp)</label>
                      <input
                        type="tel"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        placeholder="+31612345678"
                        className="rounded-lg border border-input bg-background px-3 py-2 text-sm w-44"
                      />
                    </div>
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="flex items-center gap-1 bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 active:scale-[0.97]"
                    >
                      <Check size={14} /> {saving ? "Opslaan..." : "Opslaan"}
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-muted-foreground hover:text-foreground transition-colors p-2"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
