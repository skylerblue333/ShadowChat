import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Package, Code2, Gamepad2, Bot, Star, Download, TrendingUp, Filter, Search, ShoppingCart, Zap, Globe, Shield, Database, Layers } from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "All Assets", icon: Layers },
  { id: "saas", label: "SaaS Boilerplates", icon: Globe },
  { id: "automation", label: "Automation Scripts", icon: Bot },
  { id: "ui", label: "UI Components", icon: Code2 },
  { id: "games", label: "Game Assets", icon: Gamepad2 },
  { id: "security", label: "Security Tools", icon: Shield },
  { id: "data", label: "Data Pipelines", icon: Database },
];

const ASSETS = [
  { id: 1, name: "Next.js SaaS Starter", cat: "saas", price: 149, stars: 4.9, downloads: 8420, lang: "TypeScript", desc: "Full auth, Stripe billing, DB, admin panel. Production-ready in minutes.", badge: "BESTSELLER", color: "from-blue-600 to-cyan-600" },
  { id: 2, name: "Stripe + Webhook Engine", cat: "saas", price: 89, stars: 4.8, downloads: 5231, lang: "TypeScript", desc: "Idempotent webhook handler, subscription management, usage-based billing.", badge: "HOT", color: "from-purple-600 to-pink-600" },
  { id: 3, name: "Reddit Sentiment Scraper", cat: "automation", price: 49, stars: 4.7, downloads: 3891, lang: "Python", desc: "Kafka ingestion + NLP scoring. Alerts via Discord webhook.", badge: null, color: "from-orange-600 to-red-600" },
  { id: 4, name: "Slack + Notion Sync Bot", cat: "automation", price: 39, stars: 4.6, downloads: 2847, lang: "Python", desc: "Bi-directional sync between Slack channels and Notion databases.", badge: null, color: "from-green-600 to-teal-600" },
  { id: 5, name: "Shadcn UI Pro Kit", cat: "ui", price: 129, stars: 5.0, downloads: 12400, lang: "TypeScript", desc: "200+ production-grade components. Dark/light, accessible, animated.", badge: "TOP RATED", color: "from-violet-600 to-purple-600" },
  { id: 6, name: "Phaser.js Game Starter", cat: "games", price: 79, stars: 4.8, downloads: 1923, lang: "TypeScript", desc: "Platformer template with physics, tilemaps, particle systems, score.", badge: null, color: "from-amber-600 to-orange-600" },
  { id: 7, name: "Unity Cyberpunk Pack", cat: "games", price: 199, stars: 4.9, downloads: 876, lang: "C#", desc: "50+ cyberpunk assets, shaders, particle effects, UI prefabs.", badge: "PREMIUM", color: "from-cyan-600 to-blue-600" },
  { id: 8, name: "Pentest Automation Suite", cat: "security", price: 299, stars: 4.7, downloads: 1247, lang: "Python", desc: "OWASP Top 10 scanner, SQLi/XSS/CSRF detectors, report generator.", badge: "ENTERPRISE", color: "from-red-600 to-rose-600" },
  { id: 9, name: "Kafka + PostgreSQL Pipeline", cat: "data", price: 119, stars: 4.8, downloads: 2341, lang: "Python", desc: "Time-series partitioning, composite indexes, aiokafka consumer.", badge: null, color: "from-teal-600 to-emerald-600" },
  { id: 10, name: "Multi-tenant SaaS Template", cat: "saas", price: 249, stars: 4.9, downloads: 3102, lang: "TypeScript", desc: "Org management, RBAC, SSO, SOC 2 ready. Enterprise-grade.", badge: "NEW", color: "from-indigo-600 to-blue-600" },
  { id: 11, name: "AI Chatbot Boilerplate", cat: "automation", price: 99, stars: 4.8, downloads: 4567, lang: "TypeScript", desc: "OpenAI/Claude streaming, memory, RAG, function calling.", badge: "HOT", color: "from-pink-600 to-rose-600" },
  { id: 12, name: "Web3 dApp Starter", cat: "saas", price: 179, stars: 4.7, downloads: 1893, lang: "TypeScript", desc: "RainbowKit, wagmi, Hardhat, ERC-20/721 contracts, IPFS.", badge: null, color: "from-amber-600 to-yellow-600" },
];

