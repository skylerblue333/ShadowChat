import { useState } from "react";
import { Link } from "wouter";
import { Bot, Zap, TrendingUp, Shield, Brain, Code, Heart, Globe, ChevronRight, Play, Pause, Settings, Plus, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";

const AGENT_CATEGORIES = [
  { id: "all", label: "All Agents" },
  { id: "trading", label: "Trading" },
  { id: "social", label: "Social" },
  { id: "security", label: "Security" },
  { id: "analytics", label: "Analytics" },
  { id: "content", label: "Content" },
];

const FEATURED_AGENTS = [
  { id: "hope-ai", name: "HOPE AI", desc: "Your personal AI companion — voice, chat, and autonomous tasks", icon: Brain, color: "from-teal-500 to-cyan-600", status: "active", tasks: 1247, category: "social" },
  { id: "oracle", name: "Oracle", desc: "Real-time price oracle and market signal generator", icon: TrendingUp, color: "from-amber-500 to-orange-600", status: "active", tasks: 8934, category: "trading" },
  { id: "shield", name: "Shield", desc: "Security monitoring, fraud detection, and threat prevention", icon: Shield, color: "from-red-500 to-rose-600", status: "active", tasks: 3421, category: "security" },
  { id: "nexus", name: "Nexus", desc: "API gateway and data pipeline orchestrator", icon: Globe, color: "from-purple-500 to-violet-600", status: "active", tasks: 2109, category: "analytics" },
  { id: "forge", name: "Forge", desc: "Content generation, copywriting, and creative AI", icon: Code, color: "from-blue-500 to-indigo-600", status: "idle", tasks: 567, category: "content" },
  { id: "atlas", name: "Atlas", desc: "Smart contract deployment and blockchain automation", icon: Zap, color: "from-emerald-500 to-green-600", status: "active", tasks: 4892, category: "trading" },
  { id: "echo", name: "Echo", desc: "Real-time event streaming and notification routing", icon: Activity, color: "from-pink-500 to-fuchsia-600", status: "active", tasks: 12043, category: "social" },
  { id: "titan", name: "Titan", desc: "Task orchestration and workflow automation engine", icon: Bot, color: "from-slate-500 to-gray-600", status: "idle", tasks: 789, category: "analytics" },
];

export default function AgentsDashboard() {
  const [category, setCategory] = useState("all");
  const filtered = category === "all" ? FEATURED_AGENTS : FEATURED_AGENTS.filter(a => a.category === category);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pb-24">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white mb-1">AI Agents</h1>
            <p className="text-slate-400">44 autonomous agents powering your ecosystem</p>
          </div>
          <div className="flex gap-3">
            <Link href="/agents/marketplace">
              <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">Marketplace</Button>
            </Link>
            <Link href="/agents/builder">
              <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 border-0 text-white gap-2">
                <Plus className="h-4 w-4" /> Build Agent
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Active Agents", value: "38", color: "text-emerald-400" },
            { label: "Tasks Today", value: "34,002", color: "text-cyan-400" },
            { label: "Avg Response", value: "142ms", color: "text-purple-400" },
            { label: "Uptime", value: "...", color: "text-amber-400" },
          ].map(s => (
            <div key={s.label} className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4">
              <div className="text-xs text-slate-500 mb-1">{s.label}</div>
              <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {AGENT_CATEGORIES.map(c => (
            <button key={c.id} onClick={() => setCategory(c.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${category === c.id ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "bg-slate-900/60 text-slate-400 border border-slate-800/60 hover:border-slate-700"}`}>
              {c.label}
            </button>
          ))}
        </div>

        {/* Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(agent => (
            <Link key={agent.id} href={`/agents/${agent.id}`}>
              <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-5 hover:border-slate-700 transition-all cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${agent.color} flex items-center justify-center`}>
                    <agent.icon className="h-6 w-6 text-white" />
                  </div>
                  <Badge className={`text-xs border-0 ${agent.status === "active" ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-700/50 text-slate-400"}`}>
                    {agent.status === "active" ? "● Active" : "○ Idle"}
                  </Badge>
                </div>
                <h3 className="font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">{agent.name}</h3>
                <p className="text-xs text-slate-500 mb-3 line-clamp-2">{agent.desc}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">{agent.tasks.toLocaleString()} tasks run</span>
                  <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
