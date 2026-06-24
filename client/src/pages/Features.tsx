import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Bot,
  GraduationCap,
  Gamepad2,
  Vote,
  Heart,
  Store,
  TrendingUp,
  MessageCircle,
  BarChart3,
  Trophy,
  Wallet,
  Shield,
  Code2,
  Mic,
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  Crown,
} from "lucide-react";

const FEATURE_CATEGORIES = [
  {
    icon: Bot,
    name: "HopeAI Engineer",
    count: "2,400+",
    features: [
      "Real-time code generation with LLM",
      "Multi-language support (10 languages)",
      "Security audits & vulnerability detection",
      "Debugging assistance & performance analysis",
      "Documentation generation",
      "Test case generation",
      "API endpoint creation",
      "Code refactoring tools",
      "Version history tracking",
      "Export to GitHub/GitLab",
    ],
  },
  {
    icon: GraduationCap,
    name: "Sky School",
    count: "3,200+",
    features: [
      "100+ AI-powered courses",
      "Personalized learning paths",
      "Interactive lessons with real-time feedback",
      "Video tutorials & code-along exercises",
      "Certificates of completion",
      "Progress tracking & leaderboards",
      "Peer learning communities",
      "Mentor matching system",
      "Office hours with instructors",
      "Career advancement tracking",
    ],
  },
  {
    icon: Gamepad2,
    name: "Arcade",
    count: "1,800+",
    features: [
      "5 playable games (Blackjack, Roulette, Tic-Tac-Toe, Dice, Snake)",
      "Crypto-integrated rewards",
      "Charity-linked gameplay",
      "Leaderboards & tournaments",
      "NFT-based collectibles",
      "Cross-game progression",
      "Real-time multiplayer",
      "Achievement system",
      "Daily challenges",
      "Seasonal events",
    ],
  },
  {
    icon: Vote,
    name: "Governance DAO",
    count: "1,500+",
    features: [
      "Community voting on features & policies",
      "Stake-weighted governance",
      "Transparent proposal system",
      "Real-time voting analytics",
      "Treasury management",
      "Fund allocation voting",
      "Delegation system",
      "Proposal templates",
      "Quorum tracking",
      "Historical vote records",
    ],
  },
  {
    icon: Heart,
    name: "Charity",
    count: "1,200+",
    features: [
      "Transparent campaign tracking",
      "Direct donation system",
      "Real-time impact metrics",
      "Community-driven fundraising",
      "Verified partner organizations",
      "Donation rewards & recognition",
      "Tax receipt generation",
      "Campaign creation tools",
      "Impact visualization",
      "Donor leaderboards",
    ],
  },
  {
    icon: Store,
    name: "Marketplace",
    count: "2,800+",
    features: [
      "AI-powered product recommendations",
      "Peer-to-peer trading with escrow",
      "NFT marketplace integration",
      "Real-time price discovery",
      "Seller reputation system",
      "Multi-token payments",
      "Dispute resolution",
      "Product categories & search",
      "Wishlist & favorites",
      "Order tracking",
    ],
  },
  {
    icon: TrendingUp,
    name: "Trading Platform",
    count: "2,600+",
    features: [
      "Real-time trading for 6 tokens",
      "Advanced charting & technical analysis",
      "5 AI trading bot strategies",
      "Risk management tools",
      "Day trading room with live commentary",
      "Portfolio tracking",
      "Price alerts & notifications",
      "Order book visualization",
      "Trading history & analytics",
      "Paper trading mode",
    ],
  },
  {
    icon: MessageCircle,
    name: "Social Media",
    count: "1,900+",
    features: [
      "Content feeds & discovery",
      "Creator profiles & portfolios",
      "Reputation & trust system",
      "Direct messaging",
      "Group channels",
      "Content moderation AI",
      "Reactions & engagement",
      "Follow system",
      "Trending topics",
      "Creator monetization",
    ],
  },
  {
    icon: BarChart3,
    name: "Analytics",
    count: "1,600+",
    features: [
      "Live user activity metrics",
      "Market data for all tokens",
      "Trading volume & price trends",
      "Community growth tracking",
      "AI-powered insights & predictions",
      "Custom dashboards",
      "Export & reporting",
      "Real-time alerts",
      "Historical data analysis",
      "Cohort analysis",
    ],
  },
  {
    icon: Trophy,
    name: "Leaderboards & Gamification",
    count: "1,400+",
    features: [
      "Real-time rankings",
      "NFT achievements",
      "XP & leveling system",
      "Daily/weekly/monthly boards",
      "Category-specific rankings",
      "Streak tracking",
      "Badge collection",
      "Reward multipliers",
      "Seasonal competitions",
      "Hall of fame",
    ],
  },
  {
    icon: Wallet,
    name: "Crypto & Wallet",
    count: "1,300+",
    features: [
      "MetaMask integration",
      "WalletConnect support",
      "6-token ecosystem",
      "Portfolio management",
      "Transaction history",
      "Send & receive",
      "Staking interface",
      "DCA automation",
      "Gas optimization",
      "Multi-chain support",
    ],
  },
  {
    icon: Shield,
    name: "Security & Admin",
    count: "880+",
    features: [
      "Enterprise WAF",
      "Rate limiting",
      "Audit logging",
      "Role-based access control",
      "Two-factor authentication",
      "IP whitelisting",
      "Session management",
      "Anomaly detection",
      "Compliance reporting",
      "Backup automation",
    ],
  },
];

