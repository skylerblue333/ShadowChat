import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getLoginUrl } from "@/const";
import {
  Sprout, Rocket, Coins, TrendingUp, Clock, Shield, Zap, Lock,
  ArrowUpRight, Flame, Droplets, Layers, Star, Users, Loader2
} from "lucide-react";

const FARMING_POOLS = [
  {
    id: "farm-sky-usdt",
    name: "SKY444 / USDT",
    pair: ["SKY444", "USDT"],
    apy: 42.5,
    tvl: 12400000,
    multiplier: "3x",
    rewards: "SKY444",
    status: "active" as const,
    hot: true,
  },
  {
    id: "farm-sky-eth",
    name: "SKY444 / ETH",
    pair: ["SKY444", "ETH"],
    apy: 38.2,
    tvl: 8900000,
    multiplier: "2.5x",
    rewards: "SKY444",
    status: "active" as const,
    hot: true,
  },
  {
    id: "farm-sky-bnb",
    name: "SKY444 / BNB",
    pair: ["SKY444", "BNB"],
    apy: 28.7,
    tvl: 5600000,
    multiplier: "2x",
    rewards: "SKY444",
    status: "active" as const,
    hot: false,
  },
  {
    id: "farm-sky-single",
    name: "SKY444 Single Stake",
    pair: ["SKY444"],
    apy: 20.0,
    tvl: 73000000,
    multiplier: "1x",
    rewards: "SKY444",
    status: "active" as const,
    hot: false,
  },
  {
    id: "farm-lp-boost",
    name: "SKY444 LP Boost",
    pair: ["SKY444", "LP"],
    apy: 65.0,
    tvl: 3200000,
    multiplier: "5x",
    rewards: "SKY444 + NFT",
    status: "active" as const,
    hot: true,
  },
];

const LAUNCHPAD_PROJECTS = [
  {
    id: "launch-1",
    name: "ShadowAI Protocol",
    ticker: "SHAI",
    description: "Decentralized AI inference network built on the SKYCOIN4444 ecosystem. Enables permissionless access to LLMs via token-gated compute.",
    raised: 2400000,
    target: 3000000,
    participants: 1847,
    startDate: "2026-06-20",
    endDate: "2026-06-27",
    status: "upcoming" as const,
    allocation: "500 SKY444 min",
    chain: "Multi-chain",
  },
  {
    id: "launch-2",
    name: "CyberVault Finance",
    ticker: "CVF",
    description: "Next-gen DeFi vault aggregator with auto-compounding strategies and MEV protection. Optimized for SKY444 holders.",
    raised: 1800000,
    target: 2000000,
    participants: 2341,
    startDate: "2026-07-01",
    endDate: "2026-07-07",
    status: "upcoming" as const,
    allocation: "1000 SKY444 min",
    chain: "Ethereum + BSC",
  },
  {
    id: "launch-3",
    name: "NeonPlay Games",
    ticker: "NEON",
    description: "AAA-quality blockchain gaming studio. First title: 'Shadow Arena' — a cyberpunk battle royale with NFT characters and SKY444 prize pools.",
    raised: 5000000,
    target: 5000000,
    participants: 4892,
    startDate: "2026-05-01",
    endDate: "2026-05-10",
    status: "completed" as const,
    allocation: "250 SKY444 min",
    chain: "Polygon",
  },
];

function FarmCard({ pool }: { pool: typeof FARMING_POOLS[0] }) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="p-5 rounded-xl border border-border/50 bg-card/80 backdrop-blur hover:border-primary/30 transition-all relative">
      {pool.hot && (
        <div className="absolute top-3 right-3">
          <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/30 text-[10px]">
            <Flame className="w-3 h-3 mr-0.5" /> HOT
          </Badge>
        </div>
      )}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Droplets className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-bold">{pool.name}</h3>
          <span className="text-xs text-muted-foreground">{pool.rewards} Rewards</span>
        </div>
      </div>

      <div className="space-y-2.5 mb-5">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">APY</span>
          <span className="font-mono font-bold text-purple-400">{pool.apy}%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">TVL</span>
          <span className="font-mono font-medium">${(pool.tvl / 1e6).toFixed(1)}M</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Multiplier</span>
          <Badge variant="outline" className="text-[10px] font-mono">{pool.multiplier}</Badge>
        </div>
      </div>

      {isAuthenticated ? (
        <div className="flex gap-2">
          <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold">
            <Sprout className="w-3.5 h-3.5 mr-1.5" /> Farm
          </Button>
          <Button variant="outline" className="text-sm">
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      ) : (
        <a href={getLoginUrl()} className="block">
          <Button variant="outline" className="w-full text-sm">Sign In to Farm</Button>
        </a>
      )}
    </div>
  );
}

