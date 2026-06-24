import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Agent {
  id: string;
  name: string;
  role: string;
  specialty: string;
  status: "idle" | "working" | "learning" | "offline";
  level: number;
  tasksCompleted: number;
  earnedToday: number;
  efficiency: number;
  icon: string;
  color: string;
}

const AGENTS: Agent[] = [
  { id: "research-01", name: "ATLAS", role: "Research Agent", specialty: "Market Intelligence", status: "working", level: 12, tasksCompleted: 847, earnedToday: 142, efficiency: 94, icon: "🔬", color: "blue" },
  { id: "trade-01", name: "MERCURY", role: "Trading Agent", specialty: "DeFi Arbitrage", status: "working", level: 18, tasksCompleted: 2341, earnedToday: 891, efficiency: 87, icon: "📈", color: "yellow" },
  { id: "create-01", name: "MUSE", role: "Creator Agent", specialty: "Content Generation", status: "working", level: 9, tasksCompleted: 412, earnedToday: 67, efficiency: 91, icon: "🎨", color: "purple" },
  { id: "gov-01", name: "SENATOR", role: "Governance Agent", specialty: "Proposal Analysis", status: "learning", level: 7, tasksCompleted: 156, earnedToday: 34, efficiency: 78, icon: "🏛️", color: "emerald" },
  { id: "teach-01", name: "SAGE", role: "Teaching Agent", specialty: "Knowledge Transfer", status: "idle", level: 14, tasksCompleted: 1023, earnedToday: 0, efficiency: 96, icon: "📚", color: "orange" },
  { id: "security-01", name: "GUARDIAN", role: "Security Agent", specialty: "Threat Detection", status: "working", level: 21, tasksCompleted: 5621, earnedToday: 203, efficiency: 99, icon: "🛡️", color: "red" },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  working: { label: "WORKING", color: "text-emerald-400", dot: "bg-emerald-400" },
  idle: { label: "IDLE", color: "text-yellow-400", dot: "bg-yellow-400" },
  learning: { label: "LEARNING", color: "text-blue-400", dot: "bg-blue-400" },
  offline: { label: "OFFLINE", color: "text-white/30", dot: "bg-white/30" },
};

