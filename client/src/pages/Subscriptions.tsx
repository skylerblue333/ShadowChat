import { useState } from "react";
import { Link } from "wouter";
import { Crown, Zap, Star, CheckCircle, ArrowRight, CreditCard, Users, TrendingUp, Shield, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PLATFORM_TIERS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "/month",
    color: "border-slate-700/50",
    badge: null,
    features: [
      "Basic social feed",
      "10 posts/day",
      "Standard DMs",
      "Public communities",
      "Basic wallet",
    ],
    cta: "Current Plan",
    ctaVariant: "outline" as const,
    current: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$9.99",
    period: "/month",
    color: "border-cyan-500/40 bg-cyan-500/5",
    badge: "Popular",
    features: [
      "Everything in Free",
      "Unlimited posts",
      "Priority feed ranking",
      "Advanced analytics",
      "Creator monetization",
      "500 SKY444/month bonus",
      "No ads",
    ],
    cta: "Upgrade to Pro",
    ctaVariant: "default" as const,
    current: false,
  },
  {
    id: "elite",
    name: "Elite",
    price: "$29.99",
    period: "/month",
    color: "border-yellow-500/40 bg-yellow-500/5",
    badge: "Best Value",
    features: [
      "Everything in Pro",
      "AI content assistant",
      "Custom profile badge",
      "Early feature access",
      "Direct creator support",
      "2,000 SKY444/month bonus",
      "Priority support",
      "White-glove onboarding",
    ],
    cta: "Upgrade to Elite",
    ctaVariant: "default" as const,
    current: false,
  },
];

const CREATOR_SUBS = [
  { creator: "NOVA AI",    handle: "nova_ai",    tier: "Premium", price: "$4.99/mo", since: "Jan 2026", avatar: "N", color: "from-purple-500 to-pink-500",  perks: ["Exclusive AI posts", "Monthly drops", "Discord access"] },
  { creator: "CryptoKing", handle: "cryptoking", tier: "VIP",     price: "$9.99/mo", since: "Mar 2026", avatar: "C", color: "from-yellow-500 to-orange-500", perks: ["Alpha signals", "Private group", "1-on-1 sessions"] },
];

const TABS = ["Platform", "Creators", "Billing"] as const;
type Tab = typeof TABS[number];

export default function Subscriptions() {
  const [tab, setTab] = useState<Tab>("Platform");

  return (
    <div className="container py-8 max-w-4xl animate-page-in">
      <PageHeader
        backHref="/profile"
        icon={Crown}
        title="Subscriptions"
        subtitle="Manage your platform plan and creator subscriptions"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Crown} label="Current Plan" value="Free" color="primary" />
        <StatCard icon={Users} label="Creator Subs" value={CREATOR_SUBS.length.toString()} color="success" />
        <StatCard icon={TrendingUp} label="Monthly Spend" value="$14.98" color="accent" />
        <StatCard icon={Zap} label="SKY Bonus" value="0/mo" color="warning" />
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-secondary/30 rounded-xl p-1 mb-6">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all active:scale-[0.97] ${
              tab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Platform" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLATFORM_TIERS.map(tier => (
            <div key={tier.id} className={`card p-5 flex flex-col border-2 ${tier.color} relative`}>
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="text-xs px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0">
                    {tier.badge}
                  </Badge>
                </div>
              )}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  {tier.id === "elite" && <Crown className="w-4 h-4 text-yellow-400" />}
                  {tier.id === "pro" && <Sparkles className="w-4 h-4 text-cyan-400" />}
                  {tier.id === "free" && <Shield className="w-4 h-4 text-slate-400" />}
                  <h3 className="font-bold text-base">{tier.name}</h3>
                  {tier.current && <Badge variant="outline" className="text-[10px]">Current</Badge>}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black">{tier.price}</span>
                  <span className="text-xs text-muted-foreground">{tier.period}</span>
                </div>
              </div>
              <ul className="space-y-2 flex-1 mb-5">
                {tier.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-xs">
                    <CheckCircle className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant={tier.ctaVariant}
                disabled={tier.current}
                className={`w-full text-xs ${tier.id !== "free" ? "btn-primary" : ""}`}
              >
                {tier.cta}
              </Button>
            </div>
          ))}
        </div>
      )}

      {tab === "Creators" && (
        <div className="space-y-3">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-sm">Active Creator Subscriptions</h3>
            <Link href="/explore">
              <Button size="sm" variant="outline" className="text-xs gap-1">
                <Star className="w-3 h-3" /> Find Creators
              </Button>
            </Link>
          </div>
          {CREATOR_SUBS.map(sub => (
            <div key={sub.handle} className="card p-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${sub.color} flex items-center justify-center text-white font-bold shrink-0`}>
                  {sub.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{sub.creator}</span>
                    <Badge variant="secondary" className="text-[10px]">{sub.tier}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">@{sub.handle} · Since {sub.since}</div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {sub.perks.map(p => (
                      <span key={p} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/60 text-muted-foreground border border-slate-700/30">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-semibold text-sm text-primary">{sub.price}</div>
                  <Link href={`/creator/${sub.handle}`}>
                    <Button size="sm" variant="ghost" className="text-xs gap-1 text-primary mt-1">
                      View <ArrowRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
          <div className="card p-5 border-dashed border-slate-700/50 text-center">
            <p className="text-sm text-muted-foreground mb-3">Discover more creators to subscribe to</p>
            <Link href="/explore">
              <Button className="btn-primary gap-2 text-xs">
                <Star className="w-3.5 h-3.5" /> Browse Creators
              </Button>
            </Link>
          </div>
        </div>
      )}

      {tab === "Billing" && (
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" /> Payment Method
            </h3>
            <div className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30 border border-slate-700/40">
              <div className="w-10 h-7 rounded bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                VISA
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">•••• •••• •••• 4242</div>
                <div className="text-xs text-muted-foreground">Expires 12/27</div>
              </div>
              <Button size="sm" variant="outline" className="text-xs">Update</Button>
            </div>
          </div>
          <div className="card p-5">
            <h3 className="font-semibold text-sm mb-4">Billing History</h3>
            {[
              { date: "Jun 1, 2026", desc: "NOVA AI — Premium",    amount: "$4.99", status: "Paid" },
              { date: "Jun 1, 2026", desc: "CryptoKing — VIP",     amount: "$9.99", status: "Paid" },
              { date: "May 1, 2026", desc: "NOVA AI — Premium",    amount: "$4.99", status: "Paid" },
              { date: "May 1, 2026", desc: "CryptoKing — VIP",     amount: "$9.99", status: "Paid" },
            ].map((b, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-slate-700/30 last:border-0">
                <div>
                  <div className="text-sm font-medium">{b.desc}</div>
                  <div className="text-xs text-muted-foreground">{b.date}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{b.amount}</div>
                  <div className="text-xs text-green-400">{b.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
