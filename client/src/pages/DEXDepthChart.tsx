import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ComposedChart, Bar, Line, Legend
} from "recharts";
import { TrendingUp, TrendingDown, Droplets, Activity, RefreshCw, ArrowUpDown } from "lucide-react";

const PAIRS = [
  { id: "SKY444-USDT", base: "SKY444", quote: "USDT", price: 4.44, change: 44.4, volume: 2840000, tvl: 18200000 },
  { id: "TRUMP-USDT", base: "TRUMP", quote: "USDT", price: 12.85, change: 8.2, volume: 9120000, tvl: 45600000 },
  { id: "ETH-USDT", base: "ETH", quote: "USDT", price: 3891.2, change: 1.12, volume: 142000000, tvl: 890000000 },
  { id: "BTC-USDT", base: "BTC", quote: "USDT", price: 67420.5, change: 2.34, volume: 890000000, tvl: 4200000000 },
  { id: "SOL-USDT", base: "SOL", quote: "USDT", price: 189.3, change: 5.67, volume: 28400000, tvl: 142000000 },
];

function generateDepthData(midPrice: number, spread = 0.02) {
  const bids: { price: number; cumBid: number; bid: number }[] = [];
  const asks: { price: number; cumAsk: number; ask: number }[] = [];
  let cumBid = 0;
  let cumAsk = 0;

  for (let i = 50; i >= 1; i--) {
    const price = midPrice * (1 - (i / 50) * spread * 3);
    const size = Math.random() * 50000 + 5000 + (i < 10 ? 80000 : 0);
    cumBid += size;
    bids.push({ price: parseFloat(price.toFixed(4)), cumBid: parseFloat((cumBid / 1000).toFixed(2)), bid: parseFloat((size / 1000).toFixed(2)) });
  }

  for (let i = 1; i <= 50; i++) {
    const price = midPrice * (1 + (i / 50) * spread * 3);
    const size = Math.random() * 50000 + 5000 + (i < 10 ? 80000 : 0);
    cumAsk += size;
    asks.push({ price: parseFloat(price.toFixed(4)), cumAsk: parseFloat((cumAsk / 1000).toFixed(2)), ask: parseFloat((size / 1000).toFixed(2)) });
  }

  return { bids, asks };
}

