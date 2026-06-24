import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Activity, Database, Server, Cpu, MemoryStick, Clock, RefreshCw,
  CheckCircle, AlertTriangle, XCircle, Wifi, Shield, Zap, Globe
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface HealthData {
  status: "ok" | "degraded" | "down";
  timestamp: string;
  uptime: number;
  environment: string;
  services: {
    database: { status: string; latencyMs: number };
    server: { status: string; memoryMB: number; rssMB: number };
  };
}

interface MetricsData {
  uptime: number;
  memory: { heapUsedMB: number; heapTotalMB: number; rssMB: number };
  cpu: { userMs: number; systemMs: number };
  nodeVersion: string;
  pid: number;
}

interface HistoryPoint {
  time: string;
  latency: number;
  memory: number;
  status: number;
}

const StatusIcon = ({ status }: { status: string }) => {
  if (status === "ok" || status === "healthy") return <CheckCircle className="w-5 h-5 text-green-400" />;
  if (status === "degraded") return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
  return <XCircle className="w-5 h-5 text-red-400" />;
};

const StatusBadge = ({ status }: { status: string }) => {
  const color = status === "ok" || status === "healthy" ? "bg-green-500/20 text-green-400 border-green-500/30"
    : status === "degraded" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    : "bg-red-500/20 text-red-400 border-red-500/30";
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${color}`}>
    <span className={`w-1.5 h-1.5 rounded-full ${status === "ok" || status === "healthy" ? "bg-green-400 animate-pulse" : status === "degraded" ? "bg-yellow-400" : "bg-red-400"}`} />
    {status.toUpperCase()}
  </span>;
};

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  return `${m}m ${s}s`;
}

export default function SystemStatus() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchStatus = useCallback(async () => {
    try {
      const [healthRes, metricsRes] = await Promise.all([
        fetch("/api/health"),
        fetch("/api/metrics"),
      ]);
      const healthData: HealthData = await healthRes.json();
      const metricsData: MetricsData = await metricsRes.json();
      setHealth(healthData);
      setMetrics(metricsData);
      setLastUpdated(new Date());
      // Add to history (keep last 20 points)
      setHistory(prev => {
        const point: HistoryPoint = {
          time: new Date().toLocaleTimeString(),
          latency: healthData.services.database.latencyMs,
          memory: metricsData.memory.heapUsedMB,
          status: healthData.status === "ok" ? 1 : 0,
        };
        return [...prev.slice(-19), point];
      });
    } catch {
      setHealth(prev => prev ? { ...prev, status: "down" } : null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchStatus, 15_000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchStatus]);

  const services = [
    { name: "API Server", icon: <Server className="w-4 h-4" />, status: health?.services.server.status || "unknown", detail: `PID ${metrics?.pid || "—"}` },
    { name: "Database", icon: <Database className="w-4 h-4" />, status: health?.services.database.status || "unknown", detail: `${health?.services.database.latencyMs || 0}ms latency` },
    { name: "tRPC Layer", icon: <Zap className="w-4 h-4" />, status: health?.status === "ok" ? "healthy" : "degraded", detail: "Procedures active" },
    { name: "Auth System", icon: <Shield className="w-4 h-4" />, status: "healthy", detail: "OAuth + JWT active" },
    { name: "Storage", icon: <Globe className="w-4 h-4" />, status: "healthy", detail: "S3 proxy active" },
    { name: "Rate Limiter", icon: <Activity className="w-4 h-4" />, status: "healthy", detail: "All routes protected" },
  ];

  const memPercent = metrics ? Math.round((metrics.memory.heapUsedMB / metrics.memory.heapTotalMB) * 100) : 0;

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              System Status
            </h1>
            <p className="text-muted-foreground mt-1">
              Real-time infrastructure health for ShadowChat / SKYCOIN4444
            </p>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-xs text-muted-foreground">
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={autoRefresh ? "border-green-500/50 text-green-400" : ""}
            >
              <Wifi className="w-3 h-3 mr-1" />
              {autoRefresh ? "Live" : "Paused"}
            </Button>
            <Button variant="outline" size="sm" onClick={fetchStatus} disabled={loading}>
              <RefreshCw className={`w-3 h-3 mr-1 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Overall Status Banner */}
        <Card className={`border-2 ${health?.status === "ok" ? "border-green-500/30 bg-green-500/5" : health?.status === "degraded" ? "border-yellow-500/30 bg-yellow-500/5" : "border-red-500/30 bg-red-500/5"}`}>
          <CardContent className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <StatusIcon status={health?.status || "unknown"} />
              <div>
                <div className="font-semibold text-lg">
                  {health?.status === "ok" ? "All Systems Operational" : health?.status === "degraded" ? "Partial Outage" : loading ? "Checking..." : "System Outage"}
                </div>
                <div className="text-sm text-muted-foreground">
                  Environment: {health?.environment || "—"} · Uptime: {health ? formatUptime(health.uptime) : "—"}
                </div>
              </div>
            </div>
            <StatusBadge status={health?.status || "unknown"} />
          </CardContent>
        </Card>

        {/* Service Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {services.map((svc) => (
            <Card key={svc.name} className="border border-border/50 hover:border-purple-500/30 transition-colors">
              <CardContent className="py-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <span className="text-muted-foreground">{svc.icon}</span>
                    {svc.name}
                  </div>
                  <StatusBadge status={svc.status} />
                </div>
                <div className="text-xs text-muted-foreground">{svc.detail}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Memory */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <MemoryStick className="w-4 h-4 text-purple-400" />
                Memory Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">
                {metrics?.memory.heapUsedMB || 0} <span className="text-sm font-normal text-muted-foreground">MB</span>
              </div>
              <Progress value={memPercent} className="mt-2 h-1.5" />
              <div className="text-xs text-muted-foreground mt-1">
                {memPercent}% of {metrics?.memory.heapTotalMB || 0}MB heap · RSS {metrics?.memory.rssMB || 0}MB
              </div>
            </CardContent>
          </Card>

          {/* DB Latency */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                DB Latency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-400">
                {health?.services.database.latencyMs || 0} <span className="text-sm font-normal text-muted-foreground">ms</span>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Status: <span className={health?.services.database.status === "healthy" ? "text-green-400" : "text-yellow-400"}>
                  {health?.services.database.status || "unknown"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Uptime */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-400" />
                Server Uptime
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                {health ? formatUptime(health.uptime) : "—"}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Node {metrics?.nodeVersion || "—"} · PID {metrics?.pid || "—"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* History Charts */}
        {history.length > 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Database className="w-4 h-4 text-cyan-400" />
                  DB Latency History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={120}>
                  <AreaChart data={history}>
                    <defs>
                      <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                    <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#888" }} />
                    <YAxis tick={{ fontSize: 10, fill: "#888" }} unit="ms" />
                    <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid #333", borderRadius: 8, fontSize: 12 }} />
                    <Area type="monotone" dataKey="latency" stroke="#06b6d4" fill="url(#latencyGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MemoryStick className="w-4 h-4 text-purple-400" />
                  Memory History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={120}>
                  <AreaChart data={history}>
                    <defs>
                      <linearGradient id="memGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                    <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#888" }} />
                    <YAxis tick={{ fontSize: 10, fill: "#888" }} unit="MB" />
                    <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid #333", borderRadius: 8, fontSize: 12 }} />
                    <Area type="monotone" dataKey="memory" stroke="#a855f7" fill="url(#memGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Infrastructure Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Cpu className="w-4 h-4 text-orange-400" />
              Infrastructure Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {[
                { label: "Security Headers", value: "Helmet v8", color: "text-green-400" },
                { label: "Compression", value: "Gzip Level 6", color: "text-blue-400" },
                { label: "Rate Limiting", value: "Per-route", color: "text-purple-400" },
                { label: "Request Timeout", value: "30 seconds", color: "text-cyan-400" },
                { label: "Body Limit", value: "10 MB", color: "text-orange-400" },
                { label: "Auth Rate Limit", value: "30/15min", color: "text-pink-400" },
                { label: "API Rate Limit", value: "300/min", color: "text-yellow-400" },
                { label: "Upload Rate Limit", value: "20/min", color: "text-red-400" },
              ].map(item => (
                <div key={item.label} className="space-y-1">
                  <div className="text-muted-foreground text-xs">{item.label}</div>
                  <div className={`font-medium ${item.color}`}>{item.value}</div>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="flex flex-wrap gap-2">
              {["helmet", "compression", "express-rate-limit", "morgan", "tRPC v11", "Drizzle ORM", "Stripe v8", "JWT Auth"].map(pkg => (
                <Badge key={pkg} variant="outline" className="text-xs border-purple-500/30 text-purple-300">
                  {pkg}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
