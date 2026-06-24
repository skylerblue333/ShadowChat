/**
 * PlatformMap — Full platform feature directory
 * All 246+ routes organized by group with value scores and rarity badges.
 * The definitive "what is this platform" overview.
 */
import { useState } from "react";
import { Link } from "wouter";
import {
  Rocket, Heart, Gamepad2, GraduationCap, Radio, Globe, Newspaper,
  Compass, Sparkles, Coins, ShoppingBag, Star, Brain, Shield,
  Search, Filter, ExternalLink, TrendingUp, Zap, Crown, Target,
  BarChart3, Code2, Users, MessageSquare, Camera, Video, Wallet,
  PieChart, Layers, Building2, Activity, Lock, Gauge, BookOpen,
  Pickaxe, ArrowLeftRight, Swords, Gift, Hash, Home, Bot, Cpu,
  GitBranch, Webhook, Database, Package, Settings, Mic, CalendarDays,
  Flame, Scissors, UserCircle2, ArrowRight,
} from "lucide-react";

type Rarity = "legendary" | "epic" | "rare" | "uncommon" | "common";

interface Feature {
  label: string;
  href: string;
  icon: React.ElementType;
  desc: string;
  value: number;      // 1-10
  rarity: Rarity;
  live: boolean;
}

interface FeatureGroup {
  id: string;
  label: string;
  icon: React.ElementType;
  gradient: string;
  accentText: string;
  features: Feature[];
}

const RARITY_CONFIG: Record<Rarity, { label: string; color: string; bg: string }> = {
  legendary: { label: "Legendary", color: "text-amber-300", bg: "bg-amber-500/20 border-amber-500/40" },
  epic:      { label: "Epic",      color: "text-fuchsia-300", bg: "bg-fuchsia-500/20 border-fuchsia-500/40" },
  rare:      { label: "Rare",      color: "text-blue-300", bg: "bg-blue-500/20 border-blue-500/40" },
  uncommon:  { label: "Uncommon",  color: "text-green-300", bg: "bg-green-500/20 border-green-500/40" },
  common:    { label: "Common",    color: "text-slate-400", bg: "bg-slate-700/50 border-slate-600/40" },
};

