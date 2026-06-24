/**
 * MasterArchitecture — Phase 43
 * Single source of truth: full system in one visual blueprint
 * "ShadowChat is a distributed AI-native OS: event-driven microservices,
 *  real-time simulation engine, and dual-interface frontend (legacy + OS),
 *  unified by a shared data and event architecture."
 */
import { useState } from "react";
import { Globe, MessageSquare, Rss, Zap, Brain, Wallet, Activity, Shield, Database, Server, Layers, ArrowRight, ArrowDown, ChevronRight } from "lucide-react";

const LAYERS = [
  {
    id: "experience",
    title: "Experience Layer",
    subtitle: "What the user sees",
    color: "from-purple-500 to-pink-500",
    bg: "bg-purple-500/10 border-purple-500/30",
    icon: Layers,
    nodes: [
      { label: "Feed (Discover)", icon: Rss, route: "/feed", desc: "AI + user + simulation content" },
      { label: "Chat (Execute)", icon: MessageSquare, route: "/chat", desc: "Command terminal + AI" },
      { label: "Profile (Identity)", icon: Globe, route: "/profile", desc: "Trust + reputation + earnings" },
      { label: "Actions (Monetize)", icon: Zap, route: "/actions", desc: "Pay, tip, hire, create" },
      { label: "Dating", icon: Brain, route: "/dating", desc: "AI-ranked matches + chat" },
      { label: "Marketplace", icon: Wallet, route: "/marketplace", desc: "Buy, sell, services" },
    ],
  },
  {
    id: "system",
    title: "System Layer",
    subtitle: "What runs it",
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-500/10 border-blue-500/30",
    icon: Server,
    nodes: [
      { label: "Chat Service", icon: MessageSquare, route: null, desc: "WebSocket + persistence" },
      { label: "Feed Service", icon: Rss, route: null, desc: "Ranking + Redis cache" },
      { label: "Action Engine", icon: Zap, route: "/ai-agents", desc: "Intent → execution" },
      { label: "AI Service", icon: Brain, route: null, desc: "LLM + intent parsing" },
      { label: "Wallet Service", icon: Wallet, route: "/wallet", desc: "Balances + payments" },
      { label: "Auth System", icon: Shield, route: null, desc: "OAuth + RBAC + sessions" },
    ],
  },
  {
    id: "world",
    title: "World Layer",
    subtitle: "What creates content",
    color: "from-green-500 to-emerald-500",
    bg: "bg-green-500/10 border-green-500/30",
    icon: Globe,
    nodes: [
      { label: "Simulation Engine", icon: Activity, route: "/ai-persona-system", desc: "Tick loop + behaviors" },
      { label: "AI Personas", icon: Brain, route: "/ai-persona-system", desc: "Living social actors" },
      { label: "Trend Generator", icon: Rss, route: "/adaptive-personalization", desc: "Hashtags + viral signals" },
      { label: "Event Bus", icon: Zap, route: null, desc: "Kafka/NATS pub/sub" },
      { label: "Notification Service", icon: Activity, route: null, desc: "Push + WebSocket alerts" },
      { label: "Analytics Engine", icon: Database, route: "/creator-intelligence", desc: "Metrics + AI insights" },
    ],
  },
  {
    id: "data",
    title: "Data Layer",
    subtitle: "What stores it",
    color: "from-orange-500 to-red-500",
    bg: "bg-orange-500/10 border-orange-500/30",
    icon: Database,
    nodes: [
      { label: "MySQL (TiDB)", icon: Database, route: null, desc: "Primary persistence" },
      { label: "Redis Cache", icon: Activity, route: null, desc: "Feed + session cache" },
      { label: "S3 Storage", icon: Server, route: null, desc: "Media + files" },
      { label: "Event Store", icon: Database, route: null, desc: "Action + AI event log" },
      { label: "AI Memory", icon: Brain, route: null, desc: "Per-user context store" },
      { label: "Trust Scores", icon: Shield, route: "/trust-system", desc: "Dynamic user scoring" },
    ],
  },
];

