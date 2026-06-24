import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp, DollarSign, Users, Target, Shield, Zap, BarChart3,
  CheckCircle, ArrowRight, Building2, Globe, Lock, Network,
  Briefcase, Star, ChevronRight, Phone, Mail, Calendar,
  Award, PieChart, LineChart, Activity
} from "lucide-react";

// ─── ARR Math Calculator ──────────────────────────────────────
function ARRCalculator() {
  const [clients, setClients] = useState(100);
  const [pricePerMonth, setPricePerMonth] = useState(1000);
  const arr = clients * pricePerMonth * 12;
  const valuation = arr * 12.5; // 12.5x ARR multiple
  const progress = Math.min((arr / 1200000) * 100, 100);

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <BarChart3 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-foreground">$15M Valuation Calculator</h3>
          <p className="text-xs text-muted-foreground">Reverse-engineer your path to venture scale</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Clients</label>
          <input
            type="range" min={1} max={500} value={clients}
            onChange={e => setClients(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="text-2xl font-bold text-foreground">{clients}</div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">$/Month per Client</label>
          <input
            type="range" min={200} max={5000} step={100} value={pricePerMonth}
            onChange={e => setPricePerMonth(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="text-2xl font-bold text-foreground">${pricePerMonth.toLocaleString()}</div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">ARR Progress to $1.2M</span>
          <span className="font-bold text-primary">{progress.toFixed(1)}%</span>
        </div>
        <div className="h-3 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="rounded-xl bg-secondary/50 p-3 text-center">
            <div className="text-lg font-bold text-primary">${(arr / 1000000).toFixed(2)}M</div>
            <div className="text-xs text-muted-foreground">ARR</div>
          </div>
          <div className="rounded-xl bg-secondary/50 p-3 text-center">
            <div className="text-lg font-bold text-accent">${(valuation / 1000000).toFixed(1)}M</div>
            <div className="text-xs text-muted-foreground">Est. Valuation</div>
          </div>
          <div className="rounded-xl bg-secondary/50 p-3 text-center">
            <div className="text-lg font-bold text-success">{(arr / 1200000 * 100).toFixed(0)}%</div>
            <div className="text-xs text-muted-foreground">To Target</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Pricing Tiers ────────────────────────────────────────────
const PRICING_TIERS = [
  {
    name: "Starter",
    price: 200,
    period: "month",
    description: "Perfect for small teams getting started",
    color: "border-border",
    badge: null,
    features: [
      "Up to 5 users",
      "Core platform access",
      "Basic analytics",
      "Email support",
      "1 workspace",
      "API access (1K calls/day)",
    ],
    cta: "Start Free Trial",
    href: "/signup",
  },
  {
    name: "Growth",
    price: 1000,
    period: "month",
    description: "For scaling teams that need more power",
    color: "border-primary",
    badge: "Most Popular",
    features: [
      "Up to 50 users",
      "All platform modules",
      "Advanced AI analytics",
      "Priority support (4h SLA)",
      "10 workspaces",
      "API access (100K calls/day)",
      "Custom integrations",
      "White-label options",
    ],
    cta: "Start Free Trial",
    href: "/signup",
  },
  {
    name: "Enterprise",
    price: 5000,
    period: "month",
    description: "Full-scale deployment for large organizations",
    color: "border-accent",
    badge: "Best Value",
    features: [
      "Unlimited users",
      "Dedicated infrastructure",
      "Custom AI model training",
      "24/7 dedicated support",
      "Unlimited workspaces",
      "Unlimited API calls",
      "On-premise deployment",
      "SLA guarantee (99.99%)",
      "Custom contract terms",
      "Quarterly business reviews",
    ],
    cta: "Contact Sales",
    href: "/contact",
  },
];

// ─── Moat Metrics ─────────────────────────────────────────────
const MOAT_METRICS = [
  {
    icon: Lock,
    title: "Switching Cost Index",
    value: "94/100",
    description: "Deep workflow integration makes leaving costly",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Network,
    title: "Network Effect Score",
    value: "87/100",
    description: "Platform value grows with every new user",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: Shield,
    title: "Data Moat Depth",
    value: "91/100",
    description: "Proprietary data competitors cannot replicate",
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    icon: Zap,
    title: "Retention Rate",
    value: "96.2%",
    description: "Annual contract renewal rate",
    color: "text-warning",
    bg: "bg-warning/10",
  },
];

// ─── Sales Pipeline ───────────────────────────────────────────
const PIPELINE_STAGES = [
  { stage: "Awareness", count: 2840, value: "$8.5M", color: "bg-muted" },
  { stage: "Qualified Lead", count: 420, value: "$1.26M", color: "bg-primary/40" },
  { stage: "Demo Scheduled", count: 89, value: "$267K", color: "bg-primary/60" },
  { stage: "Proposal Sent", count: 34, value: "$102K", color: "bg-primary/80" },
  { stage: "Closed Won", count: 12, value: "$36K MRR", color: "bg-primary" },
];

// ─── B2B Modules ──────────────────────────────────────────────
const B2B_MODULES = [
  {
    icon: "🚚",
    name: "Logistics Optimizer",
    tagline: "Route optimization for delivery fleets",
    arr: "$480K",
    clients: 40,
    href: "/logistics",
    color: "from-primary/20 to-primary/5",
  },
  {
    icon: "📊",
    name: "Sentiment Pipeline",
    tagline: "Real-time brand intelligence & alerts",
    arr: "$360K",
    clients: 30,
    href: "/sentiment",
    color: "from-accent/20 to-accent/5",
  },
  {
    icon: "🎪",
    name: "Event Planner Pro",
    tagline: "Offline-first collaborative floor planning",
    arr: "$240K",
    clients: 20,
    href: "/event-planner",
    color: "from-success/20 to-success/5",
  },
  {
    icon: "🤖",
    name: "AI Engineer Suite",
    tagline: "12-bot autonomous coding platform",
    arr: "$600K",
    clients: 50,
    href: "/ai-engineer",
    color: "from-warning/20 to-warning/5",
  },
];

export default function Enterprise() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "pricing" | "moat" | "pipeline">("overview");

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="relative container mx-auto px-4 py-20 text-center">
          <Badge className="mb-6 bg-primary/20 text-primary border-primary/30 px-4 py-1.5">
            <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
            $15M Valuation Playbook
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            <span className="text-foreground">Scale to</span>{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              $15 Million
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
            B2B SaaS platform targeting $1.2M ARR at 12.5x multiple.
            Three enterprise modules, deep moat mechanics, and a repeatable sales engine.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12 text-base font-semibold" asChild>
              <Link href="/signup">Start Free Trial <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="border-border/50 px-8 h-12 text-base" asChild>
              <Link href="/investor">View Investor Deck</Link>
            </Button>
          </div>
          {/* Key metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
            {[
              { label: "Target ARR", value: "$1.2M", icon: DollarSign },
              { label: "Target Valuation", value: "$15M", icon: TrendingUp },
              { label: "Valuation Multiple", value: "12.5x", icon: BarChart3 },
              { label: "Target Clients", value: "100+", icon: Users },
            ].map(m => (
              <div key={m.label} className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur p-4">
                <m.icon className="h-5 w-5 text-primary mb-2 mx-auto" />
                <div className="text-2xl font-black text-foreground">{m.value}</div>
                <div className="text-xs text-muted-foreground">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="sticky top-16 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 py-2">
            {(["overview", "pricing", "moat", "pipeline"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  activeTab === tab
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 space-y-16">

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-12">
            {/* ARR Calculator */}
            <div className="grid lg:grid-cols-2 gap-8">
              <ARRCalculator />
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">The Math to $15M</h2>
                <p className="text-muted-foreground leading-relaxed">
                  VCs value early-stage SaaS at <strong className="text-foreground">10x–15x ARR</strong>.
                  To hit $15M, reach $1.2M ARR within 12–24 months of launch.
                </p>
                <div className="space-y-3">
                  {[
                    { route: "Mid-Market Route", detail: "100 clients × $1,000/mo = $1.2M ARR", icon: Building2, color: "text-primary" },
                    { route: "Enterprise Route", detail: "20 clients × $5,000/mo = $1.2M ARR", icon: Globe, color: "text-accent" },
                    { route: "Hybrid Route", detail: "50 mid + 10 enterprise = $1.2M ARR", icon: Target, color: "text-success" },
                  ].map(r => (
                    <div key={r.route} className="flex items-start gap-3 p-4 rounded-xl border border-border/50 bg-card/50">
                      <r.icon className={`h-5 w-5 mt-0.5 ${r.color}`} />
                      <div>
                        <div className="font-semibold text-foreground text-sm">{r.route}</div>
                        <div className="text-xs text-muted-foreground">{r.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* B2B Modules */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Enterprise Modules</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {B2B_MODULES.map(m => (
                  <Link key={m.name} href={m.href}>
                    <div className={`rounded-2xl border border-border/50 bg-gradient-to-br ${m.color} p-5 cursor-pointer hover:border-primary/50 transition-all group`}>
                      <div className="text-3xl mb-3">{m.icon}</div>
                      <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{m.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1 mb-4">{m.tagline}</p>
                      <div className="flex justify-between text-xs">
                        <div>
                          <div className="font-bold text-primary">{m.arr}</div>
                          <div className="text-muted-foreground">Target ARR</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-foreground">{m.clients}</div>
                          <div className="text-muted-foreground">Target Clients</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Distribution Engine */}
            <div className="rounded-2xl border border-border/50 bg-card p-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Distribution Engine</h2>
              <p className="text-muted-foreground mb-8">Investors buy distribution, not code. Build a repeatable sales machine.</p>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    step: "01",
                    title: "Founder-Led Sales",
                    desc: "Personally pitch first 10 customers. Understand objections. Refine product-market fit.",
                    icon: Phone,
                    color: "text-primary",
                  },
                  {
                    step: "02",
                    title: "Repeatable Playbook",
                    desc: "Automated outbound turns $1 ad spend into $3+ LTV. Track every touchpoint.",
                    icon: Activity,
                    color: "text-accent",
                  },
                  {
                    step: "03",
                    title: "Hire to Delegate",
                    desc: "Transition from sole developer to CEO. Focus 100% on fundraising and strategy.",
                    icon: Users,
                    color: "text-success",
                  },
                ].map(s => (
                  <div key={s.step} className="relative">
                    <div className="text-5xl font-black text-border/30 absolute -top-2 -left-2">{s.step}</div>
                    <div className="relative pl-4">
                      <s.icon className={`h-6 w-6 ${s.color} mb-3`} />
                      <h3 className="font-bold text-foreground mb-2">{s.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === "pricing" && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-3">Enterprise Pricing</h2>
              <p className="text-muted-foreground">Annual contracts. High-ticket B2B. Lock-in recurring revenue.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {PRICING_TIERS.map(tier => (
                <div
                  key={tier.name}
                  className={`rounded-2xl border-2 ${tier.color} bg-card p-6 relative flex flex-col`}
                >
                  {tier.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground px-3 py-1">{tier.badge}</Badge>
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-foreground">{tier.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{tier.description}</p>
                    <div className="mt-4">
                      <span className="text-4xl font-black text-foreground">${tier.price.toLocaleString()}</span>
                      <span className="text-muted-foreground">/{tier.period}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      ${(tier.price * 12).toLocaleString()}/year · billed annually
                    </div>
                  </div>
                  <ul className="space-y-2.5 flex-1 mb-6">
                    {tier.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={tier.name === "Growth" ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}
                    variant={tier.name === "Growth" ? "default" : "outline"}
                    asChild
                  >
                    <Link href={tier.href}>{tier.cta} <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </div>
              ))}
            </div>
            <div className="text-center text-sm text-muted-foreground">
              All plans include 14-day free trial · No credit card required · Cancel anytime
            </div>
          </div>
        )}

        {/* Moat Tab */}
        {activeTab === "moat" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Defensibility Moat</h2>
              <p className="text-muted-foreground">A $15M company cannot be copied in a weekend. These are our barriers to entry.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {MOAT_METRICS.map(m => (
                <div key={m.title} className="rounded-2xl border border-border/50 bg-card p-5">
                  <div className={`h-10 w-10 rounded-xl ${m.bg} flex items-center justify-center mb-4`}>
                    <m.icon className={`h-5 w-5 ${m.color}`} />
                  </div>
                  <div className={`text-3xl font-black ${m.color} mb-1`}>{m.value}</div>
                  <div className="font-semibold text-foreground text-sm mb-1">{m.title}</div>
                  <div className="text-xs text-muted-foreground">{m.description}</div>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Proprietary Data Moat",
                  icon: PieChart,
                  color: "text-primary",
                  bg: "bg-primary/10",
                  points: [
                    "Unique behavioral data from 100K+ users",
                    "Sentiment trends unavailable elsewhere",
                    "Route optimization patterns from 1M+ deliveries",
                    "Event layout data from 50K+ events",
                  ],
                },
                {
                  title: "Network Effect Engine",
                  icon: Network,
                  color: "text-accent",
                  bg: "bg-accent/10",
                  points: [
                    "Each new user improves AI recommendations",
                    "Community benchmarking gets richer",
                    "Marketplace liquidity increases with users",
                    "Social proof compounds with every review",
                  ],
                },
                {
                  title: "Switching Cost Architecture",
                  icon: Lock,
                  color: "text-success",
                  bg: "bg-success/10",
                  points: [
                    "Deep CRM and workflow integrations",
                    "Historical data locked in platform",
                    "Team training investment",
                    "Custom AI models trained on their data",
                  ],
                },
              ].map(m => (
                <div key={m.title} className="rounded-2xl border border-border/50 bg-card p-6">
                  <div className={`h-10 w-10 rounded-xl ${m.bg} flex items-center justify-center mb-4`}>
                    <m.icon className={`h-5 w-5 ${m.color}`} />
                  </div>
                  <h3 className="font-bold text-foreground mb-4">{m.title}</h3>
                  <ul className="space-y-2">
                    {m.points.map(p => (
                      <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <ChevronRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pipeline Tab */}
        {activeTab === "pipeline" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Sales Pipeline</h2>
              <p className="text-muted-foreground">Founder-led sales funnel tracking every deal from awareness to close.</p>
            </div>
            <div className="rounded-2xl border border-border/50 bg-card p-6">
              <div className="space-y-3">
                {PIPELINE_STAGES.map((stage, i) => (
                  <div key={stage.stage} className="flex items-center gap-4">
                    <div className="w-32 text-sm font-medium text-foreground">{stage.stage}</div>
                    <div className="flex-1 h-8 rounded-lg bg-secondary/50 overflow-hidden">
                      <div
                        className={`h-full ${stage.color} rounded-lg flex items-center justify-end pr-3 transition-all duration-700`}
                        style={{ width: `${100 - i * 18}%` }}
                      >
                        <span className="text-xs font-bold text-foreground">{stage.count}</span>
                      </div>
                    </div>
                    <div className="w-24 text-right text-sm font-bold text-primary">{stage.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* CRM Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: "Schedule Demo", icon: Calendar, color: "text-primary", desc: "Book a 30-min product walkthrough" },
                { title: "Send Proposal", icon: Mail, color: "text-accent", desc: "Generate custom enterprise proposal" },
                { title: "Close Deal", icon: Award, color: "text-success", desc: "Finalize contract and onboard client" },
              ].map(a => (
                <button
                  key={a.title}
                  className="rounded-2xl border border-border/50 bg-card p-5 text-left hover:border-primary/50 transition-all group"
                  onClick={() => {}}
                >
                  <a.icon className={`h-6 w-6 ${a.color} mb-3`} />
                  <div className="font-bold text-foreground group-hover:text-primary transition-colors">{a.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{a.desc}</div>
                </button>
              ))}
            </div>

            {/* Contact Sales */}
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center">
              <Star className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">Ready to Scale?</h3>
              <p className="text-muted-foreground mb-6">Talk to our enterprise team. We'll build a custom plan for your organization.</p>
              <div className="flex gap-3 justify-center">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Phone className="mr-2 h-4 w-4" /> Schedule a Call
                </Button>
                <Button variant="outline">
                  <Mail className="mr-2 h-4 w-4" /> Email Sales
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
