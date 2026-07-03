/**
 * CryptoHub — Multi-Token Trading & Mining Platform
 * Supports: BTC, SKY444, TRUMP, DOGE, USDT, XMR + ETH, SOL
 * Features: CPU Mining, Swap, Stake, Burn, Wallet, Live Prices, History
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import {
  Cpu, ArrowLeftRight, Flame, TrendingUp, Wallet, History,
  Zap, Activity, Lock, RefreshCw, ChevronUp, ChevronDown,
  AlertTriangle, CheckCircle, Clock, DollarSign, BarChart3,
} from "lucide-react";

// ─── Token Config ─────────────────────────────────────────────────────────────
const TOKENS = [
  { symbol: "SKY444", name: "SkyCoин 4444",  color: "#6366f1", bg: "bg-indigo-500/10",  border: "border-indigo-500/30", mineable: true  },
  { symbol: "BTC",    name: "Bitcoin",        color: "#f97316", bg: "bg-orange-500/10",  border: "border-orange-500/30", mineable: true  },
  { symbol: "TRUMP",  name: "TRUMP",          color: "#ef4444", bg: "bg-red-500/10",     border: "border-red-500/30",    mineable: true  },
  { symbol: "DOGE",   name: "Dogecoin",       color: "#eab308", bg: "bg-yellow-500/10",  border: "border-yellow-500/30", mineable: true  },
  { symbol: "USDT",   name: "Tether USD",     color: "#22c55e", bg: "bg-green-500/10",   border: "border-green-500/30",  mineable: true  },
  { symbol: "XMR",    name: "Monero",         color: "#f59e0b", bg: "bg-amber-500/10",   border: "border-amber-500/30",  mineable: true  },
  { symbol: "ETH",    name: "Ethereum",       color: "#8b5cf6", bg: "bg-violet-500/10",  border: "border-violet-500/30", mineable: false },
  { symbol: "SOL",    name: "Solana",         color: "#06b6d4", bg: "bg-cyan-500/10",    border: "border-cyan-500/30",   mineable: false },
] as const;

type TokenSymbol = typeof TOKENS[number]["symbol"];

// SKY444 price is set by the platform; other tokens show live oracle prices from DB
// BASE_PRICES are fallback only (used when oracle has no data yet)
const BASE_PRICES: Record<TokenSymbol, number> = {
  SKY444: 0.50, BTC: 0, TRUMP: 0, DOGE: 0,
  USDT: 1.00, XMR: 0, ETH: 0, SOL: 0,
};

const MINING_TOKENS = TOKENS.filter(t => t.mineable);

// ─── Mining difficulty labels ─────────────────────────────────────────────────
const DIFFICULTY_LABEL: Record<string, string> = {
  BTC: "Very Hard", SKY444: "Easy", TRUMP: "Medium",
  DOGE: "Easy", USDT: "Hard", XMR: "Medium",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(n: number, decimals = 4): string {
  if (n === 0) return "0";
  if (n < 0.0001) return n.toExponential(4);
  return n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: decimals });
}
function usd(balance: number, price: number): string {
  const val = balance * price;
  if (val < 0.01) return "$0.00";
  return `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function CryptoHub() {
  
  const utils = trpc.useUtils();

  // Balances
  const { data: balances, isLoading: balancesLoading } = trpc.token.allBalances.useQuery(
    undefined, { enabled: isAuthenticated, refetchInterval: 10000 }
  );
  const { data: txHistory } = trpc.token.transactions.useQuery(
    { limit: 30 }, { enabled: isAuthenticated }
  );
  // Live price oracle — fetches real price history from DB (refreshes every 60s)
  const { data: priceHistoryData } = trpc.token.priceHistory.useQuery(
    { token: "SKY444", period: "24h" }, { refetchInterval: 60000 }
  );
  // Build live price map; BASE_PRICES used as fallback for SKY444/USDT only
  const livePrices: Record<TokenSymbol, number> = { ...BASE_PRICES };
  if (Array.isArray(priceHistoryData) && priceHistoryData.length > 0) {
    const latest = priceHistoryData[priceHistoryData.length - 1] as any;
    if (latest?.price) livePrices["SKY444"] = Number(latest.price);
  }

  // ─── Mining state ────────────────────────────────────────────────────────
  const [miningToken, setMiningToken] = useState<string>("SKY444");
  const [hashPower, setHashPower] = useState(500);
  const [isMining, setIsMining] = useState(false);
  const [miningProgress, setMiningProgress] = useState(0);
  const [miningLog, setMiningLog] = useState<string[]>([]);
  const [totalMined, setTotalMined] = useState<Record<string, number>>({});
  const miningIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const mineMutation = trpc.token.mine.useMutation({
    onSuccess: (data) => {
      if (data.success && data.reward > 0) {
        const line = `[${new Date().toLocaleTimeString()}] ✅ Mined ${fmt(data.reward, 8)} ${data.token} | ${data.hashesFound.toLocaleString()} hashes | ${data.hashRate}`;
        setMiningLog(prev => [line, ...prev].slice(0, 50));
        const tok = data.token as string;
        setTotalMined(prev => ({ ...prev, [tok]: (prev[tok] ?? 0) + data.reward }));
        utils.token.allBalances.invalidate();
      } else {
        const line = `[${new Date().toLocaleTimeString()}] ⛏ Mining... ${data.hashesFound?.toLocaleString() ?? 0} hashes processed`;
        setMiningLog(prev => [line, ...prev].slice(0, 50));
      }
    },
    onError: () => {
      setMiningLog(prev => [`[${new Date().toLocaleTimeString()}] ⚠ Rate limit — cooling down...`, ...prev].slice(0, 50));
    },
  });

  const startMining = useCallback(() => {
    setIsMining(true);
    setMiningProgress(0);
    const duration = 5000;
    const start = Date.now();

    miningIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setMiningProgress(pct);

      if (elapsed >= duration) {
        clearInterval(miningIntervalRef.current!);
        mineMutation.mutate({ token: miningToken as any, hashPower, durationMs: duration });
        setMiningProgress(0);
        // Auto-restart
        setTimeout(() => {
          if (isMining) startMining();
        }, 2000);
      }
    }, 100);
  }, [miningToken, hashPower, isMining, mineMutation]);

  const stopMining = useCallback(() => {
    setIsMining(false);
    if (miningIntervalRef.current) clearInterval(miningIntervalRef.current);
    setMiningProgress(0);
  }, []);

  useEffect(() => {
    if (isMining) startMining();
    return () => { if (miningIntervalRef.current) clearInterval(miningIntervalRef.current); };
  }, [isMining]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Swap state ──────────────────────────────────────────────────────────
  const [swapFrom, setSwapFrom] = useState<TokenSymbol>("SKY444");
  const [swapTo, setSwapTo] = useState<TokenSymbol>("BTC");
  const [swapAmount, setSwapAmount] = useState("");
  const [swapSlippage, setSwapSlippage] = useState(0.5);

  const swapMutation = trpc.token.multiSwap.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success(`Swapped ${fmt(data.fromAmount ?? 0, 6)} ${data.fromToken} → ${fmt(data.toAmount ?? 0, 8)} ${data.toToken}`);
        utils.token.allBalances.invalidate();
        utils.token.transactions.invalidate();
        setSwapAmount("");
      } else {
        toast.error(data.error ?? "Swap failed");
      }
    },
  });

  const estimatedOut = swapAmount && livePrices[swapTo] > 0
    ? (parseFloat(swapAmount) * (livePrices[swapFrom] / (livePrices[swapTo] || 1)) * (1 - swapSlippage / 100)).toFixed(8)
    : "0";

  // ─── Stake state ─────────────────────────────────────────────────────────
  const [stakeToken, setStakeToken] = useState<TokenSymbol>("SKY444");
  const [stakeAmount, setStakeAmount] = useState("");
  const [stakeLock, setStakeLock] = useState<30 | 90 | 365>(30);
  const APY: Record<number, number> = { 30: 8, 90: 12, 365: 20 };

  const stakeMutation = trpc.token.multiStake.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success(`Staked ${fmt(parseFloat(stakeAmount), 4)} ${data.token} at ${data.apy}% APY for ${data.lockDays} days`);
        utils.token.allBalances.invalidate();
        setStakeAmount("");
      } else {
        toast.error(data.error ?? "Staking failed");
      }
    },
  });

  // ─── Burn state ──────────────────────────────────────────────────────────
  const [burnToken, setBurnToken] = useState<TokenSymbol>("SKY444");
  const [burnAmount, setBurnAmount] = useState("");
  const [burnReason, setBurnReason] = useState("Deflationary burn");
  const [burnConfirm, setBurnConfirm] = useState(false);

  const burnMutation = trpc.token.burn.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success(`🔥 Burned ${fmt(data.burned ?? 0, 8)} ${data.token} permanently`);
        utils.token.allBalances.invalidate();
        setBurnAmount(""); setBurnConfirm(false);
      } else {
        toast.error(data.error ?? "Burn failed");
      }
    },
  });

  // ─── Wallet totals ────────────────────────────────────────────────────────
  const balanceMap: Record<string, number> = {};
  (balances ?? []).forEach(b => { balanceMap[b.token] = b.balance; });
  const totalUSD = TOKENS.reduce((sum, t) => sum + (balanceMap[t.symbol] ?? 0) * (livePrices[t.symbol] ?? 0), 0);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Card className="bg-[#111118] border-[#1e1e2e] p-8 text-center max-w-md">
          <Wallet className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Connect to CryptoHub</h2>
          <p className="text-zinc-400 mb-6">Sign in to mine, swap, stake, and burn tokens.</p>
          <Button onClick={() => // Removed login redirect for testing} className="bg-indigo-600 hover:bg-indigo-700">
            Sign In
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* ═══ CINEMATIC CRYPTOHUB HEADER ═══ */}
      <div className="border-b border-indigo-500/20" style={{ background: 'linear-gradient(180deg, oklch(0.10 0.04 260) 0%, oklch(0.08 0.03 260) 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, oklch(0.55 0.25 260), oklch(0.65 0.28 200))', boxShadow: '0 0 24px oklch(0.55 0.25 260 / 0.4)' }}>
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-rainbow">CryptoHub</h1>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/15 border border-green-500/30">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[10px] text-green-400 font-bold">LIVE</span>
                </div>
              </div>
              <p className="text-xs text-indigo-400/70 font-medium">Mine · Swap · Stake · Burn · Bridge</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-slate-500 mb-0.5">Portfolio Value</div>
              <div className="text-2xl font-black stat-number text-green-400">
                ${totalUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Price Ticker */}
      <div className="bg-[#0d0d14] border-b border-[#1e1e2e] overflow-hidden">
        <div className="flex gap-6 px-4 py-2 overflow-x-auto scrollbar-none">
          {TOKENS.map(t => (
            <div key={t.symbol} className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold" style={{ color: t.color }}>{t.symbol}</span>
              <span className="text-xs text-zinc-300">
                {livePrices[t.symbol] > 0 ? `$${livePrices[t.symbol].toLocaleString()}` : "—"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs defaultValue="mine" className="space-y-6">
          <TabsList className="bg-[#111118] border border-[#1e1e2e] p-1 h-auto flex-wrap gap-1">
            {[
              { value: "mine",    icon: Cpu,           label: "Mine"    },
              { value: "swap",    icon: ArrowLeftRight, label: "Swap"    },
              { value: "stake",   icon: Lock,          label: "Stake"   },
              { value: "burn",    icon: Flame,         label: "Burn"    },
              { value: "wallet",  icon: Wallet,        label: "Wallet"  },
              { value: "history", icon: History,       label: "History" },
            ].map(tab => (
              <TabsTrigger key={tab.value} value={tab.value}
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-zinc-400 flex items-center gap-1.5 px-4 py-2">
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ── MINE TAB ─────────────────────────────────────────────────── */}
          <TabsContent value="mine" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Mining Control Panel */}
              <div className="lg:col-span-2 space-y-4">
                <Card className="bg-[#111118] border-[#1e1e2e]">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-indigo-400" /> CPU Mining Control
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {/* Token selector */}
                    <div>
                      <label className="text-sm text-zinc-400 mb-2 block">Select Token to Mine</label>
                      <div className="grid grid-cols-3 gap-2">
                        {MINING_TOKENS.map(t => (
                          <button key={t.symbol}
                            onClick={() => setMiningToken(t.symbol)}
                            className={`p-3 rounded-lg border text-left transition-all ${
                              miningToken === t.symbol
                                ? `${t.bg} ${t.border} border`
                                : "bg-[#0d0d14] border-[#1e1e2e] hover:border-zinc-600"
                            }`}>
                            <div className="font-bold text-sm" style={{ color: miningToken === t.symbol ? t.color : "#fff" }}>
                              {t.symbol}
                            </div>
                            <div className="text-xs text-zinc-500">{DIFFICULTY_LABEL[t.symbol]}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Hash power slider */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-zinc-400">Hash Power</span>
                        <span className="text-indigo-400 font-bold">{(hashPower / 1000).toFixed(2)} GH/s</span>
                      </div>
                        <Slider
                        value={[hashPower]}
                        onValueChange={(vals) => setHashPower(vals[0] ?? hashPower)}
                        min={10} max={10000} step={10}
                        className="w-full"
                        disabled={isMining}
                      />
                      <div className="flex justify-between text-xs text-zinc-600 mt-1">
                        <span>0.01 GH/s</span><span>10 GH/s</span>
                      </div>
                    </div>

                    {/* Mining progress */}
                    {isMining && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-400">Mining in progress...</span>
                          <span className="text-indigo-400">{miningProgress.toFixed(0)}%</span>
                        </div>
                        <Progress value={miningProgress} className="h-2" />
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                          <Activity className="w-3 h-3 text-green-400 animate-pulse" />
                          <span>Processing hashes for {miningToken} blockchain</span>
                        </div>
                      </div>
                    )}

                    {/* Start/Stop */}
                    <div className="flex gap-3">
                      {!isMining ? (
                        <Button onClick={() => setIsMining(true)}
                          className="flex-1 bg-indigo-600 hover:bg-indigo-700 font-bold">
                          <Zap className="w-4 h-4 mr-2" /> Start Mining {miningToken}
                        </Button>
                      ) : (
                        <Button onClick={stopMining} variant="destructive" className="flex-1 font-bold">
                          <Activity className="w-4 h-4 mr-2 animate-pulse" /> Stop Mining
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Mining Terminal */}
                <Card className="bg-[#0d0d14] border-[#1e1e2e]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-zinc-400 flex items-center gap-2">
                      <Activity className="w-4 h-4" /> Mining Terminal
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div ref={logRef} className="font-mono text-xs space-y-1 max-h-48 overflow-y-auto">
                      {miningLog.length === 0 ? (
                        <div className="text-zinc-600">Waiting for mining session to start...</div>
                      ) : miningLog.map((line, i) => (
                        <div key={i} className={line.includes("✅") ? "text-green-400" : line.includes("⚠") ? "text-yellow-400" : "text-zinc-500"}>
                          {line}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Mining Stats */}
              <div className="space-y-4">
                <Card className="bg-[#111118] border-[#1e1e2e]">
                  <CardHeader><CardTitle className="text-sm text-zinc-400">Session Earnings</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {MINING_TOKENS.map(t => (
                      <div key={t.symbol} className="flex justify-between items-center">
                        <span className="text-sm font-bold" style={{ color: t.color }}>{t.symbol}</span>
                        <div className="text-right">
                          <div className="text-sm text-white">{fmt(totalMined[t.symbol] ?? 0, 8)}</div>
                          <div className="text-xs text-zinc-500">{usd(totalMined[t.symbol] ?? 0, livePrices[t.symbol] ?? 0)}</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-[#111118] border-[#1e1e2e]">
                  <CardHeader><CardTitle className="text-sm text-zinc-400">Mining Info</CardTitle></CardHeader>
                  <CardContent className="space-y-2 text-xs text-zinc-400">
                    <div className="flex justify-between"><span>Algorithm</span><span className="text-white">SHA-256 (sim)</span></div>
                    <div className="flex justify-between"><span>Pool Fee</span><span className="text-white">0%</span></div>
                    <div className="flex justify-between"><span>Payout</span><span className="text-green-400">Instant</span></div>
                    <div className="flex justify-between"><span>Min Payout</span><span className="text-white">0.00000001</span></div>
                    <div className="mt-3 p-2 bg-indigo-500/10 border border-indigo-500/20 rounded text-indigo-300">
                      Mining rewards are proof-of-engagement simulations. Real blockchain mining requires dedicated hardware.
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* ── SWAP TAB ─────────────────────────────────────────────────── */}
          <TabsContent value="swap">
            <div className="max-w-lg mx-auto">
              <Card className="bg-[#111118] border-[#1e1e2e]">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <ArrowLeftRight className="w-5 h-5 text-indigo-400" /> Token Swap
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* From */}
                  <div className="space-y-2">
                    <label className="text-sm text-zinc-400">From</label>
                    <div className="flex gap-2">
                      <Select value={swapFrom} onValueChange={v => setSwapFrom(v as TokenSymbol)}>
                        <SelectTrigger className="w-36 bg-[#0d0d14] border-[#1e1e2e] text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#111118] border-[#1e1e2e]">
                          {TOKENS.map(t => (
                            <SelectItem key={t.symbol} value={t.symbol} className="text-white hover:bg-[#1e1e2e]">
                              {t.symbol}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="number" placeholder="0.00" value={swapAmount}
                        onChange={e => setSwapAmount(e.target.value)}
                        className="flex-1 bg-[#0d0d14] border-[#1e1e2e] text-white"
                      />
                    </div>
                    <div className="text-xs text-zinc-500">
                      Balance: {fmt(balanceMap[swapFrom] ?? 0, 6)} {swapFrom}
                    </div>
                  </div>

                  {/* Swap arrow */}
                  <div className="flex justify-center">
                    <button
                      onClick={() => { const tmp = swapFrom; setSwapFrom(swapTo); setSwapTo(tmp); }}
                      className="w-10 h-10 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center hover:bg-indigo-600/40 transition-colors">
                      <ArrowLeftRight className="w-4 h-4 text-indigo-400" />
                    </button>
                  </div>

                  {/* To */}
                  <div className="space-y-2">
                    <label className="text-sm text-zinc-400">To</label>
                    <div className="flex gap-2">
                      <Select value={swapTo} onValueChange={v => setSwapTo(v as TokenSymbol)}>
                        <SelectTrigger className="w-36 bg-[#0d0d14] border-[#1e1e2e] text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#111118] border-[#1e1e2e]">
                          {TOKENS.map(t => (
                            <SelectItem key={t.symbol} value={t.symbol} className="text-white hover:bg-[#1e1e2e]">
                              {t.symbol}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex-1 bg-[#0d0d14] border border-[#1e1e2e] rounded-md px-3 py-2 text-white text-sm">
                        ≈ {estimatedOut}
                      </div>
                    </div>
                    <div className="text-xs text-zinc-500">
                      Balance: {fmt(balanceMap[swapTo] ?? 0, 6)} {swapTo}
                    </div>
                  </div>

                  {/* Slippage */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Slippage Tolerance</span>
                      <span className="text-indigo-400">{swapSlippage}%</span>
                    </div>
                    <div className="flex gap-2">
                      {[0.1, 0.5, 1.0, 3.0].map(s => (
                        <button key={s} onClick={() => setSwapSlippage(s)}
                          className={`flex-1 py-1 rounded text-xs font-bold transition-colors ${
                            swapSlippage === s ? "bg-indigo-600 text-white" : "bg-[#0d0d14] text-zinc-400 hover:bg-[#1e1e2e]"
                          }`}>
                          {s}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rate info */}
                  {swapAmount && parseFloat(swapAmount) > 0 && (
                    <div className="bg-[#0d0d14] rounded-lg p-3 space-y-1 text-xs">
                      <div className="flex justify-between text-zinc-400">
                        <span>Rate</span>
                        <span className="text-white">1 {swapFrom} = {livePrices[swapTo] > 0 ? (livePrices[swapFrom] / livePrices[swapTo]).toFixed(8) : "—"} {swapTo}</span>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>Fee</span><span className="text-white">0.2%</span>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>Min Received</span>
                        <span className="text-white">{(parseFloat(estimatedOut) * (1 - swapSlippage / 100)).toFixed(8)} {swapTo}</span>
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full bg-indigo-600 hover:bg-indigo-700 font-bold"
                    disabled={!swapAmount || parseFloat(swapAmount) <= 0 || swapFrom === swapTo || swapMutation.isPending}
                    onClick={() => swapMutation.mutate({ fromToken: swapFrom as any, toToken: swapTo as any, amount: parseFloat(swapAmount), slippage: swapSlippage })}>
                    {swapMutation.isPending ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <ArrowLeftRight className="w-4 h-4 mr-2" />}
                    Swap {swapFrom} → {swapTo}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ── STAKE TAB ────────────────────────────────────────────────── */}
          <TabsContent value="stake">
            <div className="max-w-lg mx-auto">
              <Card className="bg-[#111118] border-[#1e1e2e]">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Lock className="w-5 h-5 text-indigo-400" /> Stake Tokens
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-zinc-400 mb-2 block">Token</label>
                    <Select value={stakeToken} onValueChange={v => setStakeToken(v as TokenSymbol)}>
                      <SelectTrigger className="bg-[#0d0d14] border-[#1e1e2e] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#111118] border-[#1e1e2e]">
                        {TOKENS.map(t => (
                          <SelectItem key={t.symbol} value={t.symbol} className="text-white hover:bg-[#1e1e2e]">
                            {t.symbol} — Balance: {fmt(balanceMap[t.symbol] ?? 0, 4)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm text-zinc-400 mb-2 block">Amount</label>
                    <Input type="number" placeholder="0.00" value={stakeAmount}
                      onChange={e => setStakeAmount(e.target.value)}
                      className="bg-[#0d0d14] border-[#1e1e2e] text-white" />
                    <div className="text-xs text-zinc-500 mt-1">
                      Available: {fmt(balanceMap[stakeToken] ?? 0, 6)} {stakeToken}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-zinc-400 mb-2 block">Lock Period</label>
                    <div className="grid grid-cols-3 gap-2">
                      {([30, 90, 365] as const).map(days => (
                        <button key={days} onClick={() => setStakeLock(days)}
                          className={`p-3 rounded-lg border text-center transition-all ${
                            stakeLock === days
                              ? "bg-indigo-600/20 border-indigo-500/50"
                              : "bg-[#0d0d14] border-[#1e1e2e] hover:border-zinc-600"
                          }`}>
                          <div className="text-sm font-bold text-white">{days}d</div>
                          <div className="text-xs text-indigo-400">{APY[days]}% APY</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {stakeAmount && parseFloat(stakeAmount) > 0 && (
                    <div className="bg-[#0d0d14] rounded-lg p-3 space-y-1 text-xs">
                      <div className="flex justify-between text-zinc-400">
                        <span>Estimated Reward</span>
                        <span className="text-green-400">
                          +{fmt(parseFloat(stakeAmount) * APY[stakeLock] / 100 * (stakeLock / 365), 6)} {stakeToken}
                        </span>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>Unlock Date</span>
                        <span className="text-white">
                          {new Date(Date.now() + stakeLock * 86400000).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full bg-indigo-600 hover:bg-indigo-700 font-bold"
                    disabled={!stakeAmount || parseFloat(stakeAmount) <= 0 || stakeMutation.isPending}
                    onClick={() => stakeMutation.mutate({ token: stakeToken as any, amount: parseFloat(stakeAmount), lockDays: stakeLock })}>
                    {stakeMutation.isPending ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
                    Stake {stakeToken} for {stakeLock} Days
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ── BURN TAB ─────────────────────────────────────────────────── */}
          <TabsContent value="burn">
            <div className="max-w-lg mx-auto">
              <Card className="bg-[#111118] border-[#1e1e2e]">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Flame className="w-5 h-5 text-red-400" /> Burn Tokens
                    <Badge className="bg-red-500/10 text-red-400 border-red-500/30 text-xs ml-auto">Irreversible</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-red-300">
                      Burning permanently removes tokens from circulation. This action cannot be undone.
                      Burning reduces supply and may increase token value.
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-zinc-400 mb-2 block">Token to Burn</label>
                    <Select value={burnToken} onValueChange={v => setBurnToken(v as TokenSymbol)}>
                      <SelectTrigger className="bg-[#0d0d14] border-[#1e1e2e] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#111118] border-[#1e1e2e]">
                        {TOKENS.map(t => (
                          <SelectItem key={t.symbol} value={t.symbol} className="text-white hover:bg-[#1e1e2e]">
                            {t.symbol} — {fmt(balanceMap[t.symbol] ?? 0, 4)} available
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm text-zinc-400 mb-2 block">Amount</label>
                    <Input type="number" placeholder="0.00" value={burnAmount}
                      onChange={e => setBurnAmount(e.target.value)}
                      className="bg-[#0d0d14] border-[#1e1e2e] text-white" />
                  </div>

                  <div>
                    <label className="text-sm text-zinc-400 mb-2 block">Reason</label>
                    <Input placeholder="Deflationary burn" value={burnReason}
                      onChange={e => setBurnReason(e.target.value)}
                      className="bg-[#0d0d14] border-[#1e1e2e] text-white" />
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={burnConfirm} onChange={e => setBurnConfirm(e.target.checked)}
                      className="w-4 h-4 accent-red-500" />
                    <span className="text-sm text-zinc-400">I understand this action is permanent and irreversible</span>
                  </label>

                  <Button
                    variant="destructive"
                    className="w-full font-bold"
                    disabled={!burnAmount || parseFloat(burnAmount) <= 0 || !burnConfirm || burnMutation.isPending}
                    onClick={() => burnMutation.mutate({ token: burnToken as any, amount: parseFloat(burnAmount), reason: burnReason })}>
                    {burnMutation.isPending ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Flame className="w-4 h-4 mr-2" />}
                    Burn {burnAmount || "0"} {burnToken}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ── WALLET TAB ───────────────────────────────────────────────── */}
          <TabsContent value="wallet">
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Card className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border-indigo-500/30 md:col-span-2">
                  <CardContent className="p-4">
                    <div className="text-sm text-zinc-400">Total Portfolio</div>
                    <div className="text-3xl font-bold text-white mt-1">
                      ${totalUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-xs text-green-400 mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> All tokens combined
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-[#111118] border-[#1e1e2e]">
                  <CardContent className="p-4">
                    <div className="text-sm text-zinc-400">Tokens Held</div>
                    <div className="text-2xl font-bold text-white mt-1">
                      {(balances ?? []).filter(b => b.balance > 0).length}
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">of {TOKENS.length} supported</div>
                  </CardContent>
                </Card>
                <Card className="bg-[#111118] border-[#1e1e2e]">
                  <CardContent className="p-4">
                    <div className="text-sm text-zinc-400">Staked Value</div>
                    <div className="text-2xl font-bold text-indigo-400 mt-1">
                      ${(balances ?? []).reduce((s, b) => s + b.stakedBalance * (livePrices[b.token as TokenSymbol] ?? 0), 0).toFixed(2)}
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">earning rewards</div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {TOKENS.map(t => {
                  const bal = balanceMap[t.symbol] ?? 0;
                  const val = bal * (livePrices[t.symbol] ?? 0);
                  const pct = totalUSD > 0 ? (val / totalUSD) * 100 : 0;
                  return (
                    <Card key={t.symbol} className={`bg-[#111118] border-[#1e1e2e] hover:${t.border} transition-colors`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full ${t.bg} border ${t.border} flex items-center justify-center`}>
                              <span className="text-xs font-bold" style={{ color: t.color }}>{t.symbol.slice(0, 2)}</span>
                            </div>
                            <div>
                              <div className="font-bold text-white text-sm">{t.symbol}</div>
                              <div className="text-xs text-zinc-500">{t.name}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-white">{fmt(bal, 6)}</div>
                            <div className="text-xs text-zinc-400">{usd(bal, livePrices[t.symbol] ?? 0)}</div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-zinc-500">
                            <span>Portfolio share</span>
                            <span>{pct.toFixed(1)}%</span>
                          </div>
                          <Progress value={pct} className="h-1" />
                        </div>
                        {t.mineable && (
                          <Badge className={`mt-2 ${t.bg} text-xs`} style={{ color: t.color, borderColor: t.color + "40" }}>
                            <Cpu className="w-3 h-3 mr-1" /> Mineable
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* ── HISTORY TAB ──────────────────────────────────────────────── */}
          <TabsContent value="history">
            <Card className="bg-[#111118] border-[#1e1e2e]">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-indigo-400" /> Transaction History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!txHistory || txHistory.length === 0 ? (
                  <div className="text-center py-12 text-zinc-500">
                    <History className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p>No transactions yet. Start mining or swapping!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {txHistory.map((tx: any, i: number) => {
                      const typeConfig: Record<string, { icon: any; color: string; label: string }> = {
                        reward: { icon: Cpu,           color: "text-green-400",  label: "Mined"    },
                        swap:   { icon: ArrowLeftRight, color: "text-indigo-400", label: "Swapped"  },
                        stake:  { icon: Lock,           color: "text-purple-400", label: "Staked"   },
                        burn:   { icon: Flame,          color: "text-red-400",    label: "Burned"   },
                        transfer: { icon: DollarSign,   color: "text-yellow-400", label: "Transfer" },
                      };
                      const cfg = typeConfig[tx.type] ?? typeConfig.transfer;
                      const Icon = cfg.icon;
                      return (
                        <div key={i} className="flex items-center gap-3 p-3 bg-[#0d0d14] rounded-lg hover:bg-[#111118] transition-colors">
                          <div className={`w-8 h-8 rounded-full bg-[#1e1e2e] flex items-center justify-center shrink-0`}>
                            <Icon className={`w-4 h-4 ${cfg.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-bold ${cfg.color}`}>{cfg.label}</span>
                              <Badge className="bg-[#1e1e2e] text-zinc-400 text-xs border-0">{tx.token}</Badge>
                            </div>
                            <div className="text-xs text-zinc-500 truncate">{tx.metadata?.description ?? tx.type}</div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-sm font-bold text-white">{fmt(Math.abs(Number(tx.amount)), 8)}</div>
                            <div className="text-xs text-zinc-500">
                              {tx.createdAt ? new Date(tx.createdAt).toLocaleString() : ""}
                            </div>
                          </div>
                          <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
