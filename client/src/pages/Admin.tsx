import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield, Users, Activity, Lock, Database, Eye, Loader2,
  AlertTriangle, CheckCircle, Clock, Server
} from "lucide-react";
import { getLoginUrl } from "@/const";

export default function Admin() {
  const { user, isAuthenticated, loading } = useAuth();
  const { data: stats, isLoading: statsLoading } = trpc.platform.stats.useQuery();
  const { data: health } = trpc.platform.health.useQuery();
  const { data: modStats } = trpc.moderation.stats.useQuery(undefined, { enabled: isAuthenticated && user?.role === "admin" });
  const { data: modLogs } = trpc.moderation.logs.useQuery(undefined, { enabled: isAuthenticated && user?.role === "admin" });

  if (!isAuthenticated && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="stat-card p-12 text-center max-w-md">
          <Lock className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Admin Access Required</h2>
          <p className="text-muted-foreground mb-6">This area is restricted to platform administrators.</p>
          <a href={getLoginUrl()}>
            <Button className="bg-red-500 hover:bg-red-600 text-white font-semibold">Sign In</Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Admin <span className="text-red-500">Panel</span>
            </h1>
            <p className="text-muted-foreground">Platform administration and moderation dashboard</p>
          </div>
          <Badge variant="outline" className="border-purple-500/30 text-purple-400 flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-purple-600 animate-pulse" />
            {health?.status === "healthy" ? "HEALTHY" : "CHECKING"}
          </Badge>
        </div>

        {statsLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Platform Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="stat-card">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Users</span>
                </div>
                <div className="text-2xl font-bold font-mono">{(stats?.totalUsers || 0).toLocaleString()}</div>
              </div>
              <div className="stat-card">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-cyber-blue" />
                  <span className="text-xs text-muted-foreground">Posts</span>
                </div>
                <div className="text-2xl font-bold font-mono">{(stats?.totalPosts || 0).toLocaleString()}</div>
              </div>
              <div className="stat-card">
                <div className="flex items-center gap-2 mb-2">
                  <Server className="w-4 h-4 text-cyber-green" />
                  <span className="text-xs text-muted-foreground">Uptime</span>
                </div>
                <div className="text-2xl font-bold font-mono">{stats?.uptime || 99.97}%</div>
              </div>
              <div className="stat-card">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="w-4 h-4 text-cyber-purple" />
                  <span className="text-xs text-muted-foreground">Version</span>
                </div>
                <div className="text-2xl font-bold font-mono">{stats?.version || "1.0.0"}</div>
              </div>
            </div>

            {/* Moderation Stats */}
            {modStats && (
              <div className="stat-card mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-5 h-5 text-red-500" />
                  <h3 className="font-semibold">AI Moderation</h3>
                  <Badge variant="outline" className="text-xs ml-auto">Powered by LLM</Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-background/50 rounded-lg p-3 border border-border/30">
                    <div className="text-xs text-muted-foreground mb-1">Total Actions</div>
                    <div className="font-bold font-mono">{modStats.totalActions || 0}</div>
                  </div>
                  <div className="bg-background/50 rounded-lg p-3 border border-border/30">
                    <div className="text-xs text-muted-foreground mb-1">Auto-flagged</div>
                    <div className="font-bold font-mono">{modStats.autoModerated || 0}</div>
                  </div>
                  <div className="bg-background/50 rounded-lg p-3 border border-border/30">
                    <div className="text-xs text-muted-foreground mb-1">AI Accuracy</div>
                    <div className="font-bold font-mono">{modStats.accuracy ? `${(modStats.accuracy * 100).toFixed(1)}%` : "N/A"}</div>
                  </div>
                  <div className="bg-background/50 rounded-lg p-3 border border-border/30">
                    <div className="text-xs text-muted-foreground mb-1">Last 24h</div>
                    <div className="font-bold font-mono">{modStats.manualReviews || 0}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Moderation Logs */}
            <div className="stat-card">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-5 h-5 text-red-500" />
                <h3 className="font-semibold">Recent Moderation Logs</h3>
              </div>
              {modLogs && modLogs.length > 0 ? (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {modLogs.slice(0, 15).map((log: any, i: number) => (
                    <div key={log.id || i} className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/20">
                      {log.action === "auto_flag" || log.action === "auto_remove" ? (
                        <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-purple-400 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{log.reason || "No reason"}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">{log.contentType}</Badge>
                          <span>{log.action}</span>
                          {log.isAuto && <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-primary/30 text-primary">AI</Badge>}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {log.createdAt ? new Date(log.createdAt).toLocaleDateString() : "—"}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="w-8 h-8 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No moderation logs yet. The AI will log actions as content is scanned.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
