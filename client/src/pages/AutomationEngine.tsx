import { useState } from "react";
import {
  Cpu,
  Play,
  Pause,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  RefreshCw,
  Shield,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const WORKFLOWS = [
  { id: "wf1", name: "New User Onboarding", trigger: "user.created", steps: 4, status: "active", runs: 1240, lastRun: "2m ago" },
  { id: "wf2", name: "Payment Confirmation", trigger: "payment.completed", steps: 3, status: "active", runs: 892, lastRun: "8s ago" },
  { id: "wf3", name: "Daily Reward Distribution", trigger: "cron: 0 0 * * *", steps: 6, status: "active", runs: 30, lastRun: "12h ago" },
  { id: "wf4", name: "Fraud Alert Escalation", trigger: "fraud.detected", steps: 5, status: "paused", runs: 14, lastRun: "2d ago" },
  { id: "wf5", name: "Simulation World Tick", trigger: "cron: */5 * * * *", steps: 2, status: "active", runs: 8640, lastRun: "4m ago" },
];

const JOBS = [
  { id: "job1", name: "Feed Ranking Refresh", status: "running", progress: 67, started: "1m ago", eta: "30s" },
  { id: "job2", name: "AI Persona Tick", status: "completed", progress: 100, started: "5m ago", eta: "—" },
  { id: "job3", name: "Wallet Balance Sync", status: "running", progress: 34, started: "30s ago", eta: "1m" },
  { id: "job4", name: "Trend Score Update", status: "queued", progress: 0, started: "—", eta: "~2m" },
  { id: "job5", name: "Notification Batch Send", status: "failed", progress: 22, started: "8m ago", eta: "—" },
];

const FEATURE_FLAGS = [
  { key: "ai_feed_ranking", label: "AI Feed Ranking", enabled: true, module: "feed" },
  { key: "dating_ai_match", label: "AI Matchmaking", enabled: true, module: "dating" },
  { key: "simulation_engine", label: "Simulation Engine", enabled: true, module: "world" },
  { key: "voice_commands", label: "Voice Commands", enabled: true, module: "ui" },
  { key: "crypto_trading", label: "Live Trading", enabled: false, module: "crypto" },
  { key: "premium_dating", label: "Dating Premium", enabled: true, module: "dating" },
  { key: "ai_moderation", label: "AI Moderation", enabled: true, module: "safety" },
  { key: "web3_wallet", label: "Web3 Wallet Connect", enabled: false, module: "crypto" },
  { key: "ambient_feed", label: "Ambient Feed Mode", enabled: true, module: "ui" },
  { key: "unhidden_mode", label: "Unhidden Mode Access", enabled: true, module: "admin" },
];

const RATE_LIMITS = [
  { endpoint: "chat.sendMessage", limit: "60/min", current: 42, pct: 70 },
  { endpoint: "ai.chat", limit: "10/min", current: 7, pct: 70 },
  { endpoint: "payment.execute", limit: "5/min", current: 1, pct: 20 },
  { endpoint: "social.createPost", limit: "20/min", current: 3, pct: 15 },
  { endpoint: "wallet.transfer", limit: "3/min", current: 0, pct: 0 },
];

const statusColor: Record<string, string> = {
  active: "text-[oklch(0.75_0.2_145)] border-[oklch(0.75_0.2_145)]/30",
  paused: "text-[oklch(0.85_0.18_90)] border-[oklch(0.85_0.18_90)]/30",
  running: "text-[oklch(0.8_0.15_200)] border-[oklch(0.8_0.15_200)]/30",
  completed: "text-[oklch(0.75_0.2_145)] border-[oklch(0.75_0.2_145)]/30",
  queued: "text-white/40 border-white/20",
  failed: "text-[oklch(0.7_0.2_25)] border-[oklch(0.7_0.2_25)]/30",
};

export default function AutomationEngine() {
  const [flags, setFlags] = useState(FEATURE_FLAGS);
  const [killActive, setKillActive] = useState(false);

  const toggleFlag = (key: string) => {
    setFlags((prev) => prev.map((f) => (f.key === key ? { ...f, enabled: !f.enabled } : f)));
    const flag = flags.find((f) => f.key === key);
    toast.success(`${flag?.label} ${flag?.enabled ? "disabled" : "enabled"}`);
  };

  const handleKillSwitch = () => {
    setKillActive(true);
    toast.error("SYSTEM KILL-SWITCH ACTIVATED — Payments frozen, AI paused, read-only mode");
    setTimeout(() => setKillActive(false), 5000);
  };

  return (
    <div className="min-h-screen bg-[oklch(0.08_0.02_270)] text-white">
      <div className="border-b border-white/10 bg-[oklch(0.1_0.03_270)]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Cpu className="w-5 h-5 text-[oklch(0.75_0.2_290)]" />
            <div>
              <h1 className="text-lg font-bold">Automation Engine</h1>
              <p className="text-xs text-white/40">Workflow builder · Trigger system · Job manager · Feature flags · Kill-switch</p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className={`text-xs border-[oklch(0.7_0.2_25)]/40 ${killActive ? "bg-[oklch(0.7_0.2_25)]/20 text-[oklch(0.7_0.2_25)]" : "text-[oklch(0.7_0.2_25)] hover:bg-[oklch(0.7_0.2_25)]/10"}`}
            onClick={handleKillSwitch}
          >
            <Shield className="w-3 h-3 mr-1" />
            {killActive ? "KILL-SWITCH ACTIVE" : "Kill-Switch"}
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <Tabs defaultValue="workflows">
          <TabsList className="bg-white/5 border border-white/10 mb-6">
            <TabsTrigger value="workflows" className="text-xs data-[state=active]:bg-white/10">
              <Zap className="w-3 h-3 mr-1" /> Workflows
            </TabsTrigger>
            <TabsTrigger value="jobs" className="text-xs data-[state=active]:bg-white/10">
              <RefreshCw className="w-3 h-3 mr-1" /> Job Manager
            </TabsTrigger>
            <TabsTrigger value="flags" className="text-xs data-[state=active]:bg-white/10">
              <ToggleLeft className="w-3 h-3 mr-1" /> Feature Flags
            </TabsTrigger>
            <TabsTrigger value="rate-limits" className="text-xs data-[state=active]:bg-white/10">
              <Shield className="w-3 h-3 mr-1" /> Rate Limits
            </TabsTrigger>
          </TabsList>

          {/* Workflows */}
          <TabsContent value="workflows">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white/70">Active Workflows ({WORKFLOWS.filter((w) => w.status === "active").length})</h2>
              <Button size="sm" variant="outline" className="text-xs border-white/20 text-white/60 hover:text-white">
                <Plus className="w-3 h-3 mr-1" /> New Workflow
              </Button>
            </div>
            <div className="space-y-3">
              {WORKFLOWS.map((wf) => (
                <Card key={wf.id} className="bg-white/5 border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${wf.status === "active" ? "bg-[oklch(0.75_0.2_145)] animate-pulse" : "bg-white/20"}`} />
                        <div>
                          <div className="text-sm font-medium text-white/90">{wf.name}</div>
                          <div className="text-xs text-white/40 font-mono mt-0.5">trigger: {wf.trigger}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xs text-white/60">{wf.runs.toLocaleString()} runs</div>
                          <div className="text-xs text-white/30">{wf.lastRun}</div>
                        </div>
                        <Badge variant="outline" className={`text-[9px] ${statusColor[wf.status]}`}>
                          {wf.status}
                        </Badge>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-white/40 hover:text-white">
                            {wf.status === "active" ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                          </Button>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-white/40 hover:text-[oklch(0.7_0.2_25)]">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-1">
                      {Array.from({ length: wf.steps }, (_, i) => (
                        <div key={i} className="flex items-center gap-1">
                          <div className="h-1.5 w-12 rounded-full bg-[oklch(0.75_0.2_145)]/60" />
                          {i < wf.steps - 1 && <ChevronRight className="w-2 h-2 text-white/20" />}
                        </div>
                      ))}
                      <span className="text-[10px] text-white/30 ml-2">{wf.steps} steps</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Job Manager */}
          <TabsContent value="jobs">
            <div className="space-y-3">
              {JOBS.map((job) => (
                <Card key={job.id} className="bg-white/5 border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {job.status === "running" && <RefreshCw className="w-3 h-3 text-[oklch(0.8_0.15_200)] animate-spin" />}
                        {job.status === "completed" && <CheckCircle className="w-3 h-3 text-[oklch(0.75_0.2_145)]" />}
                        {job.status === "failed" && <XCircle className="w-3 h-3 text-[oklch(0.7_0.2_25)]" />}
                        {job.status === "queued" && <Clock className="w-3 h-3 text-white/40" />}
                        <span className="text-sm font-medium text-white/90">{job.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-white/30">started: {job.started}</span>
                        <span className="text-xs text-white/30">eta: {job.eta}</span>
                        <Badge variant="outline" className={`text-[9px] ${statusColor[job.status]}`}>
                          {job.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${job.status === "failed" ? "bg-[oklch(0.7_0.2_25)]" : job.status === "completed" ? "bg-[oklch(0.75_0.2_145)]" : "bg-[oklch(0.8_0.15_200)]"}`}
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-white/30 mt-1 text-right">{job.progress}%</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Feature Flags */}
          <TabsContent value="flags">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {flags.map((flag) => (
                <Card key={flag.key} className="bg-white/5 border-white/10">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-white/90">{flag.label}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="outline" className="text-[9px] text-white/40 border-white/20">{flag.module}</Badge>
                        <span className="text-[10px] font-mono text-white/25">{flag.key}</span>
                      </div>
                    </div>
                    <button onClick={() => toggleFlag(flag.key)} className="transition-transform active:scale-95">
                      {flag.enabled ? (
                        <ToggleRight className="w-8 h-8 text-[oklch(0.75_0.2_145)]" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-white/30" />
                      )}
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Rate Limits */}
          <TabsContent value="rate-limits">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-sm text-white/80">Rate Limit Controller</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {RATE_LIMITS.map((rl) => (
                    <div key={rl.endpoint}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-white/70 font-mono">{rl.endpoint}</span>
                        <span className="text-white/40">{rl.current} / {rl.limit}</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${rl.pct > 80 ? "bg-[oklch(0.7_0.2_25)]" : rl.pct > 50 ? "bg-[oklch(0.85_0.18_90)]" : "bg-[oklch(0.75_0.2_145)]"}`}
                          style={{ width: `${rl.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Kill switch panel */}
            <Card className={`mt-4 border-[oklch(0.7_0.2_25)]/30 ${killActive ? "bg-[oklch(0.7_0.2_25)]/10" : "bg-white/5"}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-[oklch(0.7_0.2_25)] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white/90 mb-1">System Kill-Switch</div>
                    <p className="text-xs text-white/50 mb-3">
                      Activating the kill-switch will: freeze all payments, pause AI processing, disable action execution, and put the platform in read-only mode. Use only in emergencies.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`text-xs ${killActive ? "bg-[oklch(0.7_0.2_25)]/20 border-[oklch(0.7_0.2_25)] text-[oklch(0.7_0.2_25)]" : "border-[oklch(0.7_0.2_25)]/40 text-[oklch(0.7_0.2_25)] hover:bg-[oklch(0.7_0.2_25)]/10"}`}
                      onClick={handleKillSwitch}
                    >
                      <Shield className="w-3 h-3 mr-1" />
                      {killActive ? "KILL-SWITCH ACTIVE (resetting in 5s)" : "Activate Kill-Switch"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
