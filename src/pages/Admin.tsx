import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Plus, Upload, LogOut, Save, Image, Calendar, Euro, X, Pencil, Check } from "lucide-react";

type Tab = "photos" | "calendar" | "pricing";

export default function Admin() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("photos");

  // Auth check
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) {
        navigate("/login");
      } else {
        setUser(session.user);
      }
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/login");
      else setUser(session.user);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p>Laden...</p></div>;
  if (!user) return null;

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "photos", label: "Foto's", icon: Image },
    { id: "calendar", label: "Kalender", icon: Calendar },
    { id: "pricing", label: "Prijzen", icon: Euro },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="font-serif text-xl">Casa Valencia Admin</h1>
          <a href="/" className="text-xs text-muted-foreground hover:text-primary">← Website</a>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <LogOut size={16} /> Uitloggen
        </button>
      </header>

      {/* Tabs */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t.id ? "bg-primary text-primary-foreground" : "bg-card hover:bg-accent"
              }`}
            >
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>

        {tab === "photos" && <PhotosTab />}
        {tab === "calendar" && <CalendarTab />}
        {tab === "pricing" && <PricingTab />}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// PHOTOS TAB
// ═══════════════════════════════════════

const CATEGORIES = [
  { id: "hero", label: "Hero (hoofdbeeld)" },
  { id: "room", label: "De Kamer" },
  { id: "bathroom", label: "De Badkamer" },
  { id: "kitchen", label: "De Buitenkeuken" },
  { id: "host", label: "Host foto" },
];

function PhotosTab() {
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
      if (uploadError) { console.error(uploadError); continue; }

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
    // Extract path from URL
    const url = new URL(photo.url);
    const pathParts = url.pathname.split("/storage/v1/object/public/photos/");
    if (pathParts[1]) {
      await supabase.storage.from("photos").remove([pathParts[1]]);
    }
    await supabase.from("site_photos").delete().eq("id", photo.id);
    fetchPhotos();
  };

  const handleSetPrimary = async (photo: any) => {
    // Unset all primary for this category
    await supabase.from("site_photos").update({ is_primary: false }).eq("category", photo.category);
    await supabase.from("site_photos").update({ is_primary: true }).eq("id", photo.id);
    fetchPhotos();
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
        >
          {CATEGORIES.map(c => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
        <label className="flex items-center gap-2 bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium cursor-pointer hover:bg-primary/90 transition-colors">
          <Upload size={16} />
          {uploading ? "Uploaden..." : "Foto's uploaden"}
          <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      {CATEGORIES.map(cat => {
        const catPhotos = photos.filter(p => p.category === cat.id);
        if (catPhotos.length === 0) return null;
        return (
          <div key={cat.id} className="mb-8">
            <h3 className="font-serif text-lg mb-3">{cat.label}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {catPhotos.map(photo => (
                <div key={photo.id} className="relative group rounded-xl overflow-hidden bg-muted aspect-[4/3]">
                  <img src={photo.url} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    {!photo.is_primary && (
                      <button
                        onClick={() => handleSetPrimary(photo)}
                        className="bg-background/90 rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-background transition-colors"
                      >
                        Hoofdfoto
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(photo)}
                      className="bg-destructive/90 text-destructive-foreground rounded-lg p-2 hover:bg-destructive transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  {photo.is_primary && (
                    <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-md">
                      Hoofdfoto
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {photos.length === 0 && (
        <p className="text-muted-foreground text-sm text-center py-12">
          Nog geen foto's geüpload. Kies een categorie en upload je eerste foto.
        </p>
      )}
    </div>
  );
}

// ═══════════════════════════════════════
// CALENDAR TAB
// ═══════════════════════════════════════

function CalendarTab() {
  const [blockedDates, setBlockedDates] = useState<any[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

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
    setStartDate("");
    setEndDate("");
    setReason("");
    setSaving(false);
    fetchBlocked();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("blocked_dates").delete().eq("id", id);
    fetchBlocked();
  };

  return (
    <div>
      <h3 className="font-serif text-lg mb-4">Geblokkeerde periodes</h3>
      <form onSubmit={handleAdd} className="bg-card rounded-xl p-4 shadow-sm mb-6 flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-xs font-medium mb-1">Startdatum</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" required />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Einddatum</label>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" required />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Reden (optioneel)</label>
          <input type="text" value={reason} onChange={e => setReason(e.target.value)} placeholder="bijv. Bezet, Privé" className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        </div>
        <button type="submit" disabled={saving} className="flex items-center gap-1 bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
          <Plus size={16} /> Toevoegen
        </button>
      </form>

      <div className="space-y-2">
        {blockedDates.map(b => (
          <div key={b.id} className="bg-card rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-sm font-medium">{b.start_date} → {b.end_date}</span>
              {b.reason && <span className="text-sm text-muted-foreground ml-3">{b.reason}</span>}
            </div>
            <button onClick={() => handleDelete(b.id)} className="text-destructive hover:text-destructive/80 transition-colors">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {blockedDates.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">Geen geblokkeerde periodes.</p>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// PRICING TAB
// ═══════════════════════════════════════

function PricingTab() {
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
    await supabase.from("seasonal_pricing").insert({
      label: newSeasonal.label,
      label_en: newSeasonal.label_en,
      start_date: newSeasonal.start_date,
      end_date: newSeasonal.end_date,
      price_per_night: Number(newSeasonal.price_per_night),
    });
    setNewSeasonal({ label: "", label_en: "", start_date: "", end_date: "", price_per_night: "" });
    fetchAll();
  };

  const handleDeleteSeasonal = async (id: string) => {
    await supabase.from("seasonal_pricing").delete().eq("id", id);
    fetchAll();
  };

  const handleEditSeasonal = (s: any) => {
    setEditingSeasonalId(s.id);
    setEditingSeasonal({ label: s.label, label_en: s.label_en || "", start_date: s.start_date, end_date: s.end_date, price_per_night: s.price_per_night });
  };

  const handleSaveSeasonal = async () => {
    if (!editingSeasonalId || !editingSeasonal) return;
    await supabase.from("seasonal_pricing").update({
      label: editingSeasonal.label,
      label_en: editingSeasonal.label_en,
      start_date: editingSeasonal.start_date,
      end_date: editingSeasonal.end_date,
      price_per_night: Number(editingSeasonal.price_per_night),
    }).eq("id", editingSeasonalId);
    setEditingSeasonalId(null);
    setEditingSeasonal(null);
    fetchAll();
  };

  const handleAddCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from("custom_pricing").insert({
      label: newCustom.label,
      start_date: newCustom.start_date,
      end_date: newCustom.end_date,
      price_per_night: Number(newCustom.price_per_night),
    });
    setNewCustom({ label: "", start_date: "", end_date: "", price_per_night: "" });
    fetchAll();
  };

  const handleDeleteCustom = async (id: string) => {
    await supabase.from("custom_pricing").delete().eq("id", id);
    fetchAll();
  };

  const handleEditCustom = (c: any) => {
    setEditingCustomId(c.id);
    setEditingCustom({ label: c.label, start_date: c.start_date, end_date: c.end_date, price_per_night: c.price_per_night });
  };

  const handleSaveCustom = async () => {
    if (!editingCustomId || !editingCustom) return;
    await supabase.from("custom_pricing").update({
      label: editingCustom.label,
      start_date: editingCustom.start_date,
      end_date: editingCustom.end_date,
      price_per_night: Number(editingCustom.price_per_night),
    }).eq("id", editingCustomId);
    setEditingCustomId(null);
    setEditingCustom(null);
    fetchAll();
  };

  if (!config) return <p className="text-muted-foreground text-sm">Laden...</p>;

  return (
    <div className="space-y-8">
      {/* General config */}
      <div className="bg-card rounded-xl p-6 shadow-sm">
        <h3 className="font-serif text-lg mb-4">Algemene instellingen</h3>
        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          {[
            { key: "default_price_per_night", label: "Standaardprijs per nacht (€)" },
            { key: "cleaning_fee", label: "Schoonmaakkosten (€)" },
            { key: "minimum_stay", label: "Minimaal verblijf (nachten)" },
            { key: "maximum_stay", label: "Maximaal verblijf (nachten)" },
            { key: "weekly_discount", label: "Weekkorting (%)" },
            { key: "monthly_discount", label: "Maandkorting (%)" },
          ].map(field => (
            <div key={field.key}>
              <label className="block text-xs font-medium mb-1">{field.label}</label>
              <input
                type="number"
                value={config[field.key]}
                onChange={e => setConfig({ ...config, [field.key]: Number(e.target.value) })}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          ))}
        </div>
        <button onClick={handleSaveConfig} disabled={saving} className="flex items-center gap-2 bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
          <Save size={16} /> {saving ? "Opslaan..." : "Opslaan"}
        </button>
      </div>

      {/* Seasonal pricing */}
      <div className="bg-card rounded-xl p-6 shadow-sm">
        <h3 className="font-serif text-lg mb-4">Seizoensprijzen</h3>
        <div className="space-y-2 mb-4">
          {seasonal.map(s => (
            <div key={s.id} className="flex items-center justify-between bg-accent/30 rounded-lg p-3">
              <div className="text-sm">
                <span className="font-medium">{s.label}</span>
                <span className="text-muted-foreground ml-2">{s.start_date} → {s.end_date}</span>
                <span className="ml-2 font-medium">€{s.price_per_night}/nacht</span>
              </div>
              <button onClick={() => handleDeleteSeasonal(s.id)} className="text-destructive hover:text-destructive/80"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
        <form onSubmit={handleAddSeasonal} className="flex flex-wrap gap-2 items-end">
          <div>
            <label className="block text-xs font-medium mb-1">Label (NL)</label>
            <input type="text" value={newSeasonal.label} onChange={e => setNewSeasonal({ ...newSeasonal, label: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" required />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Label (EN)</label>
            <input type="text" value={newSeasonal.label_en} onChange={e => setNewSeasonal({ ...newSeasonal, label_en: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Start</label>
            <input type="date" value={newSeasonal.start_date} onChange={e => setNewSeasonal({ ...newSeasonal, start_date: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" required />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Eind</label>
            <input type="date" value={newSeasonal.end_date} onChange={e => setNewSeasonal({ ...newSeasonal, end_date: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" required />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">€/nacht</label>
            <input type="number" value={newSeasonal.price_per_night} onChange={e => setNewSeasonal({ ...newSeasonal, price_per_night: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm w-24" required />
          </div>
          <button type="submit" className="flex items-center gap-1 bg-primary text-primary-foreground rounded-lg px-3 py-2 text-sm font-medium hover:bg-primary/90"><Plus size={14} /> Toevoegen</button>
        </form>
      </div>

      {/* Custom pricing */}
      <div className="bg-card rounded-xl p-6 shadow-sm">
        <h3 className="font-serif text-lg mb-4">Speciale periodes</h3>
        <div className="space-y-2 mb-4">
          {custom.map(c => (
            <div key={c.id} className="flex items-center justify-between bg-accent/30 rounded-lg p-3">
              <div className="text-sm">
                <span className="font-medium">{c.label}</span>
                <span className="text-muted-foreground ml-2">{c.start_date} → {c.end_date}</span>
                <span className="ml-2 font-medium">€{c.price_per_night}/nacht</span>
              </div>
              <button onClick={() => handleDeleteCustom(c.id)} className="text-destructive hover:text-destructive/80"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
        <form onSubmit={handleAddCustom} className="flex flex-wrap gap-2 items-end">
          <div>
            <label className="block text-xs font-medium mb-1">Label</label>
            <input type="text" value={newCustom.label} onChange={e => setNewCustom({ ...newCustom, label: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" required />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Start</label>
            <input type="date" value={newCustom.start_date} onChange={e => setNewCustom({ ...newCustom, start_date: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" required />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Eind</label>
            <input type="date" value={newCustom.end_date} onChange={e => setNewCustom({ ...newCustom, end_date: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" required />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">€/nacht</label>
            <input type="number" value={newCustom.price_per_night} onChange={e => setNewCustom({ ...newCustom, price_per_night: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm w-24" required />
          </div>
          <button type="submit" className="flex items-center gap-1 bg-primary text-primary-foreground rounded-lg px-3 py-2 text-sm font-medium hover:bg-primary/90"><Plus size={14} /> Toevoegen</button>
        </form>
      </div>
    </div>
  );
}
