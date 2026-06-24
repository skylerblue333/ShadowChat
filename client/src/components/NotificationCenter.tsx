import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import { Bell, Check, CheckCheck, X, Heart, MessageSquare, UserPlus, Zap, Gift, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const NOTIF_ICONS: Record<string, any> = {
  like: { icon: Heart, color: 'oklch(0.72 0.28 340)' },
  comment: { icon: MessageSquare, color: 'oklch(0.72 0.28 220)' },
  follow: { icon: UserPlus, color: 'oklch(0.72 0.28 305)' },
  mention: { icon: Zap, color: 'oklch(0.72 0.28 70)' },
  gift: { icon: Gift, color: 'oklch(0.72 0.28 160)' },
  achievement: { icon: Trophy, color: 'oklch(0.80 0.18 70)' },
};

function timeAgo(date: Date | string) {
  const d = new Date(date);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

export function NotificationCenter() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data: notifs, refetch } = trpc.notification.list.useQuery(
    { limit: 20 },
    { enabled: !!user, refetchInterval: 30000 }
  );
  const markRead = trpc.notification.markRead.useMutation({ onSuccess: () => refetch() });
  const markAllRead = trpc.notification.markAllRead.useMutation({ onSuccess: () => refetch() });

  const unread = notifs?.filter((n: any) => !n.read).length || 0;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!user) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="relative p-2 rounded-xl transition-all hover:scale-105 active:scale-95"
        style={{ background: open ? 'oklch(0.72 0.28 305 / 0.15)' : 'transparent' }}
      >
        <Bell className="w-5 h-5 text-white" />
        {unread > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
            style={{ background: 'oklch(0.72 0.28 340)' }}
          >
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-80 rounded-2xl shadow-2xl z-50 overflow-hidden"
          style={{
            background: 'oklch(0.11 0.025 270)',
            border: '1px solid oklch(0.72 0.28 305 / 0.25)',
            boxShadow: '0 20px 60px oklch(0 0 0 / 0.5), 0 0 0 1px oklch(0.72 0.28 305 / 0.10)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid oklch(0.18 0.025 270)' }}>
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4" style={{ color: 'oklch(0.72 0.28 305)' }} />
              <span className="text-white text-sm font-semibold">Notifications</span>
              {unread > 0 && (
                <Badge className="text-[10px] px-1.5 py-0 h-4" style={{ background: 'oklch(0.72 0.28 305 / 0.20)', color: 'oklch(0.85 0.25 305)', border: 'none' }}>
                  {unread} new
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unread > 0 && (
                <button
                  onClick={() => markAllRead.mutate()}
                  className="text-xs px-2 py-1 rounded-lg transition-colors hover:opacity-80"
                  style={{ color: 'oklch(0.72 0.28 305)', background: 'oklch(0.72 0.28 305 / 0.10)' }}
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                </button>
              )}
              <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:opacity-70">
                <X className="w-4 h-4" style={{ color: 'oklch(0.50 0.020 275)' }} />
              </button>
            </div>
          </div>

          {/* Notification list */}
          <div className="max-h-80 overflow-y-auto">
            {!notifs || notifs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <Bell className="w-8 h-8 opacity-30" style={{ color: 'oklch(0.55 0.025 275)' }} />
                <p className="text-sm" style={{ color: 'oklch(0.50 0.020 275)' }}>No notifications yet</p>
              </div>
            ) : (
              notifs.map((n: any) => {
                const typeKey = n.type?.split(":")[1] || n.type || "like";
                const conf = NOTIF_ICONS[typeKey] || NOTIF_ICONS.like;
                const Icon = conf.icon;
                return (
                  <div
                    key={n.id}
                    className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:opacity-90"
                    style={{
                      background: n.read ? 'transparent' : 'oklch(0.72 0.28 305 / 0.05)',
                      borderBottom: '1px solid oklch(0.15 0.025 270)',
                    }}
                    onClick={() => {
                      if (!n.read) markRead.mutate({ id: n.id });
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: `${conf.color}22` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: conf.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white leading-snug">{n.message || n.title || "New notification"}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'oklch(0.50 0.020 275)' }}>{timeAgo(n.createdAt)}</p>
                    </div>
                    {!n.read && (
                      <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ background: 'oklch(0.72 0.28 305)' }} />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2" style={{ borderTop: '1px solid oklch(0.18 0.025 270)' }}>
            <Link href="/notifications" onClick={() => setOpen(false)}>
              <button className="w-full text-center text-xs py-1.5 rounded-lg transition-colors hover:opacity-80" style={{ color: 'oklch(0.72 0.28 305)' }}>
                View all notifications
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
