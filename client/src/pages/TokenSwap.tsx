import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import {
  ArrowDownUp, Coins, TrendingUp, AlertTriangle, Zap, Shield,
  RefreshCw, BarChart3, Activity, Wallet, Clock, ChevronDown,
  CheckCircle2, Info, Flame
} from "lucide-react";
import { trpc } from "@/lib/trpc";

const TOKENS = [
  { symbol: "SKY444", name: "SKYCOIN4444", icon: "⚡", color: "text-purple-400" },
  { symbol: "DOGE", name: "Dogecoin", icon: "🐕", color: "text-yellow-400" },
  { symbol: "TRUMP", name: "TRUMP Token", icon: "🇺🇸", color: "text-red-400" },
  { symbol: "ETH", name: "Ethereum", icon: "Ξ", color: "text-blue-400" },
  { symbol: "BTC", name: "Bitcoin", icon: "₿", color: "text-orange-400" },
  { symbol: "USDT", name: "Tether", icon: "₮", color: "text-green-400" },
  { symbol: "SOL", name: "Solana", icon: "◎", color: "text-cyan-400" },
  { symbol: "XMR", name: "Monero", icon: "ɱ", color: "text-orange-300" },
];

function TokenSelector({ value, onChange, exclude }: { value: string; onChange: (v: string) => void; exclude: string }) {
  const [open, setOpen] = useState(false);
  const token = TOKENS.find(t => t.symbol === value);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700/50 hover:border-purple-500/40 transition-all"
      >
        <span className={`text-lg font-bold ${token?.color}`}>{token?.icon}</span>
        <span className="font-semibold text-white text-sm">{value}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-slate-900/98 border border-slate-700/60 rounded-xl shadow-2xl z-50 overflow-hidden">
          {TOKENS.filter(t => t.symbol !== exclude).map(t => (
            <button
              key={t.symbol}
              onClick={() => { onChange(t.symbol); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-800/80 transition-colors text-left ${t.symbol === value ? "bg-purple-500/10" : ""}`}
            >
              <span className={`text-base font-bold ${t.color}`}>{t.icon}</span>
              <div>
                <p className="text-sm font-medium text-white">{t.symbol}</p>
                <p className="text-xs text-slate-500">{t.name}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TokenSwap() {
  const { isAuthenticated } = useAuth();
  const { data: tokenMetrics } = trpc.token.metrics.useQuery();
  const [fromToken, setFromToken] = useState("USDT");
  const [toToken, setToToken] = useState("SKY444");
  const [fromAmount, setFromAmount] = useState("");
  const [slippage, setSlippage] = useState(0.5);
  const [customSlippage, setCustomSlippage] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  // Real swap quote from tRPC
  const { data: quoteData, isLoading: quoteLoading, refetch: refetchQuote } = trpc.token.swapQuote.useQuery(
    { inputToken: fromToken, outputToken: toToken, inputAmount: parseFloat(fromAmount) || 0, slippage },
    { enabled: !!fromAmount && parseFloat(fromAmount) > 0, refetchInterval: 10000 }
  );

  const swapMutation = trpc.token.executeSwap.useMutation({
    onSuccess: () => {
      toast.success(`Swap executed successfully!`);
      setFromAmount("");
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSwapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount("");
  };

  const handleSwap = () => {
    if (!isAuthenticated) { window.location.href = getLoginUrl(); return; }
    if (!fromAmount || parseFloat(fromAmount) <= 0) { toast.error("Enter an amount"); return; }
    swapMutation.mutate({
      inputToken: fromToken,
      outputToken: toToken,
      inputAmount: parseFloat(fromAmount),
      minOutputAmount: (quoteData?.outputAmount ?? 0) * (1 - slippage / 100),
      slippage,
    });
  };

  const outputAmount = quoteData?.outputAmount ?? 0;
  const priceImpact = quoteData?.priceImpact ?? 0;
  const fee = quoteData?.fee ?? 0;
  const rate = outputAmount && parseFloat(fromAmount) > 0 ? (outputAmount / parseFloat(fromAmount)).toFixed(6) : "—";

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at top, oklch(0.25 0.08 305 / 0.4) 0%, transparent 60%)" }} />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            VOTE #1 PASSED — DOGE &amp; TRUMP now available for swap
          </div>
          <Badge className="mb-4 border-purple-500/40 text-purple-300 bg-purple-500/10">
            <Zap className="w-3 h-3 mr-1" /> DEX Swap Engine
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black mb-4" style={{ background: "linear-gradient(135deg, oklch(0.85 0.25 305), oklch(0.80 0.25 340), oklch(0.80 0.20 200))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Token Swap
          </h1>
          <p className="text-slate-400 text-lg">Instant token swaps with real-time quotes and slippage protection</p>
        </div>
      </section>

      {/* Main Swap Interface */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Swap Card */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-sm overflow-hidden">
              {/* Card Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/40">
                <h2 className="font-bold text-white flex items-center gap-2">
                  <ArrowDownUp className="w-4 h-4 text-purple-400" /> Swap
                </h2>
                <div className="flex items-center gap-2">
                  <button onClick={() => refetchQuote()} className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors">
                    <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${quoteLoading ? "animate-spin" : ""}`} />
                  </button>
                  <button onClick={() => setShowSettings(!showSettings)} className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors">
                    <Shield className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-3">
                {/* Slippage Settings */}
                {showSettings && (
                  <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/40 space-y-3">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Slippage Tolerance</p>
                    <div className="flex items-center gap-2">
                      {[0.1, 0.5, 1.0, 3.0].map(s => (
                        <button
                          key={s}
                          onClick={() => setSlippage(s)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${slippage === s ? "bg-purple-500/20 text-purple-300 border border-purple-500/40" : "bg-slate-700/50 text-slate-400 hover:text-white border border-transparent"}`}
                        >
                          {s}%
                        </button>
                      ))}
                      <div className="flex items-center gap-1 flex-1">
                        <Input
                          value={customSlippage}
                          onChange={e => { setCustomSlippage(e.target.value); if (parseFloat(e.target.value) > 0) setSlippage(parseFloat(e.target.value)); }}
                          placeholder="Custom"
                          className="h-8 text-xs bg-slate-700/50 border-slate-600/50"
                        />
                        <span className="text-xs text-slate-400">%</span>
                      </div>
                    </div>
                    {slippage > 5 && (
                      <div className="flex items-center gap-2 text-yellow-400 text-xs">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        High slippage — your transaction may be frontrun
                      </div>
                    )}
                  </div>
                )}

                {/* From Token */}
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">You pay</span>
                    <span className="text-xs text-slate-500">Balance: —</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Input
                      value={fromAmount}
                      onChange={e => setFromAmount(e.target.value)}
                      placeholder="0.00"
                      type="number"
                      min="0"
                      className="flex-1 text-2xl font-bold bg-transparent border-none p-0 h-auto text-white placeholder-slate-600 focus-visible:ring-0"
                    />
                    <TokenSelector value={fromToken} onChange={setFromToken} exclude={toToken} />
                  </div>
                  {fromAmount && (
                    <p className="text-xs text-slate-500">≈ ${(parseFloat(fromAmount) || 0).toFixed(2)} USD</p>
                  )}
                </div>

                {/* Swap Button */}
                <div className="flex justify-center">
                  <button
                    onClick={handleSwapTokens}
                    className="p-2.5 rounded-xl bg-slate-800 border border-slate-700/50 hover:border-purple-500/40 hover:bg-slate-700/80 transition-all group"
                  >
                    <ArrowDownUp className="w-4 h-4 text-slate-400 group-hover:text-purple-400 transition-colors" />
                  </button>
                </div>

                {/* To Token */}
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">You receive</span>
                    <span className="text-xs text-slate-500">Balance: —</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 text-2xl font-bold text-white">
                      {quoteLoading ? (
                        <span className="text-slate-500 animate-pulse">Fetching...</span>
                      ) : outputAmount > 0 ? (
                        <span className="text-purple-300">{outputAmount.toFixed(6)}</span>
                      ) : (
                        <span className="text-slate-600">0.00</span>
                      )}
                    </div>
                    <TokenSelector value={toToken} onChange={setToToken} exclude={fromToken} />
                  </div>
                </div>

                {/* Quote Details */}
                {outputAmount > 0 && (
                  <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/30 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Rate</span>
                      <span className="text-white">1 {fromToken} = {rate} {toToken}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Price Impact</span>
                      <span className={priceImpact > 3 ? "text-red-400" : priceImpact > 1 ? "text-yellow-400" : "text-green-400"}>
                        {priceImpact.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Network Fee</span>
                      <span className="text-white">{fee.toFixed(4)} {fromToken}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Slippage</span>
                      <span className="text-white">{slippage}%</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Min. Received</span>
                      <span className="text-white">{(outputAmount * (1 - slippage / 100)).toFixed(6)} {toToken}</span>
                    </div>
                  </div>
                )}

                {/* Swap Action */}
                <Button
                  onClick={handleSwap}
                  disabled={swapMutation.isPending || !fromAmount || parseFloat(fromAmount) <= 0}
                  className="w-full h-12 text-base font-bold rounded-xl"
                  style={{ background: "linear-gradient(135deg, oklch(0.72 0.28 305), oklch(0.72 0.28 340))" }}
                >
                  {swapMutation.isPending ? (
                    <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Swapping...</>
                  ) : !isAuthenticated ? (
                    "Connect to Swap"
                  ) : !fromAmount ? (
                    "Enter Amount"
                  ) : (
                    <><Zap className="w-4 h-4 mr-2" /> Swap {fromToken} → {toToken}</>
                  )}
                </Button>

                {!isAuthenticated && (
                  <p className="text-center text-xs text-slate-500">
                    <a href={getLoginUrl()} className="text-purple-400 hover:underline">Sign in</a> to execute swaps
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-4">
            {/* Token Metrics */}
            <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-4 space-y-3">
              <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-yellow-400" /> SKY444 Metrics
              </h3>
              {tokenMetrics ? (
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Supply</span>
                    <span className="text-white font-mono">{(tokenMetrics.totalSupply / 1e9).toFixed(2)}B</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Circulating</span>
                    <span className="text-white font-mono">{(tokenMetrics.circulatingSupply / 1e9).toFixed(2)}B</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Staking Ratio</span>
                    <span className="text-purple-400 font-mono">{tokenMetrics.stakingRatio?.toFixed(1) ?? 0}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Burned</span>
                    <span className="text-red-400 font-mono">{(tokenMetrics.burnedTokens / 1e6).toFixed(2)}M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Holders</span>
                    <span className="text-white font-mono">{tokenMetrics.uniqueHolders?.toLocaleString() ?? 0}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {[1,2,3,4,5].map(i => <div key={i} className="h-4 bg-slate-800 rounded animate-pulse" />)}
                </div>
              )}
            </div>

            {/* How It Works */}
            <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-4 space-y-3">
              <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                <Info className="w-4 h-4 text-cyan-400" /> How Swaps Work
              </h3>
              <div className="space-y-2 text-xs text-slate-400">
                {[
                  "Enter the amount you want to swap",
                  "Review the real-time quote and price impact",
                  "Adjust slippage tolerance if needed",
                  "Confirm the swap — executes instantly",
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{i+1}</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Security */}
            <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-4 space-y-2">
              <h3 className="font-semibold text-green-400 text-sm flex items-center gap-2">
                <Shield className="w-4 h-4" /> Protected Swap
              </h3>
              <div className="space-y-1.5 text-xs text-slate-400">
                {["MEV protection enabled", "Slippage guard active", "Rate limiting enforced", "Audit trail logged"].map(f => (
                  <div key={f} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-green-400 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