const COLOR_MAP: Record<string, { text: string; bg: string; border: string }> = {
  blue: { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
  yellow: { text: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/30" },
  purple: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30" },
  emerald: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  orange: { text: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30" },
  red: { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30" },
};

function AgentCard({ agent }: { agent: Agent }) {
  const status = STATUS_CONFIG[agent.status];
  const colors = COLOR_MAP[agent.color];

  return (
    <Card className={`bg-black/60 border ${colors.border} hover:scale-[1.01] transition-transform duration-200`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center text-2xl`}>
              {agent.icon}
            </div>
            <div>
              <div className={`font-black text-lg ${colors.text}`}>{agent.name}</div>
              <div className="text-xs text-white/40">{agent.role}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${status.dot} ${agent.status === "working" ? "animate-pulse" : ""}`} />
            <span className={`text-xs font-bold ${status.color}`}>{status.label}</span>
          </div>
        </div>

        <div className="text-xs text-white/50 mb-3 italic">"{agent.specialty}"</div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center p-2 rounded-lg bg-white/5">
            <div className={`text-sm font-black ${colors.text}`}>Lv.{agent.level}</div>
            <div className="text-xs text-white/30">Level</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-white/5">
            <div className="text-sm font-black text-white">{agent.tasksCompleted.toLocaleString()}</div>
            <div className="text-xs text-white/30">Tasks</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-white/5">
            <div className="text-sm font-black text-yellow-400">+{agent.earnedToday}</div>
            <div className="text-xs text-white/30">Today</div>
          </div>
        </div>

        <div className="mb-1 flex justify-between text-xs text-white/40">
          <span>Efficiency</span>
          <span className={colors.text}>{agent.efficiency}%</span>
        </div>
        <Progress value={agent.efficiency} className="h-1.5" />

        <Button
          size="sm"
          className={`w-full mt-3 ${colors.bg} ${colors.text} border ${colors.border} hover:opacity-80 text-xs`}
          variant="outline"
        >
          {agent.status === "idle" ? "ASSIGN TASK" : "VIEW ACTIVITY"}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function AgentCity() {
  const [filter, setFilter] = useState<string>("all");

  const { data: agentMetrics } = trpc.enterprise.freeWill.systemSnapshot.useQuery();

  const totalEarned = AGENTS.reduce((sum, a) => sum + a.earnedToday, 0);
  const activeAgents = AGENTS.filter((a) => a.status === "working").length;
  const totalTasks = AGENTS.reduce((sum, a) => sum + a.tasksCompleted, 0);

  const filteredAgents = filter === "all" ? AGENTS : AGENTS.filter((a) => a.status === filter);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-blue-500/20 bg-gradient-to-r from-black via-blue-950/10 to-black">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-2xl">
                🤖
              </div>
              <div>
                <h1 className="text-2xl font-black text-white tracking-widest uppercase">
                  AGENT CITY
                </h1>
                <p className="text-sm text-blue-400/80 mt-1">
                  Your AI workforce — autonomous agents earning on your behalf
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-0">
                {activeAgents}/{AGENTS.length} ACTIVE
              </Badge>
              <Badge className="bg-yellow-500/20 text-yellow-400 border-0">
                +{totalEarned} EARN TODAY
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* City Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Active Agents", value: activeAgents, icon: "⚡", color: "emerald" },
            { label: "Tasks Today", value: "1,247", icon: "✅", color: "blue" },
            { label: "Total Earned", value: `+${totalEarned} EARN`, icon: "💰", color: "yellow" },
            { label: "Total Tasks Ever", value: totalTasks.toLocaleString(), icon: "📊", color: "purple" },
          ].map((stat, i) => {
            const c = COLOR_MAP[stat.color];
            return (
              <Card key={i} className="bg-black/60 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span>{stat.icon}</span>
                    <span className="text-xs text-white/40 uppercase">{stat.label}</span>
                  </div>
                  <div className={`text-xl font-black font-mono ${c.text}`}>{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {["all", "working", "idle", "learning"].map((f) => (
            <Button
              key={f}
              variant="outline"
              size="sm"
              onClick={() => setFilter(f)}
              className={`text-xs capitalize border-white/20 ${filter === f ? "bg-white/20 text-white" : "text-white/50"}`}
            >
              {f === "all" ? `ALL (${AGENTS.length})` : `${f} (${AGENTS.filter((a) => a.status === f).length})`}
            </Button>
          ))}
        </div>

        {/* Agent Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAgents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>

        {/* Deploy New Agent CTA */}
        <Card className="bg-gradient-to-r from-blue-950/40 to-purple-950/40 border border-blue-500/20">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <div className="text-lg font-black text-white mb-1">DEPLOY A NEW AGENT</div>
              <div className="text-sm text-white/50">
                Train a custom AI agent with your data, goals, and strategy
              </div>
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold">
              + DEPLOY AGENT
            </Button>
          </CardContent>
        </Card>

        {/* Agent Economy Stats */}
        {agentMetrics && (
          <Card className="bg-black/60 border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-blue-400 text-sm uppercase tracking-widest">
                FREE WILL ENGINE — AGENT METRICS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { label: "Goals Active", value: agentMetrics?.activeGoals ?? "—" },
                  { label: "Economy Health", value: agentMetrics?.economyHealth ?? "—" },
                  { label: "Nation Status", value: agentMetrics?.digitalNationStatus ?? "—" },
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-lg bg-white/5 text-center">
                    <div className="text-2xl font-black text-blue-400 font-mono">{String(item.value)}</div>
                    <div className="text-xs text-white/40 mt-1">{item.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
