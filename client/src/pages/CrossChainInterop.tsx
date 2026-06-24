/**
 * CrossChainInterop — Phase 11 Cross-Chain Interoperability
 * Multi-chain bridge, asset transfers, protocol interoperability
 */
import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ArrowRightLeft, Globe, Zap, Shield, TrendingUp } from "lucide-react";

const CHAINS = [
  { name: "Ethereum", symbol: "ETH", color: "text-blue-400", bg: "bg-blue-500/10", status: "active", tvl: "$1.2M" },
  { name: "Polygon", symbol: "MATIC", color: "text-purple-400", bg: "bg-purple-500/10", status: "active", tvl: "$340K" },
  { name: "BNB Chain", symbol: "BNB", color: "text-yellow-400", bg: "bg-yellow-500/10", status: "active", tvl: "$180K" },
  { name: "Solana", symbol: "SOL", color: "text-green-400", bg: "bg-green-500/10", status: "coming", tvl: "—" },
  { name: "Arbitrum", symbol: "ARB", color: "text-cyan-400", bg: "bg-cyan-500/10", status: "coming", tvl: "—" },
];

const RECENT_BRIDGES = [
  { from: "ETH", to: "SKY", amount: "0.5 ETH", value: "$1,250", time: "2m ago", status: "completed" },
  { from: "MATIC", to: "SKY", amount: "500 MATIC", value: "$320", time: "8m ago", status: "completed" },
  { from: "SKY", to: "ETH", amount: "10,000 SKY", value: "$2,100", time: "15m ago", status: "completed" },
  { from: "BNB", to: "SKY", amount: "2 BNB", value: "$840", time: "22m ago", status: "pending" },
];

export default function CrossChainInterop() {
  const [fromChain, setFromChain] = useState("ETH");
  const [toChain, setToChain] = useState("SKY");
  const [amount, setAmount] = useState("");
  const [tab, setTab] = useState<"bridge" | "chains" | "history">("bridge");

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
        <Link href="/" className="p-2 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-bold text-lg flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-400" />
            Cross-Chain Bridge
          </h1>
          <p className="text-xs text-muted-foreground">Multi-chain interoperability — Phase 11</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Total TVL", value: "$1.72M", icon: TrendingUp, color: "text-green-400" },
            { label: "Active Chains", value: "3", icon: Globe, color: "text-blue-400" },
            { label: "Avg Bridge Time", value: "45s", icon: Zap, color: "text-yellow-400" },
          ].map(s => (
            <div key={s.label} className="card p-3 text-center">
              <s.icon className={`w-4 h-4 ${s.color} mx-auto mb-1`} />
              <div className="font-bold text-sm">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-1 bg-secondary/30 rounded-xl p-1">
          {(["bridge", "chains", "history"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-colors ${tab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}>
              {t}
            </button>
          ))}
        </div>

        {tab === "bridge" && (
          <div className="space-y-3">
            <div className="card p-4 space-y-3">
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">From</label>
                <select value={fromChain} onChange={e => setFromChain(e.target.value)}
                  className="w-full bg-secondary/50 border border-border/50 rounded-lg px-3 py-2 text-sm">
                  {["ETH", "MATIC", "BNB", "SKY"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex justify-center">
                <button onClick={() => { setFromChain(toChain); setToChain(fromChain); }}
                  className="p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors">
                  <ArrowRightLeft className="w-4 h-4 text-primary" />
                </button>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">To</label>
                <select value={toChain} onChange={e => setToChain(e.target.value)}
                  className="w-full bg-secondary/50 border border-border/50 rounded-lg px-3 py-2 text-sm">
                  {["SKY", "ETH", "MATIC", "BNB"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Amount</label>
                <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00"
                  className="w-full bg-secondary/50 border border-border/50 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground p-2 bg-secondary/30 rounded-lg">
                <Shield className="w-3.5 h-3.5 text-green-400" />
                <span>Bridge fee: 0.1% · Estimated time: ~45 seconds</span>
              </div>
              <button className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity">
                Bridge {fromChain} → {toChain}
              </button>
            </div>
          </div>
        )}

        {tab === "chains" && (
          <div className="space-y-2">
            {CHAINS.map(c => (
              <div key={c.name} className="card p-4 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full ${c.bg} flex items-center justify-center font-bold text-xs ${c.color}`}>
                  {c.symbol}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{c.name}</div>
                  <div className="text-xs text-muted-foreground">TVL: {c.tvl}</div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${c.status === "active" ? "bg-green-500/20 text-green-400" : "bg-secondary text-muted-foreground"}`}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === "history" && (
          <div className="space-y-2">
            {RECENT_BRIDGES.map((b, i) => (
              <div key={i} className="card p-3 flex items-center gap-3">
                <div className="text-xs font-mono text-center">
                  <div className="text-primary">{b.from}</div>
                  <div className="text-muted-foreground">→</div>
                  <div className="text-primary">{b.to}</div>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{b.amount}</div>
                  <div className="text-xs text-muted-foreground">{b.value}</div>
                </div>
                <div className="text-right">
                  <div className={`text-xs ${b.status === "completed" ? "text-green-400" : "text-yellow-400"}`}>{b.status}</div>
                  <div className="text-xs text-muted-foreground">{b.time}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
