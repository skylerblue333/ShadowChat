import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Coins, TrendingUp, Zap, Lock, Gift, Star, ArrowUpRight, Flame,
  Activity, BarChart3, Clock, CheckCircle, Loader2, Pickaxe,
  DollarSign, Percent, Trophy, Users, Wallet, RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

const APY_BY_TIER = [
  { tier: "Flexible", lockDays: 0,   apy: 8,  color: "#6366f1", minTokens: 100 },
  { tier: "30 Days",  lockDays: 30,  apy: 15, color: "#8b5cf6", minTokens: 500 },
  { tier: "90 Days",  lockDays: 90,  apy: 22, color: "#a855f7", minTokens: 1000 },
  { tier: "180 Days", lockDays: 180, apy: 28, color: "#d946ef", minTokens: 2500 },
  { tier: "365 Days", lockDays: 365, apy: 35, color: "#ec4899", minTokens: 5000 },
];

const YIELD_POOLS = [
  { name: "SKY444/USDC LP",  apy: 45, tvl: 2_400_000, token: "SKY444+USDC", risk: "medium", color: "#6366f1" },
  { name: "SKY444 Single",   apy: 35, tvl: 8_900_000, token: "SKY444",      risk: "low",    color: "#8b5cf6" },
  { name: "SKY444/ETH LP",   apy: 62, tvl: 1_200_000, token: "SKY444+ETH",  risk: "high",   color: "#a855f7" },
  { name: "Creator Vault",   apy: 28, tvl: 3_100_000, token: "SKY444",      risk: "low",    color: "#d946ef" },
  { name: "Governance Pool", apy: 18, tvl: 5_600_000, token: "SKY444",      risk: "low",    color: "#ec4899" },
];

const MINE_ACTIONS = [
  { action: "post",    label: "Create Post",    reward: 2.5,  icon: "✍️", cooldownMin: 5 },
  { action: "like",    label: "Like Content",   reward: 0.5,  icon: "❤️", cooldownMin: 0 },
  { action: "comment", label: "Comment",        reward: 1.0,  icon: "💬", cooldownMin: 1 },
  { action: "share",   label: "Share Post",     reward: 1.5,  icon: "🔁", cooldownMin: 2 },
  { action: "stream",  label: "Go Live",        reward: 10.0, icon: "🎥", cooldownMin: 60 },
  { action: "refer",   label: "Refer a Friend", reward: 50.0, icon: "👥", cooldownMin: 0 },
];

const REWARD_HISTORY_MOCK = [
  { day: "Mon", earned: 12 }, { day: "Tue", earned: 18 }, { day: "Wed", earned: 9 },
  { day: "Thu", earned: 24 }, { day: "Fri", earned: 31 }, { day: "Sat", earned: 15 },
  { day: "Sun", earned: 22 },
];

