/**
 * Navigation — ShadowChat / SKYCOIN4444
 * Bold landing-page nav with prominent CTA buttons guiding visitors into the app.
 * Clear labels: "Enter App", "AI Profile", "Crypto Hub", "Go Social", "Mine Now"
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Zap, Search, Command, ChevronDown, Menu, X, Rocket, ArrowRight,
  Globe, Coins, Trophy, Brain, Home, Hash, Video, Camera,
  MessageSquare, Users, Star, Radio, Wallet, TrendingUp, Layers,
  Sparkles, BarChart3, Target, Building2, Cpu, ShoppingBag,
  Gamepad2, Gift, Crown, Heart, Code2, BookOpen, Activity,
  Flame, GraduationCap, Bot, ChevronRight, PieChart, UserCircle2,
  Pickaxe, ArrowLeftRight, LogIn, Sun, Moon
} from "lucide-react";
import { getLoginUrl, getGoogleLoginUrl } from "@/const";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

// ─── Mega-menu data ───────────────────────────────────────────────────────────
const NAV_GROUPS = [
  {
    label: "Social",
    icon: Globe,
    color: "text-cyan-400",
    items: [
      { label: "Feed",        href: "/social",         icon: Home,         desc: "Personalized social feed"       },
      { label: "Explore",     href: "/explore",        icon: Hash,         desc: "Discover trending content"      },
      { label: "Reels",       href: "/reels",          icon: Video,        desc: "Short-form video"               },
      { label: "Stories",     href: "/stories",        icon: Camera,       desc: "24-hour story updates"          },
      { label: "Messages",    href: "/messages",       icon: MessageSquare,desc: "Direct messaging"               },
      { label: "Communities", href: "/community",      icon: Users,        desc: "Topic communities"              },
      { label: "Creators",    href: "/creator-studio", icon: Star,         desc: "Creator tools & studio"         },
      { label: "Streaming",   href: "/streaming",      icon: Radio,        desc: "Live streams & VOD"             },
    ],
  },
  {
    label: "Crypto",
    icon: Coins,
    color: "text-yellow-400",
    items: [
      { label: "Wallet",      href: "/wallet",         icon: Wallet,       desc: "Manage your assets"             },
      { label: "Staking",     href: "/staking",        icon: Zap,          desc: "Stake SKY444 tokens"            },
      { label: "Token Swap",  href: "/token-swap",     icon: TrendingUp,   desc: "Swap tokens instantly"          },
      { label: "DeFi",        href: "/defi",           icon: Layers,       desc: "Decentralized finance"          },
      { label: "NFT Gallery", href: "/nft-gallery",    icon: Sparkles,     desc: "Your NFT collection"            },
      { label: "Trading",     href: "/trading",        icon: BarChart3,    desc: "Advanced trading terminal"      },
      { label: "Yield Farm",  href: "/farming",        icon: Target,       desc: "Yield farming pools"            },
      { label: "Governance",  href: "/governance",     icon: Building2,    desc: "Vote on proposals"              },
    ],
  },
  {
    label: "Earn",
    icon: Trophy,
    color: "text-purple-400",
    items: [
      { label: "Mine SKY444", href: "/mining",         icon: Cpu,          desc: "Proof-of-engagement mining"     },
      { label: "Marketplace", href: "/marketplace",    icon: ShoppingBag,  desc: "Buy & sell digital goods"       },
      { label: "Tournaments", href: "/tournaments",    icon: Trophy,       desc: "Compete & win prizes"           },
      { label: "Gaming",      href: "/gaming",         icon: Gamepad2,     desc: "Play-to-earn games"             },
      { label: "Referrals",   href: "/referrals",      icon: Gift,         desc: "Earn by referring friends"      },
      { label: "Leaderboards",href: "/leaderboards",   icon: Crown,        desc: "Top earners & creators"         },
      { label: "Charity",     href: "/charity",        icon: Heart,        desc: "Donate & make an impact"        },
      { label: "Affiliate",   href: "/affiliate",      icon: Target,       desc: "Affiliate dashboard"            },
    ],
  },
  {
    label: "HOPE AI",
    icon: Brain,
    color: "text-fuchsia-400",
    items: [
      { label: "HOPE AI Chat",   href: "/hope-ai",         icon: Sparkles,     desc: "Talk to your HOPE AI assistant"  },
      { label: "Mission Control",href: "/mission-control", icon: Target,       desc: "Command center & digital twin"   },
      { label: "HOPE AI Control",href: "/hope-ai-control", icon: Activity,     desc: "Orchestrator control panel"      },
      { label: "AI Brain",       href: "/ai-brain",        icon: Brain,        desc: "AI command center"              },
      { label: "AI Core",        href: "/ai-core",         icon: Cpu,          desc: "Core AI engine"                 },
      { label: "AI Intelligence",href: "/ai-intelligence", icon: Activity,     desc: "Moderation & sentiment hub"      },
      { label: "AI Engineer",    href: "/ai-engineer",     icon: Cpu,          desc: "AI-powered dev tools"           },
      { label: "Code Studio",    href: "/ai-code-studio",  icon: Code2,        desc: "AI coding assistant"            },
      { label: "Copy Studio",    href: "/ai-copy-studio",  icon: Sparkles,     desc: "AI content generation"          },
      { label: "AI Personas",    href: "/ai-personas",     icon: Bot,          desc: "AI persona system"              },
      { label: "AI Tools",       href: "/ai-tools",        icon: Sparkles,     desc: "12 AI tools + grey-area suite"  },
      { label: "Agent Engine",   href: "/ai-agent",        icon: Bot,          desc: "24/7 auto-post & code gen"      },
    ],
  },
];

const ALL_ROUTES = NAV_GROUPS.flatMap(g => g.items).concat([
  { label: "Dashboard",    href: "/dashboard",    icon: BarChart3,    desc: "Your main dashboard"       },
  { label: "Ecosystem",    href: "/ecosystem",    icon: Globe,        desc: "Ecosystem overview"        },
  { label: "Investor Room",href: "/investor",     icon: Building2,    desc: "Investor information"      },
  { label: "Token Metrics",href: "/token-metrics",icon: PieChart,     desc: "SKY444 metrics"            },
  { label: "Unhidden Mode",href: "/unhidden",     icon: Zap,          desc: "Power user control panel"  },
  { label: "Crypto Hub",   href: "/crypto-hub",   icon: Coins,        desc: "Mine, swap, stake, burn"   },
]);

// ─── Bold CTA Buttons shown in the nav bar ────────────────────────────────────
// Trimmed to 3 primary CTAs to prevent the desktop nav bar from overflowing and
// overlapping the mega-menu group buttons. The full set remains reachable via the
// mega-menus and the ⌘K command palette.
const CTA_BUTTONS = [
  {
    label: "Go Social",
    href: "/social",
    icon: Globe,
    gradient: "from-cyan-500 to-blue-600",
    shadow: "shadow-cyan-500/30",
    glow: "hover:shadow-cyan-500/50",
    tooltip: "Click here → Social Feed",
  },
  {
    label: "Hope AI",
    href: "/hope-ai",
    icon: Sparkles,
    gradient: "from-violet-500 via-fuchsia-500 to-pink-500",
    shadow: "shadow-violet-500/30",
    glow: "hover:shadow-fuchsia-500/50",
    tooltip: "Click here → Talk to Hope AI",
  },
  {
    label: "Mission Control",
    href: "/mission-control",
    icon: Target,
    gradient: "from-amber-400 via-yellow-500 to-amber-600",
    shadow: "shadow-amber-500/30",
    glow: "hover:shadow-amber-500/50",
    tooltip: "Click here → HOPE AI Mission Control",
  },
];

// ─── Command Palette ──────────────────────────────────────────────────────────
function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [, navigate] = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) { setTimeout(() => inputRef.current?.focus(), 50); setQuery(""); }
  }, [open]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const filtered = query.trim()
    ? ALL_ROUTES.filter(r =>
        r.label.toLowerCase().includes(query.toLowerCase()) ||
        r.desc?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : ALL_ROUTES.slice(0, 8);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-xl mx-4 bg-slate-900/98 border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/10 overflow-hidden"
        onClick={e => e.stopPropagation()}
        style={{ animation: "scaleIn 150ms cubic-bezier(0.23,1,0.32,1)" }}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-700/50">
          <Search className="w-4 h-4 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search pages, features, actions…"
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
          />
          <kbd className="text-[10px] text-slate-500 border border-slate-700 rounded px-1.5 py-0.5">ESC</kbd>
        </div>
        <div className="py-2 max-h-80 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="text-center text-sm text-slate-500 py-6">No results found</p>
          ) : filtered.map(route => (
            <button
              key={route.href}
              onClick={() => { navigate(route.href); onClose(); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-cyan-500/10 transition-colors text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-cyan-500/20 transition-colors">
                <route.icon className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{route.label}</p>
                {route.desc && <p className="text-xs text-slate-500 truncate">{route.desc}</p>}
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 transition-colors" />
            </button>
          ))}
        </div>
        <div className="px-4 py-2 border-t border-slate-700/50 flex items-center gap-4 text-[11px] text-slate-500">
          <span><kbd className="border border-slate-700 rounded px-1">↑↓</kbd> navigate</span>
          <span><kbd className="border border-slate-700 rounded px-1">↵</kbd> select</span>
          <span><kbd className="border border-slate-700 rounded px-1">ESC</kbd> close</span>
        </div>
      </div>
    </div>
  );
}

// ─── Mega Menu dropdown ───────────────────────────────────────────────────────
function MegaMenu({ group, onClose }: { group: typeof NAV_GROUPS[0]; onClose: () => void }) {
  return (
    <div
      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[520px] bg-slate-900/98 border border-slate-700/60 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden backdrop-blur-xl"
      style={{ animation: "megaMenuIn 180ms cubic-bezier(0.23,1,0.32,1)" }}
    >
      <div className="p-2">
        <div className="grid grid-cols-2 gap-0.5">
          {group.items.map(item => (
            <Link key={item.href} href={item.href} onClick={onClose}>
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/80 transition-all duration-150 group cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-slate-700 transition-colors">
                  <item.icon className={`w-4 h-4 ${group.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white leading-tight">{item.label}</p>
                  <p className="text-[11px] text-slate-500 truncate leading-tight mt-0.5">{item.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="px-4 py-2.5 border-t border-slate-800/60 bg-slate-950/40 flex items-center justify-between">
        <span className="text-[11px] text-slate-500">{group.items.length} features</span>
        <Link href={group.items[0].href} onClick={onClose}>
          <span className={`text-[11px] font-medium ${group.color} flex items-center gap-1 hover:opacity-80 transition-opacity cursor-pointer`}>
            Explore all <ChevronRight className="w-3 h-3" />
          </span>
        </Link>
      </div>
    </div>
  );
}

// ─── Main Navigation ──────────────────────────────────────────────────────────
export function Navigation() {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setCommandOpen(true); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  useEffect(() => { setActiveMenu(null); setMobileOpen(false); }, [location]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setActiveMenu(null);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const toggleMenu = useCallback((label: string) =>
    setActiveMenu(prev => prev === label ? null : label), []);

  return (
    <>
      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />

      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          scrolled
            ? "bg-[#07050f]/96 backdrop-blur-xl border-b border-purple-900/30 shadow-2xl shadow-black/50"
            : "bg-[#07050f]/85 backdrop-blur-md border-b border-transparent"
        }`}
      >
        {/* Top gradient line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, oklch(0.72 0.28 305 / 0.8), oklch(0.72 0.28 340 / 0.6), oklch(0.80 0.20 200 / 0.7), transparent)" }}
        />

        <div className="max-w-screen-xl mx-auto px-4 lg:px-6">
          <div className="flex items-center h-16 gap-2">

            {/* ── Logo ── */}
            <Link href="/">
              <div className="flex items-center gap-2.5 mr-4 group cursor-pointer shrink-0">
                <div className="relative w-8 h-8">
                  <div
                    className="absolute inset-0 rounded-lg opacity-90 group-hover:opacity-100 transition-opacity"
                    style={{ background: "linear-gradient(135deg, oklch(0.72 0.28 305), oklch(0.72 0.28 340), oklch(0.80 0.20 200))", backgroundSize: "300% 300%", animation: "tiedye-shift 4s ease infinite" }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div className="absolute inset-0 rounded-lg ring-1 ring-cyan-400/30 group-hover:ring-cyan-400/60 transition-all" />
                </div>
                <span
                  className="hidden sm:block text-base font-bold tracking-tight"
                  style={{ background: "linear-gradient(90deg, oklch(0.85 0.25 305), oklch(0.80 0.25 340), oklch(0.80 0.20 200), oklch(0.72 0.24 40))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
                >
                  SKYCOIN4444
                </span>
              </div>
            </Link>

            {/* ── Desktop mega-menu groups ── */}
            <div className="hidden xl:flex items-center gap-0.5">
              {NAV_GROUPS.map(group => (
                <div key={group.label} className="relative">
                  <button
                    onClick={() => toggleMenu(group.label)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                      activeMenu === group.label ? "text-white" : "text-gray-400 hover:text-white"
                    }`}
                    style={activeMenu === group.label ? { background: "oklch(0.72 0.28 305 / 0.15)" } : {}}
                  >
                    <group.icon className={`w-3.5 h-3.5 ${group.color}`} />
                    {group.label}
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeMenu === group.label ? "rotate-180" : ""}`} />
                  </button>
                  {activeMenu === group.label && (
                    <MegaMenu group={group} onClose={() => setActiveMenu(null)} />
                  )}
                </div>
              ))}
            </div>

            {/* ── BOLD CTA BUTTONS — the main guide for visitors ── */}
            <div className="hidden lg:flex items-center gap-2 ml-auto">

              {/* Hint label */}
              <span className="text-[11px] text-slate-500 mr-1 hidden xl:block whitespace-nowrap">
                ↓ Click to explore
              </span>

              {CTA_BUTTONS.map(btn => (
                <Link key={btn.href} href={btn.href}>
                  <Button
                    size="sm"
                    title={btn.tooltip}
                    className={`bg-gradient-to-r ${btn.gradient} text-white border-0 font-bold text-xs h-9 px-4 shadow-lg ${btn.shadow} hover:scale-105 ${btn.glow} hover:shadow-xl transition-all duration-200 whitespace-nowrap`}
                  >
                    <btn.icon className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                    {btn.label}
                  </Button>
                </Link>
              ))}

              {/* Divider */}
              <div className="w-px h-6 bg-slate-700/60 mx-1" />

              {/* Theme Toggle */}
              <ThemeSwitcher compact />

              {/* Search */}
              <button
                onClick={() => setCommandOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-400 hover:text-white transition-all duration-150 text-sm"
                style={{ background: "oklch(0.12 0.025 275 / 0.7)", border: "1px solid oklch(0.72 0.28 305 / 0.20)" }}
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden xl:block text-xs">Search</span>
                <kbd className="hidden xl:flex items-center gap-0.5 text-[10px] text-slate-600 border border-slate-700 rounded px-1">
                  <Command className="w-2.5 h-2.5" />K
                </kbd>
              </button>

              {/* Enter App / Sign In */}
              {user ? (
                <Link href="/social">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-white to-slate-200 text-slate-900 border-0 font-extrabold text-xs h-9 px-5 shadow-lg shadow-white/20 hover:scale-105 hover:shadow-white/40 transition-all duration-200"
                  >
                    <Rocket className="w-3.5 h-3.5 mr-1.5" />Enter App
                  </Button>
                </Link>
              ) : (
                <div className="flex items-center gap-1.5">
                  {/* Google SSO */}
                  <a href={getGoogleLoginUrl()}>
                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-white text-slate-800 border border-slate-200 shadow hover:scale-105 hover:shadow-md transition-all duration-200">
                      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span className="hidden xl:block">Google</span>
                    </button>
                  </a>
                  {/* Manus SSO */}
                  <Link href={getLoginUrl()}>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-white to-slate-200 text-slate-900 border-0 font-extrabold text-xs h-9 px-5 shadow-lg shadow-white/20 hover:scale-105 hover:shadow-white/40 transition-all duration-200"
                    >
                      <LogIn className="w-3.5 h-3.5 mr-1.5" />Sign In
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* ── Mobile: just Enter App + hamburger ── */}
            <div className="flex lg:hidden items-center gap-2 ml-auto">
              {user ? (
                <Link href="/social">
                  <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs h-8 px-3">
                    <Rocket className="w-3.5 h-3.5 mr-1" />Enter App
                  </Button>
                </Link>
              ) : (
                <Link href={getLoginUrl()}>
                  <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs h-8 px-3">
                    <LogIn className="w-3.5 h-3.5 mr-1" />Sign In
                  </Button>
                </Link>
              )}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
                className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700/60 active:bg-slate-700 active:scale-95 transition-all duration-150"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile menu ── */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-800/60 bg-slate-950/98 backdrop-blur-xl max-h-[80vh] overflow-y-auto">
            {/* Search row */}
            <div className="px-4 pt-3 pb-2">
              <button
                onClick={() => { setCommandOpen(true); setMobileOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-300 text-sm hover:border-purple-500/50 hover:text-white active:scale-[0.99] transition-all duration-150"
              >
                <Search className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="flex-1 text-left">Search anything…</span>
                <kbd className="text-[10px] text-slate-600 border border-slate-700 rounded px-1.5 py-0.5 font-mono">⌘K</kbd>
              </button>
            </div>

            {/* Quick CTA buttons on mobile */}
            <div className="px-4 pb-3 grid grid-cols-2 gap-2">
              {CTA_BUTTONS.map(btn => (
                <Link key={btn.href} href={btn.href} onClick={() => setMobileOpen(false)}>
                  <Button
                    size="sm"
                    className={`w-full bg-gradient-to-r ${btn.gradient} text-white font-bold text-xs h-9 border-0`}
                  >
                    <btn.icon className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                    {btn.label}
                  </Button>
                </Link>
              ))}
            </div>

            {/* Nav groups */}
            {NAV_GROUPS.map(group => (
              <div key={group.label} className="px-3 py-2">
                <p className={`text-[11px] font-semibold uppercase tracking-wider px-2 mb-2 ${group.color}`}>
                  {group.label}
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {group.items.map(item => (
                    <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="block">
                      <div className="flex items-center gap-2.5 px-3 py-3 rounded-xl hover:bg-slate-800/70 active:bg-slate-700/80 active:scale-[0.98] transition-all duration-150 cursor-pointer border border-transparent hover:border-slate-700/50">
                        <item.icon className={`w-4 h-4 ${group.color} shrink-0`} />
                        <span className="text-sm text-slate-200 truncate font-medium">{item.label}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {/* Mobile Enter App CTA */}
            <div className="px-4 py-3 border-t border-slate-800/60">
              {user ? (
                <Link href="/social" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-white to-slate-200 text-slate-900 font-extrabold">
                    <Rocket className="w-4 h-4 mr-2" />Enter the App Now
                  </Button>
                </Link>
              ) : (
                <Link href={getLoginUrl()} onClick={() => setMobileOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-white to-slate-200 text-slate-900 font-extrabold">
                    <LogIn className="w-4 h-4 mr-2" />Sign In to Get Started
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to push content below fixed nav */}
      <div className="h-16" />

      <style>{`
        @keyframes megaMenuIn {
          from { opacity:0; transform:translateX(-50%) translateY(-6px) scale(0.97); }
          to   { opacity:1; transform:translateX(-50%) translateY(0) scale(1); }
        }
        @keyframes scaleIn {
          from { opacity:0; transform:scale(0.96); }
          to   { opacity:1; transform:scale(1); }
        }
        @keyframes tiedye-shift {
          0%,100% { background-position:0% 50%; }
          50%      { background-position:100% 50%; }
        }
      `}</style>
    </>
  );
}

export default Navigation;
