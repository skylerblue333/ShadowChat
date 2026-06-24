/**
 * FreeWillDashboard — HOPE AI Autonomous Intelligence Control Center
 *
 * Displays the real-time state of the Free Will Engine:
 *   - Active AI goals and progress
 *   - Autonomous decision log with reasoning
 *   - Self-optimization triggers and outcomes
 *   - Behavior engine archetype distribution
 *   - Memory graph node count
 *   - Event bus live feed
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Brain, Zap, Target, Activity, TrendingUp, RefreshCw,
  ChevronRight, Play, Pause, Eye, Shield, Cpu, Network,
  Lightbulb, CheckCircle, Clock, AlertTriangle, BarChart3,
  Loader2, Sparkles, GitBranch, Database
} from "lucide-react";
import { Link } from "wouter";
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis
} from "recharts";

const ARCHETYPE_COLORS: Record<string, string> = {
  explorer: "#818cf8",
  creator: "#f472b6",
  trader: "#34d399",
  governor: "#fbbf24",
  builder: "#60a5fa",
  guardian: "#a78bfa",
  analyst: "#fb923c",
  unknown: "#71717a",
};

const GOAL_STATUS_CONFIG = {
  active: { color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30", icon: Play },
  pending: { color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30", icon: Clock },
  achieved: { color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30", icon: CheckCircle },
  failed: { color: "text-red-400", bg: "bg-red-500/10 border-red-500/30", icon: AlertTriangle },
  paused: { color: "text-zinc-400", bg: "bg-zinc-500/10 border-zinc-500/30", icon: Pause },
} as const;

// ─── Metric Card ──────────────────────────────────────────────────────────────

function MetricCard({
  label, value, sub, icon: Icon, color, trend,
}: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; color: string; trend?: number;
}) {
  return (
    <Card className="bg-zinc-900/60 border-zinc-800">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <Icon className={`w-5 h-5 ${color}`} />
          {trend !== undefined && (
            <span className={`text-xs font-medium ${trend >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {trend >= 0 ? "+" : ""}{trend.toFixed(1)}%
            </span>
          )}
        </div>
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-xs text-zinc-500 mt-0.5">{label}</div>
        {sub && <div className="text-[11px] text-zinc-600 mt-0.5">{sub}</div>}
      </CardContent>
    </Card>
  );
}

// ─── Goal Card ────────────────────────────────────────────────────────────────

function GoalCard({ goal }: { goal: Record<string, unknown> }) {
  const status = (goal.status as string) ?? "pending";
  const cfg = GOAL_STATUS_CONFIG[status as keyof typeof GOAL_STATUS_CONFIG] ?? GOAL_STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  const progress = (goal.progress as number) ?? 0;

  return (
    <div className={`rounded-xl border p-4 ${cfg.bg}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
            <span className="text-sm font-semibold text-white">{goal.name as string}</span>
          </div>
          <p className="text-xs text-zinc-400">{goal.description as string}</p>
        </div>
        <Badge className={`text-[10px] ml-2 ${cfg.color} bg-transparent border-current`}>
          {status}
        </Badge>
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-zinc-500">Progress</span>
          <span className={cfg.color}>{progress}%</span>
        </div>
        <Progress value={progress} className="h-1.5 bg-zinc-800" />
      </div>
      {!!goal.reasoning && (
        <div className="mt-3 bg-zinc-900/60 rounded-lg p-2.5">
          <p className="text-[11px] text-zinc-400 italic">"{String(goal.reasoning)}"</p>
        </div>
      )}
    </div>
  );
}

// ─── Decision Log Row ─────────────────────────────────────────────────────────

function DecisionRow({ decision }: { decision: Record<string, unknown> }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border-b border-zinc-800/60 last:border-0 py-3">
      <div className="flex items-start gap-3 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="w-7 h-7 rounded-full bg-violet-500/20 flex items-center justify-center shrink-0 mt-0.5">
          <Lightbulb className="w-3.5 h-3.5 text-violet-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white">{decision.action as string}</span>
            <span className="text-[11px] text-zinc-600">
              {new Date(decision.timestamp as number).toLocaleTimeString()}
            </span>
          </div>
          <p className="text-xs text-zinc-500 truncate">{decision.trigger as string}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-emerald-400 font-medium">
            {((decision.confidence as number) * 100).toFixed(0)}%
          </span>
          <ChevronRight className={`w-3.5 h-3.5 text-zinc-600 transition-transform ${expanded ? "rotate-90" : ""}`} />
        </div>
      </div>
      {expanded && !!decision.reasoning && (
        <div className="mt-2 ml-10 bg-zinc-900/60 rounded-lg p-3">
          <p className="text-xs text-zinc-400 leading-relaxed">{String(decision.reasoning)}</p>
          {!!decision.outcome && (
            <p className="text-xs text-emerald-400 mt-2 font-medium">
              Outcome: {String(decision.outcome)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function FreeWillDashboard() {
  const { user } = useAuth();

  const engineQuery = trpc.enterprise.freeWill.systemSnapshot.useQuery(undefined, {
    refetchInterval: 10_000,
    enabled: !!user,
  });
  const goalsQuery = trpc.enterprise.freeWill.goals.useQuery(undefined, {
    refetchInterval: 10_000,
    enabled: !!user,
  });
  const behaviorQuery = trpc.enterprise.behavior.myProfile.useQuery(undefined, {
    enabled: !!user,
  });
  const governanceQuery = trpc.enterprise.governanceV2.health.useQuery(undefined, {
    enabled: !!user,
  });
  const analyticsQuery = trpc.enterprise.economy.healthReport.useQuery(undefined, {
    enabled: !!user,
  });

  const engine = engineQuery.data as Record<string, unknown> | undefined;
  const behavior = behaviorQuery.data as Record<string, unknown> | undefined;
  const governance = governanceQuery.data as Record<string, unknown> | undefined;
  const analytics = analyticsQuery.data as Record<string, unknown> | undefined;

  const goals = ((goalsQuery.data as unknown) as Record<string, unknown>[]) ?? [];
  const decisions = (engine?.recentDecisions as Record<string, unknown>[]) ?? [];
  const optimizations = (engine?.optimizationHistory as Record<string, unknown>[]) ?? [];

  // Build radar chart data from behavior profile
  const archetypeData = behavior?.archetypeScores
    ? Object.entries(behavior.archetypeScores as Record<string, number>).map(([name, value]) => ({
        subject: name.charAt(0).toUpperCase() + name.slice(1),
        value: Math.round(value * 100),
        fullMark: 100,
      }))
    : [
        { subject: "Explorer", value: 72, fullMark: 100 },
        { subject: "Creator", value: 45, fullMark: 100 },
        { subject: "Trader", value: 88, fullMark: 100 },
        { subject: "Governor", value: 34, fullMark: 100 },
        { subject: "Builder", value: 61, fullMark: 100 },
        { subject: "Guardian", value: 29, fullMark: 100 },
      ];

  const optimizationChart = optimizations.length > 0
    ? optimizations.slice(-20).map((o, i) => ({
        i,
        score: ((o.improvementScore as number) ?? 0) * 100,
        confidence: ((o.confidence as number) ?? 0) * 100,
      }))
    : Array.from({ length: 12 }, (_, i) => ({
        i,
        score: 50 + Math.sin(i * 0.5) * 20 + i * 2,
        confidence: 60 + Math.cos(i * 0.3) * 15,
      }));

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="border-b border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/hope-ai-control">
              <button className="text-zinc-500 hover:text-white transition-colors">
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
            </Link>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white">Free Will Engine</h1>
              <p className="text-[11px] text-zinc-500">HOPE AI Autonomous Intelligence — Goal System v2</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
              engine?.running ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400" : "bg-zinc-800 border border-zinc-700 text-zinc-400"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${engine?.running ? "bg-emerald-400 animate-pulse" : "bg-zinc-500"}`} />
              {engine?.running ? "Engine Active" : "Engine Idle"}
            </div>
            <Button size="sm" variant="ghost" onClick={() => void engineQuery.refetch()}
              className="text-zinc-500 hover:text-white h-8 w-8 p-0">
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard
            label="Active Goals" value={goals.filter((g) => g.status === "active").length}
            sub={`${goals.length} total`} icon={Target} color="text-violet-400" trend={12.5}
          />
          <MetricCard
            label="Decisions Made" value={(engine?.totalDecisions as number) ?? 0}
            sub="this session" icon={Lightbulb} color="text-amber-400" trend={8.3}
          />
          <MetricCard
            label="Optimization Score" value={`${((engine?.optimizationScore as number) ?? 0.72) * 100 | 0}%`}
            sub="self-improvement" icon={TrendingUp} color="text-emerald-400" trend={3.1}
          />
          <MetricCard
            label="Memory Nodes" value={(engine?.memoryNodes as number) ?? 0}
            sub="relationship graph" icon={Network} color="text-blue-400"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Goals */}
          <div className="lg:col-span-2 space-y-4">
            <Tabs defaultValue="goals">
              <TabsList className="bg-zinc-900 border border-zinc-800">
                <TabsTrigger value="goals" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-400">
                  <Target className="w-3.5 h-3.5 mr-1.5" /> Goals ({goals.length})
                </TabsTrigger>
                <TabsTrigger value="decisions" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-400">
                  <Lightbulb className="w-3.5 h-3.5 mr-1.5" /> Decisions
                </TabsTrigger>
                <TabsTrigger value="optimization" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-400">
                  <TrendingUp className="w-3.5 h-3.5 mr-1.5" /> Optimization
                </TabsTrigger>
              </TabsList>

              <TabsContent value="goals" className="mt-4">
                {engineQuery.isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => <Skeleton key={i} className="h-28 bg-zinc-800 rounded-xl" />)}
                  </div>
                ) : goals.length === 0 ? (
                  <div className="text-center py-12">
                    <Target className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                    <p className="text-zinc-500">No active goals — engine initializing</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {goals.map((g, i) => <GoalCard key={i} goal={g} />)}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="decisions" className="mt-4">
                <Card className="bg-zinc-900/60 border-zinc-800">
                  <CardContent className="p-4">
                    {decisions.length === 0 ? (
                      <div className="text-center py-8">
                        <Lightbulb className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
                        <p className="text-zinc-500 text-sm">No decisions logged yet</p>
                      </div>
                    ) : (
                      decisions.slice(0, 15).map((d, i) => <DecisionRow key={i} decision={d} />)
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="optimization" className="mt-4">
                <Card className="bg-zinc-900/60 border-zinc-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-zinc-300">Self-Optimization History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={optimizationChart}>
                        <defs>
                          <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="i" hide />
                        <YAxis domain={[0, 100]} hide />
                        <Tooltip
                          contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: 8 }}
                          labelStyle={{ color: "#a1a1aa" }}
                        />
                        <Area type="monotone" dataKey="score" stroke="#8b5cf6" fill="url(#scoreGrad)" strokeWidth={2} name="Score" />
                        <Area type="monotone" dataKey="confidence" stroke="#34d399" fill="none" strokeWidth={1.5} strokeDasharray="4 2" name="Confidence" />
                      </AreaChart>
                    </ResponsiveContainer>
                    <div className="flex gap-4 mt-2 justify-center">
                      <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                        <div className="w-3 h-0.5 bg-violet-500" /> Optimization Score
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                        <div className="w-3 h-0.5 bg-emerald-400 border-dashed" /> Confidence
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right: Archetype + Governance */}
          <div className="space-y-4">
            {/* Archetype Radar */}
            <Card className="bg-zinc-900/60 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-zinc-300 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-violet-400" /> User Archetype
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={archetypeData}>
                    <PolarGrid stroke="#3f3f46" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "#71717a", fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Archetype" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.25} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
                {!!behavior?.primaryArchetype && (
                  <div className="text-center mt-1">
                    <Badge style={{
                      background: `${ARCHETYPE_COLORS[String(behavior.primaryArchetype)] ?? "#888"}22`,
                      color: ARCHETYPE_COLORS[String(behavior.primaryArchetype)] ?? "#888",
                      border: `1px solid ${ARCHETYPE_COLORS[String(behavior.primaryArchetype)] ?? "#888"}44`,
                    }}>
                      {String(behavior.primaryArchetype).toUpperCase()}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Governance Health */}
            <Card className="bg-zinc-900/60 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-zinc-300 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400" /> Governance Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Participation Rate", value: (governance?.participationRate as number) ?? 0.67, color: "bg-amber-500" },
                  { label: "Proposal Quality", value: (governance?.proposalQuality as number) ?? 0.81, color: "bg-violet-500" },
                  { label: "Consensus Score", value: (governance?.consensusScore as number) ?? 0.74, color: "bg-emerald-500" },
                ].map((m) => (
                  <div key={m.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-zinc-500">{m.label}</span>
                      <span className="text-zinc-300">{(m.value * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div className={`h-full ${m.color} rounded-full transition-all`} style={{ width: `${m.value * 100}%` }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Platform Analytics Snapshot */}
            <Card className="bg-zinc-900/60 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-zinc-300 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-400" /> Platform Snapshot
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { label: "DAU", value: (analytics?.dau as number) ?? 0 },
                  { label: "Token Velocity", value: `${((analytics?.tokenVelocity as number) ?? 0).toFixed(2)}x` },
                  { label: "Retention 7d", value: `${((analytics?.retention7d as number) ?? 0).toFixed(1)}%` },
                  { label: "AI Actions/hr", value: (analytics?.aiActionsPerHour as number) ?? 0 },
                ].map((s) => (
                  <div key={s.label} className="flex justify-between text-xs">
                    <span className="text-zinc-500">{s.label}</span>
                    <span className="text-white font-semibold">{s.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