function LaunchpadCard({ project }: { project: typeof LAUNCHPAD_PROJECTS[0] }) {
  const { isAuthenticated } = useAuth();
  const progress = (project.raised / project.target) * 100;
  const isCompleted = project.status === "completed";

  return (
    <div className={`p-6 rounded-xl border ${isCompleted ? "border-purple-500/20 bg-purple-600/5" : "border-border/50 bg-card/80"} backdrop-blur`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold">{project.name}</h3>
            <Badge variant="outline" className="font-mono text-[10px]">${project.ticker}</Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
        </div>
        <Badge className={
          isCompleted ? "bg-purple-600/10 text-purple-400 border-purple-500/30" :
          "bg-primary/10 text-primary border-primary/30"
        }>
          {isCompleted ? "Completed" : "Upcoming"}
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div>
          <span className="text-[10px] text-muted-foreground block">Raised</span>
          <span className="text-sm font-mono font-bold">${(project.raised / 1e6).toFixed(1)}M</span>
        </div>
        <div>
          <span className="text-[10px] text-muted-foreground block">Target</span>
          <span className="text-sm font-mono">${(project.target / 1e6).toFixed(1)}M</span>
        </div>
        <div>
          <span className="text-[10px] text-muted-foreground block">Participants</span>
          <span className="text-sm font-mono">{project.participants.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-[10px] text-muted-foreground block">Min Allocation</span>
          <span className="text-sm font-mono">{project.allocation}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Progress</span>
          <span>{progress.toFixed(0)}%</span>
        </div>
        <div className="h-2 bg-background/50 rounded-full overflow-hidden border border-border/30">
          <div
            className={`h-full rounded-full transition-all ${isCompleted ? "bg-purple-600" : "bg-gradient-to-r from-primary to-green-400"}`}
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {project.startDate}</span>
          <span className="flex items-center gap-1"><Layers className="w-3 h-3" /> {project.chain}</span>
        </div>
        {!isCompleted && (
          isAuthenticated ? (
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold">
              <Rocket className="w-3 h-3 mr-1" /> Join IDO
            </Button>
          ) : (
            <a href={getLoginUrl()}>
              <Button size="sm" variant="outline" className="text-xs">Sign In</Button>
            </a>
          )
        )}
      </div>
    </div>
  );
}

export default function Farming() {
  // Pull real staking data to show actual TVL
  const { data: tokenMetrics } = trpc.token.metrics.useQuery();
  const { data: stakingPools } = trpc.staking.pools.useQuery();
  const realTotalStaked = tokenMetrics?.totalStaked || 0;
  const totalTVL = realTotalStaked > 0 ? realTotalStaked : FARMING_POOLS.reduce((sum, p) => sum + p.tvl, 0);
  const avgAPY = FARMING_POOLS.reduce((sum, p) => sum + p.apy, 0) / FARMING_POOLS.length;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,oklch(0.2_0.06_140)_0%,transparent_50%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-600/5 mb-6">
              <Sprout className="h-3 w-3 text-purple-400" />
              <span className="text-xs font-mono text-purple-400">DEFI FARMING</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Farming & <span className="text-primary">Launchpad</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Provide liquidity, earn yield, and get early access to the hottest new projects in the SKYCOIN4444 ecosystem.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            <div className="p-4 rounded-xl border border-border/50 bg-card/80 backdrop-blur text-center">
              <div className="text-2xl font-bold font-mono text-primary">${(totalTVL / 1e6).toFixed(0)}M</div>
              <div className="text-xs text-muted-foreground mt-1">Total Value Locked</div>
            </div>
            <div className="p-4 rounded-xl border border-border/50 bg-card/80 backdrop-blur text-center">
              <div className="text-2xl font-bold font-mono text-purple-400">{avgAPY.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground mt-1">Avg APY</div>
            </div>
            <div className="p-4 rounded-xl border border-border/50 bg-card/80 backdrop-blur text-center">
              <div className="text-2xl font-bold font-mono text-[oklch(0.7_0.2_280)]">{FARMING_POOLS.length}</div>
              <div className="text-xs text-muted-foreground mt-1">Active Farms</div>
            </div>
            <div className="p-4 rounded-xl border border-border/50 bg-card/80 backdrop-blur text-center">
              <div className="text-2xl font-bold font-mono text-[oklch(0.7_0.2_60)]">{LAUNCHPAD_PROJECTS.filter(p => p.status === "upcoming").length}</div>
              <div className="text-xs text-muted-foreground mt-1">Upcoming IDOs</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="farming" className="w-full">
            <TabsList className="w-full max-w-md bg-card/80 border border-border/50">
              <TabsTrigger value="farming" className="flex-1">
                <Sprout className="w-4 h-4 mr-1.5" /> Yield Farming
              </TabsTrigger>
              <TabsTrigger value="launchpad" className="flex-1">
                <Rocket className="w-4 h-4 mr-1.5" /> Launchpad
              </TabsTrigger>
            </TabsList>

            <TabsContent value="farming" className="mt-6">
              {/* Info banner */}
              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 mb-6 flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold mb-0.5">Audited Smart Contracts</h4>
                  <p className="text-xs text-muted-foreground">All farming pools are secured by audited contracts. Impermanent loss protection available on select pools.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {FARMING_POOLS.map(pool => (
                  <FarmCard key={pool.id} pool={pool} />
                ))}
              </div>

              {/* How it works */}
              <div className="mt-12">
                <h3 className="text-xl font-bold mb-6">How Yield Farming Works</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { icon: Coins, title: "1. Provide Liquidity", desc: "Add token pairs to a liquidity pool" },
                    { icon: Lock, title: "2. Stake LP Tokens", desc: "Stake your LP tokens in the farm" },
                    { icon: Sprout, title: "3. Earn Rewards", desc: "Accumulate SKY444 rewards over time" },
                    { icon: TrendingUp, title: "4. Compound", desc: "Re-stake rewards for exponential growth" },
                  ].map((step, i) => (
                    <div key={i} className="p-4 rounded-xl border border-border/50 bg-card/80 text-center">
                      <step.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                      <h4 className="text-sm font-semibold mb-1">{step.title}</h4>
                      <p className="text-xs text-muted-foreground">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="launchpad" className="mt-6">
              {/* Launchpad info */}
              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 mb-6 flex items-start gap-3">
                <Star className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold mb-0.5">SKY444 Launchpad</h4>
                  <p className="text-xs text-muted-foreground">Get early access to vetted projects. Hold SKY444 tokens to qualify for IDO allocations. Higher tier = larger allocation.</p>
                </div>
              </div>

              {/* Tier system */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {[
                  { tier: "Bronze", min: "500 SKY444", multiplier: "1x", color: "text-orange-400 border-orange-500/30" },
                  { tier: "Silver", min: "5,000 SKY444", multiplier: "3x", color: "text-gray-300 border-gray-400/30" },
                  { tier: "Gold", min: "25,000 SKY444", multiplier: "5x", color: "text-yellow-400 border-yellow-500/30" },
                  { tier: "Diamond", min: "100,000 SKY444", multiplier: "10x", color: "text-primary border-primary/30" },
                ].map((t, i) => (
                  <div key={i} className={`p-4 rounded-xl border ${t.color} bg-card/80 text-center`}>
                    <div className={`text-sm font-bold ${t.color.split(" ")[0]}`}>{t.tier}</div>
                    <div className="text-xs text-muted-foreground mt-1">{t.min}</div>
                    <div className="text-lg font-mono font-bold mt-2">{t.multiplier}</div>
                    <div className="text-[10px] text-muted-foreground">allocation</div>
                  </div>
                ))}
              </div>

              {/* Projects */}
              <div className="space-y-4">
                {LAUNCHPAD_PROJECTS.map(project => (
                  <LaunchpadCard key={project.id} project={project} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
