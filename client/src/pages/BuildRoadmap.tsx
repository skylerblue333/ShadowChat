/**
 * BuildRoadmap — Phase 29 Build Order
 * Foundation → Chat → AI → Actions → Feed → Simulation → Economy → Trust → OS → Merge
 */
import { Link } from "wouter";
import { ArrowLeft, Map, CheckCircle2, Circle, Clock, ArrowDown } from "lucide-react";

const PHASES = [
  {
    step: 1,
    title: "Foundation",
    timeline: "Day 1–3",
    goal: "System can run + store data",
    items: ["MySQL database", "Redis cache + queues", "Auth system (JWT)", "Basic user model", "API gateway (tRPC)"],
    result: "Users can sign in + system is alive",
    status: "complete",
  },
  {
    step: 2,
    title: "Chat Core",
    timeline: "Day 4–7",
    goal: "Real-time communication exists",
    items: ["WebSocket server", "Chat service", "Message storage", "Basic frontend chat UI"],
    result: "Users can talk in real time",
    status: "complete",
  },
  {
    step: 3,
    title: "AI Intelligence Layer",
    timeline: "Day 8–12",
    goal: "Chat becomes smart",
    items: ["AI service (intent parser)", "Response generator", "Message-to-intent pipeline", "LLM integration"],
    result: "Chat understands user requests",
    status: "complete",
  },
  {
    step: 4,
    title: "Action Engine",
    timeline: "Day 13–18",
    goal: "AI can DO things, not just talk",
    items: ["Action router", "Action executor", "Action state machine (PENDING→COMPLETED→FAILED)", "Event system"],
    result: "Chat produces real system effects",
    status: "complete",
  },
  {
    step: 5,
    title: "Feed System",
    timeline: "Day 19–24",
    goal: "Platform feels alive",
    items: ["Post storage", "Ranking engine", "Feed generator", "AI auto-posting (light)"],
    result: "Users see activity even without users",
    status: "complete",
  },
  {
    step: 6,
    title: "Simulation Engine",
    timeline: "Day 25–30",
    goal: "AI world starts existing",
    items: ["Persona system", "Scheduled actions", "Event triggers", "Auto interactions"],
    result: "AI entities generate feed content",
    status: "complete",
  },
  {
    step: 7,
    title: "Economic Layer",
    timeline: "Day 31–35",
    goal: "System can make money",
    items: ["Wallet (basic ledger)", "Transaction system", "Action fees", "Payment simulation → Stripe"],
    result: "Actions have value attached",
    status: "in-progress",
  },
  {
    step: 8,
    title: "Trust + Safety",
    timeline: "Day 36–40",
    goal: "System becomes stable",
    items: ["Moderation rules", "Rate limits", "Audit logs", "Basic trust score"],
    result: "System can survive real users",
    status: "in-progress",
  },
  {
    step: 9,
    title: "Frontend OS Polish",
    timeline: "Day 41–45",
    goal: "Feels like a real product",
    items: ["Chat OS UI", "Feed UI", "Action drawer", "Wallet UI", "Notification system"],
    result: "Feels like AI operating system",
    status: "in-progress",
  },
  {
    step: 10,
    title: "Simulation + Real User Merge",
    timeline: "Day 46–50",
    goal: "Combine AI world + real users",
    items: ["AI personas interact with real users", "Feed blending system", "Personalization layer", "Hybrid engagement engine"],
    result: "World feels alive even at zero users",
    status: "pending",
  },
];

const STATUS_CONFIG = {
  complete: { icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20", label: "Complete" },
  "in-progress": { icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20", label: "In Progress" },
  pending: { icon: Circle, color: "text-muted-foreground", bg: "bg-secondary/30 border-border/30", label: "Pending" },
};

export default function BuildRoadmap() {
  const complete = PHASES.filter(p => p.status === "complete").length;
  const inProgress = PHASES.filter(p => p.status === "in-progress").length;

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
        <Link href="/" className="p-2 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-bold text-lg flex items-center gap-2">
            <Map className="w-5 h-5 text-yellow-400" />
            Build Roadmap
          </h1>
          <p className="text-xs text-muted-foreground">Phase 29 — Dependency-ordered build sequence</p>
        </div>
        <div className="ml-auto text-right">
          <div className="text-sm font-bold text-green-400">{complete}/{PHASES.length} done</div>
          <div className="text-xs text-muted-foreground">{inProgress} in progress</div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-3">
        {/* Progress bar */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2 text-xs">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-medium">{Math.round((complete / PHASES.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-400 to-cyan-400 rounded-full transition-all"
              style={{ width: `${(complete / PHASES.length) * 100}%` }} />
          </div>
          <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400" />{complete} complete</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400" />{inProgress} in progress</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-secondary" />{PHASES.length - complete - inProgress} pending</span>
          </div>
        </div>

        {/* System flow */}
        <div className="card p-3 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
          <h3 className="text-xs font-semibold mb-2">System Flow</h3>
          <div className="flex items-center gap-1 flex-wrap text-xs text-muted-foreground">
            {["User", "Chat", "AI", "Action Engine", "Event System", "Feed", "Simulation", "Frontend Update", "Loop"].map((s, i, arr) => (
              <span key={s} className="flex items-center gap-1">
                <span className="text-foreground font-medium">{s}</span>
                {i < arr.length - 1 && <span className="text-primary">→</span>}
              </span>
            ))}
          </div>
        </div>

        {/* Phase list */}
        {PHASES.map((phase, i) => {
          const cfg = STATUS_CONFIG[phase.status as keyof typeof STATUS_CONFIG];
          const Icon = cfg.icon;
          return (
            <div key={phase.step}>
              <div className={`card p-4 border ${cfg.bg}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${phase.status === "complete" ? "bg-green-500/20" : phase.status === "in-progress" ? "bg-yellow-500/20" : "bg-secondary/50"}`}>
                    <Icon className={`w-4 h-4 ${cfg.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-sm">Step {phase.step}: {phase.title}</span>
                      <span className={`text-xs ${cfg.color}`}>{cfg.label}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-muted-foreground">{phase.timeline}</span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground italic">{phase.goal}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1 mb-2">
                      {phase.items.map(item => (
                        <div key={item} className="flex items-center gap-1 text-xs text-muted-foreground">
                          <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${phase.status === "complete" ? "bg-green-400" : phase.status === "in-progress" ? "bg-yellow-400" : "bg-secondary"}`} />
                          {item}
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-foreground font-medium">
                      Result: <span className="text-muted-foreground font-normal">{phase.result}</span>
                    </div>
                  </div>
                </div>
              </div>
              {i < PHASES.length - 1 && (
                <div className="flex justify-center py-1">
                  <ArrowDown className="w-4 h-4 text-muted-foreground/40" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
