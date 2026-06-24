/**
 * SystemArchitecture — Production Scaling Architecture
 * Infrastructure overview, service topology, scaling strategy
 */
import { Link } from "wouter";
import { ArrowLeft, Server, Database, Zap, Globe, Shield, Activity } from "lucide-react";

const SERVICES = [
  { name: "Action Engine", desc: "Intent parsing, routing, execution", tech: "Node.js + tRPC", status: "live", load: 72 },
  { name: "AI Layer", desc: "LLM inference, intent classification", tech: "OpenAI / Claude", status: "live", load: 45 },
  { name: "Real-time Bus", desc: "WebSocket events, pub/sub", tech: "Socket.io + Redis", status: "live", load: 38 },
  { name: "Wallet Service", desc: "Balances, transactions, escrow", tech: "Node.js + MySQL", status: "live", load: 28 },
  { name: "Feed Engine", desc: "Ranking, personalization, trending", tech: "Node.js + Redis", status: "live", load: 55 },
  { name: "Media Pipeline", desc: "Upload, transcode, CDN delivery", tech: "S3 + FFmpeg", status: "live", load: 22 },
  { name: "Trust System", desc: "Fraud detection, moderation, RBAC", tech: "Node.js + ML", status: "live", load: 18 },
  { name: "Persona Engine", desc: "AI social actors, behavior simulation", tech: "Node.js + LLM", status: "live", load: 31 },
];

const SCALING_TIERS = [
  { tier: "0→1K users", strategy: "Single server, Autoscale, SQLite→MySQL", cost: "$0–$50/mo" },
  { tier: "1K→10K users", strategy: "Redis caching, CDN, read replicas", cost: "$200–$500/mo" },
  { tier: "10K→100K users", strategy: "Horizontal scaling, queue workers, sharding", cost: "$1K–$5K/mo" },
  { tier: "100K+ users", strategy: "Microservices, Kubernetes, global CDN", cost: "$10K+/mo" },
];

export default function SystemArchitecture() {
  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
        <Link href="/" className="p-2 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-bold text-lg flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-400" />
            System Architecture
          </h1>
          <p className="text-xs text-muted-foreground">Production infrastructure overview</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Architecture overview */}
        <div className="card p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
          <h3 className="font-bold text-sm mb-3">Platform Architecture</h3>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            {[
              { label: "Frontend", tech: "React 19 + Vite", icon: Globe },
              { label: "API Layer", tech: "tRPC + Express", icon: Zap },
              { label: "Database", tech: "MySQL + Redis", icon: Database },
            ].map(l => (
              <div key={l.label} className="p-2 bg-background/50 rounded-lg">
                <l.icon className="w-4 h-4 text-primary mx-auto mb-1" />
                <div className="font-medium">{l.label}</div>
                <div className="text-muted-foreground">{l.tech}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Services */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm">Active Services</h3>
          {SERVICES.map(s => (
            <div key={s.name} className="card p-3">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <span className="font-medium text-sm">{s.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">{s.tech}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{s.load}%</span>
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${s.load > 70 ? "bg-red-400" : s.load > 50 ? "bg-yellow-400" : "bg-green-400"}`} style={{ width: `${s.load}%` }} />
                </div>
                <span className="text-xs text-muted-foreground">{s.desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Scaling tiers */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm">Scaling Strategy</h3>
          {SCALING_TIERS.map((t, i) => (
            <div key={i} className={`card p-3 ${i === 0 ? "border-primary/30 bg-primary/5" : ""}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">{t.tier}</span>
                <span className="text-xs text-green-400">{t.cost}</span>
              </div>
              <p className="text-xs text-muted-foreground">{t.strategy}</p>
            </div>
          ))}
        </div>

        {/* Security */}
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-green-400" />
            <h3 className="font-semibold text-sm">Security Layers</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {["JWT Auth", "Rate Limiting", "CSRF Protection", "Input Validation", "Encryption at Rest", "TLS in Transit"].map(s => (
              <div key={s} className="flex items-center gap-1.5 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
