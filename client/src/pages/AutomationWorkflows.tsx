import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Zap, Plus, Play, Pause, Settings, ArrowRight, CheckCircle2,
  DollarSign, Heart, Users, Bell, Bot, Shield, Flame, Clock,
  Lock, Unlock, Star, MessageSquare, TrendingUp, RefreshCw,
} from "lucide-react";

type Workflow = {
  id: string;
  name: string;
  trigger: string;
  action: string;
  status: "active" | "paused" | "draft";
  runs: number;
  lastRun: string;
  category: string;
};

const WORKFLOWS: Workflow[] = [
  { id: "wf-1", name: "Tip → Unlock Premium Content", trigger: "User tips $5+", action: "Unlock premium post for 30 days", status: "active", runs: 1240, lastRun: "2m ago", category: "monetization" },
  { id: "wf-2", name: "New Subscriber → Welcome DM", trigger: "User subscribes", action: "Send personalized welcome DM via Hope AI", status: "active", runs: 847, lastRun: "5m ago", category: "engagement" },
  { id: "wf-3", name: "High Engagement → Boost Post", trigger: "Post gets 100+ likes in 1hr", action: "Auto-boost post to trending feed", status: "active", runs: 234, lastRun: "18m ago", category: "growth" },
  { id: "wf-4", name: "Fraud Alert → Auto-Freeze", trigger: "Fraud score > 0.85", action: "Freeze account + notify admin", status: "active", runs: 12, lastRun: "2h ago", category: "security" },
  { id: "wf-5", name: "Stake → Reward Notification", trigger: "User stakes SKY444", action: "Send reward projection + badge", status: "active", runs: 560, lastRun: "8m ago", category: "crypto" },
  { id: "wf-6", name: "Inactivity → Re-engagement", trigger: "User inactive 7 days", action: "Send Hope AI personalized nudge", status: "paused", runs: 89, lastRun: "1d ago", category: "retention" },
  { id: "wf-7", name: "PPV Purchase → Thank You", trigger: "User buys PPV content", action: "Send thank you + recommend similar content", status: "active", runs: 320, lastRun: "12m ago", category: "monetization" },
  { id: "wf-8", name: "New Post → AI Moderation", trigger: "Post created", action: "Run AI moderation check + auto-approve/flag", status: "active", runs: 12400, lastRun: "30s ago", category: "security" },
  { id: "wf-9", name: "Charity Goal Reached → Announce", trigger: "Campaign hits 100%", action: "Post announcement + notify all donors", status: "draft", runs: 0, lastRun: "Never", category: "charity" },
  { id: "wf-10", name: "Low Balance → Top-up Prompt", trigger: "Wallet balance < $5", action: "Send low balance notification + deposit CTA", status: "paused", runs: 145, lastRun: "3h ago", category: "crypto" },
];

const TEMPLATES = [
  { name: "Creator Monetization Pack", desc: "Tip unlocks, subscriber welcome, PPV thank you", count: 3, icon: DollarSign, color: "text-green-400" },
  { name: "Growth Engine", desc: "Engagement boost, viral detection, trending push", count: 4, icon: TrendingUp, color: "text-purple-400" },
  { name: "Security Shield", desc: "Fraud freeze, spam detection, bot blocking", count: 5, icon: Shield, color: "text-red-400" },
  { name: "Retention Suite", desc: "Re-engagement, churn prevention, loyalty rewards", count: 4, icon: Heart, color: "text-pink-400" },
  { name: "Crypto Automation", desc: "Stake rewards, price alerts, governance notifications", count: 6, icon: Zap, color: "text-yellow-400" },
  { name: "AI Assistant Pack", desc: "Hope AI triggers, sentiment responses, smart replies", count: 3, icon: Bot, color: "text-cyan-400" },
];

const categoryColors: Record<string, string> = {
  monetization: "bg-green-500/20 text-green-300",
  engagement: "bg-purple-500/20 text-purple-300",
  growth: "bg-blue-500/20 text-blue-300",
  security: "bg-red-500/20 text-red-300",
  crypto: "bg-yellow-500/20 text-yellow-300",
  retention: "bg-pink-500/20 text-pink-300",
  charity: "bg-orange-500/20 text-orange-300",
};