const PLATFORM_GROUPS: FeatureGroup[] = [
  {
    id: "investors",
    label: "Investors / ICO",
    icon: Rocket,
    gradient: "from-amber-500 to-orange-600",
    accentText: "text-amber-400",
    features: [
      { label: "Investor Portal",    href: "/investor-portal",   icon: Rocket,     desc: "Full ICO hub — raise meter, tiers, Stripe checkout", value: 10, rarity: "legendary", live: true },
      { label: "ICO Launchpad",      href: "/ico",               icon: Coins,      desc: "Token sale entry point",                             value: 10, rarity: "legendary", live: true },
      { label: "Token Metrics",      href: "/token-metrics",     icon: BarChart3,  desc: "SKY444 live price, supply, burn stats",              value: 9,  rarity: "epic",      live: true },
      { label: "Whitepaper",         href: "/whitepaper",        icon: BookOpen,   desc: "SKY444 technical white paper v2.0",                  value: 8,  rarity: "epic",      live: true },
      { label: "Vesting Schedule",   href: "/vesting",           icon: CalendarDays,desc: "Token unlock timeline",                             value: 7,  rarity: "rare",      live: true },
      { label: "Governance",         href: "/governance",        icon: Building2,  desc: "Vote on proposals with SKY444",                      value: 8,  rarity: "rare",      live: true },
      { label: "Economic Layer",     href: "/economic-layer",    icon: Coins,      desc: "SKY444 ledger, fee schedule, treasury",              value: 9,  rarity: "epic",      live: true },
      { label: "Whale Monitor",      href: "/whale-monitor",     icon: Activity,   desc: "Large transaction surveillance",                     value: 7,  rarity: "rare",      live: true },
    ],
  },
  {
    id: "charity",
    label: "Charity",
    icon: Heart,
    gradient: "from-rose-500 to-pink-600",
    accentText: "text-rose-400",
    features: [
      { label: "Charity Hub",        href: "/charity",           icon: Heart,      desc: "All active charity campaigns",                       value: 9,  rarity: "epic",      live: true },
      { label: "Charity Leaderboard",href: "/charity-leaderboard",icon: Crown,     desc: "Top donors and impact rankings",                     value: 8,  rarity: "rare",      live: true },
      { label: "Proof Vault",        href: "/proof-vault",       icon: Shield,     desc: "On-chain donation receipts",                         value: 8,  rarity: "rare",      live: true },
      { label: "Impact Analytics",   href: "/charity-analytics", icon: BarChart3,  desc: "Donation impact metrics",                            value: 7,  rarity: "rare",      live: true },
    ],
  },
  {
    id: "gaming",
    label: "Gaming",
    icon: Gamepad2,
    gradient: "from-green-500 to-emerald-600",
    accentText: "text-green-400",
    features: [
      { label: "Gaming Hub",         href: "/gaming",            icon: Gamepad2,   desc: "Play-to-earn game center",                           value: 9,  rarity: "epic",      live: true },
      { label: "Arcade",             href: "/arcade",            icon: Gamepad2,   desc: "Casino-style arcade games",                          value: 8,  rarity: "rare",      live: true },
      { label: "Tournaments",        href: "/tournaments",       icon: Swords,     desc: "Compete for SKY444 prizes",                          value: 9,  rarity: "epic",      live: true },
      { label: "Quest Board",        href: "/quests",            icon: Target,     desc: "Daily quests + rewards",                             value: 7,  rarity: "rare",      live: true },
      { label: "Achievements",       href: "/achievements",      icon: Crown,      desc: "Unlock platform badges",                             value: 6,  rarity: "uncommon",  live: true },
      { label: "Leaderboard",        href: "/leaderboard",       icon: Crown,      desc: "Top players by score",                               value: 7,  rarity: "uncommon",  live: true },
    ],
  },
  {
    id: "school",
    label: "SkySchool",
    icon: GraduationCap,
    gradient: "from-blue-500 to-indigo-600",
    accentText: "text-blue-400",
    features: [
      { label: "SkySchool",          href: "/school",            icon: GraduationCap,desc: "Learn and earn SKY444 coins",                     value: 9,  rarity: "epic",      live: true },
      { label: "Sky School Alt",     href: "/sky-school",        icon: GraduationCap,desc: "SkySchool entry alias",                           value: 9,  rarity: "epic",      live: true },
      { label: "Courses",            href: "/courses",           icon: BookOpen,   desc: "Structured learning paths",                          value: 8,  rarity: "rare",      live: true },
      { label: "Certifications",     href: "/certifications",    icon: Star,       desc: "Earn platform certificates",                         value: 7,  rarity: "rare",      live: true },
      { label: "Study Groups",       href: "/study-groups",      icon: Users,      desc: "Collaborative learning rooms",                       value: 6,  rarity: "uncommon",  live: false },
    ],
  },
  {
    id: "live",
    label: "Live Streaming",
    icon: Radio,
    gradient: "from-red-500 to-rose-600",
    accentText: "text-red-400",
    features: [
      { label: "Live Streaming",     href: "/streaming",         icon: Radio,      desc: "Go live with WebRTC + HLS",                          value: 10, rarity: "legendary", live: true },
      { label: "Live Hub",           href: "/live",              icon: Radio,      desc: "Live stream browser",                                value: 9,  rarity: "epic",      live: true },
      { label: "Stream Settings",    href: "/stream-settings",   icon: Settings,   desc: "Configure your stream",                              value: 7,  rarity: "rare",      live: true },
      { label: "VOD Archive",        href: "/vod-archive",       icon: Video,      desc: "Recorded stream library",                            value: 8,  rarity: "rare",      live: true },
      { label: "Live Reactions",     href: "/live-reactions",    icon: Zap,        desc: "Real-time emoji reactions",                          value: 6,  rarity: "uncommon",  live: true },
      { label: "Creator Gifting",    href: "/creator-gifting",   icon: Gift,       desc: "Send gifts during streams",                          value: 7,  rarity: "rare",      live: false },
    ],
  },
  {
    id: "social",
    label: "Social",
    icon: Globe,
    gradient: "from-cyan-500 to-blue-600",
    accentText: "text-cyan-400",
    features: [
      { label: "Social Feed",        href: "/social",            icon: Home,       desc: "Your personalized social feed",                      value: 10, rarity: "legendary", live: true },
      { label: "Feed",               href: "/feed",              icon: Newspaper,  desc: "Chronological content feed",                         value: 9,  rarity: "epic",      live: true },
      { label: "Explore",            href: "/explore",           icon: Hash,       desc: "Discover trending content",                          value: 8,  rarity: "rare",      live: true },
      { label: "Messages",           href: "/messages",          icon: MessageSquare,desc: "Direct messages",                                  value: 9,  rarity: "epic",      live: true },
      { label: "Communities",        href: "/community",         icon: Users,      desc: "Topic-based communities",                            value: 8,  rarity: "rare",      live: true },
      { label: "Reels",              href: "/reels",             icon: Video,      desc: "Short-form video reels",                             value: 9,  rarity: "epic",      live: true },
      { label: "Stories",            href: "/stories",           icon: Camera,     desc: "24-hour ephemeral stories",                          value: 8,  rarity: "rare",      live: true },
      { label: "Channels",           href: "/channels",          icon: Newspaper,  desc: "Broadcast channels",                                 value: 7,  rarity: "rare",      live: true },
      { label: "Trending",           href: "/trending",          icon: TrendingUp, desc: "What's hot right now",                               value: 7,  rarity: "uncommon",  live: true },
      { label: "Tip Jar",            href: "/tip-jar",           icon: Gift,       desc: "Send tips to creators",                              value: 6,  rarity: "uncommon",  live: true },
      { label: "Creator Spotlight",  href: "/creator-spotlight", icon: Flame,      desc: "Featured creator showcase",                          value: 6,  rarity: "uncommon",  live: true },
    ],
  },
  {
    id: "hope-ai",
    label: "HOPE AI",
    icon: Sparkles,
    gradient: "from-fuchsia-500 to-pink-600",
    accentText: "text-fuchsia-400",
    features: [
      { label: "HOPE AI",            href: "/hope-ai",           icon: Sparkles,   desc: "AI ethics, control & companion",                     value: 10, rarity: "legendary", live: true },
      { label: "AI Brain",           href: "/ai-brain",          icon: Brain,      desc: "AI command center",                                  value: 9,  rarity: "epic",      live: true },
      { label: "AI Agent",           href: "/ai-agent",          icon: Bot,        desc: "24/7 autonomous agent",                              value: 9,  rarity: "epic",      live: true },
      { label: "AI Intelligence Hub",href: "/ai-intelligence-hub",icon: BarChart3, desc: "Trending detection, engagement prediction",          value: 9,  rarity: "epic",      live: true },
      { label: "Code Intelligence",  href: "/code-intelligence", icon: Code2,      desc: "AI code review, security analysis",                  value: 9,  rarity: "epic",      live: true },
      { label: "AI Code Studio",     href: "/ai-code-studio",    icon: Code2,      desc: "AI coding assistant with streaming",                 value: 8,  rarity: "rare",      live: true },
      { label: "AI Copy Studio",     href: "/ai-copy-studio",    icon: Mic,        desc: "AI content generation",                              value: 8,  rarity: "rare",      live: true },
      { label: "AI Persona Feed",    href: "/ai-persona-feed",   icon: Sparkles,   desc: "AI-generated social personas",                       value: 7,  rarity: "rare",      live: true },
      { label: "AI Tools",           href: "/ai-tools",          icon: Cpu,        desc: "12-tool AI suite",                                   value: 8,  rarity: "rare",      live: true },
      { label: "Sentiment Engine",   href: "/sentiment",         icon: Activity,   desc: "NLP sentiment analysis pipeline",                    value: 7,  rarity: "rare",      live: true },
      { label: "Anomaly Detection",  href: "/anomaly-detection", icon: Shield,     desc: "ML anomaly detection",                               value: 7,  rarity: "rare",      live: true },
      { label: "World Brain",        href: "/world-brain",       icon: Globe,      desc: "Global knowledge graph",                             value: 8,  rarity: "epic",      live: false },
      { label: "Notification Intel", href: "/notification-intelligence",icon: Zap, desc: "Smart notification engine",                         value: 7,  rarity: "rare",      live: true },
    ],
  },
  {
    id: "crypto",
    label: "Crypto",
    icon: Coins,
    gradient: "from-yellow-500 to-amber-600",
    accentText: "text-yellow-400",
    features: [
      { label: "Crypto Hub",         href: "/crypto-hub",        icon: Coins,      desc: "SKY444 crypto command center",                       value: 10, rarity: "legendary", live: true },
      { label: "Wallet",             href: "/wallet",            icon: Wallet,     desc: "Your crypto wallet",                                 value: 9,  rarity: "epic",      live: true },
      { label: "Mine SKY444",        href: "/mining",            icon: Pickaxe,    desc: "Proof-of-engagement mining",                         value: 9,  rarity: "epic",      live: true },
      { label: "Token Swap",         href: "/token-swap",        icon: ArrowLeftRight,desc: "Swap tokens instantly",                           value: 8,  rarity: "rare",      live: true },
      { label: "Staking",            href: "/staking",           icon: Zap,        desc: "Earn staking rewards",                               value: 8,  rarity: "rare",      live: true },
      { label: "Portfolio",          href: "/portfolio",         icon: PieChart,   desc: "Asset allocation overview",                          value: 7,  rarity: "rare",      live: true },
      { label: "NFT Gallery",        href: "/nft-gallery",       icon: Sparkles,   desc: "Your NFT collection",                                value: 7,  rarity: "rare",      live: true },
      { label: "DeFi",               href: "/defi",              icon: Layers,     desc: "Decentralized finance hub",                          value: 8,  rarity: "rare",      live: false },
      { label: "Yield Farming",      href: "/yield-farming",     icon: Target,     desc: "Liquidity farming pools",                            value: 7,  rarity: "rare",      live: false },
      { label: "Trading Terminal",   href: "/trading",           icon: TrendingUp, desc: "Advanced trading interface",                         value: 8,  rarity: "rare",      live: true },
      { label: "Crypto Mine",        href: "/crypto-mine",       icon: Pickaxe,    desc: "Gamified mining experience",                         value: 8,  rarity: "rare",      live: true },
    ],
  },
  {
    id: "marketplace",
    label: "Marketplace",
    icon: ShoppingBag,
    gradient: "from-teal-500 to-cyan-600",
    accentText: "text-teal-400",
    features: [
      { label: "Marketplace",        href: "/marketplace",       icon: ShoppingBag,desc: "Buy & sell goods",                                   value: 9,  rarity: "epic",      live: true },
      { label: "Digital Art Store",  href: "/art-store",         icon: Sparkles,   desc: "Signed prints & digital art",                        value: 8,  rarity: "rare",      live: true },
      { label: "Subscriptions",      href: "/subscriptions",     icon: Star,       desc: "Creator subscription tiers",                         value: 8,  rarity: "rare",      live: true },
      { label: "Payout Hub",         href: "/payout",            icon: Coins,      desc: "Creator earnings & payouts",                         value: 7,  rarity: "rare",      live: true },
      { label: "Affiliate",          href: "/affiliate",         icon: Gift,       desc: "Earn commissions",                                   value: 6,  rarity: "uncommon",  live: true },
      { label: "Referrals",          href: "/referrals",         icon: Users,      desc: "Invite & earn SKY444",                               value: 6,  rarity: "uncommon",  live: true },
      { label: "Payment Infra",      href: "/payment-infra",     icon: Coins,      desc: "Stripe + crypto payment rails",                      value: 8,  rarity: "rare",      live: true },
    ],
  },
  {
    id: "creator",
    label: "Creator",
    icon: Star,
    gradient: "from-purple-500 to-violet-600",
    accentText: "text-purple-400",
    features: [
      { label: "Creator Studio",     href: "/creator-studio",    icon: Star,       desc: "Full creator toolkit",                               value: 9,  rarity: "epic",      live: true },
      { label: "Creator Dashboard",  href: "/creator",           icon: BarChart3,  desc: "Creator analytics & earnings",                       value: 8,  rarity: "rare",      live: true },
      { label: "Creator Analytics",  href: "/creator-analytics", icon: PieChart,   desc: "Deep creator stats",                                 value: 8,  rarity: "rare",      live: true },
      { label: "Creator Profile",    href: "/creator-profile",   icon: UserCircle2,desc: "Public creator profile",                             value: 7,  rarity: "rare",      live: true },
      { label: "Content Scheduler",  href: "/content-scheduler", icon: CalendarDays,desc: "Schedule posts & content",                         value: 7,  rarity: "uncommon",  live: true },
      { label: "Content Vault",      href: "/content-vault",     icon: Lock,       desc: "Premium locked content",                             value: 7,  rarity: "rare",      live: true },
      { label: "NSFW Feed",          href: "/nsfw-feed",         icon: Shield,     desc: "Age-gated content feed",                             value: 6,  rarity: "uncommon",  live: true },
      { label: "The Book",           href: "/book",              icon: BookOpen,   desc: "The Chosen One — creator lore",                      value: 7,  rarity: "epic",      live: true },
    ],
  },
  {
    id: "platform",
    label: "Platform & Dev",
    icon: Gauge,
    gradient: "from-slate-500 to-slate-600",
    accentText: "text-slate-400",
    features: [
      { label: "Dashboard",          href: "/dashboard",         icon: Gauge,      desc: "Personal dashboard",                                 value: 8,  rarity: "rare",      live: true },
      { label: "Ecosystem",          href: "/ecosystem",         icon: Globe,      desc: "Platform ecosystem overview",                        value: 7,  rarity: "uncommon",  live: true },
      { label: "Analytics",          href: "/analytics",         icon: BarChart3,  desc: "Platform-wide analytics",                            value: 8,  rarity: "rare",      live: true },
      { label: "Server Health",      href: "/server-health",     icon: Activity,   desc: "Live system status",                                 value: 7,  rarity: "uncommon",  live: true },
      { label: "API Docs",           href: "/api-docs",          icon: BookOpen,   desc: "tRPC endpoint catalog",                              value: 7,  rarity: "uncommon",  live: true },
      { label: "Webhooks",           href: "/webhooks",          icon: Webhook,    desc: "Webhook manager",                                    value: 6,  rarity: "uncommon",  live: true },
      { label: "DevOps Hub",         href: "/devops",            icon: Database,   desc: "Infra & operations",                                 value: 7,  rarity: "uncommon",  live: true },
      { label: "AI Engineer",        href: "/ai-engineer",       icon: GitBranch,  desc: "AI dev tools",                                       value: 8,  rarity: "rare",      live: true },
      { label: "Enterprise",         href: "/enterprise",        icon: Package,    desc: "Enterprise features",                                value: 7,  rarity: "uncommon",  live: false },
    ],
  },
  {
    id: "security",
    label: "Security & Privacy",
    icon: Shield,
    gradient: "from-emerald-500 to-green-600",
    accentText: "text-emerald-400",
    features: [
      { label: "Security Dashboard", href: "/security",          icon: Shield,     desc: "Security monitoring",                                value: 8,  rarity: "rare",      live: true },
      { label: "Trust & Safety",     href: "/trust-safety",      icon: Shield,     desc: "Moderation & trust scores",                          value: 8,  rarity: "rare",      live: true },
      { label: "Compliance Center",  href: "/compliance-center", icon: Lock,       desc: "KYC & GDPR controls",                                value: 8,  rarity: "rare",      live: true },
      { label: "Shadow Identity",    href: "/shadow-identity",   icon: UserCircle2,desc: "Manage your shadow persona",                         value: 7,  rarity: "rare",      live: true },
      { label: "Ghost Mode",         href: "/ghost-mode",        icon: UserCircle2,desc: "Anonymous browsing",                                 value: 7,  rarity: "rare",      live: true },
      { label: "Privacy Vault",      href: "/privacy",           icon: Lock,       desc: "Encrypted data vault",                               value: 7,  rarity: "rare",      live: true },
      { label: "Audit Log",          href: "/audit-log",         icon: Activity,   desc: "Platform audit trail",                               value: 6,  rarity: "uncommon",  live: true },
      { label: "2FA Setup",          href: "/2fa",               icon: Lock,       desc: "Two-factor authentication",                          value: 6,  rarity: "uncommon",  live: true },
      { label: "Rate Limit Dashboard",href: "/rate-limit-dashboard",icon: Gauge,   desc: "API rate limit monitoring",                          value: 6,  rarity: "uncommon",  live: true },
    ],
  },
];

