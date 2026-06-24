import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Zap, Users, ShoppingCart, Brain, Heart, Share2, Database, Code, Gem, Building2, ChevronLeft, ArrowUpRight, BarChart3, PieChart, Target, Sparkles } from "lucide-react";

const REVENUE_STREAMS = [
  { id: 1, name: "Platform Transaction Fees", icon: DollarSign, color: "text-purple-400", bg: "bg-purple-600/10 border-purple-500/20", rate: "2.5%", monthly: 48750, annual: 585000, description: "2.5% fee on every transaction across the platform — purchases, tips, transfers, swaps.", model: "Per transaction", status: "live", growth: "+34%" },
  { id: 2, name: "Creator Subscriptions (20% cut)", icon: Users, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20", rate: "20%", monthly: 32400, annual: 388800, description: "Platform keeps 20% of all creator subscription revenue. Creators keep 80%.", model: "Revenue share", status: "live", growth: "+67%" },
  { id: 3, name: "Marketplace Commission", icon: ShoppingCart, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", rate: "15%", monthly: 28900, annual: 346800, description: "15% on digital goods, 8% on physical products. All orders tracked for tax compliance.", model: "Per sale", status: "live", growth: "+45%" },
  { id: 4, name: "Staking Yield Spread", icon: Zap, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20", rate: "8% spread", monthly: 22100, annual: 265200, description: "Platform earns 8% spread on all staking rewards. Users earn 12%, protocol earns 20%, platform takes 8%.", model: "Yield spread", status: "live", growth: "+89%" },
  { id: 5, name: "AI Tool Credits", icon: Brain, color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20", rate: "$0.01/credit", monthly: 18600, annual: 223200, description: "Pay-per-use AI credits for content generation, image creation, code assistance, voice cloning.", model: "Usage-based", status: "live", growth: "+112%" },
  { id: 6, name: "Ad Network (CPM/CPC)", icon: BarChart3, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20", rate: "$8 CPM", monthly: 15400, annual: 184800, description: "Native ads in feed, sponsored content, promoted listings. $8 CPM average across all placements.", model: "CPM/CPC", status: "live", growth: "+28%" },
  { id: 7, name: "Platform Pro Subscriptions", icon: Sparkles, color: "text-pink-400", bg: "bg-pink-500/10 border-pink-500/20", rate: "$9.99–$99.99/mo", monthly: 12800, annual: 153600, description: "Pro ($9.99), Creator Pro ($24.99), Enterprise ($99.99) monthly platform subscriptions.", model: "SaaS", status: "live", growth: "+156%" },
  { id: 8, name: "Charity Platform Rake", icon: Heart, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", rate: "5%", monthly: 8900, annual: 106800, description: "5% platform fee on all charity donations processed through the platform. Transparent and disclosed.", model: "Per donation", status: "live", growth: "+23%" },
  { id: 9, name: "Affiliate Commissions", icon: Share2, color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20", rate: "30% of referred", monthly: 7600, annual: 91200, description: "Earn 30% of revenue from users referred by affiliates. Affiliates earn 10%, platform keeps 20%.", model: "Referral", status: "live", growth: "+78%" },
  { id: 10, name: "Data Licensing API", icon: Database, color: "text-teal-400", bg: "bg-teal-500/10 border-teal-500/20", rate: "$500–$5K/mo", monthly: 6200, annual: 74400, description: "Anonymized trend data, social signals, and market intelligence sold to research firms and hedge funds.", model: "B2B SaaS", status: "beta", growth: "+N/A" },
  { id: 11, name: "NFT Secondary Royalties", icon: Gem, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", rate: "2.5%", monthly: 4800, annual: 57600, description: "2.5% royalty on all NFT secondary sales processed through the platform marketplace.", model: "Per sale", status: "live", growth: "+34%" },
  { id: 12, name: "Enterprise API Access", icon: Building2, color: "text-slate-400", bg: "bg-slate-500/10 border-slate-500/20", rate: "$99.99–$999/mo", monthly: 3400, annual: 40800, description: "Full API access for enterprises. 1M+ requests/month, SLA, dedicated support, white-label options.", model: "Enterprise SaaS", status: "live", growth: "+200%" },
];

const totalMonthly = REVENUE_STREAMS.reduce((s, r) => s + r.monthly, 0);
const totalAnnual = REVENUE_STREAMS.reduce((s, r) => s + r.annual, 0);

export default function Profitability() {
  const [activeStream, setActiveStream] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur px-4 py-3 flex items-center gap-3">
        <Link href="/mega-marketplace">
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground"><ChevronLeft className="h-4 w-4" />Marketplace</Button>
        </Link>
        <span className="font-bold">Revenue Engine</span>
        <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30 text-xs">12 Active Streams</Badge>
        <div className="flex-1" />
        <Link href="/admin-orders">
          <Button size="sm" variant="outline" className="gap-1 border-yellow-500/30 text-yellow-400"><ShoppingCart className="h-4 w-4" />Orders</Button>
        </Link>
      </div>

      <div className="container py-8">
        {/* Hero Stats */}
        <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-green-500/5 to-emerald-500/5 p-6 mb-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30 mb-3">NO CASH FLOW REQUIRED</Badge>
              <h1 className="text-3xl font-black mb-2">Self-Sustaining Revenue Engine</h1>
              <p className="text-muted-foreground max-w-xl">12 interlocked revenue streams that compound on each other. Every user action generates multiple revenue events. Zero dependency on external funding.</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-1">Projected Annual Revenue</p>
              <p className="text-4xl font-black text-purple-400">${(totalAnnual / 1000000).toFixed(2)}M</p>
              <p className="text-sm text-muted-foreground">${(totalMonthly / 1000).toFixed(0)}K/month</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[
              { label: "Revenue Streams", value: "12", color: "text-primary" },
              { label: "Avg Monthly", value: `$${(totalMonthly / 1000).toFixed(0)}K`, color: "text-purple-400" },
              { label: "Fastest Growing", value: "Enterprise API +200%", color: "text-violet-400" },
              { label: "Business Model", value: "No Cash Flow Needed", color: "text-yellow-400" },
            ].map(s => (
              <div key={s.label} className="rounded-xl border border-border/30 bg-background/50 p-3">
                <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Business Model Explanation */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 mb-8">
          <p className="text-sm font-semibold text-primary mb-2">💡 Why This Works Without Cash Flow</p>
          <div className="grid md:grid-cols-3 gap-4 text-xs text-muted-foreground">
            <div><strong className="text-foreground">Token Economy:</strong> SKY444 token creates a closed-loop economy. Users earn tokens through engagement, spend them on platform services, and the platform captures fees at every step — no fiat needed.</div>
            <div><strong className="text-foreground">Compounding Flywheel:</strong> More users → more content → more AI tool usage → more marketplace sales → more staking → higher token value → attracts more users. Each stream feeds the others.</div>
            <div><strong className="text-foreground">Zero Marginal Cost:</strong> AI tools, digital goods, and subscriptions have near-zero marginal cost. Once infrastructure is built, every additional user is almost pure profit.</div>
          </div>
        </div>

        {/* Revenue Streams Grid */}
        <h2 className="text-xl font-bold mb-4">All 12 Revenue Streams</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {REVENUE_STREAMS.map(stream => (
            <div key={stream.id} onClick={() => setActiveStream(activeStream === stream.id ? null : stream.id)} className={`rounded-xl border cursor-pointer transition-all hover:border-primary/30 ${stream.bg} ${activeStream === stream.id ? "border-primary/50" : ""}`}>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${stream.bg}`}>
                      <stream.icon className={`h-4 w-4 ${stream.color}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{stream.name}</p>
                      <p className="text-xs text-muted-foreground">{stream.model} · {stream.rate}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-black ${stream.color}`}>${(stream.monthly / 1000).toFixed(1)}K</p>
                    <p className="text-xs text-muted-foreground">/month</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${stream.status === "live" ? "bg-purple-600/20 text-purple-400 border-purple-500/30" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"}`}>
                      {stream.status === "live" ? "● Live" : "⚡ Beta"}
                    </Badge>
                    <span className="text-xs text-purple-400 font-semibold">{stream.growth}</span>
                  </div>
                  <ArrowUpRight className={`h-4 w-4 transition-transform ${activeStream === stream.id ? "rotate-45" : ""} ${stream.color}`} />
                </div>
                {activeStream === stream.id && (
                  <div className="mt-3 pt-3 border-t border-border/30">
                    <p className="text-xs text-muted-foreground">{stream.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">Annual projection</span>
                      <span className={`text-sm font-bold ${stream.color}`}>${(stream.annual / 1000).toFixed(0)}K/yr</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Revenue Bar Chart */}
        <div className="rounded-xl border border-border/50 bg-card/30 p-6 mb-8">
          <h3 className="font-semibold mb-4">Revenue Distribution</h3>
          <div className="space-y-3">
            {REVENUE_STREAMS.sort((a, b) => b.monthly - a.monthly).map(stream => (
              <div key={stream.id} className="flex items-center gap-3">
                <p className="text-xs text-muted-foreground w-48 truncate">{stream.name}</p>
                <div className="flex-1 h-6 rounded-full bg-border/30 overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${stream.color.replace("text-", "bg-").replace("-400", "-500")}`} style={{ width: `${(stream.monthly / REVENUE_STREAMS[0].monthly) * 100}%`, opacity: 0.7 }} />
                </div>
                <p className={`text-xs font-bold w-16 text-right ${stream.color}`}>${(stream.monthly / 1000).toFixed(1)}K</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-primary/5 to-purple-500/5 p-8 text-center">
          <Target className="h-12 w-12 text-primary mx-auto mb-3" />
          <h2 className="text-2xl font-bold mb-2">$2.62M Annual Revenue Target</h2>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">All 12 streams are live and compounding. No external funding required. The platform pays for itself and grows.</p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/admin-orders"><Button className="gap-2"><ShoppingCart className="h-4 w-4" />View Orders</Button></Link>
            <Link href="/analytics"><Button variant="outline" className="gap-2"><BarChart3 className="h-4 w-4" />Full Analytics</Button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
