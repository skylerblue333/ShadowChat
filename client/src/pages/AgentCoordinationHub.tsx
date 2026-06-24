import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";
import {
  Bot, GitBranch, Zap, Play, Pause, CheckCircle, Clock, AlertCircle,
  ArrowRight, Network, Cpu, RefreshCw, Plus, Settings, Eye
} from "lucide-react";

const AGENT_TEAMS = [
  {
    id: "content-team",
    name: "Content Team",
    description: "Generates, moderates, and distributes content across all channels",
    agents: ["NOVA (Creator)", "PRISM (Social)", "FORGE (Copy)"],
    status: "active",
    tasksCompleted: 1247,
    currentTask: "Generating trending post suggestions",
  },
  {
    id: "crypto-team",
    name: "Crypto Team",
    description: "Monitors markets, executes trades, manages staking rewards",
    agents: ["CIPHER (DeFi)", "NEXUS (Wallet)", "ATLAS (Data)"],
    status: "active",
    tasksCompleted: 892,
    currentTask: "Analyzing SKY444 price momentum",
  },
  {
    id: "security-team",
    name: "Security Team",
    description: "Monitors threats, detects fraud, enforces rate limits",
    agents: ["SHIELD (Security)", "VECTOR (Moderation)", "ECHO (Alerts)"],
    status: "active",
    tasksCompleted: 3401,
    currentTask: "Scanning for suspicious wallet activity",
  },
  {
    id: "growth-team",
    name: "Growth Team",
    description: "Optimizes feed ranking, user acquisition, and retention",
    agents: ["TITAN (Analytics)", "OMEGA (Recommendations)", "PULSE (Trends)"],
    status: "idle",
    tasksCompleted: 567,
    currentTask: "Idle — waiting for next scheduled run",
  },
];

const WORKFLOW_TEMPLATES = [
  {
    id: "content-pipeline",
    name: "Content Pipeline",
    steps: ["FORGE generates post", "PRISM schedules", "NOVA distributes", "VECTOR moderates"],
    trigger: "Every 4 hours",
    status: "running",
  },
  {
    id: "market-alert",
    name: "Market Alert Chain",
    steps: ["CIPHER detects spike", "ATLAS validates data", "ECHO sends alert", "NEXUS adjusts limits"],
    trigger: "Price change > 5%",
    status: "running",
  },
  {
    id: "onboarding-flow",
    name: "User Onboarding Flow",
    steps: ["TITAN scores user", "OMEGA recommends content", "PULSE suggests creators", "NOVA sends welcome"],
    trigger: "New user signup",
    status: "paused",
  },
];