const statusColors: Record<string, string> = {
  active: "bg-green-500/20 text-green-300 border-green-500/30",
  paused: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  draft: "bg-white/10 text-white/40 border-white/10",
};

export default function AutomationWorkflows() {
  const [workflows, setWorkflows] = useState(WORKFLOWS);
  const [activeTab, setActiveTab] = useState("workflows");

  const toggleWorkflow = (id: string) => {
    setWorkflows(prev => prev.map(w =>
      w.id === id ? { ...w, status: w.status === "active" ? "paused" : "active" } : w
    ));
  };

  const totalRuns = workflows.reduce((s, w) => s + w.runs, 0);
  const activeCount = workflows.filter(w => w.status === "active").length;

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-8 w-8 rounded-lg gradient-psychedelic flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gradient">Automation Workflows</h1>
          </div>
          <p className="text-sm text-white/50">Visual rule builder — "if this happens → do that" for the entire platform</p>
        </div>
        <Button className="gradient-psychedelic text-white gap-2">
          <Plus className="w-4 h-4" /> New Workflow
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Workflows", value: `${activeCount}/${workflows.length}`, icon: Zap, color: "text-green-400" },
          { label: "Total Runs", value: totalRuns.toLocaleString(), icon: Play, color: "text-purple-400" },
          { label: "Success Rate", value: "99.4%", icon: CheckCircle2, color: "text-cyan-400" },
          { label: "Avg Latency", value: "120ms", icon: Clock, color: "text-yellow-400" },
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
          <TabsTrigger value="workflows">My Workflows</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="builder">Builder</TabsTrigger>
        </TabsList>

        {/* Workflows */}
        <TabsContent value="workflows" className="mt-4 space-y-3">
          {workflows.map(wf => (
            <Card key={wf.id} className="glass-card border-white/10 hover:border-white/20 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={wf.status === "active"}
                    onCheckedChange={() => toggleWorkflow(wf.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-sm">{wf.name}</span>
                      <Badge className={`text-xs ${categoryColors[wf.category]}`}>{wf.category}</Badge>
                      <Badge className={`text-xs border ${statusColors[wf.status]}`}>{wf.status}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <span className="bg-white/5 rounded px-1.5 py-0.5">{wf.trigger}</span>
                      <ArrowRight className="w-3 h-3" />
                      <span className="bg-white/5 rounded px-1.5 py-0.5">{wf.action}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-mono font-bold">{wf.runs.toLocaleString()}</div>
                    <div className="text-xs text-white/30">{wf.lastRun}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Templates */}
        <TabsContent value="templates" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TEMPLATES.map(tpl => (
              <Card key={tpl.name} className="glass-card border-white/10 hover:border-white/20 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                      <tpl.icon className={`w-5 h-5 ${tpl.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm mb-1">{tpl.name}</div>
                      <div className="text-xs text-white/40 mb-3">{tpl.desc}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/30">{tpl.count} workflows</span>
                        <Button size="sm" className="h-6 text-xs gradient-psychedelic text-white border-0">
                          Install Pack
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Builder */}
        <TabsContent value="builder" className="mt-4">
          <Card className="glass-card border-white/10">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full gradient-psychedelic flex items-center justify-center mx-auto">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold">Visual Workflow Builder</h3>
              <p className="text-sm text-white/50 max-w-md mx-auto">
                Drag-and-drop workflow builder. Connect triggers, conditions, and actions without code.
                Supports all platform events: tips, posts, staking, fraud alerts, AI signals, and more.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <div className="flex items-center gap-2 bg-white/5 rounded-xl px-4 py-3">
                  <Bell className="w-4 h-4 text-purple-400" />
                  <span className="text-sm">Trigger</span>
                  <ArrowRight className="w-4 h-4 text-white/30" />
                  <Settings className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm">Condition</span>
                  <ArrowRight className="w-4 h-4 text-white/30" />
                  <Zap className="w-4 h-4 text-green-400" />
                  <span className="text-sm">Action</span>
                </div>
              </div>
              <Button className="gradient-psychedelic text-white gap-2">
                <Plus className="w-4 h-4" /> Open Builder
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
