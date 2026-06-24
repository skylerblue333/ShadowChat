import { useState, useEffect } from "react";
import { Activity, CheckCircle, XCircle, Clock, Cpu, HardDrive, Wifi, Database, Zap, RefreshCw, AlertTriangle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";

const SERVICES = [
  { name: "API Server",       status: "healthy",  latency: 12,  uptime: "99.98%", icon: Zap },
  { name: "Database (MySQL)", status: "healthy",  latency: 8,   uptime: "99.99%", icon: Database },
  { name: "Auth Service",     status: "healthy",  latency: 23,  uptime: "99.97%", icon: CheckCircle },
  { name: "File Storage (S3)",status: "healthy",  latency: 45,  uptime: "99.95%", icon: HardDrive },
  { name: "WebSocket Server", status: "degraded", latency: 120, uptime: "98.20%", icon: Wifi },
  { name: "AI/LLM Gateway",   status: "healthy",  latency: 340, uptime: "99.80%", icon: Cpu },
  { name: "CDN Edge",         status: "healthy",  latency: 6,   uptime: "99.99%", icon: TrendingUp },
  { name: "Notification Svc", status: "healthy",  latency: 18,  uptime: "99.90%", icon: Activity },
];

const RECENT_INCIDENTS = [
  { id: 1, title: "WebSocket latency spike",   severity: "warning", time: "2h ago",  resolved: false },
  { id: 2, title: "DB connection pool exhausted", severity: "error", time: "6h ago", resolved: true  },
  { id: 3, title: "CDN cache purge completed",  severity: "info",   time: "12h ago", resolved: true  },
];

const STATUS_COLORS: Record<string, string> = {
  healthy:  "text-green-400",
  degraded: "text-yellow-400",
  down:     "text-red-400",
};

const STATUS_BG: Record<string, string> = {
  healthy:  "bg-green-900/20 border-green-500/20",
  degraded: "bg-yellow-900/20 border-yellow-500/20",
  down:     "bg-red-900/20 border-red-500/20",
};

const SEVERITY_COLORS: Record<string, string> = {
  info:    "bg-blue-900/30 text-blue-300 border-blue-500/20",
  warning: "bg-yellow-900/30 text-yellow-300 border-yellow-500/20",
  error:   "bg-red-900/30 text-red-300 border-red-500/20",
};

export default function ServerHealth() {
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  const [ts] = useState(() => Date.now());
  const { data: healthData, refetch } = trpc.system.health.useQuery({ timestamp: ts }, {
    refetchInterval: autoRefresh ? 10000 : false,
    retry: false,
  });

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setLastRefresh(new Date());
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const handleRefresh = () => {
    refetch();
    setLastRefresh(new Date());
  };

  const healthyCount = SERVICES.filter(s => s.status === "healthy").length;
  const degradedCount = SERVICES.filter(s => s.status === "degraded").length;
  const downCount = SERVICES.filter(s => s.status === "down").length;
  const overallStatus = downCount > 0 ? "down" : degradedCount > 0 ? "degraded" : "healthy";

  return (
    <div className="min-h-screen bg-[#050308] text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#050308]/95 backdrop-blur border-b border-slate-800 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-400" />
            <span className="font-black text-white">Server Health</span>
            <Badge className={`text-[10px] px-2 py-0.5 border ${STATUS_BG[overallStatus]} ${STATUS_COLORS[overallStatus]}`}>
              {overallStatus === "healthy" ? "All Systems Operational" : overallStatus === "degraded" ? "Partial Degradation" : "Outage Detected"}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoRefresh(a => !a)}
              className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${autoRefresh ? "border-green-500/30 bg-green-900/20 text-green-400" : "border-slate-700 text-slate-500"}`}
            >
              {autoRefresh ? "Auto-refresh ON" : "Auto-refresh OFF"}
            </button>
            <Button size="sm" variant="outline" onClick={handleRefresh} className="border-slate-700 text-slate-400 hover:text-white">
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Healthy",  value: healthyCount,  color: "text-green-400",  bg: "bg-green-900/20 border-green-500/20" },
            { label: "Degraded", value: degradedCount, color: "text-yellow-400", bg: "bg-yellow-900/20 border-yellow-500/20" },
            { label: "Down",     value: downCount,     color: "text-red-400",    bg: "bg-red-900/20 border-red-500/20" },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={`border rounded-xl p-4 text-center ${bg}`}>
              <p className={`text-3xl font-black ${color}`}>{value}</p>
              <p className="text-xs text-slate-400 mt-1">{label} Services</p>
            </div>
          ))}
        </div>

        {/* Services grid */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Service Status</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {SERVICES.map(svc => {
              const Icon = svc.icon;
              return (
                <div key={svc.name} className={`flex items-center gap-3 p-3.5 rounded-xl border ${STATUS_BG[svc.status]}`}>
                  <div className={`w-9 h-9 rounded-lg bg-slate-900/50 flex items-center justify-center shrink-0`}>
                    <Icon className={`w-4 h-4 ${STATUS_COLORS[svc.status]}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{svc.name}</p>
                    <p className="text-xs text-slate-500">Uptime: {svc.uptime}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-xs font-bold ${STATUS_COLORS[svc.status]} capitalize`}>{svc.status}</p>
                    <p className="text-[10px] text-slate-500">{svc.latency}ms</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* System metrics */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {[
            { label: "CPU Usage",    value: 34,  unit: "%", color: "bg-blue-500",   icon: Cpu },
            { label: "Memory",       value: 61,  unit: "%", color: "bg-purple-500", icon: HardDrive },
            { label: "Disk I/O",     value: 18,  unit: "%", color: "bg-green-500",  icon: Database },
          ].map(({ label, value, unit, color, icon: Icon }) => (
            <div key={label} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-400">{label}</span>
                </div>
                <span className="text-lg font-black text-white">{value}{unit}</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${value}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Recent incidents */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              Recent Incidents
            </h2>
            <span className="text-xs text-slate-500">Last updated: {lastRefresh.toLocaleTimeString()}</span>
          </div>
          <div className="divide-y divide-slate-800">
            {RECENT_INCIDENTS.map(inc => (
              <div key={inc.id} className="flex items-center gap-4 p-4 hover:bg-slate-800/30 transition-colors">
                <Badge className={`text-[9px] px-1.5 py-0.5 border ${SEVERITY_COLORS[inc.severity]} shrink-0`}>{inc.severity}</Badge>
                <p className="text-sm text-white flex-1">{inc.title}</p>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-slate-500">{inc.time}</span>
                  {inc.resolved ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Clock className="w-4 h-4 text-yellow-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