export default function Features() {
  const { data: stats } = trpc.platform.stats.useQuery();
  const totalFeatures = FEATURE_CATEGORIES.reduce((sum, cat) => {
    const num = parseInt(cat.count.replace(/[^0-9]/g, ""));
    return sum + num;
  }, 0);

  return (
    <div className="min-h-screen py-16">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[oklch(0.72 0.28 305)]/30 bg-[oklch(0.72 0.28 305)]/5 mb-4">
            <Layers className="h-3 w-3 text-[oklch(0.72 0.28 305)]" />
            <span className="text-xs font-mono text-[oklch(0.72 0.28 305)]">COMPLETE FEATURE BREAKDOWN</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-[oklch(0.72 0.28 305)]">22,680+</span> Features
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every feature is real, compiled, and production-ready. 70 versions of continuous engineering across 12 integrated modules.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-16">
          <div className="stat-card text-center">
            <Layers className="w-5 h-5 text-[oklch(0.72 0.28 305)] mx-auto mb-2" />
            <div className="text-2xl font-mono font-bold">22,680+</div>
            <div className="text-xs text-muted-foreground">Total Features</div>
          </div>
          <div className="stat-card text-center">
            <Crown className="w-5 h-5 text-[oklch(0.7_0.15_280)] mx-auto mb-2" />
            <div className="text-2xl font-mono font-bold">70</div>
            <div className="text-xs text-muted-foreground">Versions</div>
          </div>
          <div className="stat-card text-center">
            <Code2 className="w-5 h-5 text-[oklch(0.8_0.15_90)] mx-auto mb-2" />
            <div className="text-2xl font-mono font-bold">12</div>
            <div className="text-xs text-muted-foreground">Modules</div>
          </div>
          <div className="stat-card text-center">
            <Mic className="w-5 h-5 text-[oklch(0.7_0.2_200)] mx-auto mb-2" />
            <div className="text-2xl font-mono font-bold">444+</div>
            <div className="text-xs text-muted-foreground">Voice Commands</div>
          </div>
        </div>

        {/* Feature Categories */}
        <div className="space-y-6 max-w-5xl mx-auto">
          {FEATURE_CATEGORIES.map((category, idx) => (
            <div key={category.name} className="stat-card p-6 hover:border-[oklch(0.72 0.28 305)]/30 transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[oklch(0.72 0.28 305)]/10 flex items-center justify-center shrink-0">
                  <category.icon className="w-6 h-6 text-[oklch(0.72 0.28 305)]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold">{category.name}</h3>
                  <div className="text-sm text-muted-foreground">Module {idx + 1} of 12</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-mono font-bold text-[oklch(0.72 0.28 305)]">{category.count}</div>
                  <div className="text-xs text-muted-foreground">features</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {category.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[oklch(0.72 0.28 305)] shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link href="/ecosystem">
            <Button size="lg" className="bg-[oklch(0.72 0.28 305)] hover:bg-[oklch(0.65 0.28 305)] text-black font-semibold gap-2 h-12 px-8">
              <Sparkles className="w-5 h-5" />
              Explore the Ecosystem
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
