import { useState } from "react";
import { Link } from "wouter";
import { PieChart, TrendingUp, TrendingDown, Wallet, ArrowLeftRight, Plus, RefreshCw, DollarSign, BarChart3, Activity } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

const HOLDINGS = [
  { symbol: "SKY444", name: "SKYCOIN 4444",  amount: 50000,  price: 0.0847, value: 4235,  change: 12.4,  allocation: 42, color: "bg-purple-500" },
  { symbol: "BTC",    name: "Bitcoin",        amount: 0.0621, price: 67234,  value: 4175,  change: -1.2,  allocation: 41, color: "bg-orange-500" },
  { symbol: "ETH",    name: "Ethereum",       amount: 0.312,  price: 3421,   value: 1067,  change: 2.8,   allocation: 11, color: "bg-blue-500"  },
  { symbol: "USDT",   name: "Tether",         amount: 620,    price: 1.00,   value: 620,   change: 0.01,  allocation: 6,  color: "bg-green-500" },
];

const HISTORY = [
  { date: "Jun 18", value: 10097, change: +234  },
  { date: "Jun 17", value: 9863,  change: -142  },
  { date: "Jun 16", value: 10005, change: +389  },
  { date: "Jun 15", value: 9616,  change: -211  },
  { date: "Jun 14", value: 9827,  change: +512  },
  { date: "Jun 13", value: 9315,  change: +178  },
  { date: "Jun 12", value: 9137,  change: -89   },
];

export default function Portfolio() {
  const [view, setView] = useState<"holdings" | "history">("holdings");
  const totalValue = HOLDINGS.reduce((s, h) => s + h.value, 0);
  const totalChange = HOLDINGS.reduce((s, h) => s + (h.value * h.change / 100), 0);

  return (
    <div className="container py-8 max-w-4xl animate-page-in">
      <PageHeader
        backHref="/wallet"
        icon={PieChart}
        title="Portfolio"
        subtitle="Track your crypto holdings, allocation, and performance"
        actions={
          <div className="flex gap-2">
            <Link href="/token-swap">
              <Button variant="outline" className="gap-2 text-xs">
                <ArrowLeftRight className="w-3.5 h-3.5" /> Swap
              </Button>
            </Link>
            <Link href="/wallet">
              <Button className="btn-primary gap-2 text-xs">
                <Plus className="w-3.5 h-3.5" /> Add Asset
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon={DollarSign} label="Total Value" value={`$${totalValue.toLocaleString()}`} color="primary" />
        <StatCard icon={TrendingUp} label="24h P&L" value={`${totalChange >= 0 ? "+" : ""}$${totalChange.toFixed(0)}`} change={totalChange / totalValue * 100} color="success" />
        <StatCard icon={BarChart3} label="Assets" value={HOLDINGS.length.toString()} color="accent" />
        <StatCard icon={Activity} label="Best Performer" value="SKY444" color="warning" />
      </div>

      {/* Allocation visual */}
      <div className="card p-5 mb-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <PieChart className="w-4 h-4 text-primary" /> Allocation
        </h3>
        <div className="flex items-center gap-4 mb-4">
          {/* Simple bar chart allocation */}
          <div className="flex-1 h-4 rounded-full overflow-hidden flex">
            {HOLDINGS.map(h => (
              <div
                key={h.symbol}
                className={`${h.color} transition-all`}
                style={{ width: `${h.allocation}%` }}
                title={`${h.symbol}: ${h.allocation}%`}
              />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {HOLDINGS.map(h => (
            <div key={h.symbol} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${h.color} shrink-0`} />
              <div>
                <div className="text-xs font-semibold">{h.symbol}</div>
                <div className="text-xs text-muted-foreground">{h.allocation}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab toggle */}
      <div className="flex gap-1 bg-secondary/30 rounded-xl p-1 mb-4">
        {(["holdings", "history"] as const).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`flex-1 py-2.5 rounded-lg text-xs font-semibold capitalize transition-all active:scale-[0.97] ${
              view === v ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {v === "holdings" ? "Holdings" : "History"}
          </button>
        ))}
      </div>

      {view === "holdings" && (
        <div className="space-y-2">
          {HOLDINGS.map(h => (
            <Link key={h.symbol} href={h.symbol === "SKY444" ? "/token-metrics" : "/crypto-hub"}>
              <div className="card p-4 flex items-center gap-4 hover:border-slate-700/60 active:scale-[0.99] transition-all cursor-pointer">
                <div className={`w-10 h-10 rounded-full ${h.color} flex items-center justify-center text-white font-bold text-xs shrink-0`}>
                  {h.symbol.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{h.symbol}</div>
                  <div className="text-xs text-muted-foreground">{h.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">{h.amount.toLocaleString()} {h.symbol}</div>
                  <div className="text-xs text-muted-foreground">@ ${h.price.toLocaleString()}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-semibold text-sm">${h.value.toLocaleString()}</div>
                  <div className={`text-xs font-medium flex items-center justify-end gap-0.5 ${h.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {h.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {h.change >= 0 ? "+" : ""}{h.change}%
                  </div>
                </div>
              </div>
            </Link>
          ))}
          <div className="card p-4 border-dashed border-slate-700/50 flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground hover:bg-secondary/20 active:scale-[0.99] transition-all cursor-pointer">
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add asset to portfolio</span>
          </div>
        </div>
      )}

      {view === "history" && (
        <div className="space-y-2">
          {HISTORY.map((h, i) => (
            <div key={i} className="card p-4 flex items-center gap-4">
              <div className="text-sm font-medium text-muted-foreground w-16 shrink-0">{h.date}</div>
              <div className="flex-1 h-1.5 bg-secondary/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-cyan-500 rounded-full"
                  style={{ width: `${(h.value / 11000) * 100}%` }}
                />
              </div>
              <div className="text-sm font-semibold w-20 text-right shrink-0">${h.value.toLocaleString()}</div>
              <div className={`text-xs font-medium w-16 text-right shrink-0 ${h.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                {h.change >= 0 ? "+" : ""}${h.change}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
