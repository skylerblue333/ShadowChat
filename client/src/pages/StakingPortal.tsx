import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Coins, Lock, TrendingUp, Clock, Zap, Loader2, Gift, Shield, ArrowUpRight, Wallet } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const APY_HISTORY = [
  { month: "Jan", apy: 12 }, { month: "Feb", apy: 14 }, { month: "Mar", apy: 13 },
  { month: "Apr", apy: 18 }, { month: "May", apy: 22 }, { month: "Jun", apy: 20 },
  { month: "Jul", apy: 25 }, { month: "Aug", apy: 28 }, { month: "Sep", apy: 30 },
  { month: "Oct", apy: 27 }, { month: "Nov", apy: 32 }, { month: "Dec", apy: 35 },
];

const REWARDS_PROJECTION = [
  { day: "D1", rewards: 2.7 }, { day: "D7", rewards: 19 }, { day: "D30", rewards: 82 },
  { day: "D90", rewards: 247 }, { day: "D180", rewards: 493 }, { day: "D365", rewards: 1000 },
];

function StakingCharts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <div className="p-4 rounded-xl border border-border/30 bg-card/50">
        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" />APY History (12mo)</h4>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={APY_HISTORY}>
            <defs>
              <linearGradient id="apyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#888" }} />
            <YAxis tick={{ fontSize: 10, fill: "#888" }} unit="%" />
            <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid #333", borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="apy" stroke="#7c3aed" fill="url(#apyGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="p-4 rounded-xl border border-border/30 bg-card/50">
        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><Coins className="w-4 h-4 text-primary" />Rewards Projection (1000 SKY)</h4>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={REWARDS_PROJECTION}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#888" }} />
            <YAxis tick={{ fontSize: 10, fill: "#888" }} />
            <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid #333", borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="rewards" fill="#7c3aed" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function APYBadge({ apy }: { apy: number }) {
  const color = apy >= 20 ? "text-purple-400 bg-purple-600/10 border-purple-500/20" :
                apy >= 12 ? "text-[oklch(0.7_0.2_280)] bg-purple-500/10 border-purple-500/20" :
                "text-primary bg-primary/10 border-primary/20";
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold font-mono border ${color}`}>
      {apy}% APY
    </span>
  );
}

function StakeDialog({ pool, onSuccess }: { pool: any; onSuccess: () => void }) {
  const [amount, setAmount] = useState("");
  const [open, setOpen] = useState(false);

  const stakeMutation = trpc.staking.stake.useMutation({
    onSuccess: () => {
      toast.success(`Successfully staked ${amount} SKY444 in ${pool.name}!`);
      setAmount("");
      setOpen(false);
      onSuccess();
    },
    onError: (err) => toast.error(err.message || "Failed to stake. Please try again."),
  });

  const estimatedDaily = amount ? (parseFloat(amount) * (pool.apy / 100) / 365).toFixed(2) : "0.00";
  const estimatedTotal = amount ? (parseFloat(amount) * (pool.apy / 100) * (pool.lockDays / 365)).toFixed(2) : "0.00";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
          <Coins className="w-4 h-4 mr-2" /> Stake Now
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border/50">
        <DialogHeader>
          <DialogTitle className="text-xl">Stake in {pool.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/30">
            <span className="text-sm text-muted-foreground">Pool APY</span>
            <APYBadge apy={pool.apy} />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/30">
            <span className="text-sm text-muted-foreground">Lock Period</span>
            <span className="font-mono font-bold">{pool.lockDays} Days</span>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Amount to Stake (SKY444)</label>
            <Input
              type="number"
              placeholder={`Min: ${pool.minStake} SKY444`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-background/50 border-border/30 font-mono"
            />
          </div>
          {amount && parseFloat(amount) > 0 && (
            <div className="space-y-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Daily Reward</span>
                <span className="font-mono text-purple-400">+{estimatedDaily} SKY444</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Reward ({pool.lockDays}d)</span>
                <span className="font-mono text-purple-400 font-bold">+{estimatedTotal} SKY444</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Unlock Date</span>
                <span className="font-mono">{new Date(Date.now() + pool.lockDays * 86400000).toLocaleDateString()}</span>
              </div>
            </div>
          )}
          <Button
            className="w-full bg-primary hover:bg-primary/90 font-semibold"
            disabled={!amount || parseFloat(amount) < pool.minStake || stakeMutation.isPending}
            onClick={() => stakeMutation.mutate({ poolId: pool.id, amount: parseFloat(amount) })}
          >
            {stakeMutation.isPending ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Staking...</>
            ) : (
              <><Lock className="w-4 h-4 mr-2" /> Confirm Stake</>
            )}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Tokens will be locked for {pool.lockDays} days. Early withdrawal incurs a 10% penalty.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function StakingPortal() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { data: pools, isLoading: poolsLoading } = trpc.staking.pools.useQuery();
  const { data: positions, isLoading: posLoading, refetch: refetchPositions } = trpc.staking.userPositions.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const claimRewards = trpc.staking.claimRewards.useMutation({
    onSuccess: () => { toast.success("Rewards claimed successfully!"); refetchPositions(); },
    onError: () => toast.error("Failed to claim rewards."),
  });

  const totalStaked = pools?.reduce((sum, p) => sum + p.totalStaked, 0) ?? 0;
  const totalParticipants = pools?.reduce((sum, p) => sum + p.participants, 0) ?? 0;
  const userTotalStaked = positions?.reduce((sum, p) => sum + p.amount, 0) ?? 0;
  const userTotalEarned = positions?.reduce((sum, p) => sum + p.earned, 0) ?? 0;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.2_0.05_160)_0%,transparent_60%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-600/5 mb-6">
              <Coins className="h-3 w-3 text-purple-400" />
              <span className="text-xs font-mono text-purple-400">EARN REWARDS</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Staking <span className="text-primary">Portal</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Stake your SKY444 tokens and earn 8-20% APY. Choose your lock period and start earning daily rewards.
            </p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            <div className="p-4 rounded-xl border border-border/50 bg-card/80 backdrop-blur text-center">
              <div className="text-2xl font-bold font-mono text-primary">
                {poolsLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : `${(totalStaked / 1e6).toFixed(1)}M`}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Total Staked</div>
            </div>
            <div className="p-4 rounded-xl border border-border/50 bg-card/80 backdrop-blur text-center">
              <div className="text-2xl font-bold font-mono text-[oklch(0.7_0.2_280)]">
                {poolsLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : totalParticipants.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Active Stakers</div>
            </div>
            <div className="p-4 rounded-xl border border-border/50 bg-card/80 backdrop-blur text-center">
              <div className="text-2xl font-bold font-mono text-purple-400">8-20%</div>
              <div className="text-xs text-muted-foreground mt-1">APY Range</div>
            </div>
            <div className="p-4 rounded-xl border border-border/50 bg-card/80 backdrop-blur text-center">
              <div className="text-2xl font-bold font-mono text-[oklch(0.7_0.2_60)]">Daily</div>
              <div className="text-xs text-muted-foreground mt-1">Reward Distribution</div>
            </div>
          </div>
        </div>
      </section>

      {/* User Portfolio Summary (if authenticated) */}
      {isAuthenticated && positions && positions.length > 0 && (
        <section className="pb-8">
          <div className="container mx-auto px-4">
            <div className="p-6 rounded-xl border border-primary/30 bg-primary/5 backdrop-blur">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-primary" /> Your Staking Portfolio
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-3">
                    <div>
                      <span className="text-xs text-muted-foreground block">Total Staked</span>
                      <span className="font-mono font-bold text-lg">{userTotalStaked.toLocaleString()} SKY444</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Total Earned</span>
                      <span className="font-mono font-bold text-lg text-purple-400">+{userTotalEarned.toLocaleString()} SKY444</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Active Positions</span>
                      <span className="font-mono font-bold text-lg">{positions.length}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Avg APY</span>
                      <span className="font-mono font-bold text-lg text-primary">
                        {positions.length > 0 ? (positions.reduce((s, p) => s + p.apy, 0) / positions.length).toFixed(1) : 0}%
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => claimRewards.mutate()}
                  disabled={claimRewards.isPending || userTotalEarned === 0}
                  className="bg-purple-600 hover:bg-purple-600 text-white font-semibold"
                >
                  {claimRewards.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Gift className="w-4 h-4 mr-2" />}
                  Claim All Rewards
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Staking Pools */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <StakingCharts />
          <h2 className="text-2xl font-bold mb-6">Available Pools</h2>
          {poolsLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pools?.map((pool) => (
                <div key={pool.id} className="relative p-6 rounded-xl border border-border/50 bg-card/80 backdrop-blur hover:border-primary/30 transition-all">
                  {pool.apy === 20 && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs font-bold rounded-full border border-primary/30 flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3" /> BEST VALUE
                      </span>
                    </div>
                  )}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold mb-2">{pool.name}</h3>
                    <APYBadge apy={pool.apy} />
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Lock className="h-3.5 w-3.5" /> Lock Period
                      </span>
                      <span className="font-mono font-medium">{pool.lockDays} Days</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Coins className="h-3.5 w-3.5" /> Total Staked
                      </span>
                      <span className="font-mono font-medium">{pool.totalStaked.toLocaleString()} SKY444</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <TrendingUp className="h-3.5 w-3.5" /> Participants
                      </span>
                      <span className="font-mono font-medium">{pool.participants}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Zap className="h-3.5 w-3.5" /> Min Stake
                      </span>
                      <span className="font-mono font-medium">{pool.minStake} SKY444</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Shield className="h-3.5 w-3.5" /> Security
                      </span>
                      <span className="font-mono font-medium text-purple-400">Audited</span>
                    </div>
                  </div>

                  {/* Pool fill progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Pool Capacity</span>
                      <span>{Math.min(100, (pool.totalStaked / (pool.totalStaked * 1.5)) * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 bg-background/50 rounded-full overflow-hidden border border-border/30">
                      <div className="h-full bg-gradient-to-r from-primary to-green-400 rounded-full" style={{ width: `${Math.min(100, (pool.totalStaked / (pool.totalStaked * 1.5)) * 100)}%` }} />
                    </div>
                  </div>

                  {isAuthenticated ? (
                    <StakeDialog pool={pool} onSuccess={() => refetchPositions()} />
                  ) : (
                    <a href={getLoginUrl()} className="block">
                      <Button className="w-full" variant="outline">
                        Sign In to Stake
                      </Button>
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* User Positions */}
      {isAuthenticated && (
        <section className="pb-24">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Your Positions</h2>
            {posLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : positions && positions.length > 0 ? (
              <div className="space-y-4">
                {positions.map((pos) => (
                  <div key={pos.id} className="p-5 rounded-xl border border-border/50 bg-card/80 backdrop-blur">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{pos.poolName}</h3>
                          <APYBadge apy={pos.apy} />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground block text-xs">Staked</span>
                            <span className="font-mono font-medium">{pos.amount.toLocaleString()} SKY444</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block text-xs">Earned</span>
                            <span className="font-mono font-medium text-purple-400">+{pos.earned.toLocaleString()} SKY444</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block text-xs flex items-center gap-1">
                              <Clock className="h-3 w-3" /> Unlock Date
                            </span>
                            <span className="font-mono font-medium">{new Date(pos.unlockDate).toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block text-xs">Progress</span>
                            <span className="font-mono font-medium">{pos.progress}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="w-full md:w-48">
                        <div className="h-2 bg-background/50 rounded-full overflow-hidden border border-border/30">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-green-400 rounded-full transition-all"
                            style={{ width: `${pos.progress}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-muted-foreground text-right mt-1">{pos.progress}% complete</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 rounded-xl border border-border/50 bg-card/80 text-center">
                <Coins className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Positions</h3>
                <p className="text-muted-foreground text-sm">Choose a pool above to start earning SKY444 rewards daily.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Sign-in CTA for unauthenticated */}
      {!isAuthenticated && !authLoading && (
        <section className="pb-24">
          <div className="container mx-auto px-4">
            <div className="p-12 rounded-xl border border-border/50 bg-card/80 text-center">
              <Lock className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Sign In to View Your Positions</h3>
              <p className="text-muted-foreground mb-6">
                Connect your account to stake SKY444 tokens and track your rewards in real-time.
              </p>
              <a href={getLoginUrl()}>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                  Sign In
                </Button>
              </a>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
