/**
 * BlockchainCustody — Non-Custodial HD Wallet UI
 *
 * Features:
 *   - HD wallet registration (BIP-44 derived addresses)
 *   - Multi-chain support: ETH, Polygon, BSC, Base
 *   - Send native + ERC-20 tokens
 *   - Gas estimation with EIP-1559 pricing
 *   - On-chain transaction history with status tracking
 *   - Address validation with EIP-55 checksum
 *   - Real-time balance display
 *
 * Security model displayed to user:
 *   - Private keys never stored on server
 *   - HD derivation from master seed (env-only)
 *   - All transactions require explicit user confirmation
 */

import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  Wallet, Shield, Send, ArrowDownLeft, Copy, ExternalLink, RefreshCw,
  CheckCircle, XCircle, Clock, Loader2, AlertTriangle, Zap, Globe,
  ChevronRight, Lock, Eye, EyeOff, Activity, TrendingUp, Hash
} from "lucide-react";
import { Link } from "wouter";

const CHAIN_EXPLORERS: Record<number, string> = {
  1: "https://etherscan.io/tx/",
  137: "https://polygonscan.com/tx/",
  56: "https://bscscan.com/tx/",
  8453: "https://basescan.org/tx/",
};

const CHAIN_COLORS: Record<number, string> = {
  1: "#627EEA",
  137: "#8247E5",
  56: "#F3BA2F",
  8453: "#0052FF",
};

const STATUS_CONFIG = {
  unsigned: { label: "Unsigned", color: "text-zinc-400", icon: Clock },
  signed: { label: "Signed", color: "text-yellow-400", icon: Lock },
  broadcast: { label: "Broadcast", color: "text-blue-400", icon: Activity },
  confirmed: { label: "Confirmed", color: "text-emerald-400", icon: CheckCircle },
  failed: { label: "Failed", color: "text-red-400", icon: XCircle },
  dropped: { label: "Dropped", color: "text-orange-400", icon: AlertTriangle },
} as const;

function truncateAddress(addr: string) {
  if (!addr || addr.length < 12) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function weiToEth(wei: string): string {
  try {
    const n = BigInt(wei);
    const eth = Number(n) / 1e18;
    return eth.toFixed(6);
  } catch {
    return "0.000000";
  }
}

// ─── Chain Selector ───────────────────────────────────────────────────────────

function ChainBadge({ chainId, chainName }: { chainId: number; chainName: string }) {
  const color = CHAIN_COLORS[chainId] ?? "#888";
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}>
      <Globe className="w-3 h-3" />
      {chainName}
    </span>
  );
}

// ─── Wallet Card ──────────────────────────────────────────────────────────────

type WalletData = { id: number; address: string; chainId: number; chainName: string; label: string | null; isPrimary: boolean; cachedBalanceWei: string | null };

