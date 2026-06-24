import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bot, Zap, Activity, CheckCircle2, Clock, AlertCircle, Play, Pause,
  Plus, RefreshCw, BarChart3, Network, Cpu, ArrowRight, Settings,
  Brain, Target, Shield, TrendingUp, MessageSquare, DollarSign,
} from "lucide-react";

const AGENTS = [
  { id: "hope-ai", name: "Hope AI", role: "Emotional Intelligence", status: "active", tasks: 847, success: 99.2, load: 72, color: "purple" },
  { id: "feed-ranker", name: "Feed Ranker", role: "Content Scoring", status: "active", tasks: 12400, success: 98.7, load: 45, color: "cyan" },
  { id: "fraud-detector", name: "Fraud Detector", role: "Security Analysis", status: "active", tasks: 3200, success: 99.8, load: 28, color: "red" },
  { id: "trend-ai", name: "Trend AI", role: "Trend Detection", status: "active", tasks: 560, success: 97.4, load: 31, color: "yellow" },
  { id: "mod-ai", name: "Moderation AI", role: "Content Moderation", status: "active", tasks: 8900, success: 96.1, load: 58, color: "orange" },
  { id: "rec-engine", name: "Recommendation Engine", role: "Personalization", status: "active", tasks: 22000, success: 94.3, load: 81, color: "green" },
  { id: "price-oracle", name: "Price Oracle", role: "Market Data", status: "active", tasks: 144000, success: 99.9, load: 15, color: "blue" },
  { id: "ab-tester", name: "A/B Tester", role: "Experiment Engine", status: "idle", tasks: 120, success: 100, load: 0, color: "pink" },
];

const TASKS = [
  { id: "T-8821", agent: "Hope AI", type: "Emotional Analysis", status: "running", priority: "high", duration: "1.2s", user: "skyler.spillers" },
  { id: "T-8820", agent: "Fraud Detector", type: "Transaction Scan", status: "completed", priority: "critical", duration: "0.4s", user: "system" },
  { id: "T-8819", agent: "Feed Ranker", type: "Post Scoring Batch", status: "completed", priority: "normal", duration: "3.1s", user: "system" },
  { id: "T-8818", agent: "Trend AI", type: "Hashtag Analysis", status: "running", priority: "normal", duration: "2.8s", user: "system" },
  { id: "T-8817", agent: "Moderation AI", type: "Content Review", status: "failed", priority: "high", duration: "—", user: "system" },
  { id: "T-8816", agent: "Rec Engine", type: "User Personalization", status: "completed", priority: "normal", duration: "1.7s", user: "alex.chen" },
];

const colorMap: Record<string, string> = {
  purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  red: "text-red-400 bg-red-500/10 border-red-500/20",
  yellow: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  orange: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  green: "text-green-400 bg-green-500/10 border-green-500/20",
  blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  pink: "text-pink-400 bg-pink-500/10 border-pink-500/20",
};

const statusBadge: Record<string, string> = {
  running: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  completed: "bg-green-500/20 text-green-300 border-green-500/30",
  failed: "bg-red-500/20 text-red-300 border-red-500/30",
  idle: "bg-white/10 text-white/40 border-white/10",
  active: "bg-green-500/20 text-green-300 border-green-500/30",
};