const DATA_FLOW = [
  "UI Action",
  "API Gateway (tRPC)",
  "Service (chat/feed/action/ai)",
  "Database Write",
  "Event Emitted",
  "Event Bus",
  "Simulation + AI Workers",
  "Redis Cache Update",
  "WebSocket Push",
  "Frontend Re-render",
];

const UX_FLOW = [
  { step: "User opens app", detail: "OS Shell loads" },
  { step: "Feed appears", detail: "AI + users + simulation" },
  { step: "User opens chat", detail: "Execute mode activates" },
  { step: "AI responds", detail: "Intent parsed → action suggested" },
  { step: "User executes action", detail: "Payment / task / hire" },
  { step: "Wallet updates", detail: "Transaction confirmed" },
  { step: "Feed updates", detail: "Result appears in stream" },
  { step: "Simulation reacts", detail: "World adapts to event" },
];

const PRINCIPLES = [
  { title: "Everything is an event", desc: "Nothing is static. All state changes emit events." },
  { title: "Feed is a projection", desc: "Not stored content — computed from event stream." },
  { title: "AI is embedded everywhere", desc: "Not a separate feature — woven into every layer." },
  { title: "Actions are monetized units", desc: "Every interaction can become revenue." },
  { title: "Simulation runs independently", desc: "System stays alive with zero users." },
];

