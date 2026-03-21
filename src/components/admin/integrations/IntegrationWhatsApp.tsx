import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Eye, EyeOff, Copy, Check } from "lucide-react";
import { toast } from "sonner";

export function IntegrationWhatsApp() {
  const [config, setConfig] = useState<any>(null);
  const [status, setStatus] = useState("disconnected");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({
    phone_number_id: "",
    waba_id: "",
    access_token: "",
    display_phone: "",
    verify_token: "casita-valencia-webhook-verify",
  });

  const fetchConfig = useCallback(async () => {
    const { data } = await supabase
      .from("integration_configs")
      .select("*")
      .eq("integration_type", "whatsapp")
      .single();
    if (data) {
      setStatus(data.status);
      const c = (data.config as Record<string, string>) || {};
      setForm({
        phone_number_id: c.phone_number_id || "",
        waba_id: c.waba_id || "",
        access_token: c.access_token || "",
        display_phone: c.display_phone || "",
        verify_token: c.verify_token || "casita-valencia-webhook-verify",
      });
      setConfig(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchConfig(); }, [fetchConfig]);

  const handleSave = async () => {
    setSaving(true);
    const newStatus = form.phone_number_id && form.access_token ? "connected" : "disconnected";
    await supabase
      .from("integration_configs")
      .update({ config: form as unknown as Record<string, unknown>, status: newStatus, updated_at: new Date().toISOString() })
      .eq("integration_type", "whatsapp");
    setStatus(newStatus);
    setSaving(false);
    toast.success("WhatsApp configuratie opgeslagen");
  };

  const handleTest = async () => {
    setTesting(true);
    try {
      const { data, error } = await supabase.functions.invoke("wa-send-message", {
        body: { to: form.display_phone || "test", type: "text", content: "Health check" },
      });
      if (error) throw error;
      if (data?.error) {
        toast.error(`Test mislukt: ${data.error}`);
      } else {
        toast.success("Connectie succesvol!");
      }
    } catch (e: any) {
      toast.error(`Test mislukt: ${e.message || "Onbekende fout"}`);
    }
    setTesting(false);
  };

  const webhookUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/wa-webhook`;

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Gekopieerd!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <p className="text-muted-foreground text-sm">Laden...</p>;

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground">WhatsApp Integratie</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Configureer de WhatsApp Cloud API connectie.</p>
      </div>

      {/* Status */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <CardTitle className="text-base">Verbindingsstatus</CardTitle>
            </div>
            <Badge variant={status === "connected" ? "default" : status === "error" ? "destructive" : "secondary"}>
              <span className={`w-2 h-2 rounded-full mr-1.5 inline-block ${status === "connected" ? "bg-green-500" : status === "error" ? "bg-red-500" : "bg-muted-foreground"}`} />
              {status === "connected" ? "Verbonden" : status === "error" ? "Fout" : "Niet verbonden"}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Config form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Configuratie</CardTitle>
          <CardDescription>Vul de gegevens in van je WhatsApp Cloud API account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Phone Number ID</Label>
              <Input value={form.phone_number_id} onChange={e => setForm({ ...form, phone_number_id: e.target.value })} className="font-mono" placeholder="123456789012345" />
            </div>
            <div className="space-y-2">
              <Label>WABA ID</Label>
              <Input value={form.waba_id} onChange={e => setForm({ ...form, waba_id: e.target.value })} className="font-mono" placeholder="123456789012345" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Access Token</Label>
            <div className="relative">
              <Input type={showToken ? "text" : "password"} value={form.access_token} onChange={e => setForm({ ...form, access_token: e.target.value })} className="font-mono pr-10" placeholder="EAAx..." />
              <button type="button" onClick={() => setShowToken(!showToken)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Display Phone Number</Label>
              <Input value={form.display_phone} onChange={e => setForm({ ...form, display_phone: e.target.value })} placeholder="+34 612 345 678" />
            </div>
            <div className="space-y-2">
              <Label>Webhook Verify Token</Label>
              <Input value={form.verify_token} onChange={e => setForm({ ...form, verify_token: e.target.value })} className="font-mono" />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button onClick={handleSave} disabled={saving}>{saving ? "Opslaan..." : "Opslaan"}</Button>
            <Button variant="outline" onClick={handleTest} disabled={testing || !form.phone_number_id}>{testing ? "Testen..." : "Test connectie"}</Button>
          </div>
        </CardContent>
      </Card>

      {/* Webhook URL */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Webhook URL</CardTitle>
          <CardDescription>Configureer deze URL als Webhook Callback URL in je Meta App Dashboard onder WhatsApp &gt; Configuration.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label>Callback URL</Label>
            <div className="flex gap-2">
              <Input value={webhookUrl} readOnly className="font-mono text-xs" />
              <Button variant="outline" size="icon" onClick={() => handleCopy(webhookUrl)}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Verify Token</Label>
            <Input value={form.verify_token} readOnly className="font-mono text-xs" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