const ALL_FEATURES = PLATFORM_GROUPS.flatMap(g =>
  g.features.map(f => ({ ...f, group: g.label, groupId: g.id, accentText: g.accentText }))
);

export default function PlatformMap() {
  const [search, setSearch] = useState("");
  const [filterRarity, setFilterRarity] = useState<Rarity | "all">("all");
  const [filterLive, setFilterLive] = useState<"all" | "live" | "coming">("all");
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const filtered = ALL_FEATURES.filter(f => {
    const matchSearch = !search || f.label.toLowerCase().includes(search.toLowerCase()) || f.desc.toLowerCase().includes(search.toLowerCase());
    const matchRarity = filterRarity === "all" || f.rarity === filterRarity;
    const matchLive = filterLive === "all" || (filterLive === "live" ? f.live : !f.live);
    const matchGroup = !activeGroup || f.groupId === activeGroup;
    return matchSearch && matchRarity && matchLive && matchGroup;
  });

  const totalFeatures = ALL_FEATURES.length;
  const liveFeatures = ALL_FEATURES.filter(f => f.live).length;
  const legendaryCount = ALL_FEATURES.filter(f => f.rarity === "legendary").length;

  return (
    <div className="min-h-screen bg-[#07050f] text-white">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-slate-800/60">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-cyan-900/20" />
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, oklch(0.45 0.25 305 / 0.08) 0%, transparent 60%), radial-gradient(circle at 80% 50%, oklch(0.45 0.25 200 / 0.08) 0%, transparent 60%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">Platform Map</h1>
              <p className="text-sm text-slate-400">Every feature, every route — organized by group</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Total Features", value: totalFeatures, color: "text-cyan-400" },
              { label: "Live Now",        value: liveFeatures,  color: "text-green-400" },
              { label: "Groups",          value: PLATFORM_GROUPS.length, color: "text-purple-400" },
              { label: "Legendary",       value: legendaryCount, color: "text-amber-400" },
            ].map(stat => (
              <div key={stat.label} className="bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3">
                <p className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Search + Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search features…"
                className="w-full pl-9 pr-4 py-2 bg-slate-800/70 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-600 outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>

            {/* Rarity filter */}
            <div className="flex gap-1.5">
              {(["all", "legendary", "epic", "rare", "uncommon"] as const).map(r => (
                <button
                  key={r}
                  onClick={() => setFilterRarity(r)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    filterRarity === r
                      ? "bg-purple-500/30 text-purple-300 border border-purple-500/50"
                      : "bg-slate-800/60 text-slate-500 border border-slate-700/40 hover:text-slate-300"
                  }`}
                >
                  {r === "all" ? "All" : r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>

            {/* Live filter */}
            <div className="flex gap-1.5">
              {(["all", "live", "coming"] as const).map(l => (
                <button
                  key={l}
                  onClick={() => setFilterLive(l)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    filterLive === l
                      ? "bg-green-500/20 text-green-300 border border-green-500/40"
                      : "bg-slate-800/60 text-slate-500 border border-slate-700/40 hover:text-slate-300"
                  }`}
                >
                  {l === "all" ? "All Status" : l === "live" ? "● Live" : "Coming Soon"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Group filter pills */}
        <div className="flex gap-2 flex-wrap mb-6">
          <button
            onClick={() => setActiveGroup(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              !activeGroup ? "bg-slate-600 text-white" : "bg-slate-800/60 text-slate-500 hover:text-slate-300 border border-slate-700/40"
            }`}
          >
            All Groups
          </button>
          {PLATFORM_GROUPS.map(g => {
            const Icon = g.icon;
            return (
              <button
                key={g.id}
                onClick={() => setActiveGroup(activeGroup === g.id ? null : g.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeGroup === g.id
                    ? `bg-gradient-to-r ${g.gradient} text-white`
                    : "bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700/40"
                }`}
              >
                <Icon className="w-3 h-3" />
                {g.label}
              </button>
            );
          })}
        </div>

        {/* Results count */}
        <p className="text-xs text-slate-600 mb-4">{filtered.length} features</p>

        {/* Feature grid — grouped */}
        {search || filterRarity !== "all" || filterLive !== "all" || activeGroup ? (
          /* Flat search results */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map(f => (
              <FeatureCard key={f.href} feature={f} accentText={f.accentText} />
            ))}
          </div>
        ) : (
          /* Grouped view */
          <div className="space-y-10">
            {PLATFORM_GROUPS.map(group => {
              const Icon = group.icon;
              return (
                <div key={group.id}>
                  {/* Group header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${group.gradient} flex items-center justify-center`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-base font-bold text-white">{group.label}</h2>
                    <span className="text-xs text-slate-600">{group.features.length} features</span>
                    <div className="flex-1 h-px bg-slate-800/60" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {group.features.map(f => (
                      <FeatureCard key={f.href} feature={f} accentText={group.accentText} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function FeatureCard({ feature, accentText }: { feature: Feature; accentText: string }) {
  const rarity = RARITY_CONFIG[feature.rarity];
  const Icon = feature.icon;

  return (
    <Link href={feature.href}>
      <div className="group relative bg-slate-900/60 border border-slate-800/60 rounded-xl p-3.5 hover:bg-slate-800/70 hover:border-slate-700/60 transition-all duration-200 cursor-pointer hover:scale-[1.02] hover:shadow-lg">
        {/* Value bar */}
        <div className="absolute top-0 left-0 h-0.5 rounded-t-xl bg-gradient-to-r from-transparent via-slate-600 to-transparent" style={{ width: `${feature.value * 10}%` }} />

        <div className="flex items-start gap-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${rarity.bg}`}>
            <Icon className={`w-4 h-4 ${accentText}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <p className="text-xs font-semibold text-white truncate group-hover:text-white">{feature.label}</p>
              {feature.live ? (
                <span className="text-[8px] font-bold px-1 py-0.5 rounded bg-green-500/20 text-green-400 shrink-0">LIVE</span>
              ) : (
                <span className="text-[8px] font-bold px-1 py-0.5 rounded bg-slate-700/60 text-slate-500 shrink-0">SOON</span>
              )}
            </div>
            <p className="text-[10px] text-slate-500 leading-tight line-clamp-2">{feature.desc}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2.5">
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${rarity.bg} ${rarity.color}`}>
            {rarity.label}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-[9px] text-slate-600">Value</span>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full ${i < Math.ceil(feature.value / 2) ? accentText.replace("text-", "bg-") : "bg-slate-700"}`}
                />
              ))}
            </div>
          </div>
          <ArrowRight className="w-3 h-3 text-slate-700 group-hover:text-slate-400 transition-colors" />
        </div>
      </div>
    </Link>
  );
}
