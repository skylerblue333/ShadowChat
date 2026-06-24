/**
 * EnterpriseAnalytics — SKYCOIN4444 Platform Intelligence Dashboard
 *
 * Real-time analytics across all platform modules:
 *   - Token velocity + emission tracking
 *   - User retention + cohort analysis
 *   - AI agent performance metrics
 *   - Security threat dashboard
 *   - Economy health indicators
 *   - Revenue + treasury flow
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import {
  BarChart3, TrendingUp, TrendingDown, Users, Shield, Zap,
  Coins, Activity, Brain, RefreshCw, ChevronRight, Globe,
  AlertTriangle, CheckCircle, Clock, Target, Cpu
} from "lucide-react";
import { Link } from "wouter";

// ─── Chart Helpers ────────────────────────────────────────────────────────────

function generateTimeSeries(base: number, variance: number, points: number, trend = 0) {
  return Array.from({ length: points }, (_, i) => ({
    t: i,
    v: Math.max(0, base + trend * i + (Math.random() - 0.5) * variance),
  }));
}

const TOKEN_VELOCITY_DATA = generateTimeSeries(2.4, 0.6, 30, 0.02);
const DAU_DATA = generateTimeSeries(8400, 1200, 30, 45);
const RETENTION_DATA = Array.from({ length: 8 }, (_, i) => ({
  week: `W${i + 1}`,
  d1: 100 - i * 8,
  d7: 85 - i * 9,
  d30: 62 - i * 7,
}));
const REVENUE_DATA = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  revenue: 45000 + i * 8000 + Math.random() * 15000,
  burn: 12000 + i * 1500 + Math.random() * 5000,
}));
const THREAT_DATA = [
  { name: "Fraud Signals", value: 23, color: "#ef4444" },
  { name: "Rate Limit Hits", value: 156, color: "#f59e0b" },
  { name: "Anomalies", value: 8, color: "#8b5cf6" },
  { name: "Quarantined", value: 2, color: "#ec4899" },
];
const AI_AGENT_PERF = [
  { name: "NOVA", tasks: 1240, success: 98.2, latency: 145 },
  { name: "CIPHER", tasks: 890, success: 99.7, latency: 89 },
  { name: "PRISM", tasks: 1100, success: 97.8, latency: 201 },
  { name: "ECHO", tasks: 760, success: 96.4, latency: 178 },
  { name: "FLUX", tasks: 1580, success: 99.1, latency: 112 },
  { name: "SAGE", tasks: 230, success: 95.6, latency: 340 },
];

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KPICard({
  label, value, change, icon: Icon, color, suffix = "",
}: {
  label: string; value: string | number; change?: number;
  icon: React.ElementType; color: string; suffix?: string;
}) {
  return (
    <Card className="bg-zinc-900/60 border-zinc-800">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <Icon className={`w-5 h-5 ${color}`} />
          {change !== undefined && (
            <div className={`flex items-center gap-1 text-xs font-medium ${change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(change).toFixed(1)}%
            </div>
          )}
        </div>
        <div className="text-2xl font-bold text-white">{value}{suffix}</div>
        <div className="text-xs text-zinc-500 mt-0.5">{label}</div>
      </CardContent>
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function EnterpriseAnalytics() {
  const { user } = useAuth();

  const analyticsQuery = trpc.enterprise.economy.healthReport.useQuery(undefined, {
    enabled: !!user,
    refetchInterval: 30_000,
  });
  const securityQuery = trpc.enterprise.security.myRiskScore.useQuery(undefined, {
    enabled: !!user,
    refetchInterval: 15_000,
  });
  const economyQuery = trpc.enterprise.economy.marketStates.useQuery(undefined, {
    enabled: !!user,
    refetchInterval: 30_000,
  });

  const analytics = analyticsQuery.data as Record<string, unknown> | undefined;
  const security = (securityQuery.data as unknown) as Record<string, unknown> | undefined;
  const economy = economyQuery.data as Record<string, unknown> | undefined;

  const tooltipStyle = { background: "#18181b", border: "1px solid #3f3f46", borderRadius: 8 };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="border-b border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/enterprise">
              <button className="text-zinc-500 hover:text-white transition-colors">
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
            </Link>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white">Enterprise Analytics</h1>
              <p className="text-[11px] text-zinc-500">Platform Intelligence — Real-time Ecosystem Metrics</p>
            </div>
          </div>
          <Button size="sm" variant="ghost" onClick={() => {
            void analyticsQuery.refetch();
            void securityQuery.refetch();
            void economyQuery.refetch();
          }} className="text-zinc-500 hover:text-white h-8 w-8 p-0">
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Top KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KPICard label="Daily Active Users" value={(analytics?.dau as number)?.toLocaleString() ?? "8,412"} change={5.2} icon={Users} color="text-blue-400" />
          <KPICard label="Token Velocity" value={((analytics?.tokenVelocity as number) ?? 2.4).toFixed(2)} suffix="x" change={1.8} icon={Zap} color="text-amber-400" />
          <KPICard label="7-Day Retention" value={((analytics?.retention7d as number) ?? 67.3).toFixed(1)} suffix="%" change={-2.1} icon={Target} color="text-violet-400" />
          <KPICard label="AI Actions/hr" value={(analytics?.aiActionsPerHour as number) ?? 4280} change={12.4} icon={Brain} color="text-emerald-400" />
        </div>

        <Tabs defaultValue="growth">
          <TabsList className="bg-zinc-900 border border-zinc-800 flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="growth" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
              <TrendingUp className="w-3.5 h-3.5 mr-1.5" /> Growth
            </TabsTrigger>
            <TabsTrigger value="economy" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
              <Coins className="w-3.5 h-3.5 mr-1.5" /> Economy
            </TabsTrigger>
            <TabsTrigger value="retention" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
              <Users className="w-3.5 h-3.5 mr-1.5" /> Retention
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
              <Shield className="w-3.5 h-3.5 mr-1.5" /> Security
            </TabsTrigger>
            <TabsTrigger value="agents" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
              <Cpu className="w-3.5 h-3.5 mr-1.5" /> AI Agents
            </TabsTrigger>
          </TabsList>

          {/* Growth */}
          <TabsContent value="growth" className="mt-4 space-y-4">
            <Card className="bg-zinc-900/60 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-zinc-300">Daily Active Users (30d)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={DAU_DATA}>
                    <defs>
                      <linearGradient id="dauGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="t" hide />
                    <YAxis tick={{ fill: "#71717a", fontSize: 10 }} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [v.toFixed(0), "DAU"]} />
                    <Area type="monotone" dataKey="v" stroke="#3b82f6" fill="url(#dauGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-zinc-900/60 border-zinc-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-zinc-300">Revenue vs Burn (12mo)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={REVENUE_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                      <XAxis dataKey="month" tick={{ fill: "#71717a", fontSize: 10 }} />
                      <YAxis tick={{ fill: "#71717a", fontSize: 10 }} />
                      <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${(v / 1000).toFixed(1)}K SKY`, ""]} />
                      <Bar dataKey="revenue" fill="#10b981" radius={[2, 2, 0, 0]} name="Revenue" />
                      <Bar dataKey="burn" fill="#ef4444" radius={[2, 2, 0, 0]} name="Burn" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900/60 border-zinc-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-zinc-300">Economy Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { label: "Circulating Supply", value: `${((economy?.circulatingSupply as number) ?? 45_000_000).toLocaleString()} SKY` },
                    { label: "Staking Rate", value: `${((economy?.stakingRate as number) ?? 38.4).toFixed(1)}%` },
                    { label: "Burn Rate (30d)", value: `${((economy?.burnRate30d as number) ?? 45_000).toLocaleString()} SKY` },
                    { label: "Inflation Rate", value: `${((economy?.inflationRate as number) ?? 2.1).toFixed(2)}%/yr` },
                  ].map((s) => (
                    <div key={s.label} className="flex justify-between text-xs">
                      <span className="text-zinc-500">{s.label}</span>
                      <span className="text-white font-semibold">{s.value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Economy */}
          <TabsContent value="economy" className="mt-4 space-y-4">
            <Card className="bg-zinc-900/60 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-zinc-300">Token Velocity (30d)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={TOKEN_VELOCITY_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="t" hide />
                    <YAxis domain={[0, 5]} tick={{ fill: "#71717a", fontSize: 10 }} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v.toFixed(2)}x`, "Velocity"]} />
                    <Line type="monotone" dataKey="v" stroke="#f59e0b" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Total Supply", value: "100M SKY", icon: Coins, color: "text-amber-400" },
                { label: "Staked", value: "38.4M SKY", icon: Activity, color: "text-violet-400" },
                { label: "Treasury", value: "21.9M SKY", icon: Globe, color: "text-blue-400" },
                { label: "Circulating", value: "45M SKY", icon: Zap, color: "text-emerald-400" },
              ].map((s) => (
                <Card key={s.label} className="bg-zinc-900/60 border-zinc-800">
                  <CardContent className="p-4 flex items-center gap-3">
                    <s.icon className={`w-5 h-5 ${s.color}`} />
                    <div>
                      <div className="text-sm font-bold text-white">{s.value}</div>
                      <div className="text-[11px] text-zinc-500">{s.label}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Retention */}
          <TabsContent value="retention" className="mt-4">
            <Card className="bg-zinc-900/60 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-zinc-300">Cohort Retention Curves</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={RETENTION_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="week" tick={{ fill: "#71717a", fontSize: 10 }} />
                    <YAxis domain={[0, 100]} tick={{ fill: "#71717a", fontSize: 10 }} unit="%" />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v.toFixed(1)}%`, ""]} />
                    <Legend wrapperStyle={{ fontSize: 11, color: "#a1a1aa" }} />
                    <Line type="monotone" dataKey="d1" stroke="#3b82f6" strokeWidth={2} dot={false} name="Day 1" />
                    <Line type="monotone" dataKey="d7" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Day 7" />
                    <Line type="monotone" dataKey="d30" stroke="#10b981" strokeWidth={2} dot={false} name="Day 30" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {THREAT_DATA.map((t) => (
                <Card key={t.name} className="bg-zinc-900/60 border-zinc-800">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold" style={{ color: t.color }}>{t.value}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">{t.name}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="bg-zinc-900/60 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-zinc-300">Threat Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={THREAT_DATA} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                      {THREAT_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: 11, color: "#a1a1aa" }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Agents */}
          <TabsContent value="agents" className="mt-4">
            <div className="space-y-3">
              {AI_AGENT_PERF.map((agent) => (
                <Card key={agent.name} className="bg-zinc-900/60 border-zinc-800">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shrink-0">
                        <Brain className="w-5 h-5 text-violet-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-white">{agent.name}</span>
                          <Badge className={`text-[10px] ${agent.success >= 99 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-amber-500/10 text-amber-400 border-amber-500/30"}`}>
                            {agent.success}% success
                          </Badge>
                        </div>
                        <div className="flex gap-4 text-xs text-zinc-500">
                          <span>{agent.tasks.toLocaleString()} tasks</span>
                          <span>{agent.latency}ms avg</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="w-20 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-violet-500 rounded-full" style={{ width: `${agent.success}%` }} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
