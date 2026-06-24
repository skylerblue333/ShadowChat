import { useState } from "react";
import { Link } from "wouter";
import { Layers, Zap, ArrowLeftRight, TrendingUp, Shield, Droplets, Plus, ArrowRight, Activity, DollarSign, BarChart3 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PROTOCOLS = [
  { name: "SKY Swap",     type: "DEX",      tvl: "$4.2M",  apy: "18.4%", risk: "Low",    href: "/token-swap",   icon: "🔄", color: "from-purple-500 to-cyan-500" },
  { name: "SKY Lend",     type: "Lending",  tvl: "$2.8M",  apy: "12.1%", risk: "Low",    href: "/staking",      icon: "🏦", color: "from-blue-500 to-indigo-500" },
  { name: "SKY Farm",     type: "Yield",    tvl: "$1.9M",  apy: "34.7%", risk: "Medium", href: "/yield-farming",icon: "🌾", color: "from-green-500 to-teal-500"  },
  { name: "SKY Bridge",   type: "Bridge",   tvl: "$890K",  apy: "—",     risk: "Medium", href: "/cross-chain",  icon: "🌉", color: "from-orange-500 to-red-500"  },
  { name: "SKY Vault",    type: "Vault",    tvl: "$620K",  apy: "22.3%", risk: "Low",    href: "/staking",      icon: "🔒", color: "from-yellow-500 to-orange-500"},
  { name: "SKY Perps",    type: "Perps",    tvl: "$340K",  apy: "—",     risk: "High",   href: "/trading",      icon: "📈", color: "from-red-500 to-pink-500"    },
];

const POOLS = [
  { pair: "SKY444/USDT", tvl: "$1.8M", apy: "24.6%", volume: "$420K", myLiquidity: "$0" },
  { pair: "SKY444/ETH",  tvl: "$980K", apy: "31.2%", volume: "$218K", myLiquidity: "$0" },
  { pair: "ETH/USDT",    tvl: "$2.4M", apy: "8.4%",  volume: "$1.2M", myLiquidity: "$0" },
  { pair: "BTC/USDT",    tvl: "$5.1M", apy: "6.1%",  volume: "$3.8M", myLiquidity: "$0" },
];

const TABS = ["Overview", "Pools", "Lending", "Bridges"] as const;
type Tab = typeof TABS[number];

const RISK_COLOR: Record<string, string> = {
  Low: "bg-green-500/20 text-green-400 border-green-500/30",
  Medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  High: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function DeFi() {
  const [tab, setTab] = useState<Tab>("Overview");

  return (
    <div className="container py-8 max-w-5xl animate-page-in">
      <PageHeader
        backHref="/crypto-hub"
        icon={Layers}
        title="DeFi Hub"
        subtitle="Decentralized finance — swap, lend, farm, and bridge SKY444"
        actions={
          <Link href="/token-swap">
            <Button className="btn-primary gap-2">
              <Zap className="w-4 h-4" /> Start Earning
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon={DollarSign} label="Total TVL" value="$10.5M" color="primary" />
        <StatCard icon={TrendingUp} label="Best APY" value="34.7%" color="success" />
        <StatCard icon={Activity} label="24h Volume" value="$5.6M" color="accent" />
        <StatCard icon={BarChart3} label="Protocols" value={PROTOCOLS.length.toString()} color="warning" />
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-secondary/30 rounded-xl p-1 mb-6">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all active:scale-[0.97] ${
              tab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {(tab === "Overview") && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROTOCOLS.map(p => (
            <Link key={p.name} href={p.href}>
              <div className="card p-5 hover:border-slate-700/60 active:scale-[0.98] transition-all cursor-pointer group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center text-2xl mb-3`}>
                  {p.icon}
                </div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-sm">{p.name}</h3>
                  <Badge variant="outline" className="text-[10px]">{p.type}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                  <div>
                    <div className="text-muted-foreground">TVL</div>
                    <div className="font-semibold">{p.tvl}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">APY</div>
                    <div className="font-semibold text-green-400">{p.apy}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${RISK_COLOR[p.risk]}`}>
                    {p.risk} Risk
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-primary transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {tab === "Pools" && (
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-sm">Liquidity Pools</h3>
            <Link href="/yield-farming">
              <Button size="sm" className="btn-primary gap-1 text-xs">
                <Plus className="w-3 h-3" /> Add Liquidity
              </Button>
            </Link>
          </div>
          {POOLS.map(pool => (
            <Link key={pool.pair} href="/yield-farming">
              <div className="card p-4 flex items-center gap-4 hover:border-slate-700/60 active:scale-[0.99] transition-all cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                  LP
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{pool.pair}</div>
                  <div className="text-xs text-muted-foreground">TVL: {pool.tvl} · Vol: {pool.volume}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-green-400 font-bold text-sm">{pool.apy}</div>
                  <div className="text-xs text-muted-foreground">APY</div>
                </div>
                <Button size="sm" variant="outline" className="text-xs shrink-0">Add LP</Button>
              </div>
            </Link>
          ))}
        </div>
      )}

      {tab === "Lending" && (
        <div className="card p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
            <Layers className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="font-bold text-lg mb-2">SKY Lend Protocol</h3>
          <p className="text-muted-foreground text-sm mb-4">Supply assets to earn interest or borrow against your collateral.</p>
          <Link href="/staking">
            <Button className="btn-primary gap-2">
              <ArrowRight className="w-4 h-4" /> Open Lending
            </Button>
          </Link>
        </div>
      )}

      {tab === "Bridges" && (
        <div className="card p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/20 flex items-center justify-center mx-auto mb-4">
            <ArrowLeftRight className="w-8 h-8 text-orange-400" />
          </div>
          <h3 className="font-bold text-lg mb-2">Cross-Chain Bridge</h3>
          <p className="text-muted-foreground text-sm mb-4">Bridge SKY444 across Ethereum, BSC, Polygon, Avalanche, and Solana.</p>
          <Link href="/cross-chain">
            <Button className="btn-primary gap-2">
              <ArrowRight className="w-4 h-4" /> Open Bridge
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
