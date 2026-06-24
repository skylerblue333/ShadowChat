/**
 * ProductionArchitecture — Phase 40
 * Cloud deployment design: microservices, event bus, simulation cluster,
 * AI scaling, WebSocket gateway, CI/CD, monitoring stack
 */
import { Server, Zap, Database, Globe, Shield, Activity, GitBranch, Cpu, Network, Cloud } from "lucide-react";

const SERVICES = [
  { name: "chat-service", desc: "WebSocket + message persistence", color: "bg-blue-500/20 text-blue-400", scale: "2-10x" },
  { name: "feed-service", desc: "Feed generation + Redis cache", color: "bg-green-500/20 text-green-400", scale: "3-20x" },
  { name: "ai-service", desc: "Intent parsing + LLM routing", color: "bg-purple-500/20 text-purple-400", scale: "5-50x" },
  { name: "action-service", desc: "Action execution + event emit", color: "bg-orange-500/20 text-orange-400", scale: "2-15x" },
  { name: "wallet-service", desc: "Payments + transaction log", color: "bg-yellow-500/20 text-yellow-400", scale: "2-8x" },
  { name: "simulation-service", desc: "Persona tick + world engine", color: "bg-cyan-500/20 text-cyan-400", scale: "1-5x" },
  { name: "auth-service", desc: "Sessions + OAuth + RBAC", color: "bg-red-500/20 text-red-400", scale: "2-10x" },
  { name: "notification-service", desc: "Push + email + in-app", color: "bg-pink-500/20 text-pink-400", scale: "2-12x" },
];

const DB_LAYERS = [
  { name: "PostgreSQL (Primary)", desc: "Users, transactions, actions — source of truth", icon: "🐘" },
  { name: "Redis (Cache)", desc: "Feed projections, sessions, real-time state", icon: "⚡" },
  { name: "Kafka / NATS (Events)", desc: "Event bus, simulation triggers, worker queues", icon: "📡" },
  { name: "ClickHouse (Analytics)", desc: "Aggregated metrics, revenue analytics, AI training data", icon: "📊" },
];

const MONITORING = [
  { tool: "Prometheus", purpose: "Metrics collection — latency, throughput, error rates" },
  { tool: "Grafana", purpose: "Real-time dashboards — AI cost, revenue per action, uptime" },
  { tool: "ELK Stack", purpose: "Centralized logs — all services, errors, audit trail" },
  { tool: "OpenTelemetry", purpose: "Distributed tracing — request flow across microservices" },
];

const CICD_STEPS = [
  "Git push → GitHub Actions trigger",
  "Build + lint + type check",
  "Docker image build per service",
  "Automated test suite (vitest)",
  "Deploy to staging (Kubernetes)",
  "Health checks + smoke tests",
  "Deploy to production (rolling)",
  "Monitor + alert on anomalies",
];