export default function DeveloperMarketplace() {
  const [cat, setCat] = useState("all");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<number[]>([]);

  const filtered = ASSETS.filter(a =>
    (cat === "all" || a.cat === cat) &&
    (search === "" || a.name.toLowerCase().includes(search.toLowerCase()) || a.desc.toLowerCase().includes(search.toLowerCase()))
  );

  const addToCart = (id: number) => setCart(p => p.includes(id) ? p : [...p, id]);
  const cartTotal = cart.reduce((sum, id) => sum + (ASSETS.find(a => a.id === id)?.price ?? 0), 0);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100">
      <div className="border-b border-slate-800/60 bg-[#0d0d14]/90 backdrop-blur sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white text-lg leading-none">Developer Asset Marketplace</h1>
              <p className="text-xs text-slate-500 mt-0.5">SaaS Boilerplates · Automation Scripts · UI/Game Assets · Security Tools</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />{cart.length} items · ${cartTotal}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Assets", value: ASSETS.length.toString(), icon: Package, color: "text-emerald-400", bg: "bg-emerald-500/10" },
            { label: "Total Downloads", value: "48.7K", icon: Download, color: "text-blue-400", bg: "bg-blue-500/10" },
            { label: "Avg Rating", value: "4.8★", icon: Star, color: "text-amber-400", bg: "bg-amber-500/10" },
            { label: "Revenue Share", value: "70%", icon: TrendingUp, color: "text-purple-400", bg: "bg-purple-500/10" },
          ].map(s => (
            <div key={s.label} className={`rounded-xl border border-slate-800/60 p-4 ${s.bg}`}>
              <div className="flex items-center gap-2 mb-2"><s.icon className={`h-4 w-4 ${s.color}`} /><span className="text-xs text-slate-500">{s.label}</span></div>
              <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search assets..." className="w-full bg-slate-900/60 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500" />
          </div>
          <div className="flex gap-1 flex-wrap">
            {CATEGORIES.map(c => (
              <button key={c.id} onClick={() => setCat(c.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${cat===c.id?"bg-emerald-600 text-white":"bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800"}`}>
                <c.icon className="h-3 w-3" />{c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Asset Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(asset => (
            <div key={asset.id} className="bg-slate-900/40 rounded-2xl border border-slate-800/60 overflow-hidden hover:border-slate-700 transition-all group">
              <div className={`h-2 bg-gradient-to-r ${asset.color}`} />
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-white text-sm">{asset.name}</h3>
                      {asset.badge && <Badge className={`text-xs border-0 px-1.5 py-0 ${asset.badge==="BESTSELLER"?"bg-amber-500/15 text-amber-400":asset.badge==="HOT"?"bg-rose-500/15 text-rose-400":asset.badge==="TOP RATED"?"bg-purple-500/15 text-purple-400":asset.badge==="ENTERPRISE"?"bg-blue-500/15 text-blue-400":asset.badge==="PREMIUM"?"bg-violet-500/15 text-violet-400":"bg-emerald-500/15 text-emerald-400"}`}>{asset.badge}</Badge>}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{asset.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-slate-800 text-slate-400 border-0 text-xs">{asset.lang}</Badge>
                  <span className="text-xs text-amber-400">★ {asset.stars}</span>
                  <span className="text-xs text-slate-600">{asset.downloads.toLocaleString()} downloads</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black text-white">${asset.price}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="border-slate-700 text-slate-400 hover:text-white text-xs">Preview</Button>
                    <Button size="sm" onClick={() => addToCart(asset.id)} className={`text-xs ${cart.includes(asset.id)?"bg-emerald-700 text-white":"bg-emerald-600 hover:bg-emerald-700 text-white"}`}>
                      {cart.includes(asset.id) ? "✓ Added" : <><ShoppingCart className="h-3 w-3 mr-1" />Buy</>}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sell CTA */}
        <div className="bg-gradient-to-br from-emerald-950/30 to-teal-950/20 rounded-2xl border border-emerald-800/30 p-6 text-center">
          <h3 className="font-bold text-white text-lg mb-2">Sell Your Assets</h3>
          <p className="text-sm text-slate-400 mb-4">Keep 70% revenue. Reach 50,000+ developers. Instant payouts in SKY444 or USDT.</p>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Zap className="h-4 w-4 mr-2" />Start Selling
          </Button>
        </div>
      </div>
    </div>
  );
}
