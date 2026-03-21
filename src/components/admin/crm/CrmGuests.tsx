import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus, Search, CheckCircle, XCircle, ArrowDownLeft, ArrowUpRight,
  Trash2, ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";
import type { CrmGuest, CrmMessage } from "./types";

const AVATAR_COLORS = [
  "bg-blue-500", "bg-emerald-500", "bg-purple-500", "bg-amber-500",
  "bg-rose-500", "bg-cyan-500", "bg-orange-500", "bg-pink-500",
];
function getInitials(name: string) { return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2); }
function getAvatarColor(name: string) { return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]; }

interface GuestWithConversations extends CrmGuest {
  crm_conversations: { id: string; last_message_at: string | null; unread_count: number }[];
}

export function CrmGuests() {
  const [, setSearchParams] = useSearchParams();
  const [guests, setGuests] = useState<GuestWithConversations[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<GuestWithConversations | null>(null);

  const fetchGuests = useCallback(async () => {
    const { data } = await supabase
      .from("crm_guests")
      .select("*, crm_conversations(id, last_message_at, unread_count)")
      .order("updated_at", { ascending: false });
    if (data) setGuests(data as unknown as GuestWithConversations[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchGuests(); }, [fetchGuests]);

  const filtered = guests.filter(g => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return g.name.toLowerCase().includes(q) || g.phone_e164.includes(q) || (g.email?.toLowerCase().includes(q) ?? false);
  });

  const lastMessageTime = (g: GuestWithConversations) => {
    const convs = g.crm_conversations || [];
    const latest = convs.filter(c => c.last_message_at).sort((a, b) => new Date(b.last_message_at!).getTime() - new Date(a.last_message_at!).getTime())[0];
    if (!latest?.last_message_at) return t('common.noMessages');
    const d = new Date(latest.last_message_at);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
    if (diffDays === 0) return d.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
    if (diffDays === 1) return t('common.yesterday');
    return d.toLocaleDateString("nl-NL", { day: "numeric", month: "short" });
  };

  if (loading) return <p className="text-muted-foreground text-sm">{t('common.loading')}</p>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-semibold text-foreground">{t('crm.guests')}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{guests.length} gasten totaal</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={t('common.search')} className="pl-9 w-56" />
          </div>
          <Button onClick={() => setShowAddDialog(true)} size="sm">
            <Plus className="w-4 h-4 mr-1" /> {t('crm.addGuest')}
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-12">{searchQuery ? "Geen resultaten." : t('crm.noGuests')}</p>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('common.name')}</TableHead>
                <TableHead>{t('common.language')}</TableHead>
                <TableHead>{t('common.email')}</TableHead>
                <TableHead>{t('common.marketing')}</TableHead>
                <TableHead>{t('common.lastMessage')}</TableHead>
                <TableHead className="text-right">{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(guest => (
                <TableRow key={guest.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0", getAvatarColor(guest.name))}>
                        {getInitials(guest.name)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{guest.name}</p>
                        <p className="text-xs text-muted-foreground">{guest.phone_e164}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{(guest.language || "nl").toUpperCase()}</Badge></TableCell>
                  <TableCell className="text-sm">{guest.email || "—"}</TableCell>
                  <TableCell>
                    {guest.opted_in_marketing
                      ? <CheckCircle className="w-4 h-4 text-green-600" />
                      : <XCircle className="w-4 h-4 text-muted-foreground/40" />}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{lastMessageTime(guest)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedGuest(guest)}>{t('common.view')}</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AddGuestDialog open={showAddDialog} onOpenChange={setShowAddDialog} onAdded={fetchGuests} />

      {selectedGuest && (
        <GuestDetailSheet
          guest={selectedGuest}
          open={!!selectedGuest}
          onOpenChange={open => { if (!open) setSelectedGuest(null); }}
          onUpdated={fetchGuests}
          onNavigateToInbox={() => setSearchParams({ section: "crm-inbox" })}
        />
      )}
    </div>
  );
}

// ======== ADD GUEST DIALOG ========

function AddGuestDialog({ open, onOpenChange, onAdded }: { open: boolean; onOpenChange: (o: boolean) => void; onAdded: () => void }) {
  const [form, setForm] = useState({ name: "", phone_e164: "", email: "", language: "nl", notes: "" });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (form.name.length < 2 || !form.phone_e164.startsWith("+") || form.phone_e164.length < 10) {
      toast.error("Vul een geldige naam en telefoonnummer in (E.164 formaat)");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("crm_guests").insert({
      name: form.name,
      phone_e164: form.phone_e164,
      email: form.email || null,
      language: form.language,
      notes: form.notes || null,
    });
    if (error) {
      toast.error(error.message.includes("unique") ? "Dit telefoonnummer bestaat al" : error.message);
    } else {
      toast.success(t('crm.guestAdded'));
      setForm({ name: "", phone_e164: "", email: "", language: "nl", notes: "" });
      onOpenChange(false);
      onAdded();
    }
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>{t('crm.addGuest')}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t('common.name')} *</Label>
            <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Jan de Vries" />
          </div>
          <div className="space-y-2">
            <Label>{t('common.phone')} * (E.164)</Label>
            <Input value={form.phone_e164} onChange={e => setForm({ ...form, phone_e164: e.target.value })} placeholder="+31612345678" className="font-mono" />
          </div>
          <div className="space-y-2">
            <Label>{t('common.email')}</Label>
            <Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="jan@example.com" type="email" />
          </div>
          <div className="space-y-2">
            <Label>{t('common.language')}</Label>
            <Select value={form.language} onValueChange={v => setForm({ ...form, language: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="nl">NL</SelectItem>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="es">ES</SelectItem>
                <SelectItem value="de">DE</SelectItem>
                <SelectItem value="fr">FR</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t('common.notes')}</Label>
            <Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Optionele notities..." />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t('common.cancel')}</Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? t('common.loading') : t('common.save')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ======== GUEST DETAIL SHEET ========

function GuestDetailSheet({
  guest, open, onOpenChange, onUpdated, onNavigateToInbox,
}: {
  guest: GuestWithConversations;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onUpdated: () => void;
  onNavigateToInbox: () => void;
}) {
  const [form, setForm] = useState({
    name: guest.name,
    phone_e164: guest.phone_e164,
    email: guest.email || "",
    language: guest.language || "nl",
    notes: guest.notes || "",
    opted_in_marketing: guest.opted_in_marketing,
  });
  const [saving, setSaving] = useState(false);
  const [messages, setMessages] = useState<CrmMessage[]>([]);

  useEffect(() => {
    setForm({
      name: guest.name,
      phone_e164: guest.phone_e164,
      email: guest.email || "",
      language: guest.language || "nl",
      notes: guest.notes || "",
      opted_in_marketing: guest.opted_in_marketing,
    });
    // Fetch messages
    supabase
      .from("crm_messages")
      .select("*, conversation:crm_conversations!inner(guest_id)")
      .eq("crm_conversations.guest_id", guest.id)
      .order("sent_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (data) setMessages(data as unknown as CrmMessage[]);
      });
  }, [guest.id, guest.name, guest.phone_e164, guest.email, guest.language, guest.notes, guest.opted_in_marketing]);

  const handleSave = async () => {
    setSaving(true);
    await supabase.from("crm_guests").update({
      name: form.name,
      phone_e164: form.phone_e164,
      email: form.email || null,
      language: form.language,
      notes: form.notes || null,
      opted_in_marketing: form.opted_in_marketing,
      opted_in_at: form.opted_in_marketing && !guest.opted_in_marketing ? new Date().toISOString() : guest.opted_in_at,
      updated_at: new Date().toISOString(),
    }).eq("id", guest.id);
    setSaving(false);
    toast.success(t('crm.profileSaved'));
    onUpdated();
  };

  const handleDelete = async () => {
    await supabase.from("crm_guests").delete().eq("id", guest.id);
    toast.success(t('crm.guestDeleted'));
    onOpenChange(false);
    onUpdated();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[480px] p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4">
          <div className="flex items-center gap-4">
            <div className={cn("w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-semibold", getAvatarColor(guest.name))}>
              {getInitials(guest.name)}
            </div>
            <div>
              <SheetTitle className="text-lg">{guest.name}</SheetTitle>
              <p className="text-sm text-muted-foreground">{guest.phone_e164}</p>
              <Badge variant="outline" className="mt-1 text-xs">{(guest.language || "nl").toUpperCase()}</Badge>
            </div>
          </div>
          <Button variant="outline" size="sm" className="mt-3" onClick={onNavigateToInbox}>
            <ExternalLink className="w-3 h-3 mr-1" /> {t('crm.openConversation')}
          </Button>
        </SheetHeader>

        <Tabs defaultValue="profile" className="flex-1 flex flex-col">
          <TabsList className="mx-6">
            <TabsTrigger value="profile">{t('common.profile')}</TabsTrigger>
            <TabsTrigger value="messages">{t('common.messages')}</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="flex-1 overflow-auto">
            <ScrollArea className="h-full">
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label>{t('common.name')}</Label>
                  <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>{t('common.phone')}</Label>
                  <Input value={form.phone_e164} onChange={e => setForm({ ...form, phone_e164: e.target.value })} className="font-mono" />
                </div>
                <div className="space-y-2">
                  <Label>{t('common.email')}</Label>
                  <Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} type="email" />
                </div>
                <div className="space-y-2">
                  <Label>{t('common.language')}</Label>
                  <Select value={form.language} onValueChange={v => setForm({ ...form, language: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nl">NL</SelectItem>
                      <SelectItem value="en">EN</SelectItem>
                      <SelectItem value="es">ES</SelectItem>
                      <SelectItem value="de">DE</SelectItem>
                      <SelectItem value="fr">FR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t('common.notes')}</Label>
                  <Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="min-h-[80px] resize-none" />
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={form.opted_in_marketing} onCheckedChange={v => setForm({ ...form, opted_in_marketing: v })} />
                  <Label>Marketing opt-in</Label>
                </div>

                <Button onClick={handleSave} disabled={saving} className="w-full">{saving ? t('common.loading') : t('common.save')}</Button>

                <Separator />

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="w-full">
                      <Trash2 className="w-4 h-4 mr-1" /> {t('crm.deleteGuest')}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('crm.deleteGuest')}</AlertDialogTitle>
                      <AlertDialogDescription>{t('crm.deleteGuestConfirm')}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>{t('common.delete')}</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="messages" className="flex-1 overflow-auto">
            <ScrollArea className="h-full">
              <div className="p-6">
                {messages.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">{t('common.noMessages')}</p>
                ) : (
                  <div className="space-y-2">
                    {messages.map(msg => (
                      <div key={msg.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50">
                        {msg.direction === "inbound"
                          ? <ArrowDownLeft className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          : <ArrowUpRight className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm truncate">{msg.content || `[${msg.message_type}]`}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-muted-foreground">
                              {new Date(msg.sent_at).toLocaleString("nl-NL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                            </span>
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">{msg.status}</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
