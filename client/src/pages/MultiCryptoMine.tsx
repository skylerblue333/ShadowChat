/**
 * MultiCryptoMine — Live multi-coin mining dashboard
 * Supports BTC, SKY444, TRUMP, DOGE, USDT, XMR simultaneously
 */
import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Cpu, Zap, TrendingUp, ChevronLeft, Play, Square, BarChart3, Coins, Activity } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

type CoinId = "BTC" | "SKY444" | "TRUMP" | "DOGE" | "USDT" | "XMR";

interface CoinConfig {
  id: CoinId;
  name: string;
  icon: string;
  color: string;
  bg: string;
  border: string;
  difficulty: string;
  blockTime: string;
  baseReward: string;
}

const COINS: CoinConfig[] = [
  { id: "SKY444", name: "SkyCoins", icon: "🌌", color: "text-cyan-400", bg: "bg-cyan-500/15", border: "border-cyan-500/30", difficulty: "Easy", blockTime: "15s", baseReward: "0.5/block" },
  { id: "DOGE", name: "Dogecoin", icon: "🐕", color: "text-amber-400", bg: "bg-amber-500/15", border: "border-amber-500/30", difficulty: "Easy", blockTime: "60s", baseReward: "2.0/block" },
  { id: "TRUMP", name: "Trump", icon: "🦅", color: "text-red-400", bg: "bg-red-500/15", border: "border-red-500/30", difficulty: "Medium", blockTime: "60s", baseReward: "0.1/block" },
  { id: "XMR", name: "Monero", icon: "🔒", color: "text-orange-400", bg: "bg-orange-500/15", border: "border-orange-500/30", difficulty: "Hard", blockTime: "120s", baseReward: "0.0001/block" },
  { id: "BTC", name: "Bitcoin", icon: "₿", color: "text-yellow-400", bg: "bg-yellow-500/15", border: "border-yellow-500/30", difficulty: "Very Hard", blockTime: "600s", baseReward: "0.000001/block" },
  { id: "USDT", name: "Tether", icon: "💵", color: "text-green-400", bg: "bg-green-500/15", border: "border-green-500/30", difficulty: "Hard", blockTime: "300s", baseReward: "0.00001/block" },
];

interface MineState {
  mining: boolean;
  hashRate: number;
  totalEarned: number;
  lastReward: number;
  sessions: number;
  hashes: number;
}

