import { useState } from "react";
import { Zap, Play, CheckCircle, Clock, AlertCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const SPRINT_TASKS = [
  { id: "1", name: "Analyze BTC price trend", agent: "Oracle", status: "done", duration: "2.3s", output: "+18.2% signal detected" },
  { id: "2", name: "Generate weekly report", agent: "Forge", status: "running", duration: "12s", output: "Processing..." },
  { id: "3", name: "Scan for security threats", agent: "Shield", status: "done", duration: "0.8s", output: "No threats found" },
  { id: "4", name: "Optimize staking yield", agent: "Atlas", status: "queued", duration: "--", output: "Waiting..." },
  { id: "5", name: "Post social content", agent: "Echo", status: "done", duration: "1.1s", output: "Posted to 3 channels" },
];

export default function AgentSprint() {
  const [tasks, setTasks] = useState(SPRINT_TASKS);
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pb-24">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white mb-1">Agent Sprint</h1>
            <p className="text-slate-400">Run parallel agent tasks in a single sprint</p>
          </div>
          <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 border-0 text-white gap-2">
            <Play className="h-4 w-4" /> Run Sprint
          </Button>
        </div>
        <div className="space-y-3">
          {tasks.map(task => (
            <div key={task.id} className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4 flex items-center gap-4">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${task.status === "done" ? "bg-emerald-500/20" : task.status === "running" ? "bg-cyan-500/20" : "bg-slate-700/40"}`}>
                {task.status === "done" ? <CheckCircle className="h-4 w-4 text-emerald-400" /> : task.status === "running" ? <Zap className="h-4 w-4 text-cyan-400 animate-pulse" /> : <Clock className="h-4 w-4 text-slate-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white text-sm">{task.name}</div>
                <div className="text-xs text-slate-500">Agent: {task.agent} · {task.output}</div>
              </div>
              <div className="text-right shrink-0">
                <Badge className={`text-xs border-0 ${task.status === "done" ? "bg-emerald-500/15 text-emerald-400" : task.status === "running" ? "bg-cyan-500/15 text-cyan-400" : "bg-slate-700/50 text-slate-400"}`}>{task.status}</Badge>
                <div className="text-xs text-slate-500 mt-1">{task.duration}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-2xl border border-dashed border-slate-700 p-6 text-center cursor-pointer hover:border-cyan-500/50 transition-colors">
          <Plus className="h-6 w-6 text-slate-600 mx-auto mb-2" />
          <p className="text-slate-500 text-sm">Add task to sprint</p>
        </div>
      </div>
    </div>
  );
}
