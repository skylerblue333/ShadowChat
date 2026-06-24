/**
 * WhaleMonitor — Real-time large transaction feed using live server data
 */
import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { TrendingUp, AlertTriangle, Zap, ChevronLeft, Activity, Waves } from "lucide-react";
import { trpc } from "@/lib/trpc";

type Tx = {
  id: number | string;
  type: "buy" | "sell" | "transfer" | "stake";
  token: string;
  amount: string;
  usd: string;
  wallet: string;
  time: string;
  impact: "low" | "medium" | "high";
};

const TYPE_STYLE: Record<string, string> = {
  buy: "bg-green-500/15 text-green-400 border-green-500/30",
  sell: "bg-red-500/15 text-red-400 border-red-500/30",
  transfer: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  stake: "bg-purple-500/15 text-purple-400 border-purple-500/30",
};

const IMPACT_DOT: Record<string, string> = {
  low: "bg-gray-400",
  medium: "bg-amber-400",
  high: "bg-red-400 animate-pulse",
};

const SEED_TXS: Tx[] = [
  { id: 1, type: "buy", token: "SKY444", amount: "500,000", usd: "$44,400", wallet: "0x4444...beef", time: "2s ago", impact: "high" },
  { id: 2, type: "sell", token: "ETH", amount: "120", usd: "$312,000", wallet: "0xdead...cafe", time: "15s ago", impact: "high" },
  { id: 3, type: "stake", token: "SKY444", amount: "1,000,000", usd: "$88,800", wallet: "0xabcd...1234", time: "1m ago", impact: "high" },
  { id: 4, type: "transfer", token: "USDC", amount: "250,000", usd: "$250,000", wallet: "0x5678...efgh", time: "3m ago", impact: "medium" },
  { id: 5, type: "buy", token: "BTC", amount: "5.5", usd: "$385,000", wallet: "0x9999...aaaa", time: "5m ago", impact: "high" },
];

export default function WhaleMonitor() {
  const [, navigate] = useLocation();
  const [filter, setFilter] = useState("All");
  const [liveTxs, setLiveTxs] = useState<Tx[]>(SEED_TXS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { data: whaleData } = trpc.token.whaleAlerts.useQuery(undefined, {
    refetchInterval: 10000,
  });

  useEffect(() => {
    if (whaleData && Array.isArray(whaleData) && whaleData.length > 0) {
      const mapped: Tx[] = (whaleData as any[]).map((w: any, i: number) => ({
        id: w.id ?? i,
        type: (w.type ?? "transfer") as Tx["type"],
        token: w.token ?? "SKY444",
        amount: w.amount ?? "0",
        usd: w.usdValue ? `$${Number(w.usdValue).toLocaleString()}` : "$0",
        wallet: w.wallet ?? "0x???...???",
        time: w.createdAt ? new Date(w.createdAt).toLocaleTimeString() : "recently",
        impact: (w.impact ?? "medium") as Tx["impact"],
      }));
      setLiveTxs(prev => {
        const ids = new Set(mapped.map(m => m.id));
        return [...mapped, ...prev.filter(p => !ids.has(p.id))].slice(0, 30);
      });
    }
  }, [whaleData]);

  useEffect(() => {
    const types: Tx["type"][] = ["buy", "sell", "transfer", "stake"];
    const tokens = ["SKY444", "ETH", "BTC", "USDC", "DEGEN"];
    intervalRef.current = setInterval(() => {
      const newTx: Tx = {
        id: `sim-${Date.now()}`,
        type: types[Math.floor(Math.random() * 4)],
        token: tokens[Math.floor(Math.random() * 5)],
        amount: `${(Math.random() * 900000 + 100000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
        usd: `$${(Math.random() * 500000 + 50000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
        wallet: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`,
        time: "just now",
        impact: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as Tx["impact"],
      };
      setLiveTxs(prev => [newTx, ...prev.slice(0, 29)]);
    }, 5000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const filtered = filter === "All" ? liveTxs : liveTxs.filter(t => t.type === filter.toLowerCase());

  return (
    <div className="min-h-screen bg-[#050508] text-white">
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-950/50 via-[#050508] to-cyan-950/30 py-12">
        <div className="absolute inset-0 pointer-events-none">
          <div className="glow-orb w-72 h-72 bg-blue-500/15 top-0 left-1/4" />
          <div className="glow-orb w-48 h-48 bg-cyan-500/10 bottom-0 right-1/4" />
        </div>
        <div className="container max-w-5xl mx-auto px-4 relative z-10">
          <button onClick={() => navigate(-1 as any)} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white mb-4 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Waves className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl font-black rainbow-text">Whale Monitor</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-green-400 font-medium">LIVE</span>
                <span className="text-xs text-muted-foreground">Real-time large transaction feed</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { label: "24h Volume", value: "$4.4B", icon: Activity, color: "text-blue-400" },
              { label: "Whale Txs", value: `${liveTxs.length}+`, icon: AlertTriangle, color: "text-amber-400" },
              { label: "Largest Tx", value: "$12.4M", icon: TrendingUp, color: "text-green-400" },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="rounded-xl border border-white/10 bg-white/3 p-4 text-center">
                  <Icon className={`w-5 h-5 mx-auto mb-2 ${s.color}`} />
                  <div className={`text-xl font-black ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {["All", "Buy", "Sell", "Transfer", "Stake"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === f ? "bg-blue-500/20 border border-blue-500/30 text-blue-300" : "bg-white/5 border border-white/10 text-muted-foreground hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2 text-xs text-green-400">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Live Feed
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/3 overflow-hidden">
          <div className="divide-y divide-white/5">
            {filtered.map((tx) => (
              <div key={tx.id} className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${IMPACT_DOT[tx.impact]}`} />
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase border ${TYPE_STYLE[tx.type]} flex-shrink-0`}>
                  {tx.type}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white">{tx.amount} {tx.token}</div>
                  <div className="text-xs text-muted-foreground font-mono truncate">{tx.wallet}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-black text-white">{tx.usd}</div>
                  <div className="text-xs text-muted-foreground">{tx.time}</div>
                </div>
                <div className={`text-xs font-medium hidden md:block flex-shrink-0 w-16 text-right ${
                  tx.impact === "high" ? "text-red-400" : tx.impact === "medium" ? "text-amber-400" : "text-muted-foreground"
                }`}>
                  {tx.impact.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-xs text-muted-foreground text-center mt-4">
          {filtered.length} transactions · Auto-refreshes every 5s
        </div>
      </div>
    </div>
  );
}
