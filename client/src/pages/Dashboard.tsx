import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";
import {
  BarChart3, Users, TrendingUp, Coins, Activity, Bot, GraduationCap,
  Gamepad2, Store, Vote, Heart, Wallet, Trophy, MessageCircle,
  Radio, Rocket, Brain, Zap, Star, Globe, Settings,
  ChevronRight, Shield, ArrowUpRight, ArrowDownRight, Bell,
  Cpu, DollarSign, Target, Award, Flame, Eye, Play, Music
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Skyler's uploaded photos
const SKYLER_PHOTOS = {
  family: "/manus-storage/skyler-family_435e8f25.png",
  cards: "/manus-storage/skyler-cards_dc0c415b.png",
  chess: "/manus-storage/chess_5c5be010.png",
  nikes: "/manus-storage/nikes_fa893a4d.png",
  innovativeIT: "/manus-storage/innovative-it_e43e1089.png",
};

// Live activity feed items
const LIVE_ACTIVITIES = [
  { icon: TrendingUp, color: "bg-amber-900/60 text-amber-400", title: "BTC/USDT trade executed: +$2,400 profit", sub: "Market order filled at $67,400", time: "2s ago" },
  { icon: Bot, color: "bg-teal-900/60 text-teal-400", title: "HOPE AI: Market breakout detected — BTC", sub: "Automated trading signal generated", time: "14s ago" },
  { icon: Heart, color: "bg-rose-900/60 text-rose-400", title: "New match: Alex Rivera (98% compatibility)", sub: "Profile view and message sent", time: "1m ago" },
  { icon: Coins, color: "bg-purple-900/60 text-purple-400", title: "Staking reward claimed: +847 SKY444", sub: "Auto-compound enabled — 18.4% APY", time: "3m ago" },
  { icon: Trophy, color: "bg-yellow-900/60 text-yellow-400", title: "Tournament win: Crypto Quiz Blitz", sub: "Earned 2,500 SKY444 prize", time: "7m ago" },
  { icon: Store, color: "bg-blue-900/60 text-blue-400", title: "Order shipped: AirPods Pro Clone", sub: "Tracking: YT847291CN — Est. 7 days", time: "12m ago" },
  { icon: GraduationCap, color: "bg-emerald-900/60 text-emerald-400", title: "Course completed: DeFi Fundamentals", sub: "Certificate minted on-chain", time: "1h ago" },
  { icon: Radio, color: "bg-red-900/60 text-red-400", title: "Stream went live: Crypto Market Analysis", sub: "247 viewers joined in first 5 minutes", time: "2h ago" },
];

// Crypto price data (simulated sparkline)
const generateSparkline = (base: number, volatility: number, points = 20) => {
  const data = [];
  let price = base;
  for (let i = 0; i < points; i++) {
    price = price * (1 + (Math.random() - 0.48) * volatility);
    data.push(price);
  }
  return data;
};

const CRYPTO_CARDS = [
  { symbol: "TRUMP", name: "Trump Coin", price: 8.72, change: 18.2, held: "10.0K", color: "#f59e0b", data: generateSparkline(8, 0.04) },
  { symbol: "SKY444", name: "SkyCoin 4444", price: 0.01, change: 44.4, held: "1.2M", color: "#06b6d4", data: generateSparkline(0.01, 0.06) },
  { symbol: "BTC", name: "Bitcoin", price: 67400, change: 3.2, held: "0.042", color: "#f97316", data: generateSparkline(67400, 0.02) },
  { symbol: "ETH", name: "Ethereum", price: 3240, change: -1.8, held: "1.5", color: "#8b5cf6", data: generateSparkline(3240, 0.03) },
];

function SparklineChart({ data, color, positive }: { data: number[]; color: string; positive: boolean }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 120, h = 48;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={(data.length - 1) / (data.length - 1) * w} cy={h - ((data[data.length - 1] - min) / range) * h} r="3" fill={color} />
    </svg>
  );
}

