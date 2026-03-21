import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Users, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const configs = {
  inbox: { icon: MessageCircle, title: "CRM Inbox", description: "Beheer al je WhatsApp-gesprekken op één plek." },
  guests: { icon: Users, title: "Gasten", description: "Bekijk en beheer alle gastprofielen." },
  templates: { icon: FileText, title: "Templates", description: "Beheer je WhatsApp berichtsjablonen." },
} as const;

export function CrmPlaceholder({ type }: { type: "inbox" | "guests" | "templates" }) {
  const cfg = configs[type];
  const Icon = cfg.icon;

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Card className="max-w-md w-full text-center">
        <CardContent className="pt-8 pb-8 space-y-4">
          <div className="mx-auto w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
            <Icon className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">{cfg.title}</h3>
          <p className="text-sm text-muted-foreground">{cfg.description}</p>
          <Badge variant="secondary" className="opacity-60">Wordt binnenkort gebouwd</Badge>
        </CardContent>
      </Card>
    </div>
  );
}
