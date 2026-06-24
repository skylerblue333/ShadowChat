import { useRoute } from "wouter";
import { Bot, Activity, Clock, CheckCircle, TrendingUp, Settings, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const AGENTS: Record<string, { name: string; desc: string; color: string; tasks: number; uptime: string; category: string }> = {
  "hope-ai": { name: "HOPE AI", desc: "Your personal AI companion with voice, chat, and autonomous task execution", color: "from-teal-500 to-cyan-600", tasks: 1247, uptime: "99.9%", category: "Social" },
  "oracle": { name: "Oracle", desc: "Real-time price oracle and market signal generator for all major crypto pairs", color: "from-amber-500 to-orange-600", tasks: 8934, uptime: "...", category: "Trading" },
  "shield": { name: "Shield", desc: "Security monitoring, fraud detection, and threat prevention across the platform", color: "from-red-500 to-rose-600", tasks: 3421, uptime: "100%", category: "Security" },
};

export default function AgentDetail() {
  const [, params] = useRoute("/agents/:id");
  const id = params?.id ?? "hope-ai";
  const agent = AGENTS[id] ?? AGENTS["hope-ai"];
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pb-24">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${agent.color} flex items-center justify-center`}>
                <Bot className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">{agent.name}</h1>
                <Badge className="bg-emerald-500/15 text-emerald-400 border-0 mt-1">● Active</Badge>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-slate-700 text-slate-300 gap-2"><Settings className="h-4 w-4" /> Configure</Button>
              <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 border-0 text-white gap-2"><Play className="h-4 w-4" /> Run Task</Button>
            </div>
          </div>
          <p className="text-slate-400 mb-6">{agent.desc}</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Tasks Run", value: agent.tasks.toLocaleString(), color: "text-cyan-400" },
              { label: "Uptime", value: agent.uptime, color: "text-emerald-400" },
              { label: "Category", value: agent.category, color: "text-purple-400" },
            ].map(s => (
              <div key={s.label} className="rounded-xl bg-slate-950/60 p-4">
                <div className="text-xs text-slate-500 mb-1">{s.label}</div>
                <div className={`text-xl font-black ${s.color}`}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6">
          <h2 className="font-bold text-white mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {["Task completed: Market analysis", "Signal generated: BTC breakout", "Report saved to vault", "Notification sent to 847 users"].map((a, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-slate-300">{a}</span>
                <span className="text-slate-600 ml-auto">{i + 1}m ago</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
