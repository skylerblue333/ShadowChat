import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import {
  Zap, TrendingUp, Users, Award, Hash, MessageCircle,
  Heart, Share2, Eye, UserPlus, Cpu, Flame, Crown, Star
} from "lucide-react";

const MINING_ACTIONS = [
  { action: "login", icon: Zap, label: "Daily Login", reward: 25, desc: "Claim your daily login bonus", color: "from-yellow-500 to-orange-500", limit: 1 },
  { action: "post", icon: Hash, label: "Create Post", reward: 50, desc: "Share content with the community", color: "from-purple-500 to-pink-500", limit: 10 },
  { action: "comment", icon: MessageCircle, label: "Comment", reward: 15, desc: "Engage in conversations", color: "from-blue-500 to-cyan-500", limit: 50 },
  { action: "like", icon: Heart, label: "Like Content", reward: 5, desc: "Show appreciation for posts", color: "from-pink-500 to-rose-500", limit: 100 },
  { action: "share", icon: Share2, label: "Share Post", reward: 20, desc: "Spread content to your network", color: "from-green-500 to-teal-500", limit: 20 },
  { action: "watch", icon: Eye, label: "Watch Stream", reward: 10, desc: "Watch live streams (per 5 min)", color: "from-violet-500 to-purple-500", limit: 30 },
  { action: "refer", icon: UserPlus, label: "Refer Friend", reward: 200, desc: "Invite new users to the platform", color: "from-amber-500 to-yellow-500", limit: 5 },
  { action: "stake", icon: TrendingUp, label: "Stake Tokens", reward: 100, desc: "Stake SKY444 in the pool", color: "from-emerald-500 to-green-500", limit: 1 },
];

