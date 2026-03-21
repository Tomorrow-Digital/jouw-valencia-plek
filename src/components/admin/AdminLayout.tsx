import { useNavigate } from "react-router-dom";

import { supabase } from "@/integrations/supabase/client";
import { getLanguage, setLanguage, t, LANGUAGE_LABELS, type Language } from "@/lib/i18n";
import {
  SidebarProvider,
  SidebarTrigger,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  ClipboardList,
  MessageSquare,
  Image,
  Calendar,
  Euro,
  ShieldAlert,
  LogOut,
  ExternalLink,
  LayoutDashboard,
  Users,
  MessageCircle,
  FileText,
  Phone,
  Workflow,
  Mail,
  CreditCard,
  CalendarDays,
  Globe,
  PanelLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type AdminSection =
  | "dashboard" | "bookings" | "messages" | "photos" | "calendar" | "pricing" | "pages" | "deletion" | "users"
  | "crm-inbox" | "crm-guests" | "crm-templates"
  | "integrations-whatsapp" | "integrations-n8n" | "integrations-email" | "integrations-payments" | "integrations-calendar";

interface NavItem {
  id: AdminSection;
  label: string;
  icon: React.ElementType;
  group: "overview" | "content" | "crm" | "integrations" | "privacy";
  disabled?: boolean;
}

const getNavItems = (): NavItem[] => [
  { id: "dashboard", label: t('nav.dashboard'), icon: LayoutDashboard, group: "overview" },
  { id: "bookings", label: t('nav.bookings'), icon: ClipboardList, group: "overview" },
  { id: "messages", label: t('nav.contactMessages'), icon: MessageSquare, group: "overview" },
  { id: "photos", label: t('nav.photos'), icon: Image, group: "content" },
  { id: "calendar", label: t('nav.calendar'), icon: Calendar, group: "content" },
  { id: "pricing", label: t('nav.pricing'), icon: Euro, group: "content" },
  { id: "pages", label: t('nav.pages'), icon: PanelLeft, group: "content" },
  { id: "crm-inbox", label: t('nav.inbox'), icon: MessageCircle, group: "crm" },
  { id: "crm-guests", label: t('nav.guests'), icon: Users, group: "crm" },
  { id: "crm-templates", label: t('nav.templates'), icon: FileText, group: "crm" },
  { id: "integrations-whatsapp", label: t('nav.whatsapp'), icon: Phone, group: "integrations" },
  { id: "integrations-n8n", label: t('nav.n8n'), icon: Workflow, group: "integrations" },
  { id: "integrations-email", label: t('nav.email'), icon: Mail, group: "integrations", disabled: true },
  { id: "integrations-payments", label: t('nav.payments'), icon: CreditCard, group: "integrations", disabled: true },
  { id: "integrations-calendar", label: t('nav.calendarInt'), icon: CalendarDays, group: "integrations", disabled: true },
  { id: "deletion", label: t('nav.deletion'), icon: ShieldAlert, group: "privacy" },
  { id: "users", label: t('nav.users'), icon: Users, group: "privacy" },
];

const getGroupLabels = (): Record<string, string> => ({
  overview: t('nav.overview'),
  content: t('nav.management'),
  crm: t('nav.crm'),
  integrations: t('nav.integrations'),
  privacy: t('nav.privacy'),
});

interface AdminLayoutProps {
  section: AdminSection;
  onSectionChange: (s: AdminSection) => void;
  children: React.ReactNode;
}

export function AdminLayout({ section, onSectionChange, children }: AdminLayoutProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/30">
        <AdminSidebar section={section} onSectionChange={onSectionChange} onLogout={handleLogout} />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 bg-background border-b border-border flex items-center gap-3 px-4 sticky top-0 z-30">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div className="h-5 w-px bg-border" />
            <h1 className="text-sm font-medium text-foreground truncate">
              {getNavItems().find((n) => n.id === section)?.label || "Dashboard"}
            </h1>
          </header>
          <main className={cn(
            "flex-1",
            section === "crm-inbox" ? "" : "p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto"
          )}>{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function AdminSidebar({
  section,
  onSectionChange,
  onLogout,
}: {
  section: AdminSection;
  onSectionChange: (s: AdminSection) => void;
  onLogout: () => void;
}) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const groups = ["overview", "content", "crm", "integrations", "privacy"] as const;

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="p-4">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold flex-shrink-0">CV</div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">Casita Valencia</p>
              <p className="text-[11px] text-muted-foreground">Admin</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">CV</div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        {groups.map((group) => {
          const navItems = getNavItems();
          const groupLabels = getGroupLabels();
          const items = navItems.filter((n) => n.group === group);
          return (
            <SidebarGroup key={group}>
              <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-muted-foreground/70">
                {groupLabels[group]}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => {
                    if (item.disabled) {
                      return (
                        <SidebarMenuItem key={item.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <SidebarMenuButton
                                className="opacity-50 pointer-events-none"
                                tooltip={item.label}
                              >
                                <item.icon className="w-4 h-4 flex-shrink-0" />
                                <span>{item.label}</span>
                              </SidebarMenuButton>
                            </TooltipTrigger>
                            <TooltipContent side="right">{t('nav.comingSoon')}</TooltipContent>
                          </Tooltip>
                        </SidebarMenuItem>
                      );
                    }
                    return (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          onClick={() => onSectionChange(item.id)}
                          isActive={section === item.id}
                          tooltip={item.label}
                          className={cn(
                            "transition-colors",
                            section === item.id && "bg-primary/10 text-primary font-medium",
                          )}
                        >
                          <item.icon className="w-4 h-4 flex-shrink-0" />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      <SidebarFooter className="p-3 space-y-1">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  tooltip={`${t('common.language')}: ${LANGUAGE_LABELS[getLanguage()]}`}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Globe className="w-4 h-4" />
                  <span>{LANGUAGE_LABELS[getLanguage()]}</span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start">
                {(Object.keys(LANGUAGE_LABELS) as Language[]).map(lang => (
                  <DropdownMenuItem
                    key={lang}
                    onClick={() => { setLanguage(lang); window.location.reload(); }}
                    className={lang === getLanguage() ? "font-medium text-primary" : ""}
                  >
                    {LANGUAGE_LABELS[lang]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={t('nav.toWebsite')} className="text-muted-foreground hover:text-foreground">
              <a href="/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
                <span>{t('nav.toWebsite')}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={onLogout} tooltip={t('nav.logout')} className="text-muted-foreground hover:text-destructive">
              <LogOut className="w-4 h-4" />
              <span>{t('nav.logout')}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
