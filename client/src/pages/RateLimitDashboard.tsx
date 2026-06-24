import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, CheckCircle, TrendingUp, Users, Zap, RefreshCw, Activity } from "lucide-react";

const RATE_LIMIT_RULES = [
  { endpoint: "post.create", limit: 10, window: "1 min", description: "Create posts" },
  { endpoint: "comment.create", limit: 30, window: "1 min", description: "Create comments" },
  { endpoint: "dm.send", limit: 50, window: "1 min", description: "Send DMs" },
  { endpoint: "marketplace.order", limit: 5, window: "1 min", description: "Place orders" },
  { endpoint: "stake", limit: 3, window: "1 min", description: "Staking operations" },
  { endpoint: "swap", limit: 5, window: "1 min", description: "Token swaps" },
  { endpoint: "upload", limit: 10, window: "5 min", description: "File uploads" },
  { endpoint: "api.general", limit: 100, window: "1 min", description: "General API calls" },
];

// MOCK_STATS removed — data comes from trpc.admin.realtimeMetrics

export default function RateLimitDashboard() {
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  // Use security.getDashboard for admin users
  const { data: secDashboard, isLoading } = trpc.security.getDashboard.useQuery(undefined, {
    enabled: user?.role === "admin",
    retry: false,
  });

  const isAdmin = user?.role === "admin";

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <PageHeader
          title="Rate Limit Dashboard"
          subtitle="Monitor API usage, blocked requests, and abuse prevention"
          backHref="/settings"
          icon={Shield}
          actions={
            <Button
              variant="outline"
              onClick={() => setRefreshKey(k => k + 1)}
              className="border-zinc-700 gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </Button>
          }
        />

        {!isAdmin && (
          <Card className="bg-amber-500/10 border-amber-500/30">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <p className="text-sm text-amber-300">
                Full rate limit analytics require admin access. Showing platform-wide rate limit rules below.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Stats — live from admin.realtimeMetrics for admins, or N/A for regular users */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Requests", value: isAdmin ? ((secDashboard as any)?.totalRequests ?? 0).toLocaleString() : "Admin only", icon: Activity, color: "text-blue-400" },
            { label: "Blocked Requests", value: isAdmin ? ((secDashboard as any)?.blockedRequests ?? 0).toLocaleString() : "Admin only", icon: Shield, color: "text-red-400" },
            { label: "Unique IPs", value: isAdmin ? ((secDashboard as any)?.uniqueIPs ?? 0).toLocaleString() : "Admin only", icon: Users, color: "text-violet-400" },
            { label: "Block Rate", value: isAdmin ? `${(((secDashboard as any)?.blockedRequests ?? 0) / Math.max((secDashboard as any)?.totalRequests ?? 1, 1) * 100).toFixed(2)}%` : "Admin only", icon: TrendingUp, color: "text-yellow-400" },
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

        {/* Rate Limit Rules */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              Active Rate Limit Rules
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 text-xs">
                    <th className="text-left p-3 font-medium">Endpoint</th>
                    <th className="text-left p-3 font-medium">Description</th>
                    <th className="text-center p-3 font-medium">Limit</th>
                    <th className="text-center p-3 font-medium">Window</th>
                    <th className="text-center p-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {RATE_LIMIT_RULES.map(rule => (
                    <tr key={rule.endpoint} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                      <td className="p-3 font-mono text-xs text-violet-400">{rule.endpoint}</td>
                      <td className="p-3 text-zinc-300 text-xs">{rule.description}</td>
                      <td className="p-3 text-center font-bold text-white">{rule.limit}</td>
                      <td className="p-3 text-center text-zinc-400 text-xs">{rule.window}</td>
                      <td className="p-3 text-center">
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />Active
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Top Offenders */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                Top Offenders (24h)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {!isAdmin ? (
                <div className="p-6 text-center text-zinc-500 text-sm">Admin access required</div>
              ) : ((secDashboard as any)?.topOffenders ?? []).length === 0 ? (
                <div className="p-6 text-center text-zinc-500 text-sm">No offenders recorded in the last 24h</div>
              ) : ((secDashboard as any)?.topOffenders ?? []).map((o: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 border-b border-zinc-800 last:border-0">
                  <div>
                    <p className="text-sm font-mono text-white">{o.ip}</p>
                    <p className="text-xs text-zinc-500">{o.endpoint}</p>
                  </div>
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">{o.blocked} blocks</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                Recent Blocks
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {!isAdmin ? (
                <div className="p-6 text-center text-zinc-500 text-sm">Admin access required</div>
              ) : ((secDashboard as any)?.recentBlocks ?? []).length === 0 ? (
                <div className="p-6 text-center text-zinc-500 text-sm">No blocks recorded recently</div>
              ) : ((secDashboard as any)?.recentBlocks ?? []).map((b: any, i: number) => (
                <div key={i} className="p-3 border-b border-zinc-800 last:border-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-mono text-white">{b.ip}</span>
                    <span className="text-xs text-zinc-500">{b.time}</span>
                  </div>
                  <p className="text-xs text-zinc-400">{b.endpoint} — {b.reason}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
