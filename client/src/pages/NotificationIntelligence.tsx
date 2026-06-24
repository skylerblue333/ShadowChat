import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, BellOff, Zap, Filter, CheckCheck, BarChart3, Sparkles, Clock } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

const PRIORITY_COLORS: Record<string, string> = {
  critical: "bg-red-500/20 text-red-400 border-red-500/30",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  ambient: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

const PRIORITY_ICONS: Record<string, string> = {
  critical: "🚨",
  high: "🔔",
  medium: "💬",
  low: "📩",
  ambient: "🌊",
};

type FilterType = "all" | "unread" | "critical" | "high" | "medium" | "low";

export default function NotificationIntelligence() {
  const [filter, setFilter] = useState<FilterType>("all");
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.notifIntelligence.getIntelligentFeed.useQuery(
    { limit: 50, filter, offset: 0 },
    { refetchInterval: 10000 },
  );

  const { data: summary } = trpc.notifIntelligence.getAISummary.useQuery(undefined, {
    refetchInterval: 30000,
  });

  const { data: analytics } = trpc.notifIntelligence.getAnalytics.useQuery();

  const markRead = trpc.notifIntelligence.markRead.useMutation({
    onSuccess: () => {
      utils.notifIntelligence.getIntelligentFeed.invalidate();
      utils.notifIntelligence.getAISummary.invalidate();
      toast.success("Marked as read");
    },
  });

  const handleMarkAllRead = () => {
    markRead.mutate({ all: true });
  };

  const handleMarkRead = (id: number) => {
    markRead.mutate({ ids: [id] });
  };

  const notifications = data?.notifications ?? [];
  const unreadCount = data?.unreadCount ?? 0;

  return (
    <div className="min-h-screen bg-[#07050f] text-white p-4 md:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="w-6 h-6 text-purple-400" />
            Notification Intelligence
          </h1>
          <p className="text-gray-400 text-sm mt-1">AI-ranked, smart-batched notifications</p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Badge className="bg-purple-600 text-white">{unreadCount} unread</Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            disabled={markRead.isPending || unreadCount === 0}
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            <CheckCheck className="w-4 h-4 mr-1" />
            Mark all read
          </Button>
        </div>
      </div>

      <Tabs defaultValue="feed">
        <TabsList className="bg-gray-900 border border-gray-800 mb-6">
          <TabsTrigger value="feed" className="data-[state=active]:bg-purple-600">
            <Bell className="w-4 h-4 mr-1" />
            Feed
          </TabsTrigger>
          <TabsTrigger value="ai-summary" className="data-[state=active]:bg-purple-600">
            <Sparkles className="w-4 h-4 mr-1" />
            AI Summary
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">
            <BarChart3 className="w-4 h-4 mr-1" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Feed Tab */}
        <TabsContent value="feed">
          {/* Filter Bar */}
          <div className="flex gap-2 flex-wrap mb-4">
            {(["all", "unread", "critical", "high", "medium", "low"] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  filter === f
                    ? "bg-purple-600 text-white border-purple-500"
                    : "bg-gray-900 text-gray-400 border-gray-700 hover:border-gray-600"
                }`}
              >
                <Filter className="w-3 h-3 inline mr-1" />
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-900 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-16">
              <BellOff className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500">No notifications in this category</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    n.read
                      ? "bg-gray-900/50 border-gray-800"
                      : "bg-gray-900 border-gray-700 shadow-lg"
                  }`}
                  onClick={() => !n.read && handleMarkRead(n.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-xl shrink-0 mt-0.5">
                      {PRIORITY_ICONS[n.priority] ?? "🔔"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${PRIORITY_COLORS[n.priority] ?? ""}`}>
                          {n.priority}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          Score: {n.score}
                        </span>
                        {n.batchCount > 1 && (
                          <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-0.5 rounded-full">
                            ×{n.batchCount} batched
                          </span>
                        )}
                        {!n.read && (
                          <span className="w-2 h-2 bg-purple-500 rounded-full shrink-0" />
                        )}
                      </div>
                      <p className="text-sm font-medium text-white truncate">{n.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{n.body}</p>
                      <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-600">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* AI Summary Tab */}
        <TabsContent value="ai-summary">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Sparkles className="w-5 h-5 text-purple-400" />
                AI Notification Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              {summary ? (
                <div className="space-y-4">
                  <div className="p-4 bg-purple-900/20 border border-purple-700/30 rounded-xl">
                    <p className="text-gray-200 leading-relaxed">{summary.summary}</p>
                  </div>
                  {summary.highlights.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-400 mb-3 font-medium">Top Activity</p>
                      <div className="space-y-2">
                        {summary.highlights.map((h, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                            <span className="text-sm text-gray-300 capitalize">{h.type.replace(/_/g, " ")}</span>
                            <Badge className="bg-purple-800 text-purple-200">{h.count}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Generating AI summary...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                Notification Analytics (30 days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics && analytics.byPriority.length > 0 ? (
                <div className="space-y-3">
                  {analytics.byPriority.map((row) => (
                    <div key={row.priority} className="p-4 bg-gray-800 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{PRIORITY_ICONS[row.priority] ?? "🔔"}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${PRIORITY_COLORS[row.priority] ?? ""}`}>
                            {row.priority}
                          </span>
                        </div>
                        <span className="text-sm text-gray-400">{row.total} total</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div>
                          <p className="text-lg font-bold text-white">{row.readRate}%</p>
                          <p className="text-xs text-gray-500">Read rate</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-purple-400">{row.avgScore}</p>
                          <p className="text-xs text-gray-500">Avg score</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-blue-400">
                            {row.avgReadTimeSecs ? `${Math.round(row.avgReadTimeSecs / 60)}m` : "—"}
                          </p>
                          <p className="text-xs text-gray-500">Avg read time</p>
                        </div>
                      </div>
                      {/* Read rate bar */}
                      <div className="mt-3 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full transition-all"
                          style={{ width: `${row.readRate}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No analytics data yet. Notifications will appear here once received.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
