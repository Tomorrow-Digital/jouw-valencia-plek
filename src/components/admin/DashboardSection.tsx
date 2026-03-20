import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ClipboardList, MessageSquare, ShieldAlert, Calendar } from "lucide-react";
import type { AdminSection } from "./AdminLayout";

interface DashboardSectionProps {
  onNavigate: (section: AdminSection) => void;
}

export function DashboardSection({ onNavigate }: DashboardSectionProps) {
  const [stats, setStats] = useState({
    bookings: 0,
    pendingBookings: 0,
    messages: 0,
    deletionRequests: 0,
    pendingDeletions: 0,
    blockedPeriods: 0,
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    const [
      { count: bookingsCount },
      { count: pendingCount },
      { count: messagesCount },
      { count: deletionCount },
      { count: pendingDeletionCount },
      { count: blockedCount },
      { data: recent },
    ] = await Promise.all([
      supabase.from("bookings").select("*", { count: "exact", head: true }),
      supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("contact_messages").select("*", { count: "exact", head: true }),
      supabase.from("deletion_requests").select("*", { count: "exact", head: true }),
      supabase.from("deletion_requests").select("*", { count: "exact", head: true }).in("status", ["pending", "email_sent", "verified", "processing"]),
      supabase.from("blocked_dates").select("*", { count: "exact", head: true }),
      supabase.from("bookings").select("id, first_name, last_name, check_in, check_out, status, created_at").order("created_at", { ascending: false }).limit(5),
    ]);

    setStats({
      bookings: bookingsCount || 0,
      pendingBookings: pendingCount || 0,
      messages: messagesCount || 0,
      deletionRequests: deletionCount || 0,
      pendingDeletions: pendingDeletionCount || 0,
      blockedPeriods: blockedCount || 0,
    });
    setRecentBookings(recent || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) return <p className="text-muted-foreground text-sm text-center py-12">Laden...</p>;

  const statusLabels: Record<string, string> = {
    pending: "In afwachting",
    confirmed: "Bevestigd",
    cancelled: "Geannuleerd",
  };

  const statusDot: Record<string, string> = {
    pending: "bg-yellow-400",
    confirmed: "bg-green-400",
    cancelled: "bg-red-400",
  };

  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<ClipboardList className="w-5 h-5" />}
          label="Boekingen"
          value={stats.bookings}
          sub={stats.pendingBookings > 0 ? `${stats.pendingBookings} in afwachting` : undefined}
          onClick={() => onNavigate("bookings")}
        />
        <StatCard
          icon={<MessageSquare className="w-5 h-5" />}
          label="Berichten"
          value={stats.messages}
          onClick={() => onNavigate("messages")}
        />
        <StatCard
          icon={<ShieldAlert className="w-5 h-5" />}
          label="Verwijderverzoeken"
          value={stats.deletionRequests}
          sub={stats.pendingDeletions > 0 ? `${stats.pendingDeletions} openstaand` : undefined}
          onClick={() => onNavigate("deletion")}
        />
        <StatCard
          icon={<Calendar className="w-5 h-5" />}
          label="Blokkades"
          value={stats.blockedPeriods}
          onClick={() => onNavigate("calendar")}
        />
      </div>

      {/* Recent bookings */}
      <div className="bg-background rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Recente boekingen</h3>
          <button
            onClick={() => onNavigate("bookings")}
            className="text-xs text-primary hover:underline font-medium"
          >
            Alles bekijken →
          </button>
        </div>
        {recentBookings.length === 0 ? (
          <p className="text-muted-foreground text-sm py-6 text-center">Nog geen boekingen.</p>
        ) : (
          <div className="divide-y divide-border">
            {recentBookings.map((b) => (
              <div key={b.id} className="flex items-center justify-between py-3 gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {b.first_name} {b.last_name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {b.check_in} → {b.check_out}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className={`w-2 h-2 rounded-full ${statusDot[b.status] || "bg-muted"}`} />
                  <span className="text-xs text-muted-foreground">{statusLabels[b.status] || b.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  sub?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-background rounded-xl border border-border p-5 text-left hover:border-primary/30 hover:shadow-sm transition-all active:scale-[0.98] group"
    >
      <div className="flex items-center gap-2.5 mb-3">
        <div className="text-muted-foreground group-hover:text-primary transition-colors">{icon}</div>
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-2xl font-semibold text-foreground tabular-nums">{value}</p>
      {sub && <p className="text-xs text-primary mt-1 font-medium">{sub}</p>}
    </button>
  );
}