function generateOHLCV(basePrice: number, count = 60) {
  const data = [];
  let price = basePrice;
  for (let i = count; i >= 0; i--) {
    const change = (Math.random() - 0.48) * price * 0.02;
    const open = price;
    price = Math.max(price + change, price * 0.8);
    const high = Math.max(open, price) * (1 + Math.random() * 0.005);
    const low = Math.min(open, price) * (1 - Math.random() * 0.005);
    const volume = Math.random() * 500000 + 50000;
    data.push({
      time: new Date(Date.now() - i * 3600000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      open: parseFloat(open.toFixed(4)),
      close: parseFloat(price.toFixed(4)),
      high: parseFloat(high.toFixed(4)),
      low: parseFloat(low.toFixed(4)),
      volume: parseFloat((volume / 1000).toFixed(1)),
    });
  }
  return data;
}

function DepthChart({ bids, asks }: { bids: any[]; asks: any[] }) {
  const combined = [
    ...bids.map(b => ({ price: b.price, cumBid: b.cumBid, cumAsk: null })),
    ...asks.map(a => ({ price: a.price, cumBid: null, cumAsk: a.cumAsk })),
  ].sort((a, b) => a.price - b.price);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={combined} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="bidGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="askGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="price" tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false}
          tickFormatter={v => typeof v === "number" ? (v > 1000 ? `$${(v/1000).toFixed(1)}K` : `$${v.toFixed(2)}`) : v} />
        <YAxis tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}K`} />
        <Tooltip
          contentStyle={{ background: "#0e0a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
          labelStyle={{ color: "#94a3b8", fontSize: 11 }}
          formatter={(value: any, name: string) => [`${value}K`, name === "cumBid" ? "Bid Depth" : "Ask Depth"]}
        />
        <Area type="stepAfter" dataKey="cumBid" stroke="#22c55e" strokeWidth={1.5} fill="url(#bidGrad)" connectNulls={false} />
        <Area type="stepAfter" dataKey="cumAsk" stroke="#ef4444" strokeWidth={1.5} fill="url(#askGrad)" connectNulls={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function PriceChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 9 }} tickLine={false} axisLine={false} interval={9} />
        <YAxis yAxisId="price" tick={{ fill: "#64748b", fontSize: 9 }} tickLine={false} axisLine={false}
          tickFormatter={v => v > 1000 ? `$${(v/1000).toFixed(1)}K` : `$${v.toFixed(2)}`} domain={["auto", "auto"]} />
        <YAxis yAxisId="vol" orientation="right" tick={{ fill: "#64748b", fontSize: 9 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}K`} />
        <Tooltip
          contentStyle={{ background: "#0e0a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
          labelStyle={{ color: "#94a3b8", fontSize: 11 }}
        />
        <Bar yAxisId="vol" dataKey="volume" fill="rgba(139,92,246,0.2)" radius={[2, 2, 0, 0]} />
        <Line yAxisId="price" type="monotone" dataKey="close" stroke="#8b5cf6" strokeWidth={1.5} dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export default function DEXDepthChart() {
  const [selectedPair, setSelectedPair] = useState(PAIRS[0].id);
  const [tab, setTab] = useState<"depth" | "price" | "pools">("depth");

  const pair = PAIRS.find(p => p.id === selectedPair) || PAIRS[0];
  const { bids, asks } = useMemo(() => generateDepthData(pair.price), [pair.id]);
  const ohlcv = useMemo(() => generateOHLCV(pair.price), [pair.id]);

  const topBids = bids.slice(-10).reverse();
  const topAsks = asks.slice(0, 10);
  const spread = asks[0]?.price - bids[bids.length - 1]?.price;
  const spreadPct = ((spread / pair.price) * 100).toFixed(3);

  return (
    <div className="min-h-screen bg-[#07050f] text-white p-4">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/20 flex items-center justify-center">
              <Droplets className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white">DEX Liquidity Pools</h1>
              <p className="text-slate-500 text-xs">Depth charts · Order books · Pool analytics</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedPair} onValueChange={setSelectedPair}>
              <SelectTrigger className="w-44 bg-white/5 border-white/10 text-white h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#0e0a1a] border-white/10">
                {PAIRS.map(p => (
                  <SelectItem key={p.id} value={p.id} className="text-white hover:bg-white/5">
                    <span className="flex items-center gap-2">
                      <span className="font-mono">{p.base}/{p.quote}</span>
                      <span className={`text-xs ${p.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {p.change >= 0 ? "+" : ""}{p.change}%
                      </span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" variant="outline" className="border-white/10 text-slate-400 h-9">
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Pair stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Price", value: pair.price > 1000 ? `$${pair.price.toLocaleString()}` : `$${pair.price}`, sub: `${pair.change >= 0 ? "+" : ""}${pair.change}%`, color: pair.change >= 0 ? "text-green-400" : "text-red-400" },
            { label: "24h Volume", value: `$${(pair.volume / 1000000).toFixed(2)}M`, sub: "24h", color: "text-cyan-400" },
            { label: "TVL", value: `$${(pair.tvl / 1000000).toFixed(1)}M`, sub: "Total Value Locked", color: "text-purple-400" },
            { label: "Spread", value: `${spreadPct}%`, sub: `$${spread.toFixed(4)}`, color: "text-yellow-400" },
          ].map(stat => (
            <div key={stat.label} className="bg-[#0e0a1a] border border-white/5 rounded-xl p-3">
              <p className="text-xs text-slate-500 mb-1">{stat.label}</p>
              <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-slate-600">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Tab selector */}
        <div className="flex gap-1 bg-white/5 rounded-xl p-1 w-fit">
          {(["depth", "price", "pools"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${tab === t ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "text-slate-500 hover:text-slate-300"}`}>
              {t === "depth" ? "Depth Chart" : t === "price" ? "Price Chart" : "Pools"}
            </button>
          ))}
        </div>

        {tab === "depth" && (
          <div className="grid lg:grid-cols-3 gap-4">
            {/* Depth chart */}
            <div className="lg:col-span-2 bg-[#0e0a1a] border border-white/5 rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" />
                Order Book Depth — {pair.base}/{pair.quote}
              </h3>
              <DepthChart bids={bids} asks={asks} />
              <div className="flex items-center justify-center gap-6 mt-2">
                <div className="flex items-center gap-1.5 text-xs text-green-400">
                  <div className="w-3 h-0.5 bg-green-400 rounded" />
                  Bids (Buy Orders)
                </div>
                <div className="flex items-center gap-1.5 text-xs text-red-400">
                  <div className="w-3 h-0.5 bg-red-400 rounded" />
                  Asks (Sell Orders)
                </div>
              </div>
            </div>

            {/* Order book */}
            <div className="bg-[#0e0a1a] border border-white/5 rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Order Book</h3>
              <div className="space-y-0.5">
                <div className="grid grid-cols-3 text-[10px] text-slate-600 mb-2 px-1">
                  <span>Price</span>
                  <span className="text-right">Size (K)</span>
                  <span className="text-right">Total (K)</span>
                </div>
                {topAsks.reverse().map((ask, i) => (
                  <div key={i} className="grid grid-cols-3 text-xs px-1 py-0.5 hover:bg-red-500/5 rounded relative">
                    <div className="absolute inset-0 right-0 bg-red-500/5 rounded" style={{ width: `${Math.min((ask.cumAsk / (topAsks[topAsks.length-1]?.cumAsk || 1)) * 100, 100)}%`, right: 0, left: "auto" }} />
                    <span className="text-red-400 font-mono relative z-10">${ask.price.toFixed(pair.price > 100 ? 2 : 4)}</span>
                    <span className="text-right text-slate-400 relative z-10">{ask.ask}</span>
                    <span className="text-right text-slate-500 relative z-10">{ask.cumAsk}</span>
                  </div>
                ))}
                <div className="py-2 text-center">
                  <span className="text-sm font-bold text-white font-mono">${pair.price.toLocaleString()}</span>
                  <Badge className={`ml-2 text-[9px] ${pair.change >= 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"} border-0`}>
                    {pair.change >= 0 ? "▲" : "▼"} {Math.abs(pair.change)}%
                  </Badge>
                </div>
                {topBids.map((bid, i) => (
                  <div key={i} className="grid grid-cols-3 text-xs px-1 py-0.5 hover:bg-green-500/5 rounded relative">
                    <div className="absolute inset-0 bg-green-500/5 rounded" style={{ width: `${Math.min((bid.cumBid / (topBids[topBids.length-1]?.cumBid || 1)) * 100, 100)}%` }} />
                    <span className="text-green-400 font-mono relative z-10">${bid.price.toFixed(pair.price > 100 ? 2 : 4)}</span>
                    <span className="text-right text-slate-400 relative z-10">{bid.bid}</span>
                    <span className="text-right text-slate-500 relative z-10">{bid.cumBid}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "price" && (
          <div className="bg-[#0e0a1a] border border-white/5 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              Price & Volume — {pair.base}/{pair.quote} (1H candles)
            </h3>
            <PriceChart data={ohlcv} />
          </div>
        )}

        {tab === "pools" && (
          <div className="space-y-3">
            {PAIRS.map(p => (
              <div key={p.id} className="bg-[#0e0a1a] border border-white/5 rounded-xl p-4 flex items-center justify-between hover:border-purple-500/20 transition-all cursor-pointer" onClick={() => { setSelectedPair(p.id); setTab("depth"); }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
                    <span className="text-sm font-bold text-purple-400">{p.base[0]}</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{p.base}/{p.quote}</p>
                    <p className="text-slate-500 text-xs">TVL: ${(p.tvl / 1000000).toFixed(1)}M</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-mono text-sm">${p.price.toLocaleString()}</p>
                  <p className={`text-xs ${p.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {p.change >= 0 ? "+" : ""}{p.change}% · Vol ${(p.volume / 1000000).toFixed(1)}M
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs h-7">Add Liquidity</Button>
                  <Button size="sm" className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs h-7">
                    <ArrowUpDown className="w-3 h-3 mr-1" />Swap
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
