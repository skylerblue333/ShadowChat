import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, DollarSign, Shield, Users, Zap, Globe, ArrowRight, ExternalLink, Download, CheckCircle, Lock, BarChart3, PieChart, Coins } from "lucide-react";

const TOKENOMICS = [
  { label: "Community Rewards", pct: 35, color: "bg-violet-500" },
  { label: "Ecosystem Fund", pct: 20, color: "bg-blue-500" },
  { label: "Team & Advisors", pct: 15, color: "bg-emerald-500" },
  { label: "Liquidity Pool", pct: 15, color: "bg-yellow-500" },
  { label: "Staking Pool", pct: 10, color: "bg-orange-500" },
  { label: "Reserve", pct: 5, color: "bg-zinc-500" },
];

const ROADMAP = [
  { phase: "Phase 1", title: "Foundation", status: "complete", items: ["Core social platform", "User auth & profiles", "Posts, comments, likes", "Community channels"] },
  { phase: "Phase 2", title: "Economy", status: "complete", items: ["SKY444 token launch", "Staking & yield farming", "Creator subscriptions", "Marketplace"] },
  { phase: "Phase 3", title: "GameFi", status: "active", items: ["Tournament system", "Quest board", "Achievement engine", "Season pass"] },
  { phase: "Phase 4", title: "AI & DeFi", status: "upcoming", items: ["AI content engine", "DEX integration", "Cross-chain bridge", "DAO governance"] },
  { phase: "Phase 5", title: "Scale", status: "upcoming", items: ["Mobile apps", "Enterprise API", "Global expansion", "IPO preparation"] },
];

export default function InvestorRoom() {
  const { user } = useAuth();

  const { data: kpis, isLoading: kpisLoading } = trpc.investor.kpis.useQuery(undefined, {
    enabled: !!user,
    retry: false,
  });

  const { data: revenue, isLoading: revenueLoading } = trpc.investor.revenue.useQuery(undefined, {
    enabled: !!user,
    retry: false,
  });

  const { data: treasury, isLoading: treasuryLoading } = trpc.investor.treasury.useQuery(undefined, {
    enabled: !!user,
    retry: false,
  });

  const { data: tokenomicsData } = trpc.token.tokenomics.useQuery();

  const isLoading = kpisLoading || revenueLoading || treasuryLoading;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <PageHeader
          title="Investor Room"
          subtitle="SKYCOIN4444 — Platform metrics, tokenomics, and growth roadmap"
          icon={TrendingUp}
          actions={
            <Button variant="outline" className="border-zinc-700 gap-2 text-sm">
              <Download className="w-4 h-4" /> Pitch Deck
            </Button>
          }
        />

        {/* Auth Gate */}
        {!user && (
          <Card className="bg-violet-500/10 border-violet-500/30">
            <CardContent className="p-6 flex items-center gap-4">
              <Lock className="w-8 h-8 text-violet-400 shrink-0" />
              <div>
                <p className="font-semibold text-white">Sign in to view live metrics</p>
                <p className="text-sm text-zinc-400 mt-1">KPIs, revenue, and treasury data require authentication.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Live KPIs */}
        {user && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 bg-zinc-900 rounded-xl animate-pulse" />
              ))
            ) : [
              { label: "Total Users", value: (kpis as any)?.totalUsers?.toLocaleString() || "0", icon: Users, color: "text-blue-400" },
              { label: "Monthly Revenue", value: `$${((revenue as any)?.total || 0).toLocaleString()}`, icon: DollarSign, color: "text-emerald-400" },
              { label: "Treasury", value: `$${((treasury as any)?.total || 0).toLocaleString()}`, icon: Coins, color: "text-yellow-400" },
              { label: "Active Stakers", value: (kpis as any)?.activeStakers?.toLocaleString() || "0", icon: Zap, color: "text-violet-400" },
            ].map(stat => (
              <Card key={stat.label} className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-4 text-center">
                  <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
                  <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-zinc-500 mt-1">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Tokenomics */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-violet-400" />
              SKY444 Token Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex h-4 rounded-full overflow-hidden gap-0.5">
              {TOKENOMICS.map(t => (
                <div key={t.label} className={`${t.color} transition-all`} style={{ width: `${t.pct}%` }} />
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {TOKENOMICS.map(t => (
                <div key={t.label} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${t.color} shrink-0`} />
                  <span className="text-xs text-zinc-300">{t.label}</span>
                  <span className="text-xs font-bold text-white ml-auto">{t.pct}%</span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-zinc-800 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-white">4,444,444,444</div>
                <div className="text-xs text-zinc-500">Total Supply</div>
              </div>
              <div>
                <div className="text-lg font-bold text-emerald-400">{(tokenomicsData as any)?.circulatingSupply?.toLocaleString() || "~1.2B"}</div>
                <div className="text-xs text-zinc-500">Circulating</div>
              </div>
              <div>
                <div className="text-lg font-bold text-yellow-400">${(tokenomicsData as any)?.price?.toFixed(4) || "0.0044"}</div>
                <div className="text-xs text-zinc-500">Current Price</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Treasury Allocation */}
        {user && treasury && (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-yellow-400" />
                Treasury Allocation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {((treasury as any).allocation || []).map((a: any) => (
                <div key={a.name} className="flex items-center gap-3">
                  <span className="text-xs text-zinc-400 w-32 shrink-0">{a.name}</span>
                  <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-violet-500 rounded-full" style={{ width: `${a.percentage}%` }} />
                  </div>
                  <span className="text-xs font-bold text-white w-10 text-right">{a.percentage}%</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Roadmap */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-400" />
              Development Roadmap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ROADMAP.map(phase => (
                <div key={phase.phase} className={`p-4 rounded-xl border ${
                  phase.status === "complete" ? "border-emerald-500/30 bg-emerald-500/5" :
                  phase.status === "active" ? "border-violet-500/30 bg-violet-500/5" :
                  "border-zinc-800 bg-zinc-800/30"
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className={`text-xs ${
                      phase.status === "complete" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
                      phase.status === "active" ? "bg-violet-500/20 text-violet-400 border-violet-500/30 animate-pulse" :
                      "bg-zinc-700 text-zinc-400 border-zinc-600"
                    }`}>
                      {phase.phase}
                    </Badge>
                    <span className="font-semibold text-white">{phase.title}</span>
                    {phase.status === "complete" && <CheckCircle className="w-4 h-4 text-emerald-400 ml-auto" />}
                    {phase.status === "active" && <Zap className="w-4 h-4 text-violet-400 ml-auto animate-pulse" />}
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {phase.items.map(item => (
                      <div key={item} className="flex items-center gap-1.5 text-xs text-zinc-400">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          phase.status === "complete" ? "bg-emerald-400" :
                          phase.status === "active" ? "bg-violet-400" :
                          "bg-zinc-600"
                        }`} />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-violet-600/20 to-blue-600/20 border-violet-500/30">
          <CardContent className="p-6 flex items-center justify-between gap-4">
            <div>
              <p className="font-bold text-white text-lg">Interested in investing?</p>
              <p className="text-sm text-zinc-400 mt-1">Contact the team for private sale allocation and partnership opportunities.</p>
            </div>
            <Button className="bg-violet-600 hover:bg-violet-700 gap-2 shrink-0">
              Contact Team <ArrowRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
