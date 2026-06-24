/**
 * BuildOrder — Phase 42
 * Production build order: dependency layers in strict sequence
 * Identity → Chat → Feed → AI → Actions → Real-time → Simulation → Money → Scale
 */
import { CheckCircle, Circle, Clock, Zap, Database, MessageSquare, Rss, Brain, Activity, Globe, DollarSign, Shield, Layers } from "lucide-react";

const PHASES = [
  {
    phase: 1,
    title: "Core Foundation",
    days: "Day 1–3",
    goal: "System boots + users exist + backend is alive",
    icon: Database,
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/20",
    status: "complete",
    items: ["Auth system (users, sessions)", "PostgreSQL schema (users, posts, messages, actions)", "API gateway (single entry point)", "Basic logging system"],
  },
  {
    phase: 2,
    title: "Basic Chat System",
    days: "Day 4–7",
    goal: "Real-time communication works",
    icon: MessageSquare,
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    status: "complete",
    items: ["WebSocket server", "chat-service", "Message persistence", "Simple React chat UI"],
  },
  {
    phase: 3,
    title: "Feed System",
    days: "Day 8–12",
    goal: "Content appears dynamically",
    icon: Rss,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
    status: "complete",
    items: ["Posts table integration", "Feed API", "Basic feed UI", "Redis caching for feed"],
  },
  {
    phase: 4,
    title: "AI Layer",
    days: "Day 13–18",
    goal: "Intelligence appears in system",
    icon: Brain,
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
    status: "complete",
    items: ["AI service (intent parsing)", "Response generator", "Chat → AI pipeline", "Basic context memory"],
  },
  {
    phase: 5,
    title: "Action Engine",
    days: "Day 19–25",
    goal: "System can DO things",
    icon: Zap,
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/20",
    status: "complete",
    items: ["Action service", "Action execution pipeline", "Event emitter system", "Action UI cards"],
  },
  {
    phase: 6,
    title: "Event System + Real-Time Sync",
    days: "Day 26–30",
    goal: "Everything becomes live",
    icon: Activity,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/20",
    status: "in-progress",
    items: ["Event bus (Redis pub/sub)", "WebSocket gateway", "Frontend real-time store (Zustand)", "Live feed updates"],
  },
  {
    phase: 7,
    title: "Simulation Engine",
    days: "Day 31–38",
    goal: "AI world generates content itself",
    icon: Globe,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
    status: "in-progress",
    items: ["Persona system", "Simulation tick engine", "Auto-post generation", "Trend detection system"],
  },
  {
    phase: 8,
    title: "Wallet + Monetization",
    days: "Day 39–45",
    goal: "System makes money",
    icon: DollarSign,
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/20",
    status: "in-progress",
    items: ["Wallet system", "Payment integration (Stripe)", "Action pricing engine", "Transaction logging"],
  },
  {
    phase: 9,
    title: "Legacy + OS Hybrid UI",
    days: "Day 46–50",
    goal: "Both systems run together",
    icon: Layers,
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
    status: "in-progress",
    items: ["Legacy shell", "OS shell", "Mode switching system", "Shared state layer"],
  },
  {
    phase: 10,
    title: "Polish + Scale Prep",
    days: "Day 51–60",
    goal: "Production readiness",
    icon: Shield,
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
    status: "pending",
    items: ["Rate limiting", "Monitoring (logs + metrics)", "Auto-scaling rules", "Error recovery system", "Performance optimization"],
  },
];

const STATUS_ICONS = {
  complete: { icon: CheckCircle, color: "text-green-400", label: "Complete" },
  "in-progress": { icon: Clock, color: "text-yellow-400", label: "In Progress" },
  pending: { icon: Circle, color: "text-muted-foreground", label: "Pending" },
};

export default function BuildOrder() {
  const complete = PHASES.filter(p => p.status === "complete").length;
  const inProgress = PHASES.filter(p => p.status === "in-progress").length;
  const pending = PHASES.filter(p => p.status === "pending").length;

  return (
    <div className="min-h-screen bg-background p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Production Build Order</h1>
            <p className="text-sm text-muted-foreground">Phase 42 — Dependency-ordered implementation sequence</p>
          </div>
        </div>
        <div className="mt-3 p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl text-sm text-orange-400">
          Key insight: Build dependency layers in strict order — not features in parallel.
          <br />
          <span className="text-muted-foreground">Identity → Chat → Feed → AI → Actions → Real-time → Simulation → Money → Scale</span>
        </div>
      </div>

      {/* Progress summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{complete}</div>
          <div className="text-xs text-muted-foreground">Complete</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">{inProgress}</div>
          <div className="text-xs text-muted-foreground">In Progress</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-muted-foreground">{pending}</div>
          <div className="text-xs text-muted-foreground">Pending</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Overall Progress</span>
          <span className="text-sm text-muted-foreground">{Math.round(((complete + inProgress * 0.5) / PHASES.length) * 100)}%</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-yellow-500 rounded-full transition-all"
            style={{ width: `${((complete + inProgress * 0.5) / PHASES.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Phase list */}
      <div className="space-y-3">
        {PHASES.map((p, idx) => {
          const PhaseIcon = p.icon;
          const StatusInfo = STATUS_ICONS[p.status as keyof typeof STATUS_ICONS];
          const StatusIcon = StatusInfo.icon;
          return (
            <div key={p.phase} className={`card p-4 border ${p.bg}`}>
              <div className="flex items-start gap-4">
                {/* Phase number + connector */}
                <div className="flex flex-col items-center shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${p.status === "complete" ? "bg-green-500/20 text-green-400" : p.status === "in-progress" ? "bg-yellow-500/20 text-yellow-400" : "bg-secondary text-muted-foreground"}`}>
                    {p.phase}
                  </div>
                  {idx < PHASES.length - 1 && <div className="w-0.5 h-4 bg-border mt-1" />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <PhaseIcon className={`w-4 h-4 ${p.color}`} />
                    <span className="font-semibold text-sm">{p.title}</span>
                    <span className="text-xs text-muted-foreground">{p.days}</span>
                    <div className={`flex items-center gap-1 ml-auto text-xs ${StatusInfo.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {StatusInfo.label}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 mb-2">Goal: {p.goal}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.items.map(item => (
                      <span key={item} className="px-2 py-0.5 rounded-full bg-secondary/50 text-xs text-muted-foreground">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Key insight */}
      <div className="card p-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/20">
        <h3 className="font-semibold text-sm mb-2">Why This Order Matters</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div>✔ No architectural collapse from premature complexity</div>
          <div>✔ Safe incremental build — working system at every phase</div>
          <div>✔ Monetization appears early (Phase 8)</div>
          <div>✔ Simulation builds on stable base (Phase 7)</div>
          <div>✔ AI layer only added after chat is stable (Phase 4)</div>
          <div>✔ Scale prep is last — optimize what's proven (Phase 10)</div>
        </div>
      </div>
    </div>
  );
}