export default function AgentCoordinationHub() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"teams" | "workflows" | "delegation" | "logs">("teams");
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [delegationTask, setDelegationTask] = useState("");
  const [delegationTarget, setDelegationTarget] = useState("content-team");

  const { data: sprintHistory } = trpc.sprint.history.useQuery({ limit: 10 });
  const { data: sprintMetrics } = trpc.sprint.metrics.useQuery({ days: 7 });

  const triggerSprintMut = trpc.sprint.triggerSprint.useMutation({
    onSuccess: () => toast.success("Sprint triggered — agents are working"),
    onError: () => toast.error("Failed to trigger sprint"),
  });

  const totalTasksCompleted = AGENT_TEAMS.reduce((s, t) => s + t.tasksCompleted, 0);
  const activeTeams = AGENT_TEAMS.filter(t => t.status === "active").length;

  return (
    <div className="container py-8 max-w-7xl animate-page-in">
      <PageHeader
        backHref="/ai-engineer"
        icon={Network}
        title="Agent Coordination Hub"
        subtitle="Phase 9 — Intelligence Layer: Agent-to-agent delegation, workflow chaining, specialized teams"
      />

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Active Teams", value: activeTeams, icon: Bot, color: "text-green-400" },
          { label: "Tasks Completed", value: totalTasksCompleted.toLocaleString(), icon: CheckCircle, color: "text-blue-400" },
          { label: "Workflows Running", value: WORKFLOW_TEMPLATES.filter(w => w.status === "running").length, icon: GitBranch, color: "text-purple-400" },
          { label: "Sprint Tasks (7d)", value: (sprintMetrics as any)?.totalTasks ?? "—", icon: Zap, color: "text-yellow-400" },
        ].map(stat => (
          <div key={stat.label} className="card p-4 flex items-center gap-3">
            <stat.icon className={`w-8 h-8 ${stat.color}`} />
            <div>
              <div className="text-xl font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-border/50">
        {(["teams", "workflows", "delegation", "logs"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Teams tab */}
      {activeTab === "teams" && (
        <div className="grid md:grid-cols-2 gap-4">
          {AGENT_TEAMS.map(team => (
            <div
              key={team.id}
              className={`card p-5 cursor-pointer transition-all hover:border-primary/50 ${selectedTeam === team.id ? "border-primary" : ""}`}
              onClick={() => setSelectedTeam(selectedTeam === team.id ? null : team.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-semibold flex items-center gap-2">
                    <Bot className="w-4 h-4 text-primary" />
                    {team.name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{team.description}</div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  team.status === "active" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                }`}>
                  {team.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {team.agents.map(a => (
                  <span key={a} className="text-xs bg-secondary/50 px-2 py-0.5 rounded-full">{a}</span>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  {team.tasksCompleted.toLocaleString()} tasks
                </span>
                <span className="flex items-center gap-1 truncate max-w-[200px]">
                  <Clock className="w-3 h-3 text-blue-400 shrink-0" />
                  {team.currentTask}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Workflows tab */}
      {activeTab === "workflows" && (
        <div className="space-y-4">
          {WORKFLOW_TEMPLATES.map(wf => (
            <div key={wf.id} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-semibold flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-purple-400" />
                    {wf.name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Trigger: {wf.trigger}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    wf.status === "running" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    {wf.status}
                  </span>
                  <button className="p-1.5 rounded-lg hover:bg-secondary/50 transition-colors">
                    {wf.status === "running" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {wf.steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-lg">{step}</span>
                    {i < wf.steps.length - 1 && <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button
            className="w-full card p-4 border-dashed flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
            onClick={() => toast.info("Workflow builder coming in Phase 9.2")}
          >
            <Plus className="w-4 h-4" />
            Create New Workflow
          </button>
        </div>
      )}

      {/* Delegation tab */}
      {activeTab === "delegation" && (
        <div className="max-w-2xl space-y-6">
          <div className="card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-primary" />
              Delegate Task to Agent Team
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Target Team</label>
                <select
                  value={delegationTarget}
                  onChange={e => setDelegationTarget(e.target.value)}
                  className="w-full bg-secondary/50 border border-border/50 rounded-lg px-3 py-2 text-sm"
                >
                  {AGENT_TEAMS.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Task Description</label>
                <textarea
                  value={delegationTask}
                  onChange={e => setDelegationTask(e.target.value)}
                  rows={4}
                  className="w-full bg-secondary/50 border border-border/50 rounded-lg px-3 py-2 text-sm resize-none"
                  placeholder="Describe the task for the agent team... e.g. 'Analyze top 10 trending posts and generate 5 similar posts for tomorrow'"
                />
              </div>
              <button
                onClick={() => {
                  if (!delegationTask.trim()) return toast.error("Enter a task description");
                  toast.success(`Task delegated to ${AGENT_TEAMS.find(t => t.id === delegationTarget)?.name}`);
                  setDelegationTask("");
                }}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Delegate Task
              </button>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-blue-400" />
              Trigger Autonomous Sprint
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Triggers all 12 bots to run a coordinated autonomous coding sprint. Each bot generates code, tests, and commits changes.
            </p>
            <button
              onClick={() => user ? triggerSprintMut.mutate() : toast.error("Login required")}
              disabled={triggerSprintMut.isPending}
              className="btn-primary flex items-center gap-2"
            >
              {triggerSprintMut.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              {triggerSprintMut.isPending ? "Running..." : "Trigger Sprint"}
            </button>
          </div>
        </div>
      )}

      {/* Logs tab */}
      {activeTab === "logs" && (
        <div className="space-y-3">
          {(sprintHistory as any[])?.map((sprint: any, i: number) => (
            <div key={i} className="card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${sprint.status === "completed" ? "bg-green-400" : sprint.status === "running" ? "bg-blue-400 animate-pulse" : "bg-red-400"}`} />
                <div>
                  <div className="text-sm font-medium">Sprint #{sprint.id ?? i + 1}</div>
                  <div className="text-xs text-muted-foreground">{sprint.description ?? "Autonomous coding sprint"}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">{sprint.linesGenerated ?? "—"} lines</div>
                <div className="text-xs text-muted-foreground">{sprint.completedAt ? new Date(sprint.completedAt).toLocaleString() : "In progress"}</div>
              </div>
            </div>
          )) ?? (
            <div className="text-center py-12 text-muted-foreground">
              <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No sprint history yet. Trigger a sprint to see logs.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