export default function ProductionArchitecture() {
  return (
    <div className="min-h-screen bg-background p-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
            <Cloud className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Production Architecture</h1>
            <p className="text-sm text-muted-foreground">Phase 40 — Cloud Deployment + Scalability Design</p>
          </div>
        </div>
        <div className="mt-3 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-sm text-cyan-400">
          "ShadowChat is a distributed AI-native OS deployed on cloud microservices with event-driven simulation, real-time communication, and scalable monetization."
        </div>
      </div>

      {/* System flow */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Network className="w-4 h-4 text-cyan-400" />
          <h2 className="font-semibold">Global System Flow</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {["User", "CDN (Cloudflare)", "Frontend (OS/Legacy)", "API Gateway (NGINX)", "Microservices Cluster", "Event Bus (Kafka)", "Simulation Engine + AI", "Databases + Redis", "WebSocket Gateway", "UI Update"].map((step, i, arr) => (
            <div key={step} className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-lg bg-secondary/50 text-xs font-medium">{step}</div>
              {i < arr.length - 1 && <span className="text-muted-foreground">→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Microservices */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Server className="w-4 h-4 text-purple-400" />
          <h2 className="font-semibold">Independent Microservices (each scales separately)</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SERVICES.map(s => (
            <div key={s.name} className="card p-4 flex items-start gap-3">
              <div className={`px-2 py-1 rounded-lg text-xs font-mono font-bold ${s.color}`}>{s.name}</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{s.desc}</p>
                <p className="text-xs text-green-400 mt-1">Scale: {s.scale} instances</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Database layers */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Database className="w-4 h-4 text-green-400" />
          <h2 className="font-semibold">Database Stack (split by purpose)</h2>
        </div>
        <div className="space-y-2">
          {DB_LAYERS.map(db => (
            <div key={db.name} className="card p-3 flex items-center gap-3">
              <span className="text-xl">{db.icon}</span>
              <div>
                <div className="font-medium text-sm">{db.name}</div>
                <div className="text-xs text-muted-foreground">{db.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI scaling */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Cpu className="w-4 h-4 text-purple-400" />
          <h2 className="font-semibold">AI Scaling Layer (cost control)</h2>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {["Request", "AI Gateway", "Model Router", "Cache Check", "Execution", "Response"].map((step, i, arr) => (
            <div key={step} className="flex items-center gap-2">
              <div className="px-2 py-1 rounded bg-purple-500/20 text-purple-400">{step}</div>
              {i < arr.length - 1 && <span className="text-muted-foreground">→</span>}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3 mt-3">
          {[["Fast", "Chat responses", "< 200ms"], ["Medium", "Analysis tasks", "< 2s"], ["Heavy", "Action execution", "< 10s"]].map(([tier, use, latency]) => (
            <div key={tier} className="bg-secondary/30 rounded-xl p-3 text-center">
              <div className="font-bold text-sm">{tier}</div>
              <div className="text-xs text-muted-foreground">{use}</div>
              <div className="text-xs text-green-400">{latency}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Auto-scaling rules */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-yellow-400" />
          <h2 className="font-semibold">Auto-Scaling Rules</h2>
        </div>
        <div className="space-y-2 text-sm">
          {[
            ["CPU > 70%", "Scale up service instances automatically"],
            ["Event queue grows", "Scale worker pool to drain backlog"],
            ["AI cost spikes", "Throttle model usage, route to cheaper tier"],
            ["WebSocket connections > 10K", "Add gateway nodes"],
            ["DB read latency > 100ms", "Scale read replicas"],
          ].map(([trigger, action]) => (
            <div key={trigger} className="flex items-start gap-3 p-2 rounded-lg bg-secondary/20">
              <span className="text-yellow-400 font-mono text-xs shrink-0">IF {trigger}</span>
              <span className="text-muted-foreground text-xs">→ {action}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CI/CD */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-3">
          <GitBranch className="w-4 h-4 text-cyan-400" />
          <h2 className="font-semibold">CI/CD Pipeline</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {CICD_STEPS.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-secondary/50 text-xs">
                <span className="text-muted-foreground">{i + 1}.</span>
                {step}
              </div>
              {i < CICD_STEPS.length - 1 && <span className="text-muted-foreground text-xs">→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Monitoring */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-4 h-4 text-green-400" />
          <h2 className="font-semibold">Observability Stack</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MONITORING.map(m => (
            <div key={m.tool} className="card p-3">
              <div className="font-semibold text-sm text-green-400">{m.tool}</div>
              <div className="text-xs text-muted-foreground mt-1">{m.purpose}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Failover */}
      <div className="card p-5 border-red-500/20">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-red-400" />
          <h2 className="font-semibold">Failover + Resilience</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {["Service redundancy (multi-instance)", "Fallback AI responses", "Degraded mode (feed-only)", "Retry queues for events"].map(item => (
            <div key={item} className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-xs text-red-400 text-center">{item}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
