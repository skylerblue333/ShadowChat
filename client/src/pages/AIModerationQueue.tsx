import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Shield, CheckCircle, XCircle, AlertTriangle, Eye, Ban, Flag,
  RefreshCw, Brain, Filter, Clock, Zap
} from "lucide-react";

const ACTION_COLORS: Record<string, string> = {
  auto_remove: "bg-red-500/20 text-red-400 border-red-500/30",
  auto_flag: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  manual_review: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  approved: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

export default function AIModerationQueue() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<"all" | "flagged" | "removed" | "pending">("all");

  const { data: queue, isLoading, refetch } = trpc.moderation.queue.useQuery(
    { limit: 50 },
    { enabled: user?.role === "admin", refetchInterval: 30000 }
  );

  const { data: stats } = trpc.moderation.stats.useQuery(
    undefined,
    { enabled: user?.role === "admin" }
  );

  const resolveMutation = trpc.moderation.resolve.useMutation({
    onSuccess: (_, vars) => {
      toast.success(`Action taken: ${vars.action}`);
      refetch();
    },
    onError: () => toast.error("Failed to resolve report"),
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Card className="bg-zinc-900 border-zinc-800 p-8 text-center">
          <Shield className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <p className="text-white font-semibold">Admin access required</p>
        </Card>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Card className="bg-zinc-900 border-zinc-800 p-8 text-center">
          <Ban className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <p className="text-white font-semibold">Forbidden</p>
          <p className="text-zinc-400 text-sm mt-1">You need admin privileges to access the moderation queue.</p>
        </Card>
      </div>
    );
  }

  const modLogs = (queue as any)?.modLogs || [];

  const filteredLogs = modLogs.filter((log: any) => {
    if (filter === "all") return true;
    if (filter === "flagged") return log.action === "auto_flag";
    if (filter === "removed") return log.action === "auto_remove";
    if (filter === "pending") return !log.resolvedAt;
    return true;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <PageHeader
          title="AI Moderation Queue"
          subtitle="Review AI-flagged content and take moderation actions"
          backHref="/admin"
          icon={Brain}
          actions={
            <Button variant="outline" onClick={() => refetch()} className="border-zinc-700 gap-2">
              <RefreshCw className="w-4 h-4" /> Refresh
            </Button>
          }
        />

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Total Actions", value: (stats as any).totalActions || 0, icon: Shield, color: "text-blue-400" },
              { label: "Auto-Moderated", value: (stats as any).autoModerated || 0, icon: Zap, color: "text-violet-400" },
              { label: "Manual Reviews", value: (stats as any).manualReviews || 0, icon: Eye, color: "text-yellow-400" },
              { label: "AI Accuracy", value: `${(stats as any).accuracy || 0}%`, icon: Brain, color: "text-emerald-400" },
            ].map(stat => (
              <Card key={stat.label} className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-4 text-center">
                  <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
                  <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-zinc-500 mt-1">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Filter Bar */}
        <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1">
          {(["all", "flagged", "removed", "pending"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 text-xs font-medium rounded-lg capitalize transition-all ${
                filter === f ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Queue */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-24 bg-zinc-900 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredLogs.length === 0 ? (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-8 text-center">
              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
              <p className="text-white font-semibold">Queue is clear!</p>
              <p className="text-zinc-400 text-sm mt-1">No items match the current filter.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredLogs.map((log: any) => (
              <Card key={log.id} className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge className={`text-xs ${ACTION_COLORS[log.action] || "bg-zinc-700 text-zinc-400"}`}>
                          {log.action?.replace("_", " ")}
                        </Badge>
                        <Badge variant="outline" className="text-xs border-zinc-700 text-zinc-400">
                          {log.contentType}
                        </Badge>
                        <span className="text-xs text-zinc-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {log.createdAt ? new Date(log.createdAt).toLocaleString() : "Unknown"}
                        </span>
                        {log.isAuto && (
                          <Badge className="text-xs bg-violet-500/20 text-violet-400 border-violet-500/30">
                            <Brain className="w-3 h-3 mr-1" />AI
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-zinc-300 line-clamp-2">{log.reason || "No reason provided"}</p>
                      {log.contentId && (
                        <p className="text-xs text-zinc-500 mt-1">Content ID: {log.contentId}</p>
                      )}
                    </div>
                    {!log.resolvedAt && (
                      <div className="flex gap-1.5 shrink-0">
                        <Button
                          size="sm"
                          onClick={() => resolveMutation.mutate({ reportId: String(log.id), action: "approve" })}
                          disabled={resolveMutation.isPending}
                          className="bg-emerald-600 hover:bg-emerald-700 gap-1 text-xs"
                        >
                          <CheckCircle className="w-3 h-3" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => resolveMutation.mutate({ reportId: String(log.id), action: "remove" })}
                          disabled={resolveMutation.isPending}
                          className="border-red-800 text-red-400 hover:bg-red-900/20 gap-1 text-xs"
                        >
                          <XCircle className="w-3 h-3" /> Remove
                        </Button>
                      </div>
                    )}
                    {log.resolvedAt && (
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs shrink-0">
                        <CheckCircle className="w-3 h-3 mr-1" />Resolved
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
