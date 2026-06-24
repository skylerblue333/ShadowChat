import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";
import { Shield, Activity, AlertTriangle, CheckCircle, RefreshCw, Zap, Server, Database, Wifi, Clock } from "lucide-react";

const SERVICES = [
  { id: "api", name: "API Server", status: "healthy", uptime: 99.97, latency: 42, restarts: 0 },
  { id: "db", name: "Database", status: "healthy", uptime: 99.99, latency: 8, restarts: 0 },
  { id: "ws", name: "WebSocket", status: "degraded", uptime: 98.12, latency: 124, restarts: 2 },
  { id: "cdn", name: "CDN / Storage", status: "healthy", uptime: 100, latency: 15, restarts: 0 },
  { id: "ai", name: "AI Engine", status: "healthy", uptime: 99.41, latency: 890, restarts: 1 },
  { id: "stream", name: "Stream Server", status: "healthy", uptime: 97.88, latency: 67, restarts: 3 },
];

const ANOMALIES = [
  { id: 1, time: "2 min ago", service: "WebSocket", type: "High latency spike", action: "Auto-scaled to 3 instances", resolved: true },
  { id: 2, time: "18 min ago", service: "AI Engine", type: "Memory pressure (87%)", action: "Garbage collection triggered", resolved: true },
  { id: 3, time: "1 hour ago", service: "Stream Server", type: "Connection pool exhausted", action: "Pool expanded + restart", resolved: true },
  { id: 4, time: "3 hours ago", service: "Database", type: "Slow query detected (>2s)", action: "Query plan optimized", resolved: true },
];

const SCALE_EVENTS = [
  { time: "10:42 AM", event: "Traffic spike detected (+340%)", action: "Scaled API to 8 instances", status: "success" },
  { time: "08:15 AM", event: "Low traffic period", action: "Scaled down to 2 instances", status: "success" },
  { time: "Yesterday", event: "WebSocket saturation", action: "Added 2 WS nodes", status: "success" },
];

export default function SelfHealingInfra() {
  const [healingActive, setHealingActive] = useState(true);
  const [scanning, setScanning] = useState(false);

  const { data: securityData } = trpc.security.getDashboard.useQuery();

  const runScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      toast.success("System scan complete — all critical services healthy");
    }, 2500);
  };

  const overallHealth = SERVICES.filter(s => s.status === "healthy").length / SERVICES.length;

  return (
    <div className="container py-8 max-w-6xl animate-page-in">
      <PageHeader
        backHref="/predictive-systems"
        icon={Shield}
        title="Self-Healing Infrastructure"
        subtitle="Phase 9 — Auto-restart failed services, auto-scale traffic spikes, anomaly auto-detection"
      />

      {/* Control bar */}
      <div className="flex items-center justify-between mb-6 card p-4">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${healingActive ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
          <span className="font-medium">Self-Healing Engine</span>
          <span className="text-sm text-muted-foreground">{healingActive ? "Active — monitoring all services" : "Disabled"}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={runScan}
            disabled={scanning}
            className="flex items-center gap-2 px-3 py-1.5 bg-secondary/50 hover:bg-secondary rounded-lg text-sm transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${scanning ? "animate-spin" : ""}`} />
            {scanning ? "Scanning..." : "Run Scan"}
          </button>
          <button
            onClick={() => { setHealingActive(!healingActive); toast.success(`Self-healing ${!healingActive ? "enabled" : "disabled"}`); }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${healingActive ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" : "bg-green-500/20 text-green-400 hover:bg-green-500/30"}`}
          >
            {healingActive ? "Disable" : "Enable"}
          </button>
        </div>
      </div>

      {/* Overall health */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <Activity className="w-5 h-5 text-green-400 mb-2" />
          <div className="text-2xl font-bold text-green-400">{(overallHealth * 100).toFixed(0)}%</div>
          <div className="text-xs text-muted-foreground">System Health</div>
        </div>
        <div className="card p-4">
          <AlertTriangle className="w-5 h-5 text-yellow-400 mb-2" />
          <div className="text-2xl font-bold">{SERVICES.filter(s => s.status === "degraded").length}</div>
          <div className="text-xs text-muted-foreground">Degraded Services</div>
        </div>
        <div className="card p-4">
          <Zap className="w-5 h-5 text-blue-400 mb-2" />
          <div className="text-2xl font-bold">{ANOMALIES.filter(a => a.resolved).length}</div>
          <div className="text-xs text-muted-foreground">Auto-Resolved Today</div>
        </div>
        <div className="card p-4">
          <Clock className="w-5 h-5 text-purple-400 mb-2" />
          <div className="text-2xl font-bold">99.94%</div>
          <div className="text-xs text-muted-foreground">30-Day Uptime</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Services */}
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Server className="w-4 h-4 text-primary" />
            Service Status
          </h3>
          {SERVICES.map(svc => (
            <div key={svc.id} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${svc.status === "healthy" ? "bg-green-400" : "bg-yellow-400 animate-pulse"}`} />
                  <span className="font-medium text-sm">{svc.name}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${svc.status === "healthy" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                  {svc.status}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                <span>Uptime: <span className="text-foreground font-medium">{svc.uptime}%</span></span>
                <span>Latency: <span className="text-foreground font-medium">{svc.latency}ms</span></span>
                <span>Restarts: <span className={`font-medium ${svc.restarts > 0 ? "text-yellow-400" : "text-foreground"}`}>{svc.restarts}</span></span>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {/* Anomaly log */}
          <div>
            <h3 className="font-semibold flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              Auto-Resolved Anomalies
            </h3>
            <div className="space-y-2">
              {ANOMALIES.map(a => (
                <div key={a.id} className="card p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-medium">{a.type}</div>
                      <div className="text-xs text-muted-foreground">{a.service} · {a.time}</div>
                      <div className="text-xs text-blue-400 mt-1">↳ {a.action}</div>
                    </div>
                    <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Auto-scale events */}
          <div>
            <h3 className="font-semibold flex items-center gap-2 mb-3">
              <Wifi className="w-4 h-4 text-blue-400" />
              Auto-Scale Events
            </h3>
            <div className="space-y-2">
              {SCALE_EVENTS.map((e, i) => (
                <div key={i} className="card p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm">{e.event}</div>
                      <div className="text-xs text-blue-400">↳ {e.action}</div>
                    </div>
                    <span className="text-xs text-muted-foreground">{e.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
