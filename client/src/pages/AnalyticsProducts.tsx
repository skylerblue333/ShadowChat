/**
 * AnalyticsProducts — Phase 10 Data Economy
 * Monetizable analytics products built on the data lake
 */
import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, BarChart2, TrendingUp, Users, DollarSign, Eye, Zap, ShoppingBag, Star, Globe } from "lucide-react";

const PRODUCTS = [
  {
    name: "Creator Insights Pro",
    desc: "Deep analytics for content creators — audience demographics, optimal posting times, revenue attribution",
    price: "49 SKY/mo",
    subscribers: 1240,
    category: "creator",
    icon: BarChart2,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    name: "Trend Intelligence",
    desc: "Real-time trending topics, viral content prediction, and market sentiment analysis",
    price: "29 SKY/mo",
    subscribers: 890,
    category: "market",
    icon: TrendingUp,
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  {
    name: "Audience Builder",
    desc: "Find and target your ideal audience using behavioral signals and interest graphs",
    price: "39 SKY/mo",
    subscribers: 620,
    category: "growth",
    icon: Users,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    name: "Revenue Attribution",
    desc: "Track which content, actions, and channels drive your SKY earnings",
    price: "59 SKY/mo",
    subscribers: 340,
    category: "monetization",
    icon: DollarSign,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
  {
    name: "Community Intelligence",
    desc: "Health scores, engagement heatmaps, and growth forecasts for community managers",
    price: "35 SKY/mo",
    subscribers: 480,
    category: "community",
    icon: Globe,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    name: "Token Analytics",
    desc: "On-chain analytics, holder distribution, staking patterns, and DeFi flow analysis",
    price: "79 SKY/mo",
    subscribers: 210,
    category: "defi",
    icon: Zap,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
];

export default function AnalyticsProducts() {
  const [activeCategory, setActiveCategory] = useState("all");
  const categories = ["all", "creator", "market", "growth", "monetization", "community", "defi"];
  const filtered = activeCategory === "all" ? PRODUCTS : PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
        <Link href="/" className="p-2 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-bold text-lg">Analytics Products</h1>
          <p className="text-xs text-muted-foreground">Data-powered intelligence products</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Active Products", value: "6", icon: ShoppingBag, color: "text-blue-400" },
            { label: "Total Subscribers", value: "3.8K", icon: Users, color: "text-green-400" },
            { label: "Monthly Revenue", value: "142K SKY", icon: DollarSign, color: "text-yellow-400" },
          ].map(stat => (
            <div key={stat.label} className="card p-3 text-center">
              <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-1`} />
              <div className="font-bold text-sm">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize whitespace-nowrap transition-colors ${activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground hover:text-foreground"}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map(product => (
            <div key={product.name} className="card p-4">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl ${product.bg} flex items-center justify-center shrink-0`}>
                  <product.icon className={`w-5 h-5 ${product.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold text-sm">{product.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{product.desc}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-sm text-primary">{product.price}</div>
                      <div className="text-xs text-muted-foreground">{product.subscribers.toLocaleString()} subs</div>
                    </div>
                  </div>
                  <button className="mt-3 w-full py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-xs font-medium transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