export default function AgentCoordination() {
  const [activeTab, setActiveTab] = useState("agents");

  const totalTasks = AGENTS.reduce((s, a) => s + a.tasks, 0);
  const avgSuccess = AGENTS.reduce((s, a) => s + a.success, 0) / AGENTS.length;
  const activeAgents = AGENTS.filter(a => a.status === "active").length;

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-8 w-8 rounded-lg gradient-psychedelic flex items-center justify-center">
              <Network className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gradient">Agent Coordination Hub</h1>
          </div>
          <p className="text-sm text-white/50">Multi-agent orchestration, task queue, and AI fleet management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-white/10 gap-2">
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>
          <Button className="gradient-psychedelic text-white gap-2">
            <Plus className="w-4 h-4" /> Deploy Agent
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Agents", value: `${activeAgents}/${AGENTS.length}`, icon: Bot, color: "text-purple-400" },
          { label: "Tasks Today", value: totalTasks.toLocaleString(), icon: Activity, color: "text-cyan-400" },
          { label: "Avg Success Rate", value: `${avgSuccess.toFixed(1)}%`, icon: CheckCircle2, color: "text-green-400" },
          { label: "Avg Latency", value: "1.4s", icon: Zap, color: "text-yellow-400" },
        ].map(kpi => (
          <Card key={kpi.label} className="glass-card border-white/10">
            <CardContent className="p-4">
              <kpi.icon className={`w-5 h-5 ${kpi.color} mb-2`} />
              <div className="text-2xl font-bold font-mono">{kpi.value}</div>
              <div className="text-xs text-white/40 mt-1">{kpi.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="tasks">Task Queue</TabsTrigger>
          <TabsTrigger value="topology">Topology</TabsTrigger>
        </TabsList>

        {/* Agents */}
        <TabsContent value="agents" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AGENTS.map(agent => (
              <Card key={agent.id} className={`glass-card border cursor-pointer hover:scale-[1.01] transition-transform ${colorMap[agent.color].split(" ").slice(1).join(" ")}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorMap[agent.color].split(" ").slice(1).join(" ")}`}>
                        <Bot className={`w-4 h-4 ${colorMap[agent.color].split(" ")[0]}`} />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{agent.name}</div>
                        <div className="text-xs text-white/40">{agent.role}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs border ${statusBadge[agent.status]}`}>{agent.status}</Badge>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        {agent.status === "active" ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center mb-3">
                    <div>
                      <div className="text-sm font-bold font-mono">{agent.tasks.toLocaleString()}</div>
                      <div className="text-xs text-white/30">Tasks</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold font-mono text-green-400">{agent.success}%</div>
                      <div className="text-xs text-white/30">Success</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold font-mono">{agent.load}%</div>
                      <div className="text-xs text-white/30">Load</div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-white/40">
                      <span>CPU Load</span>
                      <span>{agent.load}%</span>
                    </div>
                    <Progress value={agent.load} className="h-1.5" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Task Queue */}
        <TabsContent value="tasks" className="mt-4 space-y-2">
          {TASKS.map(task => (
            <Card key={task.id} className="glass-card border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-white/30">{task.id}</span>
                    <div>
                      <div className="font-semibold text-sm">{task.type}</div>
                      <div className="text-xs text-white/40">{task.agent} &middot; {task.user}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={`text-xs border ${task.priority === "critical" ? "border-red-500/30 text-red-300" : task.priority === "high" ? "border-orange-500/30 text-orange-300" : "border-white/10 text-white/40"}`}>
                      {task.priority}
                    </Badge>
                    <Badge className={`text-xs border ${statusBadge[task.status]}`}>{task.status}</Badge>
                    <span className="text-xs font-mono text-white/30">{task.duration}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Topology */}
        <TabsContent value="topology" className="mt-4">
          <Card className="glass-card border-white/10">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full gradient-psychedelic flex items-center justify-center mx-auto mb-3">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div className="font-bold text-lg">SKYCOIN4444 AI Orchestrator</div>
                <div className="text-xs text-white/40">Central coordination layer</div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {AGENTS.map(agent => (
                  <div key={agent.id} className="text-center">
                    <div className="relative">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 w-px h-4 bg-white/10" />
                    </div>
                    <div className={`p-3 rounded-xl border ${colorMap[agent.color].split(" ").slice(1).join(" ")} text-center`}>
                      <Bot className={`w-5 h-5 ${colorMap[agent.color].split(" ")[0]} mx-auto mb-1`} />
                      <div className="text-xs font-semibold">{agent.name}</div>
                      <div className={`text-xs mt-1 ${agent.status === "active" ? "text-green-400" : "text-white/30"}`}>
                        {agent.status === "active" ? "● live" : "○ idle"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
