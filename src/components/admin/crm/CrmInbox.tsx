import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  MessageCircle, Send, Check, CheckCheck, AlertCircle,
  User, FileText, Search, Clock, Phone, Image as ImageIcon,
  File, Mic, MapPin, List, X,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { CrmConversation, CrmMessage, CrmGuest, CrmTemplate } from "./types";

const AVATAR_COLORS = [
  "bg-blue-500", "bg-emerald-500", "bg-purple-500", "bg-amber-500",
  "bg-rose-500", "bg-cyan-500", "bg-orange-500", "bg-pink-500",
];

function getInitials(name: string) {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

function getAvatarColor(name: string) {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays === 0) return d.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
  if (diffDays === 1) return "gisteren";
  return d.toLocaleDateString("nl-NL", { day: "numeric", month: "short" });
}

function formatDateSeparator(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays === 0) return "Vandaag";
  if (diffDays === 1) return "Gisteren";
  return d.toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long" });
}

// ======== MAIN COMPONENT ========

export function CrmInbox() {
  const [conversations, setConversations] = useState<CrmConversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showGuestPanel, setShowGuestPanel] = useState(true);

  const fetchConversations = useCallback(async () => {
    const { data } = await supabase
      .from("crm_conversations")
      .select("*, guest:crm_guests(*)")
      .order("last_message_at", { ascending: false });
    if (data) setConversations(data as unknown as CrmConversation[]);
  }, []);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  // Realtime on conversations
  useEffect(() => {
    const channel = supabase
      .channel("crm-conversations-list")
      .on("postgres_changes", { event: "*", schema: "public", table: "crm_conversations" }, () => {
        fetchConversations();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchConversations]);

  const selected = conversations.find(c => c.id === selectedId) || null;

  const filtered = conversations.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return c.guest.name.toLowerCase().includes(q) || c.guest.phone_e164.includes(q);
  });

  const handleSelect = async (conv: CrmConversation) => {
    setSelectedId(conv.id);
    if (conv.unread_count > 0) {
      await supabase.from("crm_conversations").update({ unread_count: 0 }).eq("id", conv.id);
    }
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Left: Conversation list */}
      <div className="w-80 flex-shrink-0 border-r border-border flex flex-col bg-background">
        <div className="p-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Zoek gesprekken..."
              className="pl-9"
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          {filtered.length === 0 && (
            <div className="p-6 text-center">
              <MessageCircle className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "Geen resultaten." : "Nog geen gesprekken. Conversaties verschijnen automatisch wanneer gasten je via WhatsApp berichten."}
              </p>
            </div>
          )}
          {filtered.map(conv => (
            <button
              key={conv.id}
              onClick={() => handleSelect(conv)}
              className={cn(
                "w-full text-left px-3 py-3 border-b border-border/50 hover:bg-muted/50 transition-colors flex items-center gap-3",
                selectedId === conv.id && "bg-primary/10 border-l-2 border-l-primary"
              )}
            >
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0", getAvatarColor(conv.guest.name))}>
                {getInitials(conv.guest.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium truncate">{conv.guest.name}</span>
                  <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                    {conv.last_message_at ? formatTime(conv.last_message_at) : ""}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-xs text-muted-foreground truncate">{conv.guest.phone_e164}</span>
                  {conv.unread_count > 0 && (
                    <span className="ml-2 flex-shrink-0 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                      {conv.unread_count}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </ScrollArea>
      </div>

      {/* Middle: Chat */}
      {selected ? (
        <ChatWindow
          conversation={selected}
          showGuestPanel={showGuestPanel}
          onToggleGuestPanel={() => setShowGuestPanel(!showGuestPanel)}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-muted/20">
          <div className="text-center">
            <MessageCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-base font-medium text-muted-foreground">Selecteer een gesprek</p>
            <p className="text-sm text-muted-foreground/70 mt-1">Kies een conversatie uit de lijst om te beginnen.</p>
          </div>
        </div>
      )}

      {/* Right: Guest panel */}
      {selected && showGuestPanel && (
        <GuestPanel guest={selected.guest} />
      )}
    </div>
  );
}

// ======== CHAT WINDOW ========

function ChatWindow({
  conversation,
  showGuestPanel,
  onToggleGuestPanel,
}: {
  conversation: CrmConversation;
  showGuestPanel: boolean;
  onToggleGuestPanel: () => void;
}) {
  const [messages, setMessages] = useState<CrmMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {
    const { data } = await supabase
      .from("crm_messages")
      .select("*")
      .eq("conversation_id", conversation.id)
      .order("sent_at", { ascending: true });
    if (data) setMessages(data as unknown as CrmMessage[]);
  }, [conversation.id]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  // Realtime
  useEffect(() => {
    const channel = supabase
      .channel(`crm-msgs-${conversation.id}`)
      .on("postgres_changes", {
        event: "INSERT", schema: "public", table: "crm_messages",
        filter: `conversation_id=eq.${conversation.id}`,
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as CrmMessage]);
      })
      .on("postgres_changes", {
        event: "UPDATE", schema: "public", table: "crm_messages",
        filter: `conversation_id=eq.${conversation.id}`,
      }, (payload) => {
        setMessages(prev => prev.map(m => m.id === (payload.new as CrmMessage).id ? { ...m, ...payload.new } as CrmMessage : m));
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [conversation.id]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const windowOpen = conversation.csw_expires_at && new Date(conversation.csw_expires_at) > new Date();
  const remainingMs = windowOpen ? new Date(conversation.csw_expires_at!).getTime() - Date.now() : 0;
  const remainingHours = Math.floor(remainingMs / 3600000);
  const remainingMinutes = Math.floor((remainingMs % 3600000) / 60000);

  const sendMessage = async () => {
    const text = inputText.trim();
    if (!text || sending) return;

    if (!windowOpen) {
      setShowTemplateDialog(true);
      return;
    }

    setSending(true);
    const { data: newMsg } = await supabase
      .from("crm_messages")
      .insert({
        conversation_id: conversation.id,
        direction: "outbound" as const,
        message_type: "text",
        content: text,
        status: "pending" as const,
      })
      .select()
      .single();

    if (newMsg) {
      const { error } = await supabase.functions.invoke("wa-send-message", {
        body: {
          to: conversation.guest.phone_e164,
          type: "text",
          content: text,
          message_id: newMsg.id,
        },
      });
      if (error) toast.error("Bericht kon niet worden verstuurd");

      await supabase.from("crm_conversations").update({
        last_message_at: new Date().toISOString(),
      }).eq("id", conversation.id);
    }

    setInputText("");
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Group messages by date
  const groupedMessages: { date: string; messages: CrmMessage[] }[] = [];
  messages.forEach(msg => {
    const dateKey = new Date(msg.sent_at).toDateString();
    const last = groupedMessages[groupedMessages.length - 1];
    if (last && last.date === dateKey) {
      last.messages.push(msg);
    } else {
      groupedMessages.push({ date: dateKey, messages: [msg] });
    }
  });

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Chat header */}
      <div className="h-14 border-b border-border flex items-center justify-between px-4 bg-background flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{conversation.guest.name}</span>
          <Badge variant="outline" className="text-xs">WhatsApp</Badge>
        </div>
        <div className="flex items-center gap-2">
          {windowOpen ? (
            <Badge variant="secondary" className="text-xs gap-1">
              <Clock className="w-3 h-3" />
              <span className="text-green-600">Venster open</span>
              <span className="text-muted-foreground">{remainingHours}u {remainingMinutes}m</span>
            </Badge>
          ) : (
            <Badge variant="destructive" className="text-xs">Venster gesloten</Badge>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onToggleGuestPanel}>
            <User className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowTemplateDialog(true)}>
            <FileText className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        {groupedMessages.map((group) => (
          <div key={group.date}>
            <div className="flex items-center justify-center my-4">
              <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                {formatDateSeparator(group.messages[0].sent_at)}
              </span>
            </div>
            {group.messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-border h-16 flex items-center gap-3 px-4 bg-background flex-shrink-0">
        <Input
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Typ een bericht..."
          className="flex-1"
          disabled={sending}
        />
        <Button
          onClick={sendMessage}
          disabled={!inputText.trim() || sending}
          size="icon"
          className="rounded-lg flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {/* Template dialog */}
      <TemplateDialog
        open={showTemplateDialog}
        onOpenChange={setShowTemplateDialog}
        conversation={conversation}
      />
    </div>
  );
}

// ======== MESSAGE BUBBLE ========

function MessageBubble({ message }: { message: CrmMessage }) {
  const isInbound = message.direction === "inbound";
  const time = new Date(message.sent_at).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });

  const nonTextContent = () => {
    switch (message.message_type) {
      case "image": return <span className="flex items-center gap-1.5"><ImageIcon className="w-4 h-4" /> {message.content || "Afbeelding"}</span>;
      case "document": return <span className="flex items-center gap-1.5"><File className="w-4 h-4" /> {(message.metadata as any)?.filename || message.content || "Document"}</span>;
      case "audio": return <span className="flex items-center gap-1.5"><Mic className="w-4 h-4" /> Spraakbericht</span>;
      case "location": return <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {(message.metadata as any)?.address || message.content}</span>;
      case "interactive": return <span className="flex items-center gap-1.5"><List className="w-4 h-4" /> {message.content}</span>;
      case "template": return <span className="flex items-center gap-1.5"><FileText className="w-4 h-4" /> {message.content}</span>;
      default: return null;
    }
  };

  const statusIcon = () => {
    if (isInbound) return null;
    switch (message.status) {
      case "pending": return <Clock className="w-3 h-3 text-muted-foreground" />;
      case "sent": return <Check className="w-3 h-3 text-muted-foreground" />;
      case "delivered": return <CheckCheck className="w-3 h-3 text-muted-foreground" />;
      case "read": return <CheckCheck className="w-3 h-3 text-blue-500" />;
      case "failed": return <AlertCircle className="w-3 h-3 text-destructive" />;
      default: return null;
    }
  };

  return (
    <div className={cn("flex mb-2", isInbound ? "justify-start" : "justify-end")}>
      <div className={cn(
        "max-w-[70%] rounded-2xl px-3 py-2 animate-in fade-in slide-in-from-bottom-2 duration-200",
        isInbound
          ? "bg-muted text-foreground rounded-bl-md"
          : "bg-primary text-primary-foreground rounded-br-md"
      )}>
        {message.message_type === "text" ? (
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        ) : (
          <div className={cn("text-sm", !isInbound && "text-primary-foreground/90")}>{nonTextContent()}</div>
        )}
        <div className={cn("flex items-center gap-1 mt-1 justify-end", isInbound ? "text-muted-foreground" : "text-primary-foreground/70")}>
          <span className="text-[10px]">{time}</span>
          {statusIcon()}
        </div>
      </div>
    </div>
  );
}

// ======== TEMPLATE DIALOG ========

function TemplateDialog({
  open,
  onOpenChange,
  conversation,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversation: CrmConversation;
}) {
  const [templates, setTemplates] = useState<CrmTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<CrmTemplate | null>(null);
  const [variables, setVariables] = useState<string[]>([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!open) return;
    supabase
      .from("crm_templates")
      .select("*")
      .eq("status", "approved")
      .then(({ data }) => {
        if (data) setTemplates(data as unknown as CrmTemplate[]);
      });
  }, [open]);

  const handleSelectTemplate = (t: CrmTemplate) => {
    setSelectedTemplate(t);
    // Count variables like {{1}}, {{2}}
    const matches = t.body_text?.match(/\{\{\d+\}\}/g) || [];
    setVariables(new Array(matches.length).fill(""));
  };

  const handleSend = async () => {
    if (!selectedTemplate) return;
    setSending(true);

    const { data: newMsg } = await supabase
      .from("crm_messages")
      .insert({
        conversation_id: conversation.id,
        direction: "outbound" as const,
        message_type: "template",
        content: `[Template: ${selectedTemplate.template_name}]`,
        metadata: {
          template_name: selectedTemplate.template_name,
          language: selectedTemplate.language,
          variables,
        },
        status: "pending" as const,
      })
      .select()
      .single();

    if (newMsg) {
      const { error } = await supabase.functions.invoke("wa-send-message", {
        body: {
          to: conversation.guest.phone_e164,
          type: "template",
          template_name: selectedTemplate.template_name,
          template_language: selectedTemplate.language,
          template_variables: variables.length > 0 ? variables : undefined,
          message_id: newMsg.id,
        },
      });

      if (error) {
        toast.error("Template kon niet worden verstuurd");
      } else {
        toast.success("Template verstuurd");
        onOpenChange(false);
      }

      await supabase.from("crm_conversations").update({
        last_message_at: new Date().toISOString(),
      }).eq("id", conversation.id);
    }

    setSending(false);
    setSelectedTemplate(null);
    setVariables([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Template versturen</DialogTitle>
        </DialogHeader>

        {!selectedTemplate ? (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {templates.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">
                Geen goedgekeurde templates gevonden. Voeg templates toe via het Templates-scherm.
              </p>
            )}
            {templates.map(t => (
              <button
                key={t.id}
                onClick={() => handleSelectTemplate(t)}
                className="w-full text-left p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">{t.template_name}</span>
                  <Badge variant="outline" className="text-xs">{t.category}</Badge>
                </div>
                {t.body_text && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{t.body_text}</p>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-1">{selectedTemplate.template_name}</p>
              <p className="text-xs text-muted-foreground">{selectedTemplate.body_text}</p>
            </div>
            {variables.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Variabelen</p>
                {variables.map((v, i) => (
                  <Input
                    key={i}
                    value={v}
                    onChange={e => {
                      const next = [...variables];
                      next[i] = e.target.value;
                      setVariables(next);
                    }}
                    placeholder={`Variabele {{${i + 1}}}`}
                  />
                ))}
              </div>
            )}
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => { setSelectedTemplate(null); setVariables([]); }}>Terug</Button>
              <Button onClick={handleSend} disabled={sending}>{sending ? "Versturen..." : "Versturen"}</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ======== GUEST PANEL ========

function GuestPanel({ guest }: { guest: CrmGuest }) {
  const [notes, setNotes] = useState(guest.notes || "");
  const [saved, setSaved] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setNotes(guest.notes || "");
  }, [guest.id, guest.notes]);

  const handleNotesChange = (value: string) => {
    setNotes(value);
    setSaved(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      await supabase.from("crm_guests").update({ notes: value }).eq("id", guest.id);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 1000);
  };

  return (
    <div className="w-72 flex-shrink-0 border-l border-border bg-background flex flex-col">
      <ScrollArea className="flex-1 p-4">
        {/* Header */}
        <div className="text-center mb-4">
          <div className={cn("w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-semibold mx-auto mb-2", getAvatarColor(guest.name))}>
            {getInitials(guest.name)}
          </div>
          <p className="font-semibold text-foreground">{guest.name}</p>
          <a href={`tel:${guest.phone_e164}`} className="text-sm text-primary hover:underline flex items-center justify-center gap-1 mt-0.5">
            <Phone className="w-3 h-3" />
            {guest.phone_e164}
          </a>
          <Badge variant="outline" className="mt-2 text-xs">{guest.language?.toUpperCase() || "NL"}</Badge>
        </div>

        <Separator className="my-4" />

        {/* Details */}
        <div className="space-y-3 text-sm">
          <div>
            <span className="text-muted-foreground text-xs">E-mail</span>
            <p className="text-foreground">{guest.email || "-"}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">Kanaal</span>
            <p className="text-foreground">WhatsApp</p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">Eerste contact</span>
            <p className="text-foreground">
              {new Date(guest.created_at).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">Marketing opt-in</span>
            <p>
              <Badge variant={guest.opted_in_marketing ? "default" : "secondary"} className="text-xs">
                {guest.opted_in_marketing ? "Ja" : "Nee"}
              </Badge>
            </p>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Notes */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-medium">Notities</span>
            {saved && (
              <span className="text-xs text-green-600 flex items-center gap-1">
                <Check className="w-3 h-3" /> Opgeslagen
              </span>
            )}
          </div>
          <Textarea
            value={notes}
            onChange={e => handleNotesChange(e.target.value)}
            placeholder="Voeg notities toe over deze gast..."
            className="min-h-[100px] text-sm resize-none"
          />
        </div>
      </ScrollArea>
    </div>
  );
}
