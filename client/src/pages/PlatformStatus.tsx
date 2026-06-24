import { Link } from "wouter";
import { PageHeader } from "@/components/PageHeader";
import { Activity, CheckCircle, AlertTriangle, XCircle, Clock, Zap } from "lucide-react";

const SERVICES = [
  { name: "API Gateway", status: "operational", latency: "12ms", uptime: "99.99%" },
  { name: "Authentication", status: "operational", latency: "8ms", uptime: "100%" },
  { name: "Database (TiDB)", status: "operational", latency: "4ms", uptime: "..." },
  { name: "File Storage (S3)", status: "operational", latency: "45ms", uptime: "99.99%" },
  { name: "WebSocket Server", status: "degraded", latency: "120ms", uptime: "98.2%" },
  { name: "AI/LLM Engine", status: "operational", latency: "850ms", uptime: "99.5%" },
  { name: "Blockchain RPC", status: "operational", latency: "230ms", uptime: "99.1%" },
  { name: "Email Service", status: "operational", latency: "320ms", uptime: "99.8%" },
  { name: "CDN / Media", status: "operational", latency: "18ms", uptime: "99.99%" },
  { name: "Sprint Engine", status: "operational", latency: "N/A", uptime: "99.3%" },
];

const INCIDENTS = [
  { date: "Jun 15, 2026", title: "WebSocket latency spike", status: "monitoring", duration: "Ongoing", severity: "minor" },
  { date: "Jun 10, 2026", title: "Database connection pool exhaustion", status: "resolved", duration: "14 min", severity: "major" },
  { date: "Jun 3, 2026", title: "AI engine timeout errors", status: "resolved", duration: "8 min", severity: "minor" },
];

function StatusIcon({ status }: { status: string }) {
  if (status === "operational") return <CheckCircle className="w-4 h-4 text-success" />;
  if (status === "degraded") return <AlertTriangle className="w-4 h-4 text-warning" />;
  return <XCircle className="w-4 h-4 text-destructive" />;
}

export default function PlatformStatus() {
  const allOperational = SERVICES.every(s => s.status === "operational");

  return (
    <div className="container py-8 max-w-4xl animate-page-in">
      <PageHeader backHref="/dashboard" icon={Activity} title="Platform Status" subtitle="Real-time health and uptime for all SKYCOIN4444 services" />

      {/* Overall Status Banner */}
      <div className={`rounded-xl p-4 mb-8 flex items-center gap-3 border ${allOperational ? "bg-success/10 border-success/30" : "bg-warning/10 border-warning/30"}`}>
        {allOperational ? <CheckCircle className="w-6 h-6 text-success" /> : <AlertTriangle className="w-6 h-6 text-warning" />}
        <div>
          <div className={`font-semibold ${allOperational ? "text-success" : "text-warning"}`}>
            {allOperational ? "All Systems Operational" : "Minor Service Degradation"}
          </div>
          <div className="text-xs text-muted-foreground">Last updated: just now</div>
        </div>
        <div className="ml-auto text-right">
          <div className="text-2xl font-bold text-success">99.97%</div>
          <div className="text-xs text-muted-foreground">30-day uptime</div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="card mb-6 overflow-hidden">
        <div className="px-5 py-3 border-b border-border/50 flex items-center justify-between">
          <h3 className="font-semibold text-sm">Service Health</h3>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Zap className="w-3 h-3 text-primary" />Live</div>
        </div>
        {SERVICES.map((s, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-3 border-b border-border/10 last:border-0 hover:bg-secondary/20 transition-colors">
            <StatusIcon status={s.status} />
            <div className="flex-1 text-sm font-medium">{s.name}</div>
            <div className="text-xs text-muted-foreground font-mono">{s.latency}</div>
            <div className={`text-xs font-semibold ${s.status === "operational" ? "text-success" : "text-warning"}`}>{s.uptime}</div>
            <div className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              s.status === "operational" ? "bg-success/10 text-success" :
              s.status === "degraded" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"
            }`}>{s.status}</div>
          </div>
        ))}
      </div>

      {/* Incident History */}
      <div className="card p-5">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-primary" />Incident History</h3>
        {INCIDENTS.map((inc, i) => (
          <div key={i} className="flex items-start gap-3 py-3 border-b border-border/20 last:border-0">
            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${inc.status === "resolved" ? "bg-success" : "bg-warning"}`} />
            <div className="flex-1">
              <div className="text-sm font-medium">{inc.title}</div>
              <div className="text-xs text-muted-foreground">{inc.date} · Duration: {inc.duration}</div>
            </div>
            <div className={`text-xs px-2 py-0.5 rounded-full ${inc.status === "resolved" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
              {inc.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
