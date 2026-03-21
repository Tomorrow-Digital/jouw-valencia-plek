import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { t } from "@/lib/i18n";
import type { CrmTemplate } from "./types";

const categoryColors: Record<string, string> = {
  marketing: "bg-amber-100 text-amber-800",
  utility: "bg-blue-100 text-blue-800",
  authentication: "bg-purple-100 text-purple-800",
};

const statusColors: Record<string, string> = {
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  paused: "bg-amber-100 text-amber-800",
  pending: "bg-gray-100 text-gray-800",
};

function highlightVariables(text: string) {
  const parts = text.split(/(\{\{\d+\}\})/g);
  return parts.map((part, i) =>
    /\{\{\d+\}\}/.test(part)
      ? <span key={i} className="text-primary font-medium bg-primary/10 px-1 rounded">{part}</span>
      : part
  );
}

function relativeTime(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 60) return `${diffMin}m geleden`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}u geleden`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `${diffD}d geleden`;
  return d.toLocaleDateString("nl-NL", { day: "numeric", month: "short" });
}

export function CrmTemplates() {
  const [templates, setTemplates] = useState<CrmTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [filter, setFilter] = useState("all");

  const fetchTemplates = useCallback(async () => {
    const { data } = await supabase
      .from("crm_templates")
      .select("*")
      .order("category")
      .order("template_name");
    if (data) setTemplates(data as unknown as CrmTemplate[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchTemplates(); }, [fetchTemplates]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const { data: n8nConfig } = await supabase
        .from("integration_configs")
        .select("config")
        .eq("integration_type", "n8n")
        .single();

      const webhookUrl = (n8nConfig?.config as any)?.webhook_template_sync;
      if (!webhookUrl) {
        toast.error(t('integrations.configureN8NFirst'));
        setSyncing(false);
        return;
      }

      await fetch(webhookUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "sync_templates" }) });
      toast.success(t('crm.templatesSynced'));
      await fetchTemplates();
    } catch {
      toast.error("Synchronisatie mislukt");
    }
    setSyncing(false);
  };

  const filtered = filter === "all" ? templates : templates.filter(t => t.category === filter);

  if (loading) return <p className="text-muted-foreground text-sm">{t('common.loading')}</p>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-semibold text-foreground">WhatsApp Templates</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Beheer je goedgekeurde berichtsjablonen</p>
        </div>
        <Button variant="outline" onClick={handleSync} disabled={syncing} size="sm">
          <RefreshCw className={`w-4 h-4 mr-1 ${syncing ? "animate-spin" : ""}`} />
          {t('crm.syncTemplates')}
        </Button>
      </div>

      <Tabs value={filter} onValueChange={setFilter} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">{t('common.all')}</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="utility">Utility</TabsTrigger>
          <TabsTrigger value="authentication">Authentication</TabsTrigger>
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-12">{t('crm.noTemplates')}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(tmpl => (
            <Card key={tmpl.id}>
              <CardContent className="pt-5 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColors[tmpl.category] || "bg-gray-100 text-gray-800"}`}>
                    {tmpl.category}
                  </span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[tmpl.status] || "bg-gray-100 text-gray-800"}`}>
                    {tmpl.status}
                  </span>
                </div>
                <p className="font-medium text-sm">{tmpl.template_name}</p>
                <p className="text-xs text-muted-foreground">
                  Taal: {tmpl.language.toUpperCase()} · Gesynchroniseerd: {relativeTime(tmpl.last_synced_at)}
                </p>
                {tmpl.body_text && (
                  <div className="bg-muted rounded-lg p-3 text-sm">
                    {highlightVariables(tmpl.body_text)}
                  </div>
                )}
                {tmpl.header_type && (
                  <p className="text-xs text-muted-foreground">Header: {tmpl.header_type}</p>
                )}
                {tmpl.buttons && Array.isArray(tmpl.buttons) && tmpl.buttons.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {tmpl.buttons.map((btn: any, i: number) => (
                      <Badge key={i} variant="outline" className="text-xs">{btn.text || btn.type || `Button ${i + 1}`}</Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