export default function MasterArchitecture() {
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"architecture" | "ux-flow" | "data-flow" | "principles">("architecture");

  return (
    <div className="min-h-screen bg-background p-4 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Master System Architecture</h1>
            <p className="text-sm text-muted-foreground">Phase 43 — Single source of truth</p>
          </div>
        </div>
        <blockquote className="mt-3 p-3 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-xl text-sm italic text-muted-foreground">
          "ShadowChat is a distributed AI-native operating system composed of event-driven microservices, a real-time simulation engine, and a dual-interface frontend (legacy + OS), unified by a shared data and event architecture."
        </blockquote>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 bg-secondary/50 rounded-xl w-full overflow-x-auto">
        {(["architecture", "ux-flow", "data-flow", "principles"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${activeTab === tab ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {tab === "architecture" ? "Architecture" : tab === "ux-flow" ? "UX Flow" : tab === "data-flow" ? "Data Flow" : "Principles"}
          </button>
        ))}
      </div>

      {/* Architecture tab */}
      {activeTab === "architecture" && (
        <div className="space-y-4">
          {/* Dual UI banner */}
          <div className="grid grid-cols-2 gap-3">
            <div className="card p-3 border border-purple-500/30 bg-purple-500/5">
              <div className="text-xs font-semibold text-purple-400 mb-1">OS Shell</div>
              <div className="text-xs text-muted-foreground">AI-native · Fast execution · Monetized</div>
              <div className="flex gap-1 mt-2">
                {["Discover", "Execute", "Identity"].map(m => (
                  <span key={m} className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-xs">{m}</span>
                ))}
              </div>
            </div>
            <div className="card p-3 border border-blue-500/30 bg-blue-500/5">
              <div className="text-xs font-semibold text-blue-400 mb-1">Legacy Shell</div>
              <div className="text-xs text-muted-foreground">Stable · Familiar · Full feature access</div>
              <div className="flex gap-1 mt-2">
                {["Feed", "Chat", "Profile"].map(m => (
                  <span key={m} className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-xs">{m}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ArrowDown className="w-3 h-3" />
            <span>Both use the same backend</span>
            <ArrowDown className="w-3 h-3" />
          </div>

          {/* Layers */}
          {LAYERS.map(layer => {
            const LayerIcon = layer.icon;
            const isActive = activeLayer === layer.id;
            return (
              <div key={layer.id} className={`card border ${layer.bg} transition-all`}>
                <button
                  className="w-full p-4 flex items-center gap-3 text-left"
                  onClick={() => setActiveLayer(isActive ? null : layer.id)}
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${layer.color} flex items-center justify-center shrink-0`}>
                    <LayerIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{layer.title}</div>
                    <div className="text-xs text-muted-foreground">{layer.subtitle}</div>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${isActive ? "rotate-90" : ""}`} />
                </button>
                {isActive && (
                  <div className="px-4 pb-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {layer.nodes.map(node => {
                      const NodeIcon = node.icon;
                      return (
                        <div key={node.label} className="p-2 rounded-lg bg-background/50 border border-border/50">
                          <div className="flex items-center gap-1.5 mb-1">
                            <NodeIcon className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs font-medium">{node.label}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{node.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Connection arrows */}
          <div className="card p-4 bg-gradient-to-r from-purple-500/5 to-cyan-500/5 border-purple-500/20">
            <h3 className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Service Connections</h3>
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                ["Chat Service", "AI Service"],
                ["Feed Service", "Redis Cache"],
                ["Action Engine", "Wallet Service"],
                ["AI Service", "Simulation Engine"],
                ["Event Bus", "All Services"],
                ["WebSocket", "Frontend Store"],
              ].map(([from, to]) => (
                <div key={from + to} className="flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/50">
                  <span className="text-foreground">{from}</span>
                  <ArrowRight className="w-2.5 h-2.5 text-muted-foreground" />
                  <span className="text-muted-foreground">{to}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* UX Flow tab */}
      {activeTab === "ux-flow" && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">What the user experiences from open to action.</p>
          {UX_FLOW.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="flex flex-col items-center shrink-0">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
                  {idx + 1}
                </div>
                {idx < UX_FLOW.length - 1 && <div className="w-0.5 h-4 bg-border mt-1" />}
              </div>
              <div className="card p-3 flex-1">
                <div className="font-medium text-sm">{item.step}</div>
                <div className="text-xs text-muted-foreground">{item.detail}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Data Flow tab */}
      {activeTab === "data-flow" && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">What the system does for every user action.</p>
          {DATA_FLOW.map((step, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="flex flex-col items-center shrink-0 w-8">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? "bg-purple-500 text-white" : idx === DATA_FLOW.length - 1 ? "bg-green-500 text-white" : "bg-secondary text-muted-foreground"}`}>
                  {idx + 1}
                </div>
                {idx < DATA_FLOW.length - 1 && <div className="w-0.5 h-3 bg-border mt-0.5" />}
              </div>
              <div className={`card p-2.5 flex-1 text-sm ${idx === 0 ? "border-purple-500/30 bg-purple-500/5" : idx === DATA_FLOW.length - 1 ? "border-green-500/30 bg-green-500/5" : ""}`}>
                {step}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Principles tab */}
      {activeTab === "principles" && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Core engineering principles that govern every decision.</p>
          {PRINCIPLES.map((p, idx) => (
            <div key={idx} className="card p-4 flex gap-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-sm font-bold text-white shrink-0">
                {idx + 1}
              </div>
              <div>
                <div className="font-semibold text-sm">{p.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{p.desc}</div>
              </div>
            </div>
          ))}

          {/* Full system structure */}
          <div className="card p-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/20">
            <h3 className="font-semibold text-sm mb-3">Full System Structure</h3>
            <div className="font-mono text-xs text-muted-foreground space-y-0.5">
              <div>ShadowChat App</div>
              <div className="ml-4">├── Feed (Home)</div>
              <div className="ml-4">├── Discover</div>
              <div className="ml-4">├── Chat</div>
              <div className="ml-4">├── Actions (Monetization)</div>
              <div className="ml-4">├── Dating System</div>
              <div className="ml-4">├── Marketplace</div>
              <div className="ml-4">├── AI Agents</div>
              <div className="ml-4">├── Profile</div>
              <div className="ml-4">├── Wallet</div>
              <div className="ml-4">├── Notifications</div>
              <div className="ml-4">├── Simulation World</div>
              <div className="ml-4">└── Admin Dashboard</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
