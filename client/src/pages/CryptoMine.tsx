import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import {
  Cpu, Zap, TrendingUp, Award, ChevronLeft, Coins,
  Activity, BarChart2, Clock, Star, ArrowUp, Flame,
  MessageSquare, Heart, Share2, Play, Users, Gift,
  RefreshCw, Lock, Unlock, CheckCircle2
} from "lucide-react";

// Mining action definitions
const MINE_ACTIONS = [
  { action: "post" as const, label: "Create Post", reward: 50, xp: 100, icon: MessageSquare, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", dailyLimit: 10, description: "Share content with the community" },
  { action: "comment" as const, label: "Comment", reward: 15, xp: 25, icon: MessageSquare, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20", dailyLimit: 50, description: "Engage with posts" },
  { action: "like" as const, label: "Like Content", reward: 5, xp: 10, icon: Heart, color: "text-pink-400", bg: "bg-pink-500/10 border-pink-500/20", dailyLimit: 100, description: "React to content" },
  { action: "share" as const, label: "Share Post", reward: 20, xp: 30, icon: Share2, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20", dailyLimit: 20, description: "Spread content virally" },
  { action: "watch" as const, label: "Watch Stream", reward: 10, xp: 15, icon: Play, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20", dailyLimit: 30, description: "Watch live streams" },
  { action: "login" as const, label: "Daily Login", reward: 25, xp: 50, icon: CheckCircle2, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20", dailyLimit: 1, description: "Log in every day" },
  { action: "refer" as const, label: "Refer Friend", reward: 200, xp: 500, icon: Users, color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20", dailyLimit: 5, description: "Invite new members" },
  { action: "stake" as const, label: "Stake SKY444", reward: 100, xp: 200, icon: Lock, color: "text-fuchsia-400", bg: "bg-fuchsia-500/10 border-fuchsia-500/20", dailyLimit: 3, description: "Stake tokens to earn" },
];

// Animated hash display
function HashDisplay({ hashRate }: { hashRate: number }) {
  const [hash, setHash] = useState("0x0000000000000000");
  const chars = "0123456789abcdef";
  useEffect(() => {
    if (hashRate === 0) return;
    const interval = setInterval(() => {
      const newHash = "0x" + Array.from({ length: 16 }, () => chars[Math.floor(Math.random() * 16)]).join("");
      setHash(newHash);
    }, Math.max(100, 1000 / hashRate));
    return () => clearInterval(interval);
  }, [hashRate]);
  return <span className="font-mono text-xs text-green-400 truncate">{hash}</span>;
}

// Mining progress ring
function MiningRing({ pct, size = 120 }: { pct: number; size?: number }) {
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="url(#mineGrad)" strokeWidth="8"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.5s ease" }}
      />
      <defs>
        <linearGradient id="mineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const MINE_TOKENS = [
  { symbol: "SKY444" as const, label: "SKY4444", icon: "⚡", color: "text-purple-400", desc: "Core Ecosystem Token" },
  { symbol: "DOGE" as const, label: "DOGE", icon: "🐕", color: "text-yellow-400", desc: "Community Token" },
  { symbol: "TRUMP" as const, label: "TRUMP", icon: "🇺🇸", color: "text-red-400", desc: "Governance Token" },
];

export default function CryptoMine() {
  const { isAuthenticated } = useAuth();
  const [miningAction, setMiningAction] = useState<string | null>(null);
  const [selectedToken, setSelectedToken] = useState<"SKY444" | "DOGE" | "TRUMP">("SKY444");
  const [recentRewards, setRecentRewards] = useState<Array<{ action: string; reward: number; time: Date }>>([]);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; val: number }>>([]);
  const particleId = useRef(0);

  const statsQuery = trpc.mining.stats.useQuery(undefined, {
    enabled: isAuthenticated,
    refetchInterval: 10000,
  });

  const poolQuery = trpc.mining.pool.useQuery();

  const engageMutation = trpc.mining.engage.useMutation({
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message || "Daily limit reached");
        return;
      }
      toast.success(`+${data.reward} ${selectedToken} mined!`, { description: `Action: ${data.action}` });
      setRecentRewards(prev => [{ action: data.action ?? "mine", reward: data.reward, time: new Date() }, ...prev.slice(0, 9)]);
      // Spawn reward particle
      const id = ++particleId.current;
      const x = 40 + Math.random() * 20;
      const y = 40 + Math.random() * 20;
      setParticles(prev => [...prev, { id, x, y, val: data.reward }]);
      setTimeout(() => setParticles(prev => prev.filter(p => p.id !== id)), 2000);
      statsQuery.refetch();
    },
    onError: () => toast.error("Mining failed. Please try again."),
    onSettled: () => setMiningAction(null),
  });

  const handleMine = (action: typeof MINE_ACTIONS[number]["action"]) => {
    if (!isAuthenticated) { window.location.href = getLoginUrl(); return; }
    setMiningAction(action);
    engageMutation.mutate({ action });
  };

  const stats = statsQuery.data;
  const pool = poolQuery.data as any;
  const dailyPct = stats ? Math.min(100, (stats.todayMined / stats.dailyLimit) * 100) : 0;
  const levelPct = stats ? Math.min(100, ((stats.xp % 1000) / 1000) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#07050f] text-white overflow-x-hidden">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-white/5 bg-[#07050f]/95 backdrop-blur px-4 py-3 flex items-center gap-3">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-1 text-slate-400 hover:text-white">
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Cpu className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white">{MINE_TOKENS.find(t => t.symbol === selectedToken)?.icon} {selectedToken} Crypto Mine</span>
          <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-xs animate-pulse">LIVE</Badge>
        </div>
        <div className="flex items-center gap-1 ml-2">
          {MINE_TOKENS.map(t => (
            <button
              key={t.symbol}
              onClick={() => setSelectedToken(t.symbol)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedToken === t.symbol
                  ? `bg-slate-700 ${t.color} border border-slate-600`
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        {stats && (
          <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-3 py-1.5">
            <Coins className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-bold text-yellow-300">{stats.balance.toLocaleString()} SKY444</span>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Top Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Hash Rate", value: stats ? `${stats.hashRate} H/s` : "...", icon: Activity, color: "text-green-400" },
            { label: "Mining Level", value: stats ? `Lv.${stats.miningLevel}` : "...", icon: Star, color: "text-yellow-400" },
            { label: "Total Mined", value: stats ? `${stats.totalMined.toLocaleString()}` : "...", icon: TrendingUp, color: "text-blue-400" },
            { label: "Today's Yield", value: stats ? `${stats.todayMined}/${stats.dailyLimit}` : "...", icon: Flame, color: "text-orange-400" },
          ].map(s => (
            <div key={s.label} className="bg-[#0e0a1a]/80 border border-white/5 rounded-2xl p-4 text-center">
              <s.icon className={`w-5 h-5 mx-auto mb-2 ${s.color}`} />
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Main Mining Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mining Core */}
          <div className="lg:col-span-1 bg-[#0e0a1a]/80 border border-white/5 rounded-2xl p-6 flex flex-col items-center gap-4 relative overflow-hidden">
            {/* Particles */}
            {particles.map(p => (
              <div
                key={p.id}
                className="absolute pointer-events-none text-yellow-400 font-bold text-sm animate-bounce z-10"
                style={{ left: `${p.x}%`, top: `${p.y}%`, animation: "float-up 2s ease-out forwards" }}
              >
                +{p.val} SKY
              </div>
            ))}

            <div className="relative">
              <MiningRing pct={dailyPct} size={140} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Cpu className="w-8 h-8 text-purple-400 mb-1" />
                <p className="text-xs text-slate-400">Daily</p>
                <p className="text-lg font-bold text-white">{Math.round(dailyPct)}%</p>
              </div>
            </div>

            <div className="w-full space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Today: {stats?.todayMined || 0} SKY</span>
                <span>Limit: {stats?.dailyLimit || 1000} SKY</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                  style={{ width: `${dailyPct}%` }}
                />
              </div>
            </div>

            {/* Level Progress */}
            <div className="w-full space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Level {stats?.miningLevel || 1} XP</span>
                <span>{stats?.xp ? stats.xp % 1000 : 0}/1000</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-500"
                  style={{ width: `${levelPct}%` }}
                />
              </div>
            </div>

            {/* Live Hash */}
            <div className="w-full bg-black/40 rounded-xl p-3 border border-white/5">
              <p className="text-xs text-slate-500 mb-1">Current Hash</p>
              <HashDisplay hashRate={stats?.hashRate || 0} />
            </div>

            {!isAuthenticated && (
              <Button
                onClick={() => window.location.href = getLoginUrl()}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold"
              >
                <Unlock className="w-4 h-4 mr-2" /> Login to Mine
              </Button>
            )}
          </div>

          {/* Mining Actions */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" /> Proof-of-Engagement Mining
              <span className="text-xs text-slate-500 font-normal ml-1">— Earn SKY444 by participating</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MINE_ACTIONS.map(a => (
                <button
                  key={a.action}
                  onClick={() => handleMine(a.action)}
                  disabled={engageMutation.isPending && miningAction === a.action}
                  className={`flex items-center gap-3 p-4 rounded-2xl border ${a.bg} hover:scale-[1.02] active:scale-[0.98] transition-all text-left disabled:opacity-60`}
                >
                  <div className={`w-10 h-10 rounded-xl bg-black/30 flex items-center justify-center shrink-0`}>
                    {engageMutation.isPending && miningAction === a.action ? (
                      <RefreshCw className={`w-5 h-5 ${a.color} animate-spin`} />
                    ) : (
                      <a.icon className={`w-5 h-5 ${a.color}`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{a.label}</p>
                    <p className="text-xs text-slate-500 truncate">{a.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-yellow-400">+{a.reward}</p>
                    <p className="text-[10px] text-slate-500">SKY444</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pool Info + Recent Rewards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pool Info */}
          <div className="bg-[#0e0a1a]/80 border border-white/5 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-blue-400" /> Mining Pool
            </h3>
            {pool ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Algorithm</span>
                  <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-xs">{pool.algorithm}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Total Supply</span>
                  <span className="text-xs text-white font-mono">{(pool.totalSupply || 0).toLocaleString()} SKY444</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Circulating</span>
                  <span className="text-xs text-white font-mono">{(pool.circulatingSupply || 0).toLocaleString()} SKY444</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Mining Reserve</span>
                  <span className="text-xs text-green-400 font-mono">{(pool.miningReserve || 0).toLocaleString()} SKY444</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                    style={{ width: `${Math.min(100, ((pool.circulatingSupply || 0) / (pool.totalSupply || 1)) * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500">{pool.description}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-4 bg-white/5 rounded animate-pulse" />
                ))}
              </div>
            )}
          </div>

          {/* Recent Rewards */}
          <div className="bg-[#0e0a1a]/80 border border-white/5 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-green-400" /> Recent Rewards
            </h3>
            {recentRewards.length === 0 && stats?.recentRewards && stats.recentRewards.length > 0 ? (
              <div className="space-y-2">
                {(stats.recentRewards as any[]).slice(0, 8).map((r: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 bg-white/3 rounded-xl border border-white/5">
                    <div className="w-7 h-7 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                      <Coins className="w-3.5 h-3.5 text-yellow-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white capitalize">{r.description || "Mining reward"}</p>
                      <p className="text-[10px] text-slate-500">{new Date(r.createdAt).toLocaleTimeString()}</p>
                    </div>
                    <span className="text-sm font-bold text-yellow-400">+{Number(r.amount).toFixed(0)}</span>
                  </div>
                ))}
              </div>
            ) : recentRewards.length > 0 ? (
              <div className="space-y-2">
                {recentRewards.map((r, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 bg-white/3 rounded-xl border border-white/5 animate-in slide-in-from-top-2">
                    <div className="w-7 h-7 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <ArrowUp className="w-3.5 h-3.5 text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white capitalize">{r.action}</p>
                      <p className="text-[10px] text-slate-500">{r.time.toLocaleTimeString()}</p>
                    </div>
                    <span className="text-sm font-bold text-yellow-400">+{r.reward} SKY</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
                <Coins className="w-10 h-10 text-yellow-400/30" />
                <p className="text-slate-500 text-sm">Mine SKY444 by taking actions above</p>
                <p className="text-slate-600 text-xs">Your rewards will appear here in real-time</p>
              </div>
            )}
          </div>
        </div>

        {/* Reward Schedule */}
        <div className="bg-[#0e0a1a]/80 border border-white/5 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-fuchsia-400" /> Reward Schedule
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-slate-400 font-medium pb-2 pr-4">Action</th>
                  <th className="text-right text-slate-400 font-medium pb-2 pr-4">SKY444 Reward</th>
                  <th className="text-right text-slate-400 font-medium pb-2 pr-4">XP</th>
                  <th className="text-right text-slate-400 font-medium pb-2">Daily Limit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/3">
                {MINE_ACTIONS.map(a => (
                  <tr key={a.action} className="hover:bg-white/2 transition-colors">
                    <td className="py-2 pr-4">
                      <div className="flex items-center gap-2">
                        <a.icon className={`w-3.5 h-3.5 ${a.color}`} />
                        <span className="text-white">{a.label}</span>
                      </div>
                    </td>
                    <td className="py-2 pr-4 text-right font-bold text-yellow-400">+{a.reward}</td>
                    <td className="py-2 pr-4 text-right text-blue-400">+{a.xp}</td>
                    <td className="py-2 text-right text-slate-400">{a.dailyLimit}x/day</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float-up {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-60px); }
        }
      `}</style>
    </div>
  );
}
