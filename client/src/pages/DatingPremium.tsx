/**
 * DatingPremium — Dating System Monetization
 * Boost, super likes, AI profile optimization, visibility ranking
 */
import { Crown, Flame, Star, Brain, Eye, Shield, Zap, Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: "$0",
    period: "forever",
    color: "border-border",
    badge: null,
    features: [
      "5 likes per day",
      "Basic match feed",
      "Standard visibility",
      "Text chat only",
    ],
    cta: "Current Plan",
    ctaDisabled: true,
  },
  {
    id: "plus",
    name: "Plus",
    price: "$9.99",
    period: "per month",
    color: "border-blue-500",
    badge: "Popular",
    badgeColor: "bg-blue-500",
    features: [
      "Unlimited likes",
      "5 Super Likes/day",
      "See who liked you",
      "Rewind last swipe",
      "Passport (any location)",
      "AI icebreaker suggestions",
    ],
    cta: "Upgrade to Plus",
    ctaDisabled: false,
  },
  {
    id: "gold",
    name: "Gold",
    price: "$24.99",
    period: "per month",
    color: "border-yellow-500",
    badge: "Best Value",
    badgeColor: "bg-yellow-500",
    features: [
      "Everything in Plus",
      "1 Boost per week",
      "AI profile optimization",
      "Priority in match queue",
      "Full compatibility reports",
      "Relationship roadmap",
      "VIP support",
    ],
    cta: "Upgrade to Gold",
    ctaDisabled: false,
  },
];

const BOOSTS = [
  { name: "1 Boost", price: "$2.99", desc: "30 min of 10x visibility", icon: "🔥" },
  { name: "5 Boosts", price: "$9.99", desc: "Save 33% — best for weekends", icon: "⚡" },
  { name: "10 Boosts", price: "$14.99", desc: "Save 50% — power user pack", icon: "👑" },
];

const SUPER_LIKES = [
  { name: "5 Super Likes", price: "$4.99", desc: "Stand out instantly", icon: "⭐" },
  { name: "25 Super Likes", price: "$14.99", desc: "Save 40%", icon: "🌟" },
];

const PREMIUM_FEATURES = [
  { icon: Eye, title: "See Who Liked You", desc: "Know your admirers before swiping", color: "text-pink-400" },
  { icon: Brain, title: "AI Profile Coach", desc: "Optimize bio, photos, and first impressions", color: "text-purple-400" },
  { icon: Flame, title: "Boost Visibility", desc: "10x more profile views for 30 minutes", color: "text-orange-400" },
  { icon: Star, title: "Super Likes", desc: "Show extra interest — 3x more likely to match", color: "text-yellow-400" },
  { icon: Shield, title: "Advanced Filters", desc: "Filter by trust score, verified status, intent", color: "text-blue-400" },
  { icon: Zap, title: "Priority Queue", desc: "Appear first in other users' feeds", color: "text-cyan-400" },
];

export default function DatingPremium() {
  const handleUpgrade = (plan: string) => {
    toast.success(`Upgrading to ${plan}...`);
  };

  const handleBuy = (item: string) => {
    toast.success(`Purchasing ${item}...`);
  };

  return (
    <div className="min-h-screen bg-background p-4 max-w-lg mx-auto space-y-6">
      {/* Header */}
      <div className="text-center py-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center mx-auto mb-3">
          <Crown className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold">ShadowMatch Premium</h1>
        <p className="text-sm text-muted-foreground mt-1">Find your match faster with AI-powered tools</p>
      </div>

      {/* Premium features grid */}
      <div className="grid grid-cols-2 gap-2">
        {PREMIUM_FEATURES.map(feat => {
          const FeatIcon = feat.icon;
          return (
            <div key={feat.title} className="card p-3">
              <FeatIcon className={`w-5 h-5 ${feat.color} mb-2`} />
              <div className="text-sm font-semibold">{feat.title}</div>
              <div className="text-xs text-muted-foreground">{feat.desc}</div>
            </div>
          );
        })}
      </div>

      {/* Plans */}
      <div className="space-y-3">
        <h2 className="font-semibold text-sm">Choose Your Plan</h2>
        {PLANS.map(plan => (
          <div key={plan.id} className={`card p-4 border-2 ${plan.color} relative`}>
            {plan.badge && (
              <Badge className={`${plan.badgeColor} text-white text-xs absolute -top-2 left-4`}>
                {plan.badge}
              </Badge>
            )}
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-bold text-base">{plan.name}</div>
                <div className="text-xs text-muted-foreground">{plan.period}</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold">{plan.price}</div>
              </div>
            </div>
            <div className="space-y-1.5 mb-3">
              {plan.features.map(feat => (
                <div key={feat} className="flex items-center gap-2 text-xs">
                  <Check className="w-3 h-3 text-green-400 shrink-0" />
                  <span className="text-muted-foreground">{feat}</span>
                </div>
              ))}
            </div>
            <Button
              className={`w-full ${plan.ctaDisabled ? "" : "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400"}`}
              variant={plan.ctaDisabled ? "outline" : "default"}
              disabled={plan.ctaDisabled}
              onClick={() => !plan.ctaDisabled && handleUpgrade(plan.name)}
            >
              {plan.cta}
            </Button>
          </div>
        ))}
      </div>

      {/* Boosts */}
      <div>
        <h2 className="font-semibold text-sm mb-3">Profile Boosts</h2>
        <div className="space-y-2">
          {BOOSTS.map(boost => (
            <div key={boost.name} className="card p-3 flex items-center gap-3">
              <span className="text-2xl">{boost.icon}</span>
              <div className="flex-1">
                <div className="text-sm font-semibold">{boost.name}</div>
                <div className="text-xs text-muted-foreground">{boost.desc}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold">{boost.price}</div>
                <Button size="sm" variant="outline" className="mt-1 text-xs h-7" onClick={() => handleBuy(boost.name)}>
                  Buy
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Super Likes */}
      <div>
        <h2 className="font-semibold text-sm mb-3">Super Likes</h2>
        <div className="space-y-2">
          {SUPER_LIKES.map(sl => (
            <div key={sl.name} className="card p-3 flex items-center gap-3">
              <span className="text-2xl">{sl.icon}</span>
              <div className="flex-1">
                <div className="text-sm font-semibold">{sl.name}</div>
                <div className="text-xs text-muted-foreground">{sl.desc}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold">{sl.price}</div>
                <Button size="sm" variant="outline" className="mt-1 text-xs h-7" onClick={() => handleBuy(sl.name)}>
                  Buy
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Profile Optimization CTA */}
      <div className="card p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-purple-400 shrink-0" />
          <div className="flex-1">
            <div className="font-semibold text-sm">AI Profile Optimizer</div>
            <div className="text-xs text-muted-foreground">Get a personalized profile audit + rewrite suggestions</div>
          </div>
          <Button size="sm" className="bg-purple-500 hover:bg-purple-400 shrink-0" onClick={() => toast("AI Profile Optimizer requires Gold plan")}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
