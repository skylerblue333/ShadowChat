/**
 * HOPEAIControl — Unhidden Mode: HOPE AI Control Panel
 * AI agent management, training pipeline, ethics controls, deployment dashboard
 */
import { useState } from "react";
import { Link } from "wouter";
import {
  Brain, ArrowLeft, Zap, Shield, Activity, Play, Pause, RefreshCw,
  ChevronRight, AlertTriangle, CheckCircle, Settings, Eye, Users
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const HOPE_AGENTS = [
  { id: "nova",    name: "NOVA",    role: "Social Curator",    status: "active",  load: 87, tasks: 1240 },
  { id: "cipher",  name: "CIPHER",  role: "Security Monitor",  status: "active",  load: 62, tasks: 890  },
  { id: "prism",   name: "PRISM",   role: "Trend Analyst",     status: "active",  load: 74, tasks: 1100 },
  { id: "echo",    name: "ECHO",    role: "Content Mirror",    status: "active",  load: 55, tasks: 760  },
  { id: "flux",    name: "FLUX",    role: "Market Oracle",     status: "active",  load: 91, tasks: 1580 },
  { id: "sage",    name: "SAGE",    role: "Knowledge Base",    status: "idle",    load: 12, tasks: 230  },
  { id: "pulse",   name: "PULSE",   role: "Health Monitor",    status: "active",  load: 44, tasks: 670  },
  { id: "nexus",   name: "NEXUS",   role: "Integration Hub",   status: "active",  load: 78, tasks: 1020 },
];

const ETHICS_CONTROLS = [
  { label: "Content Moderation AI",   enabled: true,  description: "Auto-flag harmful content" },
  { label: "Bias Detection",          enabled: true,  description: "Monitor for discriminatory outputs" },
  { label: "Privacy Shield",          enabled: true,  description: "Block PII in AI responses" },
  { label: "Hallucination Guard",     enabled: true,  description: "Fact-check AI claims" },
  { label: "Manipulation Detection",  enabled: false, description: "Flag persuasion attempts" },
  { label: "Toxicity Filter",         enabled: true,  description: "Remove toxic content" },
];

export default function HOPEAIControl() {
  const [ethics, setEthics] = useState(
    Object.fromEntries(ETHICS_CONTROLS.map(e => [e.label, e.enabled]))
  );
  const [agentStates, setAgentStates] = useState(
    Object.fromEntries(HOPE_AGENTS.map(a => [a.id, a.status]))
  );

  const { data: simData } = trpc.simulation.getWorldState.useQuery();

  const toggleAgent = (id: string) => {
    setAgentStates(prev => ({
      ...prev,
      [id]: prev[id] === "active" ? "idle" : "active"
    }));
    const agent = HOPE_AGENTS.find(a => a.id === id);
    toast.success(`${agent?.name} ${agentStates[id] === "active" ? "paused" : "activated"}`);
  };

  const activeCount = Object.values(agentStates).filter(s => s === "active").length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/90 backdrop-blur border-b border-border px-4 py-3 flex items-center gap-3">
        <Link href="/unhidden">
          <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
        </Link>
        <div className="flex-1">
          <h1 className="font-bold text-sm flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-400" />
            HOPE AI Control
          </h1>
          <p className="text-xs text-muted-foreground">Agent management, ethics & deployment</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-500/10 rounded-full">
          <Activity className="w-3 h-3 text-purple-400" />
          <span className="text-xs text-purple-400 font-medium">{activeCount} active</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* System Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Active Agents",    value: activeCount.toString(),                                          color: "text-purple-400" },
            { label: "Tasks Today",      value: HOPE_AGENTS.reduce((s, a) => s + a.tasks, 0).toLocaleString(), color: "text-blue-400"   },
            { label: "Avg Load",         value: `${Math.round(HOPE_AGENTS.reduce((s, a) => s + a.load, 0) / HOPE_AGENTS.length)}%`, color: "text-yellow-400" },
            { label: "Ethics Checks",    value: Object.values(ethics).filter(Boolean).length.toString(),        color: "text-green-400"  },
          ].map(stat => (
            <div key={stat.label} className="bg-secondary/30 border border-border/50 rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <p className={`font-bold text-xl ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Agent Grid */}
        <div className="bg-secondary/20 border border-border/50 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
            <h2 className="font-semibold text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              HOPE AI Agents
            </h2>
            <button onClick={() => toast.info("Restarting all agents…")}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-secondary rounded-lg text-xs hover:bg-secondary/80 transition-colors">
              <RefreshCw className="w-3 h-3" />
              Restart All
            </button>
          </div>
          <div className="divide-y divide-border/30">
            {HOPE_AGENTS.map(agent => (
              <div key={agent.id} className="px-4 py-3 flex items-center gap-3 hover:bg-secondary/20 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  agentStates[agent.id] === "active" ? "bg-purple-500/20 text-purple-400" : "bg-secondary text-muted-foreground"
                }`}>
                  {agent.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{agent.name}</p>
                    <span className="text-xs text-muted-foreground">{agent.role}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${
                        agent.load > 80 ? "bg-red-400" : agent.load > 60 ? "bg-yellow-400" : "bg-green-400"
                      }`} style={{ width: `${agent.load}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground w-8">{agent.load}%</span>
                  </div>
                </div>
                <div className="text-right mr-2">
                  <p className="text-xs font-medium">{agent.tasks.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">tasks</p>
                </div>
                <button onClick={() => toggleAgent(agent.id)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    agentStates[agent.id] === "active"
                      ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                      : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                  }`}>
                  {agentStates[agent.id] === "active" ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Ethics Controls */}
        <div className="bg-secondary/20 border border-border/50 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-400" />
            <h2 className="font-semibold text-sm">Ethics & Safety Controls</h2>
          </div>
          <div className="divide-y divide-border/30">
            {ETHICS_CONTROLS.map(ctrl => (
              <div key={ctrl.label} className="px-4 py-3 flex items-center justify-between hover:bg-secondary/20 transition-colors">
                <div>
                  <p className="text-sm font-medium">{ctrl.label}</p>
                  <p className="text-xs text-muted-foreground">{ctrl.description}</p>
                </div>
                <button onClick={() => {
                  setEthics(prev => ({ ...prev, [ctrl.label]: !prev[ctrl.label] }));
                  toast.success(`${ctrl.label} ${ethics[ctrl.label] ? "disabled" : "enabled"}`);
                }}
                  className={`relative w-10 h-5 rounded-full transition-colors ${ethics[ctrl.label] ? "bg-green-500" : "bg-secondary"}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${ethics[ctrl.label] ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Simulation Status */}
        {simData && (
          <div className="bg-secondary/20 border border-border/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="w-4 h-4 text-blue-400" />
              <h2 className="font-semibold text-sm">World Simulation Status</h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-lg font-bold text-blue-400">{(simData as any).entities?.length ?? 0}</p>
                <p className="text-xs text-muted-foreground">Entities</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-purple-400">{(simData as any).events?.length ?? 0}</p>
                <p className="text-xs text-muted-foreground">Events</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-green-400">{(simData as any).tick ?? 0}</p>
                <p className="text-xs text-muted-foreground">Tick</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "World Simulation",  path: "/world-simulation", icon: Activity },
            { label: "AI Agent Market",   path: "/ai-agent-market",  icon: Users    },
            { label: "AI Engineer",       path: "/ai-engineer",      icon: Brain    },
            { label: "Trust System",      path: "/trust-system",     icon: Shield   },
          ].map(link => {
            const Icon = link.icon;
            return (
              <Link key={link.path} href={link.path}>
                <div className="flex items-center justify-between p-3 bg-secondary/30 border border-border/50 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="text-sm">{link.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
