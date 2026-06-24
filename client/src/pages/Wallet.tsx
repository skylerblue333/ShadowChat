import { useState, useMemo } from "react";
import { useLocation, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Wallet, Send, ArrowDownLeft, ArrowUpRight, Copy, TrendingUp, Shield, Zap,
  RefreshCw, ChevronRight, CheckCircle, Link2, BarChart2, Layers, Globe,
  ArrowLeftRight, Coins, AlertCircle
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const CRYPTO_TABS = [
  { href: "/wallet",    label: "Wallet",    icon: Wallet },
  { href: "/portfolio", label: "Portfolio", icon: BarChart2 },
  { href: "/staking",   label: "Staking",   icon: Layers },
  { href: "/defi",      label: "DeFi",      icon: Globe },
  { href: "/trading",   label: "Trade",     icon: ArrowLeftRight },
  { href: "/token",     label: "SKY444",    icon: Coins },
] as const;

const TOKEN_META: Record<string, { name: string; color: string }> = {
  SKY444: { name: "SKYCOIN 4444",  color: "#818cf8" },
  ETH:    { name: "Ethereum",      color: "#627EEA" },
  USDC:   { name: "USD Coin",      color: "#2775CA" },
  BNB:    { name: "BNB Chain",     color: "#F3BA2F" },
  BTC:    { name: "Bitcoin",       color: "#F7931A" },
  MATIC:  { name: "Polygon",       color: "#8247E5" },
};

// SKY444 price in USD (platform-set rate, not external oracle)
const SKY444_USD_RATE = 0.50;

function CryptoHubNav() {
  const [loc] = useLocation();
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
      {CRYPTO_TABS.map(t => {
        const active = loc === t.href;
        return (
          <Link key={t.href} href={t.href}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              active
                ? "bg-violet-600 text-white shadow-lg shadow-violet-900/40"
                : "bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-700/80"
            }`}>
            <t.icon className="w-3.5 h-3.5" />{t.label}
          </Link>
        );
      })}
    </div>
  );
}

export default function WalletPage() {
  const { user } = useAuth();
  const [showSend, setShowSend] = useState(false);
  const [sendTo, setSendTo] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [copied, setCopied] = useState(false);

  // Live DB queries — no mock data
  const { data: walletData, isLoading: balanceLoading, refetch: refetchBalance } = trpc.wallet.getBalance.useQuery(undefined, { enabled: !!user });
  const { data: txHistory, isLoading: txLoading, refetch: refetchTx } = trpc.wallet.getTransactionHistory.useQuery({ limit: 20 }, { enabled: !!user });
  const { data: connections, refetch: refetchConnections } = trpc.wallet.getConnections.useQuery(undefined, { enabled: !!user });

  const [isConnecting, setIsConnecting] = useState(false);

  const connectWalletMut = trpc.wallet.connectWallet.useMutation({
    onSuccess: () => { toast.success("Wallet connected!"); refetchConnections(); setIsConnecting(false); },
    onError: (e) => { toast.error(e.message); setIsConnecting(false); },
  });

  const sendMutation = trpc.wallet.send.useMutation({
    onSuccess: () => {
      toast.success("Transaction submitted!");
      setShowSend(false);
      setSendTo("");
      setSendAmount("");
      refetchBalance();
      refetchTx();
    },
    onError: (e) => toast.error(e.message || "Transaction failed"),
  });

  const handleConnectMetaMask = async () => {
    if (typeof (window as any).ethereum === "undefined") {
      toast.error("MetaMask not detected. Please install MetaMask.");
      window.open("https://metamask.io", "_blank");
      return;
    }
    setIsConnecting(true);
    try {
      const accounts = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
      const chainId = await (window as any).ethereum.request({ method: "eth_chainId" });
      if (accounts[0]) {
        connectWalletMut.mutate({ walletAddress: accounts[0], chainId: parseInt(chainId, 16), walletType: "metamask" });
      }
    } catch (err: any) {
      toast.error(err.message || "Connection rejected");
      setIsConnecting(false);
    }
  };

  // Derive live token list from DB balances
  const liveTokens = useMemo(() => {
    const balances: any[] = (walletData as any)?.balances ?? [];
    return balances.map((b: any) => {
      const meta = TOKEN_META[b.token] ?? { name: b.token, color: "#6b7280" };
      const bal = Number(b.balance ?? 0);
      const usdRate = b.token === "SKY444" ? SKY444_USD_RATE : b.token === "USDC" ? 1 : 0;
      return { symbol: b.token, name: meta.name, color: meta.color, balance: bal, usdValue: bal * usdRate, staked: Number(b.stakedBalance ?? 0), pending: Number(b.pendingRewards ?? 0) };
    });
  }, [walletData]);

  const totalUsdValue = liveTokens.reduce((s, t) => s + t.usdValue, 0);
  const sky444Balance = liveTokens.find(t => t.symbol === "SKY444")?.balance ?? 0;

  const connectedAddress = (connections as any)?.[0]?.walletAddress ?? null;
  const walletAddress = connectedAddress
    ? `${connectedAddress.slice(0, 6)}...${connectedAddress.slice(-4)}`
    : user ? `SKY-${String(user.id).padStart(6, "0")}` : "—";

  const copyAddress = () => {
    const addr = connectedAddress ?? `SKY-${String(user?.id).padStart(6, "0")}`;
    navigator.clipboard.writeText(addr).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Address copied!");
  };

  // Build 30-day portfolio history from real transactions
  const portfolioHistory = useMemo(() => {
    const txs: any[] = Array.isArray(txHistory) ? txHistory : [];
    const days: { date: string; value: number }[] = [];
    let running = sky444Balance;
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString("en", { month: "short", day: "numeric" });
      // subtract transactions that happened after this day to reconstruct historical balance
      const dayTs = d.getTime();
      const txsAfter = txs.filter((tx: any) => {
        const txTime = typeof tx.createdAt === "number" ? tx.createdAt : new Date(tx.createdAt).getTime();
        return txTime > dayTs && tx.token === "SKY444";
      });
      const delta = txsAfter.reduce((s: number, tx: any) => {
        const amt = Number(tx.amount ?? 0);
        return tx.type === "receive" || tx.type === "reward" || tx.type === "mining" ? s - amt : s + amt;
      }, 0);
      days.push({ date: label, value: Math.max(0, running + delta) });
    }
    return days;
  }, [txHistory, sky444Balance]);

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <Card className="bg-zinc-900 border-zinc-800 p-8 text-center max-w-sm">
          <AlertCircle className="w-10 h-10 text-violet-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Sign In Required</h2>
          <p className="text-zinc-400 text-sm mb-4">Connect your account to view your live wallet.</p>
          <Link href="/"><Button className="bg-violet-600 hover:bg-violet-700">Go to Home</Button></Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* Header + Nav */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-1 text-white">
            <Wallet className="w-6 h-6 text-violet-400" />Crypto Hub
          </h1>
          <p className="text-sm text-zinc-400 mb-4">Wallet · Portfolio · Staking · DeFi · Trading — all in one place</p>
          <CryptoHubNav />
        </div>

        {/* MetaMask Connect Banner */}
        {!connectedAddress && (
          <Card className="bg-gradient-to-r from-orange-900/30 to-yellow-900/30 border-orange-500/30">
            <CardContent className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-xl">🦊</div>
                <div>
                  <p className="text-white font-semibold text-sm">Connect External Wallet</p>
                  <p className="text-slate-400 text-xs">Link MetaMask to view on-chain balances and sign transactions</p>
                </div>
              </div>
              <Button onClick={handleConnectMetaMask} disabled={isConnecting}
                className="bg-orange-500/20 text-orange-300 border border-orange-500/30 hover:bg-orange-500/30 shrink-0 gap-2">
                <Link2 className="w-4 h-4" />{isConnecting ? "Connecting..." : "Connect MetaMask"}
              </Button>
            </CardContent>
          </Card>
        )}
        {connectedAddress && (
          <Card className="bg-green-900/20 border-green-500/30">
            <CardContent className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-sm font-medium">MetaMask Connected</span>
                <span className="text-slate-400 text-xs font-mono">{walletAddress}</span>
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[10px]">On-Chain</Badge>
            </CardContent>
          </Card>
        )}

        {/* Balance Card — live data */}
        <Card className="bg-gradient-to-br from-violet-900/40 to-blue-900/40 border-violet-700/50">
          <CardContent className="p-6">
            {balanceLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-8 w-48 bg-zinc-700" />
                <Skeleton className="h-4 w-32 bg-zinc-700" />
              </div>
            ) : (
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-sm text-zinc-400 mb-1">SKY444 Balance (Live)</div>
                  <div className="text-4xl font-bold">{sky444Balance.toLocaleString()} <span className="text-2xl text-violet-300">SKY444</span></div>
                  {totalUsdValue > 0 && (
                    <div className="text-sm text-emerald-400 mt-1">≈ ${totalUsdValue.toFixed(2)} USD</div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-xs text-zinc-400 mb-1">Platform ID</div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-zinc-300">{walletAddress}</span>
                    <button onClick={copyAddress} className="p-1 hover:bg-zinc-700 rounded transition-colors">
                      {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-zinc-400" />}
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="flex gap-3">
              <Button onClick={() => setShowSend(true)} className="gap-2 bg-violet-600 hover:bg-violet-700 flex-1" disabled={sky444Balance <= 0}>
                <Send className="w-4 h-4" /> Send
              </Button>
              <Link href="/earn-hub">
                <Button variant="outline" className="gap-2 flex-1 border-zinc-600 hover:bg-zinc-800">
                  <ArrowDownLeft className="w-4 h-4" /> Earn
                </Button>
              </Link>
              <Link href="/defi">
                <Button variant="outline" className="gap-2 border-zinc-600 hover:bg-zinc-800">
                  <RefreshCw className="w-4 h-4" /> DeFi
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio History Chart — derived from real transactions */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">SKY444 Balance History (30d)</CardTitle>
              <span className="text-xs text-zinc-500">Reconstructed from transactions</span>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {balanceLoading ? (
              <Skeleton className="h-40 w-full bg-zinc-800" />
            ) : (
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={portfolioHistory} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="walletGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fill: "#71717a", fontSize: 10 }} tickLine={false} axisLine={false} interval={6} />
                  <YAxis tick={{ fill: "#71717a", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: 8 }} formatter={(v: any) => [`${Number(v).toLocaleString()} SKY444`, "Balance"]} />
                  <Area type="monotone" dataKey="value" stroke="#818cf8" strokeWidth={2} fill="url(#walletGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Live Token Balances */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Token Balances</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-zinc-400 gap-1" onClick={() => refetchBalance()}>
                <RefreshCw className="w-3 h-3" /> Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {balanceLoading ? (
              <div className="p-4 space-y-3">
                {[1,2,3].map(i => <Skeleton key={i} className="h-14 w-full bg-zinc-800" />)}
              </div>
            ) : liveTokens.length === 0 ? (
              <div className="p-8 text-center text-zinc-500">
                <Coins className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No token balances yet.</p>
                <p className="text-xs mt-1">Start earning SKY444 by posting, mining, or purchasing in the ICO.</p>
                <div className="flex gap-2 justify-center mt-3">
                  <Link href="/crypto-mine"><Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-xs">Mine SKY444</Button></Link>
                  <Link href="/ico"><Button size="sm" variant="outline" className="text-xs border-zinc-600">Buy in ICO</Button></Link>
                </div>
              </div>
            ) : (
              liveTokens.map((token, i) => (
                <div key={token.symbol} className={`flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors ${i < liveTokens.length - 1 ? "border-b border-zinc-800" : ""}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: token.color + "20", color: token.color }}>
                      {token.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <div className="font-medium">{token.symbol}</div>
                      <div className="text-xs text-zinc-400">{token.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{token.balance.toLocaleString()} {token.symbol}</div>
                    {token.usdValue > 0 && <div className="text-sm text-zinc-400">${token.usdValue.toFixed(2)}</div>}
                    {token.staked > 0 && <div className="text-xs text-violet-400">{token.staked.toLocaleString()} staked</div>}
                    {token.pending > 0 && <div className="text-xs text-emerald-400">+{token.pending.toLocaleString()} pending</div>}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Stake SKY444",  icon: TrendingUp, href: "/staking",     color: "#818cf8" },
            { label: "Mine SKY444",   icon: Zap,        href: "/crypto-mine", color: "#34d399" },
            { label: "Security",      icon: Shield,     href: "/security",    color: "#f59e0b" },
            { label: "DeFi Yield",    icon: Zap,        href: "/yield-farming", color: "#a78bfa" },
          ].map(action => (
            <Link key={action.label} href={action.href}>
              <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-600 transition-all cursor-pointer group">
                <CardContent className="p-4 flex flex-col items-center gap-2 text-center">
                  <div className="p-2 rounded-lg bg-zinc-800 group-hover:scale-110 transition-transform">
                    <action.icon className="w-5 h-5" style={{ color: action.color }} />
                  </div>
                  <span className="text-sm font-medium">{action.label}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Live Transaction History */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Transaction History</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs text-zinc-400 gap-1" onClick={() => refetchTx()}>
              <RefreshCw className="w-3 h-3" /> Refresh
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {txLoading ? (
              <div className="p-4 space-y-3">
                {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-16 w-full bg-zinc-800" />)}
              </div>
            ) : !txHistory || (txHistory as any[]).length === 0 ? (
              <div className="p-8 text-center text-zinc-500">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No transactions yet.</p>
                <p className="text-xs mt-1">Your real transaction history will appear here as you earn, stake, send, and receive SKY444.</p>
              </div>
            ) : (
              (txHistory as any[]).map((tx: any, i: number) => {
                const isIncoming = tx.type === "receive" || tx.type === "reward" || tx.type === "mining" || tx.type === "staking_reward";
                const txTime = typeof tx.createdAt === "number" ? tx.createdAt : new Date(tx.createdAt).getTime();
                return (
                  <div key={tx.id ?? i} className={`flex items-center gap-4 p-4 hover:bg-zinc-800/50 transition-colors ${i < (txHistory as any[]).length - 1 ? "border-b border-zinc-800" : ""}`}>
                    <div className={`p-2 rounded-full ${isIncoming ? "bg-emerald-900/40" : tx.type === "stake" ? "bg-violet-900/40" : "bg-zinc-800"}`}>
                      {isIncoming ? <ArrowDownLeft className="w-4 h-4 text-emerald-400" /> : tx.type === "stake" ? <TrendingUp className="w-4 h-4 text-violet-400" /> : <ArrowUpRight className="w-4 h-4 text-zinc-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium capitalize text-sm">{tx.type?.replace(/_/g, " ") ?? "Transaction"}</div>
                      <div className="text-xs text-zinc-400 truncate">{tx.description ?? (isIncoming ? `From: ${tx.fromAddress ?? "Platform"}` : `To: ${tx.toAddress ?? "—"}`)}</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium text-sm ${isIncoming ? "text-emerald-400" : "text-zinc-300"}`}>
                        {isIncoming ? "+" : "-"}{Number(tx.amount ?? 0).toLocaleString()} {tx.token ?? "SKY444"}
                      </div>
                      <div className="text-xs text-zinc-500">{new Date(txTime).toLocaleDateString()}</div>
                    </div>
                    <Badge variant="outline" className={`text-xs ${tx.status === "confirmed" || !tx.status ? "text-emerald-400 border-emerald-800" : "text-yellow-400 border-yellow-800"}`}>
                      {tx.status ?? "confirmed"}
                    </Badge>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Send Dialog */}
        <Dialog open={showSend} onOpenChange={setShowSend}>
          <DialogContent className="bg-zinc-900 border-zinc-700">
            <DialogHeader><DialogTitle>Send SKY444</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-zinc-400 mb-1 block">Recipient Platform ID or Address</label>
                <Input placeholder="SKY-000001 or 0x..." value={sendTo} onChange={e => setSendTo(e.target.value)} className="bg-zinc-800 border-zinc-700 font-mono" />
              </div>
              <div>
                <label className="text-sm text-zinc-400 mb-1 block">Amount (SKY444)</label>
                <Input type="number" placeholder="0" value={sendAmount} onChange={e => setSendAmount(e.target.value)} className="bg-zinc-800 border-zinc-700" />
                <div className="text-xs text-zinc-500 mt-1">Available: {sky444Balance.toLocaleString()} SKY444</div>
              </div>
              <div className="bg-zinc-800 rounded-lg p-3 text-xs text-zinc-400 space-y-1">
                <div className="flex justify-between"><span>Network Fee</span><span>~0.5 SKY444</span></div>
                <div className="flex justify-between"><span>Estimated Time</span><span>~30 seconds</span></div>
              </div>
              <Button
                className="w-full bg-violet-600 hover:bg-violet-700"
                disabled={!sendTo || !sendAmount || sendMutation.isPending || parseFloat(sendAmount) > sky444Balance}
                onClick={() => sendMutation.mutate({ to: sendTo, amount: parseFloat(sendAmount) })}
              >
                {sendMutation.isPending ? "Sending..." : "Send Transaction"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}
