import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

type NotificationType = "all" | "tips" | "follows" | "system" | "marketplace";

export default function Notifications() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<NotificationType>("all");

  const { data: notifications, isLoading, refetch } = trpc.user.notifications.useQuery(
    undefined,
    { refetchInterval: 30000 }
  );

  const markRead = trpc.user.markNotificationRead.useMutation({
    onSuccess: () => refetch(),
  });

  // Mark all read by iterating (no bulk endpoint)
  const markAllReadFn = () => {
    const unread = notifications?.filter((n: any) => !n.isRead) || [];
    unread.forEach((n: any) => markRead.mutate({ id: n.id }));
    toast.success("All notifications marked as read");
  };

  const filteredNotifications = notifications?.filter((n: any) => {
    if (filter === "all") return true;
    if (filter === "tips") return n.type === "tip" || n.type === "donation";
    if (filter === "follows") return n.type === "follow";
    if (filter === "system") return n.type === "system" || n.type === "announcement";
    if (filter === "marketplace") return n.type === "sale" || n.type === "bid";
    return true;
  }) || [];

  const unreadCount = notifications?.filter((n: any) => !n.isRead).length || 0;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "tip": return "💰";
      case "donation": return "🎁";
      case "follow": return "👤";
      case "system": return "⚙️";
      case "announcement": return "📢";
      case "sale": return "🛒";
      case "bid": return "🔨";
      case "achievement": return "🏆";
      case "level_up": return "⬆️";
      default: return "🔔";
    }
  };

  const formatTime = (timestamp: string | number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAllReadFn()}
              disabled={markRead.isPending}
            >
              Mark all read
            </Button>
          )}
        </div>

        {/* Filter Tabs */}
        <Tabs value={filter} onValueChange={(v) => setFilter(v as NotificationType)}>
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="tips">Tips</TabsTrigger>
            <TabsTrigger value="follows">Follows</TabsTrigger>
            <TabsTrigger value="marketplace">Market</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="mt-4 space-y-2">
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Card key={i} className="bg-card/50 border-border animate-pulse">
                    <CardContent className="p-4 h-16" />
                  </Card>
                ))}
              </div>
            ) : filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification: any) => (
                <Card
                  key={notification.id}
                  className={`border-border transition-all cursor-pointer hover:bg-muted/30 ${
                    !notification.isRead ? "bg-purple-500/5 border-purple-500/20" : "bg-card/50"
                  }`}
                  onClick={() => {
                    if (!notification.isRead) {
                      markRead.mutate({ id: notification.id });
                    }
                  }}
                >
                  <CardContent className="p-4 flex items-start gap-3">
                    <span className="text-xl mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm ${!notification.isRead ? "font-medium" : "text-muted-foreground"}`}>
                          {notification.message || notification.content}
                        </p>
                        {!notification.isRead && (
                          <span className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTime(notification.createdAt)}
                      </p>
                    </div>
                    {notification.amount && (
                      <Badge variant="outline" className="text-purple-400 border-purple-500/50 flex-shrink-0">
                        +{notification.amount} SKY444
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-card/50 border-border">
                <CardContent className="p-12 text-center">
                  <p className="text-4xl mb-3">🔔</p>
                  <p className="text-muted-foreground">No notifications in this category</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
