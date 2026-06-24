/**
 * AIAgentMarket — Day-1 Revenue Engine
 * Pay-per-use AI agents with pricing tiers, value gap engine, upsell
 */
import { useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft, Bot, Zap, Lock, CheckCircle2, Star, DollarSign,
  Briefcase, Image, FileText, TrendingUp, Users, Code2, Music,
  ShoppingBag, Mic, Crown, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Agent {
  id: string;
  icon: React.ElementType;
  name: string;
  tagline: string;
  freePreview: string;
  paidResult: string;
  basicPrice: number;
  premiumPrice: number;
  powerPrice: number;
  category: string;
  usageCount: number;
  rating: number;
}

const AGENTS: Agent[] = [
  {
    id: "logo-designer",
    icon: Image,
    name: "Logo Designer AI",
    tagline: "Professional logo concepts in 30 seconds",
    freePreview: "3 generic logo ideas with basic descriptions",
    paidResult: "10 custom logo concepts + SVG files + brand color palette",
    basicPrice: 2.99,
    premiumPrice: 9.99,
    powerPrice: 24.99,
    category: "Design",
    usageCount: 1847,
    rating: 4.8,
  },
  {
    id: "gig-finder",
    icon: Briefcase,
    name: "Gig Finder AI",
    tagline: "Find paid work matching your skills instantly",
    freePreview: "3 generic job tips for your field",
    paidResult: "AI applies to 20 matching gigs + optimizes your profile + sends personalized pitches",
    basicPrice: 3.99,
    premiumPrice: 12.99,
    powerPrice: 29.99,
    category: "Career",
    usageCount: 3241,
    rating: 4.7,
  },
  {
    id: "resume-builder",
    icon: FileText,
    name: "Resume Builder AI",
    tagline: "ATS-optimized resume in under 2 minutes",
    freePreview: "Basic resume template with placeholder text",
    paidResult: "Full ATS-optimized resume + cover letter + LinkedIn summary + keyword analysis",
    basicPrice: 4.99,
    premiumPrice: 14.99,
    powerPrice: 34.99,
    category: "Career",
    usageCount: 5102,
    rating: 4.9,
  },
  {
    id: "social-growth",
    icon: TrendingUp,
    name: "Social Growth AI",
    tagline: "Grow your audience with AI-generated content strategy",
    freePreview: "5 generic content tips for your niche",
    paidResult: "30-day content calendar + 50 post scripts + hashtag strategy + growth analytics",
    basicPrice: 5.99,
    premiumPrice: 19.99,
    powerPrice: 49.99,
    category: "Marketing",
    usageCount: 2789,
    rating: 4.6,
  },
  {
    id: "code-reviewer",
    icon: Code2,
    name: "Code Review AI",
    tagline: "Security audit + performance optimization in seconds",
    freePreview: "Basic syntax check + 3 generic improvement tips",
    paidResult: "Full security audit + performance analysis + refactored code + documentation",
    basicPrice: 4.99,
    premiumPrice: 14.99,
    powerPrice: 39.99,
    category: "Dev",
    usageCount: 1923,
    rating: 4.8,
  },
  {
    id: "bio-writer",
    icon: Mic,
    name: "Bio Writer AI",
    tagline: "Compelling personal brand bio for any platform",
    freePreview: "Generic bio template with your name inserted",
    paidResult: "5 custom bios (Twitter, LinkedIn, website, press, dating) + headline variations",
    basicPrice: 1.99,
    premiumPrice: 6.99,
    powerPrice: 14.99,
    category: "Writing",
    usageCount: 4567,
    rating: 4.7,
  },
  {
    id: "product-lister",
    icon: ShoppingBag,
    name: "Product Lister AI",
    tagline: "Sell anything faster with AI-optimized listings",
    freePreview: "Basic product description template",
    paidResult: "SEO-optimized listing + 10 product photos prompts + pricing strategy + marketplace analysis",
    basicPrice: 2.99,
    premiumPrice: 9.99,
    powerPrice: 24.99,
    category: "Commerce",
    usageCount: 2134,
    rating: 4.5,
  },
  {
    id: "idea-generator",
    icon: Zap,
    name: "Idea Generator AI",
    tagline: "Make $10–$1000 ideas tailored to your skills",
    freePreview: "3 generic business ideas",
    paidResult: "20 validated ideas + market size + execution plan + first 3 steps for each",
    basicPrice: 3.99,
    premiumPrice: 11.99,
    powerPrice: 27.99,
    category: "Business",
    usageCount: 6891,
    rating: 4.9,
  },
];

const CATEGORIES = ["All", "Design", "Career", "Marketing", "Dev", "Writing", "Commerce", "Business"];

const TIERS = [
  { name: "Basic", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", desc: "Full AI output + downloadable result" },
  { name: "Premium", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20", desc: "Multi-step execution + automation" },
  { name: "Power", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20", desc: "Full workflow + agent execution" },
];

export default function AIAgentMarket() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [selectedTier, setSelectedTier] = useState<"basic" | "premium" | "power">("basic");
  const filtered = selectedCategory === "All"
    ? AGENTS
    : AGENTS.filter(a => a.category === selectedCategory);

  const handleUnlock = (agent: Agent, tier: "basic" | "premium" | "power") => {
    const price = tier === "basic" ? agent.basicPrice : tier === "premium" ? agent.premiumPrice : agent.powerPrice;
    toast.success(`Unlocking ${agent.name} — ${tier.charAt(0).toUpperCase() + tier.slice(1)}`, {
      description: `$${price} — Payment processing coming soon. Connect Stripe to activate.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
        <Link href="/" className="p-2 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-bold text-lg flex items-center gap-2">
            <Bot className="w-5 h-5 text-cyan-400" />
            AI Agent Market
          </h1>
          <p className="text-xs text-muted-foreground">Pay-per-use AI execution — every interaction earns</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="text-right">
            <div className="text-xs font-bold text-green-400">Day-1 Revenue</div>
            <div className="text-xs text-muted-foreground">No users needed</div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Value proposition */}
        <div className="card p-4 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm">How It Works</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Every agent gives a <span className="text-foreground font-medium">free preview</span> to hook you,
                then offers a <span className="text-green-400 font-medium">paid unlock</span> for the full result.
                AI does the work. You get the outcome. Platform earns on execution.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/30 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-400" /> Free preview always</span>
            <span className="flex items-center gap-1"><DollarSign className="w-3 h-3 text-yellow-400" /> $0.99–$49.99/action</span>
            <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-cyan-400" /> Instant execution</span>
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Agent grid */}
        <div className="space-y-3">
          {filtered.map(agent => (
            <div
              key={agent.id}
              className={`card p-4 cursor-pointer transition-all ${
                selectedAgent?.id === agent.id ? "border-primary/50 bg-primary/5" : "hover:border-border"
              }`}
              onClick={() => setSelectedAgent(selectedAgent?.id === agent.id ? null : agent)}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center shrink-0">
                  <agent.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-sm">{agent.name}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-secondary/50 text-muted-foreground">{agent.category}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{agent.tagline}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      {agent.rating}
                    </span>
                    <span>{agent.usageCount.toLocaleString()} uses</span>
                    <span className="text-green-400">from ${agent.basicPrice}</span>
                  </div>
                </div>
                <ArrowRight className={`w-4 h-4 text-muted-foreground transition-transform ${selectedAgent?.id === agent.id ? "rotate-90" : ""}`} />
              </div>

              {/* Expanded: value gap + pricing */}
              {selectedAgent?.id === agent.id && (
                <div className="mt-4 space-y-3">
                  {/* Value gap */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
                      <div className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-green-400" /> Free Preview
                      </div>
                      <p className="text-xs">{agent.freePreview}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <div className="text-xs font-medium text-primary mb-1 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Paid Result
                      </div>
                      <p className="text-xs">{agent.paidResult}</p>
                    </div>
                  </div>

                  {/* Pricing tiers */}
                  <div className="grid grid-cols-3 gap-2">
                    {(["basic", "premium", "power"] as const).map((tier, i) => {
                      const price = tier === "basic" ? agent.basicPrice : tier === "premium" ? agent.premiumPrice : agent.powerPrice;
                      const t = TIERS[i];
                      return (
                        <div
                          key={tier}
                          onClick={(e) => { e.stopPropagation(); setSelectedTier(tier); }}
                          className={`p-2 rounded-lg border cursor-pointer transition-all ${
                            selectedTier === tier ? t.bg : "bg-secondary/20 border-border/30"
                          }`}
                        >
                          <div className={`text-xs font-bold ${t.color} flex items-center gap-1`}>
                            {tier === "power" && <Crown className="w-3 h-3" />}
                            {t.name}
                          </div>
                          <div className="text-sm font-bold mt-0.5">${price}</div>
                          <div className="text-xs text-muted-foreground mt-0.5 leading-tight">{t.desc}</div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={(e) => e.stopPropagation()}>
                      <CheckCircle2 className="w-3 h-3 mr-1 text-green-400" />
                      Free Preview
                    </Button>
                    <Button size="sm" className="flex-1 text-xs" onClick={(e) => { e.stopPropagation(); handleUnlock(agent, selectedTier); }}>
                      <Lock className="w-3 h-3 mr-1" />
                      Unlock ${selectedTier === "basic" ? agent.basicPrice : selectedTier === "premium" ? agent.premiumPrice : agent.powerPrice}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Subscription upsell */}
        <div className="card p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
          <div className="flex items-center gap-2 mb-3">
            <Crown className="w-4 h-4 text-yellow-400" />
            <h3 className="font-semibold text-sm">Subscription Plans</h3>
            <span className="text-xs text-muted-foreground ml-auto">Save up to 60%</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { name: "Basic", price: "$10/mo", desc: "100 AI credits/mo", color: "text-blue-400" },
              { name: "Execution", price: "$25/mo", desc: "Unlimited basic actions", color: "text-purple-400" },
              { name: "Power", price: "$50/mo", desc: "All agents + priority", color: "text-yellow-400" },
            ].map(p => (
              <div key={p.name} className="p-2 bg-background/50 rounded-lg text-center">
                <div className={`text-xs font-bold ${p.color}`}>{p.name}</div>
                <div className="text-sm font-bold mt-0.5">{p.price}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{p.desc}</div>
              </div>
            ))}
          </div>
          <Button className="w-full mt-3 text-xs" size="sm" onClick={() => toast.info("Connect Stripe to activate subscriptions.")}>
            Start Free Trial — 7 days
          </Button>
        </div>
      </div>
    </div>
  );
}
