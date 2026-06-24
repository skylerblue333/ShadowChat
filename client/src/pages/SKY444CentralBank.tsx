import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TOKEN_REGISTRY = [
  { symbol: "SKY444", name: "SKYCOIN4444", supply: 21_000_000, circulating: 8_400_000, color: "yellow", role: "Primary Reserve" },
  { symbol: "HOPE", name: "HOPE Token", supply: 100_000_000, circulating: 12_000_000, color: "blue", role: "AI Governance" },
  { symbol: "SHADOW", name: "ShadowCoin", supply: 50_000_000, circulating: 5_500_000, color: "purple", role: "Privacy Layer" },
  { symbol: "EARN", name: "EarnToken", supply: 500_000_000, circulating: 45_000_000, color: "emerald", role: "Rewards" },
  { symbol: "BUILD", name: "BuildToken", supply: 200_000_000, circulating: 22_000_000, color: "orange", role: "Developer Incentives" },
  { symbol: "NATION", name: "NationToken", supply: 1_000_000, circulating: 180_000, color: "red", role: "Citizenship NFT" },
  { symbol: "WISDOM", name: "WisdomToken", supply: 10_000_000, circulating: 890_000, color: "pink", role: "Knowledge Economy" },
];

const COLOR_MAP: Record<string, { text: string; bg: string; border: string }> = {
  yellow: { text: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/30" },
  blue: { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
  purple: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30" },
  emerald: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  orange: { text: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30" },
  red: { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30" },
  pink: { text: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/30" },
};

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export default function SKY444CentralBank() {
  const [selectedToken, setSelectedToken] = useState("SKY444");

  const { data: econHealth } = trpc.enterprise.economy.healthReport.useQuery();
  const { data: marketStates } = trpc.enterprise.economy.marketStates.useQuery();
  const { data: emissionCaps } = trpc.enterprise.economy.emissionCaps.useQuery();
  const { data: emergentStatus } = trpc.enterprise.emergent.digitalNationStatus.useQuery();

  const token = TOKEN_REGISTRY.find((t) => t.symbol === selectedToken)!;
  const colors = COLOR_MAP[token.color];
  const circulatingPct = Math.round((token.circulating / token.supply) * 100);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-yellow-500/20 bg-gradient-to-r from-black via-yellow-950/10 to-black">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-2xl">
                🏦
              </div>
              <div>
                <h1 className="text-2xl font-black text-white tracking-widest uppercase">
                  SKY444 CENTRAL BANK
                </h1>
                <p className="text-sm text-yellow-500/60 mt-1">
                  Monetary policy · Token economics · Treasury management
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <Badge className={`${econHealth?.overallHealth === "HEALTHY" ? "bg-emerald-500/20 text-emerald-400" : "bg-orange-500/20 text-orange-400"} border-0`}>
                ECONOMY: {econHealth?.overallHealth ?? "LOADING"}
              </Badge>
              <Badge className="bg-yellow-500/20 text-yellow-400 border-0">
                7 TOKENS ACTIVE
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <Tabs defaultValue="overview">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="overview">OVERVIEW</TabsTrigger>
            <TabsTrigger value="tokens">TOKEN REGISTRY</TabsTrigger>
            <TabsTrigger value="policy">MONETARY POLICY</TabsTrigger>
            <TabsTrigger value="treasury">TREASURY</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Economy Health Banner */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Economy Status", value: econHealth?.overallHealth ?? "—", icon: "📊" },
                { label: "Total Tokens", value: "7", icon: "🪙" },
                { label: "Active Sinks", value: String((emissionCaps as unknown[])?.length ?? 0), icon: "🔥" },
                { label: "Nation Mode", value: (emergentStatus as unknown as Record<string, unknown>)?.mode as string ?? "GENESIS", icon: "🌍" },
              ].map((stat, i) => (
                <Card key={i} className="bg-black/60 border-yellow-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span>{stat.icon}</span>
                      <span className="text-xs text-white/40 uppercase">{stat.label}</span>
                    </div>
                    <div className="text-xl font-black text-yellow-400 font-mono">{stat.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Token Quick View */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {TOKEN_REGISTRY.slice(0, 4).map((t) => {
                const c = COLOR_MAP[t.color];
                const pct = Math.round((t.circulating / t.supply) * 100);
                return (
                  <button
                    key={t.symbol}
                    onClick={() => setSelectedToken(t.symbol)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      selectedToken === t.symbol ? `${c.bg} ${c.border}` : "bg-black/40 border-white/10 hover:border-white/30"
                    }`}
                  >
                    <div className={`text-sm font-bold ${c.text} mb-1`}>{t.symbol}</div>
                    <div className="text-xs text-white/40 mb-2">{t.role}</div>
                    <div className="text-lg font-black text-white">{formatNum(t.circulating)}</div>
                    <Progress value={pct} className="h-1 mt-2" />
                    <div className="text-xs text-white/30 mt-1">{pct}% circulating</div>
                  </button>
                );
              })}
            </div>

            {/* Economy Alerts */}
            {econHealth?.alerts && econHealth.alerts.length > 0 && (
              <Card className="bg-black/60 border-orange-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-orange-400 text-sm uppercase tracking-widest">
                    ⚠️ ECONOMY ALERTS
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {econHealth.alerts.slice(0, 3).map((alert, i) => (
                    <div key={i} className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-sm text-white/70">
                      {String(alert)}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="tokens" className="space-y-4 mt-6">
            <div className="grid md:grid-cols-2 gap-4">
              {TOKEN_REGISTRY.map((t) => {
                const c = COLOR_MAP[t.color];
                const pct = Math.round((t.circulating / t.supply) * 100);
                return (
                  <Card key={t.symbol} className={`bg-black/60 ${c.border} border`}>
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className={`text-lg font-black ${c.text}`}>{t.symbol}</div>
                          <div className="text-xs text-white/40">{t.name}</div>
                        </div>
                        <Badge className={`${c.bg} ${c.text} border-0 text-xs`}>{t.role}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <div className="text-xs text-white/40">Max Supply</div>
                          <div className="text-white font-mono font-bold">{formatNum(t.supply)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-white/40">Circulating</div>
                          <div className="text-white font-mono font-bold">{formatNum(t.circulating)}</div>
                        </div>
                      </div>
                      <Progress value={pct} className="h-2" />
                      <div className="text-xs text-white/30 mt-1">{pct}% of max supply in circulation</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="policy" className="space-y-6 mt-6">
            <Card className="bg-black/60 border-yellow-500/20">
              <CardHeader>
                <CardTitle className="text-yellow-400 text-sm uppercase tracking-widest">
                  MONETARY POLICY CONTROLS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Emission Rate", value: "0.5% / month", status: "NOMINAL", desc: "New token creation rate" },
                  { label: "Burn Rate", value: "0.3% / month", status: "ACTIVE", desc: "Deflationary pressure via sinks" },
                  { label: "Staking APY", value: "12.5%", status: "HEALTHY", desc: "Annual yield for stakers" },
                  { label: "Governance Weight", value: "1 SKY = 1 Vote", status: "CAPPED", desc: "Anti-whale 15% max cap" },
                  { label: "Treasury Reserve", value: "2,100,000 SKY444", status: "SECURE", desc: "10% of max supply held in reserve" },
                ].map((policy, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                    <div>
                      <div className="font-semibold text-white">{policy.label}</div>
                      <div className="text-xs text-white/40">{policy.desc}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-yellow-400 font-bold">{policy.value}</div>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-xs mt-1">{policy.status}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="treasury" className="space-y-6 mt-6">
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { label: "Treasury Balance", value: "2.1M SKY444", icon: "🏦", color: "yellow" },
                { label: "Protocol Revenue", value: "145K EARN/month", icon: "📈", color: "emerald" },
                { label: "Burn Pool", value: "890K SKY444", icon: "🔥", color: "orange" },
              ].map((item, i) => {
                const c = COLOR_MAP[item.color];
                return (
                  <Card key={i} className={`bg-black/60 ${c.border} border`}>
                    <CardContent className="p-5 text-center">
                      <div className="text-4xl mb-2">{item.icon}</div>
                      <div className={`text-xl font-black ${c.text} font-mono`}>{item.value}</div>
                      <div className="text-xs text-white/40 mt-1">{item.label}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <Card className="bg-black/60 border-yellow-500/20">
              <CardHeader>
                <CardTitle className="text-yellow-400 text-sm uppercase tracking-widest">
                  TREASURY ALLOCATION
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Development Fund", pct: 40, color: "blue" },
                  { label: "Community Rewards", pct: 25, color: "emerald" },
                  { label: "Liquidity Reserve", pct: 20, color: "yellow" },
                  { label: "Emergency Fund", pct: 10, color: "orange" },
                  { label: "Burn Reserve", pct: 5, color: "red" },
                ].map((alloc, i) => {
                  const c = COLOR_MAP[alloc.color];
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div className="text-sm text-white/60 w-40 shrink-0">{alloc.label}</div>
                      <Progress value={alloc.pct} className="flex-1 h-2" />
                      <div className={`text-sm font-mono font-bold ${c.text} w-10 text-right`}>{alloc.pct}%</div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
