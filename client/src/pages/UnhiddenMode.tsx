import { useState } from "react";
import { Link } from "wouter";
import {
  Eye,
  Activity,
  Cpu,
  Globe,
  DollarSign,
  Brain,
  Layers,
  Wrench,
  ChevronRight,
  Shield,
  Zap,
  BarChart3,
  Terminal,
  Network,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const SECTIONS = [
  {
    id: "observability",
    icon: Activity,
    title: "System Observability",
    subtitle: "Live event stream, API tracer, WebSocket monitor, feed inspector",
    href: "/system-observability",
    tools: 8,
    accent: "cyan",
    status: "live",
    tools_list: [
      "Live event stream viewer",
      "API request tracer",
      "WebSocket activity monitor",
      "Feed generation inspector",
      "Wallet transaction trace",
      "AI decision log viewer",
      "System latency heatmap",
      "Error + crash timeline debugger",
    ],
  },
  {
    id: "automation",
    icon: Cpu,
    title: "Automation Engine",
    subtitle: "Workflow builder, trigger system, job manager, feature flags",
    href: "/automation-engine",
    tools: 8,
    accent: "purple",
    status: "live",
    tools_list: [
      "Scheduled automation engine",
      "Workflow builder (no-code)",
      "Trigger system (event → action)",
      "Background job manager",
      "Retry + failure recovery console",
      "Rate limit controller dashboard",
      "Feature flag switchboard",
      "System kill-switch",
    ],
  },
  {
    id: "simulation",
    icon: Globe,
    title: "World Simulation Control",
    subtitle: "Timeline controller, persona toggles, scenario sandbox",
    href: "/world-simulation",
    tools: 8,
    accent: "green",
    status: "live",
    tools_list: [
      "Simulation timeline controller",
      "AI persona behavior toggles",
      "Trend injection system",
      "Synthetic user generator",
      "Economy simulation (SKYCOIN flow)",
      "Event replay system",
      "World state snapshot viewer",
      "Scenario testing sandbox",
    ],
  },
  {
    id: "economy",
    icon: DollarSign,
    title: "Economy Control",
    subtitle: "Transaction ledger, wallet flow, liquidity, fraud detection",
    href: "/economy-control",
    tools: 6,
    accent: "yellow",
    status: "live",
    tools_list: [
      "Transaction ledger explorer",
      "Wallet flow visualizer",
      "Liquidity / circulation dashboard",
      "Fee engine controller",
      "Reward distribution monitor",
      "Fraud / anomaly detection viewer",
    ],
  },
  {
    id: "ai-control",
    icon: Brain,
    title: "HOPE AI Control Layer",
    subtitle: "AI transparency, ranking inspector, cost tracker, model routing",
    href: "/hope-ai",
    tools: 6,
    accent: "pink",
    status: "live",
    tools_list: [
      "AI suggestion transparency panel",
      "AI ranking inspector",
      "Prompt/response cache viewer",
      "AI cost tracker dashboard",
      "Model routing switcher",
      "AI disable/enable per module",
    ],
  },
  {
    id: "interface",
    icon: Layers,
    title: "Unhidden Interface",
    subtitle: "System graph, dependency map, real-time architecture visualization",
    href: "/unhidden-interface",
    tools: 5,
    accent: "orange",
    status: "live",
    tools_list: [
      "Full system graph view (nodes + edges)",
      "Cross-module dependency map",
      "Real-time architecture visualization",
      "Live state diff viewer",
      "Debug overlay for entire UI world",
    ],
  },
  {
    id: "power-tools",
    icon: Wrench,
    title: "Advanced Power Tools",
    subtitle: "Manual event injector, data rewind, system health god view",
    href: "/power-tools",
    tools: 3,
    accent: "red",
    status: "live",
    tools_list: [
      "Manual event injector",
      "Data rewind / rollback system",
      "System health god view",
    ],
  },
];

const SYSTEM_STATS = [
  { label: "Active Events/sec", value: "247", icon: Activity, color: "cyan" },
  { label: "API Requests/min", value: "1,840", icon: Network, color: "purple" },
  { label: "AI Decisions Today", value: "12,441", icon: Brain, color: "pink" },
  { label: "System Uptime", value: "99.97%", icon: CheckCircle, color: "green" },
  { label: "Active Workflows", value: "34", icon: Zap, color: "yellow" },
  { label: "Wallet Flows/hr", value: "892", icon: DollarSign, color: "orange" },
];

const RECENT_EVENTS = [
  { type: "action", msg: "PAYMENT action executed: $24.00 → user_7x2", time: "0.2s ago", level: "info" },
  { type: "ai", msg: "Feed ranking recalculated for user_3k9 (12 signals)", time: "1.1s ago", level: "info" },
  { type: "wallet", msg: "SKY444 transfer: 500 tokens → treasury", time: "2.4s ago", level: "info" },
  { type: "error", msg: "Rate limit triggered: user_9m1 (chat: 60/min)", time: "3.7s ago", level: "warn" },
  { type: "simulation", msg: "NOVA persona posted: #AIAgents trend +2.3%", time: "5.0s ago", level: "info" },
  { type: "auth", msg: "New session: user_4p8 authenticated via OAuth", time: "6.2s ago", level: "info" },
];

const accentMap: Record<string, string> = {
  cyan: "text-[oklch(0.8_0.15_200)] border-[oklch(0.8_0.15_200)]/30 bg-[oklch(0.8_0.15_200)]/5",
  purple: "text-[oklch(0.75_0.2_290)] border-[oklch(0.75_0.2_290)]/30 bg-[oklch(0.75_0.2_290)]/5",
  green: "text-[oklch(0.75_0.2_145)] border-[oklch(0.75_0.2_145)]/30 bg-[oklch(0.75_0.2_145)]/5",
  yellow: "text-[oklch(0.85_0.18_90)] border-[oklch(0.85_0.18_90)]/30 bg-[oklch(0.85_0.18_90)]/5",
  pink: "text-[oklch(0.75_0.2_350)] border-[oklch(0.75_0.2_350)]/30 bg-[oklch(0.75_0.2_350)]/5",
  orange: "text-[oklch(0.78_0.18_50)] border-[oklch(0.78_0.18_50)]/30 bg-[oklch(0.78_0.18_50)]/5",
  red: "text-[oklch(0.7_0.2_25)] border-[oklch(0.7_0.2_25)]/30 bg-[oklch(0.7_0.2_25)]/5",
};

const levelColor: Record<string, string> = {
  info: "text-[oklch(0.8_0.15_200)]",
  warn: "text-[oklch(0.85_0.18_90)]",
  error: "text-[oklch(0.7_0.2_25)]",
};

export default function UnhiddenMode() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[oklch(0.08_0.02_270)] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-[oklch(0.1_0.03_270)]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[oklch(0.7_0.2_25)]/20 border border-[oklch(0.7_0.2_25)]/40 flex items-center justify-center">
              <Eye className="w-4 h-4 text-[oklch(0.7_0.2_25)]" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">UNHIDDEN MODE</h1>
              <p className="text-xs text-white/40">Grey Area Tools — Power Layer</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[oklch(0.75_0.2_145)] animate-pulse" />
            <span className="text-xs text-white/50">System Live</span>
            <Badge variant="outline" className="text-[oklch(0.7_0.2_25)] border-[oklch(0.7_0.2_25)]/40 text-xs">
              POWER USER
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* System definition */}
        <div className="rounded-xl border border-[oklch(0.7_0.2_25)]/30 bg-[oklch(0.7_0.2_25)]/5 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[oklch(0.85_0.18_90)] mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-white/90 mb-1">Enterprise Observability Layer</p>
              <p className="text-xs text-white/50 leading-relaxed">
                Unhidden Mode provides full system transparency: live event streams, AI decision logs, simulation control, economy flows, and architecture visualization. This is the developer + power user layer — not a consumer feature. All tools are read-only or safely sandboxed.
              </p>
            </div>
          </div>
        </div>

        {/* Live system stats */}
        <div>
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Live System Stats
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {SYSTEM_STATS.map((stat) => (
              <Card key={stat.label} className="bg-white/5 border-white/10">
                <CardContent className="p-3 text-center">
                  <stat.icon className="w-4 h-4 mx-auto mb-1 text-white/40" />
                  <div className="text-lg font-bold text-white">{stat.value}</div>
                  <div className="text-[10px] text-white/40 leading-tight">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 7 sections grid */}
        <div>
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Terminal className="w-4 h-4" />
            44 Grey Area Tools — 7 Sections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              const accent = accentMap[section.accent] || accentMap.cyan;
              const isExpanded = expanded === section.id;
              return (
                <Card
                  key={section.id}
                  className={`bg-white/5 border transition-all duration-200 cursor-pointer hover:bg-white/8 ${accent}`}
                  onClick={() => setExpanded(isExpanded ? null : section.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accent}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <CardTitle className="text-sm text-white">{section.title}</CardTitle>
                          <Badge variant="outline" className={`text-[10px] mt-0.5 ${accent}`}>
                            {section.tools} tools
                          </Badge>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-white/30 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-white/50 mb-3">{section.subtitle}</p>
                    {isExpanded && (
                      <ul className="space-y-1 mb-3">
                        {section.tools_list.map((tool, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-white/70">
                            <div className="w-1 h-1 rounded-full bg-white/30" />
                            {tool}
                          </li>
                        ))}
                      </ul>
                    )}
                    <Link href={section.href}>
                      <Button
                        size="sm"
                        variant="outline"
                        className={`w-full text-xs ${accent} hover:bg-white/10`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        Open {section.title}
                        <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Live event stream preview */}
        <div>
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Live Event Stream (Preview)
          </h2>
          <Card className="bg-[oklch(0.06_0.02_270)] border-white/10">
            <CardContent className="p-4">
              <div className="font-mono text-xs space-y-2">
                {RECENT_EVENTS.map((ev, i) => (
                  <div key={i} className="flex items-start gap-3 py-1 border-b border-white/5 last:border-0">
                    <span className="text-white/30 shrink-0 w-16">{ev.time}</span>
                    <span className={`uppercase shrink-0 w-12 ${levelColor[ev.level]}`}>[{ev.type}]</span>
                    <span className="text-white/70">{ev.msg}</span>
                  </div>
                ))}
              </div>
              <Link href="/system-observability">
                <Button variant="ghost" size="sm" className="mt-3 text-xs text-white/40 hover:text-white/70 w-full">
                  Open Full Event Stream →
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Architecture layers */}
        <div>
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4" />
            System Architecture Layers
          </h2>
          <div className="space-y-2">
            {[
              { label: "Normal User Layer", desc: "Feed, Chat, Dating, Wallet, Marketplace", color: "cyan" },
              { label: "ShadowChat Core System", desc: "Deterministic engine — works without AI", color: "purple" },
              { label: "HOPE AI (Optional Enhancement)", desc: "Feed ranking, recommendations, moderation", color: "pink" },
              { label: "UNHIDDEN MODE (Grey Area Tools)", desc: "Observability, control, simulation, governance", color: "red" },
              { label: "System Observability + Control + Simulation", desc: "This layer — 44 enterprise tools", color: "orange" },
            ].map((layer, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="text-white/30 font-mono text-xs w-4">{i + 1}</div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white/90">{layer.label}</div>
                  <div className="text-xs text-white/40">{layer.desc}</div>
                </div>
                {i === 3 && (
                  <Badge variant="outline" className="text-[oklch(0.7_0.2_25)] border-[oklch(0.7_0.2_25)]/40 text-[10px]">
                    YOU ARE HERE
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick access grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Event Stream", href: "/unhidden/observability", icon: Activity },
            { label: "Automation", href: "/unhidden/automation", icon: Zap },
            { label: "Simulation", href: "/unhidden/simulation", icon: Globe },
            { label: "Economy", href: "/unhidden/economy", icon: DollarSign },
            { label: "AI Control", href: "/unhidden/ai-control", icon: Brain },
            { label: "System Graph", href: "/unhidden/interface", icon: Network },
            { label: "Power Tools", href: "/unhidden/power-tools", icon: Wrench },
            { label: "God View", href: "/unhidden/power-tools", icon: TrendingUp },
          ].map((item) => (
            <Link key={item.label} href={item.href}>
              <Button
                variant="outline"
                className="w-full h-16 flex-col gap-1 bg-white/5 border-white/10 hover:bg-white/10 text-white/70 hover:text-white"
              >
                <item.icon className="w-4 h-4" />
                <span className="text-xs">{item.label}</span>
              </Button>
            </Link>
          ))}
        </div>

        {/* Settings link */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-white/40" />
            <div>
              <div className="text-sm font-medium text-white/80">Unhidden Mode Settings</div>
              <div className="text-xs text-white/40">Configure access levels, data retention, and export formats</div>
            </div>
          </div>
          <Badge variant="outline" className="text-white/40 border-white/20 text-xs">
            Admin Only
          </Badge>
        </div>
      </div>
    </div>
  );
}