const QUICK_LINKS = [
  { icon: Bot, name: "HOPE AI", href: "/hope-ai", color: "text-teal-400", bg: "bg-teal-500/10" },
  { icon: Brain, name: "AI Brain", href: "/ai-brain", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { icon: GraduationCap, name: "Sky School", href: "/school", color: "text-blue-400", bg: "bg-blue-500/10" },
  { icon: Gamepad2, name: "Games", href: "/gaming-for-charity", color: "text-yellow-400", bg: "bg-yellow-500/10" },
  { icon: TrendingUp, name: "Trading", href: "/trading", color: "text-purple-400", bg: "bg-purple-500/10" },
  { icon: Coins, name: "Staking", href: "/staking", color: "text-amber-400", bg: "bg-amber-500/10" },
  { icon: Store, name: "Marketplace", href: "/mega-marketplace", color: "text-pink-400", bg: "bg-pink-500/10" },
  { icon: Radio, name: "Streams", href: "/streaming", color: "text-red-400", bg: "bg-red-500/10" },
  { icon: Vote, name: "Governance", href: "/governance", color: "text-indigo-400", bg: "bg-indigo-500/10" },
  { icon: Heart, name: "Charity", href: "/charity", color: "text-rose-400", bg: "bg-rose-500/10" },
  { icon: Rocket, name: "ICO", href: "/ico", color: "text-orange-400", bg: "bg-orange-500/10" },
  { icon: Trophy, name: "Tournaments", href: "/tournaments", color: "text-cyan-400", bg: "bg-cyan-500/10" },
];

const PLATFORM_STATS = [
  { label: "Total Users", value: "847K", change: "+12.4%", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
  { label: "SKY444 Price", value: "$0.01", change: "+44.4%", icon: Coins, color: "text-amber-400", bg: "bg-amber-500/10" },
  { label: "Total Staked", value: "$4.2M", change: "+8.7%", icon: Shield, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { label: "Daily Volume", value: "$1.8M", change: "+23.1%", icon: Activity, color: "text-purple-400", bg: "bg-purple-500/10" },
];

export default function Dashboard() {
  const { user, loading: isLoading } = useAuth();
  const [activityIdx, setActivityIdx] = useState(0);
  const [onlineCount] = useState(() => Math.floor(Math.random() * 5000) + 12000);

  useEffect(() => {
    const t = setInterval(() => setActivityIdx(i => (i + 1) % LIVE_ACTIVITIES.length), 4000);
    return () => clearInterval(t);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center mx-auto mb-6">
            <Zap className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white mb-3">Welcome to SkyCoin4444</h1>
          <p className="text-slate-400 mb-8">The world's most advanced Web3 social ecosystem. AI · DeFi · Gaming · Creator Economy.</p>
          <a href={getLoginUrl()} className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold px-8 py-4 rounded-2xl text-lg hover:opacity-90 transition-opacity">
            <Zap className="h-5 w-5" /> Enter the Ecosystem
          </a>
        </div>
      </div>
    );
  }

  const isOwner = user.name === "Skyler blue" || user.openId === user.openId;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#0a0a0f]/95 backdrop-blur border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="text-slate-400 hover:text-white transition-colors">
              <ChevronRight className="h-5 w-5 rotate-180" />
            </button>
            <h1 className="font-bold text-white text-lg">{user.name}'s Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/25 text-xs gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              Online
            </Badge>
            <button className="relative text-slate-400 hover:text-white transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-bold">3</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* Owner Profile Card — Skyler's photos */}
        {isOwner && (
          <div className="rounded-2xl border border-slate-800/60 bg-gradient-to-br from-slate-900/80 to-slate-950/80 overflow-hidden">
            <div className="relative h-32 bg-gradient-to-r from-cyan-900/40 via-purple-900/40 to-slate-900/40">
              <img src={SKYLER_PHOTOS.innovativeIT} alt="Innovative IT Resolutions" className="w-full h-full object-cover opacity-30" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
            </div>
            <div className="px-6 pb-6 -mt-12 relative">
              <div className="flex items-end gap-4 mb-4">
                <div className="relative">
                  <img src={SKYLER_PHOTOS.family} alt="Skyler" className="w-20 h-20 rounded-2xl border-4 border-slate-950 object-cover" />
                  <span className="absolute bottom-1 right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-black text-white">Skyler blue</h2>
                  <p className="text-sm text-slate-400">Software Engineer · Innovative IT Resolutions LLC</p>
                  <p className="text-xs text-cyan-400 mt-0.5">@skycoin4444 · Platform Founder</p>
                </div>
                <div className="flex gap-2">
                  <Link href="/profile">
                    <Button size="sm" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 text-xs">Edit Profile</Button>
                  </Link>
                  <Link href="/creator-studio">
                    <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-xs border-0">Creator Studio</Button>
                  </Link>
                </div>
              </div>
              {/* Photo gallery strip */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {[SKYLER_PHOTOS.cards, SKYLER_PHOTOS.chess, SKYLER_PHOTOS.nikes, SKYLER_PHOTOS.family].map((src, i) => (
                  <img key={i} src={src} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-700/50 hover:border-cyan-500/50 transition-colors cursor-pointer" />
                ))}
                <div className="w-16 h-16 rounded-xl border border-dashed border-slate-700 flex items-center justify-center shrink-0 cursor-pointer hover:border-cyan-500/50 transition-colors">
                  <span className="text-slate-500 text-2xl">+</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Platform Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {PLATFORM_STATS.map(s => (
            <div key={s.label} className={`rounded-2xl border border-slate-800/60 p-4 ${s.bg} relative overflow-hidden`}>
              <div className="flex items-center gap-2 mb-2">
                <s.icon className={`h-4 w-4 ${s.color}`} />
                <span className="text-xs text-slate-500">{s.label}</span>
              </div>
              <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-3 w-3 text-emerald-400" />
                <span className="text-xs text-emerald-400 font-medium">{s.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Crypto Portfolio Cards */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-white">Portfolio</h2>
            <Link href="/wallet" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">View All <ChevronRight className="h-3 w-3" /></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {CRYPTO_CARDS.map(c => (
              <div key={c.symbol} className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-4 hover:border-slate-700 transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-xs text-slate-500 mb-0.5">{c.name}</div>
                    <div className="font-black text-white text-lg">{c.symbol}</div>
                  </div>
                  <Badge className={`text-xs border-0 font-bold ${c.change >= 0 ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}>
                    {c.change >= 0 ? "+" : ""}{c.change}%
                  </Badge>
                </div>
                <SparklineChart data={c.data} color={c.color} positive={c.change >= 0} />
                <div className="mt-3 flex justify-between text-sm">
                  <span className="text-slate-400">Price</span>
                  <span className="font-bold text-white">${c.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-slate-400">Held</span>
                  <span className="font-bold text-white">{c.held} held</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white flex items-center gap-2">
              Live Activity
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
            </h2>
            <span className="text-xs text-slate-500">{onlineCount.toLocaleString()} online now</span>
          </div>
          <div className="space-y-3">
            {LIVE_ACTIVITIES.slice(0, 5).map((a, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border border-slate-800/40 bg-slate-950/40 transition-all ${i === 0 ? "border-cyan-500/20 bg-cyan-500/5" : ""}`}>
                <div className={`w-10 h-10 rounded-xl ${a.color} flex items-center justify-center shrink-0`}>
                  <a.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white leading-tight">{a.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{a.sub}</p>
                </div>
                <span className="text-xs text-slate-600 shrink-0">{a.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links Grid */}
        <div>
          <h2 className="font-bold text-white mb-3">Quick Access</h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-2">
            {QUICK_LINKS.map(l => (
              <Link key={l.name} href={l.href}>
                <div className={`rounded-xl border border-slate-800/60 ${l.bg} p-3 flex flex-col items-center gap-2 hover:border-slate-700 transition-all cursor-pointer group`}>
                  <l.icon className={`h-5 w-5 ${l.color} group-hover:scale-110 transition-transform`} />
                  <span className="text-[10px] text-slate-400 font-medium text-center leading-tight">{l.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Sky School */}
          <Link href="/school">
            <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-950/30 to-slate-950/60 p-5 hover:border-blue-500/40 transition-all cursor-pointer group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Sky School</h3>
                  <p className="text-xs text-slate-500">12 courses · 847 students</p>
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-3">Master Web3, AI, DeFi, and blockchain development with on-chain certificates.</p>
              <div className="flex items-center gap-1 text-blue-400 text-xs font-medium group-hover:gap-2 transition-all">
                Start Learning <ArrowUpRight className="h-3 w-3" />
              </div>
            </div>
          </Link>

          {/* HOPE AI */}
          <Link href="/hope-ai">
            <div className="rounded-2xl border border-teal-500/20 bg-gradient-to-br from-teal-950/30 to-slate-950/60 p-5 hover:border-teal-500/40 transition-all cursor-pointer group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-teal-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white">HOPE AI</h3>
                  <p className="text-xs text-slate-500">Voice · Avatar · 44 Agents</p>
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-3">Your AI companion with voice commands, real-time market analysis, and autonomous agents.</p>
              <div className="flex items-center gap-1 text-teal-400 text-xs font-medium group-hover:gap-2 transition-all">
                Talk to HOPE <ArrowUpRight className="h-3 w-3" />
              </div>
            </div>
          </Link>

          {/* Gaming for Charity */}
          <Link href="/gaming-for-charity">
            <div className="rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-yellow-950/30 to-slate-950/60 p-5 hover:border-yellow-500/40 transition-all cursor-pointer group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                  <Gamepad2 className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white">44 Games</h3>
                  <p className="text-xs text-slate-500">Play · Earn · Donate</p>
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-3">44 playable browser games where gameplay earns SKY444 and funds real charities.</p>
              <div className="flex items-center gap-1 text-yellow-400 text-xs font-medium group-hover:gap-2 transition-all">
                Play Now <ArrowUpRight className="h-3 w-3" />
              </div>
            </div>
          </Link>
        </div>

        {/* Innovative IT Resolutions Banner */}
        <div className="rounded-2xl border border-slate-700/40 overflow-hidden relative">
          <img src={SKYLER_PHOTOS.innovativeIT} alt="Innovative IT Resolutions LLC" className="w-full h-40 object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent flex items-center px-6">
            <div>
              <p className="text-xs text-cyan-400 font-medium mb-1">POWERED BY</p>
              <h3 className="text-xl font-black text-white">Innovative IT Resolutions LLC</h3>
              <p className="text-sm text-slate-400">A Decade of Engineering Excellence</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
