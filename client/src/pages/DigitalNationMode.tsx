/**
 * DigitalNationMode — SKYCOIN4444 Digital Nation Control Center
 *
 * The platform as a sovereign digital nation:
 *   - Constitution viewer + amendment proposals
 *   - Territory (platform zones) management
 *   - Citizenship tiers and privileges
 *   - AI-proposed legislation
 *   - Treasury overview
 *   - National AI agents (HOPE AI ambassadors)
 *   - Digital Nation events feed
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Globe, Shield, Users, Zap, Crown, Vote, FileText, TrendingUp,
  ChevronRight, Star, Lock, Unlock, Activity, Brain, Coins,
  Map, Flag, Building, Gavel, BookOpen, Sparkles, AlertCircle
} from "lucide-react";
import { Link } from "wouter";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

// ─── Static Nation Data (augmented by live data) ─────────────────────────────

const CITIZENSHIP_TIERS = [
  {
    tier: "Citizen",
    level: 1,
    color: "#71717a",
    icon: Users,
    privileges: ["Basic voting rights", "Platform access", "Token earning"],
    requirement: "Join the platform",
  },
  {
    tier: "Resident",
    level: 2,
    color: "#60a5fa",
    icon: Building,
    privileges: ["Enhanced voting weight", "Governance proposals", "Staking rewards"],
    requirement: "100 SKY444 staked",
  },
  {
    tier: "Delegate",
    level: 3,
    color: "#a78bfa",
    icon: Vote,
    privileges: ["Delegate voting power", "Committee membership", "Revenue sharing"],
    requirement: "1,000 SKY444 + 90 days",
  },
  {
    tier: "Senator",
    level: 4,
    color: "#fbbf24",
    icon: Crown,
    privileges: ["Constitutional amendments", "Treasury proposals", "AI agent deployment"],
    requirement: "10,000 SKY444 + elected",
  },
];

const NATION_ZONES = [
  { name: "HOPE AI District", type: "AI", status: "active", population: 12400, gdp: "2.4M SKY" },
  { name: "ShadowChat Quarter", type: "Communication", status: "active", population: 8900, gdp: "1.8M SKY" },
  { name: "SKY Wallet Exchange", type: "Finance", status: "active", population: 6200, gdp: "5.1M SKY" },
  { name: "Governance Plaza", type: "Government", status: "active", population: 3100, gdp: "0.9M SKY" },
  { name: "Gaming Colosseum", type: "Entertainment", status: "active", population: 15800, gdp: "3.2M SKY" },
  { name: "Marketplace Bazaar", type: "Commerce", status: "active", population: 9400, gdp: "7.8M SKY" },
  { name: "Developer Forge", type: "Technology", status: "beta", population: 2800, gdp: "1.1M SKY" },
  { name: "Shadow IDE Campus", type: "Education", status: "beta", population: 1900, gdp: "0.6M SKY" },
];

const CONSTITUTION_ARTICLES = [
  { id: 1, title: "Sovereignty & Autonomy", summary: "SKYCOIN4444 operates as a sovereign digital entity governed by its token holders." },
  { id: 2, title: "Token Rights", summary: "All SKY444 holders have proportional governance rights. No single entity may hold >10% of supply." },
  { id: 3, title: "AI Governance", summary: "HOPE AI may propose but not unilaterally execute governance changes. Human ratification required." },
  { id: 4, title: "Treasury Management", summary: "Platform treasury requires 67% supermajority for expenditures exceeding 100,000 SKY444." },
  { id: 5, title: "Free Speech", summary: "Citizens retain rights to expression within platform guidelines. AI moderation is advisory only." },
  { id: 6, title: "Privacy Rights", summary: "No citizen data may be sold or shared without explicit consent. Zero-knowledge proofs preferred." },
  { id: 7, title: "Economic Freedom", summary: "Citizens may trade, stake, and transfer tokens freely. No arbitrary freezing without due process." },
  { id: 8, title: "Amendment Process", summary: "Constitutional changes require 75% supermajority + 30-day deliberation period." },
];

const ZONE_COLORS: Record<string, string> = {
  AI: "#8b5cf6",
  Communication: "#3b82f6",
  Finance: "#f59e0b",
  Government: "#ef4444",
  Entertainment: "#ec4899",
  Commerce: "#10b981",
  Technology: "#06b6d4",
  Education: "#84cc16",
};

// ─── Citizenship Tier Card ────────────────────────────────────────────────────

function TierCard({ tier, isCurrentTier }: { tier: typeof CITIZENSHIP_TIERS[0]; isCurrentTier: boolean }) {
  const Icon = tier.icon;
  return (
    <div className={`rounded-xl border p-4 transition-all ${
      isCurrentTier
        ? "border-amber-500/50 bg-amber-500/5"
        : "border-zinc-800 bg-zinc-900/40 opacity-70"
    }`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: `${tier.color}22`, border: `1px solid ${tier.color}44` }}>
          <Icon className="w-4 h-4" style={{ color: tier.color }} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white text-sm">{tier.tier}</span>
            {isCurrentTier && <Badge className="text-[10px] bg-amber-500/20 text-amber-400 border-amber-500/30">Current</Badge>}
          </div>
          <p className="text-[11px] text-zinc-500">{tier.requirement}</p>
        </div>
      </div>
      <ul className="space-y-1">
        {tier.privileges.map((p) => (
          <li key={p} className="flex items-center gap-1.5 text-xs text-zinc-400">
            <Star className="w-2.5 h-2.5 shrink-0" style={{ color: tier.color }} />
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DigitalNationMode() {
  const { user } = useAuth();
  const [selectedZone, setSelectedZone] = useState<typeof NATION_ZONES[0] | null>(null);

  const governanceQuery = trpc.enterprise.governanceV2.health.useQuery(undefined, {
    enabled: !!user,
    refetchInterval: 30_000,
  });
  const analyticsQuery = trpc.enterprise.economy.healthReport.useQuery(undefined, {
    enabled: !!user,
  });

  const governance = governanceQuery.data as Record<string, unknown> | undefined;
  const analytics = analyticsQuery.data as Record<string, unknown> | undefined;

  const totalPopulation = NATION_ZONES.reduce((s, z) => s + z.population, 0);

  const zoneChartData = NATION_ZONES.map((z) => ({
    name: z.name.split(" ")[0],
    population: z.population,
    color: ZONE_COLORS[z.type] ?? "#888",
  }));

  const treasuryData = [
    { name: "Operations", value: 35, color: "#8b5cf6" },
    { name: "Staking Rewards", value: 25, color: "#f59e0b" },
    { name: "Development", value: 20, color: "#3b82f6" },
    { name: "Community", value: 12, color: "#10b981" },
    { name: "Reserve", value: 8, color: "#71717a" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="border-b border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/governance">
              <button className="text-zinc-500 hover:text-white transition-colors">
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
            </Link>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white">Digital Nation Mode</h1>
              <p className="text-[11px] text-zinc-500">SKYCOIN4444 — Sovereign Digital Ecosystem</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full px-3 py-1">
              <Flag className="w-3 h-3 text-amber-400" />
              <span className="text-xs text-amber-400 font-medium">{totalPopulation.toLocaleString()} Citizens</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nation Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-zinc-900 via-amber-950/20 to-zinc-900 border-b border-zinc-800/60">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Citizens", value: totalPopulation.toLocaleString(), icon: Users, color: "text-amber-400" },
              { label: "Active Zones", value: NATION_ZONES.filter(z => z.status === "active").length, icon: Map, color: "text-emerald-400" },
              { label: "Proposals Active", value: (governance?.activeProposals as number) ?? 0, icon: Gavel, color: "text-violet-400" },
              { label: "Treasury", value: "21.9M SKY", icon: Coins, color: "text-blue-400" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <s.icon className={`w-6 h-6 ${s.color}`} />
                <div>
                  <div className="text-xl font-bold text-white">{s.value}</div>
                  <div className="text-xs text-zinc-500">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <Tabs defaultValue="territory">
          <TabsList className="bg-zinc-900 border border-zinc-800 flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="territory" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
              <Map className="w-3.5 h-3.5 mr-1.5" /> Territory
            </TabsTrigger>
            <TabsTrigger value="citizenship" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
              <Crown className="w-3.5 h-3.5 mr-1.5" /> Citizenship
            </TabsTrigger>
            <TabsTrigger value="constitution" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
              <BookOpen className="w-3.5 h-3.5 mr-1.5" /> Constitution
            </TabsTrigger>
            <TabsTrigger value="treasury" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
              <Coins className="w-3.5 h-3.5 mr-1.5" /> Treasury
            </TabsTrigger>
            <TabsTrigger value="ai-laws" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
              <Brain className="w-3.5 h-3.5 mr-1.5" /> AI Laws
            </TabsTrigger>
          </TabsList>

          {/* Territory */}
          <TabsContent value="territory" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                {NATION_ZONES.map((zone) => (
                  <div
                    key={zone.name}
                    onClick={() => setSelectedZone(zone)}
                    className={`rounded-xl border p-4 cursor-pointer transition-all ${
                      selectedZone?.name === zone.name
                        ? "border-amber-500/50 bg-amber-500/5"
                        : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ background: ZONE_COLORS[zone.type] ?? "#888" }} />
                        <div>
                          <span className="text-sm font-semibold text-white">{zone.name}</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge className="text-[10px] bg-zinc-800 text-zinc-400 border-zinc-700">{zone.type}</Badge>
                            <Badge className={`text-[10px] ${zone.status === "active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-blue-500/10 text-blue-400 border-blue-500/30"}`}>
                              {zone.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-white">{zone.population.toLocaleString()}</div>
                        <div className="text-[11px] text-zinc-500">citizens</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Card className="bg-zinc-900/60 border-zinc-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-zinc-300">Population by Zone</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={zoneChartData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                      <XAxis type="number" tick={{ fill: "#71717a", fontSize: 10 }} />
                      <YAxis type="category" dataKey="name" tick={{ fill: "#a1a1aa", fontSize: 10 }} width={70} />
                      <Tooltip
                        contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: 8 }}
                        labelStyle={{ color: "#a1a1aa" }}
                      />
                      <Bar dataKey="population" radius={[0, 4, 4, 0]}>
                        {zoneChartData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Citizenship */}
          <TabsContent value="citizenship" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CITIZENSHIP_TIERS.map((tier) => (
                <TierCard key={tier.tier} tier={tier} isCurrentTier={tier.level === 1} />
              ))}
            </div>
          </TabsContent>

          {/* Constitution */}
          <TabsContent value="constitution" className="mt-4">
            <div className="space-y-3">
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-400">SKYCOIN4444 Digital Constitution</p>
                  <p className="text-xs text-zinc-400 mt-1">
                    Ratified by token holder vote. Amendments require 75% supermajority + 30-day deliberation.
                    HOPE AI may propose amendments but cannot ratify them unilaterally.
                  </p>
                </div>
              </div>
              {CONSTITUTION_ARTICLES.map((article) => (
                <Card key={article.id} className="bg-zinc-900/60 border-zinc-800">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-amber-400">{article.id}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{article.title}</p>
                        <p className="text-xs text-zinc-400 mt-1">{article.summary}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Treasury */}
          <TabsContent value="treasury" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-zinc-900/60 border-zinc-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-zinc-300">Treasury Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={treasuryData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                        {treasuryData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: 8 }}
                        formatter={(v) => [`${v}%`, ""]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {treasuryData.map((d) => (
                      <div key={d.name} className="flex items-center gap-1.5 text-xs">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                        <span className="text-zinc-400">{d.name}</span>
                        <span className="text-zinc-300 ml-auto">{d.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                {[
                  { label: "Total Treasury", value: "21,900,000 SKY444", icon: Coins, color: "text-amber-400" },
                  { label: "Monthly Burn", value: "45,000 SKY444", icon: TrendingUp, color: "text-red-400" },
                  { label: "Monthly Revenue", value: "180,000 SKY444", icon: Activity, color: "text-emerald-400" },
                  { label: "Staking Pool", value: "8,400,000 SKY444", icon: Lock, color: "text-violet-400" },
                ].map((s) => (
                  <Card key={s.label} className="bg-zinc-900/60 border-zinc-800">
                    <CardContent className="p-4 flex items-center gap-3">
                      <s.icon className={`w-5 h-5 ${s.color} shrink-0`} />
                      <div className="flex-1">
                        <div className="text-sm font-bold text-white">{s.value}</div>
                        <div className="text-xs text-zinc-500">{s.label}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* AI Laws */}
          <TabsContent value="ai-laws" className="mt-4">
            <div className="space-y-4">
              <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-4 flex items-start gap-3">
                <Brain className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-violet-400">HOPE AI Legislative Engine</p>
                  <p className="text-xs text-zinc-400 mt-1">
                    HOPE AI analyzes platform data and autonomously proposes governance improvements.
                    All AI-proposed laws require human ratification before taking effect.
                  </p>
                </div>
              </div>

              {[
                {
                  id: "AI-001",
                  title: "Dynamic Staking APY Adjustment",
                  status: "proposed",
                  confidence: 0.87,
                  rationale: "Token velocity analysis shows 23% decline in staking participation. Propose increasing base APY from 8% to 12% for 90-day locks to incentivize long-term holding.",
                  impact: "High",
                },
                {
                  id: "AI-002",
                  title: "Anti-Whale Governance Cap",
                  status: "ratified",
                  confidence: 0.94,
                  rationale: "Three wallets hold >15% combined voting power. Propose capping individual governance weight at 5% of total supply to prevent centralization.",
                  impact: "Critical",
                },
                {
                  id: "AI-003",
                  title: "Creator Revenue Share Increase",
                  status: "deliberation",
                  confidence: 0.79,
                  rationale: "Content creator retention dropped 18% this quarter. Propose increasing creator revenue share from 70% to 80% to improve platform content quality.",
                  impact: "Medium",
                },
              ].map((law) => (
                <Card key={law.id} className="bg-zinc-900/60 border-zinc-800">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-zinc-500">{law.id}</span>
                          <Badge className={`text-[10px] ${
                            law.status === "ratified" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" :
                            law.status === "proposed" ? "bg-blue-500/10 text-blue-400 border-blue-500/30" :
                            "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          }`}>
                            {law.status}
                          </Badge>
                          <Badge className={`text-[10px] ${
                            law.impact === "Critical" ? "bg-red-500/10 text-red-400 border-red-500/30" :
                            law.impact === "High" ? "bg-orange-500/10 text-orange-400 border-orange-500/30" :
                            "bg-zinc-500/10 text-zinc-400 border-zinc-500/30"
                          }`}>
                            {law.impact} Impact
                          </Badge>
                        </div>
                        <p className="text-sm font-semibold text-white">{law.title}</p>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <div className="text-sm font-bold text-violet-400">{(law.confidence * 100).toFixed(0)}%</div>
                        <div className="text-[11px] text-zinc-500">AI confidence</div>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed italic">"{law.rationale}"</p>
                    {law.status === "proposed" && (
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs">
                          Support
                        </Button>
                        <Button size="sm" variant="outline" className="border-zinc-700 text-zinc-400 text-xs">
                          Oppose
                        </Button>
                        <Button size="sm" variant="ghost" className="text-zinc-500 text-xs ml-auto">
                          View Full Proposal
                        </Button>
                      </div>
                    )}
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
