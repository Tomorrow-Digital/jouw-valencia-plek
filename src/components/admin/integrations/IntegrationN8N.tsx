import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Workflow, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export function IntegrationN8N() {
  const [status, setStatus] = useState("disconnected");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const [form, setForm] = useState({
    base_url: "",
    webhook_checkin_reminder: "",
    webhook_daily_summary: "",
    webhook_template_sync: "",
    api_key: "",
  });

  const fetchConfig = useCallback(async () => {
    const { data } = await supabase
      .from("integration_configs")
      .select("*")
      .eq("integration_type", "n8n")
      .single();
    if (data) {
      setStatus(data.status);
      const c = (data.config as Record<string, string>) || {};
      setForm({
        base_url: c.base_url || "",
        webhook_checkin_reminder: c.webhook_checkin_reminder || "",
        webhook_daily_summary: c.webhook_daily_summary || "",
        webhook_template_sync: c.webhook_template_sync || "",
        api_key: c.api_key || "",
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchConfig(); }, [fetchConfig]);

  const handleSave = async () => {
    setSaving(true);
    const newStatus = form.base_url ? "connected" : "disconnected";
    await supabase
      .from("integration_configs")
      .update({ config: form as unknown as Record<string, unknown>, status: newStatus, updated_at: new Date().toISOString() })
      .eq("integration_type", "n8n");
    setStatus(newStatus);
    setSaving(false);
    toast.success("N8N configuratie opgeslagen");
  };

  const handleTest = async () => {
    if (!form.base_url) return;
    setTesting(true);
    try {
      const res = await fetch(form.base_url, { method: "HEAD", mode: "no-cors" });
      toast.success("N8N bereikbaar (no-cors check)");
      await supabase
        .from("integration_configs")
        .update({ status: "connected", last_health_check: new Date().toISOString() })
        .eq("integration_type", "n8n");
      setStatus("connected");
    } catch {
      toast.error("N8N niet bereikbaar");
      await supabase
        .from("integration_configs")
        .update({ status: "error", last_error: "Health check failed" })
        .eq("integration_type", "n8n");
      setStatus("error");
    }
    setTesting(false);
  };

  if (loading) return <p className="text-muted-foreground text-sm">Laden...</p>;

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground">N8N Automations</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Configureer N8N voor automatische herinneringen en samenvattingen.</p>
      </div>

      {/* Status */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Workflow className="w-5 h-5 text-muted-foreground" />
              <CardTitle className="text-base">Verbindingsstatus</CardTitle>
            </div>
            <Badge variant={status === "connected" ? "default" : status === "error" ? "destructive" : "secondary"}>
              <span className={`w-2 h-2 rounded-full mr-1.5 inline-block ${status === "connected" ? "bg-green-500" : status === "error" ? "bg-red-500" : "bg-muted-foreground"}`} />
              {status === "connected" ? "Verbonden" : status === "error" ? "Fout" : "Niet verbonden"}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Config */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">N8N Automations Configuratie</CardTitle>
          <CardDescription>N8N wordt gebruikt voor automatische herinneringen, dagelijkse samenvattingen en toekomstige integraties. De core WhatsApp berichten-flow loopt direct via backend functies.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>N8N Base URL</Label>
            <Input value={form.base_url} onChange={e => setForm({ ...form, base_url: e.target.value })} placeholder="https://n8n.example.com" />
          </div>
          <div className="space-y-2">
            <Label>Webhook: Check-in herinneringen</Label>
            <Input value={form.webhook_checkin_reminder} onChange={e => setForm({ ...form, webhook_checkin_reminder: e.target.value })} className="font-mono text-xs" placeholder="https://n8n.example.com/webhook/..." />
          </div>
          <div className="space-y-2">
            <Label>Webhook: Dagelijkse samenvatting</Label>
            <Input value={form.webhook_daily_summary} onChange={e => setForm({ ...form, webhook_daily_summary: e.target.value })} className="font-mono text-xs" placeholder="https://n8n.example.com/webhook/..." />
          </div>
          <div className="space-y-2">
            <Label>Webhook: Template sync</Label>
            <Input value={form.webhook_template_sync} onChange={e => setForm({ ...form, webhook_template_sync: e.target.value })} className="font-mono text-xs" placeholder="https://n8n.example.com/webhook/..." />
          </div>
          <div className="space-y-2">
            <Label>API Key (optioneel)</Label>
            <div className="relative">
              <Input type={showKey ? "text" : "password"} value={form.api_key} onChange={e => setForm({ ...form, api_key: e.target.value })} className="pr-10" />
              <button type="button" onClick={() => setShowKey(!showKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button onClick={handleSave} disabled={saving}>{saving ? "Opslaan..." : "Opslaan"}</Button>
            <Button variant="outline" onClick={handleTest} disabled={testing || !form.base_url}>{testing ? "Testen..." : "Test connectie"}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
