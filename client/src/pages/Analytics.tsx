import { useState } from "react";
import { Link } from "wouter";
import { PageHeader } from "@/components/PageHeader";
import { BarChart3, TrendingUp, Users, DollarSign, Eye, Heart, MessageCircle, Share2, ArrowUp, ArrowDown } from "lucide-react";

const DAILY_DATA = [
  { day: "Mon", dau: 2100, revenue: 3200, posts: 890 },
  { day: "Tue", dau: 2400, revenue: 3800, posts: 1020 },
  { day: "Wed", dau: 2200, revenue: 3500, posts: 950 },
  { day: "Thu", dau: 2800, revenue: 4200, posts: 1150 },
  { day: "Fri", dau: 3100, revenue: 4800, posts: 1300 },
  { day: "Sat", dau: 2900, revenue: 4400, posts: 1200 },
  { day: "Sun", dau: 2600, revenue: 3900, posts: 1050 },
];

const TOP_CONTENT = [
  { title: "How I made $10K with SKY444 staking", views: 12400, likes: 892, author: "skyler_blue" },
  { title: "Complete DeFi guide for beginners", views: 9800, likes: 744, author: "defiwhale" },
  { title: "AI coding bot builds 100K lines overnight", views: 8200, likes: 612, author: "cryptodev99" },
  { title: "NFT marketplace launch strategy 2026", views: 7100, likes: 534, author: "nftcreator" },
];

const maxDau = Math.max(...DAILY_DATA.map(d => d.dau));

export default function Analytics() {
  const [metric, setMetric] = useState<"dau"|"revenue"|"posts">("dau");

  return (
    <div className="container py-8 max-w-6xl animate-page-in">
      <PageHeader backHref="/dashboard" icon={BarChart3} title="Analytics Dashboard" subtitle="Platform-wide metrics: DAU/MAU, revenue, content performance, and growth trends" />
      
      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Users, label: "DAU", value: "2,847", change: "+12%", up: true },
          { icon: Users, label: "MAU", value: "...", change: "+8%", up: true },
          { icon: DollarSign, label: "MRR", value: "$44,400", change: "+22%", up: true },
          { icon: Eye, label: "Page Views", value: "144K", change: "+18%", up: true },
        ].map((s, i) => (
          <div key={i} className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <s.icon className="w-4 h-4 text-muted-foreground" />
              <span className={`text-xs flex items-center gap-0.5 ${s.up ? "text-success" : "text-destructive"}`}>
                {s.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}{s.change}
              </span>
            </div>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="card p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Weekly Trend</h3>
          <div className="flex gap-2">
            {(["dau","revenue","posts"] as const).map(m => (
              <button key={m} onClick={() => setMetric(m)} className={`px-3 py-1 rounded text-xs font-medium uppercase transition-colors ${metric === m ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>{m}</button>
            ))}
          </div>
        </div>
        <div className="flex items-end gap-2 h-32">
          {DAILY_DATA.map((d, i) => {
            const val = metric === "dau" ? d.dau : metric === "revenue" ? d.revenue : d.posts;
            const maxVal = metric === "dau" ? maxDau : metric === "revenue" ? 4800 : 1300;
            const pct = (val / maxVal) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-primary/20 rounded-t relative group" style={{height:`${pct}%`}}>
                  <div className="w-full bg-primary rounded-t h-full opacity-80 hover:opacity-100 transition-opacity" />
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 whitespace-nowrap">{val.toLocaleString()}</div>
                </div>
                <span className="text-xs text-muted-foreground">{d.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Content */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-border/50 flex items-center justify-between">
          <h3 className="font-semibold">Top Content This Week</h3>
          <Link href="/social" className="text-xs text-primary hover:underline">View all posts →</Link>
        </div>
        <div className="divide-y divide-border/30">
          {TOP_CONTENT.map((c, i) => (
            <div key={i} className="p-4 flex items-center gap-4 hover:bg-secondary/20 transition-colors">
              <div className="text-2xl font-bold text-muted-foreground/30 w-6 text-center">{i+1}</div>
              <div className="flex-1">
                <div className="font-medium text-sm mb-1">{c.title}</div>
                <div className="text-xs text-muted-foreground">by <Link href={`/creator/${c.author}`} className="text-primary hover:underline">{c.author}</Link></div>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{c.views.toLocaleString()}</span>
                <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{c.likes}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