function WalletCard({
  wallet,
  onSend,
}: {
  wallet: WalletData;
  onSend: (wallet: WalletData) => void;
}) {
  const [showFull, setShowFull] = useState(false);
  const { data: balanceData } = trpc.blockchain.onChainBalance.useQuery(
    { address: wallet.address, chainId: wallet.chainId },
    { refetchInterval: 30_000 }
  );

  const copyAddress = () => {
    navigator.clipboard.writeText(wallet.address);
    toast.success("Address copied");
  };

  return (
    <Card className="bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 transition-all">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-white">{wallet.label ?? "Wallet"}</span>
              {wallet.isPrimary && (
                <Badge className="text-[10px] bg-amber-500/20 text-amber-400 border-amber-500/30">Primary</Badge>
              )}
            </div>
            <ChainBadge chainId={wallet.chainId} chainName={wallet.chainName} />
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-white">
              {balanceData?.balance ?? weiToEth(wallet.cachedBalanceWei ?? "0")}
            </div>
            <div className="text-xs text-zinc-500">
              {wallet.chainId === 137 ? "MATIC" : wallet.chainId === 56 ? "BNB" : "ETH"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-zinc-800/60 rounded-lg px-3 py-2 mb-4">
          <Hash className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
          <span className="text-xs font-mono text-zinc-300 flex-1 truncate">
            {showFull ? wallet.address : truncateAddress(wallet.address)}
          </span>
          <button onClick={() => setShowFull(!showFull)} className="text-zinc-500 hover:text-zinc-300">
            {showFull ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
          <button onClick={copyAddress} className="text-zinc-500 hover:text-amber-400 transition-colors">
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex gap-2">
          <Button size="sm" onClick={() => onSend(wallet)}
            className="flex-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Send className="w-3.5 h-3.5 mr-1.5" /> Send
          </Button>
          <Button size="sm" variant="outline"
            className="flex-1 border-zinc-700 text-zinc-300 hover:text-white"
            onClick={copyAddress}>
            <ArrowDownLeft className="w-3.5 h-3.5 mr-1.5" /> Receive
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Send Dialog ──────────────────────────────────────────────────────────────

function SendDialog({
  open,
  onClose,
  wallet,
}: {
  open: boolean;
  onClose: () => void;
  wallet: { id: number; address: string; chainId: number; chainName: string } | null;
}) {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<"form" | "confirm" | "broadcasting">("form");
  const [signedTx, setSignedTx] = useState<{ txId: number; txHash: string; estimatedGasCost: string } | null>(null);

  const utils = trpc.useUtils();

  const validateQuery = trpc.blockchain.validateAddress.useQuery(
    { address: to },
    { enabled: to.length >= 42 }
  );

  const estimateQuery = trpc.blockchain.estimateGas.useQuery(
    { from: wallet?.address ?? "", to: to.length >= 42 ? to : wallet?.address ?? "", valueWei: amount ? String(Math.floor(parseFloat(amount) * 1e18)) : "0", chainId: wallet?.chainId ?? 1 },
    { enabled: !!wallet && to.length >= 42 && !!amount }
  );

  const buildMutation = trpc.blockchain.buildAndSign.useMutation({
    onSuccess: (data) => {
      setSignedTx(data);
      setStep("confirm");
    },
    onError: (e) => toast.error(e.message),
  });

  const broadcastMutation = trpc.blockchain.broadcast.useMutation({
    onSuccess: (data) => {
      if (data.status === "broadcast") {
        toast.success("Transaction broadcast to network!");
        void utils.blockchain.myTransactions.invalidate();
      } else {
        toast.error(`Broadcast failed: ${data.errorMessage}`);
      }
      onClose();
      setStep("form");
      setTo("");
      setAmount("");
      setSignedTx(null);
    },
    onError: (e) => toast.error(e.message),
  });

  const isValidAddress = validateQuery.data?.valid;
  const valueWei = amount ? String(Math.floor(parseFloat(amount || "0") * 1e18)) : "0";

  const handleBuild = () => {
    if (!wallet) return;
    buildMutation.mutate({
      to,
      valueWei,
      chainId: wallet.chainId,
    });
  };

  const handleBroadcast = () => {
    if (!signedTx) return;
    setStep("broadcasting");
    broadcastMutation.mutate({ txId: signedTx.txId });
  };

  return (
    <Dialog open={open} onOpenChange={() => { onClose(); setStep("form"); }}>
      <DialogContent className="bg-zinc-900 border-zinc-800 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Send className="w-4 h-4 text-amber-400" />
            Send {wallet?.chainId === 137 ? "MATIC" : wallet?.chainId === 56 ? "BNB" : "ETH"}
          </DialogTitle>
        </DialogHeader>

        {step === "form" && (
          <div className="space-y-4">
            <div>
              <Label className="text-zinc-400 text-xs mb-1.5 block">From</Label>
              <div className="bg-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-300">
                {truncateAddress(wallet?.address ?? "")}
                <span className="ml-2 text-zinc-500">({wallet?.chainName})</span>
              </div>
            </div>
            <div>
              <Label className="text-zinc-400 text-xs mb-1.5 block">To Address</Label>
              <Input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="0x..."
                className="bg-zinc-800 border-zinc-700 text-white font-mono text-sm"
              />
              {to.length >= 42 && (
                <p className={`text-xs mt-1 ${isValidAddress ? "text-emerald-400" : "text-red-400"}`}>
                  {isValidAddress ? "✓ Valid EIP-55 address" : "✗ Invalid address"}
                </p>
              )}
            </div>
            <div>
              <Label className="text-zinc-400 text-xs mb-1.5 block">Amount (ETH)</Label>
              <Input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.001"
                type="number"
                step="0.001"
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            {estimateQuery.data && (
              <div className="bg-zinc-800/60 rounded-lg p-3 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Estimated Gas</span>
                  <span className="text-zinc-300">{estimateQuery.data.estimatedCostEth} ETH</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Max Fee/Gas</span>
                  <span className="text-zinc-300">{(Number(estimateQuery.data.maxFeePerGas) / 1e9).toFixed(2)} Gwei</span>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={onClose} className="border-zinc-700">Cancel</Button>
              <Button
                onClick={handleBuild}
                disabled={!isValidAddress || !amount || buildMutation.isPending}
                className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
              >
                {buildMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Sign Transaction
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === "confirm" && signedTx && (
          <div className="space-y-4">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="text-amber-400 font-semibold text-sm">Confirm Broadcast</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-500">To</span>
                  <span className="text-zinc-300 font-mono">{truncateAddress(to)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Amount</span>
                  <span className="text-white font-semibold">{amount} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Est. Gas Cost</span>
                  <span className="text-zinc-300">{weiToEth(signedTx.estimatedGasCost)} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Tx Hash</span>
                  <span className="text-zinc-400 font-mono">{truncateAddress(signedTx.txHash)}</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-zinc-500">
              This transaction will be broadcast to the {wallet?.chainName} network. This action cannot be undone.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep("form")} className="border-zinc-700">Back</Button>
              <Button
                onClick={handleBroadcast}
                disabled={broadcastMutation.isPending}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              >
                {broadcastMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Zap className="w-4 h-4 mr-2" />}
                Broadcast Now
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === "broadcasting" && (
          <div className="flex flex-col items-center py-8 gap-4">
            <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
            <p className="text-white font-semibold">Broadcasting to {wallet?.chainName}…</p>
            <p className="text-xs text-zinc-500">Waiting for network confirmation</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── Transaction Row ──────────────────────────────────────────────────────────

function TxRow({ tx }: { tx: Record<string, unknown> }) {
  const status = (tx.status as string) ?? "unsigned";
  const cfg = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.unsigned;
  const Icon = cfg.icon;
  const explorer = CHAIN_EXPLORERS[tx.chainId as number];
  const txHash = tx.txHash as string | null;

  return (
    <div className="flex items-center gap-3 py-3 border-b border-zinc-800/60 last:border-0">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${cfg.color} bg-zinc-800`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 font-mono">{truncateAddress(tx.toAddress as string)}</span>
          {txHash && explorer && (
            <a href={`${explorer}${txHash}`} target="_blank" rel="noopener noreferrer"
              className="text-zinc-600 hover:text-amber-400 transition-colors">
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
        <div className="text-[11px] text-zinc-600 mt-0.5">
          {new Date(tx.createdAt as string).toLocaleString()}
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-semibold text-white">
          {weiToEth(tx.valueWei as string)} ETH
        </div>
        <span className={`text-[11px] font-medium ${cfg.color}`}>{cfg.label}</span>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BlockchainCustody() {
  const { user, loading: authLoading } = useAuth();
  const [sendWallet, setSendWallet] = useState<Parameters<typeof SendDialog>[0]["wallet"]>(null);
  const [registerChain, setRegisterChain] = useState<"ethereum" | "polygon" | "bsc" | "base">("ethereum");

  const utils = trpc.useUtils();

  const walletsQuery = trpc.blockchain.myWallets.useQuery(undefined, { enabled: !!user });
  const txQuery = trpc.blockchain.myTransactions.useQuery({ limit: 50 }, { enabled: !!user });
  const chainsQuery = trpc.blockchain.supportedChains.useQuery();

  const registerMutation = trpc.blockchain.registerWallet.useMutation({
    onSuccess: (wallet) => {
      toast.success(`Wallet registered on ${wallet.chainName}`);
      void utils.blockchain.myWallets.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const wallets = walletsQuery.data ?? [];
  const txs = txQuery.data ?? [];

  const stats = useMemo(() => ({
    totalWallets: wallets.length,
    confirmedTxs: txs.filter((t) => t.status === "confirmed").length,
    pendingTxs: txs.filter((t) => ["broadcast", "signed"].includes(t.status)).length,
    chains: [...new Set(wallets.map((w) => w.chainName))],
  }), [wallets, txs]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
        <Shield className="w-12 h-12 text-amber-400" />
        <h2 className="text-xl font-bold text-white">Authentication Required</h2>
        <p className="text-zinc-400 text-sm">Sign in to access your blockchain wallet</p>
        <Link href="/"><Button className="bg-amber-500 text-black">Go Home</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="border-b border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/wallet">
              <button className="text-zinc-500 hover:text-white transition-colors">
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
            </Link>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-black" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white">Blockchain Custody</h1>
              <p className="text-[11px] text-zinc-500">Non-custodial HD wallet — keys never stored</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-3 py-1">
              <Shield className="w-3 h-3 text-emerald-400" />
              <span className="text-xs text-emerald-400 font-medium">Non-Custodial</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Wallets", value: stats.totalWallets, icon: Wallet, color: "text-amber-400" },
            { label: "Confirmed Txs", value: stats.confirmedTxs, icon: CheckCircle, color: "text-emerald-400" },
            { label: "Pending", value: stats.pendingTxs, icon: Clock, color: "text-blue-400" },
            { label: "Networks", value: stats.chains.length, icon: Globe, color: "text-violet-400" },
          ].map((s) => (
            <Card key={s.label} className="bg-zinc-900/60 border-zinc-800">
              <CardContent className="p-4 flex items-center gap-3">
                <s.icon className={`w-5 h-5 ${s.color}`} />
                <div>
                  <div className="text-lg font-bold text-white">{s.value}</div>
                  <div className="text-[11px] text-zinc-500">{s.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Security Notice */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4 flex items-start gap-3">
          <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-400 mb-1">Non-Custodial Architecture</p>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Your wallet addresses are derived from a BIP-44 HD key tree. Private keys are <strong className="text-white">never stored</strong> in the database — they are derived ephemerally at signing time and immediately discarded. Only your public address and derivation path are recorded.
            </p>
          </div>
        </div>

        <Tabs defaultValue="wallets">
          <TabsList className="bg-zinc-900 border border-zinc-800">
            <TabsTrigger value="wallets" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
              <Wallet className="w-3.5 h-3.5 mr-1.5" /> Wallets
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
              <Activity className="w-3.5 h-3.5 mr-1.5" /> History
            </TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
              <TrendingUp className="w-3.5 h-3.5 mr-1.5" /> Add Wallet
            </TabsTrigger>
          </TabsList>

          {/* Wallets Tab */}
          <TabsContent value="wallets" className="mt-4">
            {walletsQuery.isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((i) => <Skeleton key={i} className="h-40 bg-zinc-800" />)}
              </div>
            ) : wallets.length === 0 ? (
              <div className="text-center py-16">
                <Wallet className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                <p className="text-zinc-400 font-medium">No wallets yet</p>
                <p className="text-zinc-600 text-sm mt-1">Register your first HD wallet below</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {wallets.map((w) => (
                  <WalletCard
                    key={w.id}
                    wallet={w as Parameters<typeof WalletCard>[0]["wallet"]}
                    onSend={(wallet) => setSendWallet(wallet)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="mt-4">
            <Card className="bg-zinc-900/60 border-zinc-800">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-zinc-300">Transaction History</CardTitle>
                  <Button size="sm" variant="ghost" onClick={() => void txQuery.refetch()}
                    className="text-zinc-500 hover:text-white h-7 w-7 p-0">
                    <RefreshCw className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {txQuery.isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 bg-zinc-800" />)}
                  </div>
                ) : txs.length === 0 ? (
                  <div className="text-center py-10">
                    <Activity className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
                    <p className="text-zinc-500 text-sm">No transactions yet</p>
                  </div>
                ) : (
                  <div>
                    {txs.map((tx) => <TxRow key={tx.id} tx={tx as Record<string, unknown>} />)}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Register Tab */}
          <TabsContent value="register" className="mt-4">
            <Card className="bg-zinc-900/60 border-zinc-800 max-w-md">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-zinc-300">Register New Wallet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-zinc-400 text-xs mb-1.5 block">Network</Label>
                  <Select value={registerChain} onValueChange={(v) => setRegisterChain(v as typeof registerChain)}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      {(chainsQuery.data ?? []).map((c) => (
                        <SelectItem key={c.key} value={c.key} className="text-white hover:bg-zinc-700">
                          {c.name} ({c.nativeCurrency})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="bg-zinc-800/60 rounded-lg p-3 text-xs text-zinc-400 space-y-1">
                  <p>• Address derived via BIP-44: <code className="text-zinc-300">m/44'/60'/0'/0/userId</code></p>
                  <p>• Private key never stored — derived ephemerally at signing</p>
                  <p>• EIP-55 checksummed address</p>
                  <p>• EIP-1559 transaction support</p>
                </div>
                <Button
                  onClick={() => registerMutation.mutate({ chain: registerChain })}
                  disabled={registerMutation.isPending}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                >
                  {registerMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Wallet className="w-4 h-4 mr-2" />}
                  Register HD Wallet
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <SendDialog
        open={!!sendWallet}
        onClose={() => setSendWallet(null)}
        wallet={sendWallet}
      />
    </div>
  );
}
