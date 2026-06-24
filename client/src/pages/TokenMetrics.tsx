import { Link } from "wouter";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Coins, TrendingUp, Users, Flame, Lock, BarChart3, ExternalLink, ArrowUpRight } from "lucide-react";

const DISTRIBUTION = [
  { label: "Community Rewards", pct: 40, color: "bg-primary" },
  { label: "Staking Pool", pct: 25, color: "bg-accent" },
  { label: "Team & Advisors", pct: 15, color: "bg-success" },
  { label: "Treasury", pct: 12, color: "bg-warning" },
  { label: "Public Sale", pct: 8, color: "bg-destructive" },
];

const PRICE_HISTORY = [
  { date: "Jan", price: 0.012 }, { date: "Feb", price: 0.018 }, { date: "Mar", price: 0.024 },
  { date: "Apr", price: 0.019 }, { date: "May", price: 0.031 }, { date: "Jun", price: 0.044 },
];

export default function TokenMetrics() {
  const maxPrice = Math.max(...PRICE_HISTORY.map(p => p.price));
  return (
    <div className="container py-8 max-w-5xl animate-page-in">
      <PageHeader backHref="/token" icon={Coins} title="SKY444 Token Metrics" subtitle="Live tokenomics, supply analytics, and market data for the SKY444 ecosystem token" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={TrendingUp} label="Price" value="$0.044" change={12.4} color="success" />
        <StatCard icon={BarChart3} label="Market Cap" value="$44.4M" change={8.1} />
        <StatCard icon={Coins} label="Circulating Supply" value="1.01B SKY" />
        <StatCard icon={Flame} label="Total Burned" value="44.4M SKY" color="destructive" />
      </div>
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Price Chart */}
        <div className="card p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" />Price History (6M)</h3>
          <div className="flex items-end gap-2 h-32">
            {PRICE_HISTORY.map((p, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-primary/80 rounded-t-sm transition-all hover:bg-primary" style={{ height: `${(p.price / maxPrice) * 100}%` }} title={`$${p.price}`} />
                <span className="text-xs text-muted-foreground">{p.date}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Distribution */}
        <div className="card p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-primary" />Token Distribution</h3>
          <div className="space-y-3">
            {DISTRIBUTION.map((d, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">{d.label}</span>
                  <span className="font-medium">{d.pct}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className={`h-full ${d.color} rounded-full`} style={{ width: `${d.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Key Metrics */}
      <div className="card p-5">
        <h3 className="font-semibold mb-4">On-Chain Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: "Total Supply", value: "4,444,444,444 SKY" },
            { label: "Holders", value: "12,847" },
            { label: "Staked", value: "312M SKY (31%)" },
            { label: "Burn Rate", value: "1% per tx" },
            { label: "Staking APY", value: "18.4%" },
            { label: "Vesting Unlocks", value: "Jun 30, 2026" },
          ].map((m, i) => (
            <div key={i} className="bg-secondary/50 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">{m.label}</div>
              <div className="font-semibold text-sm">{m.value}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 flex gap-3">
        <Link href="/staking" className="btn-primary text-sm flex items-center gap-2"><Lock className="w-4 h-4" />Stake SKY444</Link>
        <Link href="/swap" className="btn-secondary text-sm flex items-center gap-2"><ArrowUpRight className="w-4 h-4" />Buy / Swap</Link>
        <a href="https://etherscan.io" target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm flex items-center gap-2"><ExternalLink className="w-4 h-4" />View on Etherscan</a>
      </div>
    </div>
  );
}
