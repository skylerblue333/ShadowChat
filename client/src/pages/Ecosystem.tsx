import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Github, Star, GitFork, ExternalLink } from "lucide-react";
import {
  Bot,
  TrendingUp,
  GraduationCap,
  Gamepad2,
  MessageCircle,
  Store,
  Vote,
  Shield,
  Code2,
  Layers,
  Cpu,
  Database,
  Globe,
  Rocket,
  CheckCircle2,
  ArrowRight,
  Zap,
  Users,
  BarChart3,
  Lock,
  ChevronRight,
} from "lucide-react";

function GitHubSection() {
  const { data: repos } = trpc.feed.github.useQuery();
  return (
    <div className="mb-20">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-3 flex items-center justify-center gap-2">
          <Github className="w-7 h-7" /> Open Source
        </h2>
        <p className="text-muted-foreground">SKYCOIN4444 is built in public. Explore the codebase.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(repos || []).map((repo: any) => (
          <a key={repo.name} href={repo.url} target="_blank" rel="noopener noreferrer"
            className="stat-card hover:border-[oklch(0.72 0.28 305)]/50 hover:-translate-y-0.5 transition-all duration-200 block">
            <div className="flex items-start justify-between mb-2">
              <div className="font-semibold text-sm truncate flex-1">{repo.name}</div>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground shrink-0 ml-2" />
            </div>
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{repo.description}</p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {repo.language && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[oklch(0.72 0.22 295)]" />{repo.language}</span>}
              <span className="flex items-center gap-1"><Star className="w-3 h-3" />{repo.stars}</span>
              <span className="flex items-center gap-1"><GitFork className="w-3 h-3" />{repo.forks}</span>
            </div>
          </a>
        ))}
        {!repos && [0,1,2].map(i => (
          <div key={i} className="stat-card animate-pulse">
            <div className="h-4 bg-white/10 rounded mb-2 w-3/4" />
            <div className="h-3 bg-white/10 rounded mb-3" />
            <div className="h-3 bg-white/10 rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

const sectors = [
  {
    icon: Bot,
    name: "AI Engine",
    tagline: "Intelligent automation & ML",
    color: "oklch(0.72 0.28 305)",
    href: "/ai-brain",
    subLinks: [
      { label: "AI Brain", href: "/ai-brain" },
      { label: "AI Engineer", href: "/ai-engineer" },
      { label: "AI Core", href: "/ai-core" },
      { label: "HopeAI", href: "/hope-ai" },
    ],
    features: [
      "Machine learning trading signals",
      "Content generation & automation",
      "Natural language processing",
      "Predictive analytics",
      "AI agent orchestration",
    ],
    status: "ACTIVE",
    badge: "12 Bots",
  },
  {
    icon: TrendingUp,
    name: "Finance & DeFi",
    tagline: "Staking, swaps & yield farming",
    color: "oklch(0.7 0.15 280)",
    href: "/crypto",
    subLinks: [
      { label: "Crypto Wallet", href: "/crypto" },
      { label: "Token Swap", href: "/swap" },
      { label: "Staking", href: "/staking" },
      { label: "Yield Farming", href: "/farming" },
    ],
    features: [
      "SKY444 token staking (8-20% APY)",
      "Treasury management",
      "Deflationary burn mechanics",
      "Liquidity pools",
      "Revenue distribution",
    ],
    status: "ACTIVE",
    badge: "8-20% APY",
  },
  {
    icon: GraduationCap,
    name: "Education",
    tagline: "Learn, earn & get certified",
    color: "oklch(0.7 0.2 200)",
    href: "/school",
    subLinks: [
      { label: "SKYCOIN Academy", href: "/school" },
      { label: "Learning Paths", href: "/learning" },
      { label: "Developer Area", href: "/developer" },
      { label: "Code Quality", href: "/code-quality" },
    ],
    features: [
      "Learning paths & courses",
      "Certification system",
      "Knowledge marketplace",
      "Mentor matching",
      "Skill assessments",
    ],
    status: "ACTIVE",
    badge: "6 Courses",
  },
  {
    icon: Gamepad2,
    name: "Gaming",
    tagline: "Play-to-earn & tournaments",
    color: "oklch(0.8 0.15 90)",
    href: "/gaming",
    subLinks: [
      { label: "Arcade", href: "/arcade" },
      { label: "Tournaments", href: "/tournaments" },
      { label: "Quest Board", href: "/quests" },
      { label: "Leaderboards", href: "/leaderboards" },
    ],
    features: [
      "Play-to-earn mechanics",
      "Tournament system",
      "Reward pools",
      "Leaderboards",
      "Achievement NFTs",
    ],
    status: "ACTIVE",
    badge: "P2E",
  },
  {
    icon: MessageCircle,
    name: "Social Network",
    tagline: "Connect, create & grow",
    color: "oklch(0.7 0.15 30)",
    href: "/social",
    subLinks: [
      { label: "Social Feed", href: "/social" },
      { label: "Communities", href: "/community" },
      { label: "Stories", href: "/stories" },
      { label: "Messages", href: "/messages" },
    ],
    features: [
      "Community governance",
      "Encrypted messaging",
      "Creator profiles",
      "Content feeds",
      "Reputation system",
    ],
    status: "ACTIVE",
    badge: "Live",
  },
  {
    icon: Store,
    name: "Commerce",
    tagline: "Buy, sell & monetize",
    color: "oklch(0.72 0.28 305)",
    href: "/marketplace",
    subLinks: [
      { label: "Marketplace", href: "/marketplace" },
      { label: "Escrow Shop", href: "/shop" },
      { label: "Creator Studio", href: "/creator-studio" },
      { label: "Affiliate", href: "/affiliate" },
    ],
    features: [
      "Digital marketplace",
      "NFT trading",
      "Creator monetization",
      "Subscription system",
      "Payment processing",
    ],
    status: "ACTIVE",
    badge: "0% Fees",
  },
  {
    icon: Vote,
    name: "Governance",
    tagline: "Vote, propose & shape the future",
    color: "oklch(0.7 0.15 280)",
    href: "/governance",
    subLinks: [
      { label: "Governance", href: "/governance" },
      { label: "Charity", href: "/charity" },
      { label: "Investor Room", href: "/investor" },
      { label: "Economics", href: "/economics" },
    ],
    features: [
      "Decentralized voting",
      "Proposal system",
      "Treasury allocation",
      "Protocol upgrades",
      "Delegate system",
    ],
    status: "ACTIVE",
    badge: "DAO",
  },
  {
    icon: Shield,
    name: "Security",
    tagline: "Enterprise-grade protection",
    color: "oklch(0.7 0.2 0)",
    href: "/security",
    subLinks: [
      { label: "Security Dashboard", href: "/security" },
      { label: "Audit Log", href: "/audit-log" },
      { label: "API Keys", href: "/api-keys" },
      { label: "2FA Setup", href: "/2fa" },
    ],
    features: [
      "WAF protection",
      "End-to-end encryption",
      "Audit logging",
      "Rate limiting",
      "Compliance frameworks",
    ],
    status: "ACTIVE",
    badge: "SOC2",
  },
];

const quickLinks = [
  { label: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { label: "Social Feed", href: "/social", icon: Users },
  { label: "Staking", href: "/staking", icon: Zap },
  { label: "Marketplace", href: "/marketplace", icon: Store },
  { label: "AI Brain", href: "/ai-brain", icon: Bot },
  { label: "Security", href: "/security", icon: Lock },
];

const techStack = [
  { icon: Code2, label: "React 19 + TypeScript", category: "Frontend" },
  { icon: Layers, label: "tRPC + Express", category: "Backend" },
  { icon: Database, label: "MySQL + Redis", category: "Data" },
  { icon: Cpu, label: "Node.js Runtime", category: "Runtime" },
  { icon: Globe, label: "Cloud Run + CDN", category: "Infrastructure" },
  { icon: Shield, label: "OAuth + JWT", category: "Security" },
];

export default function Ecosystem() {
  const [, navigate] = useLocation();
  const { data: stats } = trpc.platform.stats.useQuery();
  const { data: tokenMetrics } = trpc.token.metrics.useQuery();

  return (
    <div className="min-h-screen py-12">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[oklch(0.72 0.28 305)]/30 bg-[oklch(0.72 0.28 305)]/5 mb-6">
            <Rocket className="h-3 w-3 text-[oklch(0.72 0.28 305)]" />
            <span className="text-xs font-mono text-[oklch(0.72 0.28 305)]">FULL ECOSYSTEM</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            The <span className="text-[oklch(0.72 0.28 305)]">SKYCOIN4444</span> Ecosystem
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Eight fully integrated sectors. Click any card to explore that section.
          </p>
          {/* Quick nav pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-border/50 bg-card hover:border-[oklch(0.72 0.28 305)]/50 hover:bg-[oklch(0.72 0.28 305)]/5 transition-all duration-200 cursor-pointer">
                  <link.icon className="w-3 h-3" />
                  {link.label}
                  <ChevronRight className="w-3 h-3 opacity-50" />
                </button>
              </Link>
            ))}
          </div>
        </div>

        {/* Live Stats Bar */}
        {(stats || tokenMetrics) && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
            <div className="stat-card text-center py-3">
              <div className="text-2xl font-bold text-[oklch(0.72 0.28 305)]">{stats?.totalUsers?.toLocaleString() ?? "—"}</div>
              <div className="text-xs text-muted-foreground mt-1">Total Users</div>
            </div>
            <div className="stat-card text-center py-3">
              <div className="text-2xl font-bold text-[oklch(0.7_0.15_280)]">{stats?.totalPosts?.toLocaleString() ?? "—"}</div>
              <div className="text-xs text-muted-foreground mt-1">Posts Created</div>
            </div>
            <div className="stat-card text-center py-3">
              <div className="text-2xl font-bold text-[oklch(0.8_0.15_90)]">{tokenMetrics?.totalSupply ? `${(tokenMetrics.totalSupply / 1e9).toFixed(1)}B` : "—"}</div>
              <div className="text-xs text-muted-foreground mt-1">SKY444 Price</div>
            </div>
            <div className="stat-card text-center py-3">
              <div className="text-2xl font-bold text-[oklch(0.7_0.15_30)]">{stats?.totalStreams?.toLocaleString() ?? "—"}</div>
              <div className="text-xs text-muted-foreground mt-1">Live Streams</div>
            </div>
          </div>
        )}

        {/* Sectors Grid — ALL CLICKABLE */}
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {sectors.map((sector) => (
            <Link key={sector.name} href={sector.href}>
              <div className="stat-card group cursor-pointer hover:border-[oklch(0.72 0.28 305)]/60 hover:shadow-lg hover:shadow-[oklch(0.72 0.28 305)]/5 hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.99]">
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `color-mix(in oklch, ${sector.color} 15%, transparent)` }}
                    >
                      <sector.icon className="w-6 h-6" style={{ color: sector.color }} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold leading-tight">{sector.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{sector.tagline}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[oklch(0.72 0.28 305)]/10 text-[oklch(0.72 0.28 305)] border border-[oklch(0.72 0.28 305)]/20">
                      {sector.status}
                    </span>
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `color-mix(in oklch, ${sector.color} 12%, transparent)`, color: sector.color }}
                    >
                      {sector.badge}
                    </span>
                  </div>
                </div>
                {/* Features */}
                <ul className="space-y-1.5 mb-4">
                  {sector.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: sector.color }} />
                      {feature}
                    </li>
                  ))}
                </ul>
                {/* Sub-links */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {sector.subLinks.map((sub) => (
                    <span
                      key={sub.href}
                      onClick={(e) => { e.preventDefault(); navigate(sub.href); }}
                      className="text-xs px-2 py-1 rounded-md border border-border/50 bg-background/50 hover:border-[oklch(0.72 0.28 305)]/40 hover:bg-[oklch(0.72 0.28 305)]/5 transition-colors cursor-pointer"
                    >
                      {sub.label}
                    </span>
                  ))}
                </div>
                {/* CTA Row */}
                <div className="flex items-center justify-between pt-3 border-t border-border/30">
                  <span className="text-xs text-muted-foreground">Tap to explore</span>
                  <div
                    className="flex items-center gap-1 text-xs font-semibold group-hover:gap-2 transition-all duration-200"
                    style={{ color: sector.color }}
                  >
                    Open {sector.name}
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Tech Stack */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Technology <span className="text-[oklch(0.72 0.28 305)]">Stack</span>
            </h2>
            <p className="text-muted-foreground">
              Built on modern, battle-tested infrastructure designed for scale.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {techStack.map((tech) => (
              <div key={tech.label} className="stat-card text-center">
                <tech.icon className="w-6 h-6 text-[oklch(0.72 0.28 305)] mx-auto mb-2" />
                <div className="text-xs font-semibold mb-1">{tech.label}</div>
                <div className="text-xs text-muted-foreground">{tech.category}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Integration Philosophy */}
        <div className="stat-card max-w-4xl mx-auto mb-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[oklch(0.7_0.15_280)] opacity-5 blur-[80px] rounded-full" />
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              What Makes This <span className="text-[oklch(0.72 0.28 305)]">Different</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-3 text-muted-foreground uppercase text-xs tracking-wider">Traditional Approach</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500/70" />
                    Separate apps for each function
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500/70" />
                    $2M–$5M+ development cost
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500/70" />
                    12–24 months build time
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500/70" />
                    Fragmented user experience
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500/70" />
                    Multiple teams required
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-[oklch(0.72 0.28 305)] uppercase text-xs tracking-wider">SKYCOIN4444 Approach</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[oklch(0.72 0.28 305)]" />
                    One unified platform
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[oklch(0.72 0.28 305)]" />
                    $5M–$20M+ equivalent value
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[oklch(0.72 0.28 305)]" />
                    Engineered into existence now
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[oklch(0.72 0.28 305)]" />
                    Seamless cross-sector integration
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[oklch(0.72 0.28 305)]" />
                    Single codebase, infinite scale
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* GitHub Open Source */}
        <GitHubSection />

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Explore the Platform
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Dive into any sector. Every feature is live and connected.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/proof-vault">
              <Button variant="outline" className="border-[oklch(0.72 0.28 305)]/30 gap-2">
                <Shield className="w-4 h-4" /> Proof Vault
              </Button>
            </Link>
            <Link href="/staking">
              <Button variant="outline" className="border-[oklch(0.72 0.28 305)]/30 gap-2">
                <TrendingUp className="w-4 h-4" /> Staking
              </Button>
            </Link>
            <Link href="/token">
              <Button variant="outline" className="border-[oklch(0.72 0.28 305)]/30 gap-2">
                <Layers className="w-4 h-4" /> SKY444
              </Button>
            </Link>
            <Link href="/trading">
              <Button variant="outline" className="border-[oklch(0.72 0.28 305)]/30 gap-2">
                <Bot className="w-4 h-4" /> AI Trading
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button variant="outline" className="border-[oklch(0.72 0.28 305)]/30 gap-2">
                <Store className="w-4 h-4" /> Marketplace
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