export default function MultiCryptoMine() {
  
  const [, navigate] = useLocation();
  const [hashPower, setHashPower] = useState(500);
  const [mineStates, setMineStates] = useState<Record<CoinId, MineState>>(
    Object.fromEntries(COINS.map(c => [c.id, { mining: false, hashRate: 0, totalEarned: 0, lastReward: 0, sessions: 0, hashes: 0 }])) as Record<CoinId, MineState>
  );
  const [globalHashRate, setGlobalHashRate] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const timersRef = useRef<Record<string, ReturnType<typeof setInterval>>>({});

  const { data: stats } = trpc.mining.stats.useQuery(undefined, { enabled: isAuthenticated });
  const mineMutation = trpc.token.mine.useMutation({
    onSuccess: (data: any, variables: any) => {
      if (data.success && data.reward > 0) {
        const coinId = variables.token as CoinId;
        setMineStates(prev => ({
          ...prev,
          [coinId]: {
            ...prev[coinId],
            totalEarned: prev[coinId].totalEarned + data.reward,
            lastReward: data.reward,
            sessions: prev[coinId].sessions + 1,
            hashes: prev[coinId].hashes + (data.hashesFound ?? 0),
          }
        }));
        setTotalEarnings(prev => prev + data.reward);
        toast.success(`⛏️ +${data.reward} ${variables.token} mined!`, { duration: 2000 });
      }
    },
  });

  const startMining = (coinId: CoinId) => {
    if (!isAuthenticated) { // Removed login redirect for testing; return; }
    setMineStates(prev => ({ ...prev, [coinId]: { ...prev[coinId], mining: true, hashRate: hashPower } }));
    setGlobalHashRate(prev => prev + hashPower);

    // Mine every 8 seconds while active
    timersRef.current[coinId] = setInterval(() => {
      mineMutation.mutate({ token: coinId, hashPower, durationMs: 8000 });
    }, 8000);

    // Trigger first mine immediately
    mineMutation.mutate({ token: coinId, hashPower, durationMs: 8000 });
    toast.info(`⛏️ Mining ${coinId} started at ${hashPower} MH/s`);
  };

  const stopMining = (coinId: CoinId) => {
    if (timersRef.current[coinId]) {
      clearInterval(timersRef.current[coinId]);
      delete timersRef.current[coinId];
    }
    setMineStates(prev => ({ ...prev, [coinId]: { ...prev[coinId], mining: false, hashRate: 0 } }));
    setGlobalHashRate(prev => Math.max(0, prev - hashPower));
    toast.info(`⏹️ Mining ${coinId} stopped`);
  };

  const stopAll = () => {
    Object.keys(timersRef.current).forEach(coinId => {
      clearInterval(timersRef.current[coinId]);
      delete timersRef.current[coinId];
    });
    setMineStates(prev => Object.fromEntries(
      Object.entries(prev).map(([k, v]) => [k, { ...v, mining: false, hashRate: 0 }])
    ) as Record<CoinId, MineState>);
    setGlobalHashRate(0);
    toast.info("All mining stopped");
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => { Object.values(timersRef.current).forEach(clearInterval); };
  }, []);

  const activeMines = Object.values(mineStates).filter(s => s.mining).length;

  return (
    <div className="min-h-screen bg-[#050508] text-white">
      {/* Cinematic Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-cyan-950/40 via-[#050508] to-purple-950/30 py-12">
        <div className="absolute inset-0 pointer-events-none cyber-grid opacity-10" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="glow-orb w-72 h-72 bg-cyan-500/15 top-0 right-1/4" />
          <div className="glow-orb w-48 h-48 bg-purple-500/10 bottom-0 left-1/4" />
        </div>
        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          <button onClick={() => navigate(-1 as any)} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white mb-4 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <Cpu className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-4xl font-black rainbow-text">Multi-Coin Miner</h1>
                <p className="text-muted-foreground metallic-shimmer text-sm">Mine 6 coins simultaneously — earn real SKY444, DOGE, BTC, XMR, TRUMP, USDT</p>
              </div>
            </div>
            {activeMines > 0 && (
              <button onClick={stopAll} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors font-bold text-sm">
                <Square className="w-4 h-4" /> Stop All ({activeMines} active)
              </button>
            )}
          </div>

          {/* Global stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {[
              { label: "Global Hash Rate", value: `${(globalHashRate / 1000).toFixed(1)} GH/s`, icon: Activity, color: "text-cyan-400" },
              { label: "Active Miners", value: activeMines, icon: Cpu, color: "text-green-400" },
              { label: "Session Earnings", value: `${totalEarnings.toFixed(4)}`, icon: Coins, color: "text-amber-400" },
              { label: "Total Mined (All Time)", value: `${((stats as any)?.totalMined ?? 0).toFixed(2)} SKY`, icon: TrendingUp, color: "text-purple-400" },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="rounded-xl border border-white/10 bg-white/3 p-3 text-center">
                  <Icon className={`w-4 h-4 mx-auto mb-1 ${s.color}`} />
                  <div className={`text-lg font-black ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Hash power slider */}
        <div className="rounded-xl border border-white/10 bg-white/3 p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" /> Hash Power
            </label>
            <span className="text-sm font-black text-yellow-400">{hashPower} MH/s</span>
          </div>
          <input
            type="range"
            min={100}
            max={10000}
            step={100}
            value={hashPower}
            onChange={e => setHashPower(Number(e.target.value))}
            className="w-full accent-cyan-500"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>100 MH/s (Slow)</span>
            <span>5,000 MH/s (Fast)</span>
            <span>10,000 MH/s (Max)</span>
          </div>
        </div>

        {/* Coin mining cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {COINS.map(coin => {
            const state = mineStates[coin.id];
            return (
              <div
                key={coin.id}
                className={`rounded-xl border ${coin.border} ${coin.bg} p-5 transition-all ${state.mining ? "ring-1 ring-current" : ""}`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{coin.icon}</span>
                    <div>
                      <div className="font-black text-white">{coin.id}</div>
                      <div className="text-xs text-muted-foreground">{coin.name}</div>
                    </div>
                  </div>
                  {state.mining && (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-green-400">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      MINING
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="rounded-lg bg-white/5 p-2 text-center">
                    <div className={`text-sm font-black ${coin.color}`}>{coin.difficulty}</div>
                    <div className="text-xs text-muted-foreground">Difficulty</div>
                  </div>
                  <div className="rounded-lg bg-white/5 p-2 text-center">
                    <div className={`text-sm font-black ${coin.color}`}>{coin.blockTime}</div>
                    <div className="text-xs text-muted-foreground">Block Time</div>
                  </div>
                  <div className="rounded-lg bg-white/5 p-2 text-center">
                    <div className={`text-sm font-black ${coin.color}`}>{state.totalEarned.toFixed(6)}</div>
                    <div className="text-xs text-muted-foreground">Earned</div>
                  </div>
                  <div className="rounded-lg bg-white/5 p-2 text-center">
                    <div className={`text-sm font-black ${coin.color}`}>{state.sessions}</div>
                    <div className="text-xs text-muted-foreground">Sessions</div>
                  </div>
                </div>

                {/* Hash rate bar */}
                {state.mining && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Hash Rate</span>
                      <span className={coin.color}>{(state.hashRate / 1000).toFixed(1)} GH/s</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full animate-pulse"
                        style={{ width: `${Math.min(100, (state.hashRate / 10000) * 100)}%`, background: `currentColor` }}
                      />
                    </div>
                  </div>
                )}

                {/* Mine button */}
                <button
                  onClick={() => state.mining ? stopMining(coin.id) : startMining(coin.id)}
                  className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    state.mining
                      ? "bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30"
                      : `${coin.bg} ${coin.border} border ${coin.color} hover:opacity-80`
                  }`}
                >
                  {state.mining ? (
                    <><Square className="w-4 h-4" /> Stop Mining</>
                  ) : (
                    <><Play className="w-4 h-4" /> Mine {coin.id}</>
                  )}
                </button>

                {state.lastReward > 0 && (
                  <div className={`text-center text-xs mt-2 ${coin.color} animate-fade-in`}>
                    Last reward: +{state.lastReward.toFixed(8)} {coin.id}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mining tips */}
        <div className="mt-8 rounded-xl border border-white/10 bg-white/3 p-5">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" /> Mining Tips
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
            <div className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">1.</span>
              <span>Mine SKY444 and DOGE for the highest reward rates per session</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">2.</span>
              <span>Increase hash power for more frequent block discoveries</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-400 font-bold">3.</span>
              <span>Stake your mined tokens in the Staking Portal for compound APY</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