export default function Mining() {
  
  const utils = trpc.useUtils();
  const { data: stats, isLoading } = trpc.mining.stats.useQuery(undefined, { enabled: isAuthenticated });
  const { data: pool } = trpc.mining.pool.useQuery();
  const { data: leaderboard } = trpc.mining.leaderboard.useQuery({ limit: 10 });
  const [mining, setMining] = useState<string | null>(null);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; reward: number }[]>([]);

  const engageMutation = trpc.mining.engage.useMutation({
    onSuccess: (data, variables) => {
      if (data.success) {
        toast.success(`+${data.reward} SKY444 mined!`, { description: `${variables.action} reward` });
        // Spawn particles
        const newParticles = Array.from({ length: 5 }, (_, i) => ({
          id: Date.now() + i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          reward: data.reward,
        }));
        setParticles(p => [...p, ...newParticles]);
        setTimeout(() => setParticles(p => p.filter(part => !newParticles.find(np => np.id === part.id))), 2000);
        utils.mining.stats.invalidate();
      } else {
        toast.error(data.message || "Mining failed");
      }
    },
    onError: (e) => toast.error(e.message),
    onSettled: () => setMining(null),
  });

  const handleMine = (action: string) => {
    if (!isAuthenticated) { // Removed login redirect for testing; return; }
    setMining(action);
    engageMutation.mutate({ action: action as any });
  };

  const dailyProgress = stats ? (stats.todayMined / stats.dailyLimit) * 100 : 0;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Psychedelic background */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 20% 20%, oklch(0.25 0.15 305 / 0.4) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, oklch(0.25 0.15 340 / 0.3) 0%, transparent 50%)",
      }} />

      {/* Floating particles */}
      {particles.map(p => (
        <div key={p.id} className="fixed pointer-events-none z-50 animate-bounce" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
          <span className="text-yellow-400 font-black text-lg drop-shadow-lg">+{p.reward} SKY</span>
        </div>
      ))}

      {/* Hero */}
      <section className="relative py-16 text-center px-4">
        <Badge className="mb-4 border-yellow-500/40 text-yellow-300 bg-yellow-500/10 text-sm px-4 py-1">
          <Cpu className="w-3 h-3 mr-2" /> Proof-of-Engagement Mining
        </Badge>
        <h1 className="text-5xl md:text-7xl font-black mb-4" style={{
          background: "linear-gradient(135deg, oklch(0.85 0.25 60), oklch(0.85 0.25 305), oklch(0.85 0.25 340))",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        }}>
          Mine SKY444
        </h1>
        <p className="text-slate-400 text-xl max-w-2xl mx-auto">
          Earn free SKY444 tokens by engaging with the platform. No hardware required — just participate.
        </p>

        {/* Live stats */}
        {isAuthenticated && stats && (
          <div className="mt-8 inline-flex flex-wrap gap-4 justify-center">
            <div className="px-6 py-3 rounded-2xl border border-yellow-500/30 bg-yellow-500/10">
              <p className="text-xs text-yellow-400/70">Your Balance</p>
              <p className="text-2xl font-black text-yellow-400">{stats.balance.toLocaleString()} SKY</p>
            </div>
            <div className="px-6 py-3 rounded-2xl border border-purple-500/30 bg-purple-500/10">
              <p className="text-xs text-purple-400/70">Today Mined</p>
              <p className="text-2xl font-black text-purple-400">{stats.todayMined.toLocaleString()} / {stats.dailyLimit.toLocaleString()}</p>
            </div>
            <div className="px-6 py-3 rounded-2xl border border-cyan-500/30 bg-cyan-500/10">
              <p className="text-xs text-cyan-400/70">Hash Rate</p>
              <p className="text-2xl font-black text-cyan-400">{stats.hashRate} H/s</p>
            </div>
            <div className="px-6 py-3 rounded-2xl border border-pink-500/30 bg-pink-500/10">
              <p className="text-xs text-pink-400/70">Mining Level</p>
              <p className="text-2xl font-black text-pink-400">Lv.{stats.miningLevel}</p>
            </div>
          </div>
        )}

        {/* Daily progress bar */}
        {isAuthenticated && stats && (
          <div className="mt-6 max-w-md mx-auto">
            <div className="flex justify-between text-xs text-slate-500 mb-2">
              <span>Daily Mining Progress</span>
              <span>{Math.round(dailyProgress)}%</span>
            </div>
            <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(dailyProgress, 100)}%`,
                  background: "linear-gradient(90deg, oklch(0.72 0.28 305), oklch(0.72 0.28 340), oklch(0.80 0.18 70))",
                }}
              />
            </div>
          </div>
        )}
      </section>

      {/* Mining Actions Grid */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-black text-white mb-6 text-center">Mining Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MINING_ACTIONS.map(({ action, icon: Icon, label, reward, desc, color, limit }) => (
            <button
              key={action}
              onClick={() => handleMine(action)}
              disabled={mining === action || engageMutation.isPending}
              className="group relative rounded-2xl border border-white/5 bg-[#0e0a1a]/90 p-5 text-left transition-all duration-200 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
            >
              {/* Gradient top border */}
              <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${color} opacity-60 group-hover:opacity-100 transition-opacity`} />
              {/* Glow on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity`} />

              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
                {mining === action ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Icon className="w-5 h-5 text-white" />
                )}
              </div>
              <h3 className="font-bold text-white mb-1">{label}</h3>
              <p className="text-xs text-slate-500 mb-3">{desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-yellow-400 font-black text-lg">+{reward}</span>
                <span className="text-xs text-slate-600">SKY444</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">Daily limit: {limit}x</p>
            </button>
          ))}
        </div>

        {!isAuthenticated && (
          <div className="mt-8 text-center">
            <Button
              onClick={() => // Removed login redirect for testing}
              size="lg"
              className="px-8 py-4 text-lg font-black"
              style={{ background: "linear-gradient(135deg, oklch(0.72 0.28 305), oklch(0.72 0.28 340))" }}
            >
              <Zap className="w-5 h-5 mr-2" /> Sign In to Start Mining
            </Button>
          </div>
        )}
      </section>

      {/* Pool Info + Leaderboard */}
      <section className="max-w-6xl mx-auto px-4 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pool Info */}
        {pool && (
          <div className="rounded-2xl border border-white/5 bg-[#0e0a1a]/90 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">{pool.name}</h3>
                <p className="text-xs text-slate-500">{pool.algorithm}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-slate-900/60">
                <p className="text-xs text-slate-500">Total Supply</p>
                <p className="font-bold text-white">{(pool.totalSupply / 1_000_000).toFixed(0)}M SKY</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60">
                <p className="text-xs text-slate-500">Mining Reserve</p>
                <p className="font-bold text-yellow-400">{(pool.miningReserve / 1_000_000).toFixed(0)}M SKY</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60">
                <p className="text-xs text-slate-500">Circulating</p>
                <p className="font-bold text-green-400">{(pool.circulatingSupply / 1_000_000).toFixed(2)}M SKY</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60">
                <p className="text-xs text-slate-500">Algorithm</p>
                <p className="font-bold text-purple-400 text-xs">PoE</p>
              </div>
            </div>
            <p className="text-sm text-slate-400">{pool.description}</p>
          </div>
        )}

        {/* Leaderboard */}
        <div className="rounded-2xl border border-white/5 bg-[#0e0a1a]/90 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-white">Top Miners</h3>
          </div>
          {!leaderboard || leaderboard.length === 0 ? (
            <div className="text-center py-8">
              <Star className="w-10 h-10 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500">Be the first to mine SKY444!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {(leaderboard as any[]).map((miner: any, i: number) => (
                <div key={miner.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                    i === 0 ? "bg-yellow-500 text-black" : i === 1 ? "bg-slate-400 text-black" : i === 2 ? "bg-amber-700 text-white" : "bg-slate-700 text-slate-300"
                  }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm truncate">{miner.displayName || miner.name || `Miner #${miner.id}`}</p>
                    <p className="text-xs text-slate-500">Level {miner.level || 1}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-yellow-400 font-bold text-sm">{(miner.xp || 0).toLocaleString()} XP</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
