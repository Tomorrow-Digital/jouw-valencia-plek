import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, CreditCard, CalendarDays } from "lucide-react";

const configs = {
  email: {
    icon: Mail,
    title: "E-mail Integratie",
    description: "Configureer SMTP of een transactional email service om automatische emails te versturen naar gasten.",
  },
  payments: {
    icon: CreditCard,
    title: "Betalingen Integratie",
    description: "Koppel een betaalprovider zoals Stripe of Mollie voor online boekingsbetalingen.",
  },
  calendar: {
    icon: CalendarDays,
    title: "Kalender Integratie",
    description: "Synchroniseer boekingen met Google Calendar, iCal of andere kalender-apps.",
  },
} as const;

export function IntegrationPlaceholder({ type }: { type: "email" | "payments" | "calendar" }) {
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
          <Badge variant="secondary" className="opacity-60">Binnenkort beschikbaar</Badge>
        </CardContent>
      </Card>
    </div>
  );
}