function APYCalculator() {
  const [amount, setAmount] = useState("1000");
  const [selectedTier, setSelectedTier] = useState(APY_BY_TIER[2]);
  const tokens = parseFloat(amount) || 0;
  const dailyReward = (tokens * selectedTier.apy / 100) / 365;
  const monthlyReward = dailyReward * 30;
  const yearlyReward = tokens * selectedTier.apy / 100;

  return (
    <Card className="border-purple-500/20 bg-gradient-to-br from-purple-950/30 to-black">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-400">
          <Percent className="w-5 h-5" /> APY Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">SKY444 Amount</label>
          <Input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="bg-black/40 border-purple-500/30"
            placeholder="Enter amount..."
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {APY_BY_TIER.map(tier => (
            <button
              key={tier.tier}
              onClick={() => setSelectedTier(tier)}
              className={`p-2 rounded-lg border text-xs font-medium transition-all ${
                selectedTier.tier === tier.tier
                  ? "border-purple-500 bg-purple-500/20 text-purple-300"
                  : "border-border/30 bg-black/20 text-muted-foreground hover:border-purple-500/50"
              }`}
            >
              <div className="font-bold" style={{ color: tier.color }}>{tier.apy}% APY</div>
              <div>{tier.tier}</div>
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3 pt-2">
          {[
            { label: "Daily", value: dailyReward },
            { label: "Monthly", value: monthlyReward },
            { label: "Yearly", value: yearlyReward },
          ].map(({ label, value }) => (
            <div key={label} className="text-center p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <div className="text-xs text-muted-foreground">{label}</div>
              <div className="text-lg font-bold text-purple-300">+{value.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">SKY444</div>
            </div>
          ))}
        </div>
        <div className="text-xs text-muted-foreground text-center">
          Min stake: {selectedTier.minTokens.toLocaleString()} SKY444 · Lock: {selectedTier.lockDays} days
        </div>
      </CardContent>
    </Card>
  );
}

function StakeTab() {
  const { user } = useAuth();
  const [stakeAmount, setStakeAmount] = useState("500");
  const [selectedTier, setSelectedTier] = useState(APY_BY_TIER[2]);
  const { data: balance } = trpc.wallet.getBalance.useQuery(undefined, { enabled: !!user });
  const { data: positions, refetch } = trpc.staking.userPositions.useQuery(undefined, { enabled: !!user });
  const stakeMut = trpc.staking.stake.useMutation({
    onSuccess: () => { toast.success("Staked successfully!"); refetch(); },
    onError: (e) => toast.error(e.message),
  });

  if (!user) return (
    <div className="text-center py-12">
      <Lock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
      <p className="text-muted-foreground mb-4">Sign in to start staking</p>
      <Button asChild><a href={getLoginUrl()}>Sign In</a></Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <APYCalculator />
        <Card className="border-border/30 bg-black/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-400">
              <Lock className="w-5 h-5" /> Stake SKY444
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Available Balance</span>
              <span className="font-bold text-emerald-400">{(balance as any)?.sky444 ?? 0} SKY444</span>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Amount to Stake</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={stakeAmount}
                  onChange={e => setStakeAmount(e.target.value)}
                  className="bg-black/40 border-border/30"
                />
                <Button variant="outline" size="sm" onClick={() => setStakeAmount(String((balance as any)?.sky444 ?? 0))}>
                  MAX
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {APY_BY_TIER.map(tier => (
                <button
                  key={tier.tier}
                  onClick={() => setSelectedTier(tier)}
                  className={`p-2 rounded-lg border text-xs transition-all ${
                    selectedTier.tier === tier.tier
                      ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                      : "border-border/30 hover:border-emerald-500/50 text-muted-foreground"
                  }`}
                >
                  <div className="font-bold">{tier.apy}% APY</div>
                  <div>{tier.tier}</div>
                </button>
              ))}
            </div>
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              onClick={() =>     stakeMut.mutate({ amount: parseFloat(stakeAmount), poolId: String(selectedTier.lockDays) })}
              disabled={stakeMut.isPending}
            >
              {stakeMut.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
              Stake {stakeAmount} SKY444 at {selectedTier.apy}% APY
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Active Positions */}
      {(positions as any[])?.length > 0 && (
        <Card className="border-border/30 bg-black/40">
          <CardHeader>
            <CardTitle className="text-sm">Active Staking Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(positions as any[]).map((pos: any) => (
                <div key={pos.id} className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-border/20">
                  <div>
                    <div className="font-medium">{pos.amount} SKY444</div>
                    <div className="text-xs text-muted-foreground">{pos.apy ?? selectedTier.apy}% APY · {pos.lockDays ?? 0} day lock</div>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-400 font-bold">+{((pos.amount * (pos.apy ?? selectedTier.apy) / 100) / 365).toFixed(2)}/day</div>
                    <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-400">Active</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function MineTab() {
  const { user } = useAuth();
  const [miningLog, setMiningLog] = useState<Array<{ action: string; reward: number; time: number }>>([]);
  const engageMut = trpc.mining.engage.useMutation({
    onSuccess: (data) => {
      if (data.reward && data.reward > 0) {
        setMiningLog(prev => [{ action: (data as any).action ?? "action", reward: data.reward ?? 0, time: Date.now() }, ...prev.slice(0, 9)]);
        toast.success(`+${data.reward?.toFixed(2)} SKY444 mined!`);
      }
    },
    onError: (e) => toast.error(e.message),
  });
  const { data: mineData } = trpc.mining.stats.useQuery(undefined, { enabled: !!user });

  if (!user) return (
    <div className="text-center py-12">
      <Pickaxe className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
      <p className="text-muted-foreground mb-4">Sign in to start mining</p>
      <Button asChild><a href={getLoginUrl()}>Sign In</a></Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Mined", value: `${(mineData as any)?.totalMined?.toFixed(1) ?? "0"} SKY444`, icon: <Pickaxe className="w-5 h-5 text-amber-400" />, color: "amber" },
          { label: "Today's Rewards", value: `${(mineData as any)?.todayMined?.toFixed(1) ?? "0"} SKY444`, icon: <Flame className="w-5 h-5 text-orange-400" />, color: "orange" },
          { label: "Mining Rank", value: `#${(mineData as any)?.rank ?? "—"}`, icon: <Trophy className="w-5 h-5 text-yellow-400" />, color: "yellow" },
        ].map(({ label, value, icon, color }) => (
          <Card key={label} className={`border-${color}-500/20 bg-${color}-950/20`}>
            <CardContent className="p-4 flex items-center gap-3">
              {icon}
              <div>
                <div className="text-xs text-muted-foreground">{label}</div>
                <div className="font-bold">{value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {MINE_ACTIONS.map(({ action, label, reward, icon }) => (
          <button
            key={action}
            onClick={() => engageMut.mutate({ action: action as any })}
            disabled={engageMut.isPending}
            className="p-4 rounded-xl border border-amber-500/20 bg-amber-950/20 hover:bg-amber-950/40 hover:border-amber-500/40 transition-all text-left group"
          >
            <div className="text-2xl mb-2">{icon}</div>
            <div className="font-medium text-sm">{label}</div>
            <div className="text-amber-400 font-bold text-sm">+{reward} SKY444</div>
          </button>
        ))}
      </div>

      {miningLog.length > 0 && (
        <Card className="border-border/30 bg-black/40">
          <CardHeader><CardTitle className="text-sm">Recent Mining Rewards</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {miningLog.map((log, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground capitalize">{log.action}</span>
                  <span className="text-amber-400 font-bold">+{log.reward.toFixed(2)} SKY444</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-border/30 bg-black/40">
        <CardHeader><CardTitle className="text-sm">Weekly Earnings</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={REWARD_HISTORY_MOCK}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="day" tick={{ fill: "#888", fontSize: 11 }} />
              <YAxis tick={{ fill: "#888", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#111", border: "1px solid #333" }} />
              <Bar dataKey="earned" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function YieldTab() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {YIELD_POOLS.map(pool => (
          <Card key={pool.name} className="border-border/30 bg-black/40 hover:border-purple-500/30 transition-all">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-bold">{pool.name}</div>
                  <div className="text-xs text-muted-foreground">{pool.token}</div>
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs ${pool.risk === "low" ? "border-emerald-500/30 text-emerald-400" : pool.risk === "medium" ? "border-amber-500/30 text-amber-400" : "border-red-500/30 text-red-400"}`}
                >
                  {pool.risk} risk
                </Badge>
              </div>
              <div className="text-3xl font-bold mb-1" style={{ color: pool.color }}>{pool.apy}%</div>
              <div className="text-xs text-muted-foreground mb-3">APY</div>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                <span>TVL: ${(pool.tvl / 1_000_000).toFixed(1)}M</span>
              </div>
              <Button
                className="w-full"
                size="sm"
                variant="outline"
                style={{ borderColor: pool.color + "40", color: pool.color }}
                onClick={() => {
                  if (!user) { window.location.href = getLoginUrl(); return; }
                  toast.success(`Entering ${pool.name} pool...`);
                }}
              >
                <Zap className="w-3 h-3 mr-1" /> Farm Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/30 bg-black/40">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <PieChart className="w-4 h-4 text-purple-400" /> TVL Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={YIELD_POOLS} dataKey="tvl" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, apy }) => `${name} ${apy}%`}>
                {YIELD_POOLS.map((pool, i) => <Cell key={i} fill={pool.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#111", border: "1px solid #333" }} formatter={(v: any) => [`$${(v / 1_000_000).toFixed(1)}M`, "TVL"]} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function EarningsTab() {
  const { user } = useAuth();
  const { data: earnings } = trpc.coinEconomics.getMyEarnings.useQuery(undefined, { enabled: !!user });
  const { data: treasury } = trpc.coinEconomics.getTreasury.useQuery();
  const { data: distributions } = trpc.coinEconomics.getDistributionHistory.useQuery();

  if (!user) return (
    <div className="text-center py-12">
      <DollarSign className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
      <p className="text-muted-foreground mb-4">Sign in to view your earnings</p>
      <Button asChild><a href={getLoginUrl()}>Sign In</a></Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Creator Earnings", value: `${(earnings as any)?.creatorEarnings?.toFixed(2) ?? "0"} SKY444`, icon: <Star className="w-5 h-5 text-yellow-400" />, desc: "From content & sales" },
          { label: "Staker Rewards", value: `${(earnings as any)?.stakerEarnings?.toFixed(2) ?? "0"} SKY444`, icon: <Lock className="w-5 h-5 text-purple-400" />, desc: "From profit distributions" },
          { label: "Treasury Balance", value: `${(treasury as any)?.balance?.toFixed(0) ?? "0"} SKY444`, icon: <Wallet className="w-5 h-5 text-emerald-400" />, desc: "Platform treasury" },
        ].map(({ label, value, icon, desc }) => (
          <Card key={label} className="border-border/30 bg-black/40">
            <CardContent className="p-4 flex items-center gap-3">
              {icon}
              <div>
                <div className="text-xs text-muted-foreground">{label}</div>
                <div className="font-bold">{value}</div>
                <div className="text-xs text-muted-foreground">{desc}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/30 bg-black/40">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" /> Revenue Distribution History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(distributions as any[])?.length > 0 ? (
            <div className="space-y-2">
              {(distributions as any[]).map((d: any) => (
                <div key={d.epoch} className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-border/20 text-sm">
                  <div>
                    <span className="font-medium">Epoch #{d.epoch}</span>
                    <span className="text-muted-foreground ml-2">{d.participants} stakers</span>
                  </div>
                  <div className="text-emerald-400 font-bold">+{d.totalDistributed.toFixed(0)} SKY444</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <RefreshCw className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>First distribution coming soon</p>
              <p className="text-xs mt-1">Distributions happen weekly when treasury reaches threshold</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function EarnHub() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-border/20 bg-black/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Coins className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Earn Hub</h1>
              <p className="text-xs text-muted-foreground">Stake · Mine · Farm · Earn</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/ico">Buy SKY444</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/wallet">Wallet</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="bg-gradient-to-r from-amber-950/30 via-purple-950/30 to-emerald-950/30 border-b border-border/20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Total Value Locked", value: "$21.2M", change: "+12.4%", color: "text-amber-400" },
              { label: "Avg APY", value: "26.4%", change: "+3.2%", color: "text-purple-400" },
              { label: "Active Stakers", value: "8,441", change: "+284", color: "text-emerald-400" },
              { label: "SKY444 Price", value: "$0.012", change: "+5.8%", color: "text-blue-400" },
            ].map(({ label, value, change, color }) => (
              <div key={label} className="text-center">
                <div className={`text-2xl font-bold ${color}`}>{value}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
                <div className="text-xs text-emerald-400">{change}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs defaultValue="stake">
          <TabsList className="grid grid-cols-4 mb-8 bg-black/40 border border-border/20">
            <TabsTrigger value="stake" className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Stake
            </TabsTrigger>
            <TabsTrigger value="mine" className="flex items-center gap-1.5">
              <Pickaxe className="w-3.5 h-3.5" /> Mine
            </TabsTrigger>
            <TabsTrigger value="yield" className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" /> Yield Farm
            </TabsTrigger>
            <TabsTrigger value="earnings" className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5" /> Earnings
            </TabsTrigger>
          </TabsList>
          <TabsContent value="stake"><StakeTab /></TabsContent>
          <TabsContent value="mine"><MineTab /></TabsContent>
          <TabsContent value="yield"><YieldTab /></TabsContent>
          <TabsContent value="earnings"><EarningsTab /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
