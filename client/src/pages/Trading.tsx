import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { TrendingUp, TrendingDown, BarChart3, Zap, Bot, Activity, DollarSign, ArrowRight, RefreshCw, Target } from "lucide-react";

const PAIRS = [
  { pair: "SKY444/USDT", price: "$0.0847", change: 12.4, vol: "$2.4M" },
  { pair: "BTC/USDT", price: "$67,234", change: -1.2, vol: "$48.2B" },
  { pair: "ETH/USDT", price: "$3,421", change: 2.8, vol: "$18.7B" },
  { pair: "DODGE/USDT", price: "$0.1234", change: 5.6, vol: "$892M" },
];

export default function Trading() {
  return (
    <div className="container py-8 max-w-6xl animate-page-in">
      <PageHeader backHref="/dashboard" icon={TrendingUp} title="Trading Terminal" subtitle="Real-time crypto trading with AI-powered signals and 5 bot strategies"
        actions={<Link href="/day-trade"><Button className="btn-primary gap-2"><Zap className="w-4 h-4" />Open Pro Terminal</Button></Link>}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={DollarSign} label="Portfolio Value" value="$0.00" color="primary" />
        <StatCard icon={TrendingUp} label="24h P&L" value="$0.00" change={0} color="success" />
        <StatCard icon={Activity} label="Open Orders" value="0" color="accent" />
        <StatCard icon={Bot} label="Active Bots" value="0" color="warning" />
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-primary" />Market Overview</h3>
          <div className="divide-y divide-border/50">
            {PAIRS.map(p => (
              <div key={p.pair} className="flex items-center justify-between py-3">
                <div className="font-mono font-semibold text-sm">{p.pair}</div>
                <div className="text-sm font-mono">{p.price}</div>
                <div className={`flex items-center gap-1 text-sm font-medium ${p.change > 0 ? "text-success" : "text-destructive"}`}>
                  {p.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {p.change > 0 ? "+" : ""}{p.change}%
                </div>
                <div className="text-xs text-muted-foreground">{p.vol}</div>
                <Link href="/day-trade"><Button size="sm" variant="outline" className="text-xs">Trade</Button></Link>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><Bot className="w-5 h-5 text-primary" />AI Bot Strategies</h3>
            {["Grid Trading","DCA Bot","Momentum","Arbitrage","Mean Reversion"].map(b => (
              <div key={b} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <span className="text-sm">{b}</span>
                <Link href="/day-trade"><Button size="sm" variant="ghost" className="text-xs gap-1 text-primary">Enable <ArrowRight className="w-3 h-3" /></Button></Link>
              </div>
            ))}
          </div>
          <div className="card p-5">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><Target className="w-5 h-5 text-primary" />Quick Trade</h3>
            <p className="text-sm text-muted-foreground mb-3">Connect wallet to start trading</p>
            <Link href="/crypto"><Button className="btn-primary w-full gap-2"><Zap className="w-4 h-4" />Connect Wallet</Button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
