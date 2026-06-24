import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  TrendingUp, DollarSign, Shield, Users, Zap, Globe, ArrowRight,
  ExternalLink, Download, CheckCircle, Lock, BarChart3, PieChart,
  Coins, Flame, Rocket, Star, Award, BookOpen, FileText, AlertTriangle,
  ChevronDown, ChevronUp, Copy, Clock, Wallet, Gift, Target, Activity,
  Building2, Scale, Eye, RefreshCw, Crown, Sparkles, Timer, Percent,
} from "lucide-react";
import { getLoginUrl } from "@/const";

const ICO_TIERS = [
  { name: "Seed Round", price: 0.001, hardCap: 500000, bonus: 40, status: "closed", color: "from-zinc-700 to-zinc-600", badge: "CLOSED" },
  { name: "Private Sale", price: 0.003, hardCap: 1500000, bonus: 25, status: "closed", color: "from-zinc-700 to-zinc-600", badge: "CLOSED" },
  { name: "Pre-Sale", price: 0.005, hardCap: 2500000, bonus: 15, status: "active", color: "from-violet-700 to-violet-600", badge: "LIVE NOW" },
  { name: "Public Sale", price: 0.010, hardCap: 5000000, bonus: 5, status: "upcoming", color: "from-blue-700 to-blue-600", badge: "UPCOMING" },
];

const TOKENOMICS = [
  { label: "Public ICO Sale", pct: 30, color: "bg-violet-500", tokens: "300M" },
  { label: "Ecosystem & Rewards", pct: 20, color: "bg-blue-500", tokens: "200M" },
  { label: "Team & Advisors", pct: 15, color: "bg-emerald-500", tokens: "150M" },
  { label: "Treasury Reserve", pct: 15, color: "bg-yellow-500", tokens: "150M" },
  { label: "Liquidity & Market Making", pct: 10, color: "bg-orange-500", tokens: "100M" },
  { label: "Marketing & Partnerships", pct: 5, color: "bg-pink-500", tokens: "50M" },
  { label: "Community Airdrops", pct: 3, color: "bg-cyan-500", tokens: "30M" },
  { label: "Legal & Compliance", pct: 2, color: "bg-zinc-500", tokens: "20M" },
];

const ROADMAP = [
  { phase: "Phase 1", title: "Foundation", status: "complete", q: "Q1–Q2 2026", items: ["Core social platform", "Live streaming (WebRTC)", "Proof-of-Engagement mining", "NFT marketplace", "Trust & Safety engine"] },
  { phase: "Phase 2", title: "Expansion", status: "active", q: "Q3–Q4 2026", items: ["Pre-Sale ICO round", "Mobile app (iOS + Android)", "Multi-chain deployment", "DEX integration", "Creator subscriptions"] },
  { phase: "Phase 3", title: "Scale", status: "upcoming", q: "Q1–Q2 2027", items: ["Public Sale ICO round", "DEX listing (SKY444/USDC)", "Cross-chain bridge", "Enterprise API", "10 language expansion"] },
  { phase: "Phase 4", title: "Maturity", status: "upcoming", q: "Q3 2027+", items: ["Layer 2 deployment", "SKY444 debit card", "Metaverse integration", "AI agent marketplace", "Full DAO governance"] },
];

const LEGAL_DOCS = [
  { name: "White Paper v2.0", icon: BookOpen, path: "/whitepaper.md", desc: "Full technical and economic overview" },
  { name: "Token Sale Agreement", icon: FileText, path: "/legal/token-sale-agreement.md", desc: "Binding purchase terms and vesting" },
  { name: "Terms of Service", icon: Scale, path: "/legal/terms-of-service.md", desc: "Platform usage terms" },
  { name: "Privacy Policy", icon: Shield, path: "/legal/privacy-policy.md", desc: "Data collection and GDPR rights" },
  { name: "Risk Disclosures", icon: AlertTriangle, path: "/legal/risk-disclosures.md", desc: "Full risk factors before investing" },
  { name: "KYC/AML Policy", icon: Eye, path: "/legal/kyc-aml-policy.md", desc: "Identity verification requirements" },
];

function StatCard({ icon: Icon, label, value, sub, color = "violet" }: { icon: any; label: string; value: string; sub?: string; color?: string }) {
  const colors: Record<string, string> = {
    violet: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    yellow: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    orange: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  };
  return (
    <div className={`rounded-xl border p-4 ${colors[color] || colors.violet}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4" />
        <span className="text-xs font-medium opacity-70">{label}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {sub && <div className="text-xs opacity-60 mt-1">{sub}</div>}
    </div>
  );
}

function BuyWidget() {
  const { user } = useAuth();
  const [amount, setAmount] = useState("100");
  const [, navigate] = useLocation();

  const createCheckout = trpc.ico.createCheckout.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.open(data.checkoutUrl, "_blank");
        toast.success("Redirecting to secure checkout...");
      }
    },
    onError: (err) => toast.error(err.message),
  });

  const usdAmount = parseFloat(amount) || 0;
  const pricePerToken = 0.005; // Pre-sale price
  const tokensReceived = Math.floor(usdAmount / pricePerToken);
  const bonusTokens = Math.floor(tokensReceived * 0.15);
  const totalTokens = tokensReceived + bonusTokens;

  const handleBuy = () => {
    if (!user) {
      window.location.href = getLoginUrl();
      return;
    }
    if (usdAmount < 100) {
      toast.error("Minimum purchase is $100 USD");
      return;
    }
    if (usdAmount > 10000) {
      toast.error("Maximum purchase is $10,000 USD in Pre-Sale");
      return;
    }
    createCheckout.mutate({
      tierId: "presale",
      usdAmount,
      origin: window.location.origin,
      referralCode: undefined,
    });
  };

  return (
    <div className="bg-gradient-to-br from-violet-900/40 to-blue-900/40 border border-violet-500/30 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-sm font-semibold text-green-400">PRE-SALE LIVE</span>
        <Badge className="ml-auto bg-violet-500/20 text-violet-300 border-violet-500/30">15% BONUS</Badge>
      </div>

      <div className="text-center mb-6">
        <div className="text-4xl font-black text-white">$0.005</div>
        <div className="text-zinc-400 text-sm">per SKY444 token</div>
        <div className="text-xs text-zinc-500 mt-1">Public sale price: $0.010 (+100%)</div>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-zinc-300 text-sm">Amount (USD)</Label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-7 bg-zinc-800/60 border-zinc-600 text-white"
              min="100"
              max="10000"
              step="50"
            />
          </div>
          <div className="flex gap-2 mt-2">
            {[100, 500, 1000, 5000].map((v) => (
              <button
                key={v}
                onClick={() => setAmount(String(v))}
                className="text-xs px-2 py-1 rounded bg-zinc-700/60 text-zinc-300 hover:bg-violet-600/40 hover:text-violet-300 transition-colors"
              >
                ${v.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-zinc-800/40 rounded-xl p-4 space-y-2 text-sm">
          <div className="flex justify-between text-zinc-400">
            <span>Base tokens</span>
            <span className="text-white font-medium">{tokensReceived.toLocaleString()} SKY444</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>15% Pre-Sale bonus</span>
            <span className="text-green-400 font-medium">+{bonusTokens.toLocaleString()} SKY444</span>
          </div>
          <div className="border-t border-zinc-700 pt-2 flex justify-between">
            <span className="text-white font-semibold">Total received</span>
            <span className="text-violet-300 font-bold">{totalTokens.toLocaleString()} SKY444</span>
          </div>
          <div className="flex justify-between text-zinc-500 text-xs">
            <span>Value at public sale ($0.01)</span>
            <span className="text-emerald-400">${(totalTokens * 0.01).toLocaleString()}</span>
          </div>
        </div>

        <Button
          onClick={handleBuy}
          disabled={createCheckout.isPending || usdAmount < 100}
          className="w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold py-3 text-base"
        >
          {createCheckout.isPending ? (
            <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
          ) : !user ? (
            <><Lock className="w-4 h-4 mr-2" /> Sign In to Buy</>
          ) : (
            <><Rocket className="w-4 h-4 mr-2" /> Buy SKY444 Now</>
          )}
        </Button>

        <div className="flex items-center justify-center gap-4 text-xs text-zinc-500">
          <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Stripe Secured</span>
          <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> KYC Protected</span>
          <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Instant Credit</span>
        </div>
      </div>
    </div>
  );
}

export default function InvestorPortal() {
  const { user } = useAuth();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const { data: icoStats } = trpc.ico.getStats.useQuery();
  const { data: kpis } = trpc.investor.kpis.useQuery(undefined, { enabled: !!user, retry: false });
  const { data: myPurchases } = trpc.ico.getMyPurchases.useQuery(undefined, { enabled: !!user, retry: false });
  const { data: myReferral } = trpc.ico.getMyReferralCode.useQuery(undefined, { enabled: !!user, retry: false });
  const { data: leaderboard } = trpc.ico.getLeaderboard.useQuery();

  const claimVested = trpc.ico.claimVested.useMutation({
    onSuccess: (data) => toast.success(`Claimed ${data.claimed} SKY444!`),
    onError: (err) => toast.error(err.message),
  });

  const totalRaised = icoStats?.totalRaisedUSD ?? 0;
  const hardCap = 9500000;
  const progressPct = Math.min((totalRaised / hardCap) * 100, 100);

  const faqs = [
    { q: "What is SKY444?", a: "SKYCOIN4444 (SKY444) is the native utility and governance token of the ShadowChat platform. It is earned by participating in the platform, purchased through the ICO, staked for yield, and used to vote on governance decisions." },
    { q: "When will tokens be delivered?", a: "Tokens are credited to your ShadowChat wallet within 24 hours of confirmed payment. They are subject to a vesting schedule: Pre-Sale tokens have a 6-month cliff followed by 12 months of linear vesting." },
    { q: "What is the vesting schedule?", a: "Pre-Sale: 6-month cliff, then 12 months linear. Public Sale: 3-month cliff, then 6 months linear. Tokens vest monthly and are claimable through your investor dashboard." },
    { q: "Is there a referral program?", a: "Yes. Every ICO participant receives a unique referral code. When a referred user completes a purchase, you earn 5% of their purchase amount in SKY444 tokens, credited immediately." },
    { q: "What payment methods are accepted?", a: "Credit/debit card (Stripe), bank transfer (ACH/SEPA for $5,000+), and cryptocurrency (ETH, USDC, SOL for $1,000+). All fiat payments are processed securely through Stripe." },
    { q: "Do I need KYC?", a: "Purchases under $1,000 require email verification only. Purchases of $1,000–$9,999 require government ID + selfie. Purchases above $10,000 require enhanced due diligence including source of funds." },
    { q: "What is Proof-of-Engagement mining?", a: "PoE mining rewards users for genuine platform participation — posting, commenting, streaming, completing courses, and more. Every meaningful action earns SKY444 tokens, with daily caps and anti-manipulation safeguards." },
    { q: "Will SKY444 be listed on exchanges?", a: "Phase 3 (Q1–Q2 2027) includes DEX listing on Uniswap and Jupiter. Centralized exchange listings are planned for Phase 4. There is no guarantee of listing or liquidity." },
  ];

  return (
    <div className="min-h-screen bg-[#07050f] text-white">
      {/* ═══ CINEMATIC HERO BANNER ═══ */}
      <div className="hero-cinematic border-b border-slate-800/60" style={{ minHeight: 520 }}>
        {/* Floating glow orbs */}
        <div className="glow-orb glow-orb-gold w-96 h-96 -top-20 -right-20 animate-hero-float" style={{ animationDelay: '0s' }} />
        <div className="glow-orb glow-orb-purple w-80 h-80 top-40 -left-20 animate-hero-float" style={{ animationDelay: '2s' }} />
        <div className="glow-orb glow-orb-pink w-64 h-64 bottom-0 right-1/3 animate-hero-float" style={{ animationDelay: '4s' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Live badge */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/15 border border-green-500/30">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-green-400 font-bold tracking-wide">ICO PRE-SALE LIVE</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs text-amber-400 font-bold">Phase 3 of 4</span>
                </div>
              </div>

              {/* Headline */}
              <h1 className="text-5xl lg:text-7xl font-black mb-5 leading-[0.95] text-rainbow">
                <span className="text-white">Invest in</span>
                <br />
                <span className="text-gradient-psychedelic" style={{ backgroundSize: '300% 100%' }}>
                  SKYCOIN4444
                </span>
                <br />
                <span className="text-slate-300 text-3xl lg:text-4xl font-bold">The Future of Social Web3</span>
              </h1>

              <p className="text-base mb-8 leading-relaxed max-w-lg desc-metallic">
                SKY444 powers the ShadowChat ecosystem — an AI-driven Web3 social OS where every action earns real economic value. Buy at Pre-Sale price before the public launch.
              </p>

              {/* Key metrics */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                  { value: "$0.005", label: "Pre-Sale Price", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/25" },
                  { value: "+15%", label: "Bonus Tokens", color: "text-green-400", bg: "bg-green-500/10 border-green-500/25" },
                  { value: "1B", label: "Total Supply", color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/25" },
                ].map(m => (
                  <div key={m.label} className={`text-center rounded-xl border p-3 ${m.bg}`}>
                    <div className={`text-2xl font-black stat-number ${m.color}`}>{m.value}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{m.label}</div>
                  </div>
                ))}
              </div>

              {/* ICO Progress — raise bar */}
              <div className="bg-slate-900/70 border border-slate-700/60 rounded-2xl p-5 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Total Raised</p>
                    <p className="text-xl font-black text-white">${totalRaised.toLocaleString()} <span className="text-slate-500 text-sm font-normal">/ $9,500,000</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 mb-0.5">Investors</p>
                    <p className="text-xl font-black text-amber-400">{icoStats?.totalParticipants ?? 0}</p>
                  </div>
                </div>
                <div className="raise-bar mb-2">
                  <div className="raise-bar-fill" style={{ width: `${progressPct}%` }} />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-amber-400 font-bold">{progressPct.toFixed(1)}% funded</span>
                  <span className="text-slate-500">${(hardCap - totalRaised).toLocaleString()} remaining</span>
                </div>
              </div>

              {/* ICO Tier pills */}
              <div className="flex gap-2 mt-4 flex-wrap">
                {ICO_TIERS.map(tier => (
                  <div key={tier.name} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                    tier.status === 'active'
                      ? 'bg-violet-500/20 border-violet-500/40 text-violet-300'
                      : tier.status === 'closed'
                      ? 'bg-slate-700/40 border-slate-600/40 text-slate-500'
                      : 'bg-blue-500/15 border-blue-500/30 text-blue-400'
                  }`}>
                    {tier.status === 'active' && <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />}
                    {tier.name}
                    <span className="opacity-70">{tier.badge}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Buy Widget */}
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-amber-500/10 via-violet-500/10 to-cyan-500/10 blur-xl" />
              <div className="relative">
                <BuyWidget />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <Tabs defaultValue="overview">
          <TabsList className="bg-zinc-900 border border-zinc-700 mb-8 w-full flex flex-wrap h-auto gap-1 p-1">
            {[
              { value: "overview", label: "Overview", icon: BarChart3 },
              { value: "tokenomics", label: "Tokenomics", icon: PieChart },
              { value: "roadmap", label: "Roadmap", icon: Rocket },
              { value: "portfolio", label: "My Portfolio", icon: Wallet },
              { value: "leaderboard", label: "Leaderboard", icon: Crown },
              { value: "legal", label: "Legal Docs", icon: FileText },
              { value: "faq", label: "FAQ", icon: BookOpen },
            ].map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="flex items-center gap-1.5 text-xs data-[state=active]:bg-violet-600 data-[state=active]:text-white"
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard icon={DollarSign} label="Total Raised" value={`$${(totalRaised / 1000).toFixed(0)}K`} sub="of $9.5M hard cap" color="violet" />
              <StatCard icon={Users} label="Investors" value={String(icoStats?.totalParticipants ?? 0)} sub="unique wallets" color="blue" />
              <StatCard icon={Coins} label="Tokens Sold" value={`${((icoStats?.totalTokensSold ?? 0) / 1000000).toFixed(1)}M`} sub="SKY444" color="emerald" />
              <StatCard icon={Flame} label="Burn Rate" value="10%" sub="of all platform fees" color="orange" />
            </div>

            {/* ICO Rounds */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-violet-400" />
                ICO Sale Rounds
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {ICO_TIERS.map((tier) => (
                  <div
                    key={tier.name}
                    className={`relative rounded-xl border p-4 ${
                      tier.status === "active"
                        ? "border-violet-500/50 bg-gradient-to-br from-violet-900/30 to-blue-900/20"
                        : tier.status === "closed"
                        ? "border-zinc-700 bg-zinc-900/40 opacity-70"
                        : "border-zinc-700 bg-zinc-900/40"
                    }`}
                  >
                    {tier.status === "active" && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                        <Badge className="bg-green-500 text-white text-xs px-2">LIVE NOW</Badge>
                      </div>
                    )}
                    <div className="text-sm font-semibold text-zinc-300 mb-1">{tier.name}</div>
                    <div className="text-2xl font-black text-white mb-1">${tier.price.toFixed(3)}</div>
                    <div className="text-xs text-zinc-500 mb-3">Hard Cap: ${(tier.hardCap / 1000000).toFixed(1)}M</div>
                    <div className="flex items-center justify-between">
                      <Badge className={`text-xs ${tier.bonus > 0 ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-zinc-700 text-zinc-400"}`}>
                        +{tier.bonus}% bonus
                      </Badge>
                      <Badge className={`text-xs ${
                        tier.status === "closed" ? "bg-zinc-700 text-zinc-400" :
                        tier.status === "active" ? "bg-violet-500/20 text-violet-300" :
                        "bg-blue-500/20 text-blue-300"
                      }`}>
                        {tier.badge}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform KPIs */}
            {kpis && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-400" />
                  Live Platform Metrics
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard icon={Users} label="Total Users" value={(kpis as any).totalUsers?.toLocaleString() ?? "—"} color="blue" />
                  <StatCard icon={Activity} label="Total Posts" value={(kpis as any).totalPosts?.toLocaleString() ?? "—"} color="emerald" />
                  <StatCard icon={Coins} label="Tokens in Circulation" value={`${((kpis as any).tokensInCirculation / 1000000 || 0).toFixed(1)}M`} color="violet" />
                  <StatCard icon={TrendingUp} label="Staking TVL" value={`${((kpis as any).stakingTVL / 1000 || 0).toFixed(0)}K SKY`} color="yellow" />
                </div>
              </div>
            )}

            {/* Use of Proceeds */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                Use of ICO Proceeds
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { label: "Product Development", pct: 40, color: "bg-violet-500", desc: "Engineering, infrastructure, AI systems" },
                  { label: "Marketing & User Acquisition", pct: 25, color: "bg-blue-500", desc: "Growth campaigns, influencer partnerships" },
                  { label: "Liquidity Provision", pct: 15, color: "bg-emerald-500", desc: "DEX liquidity pools, market making" },
                  { label: "Legal & Compliance", pct: 10, color: "bg-yellow-500", desc: "Regulatory filings, legal counsel" },
                  { label: "Operations & Infrastructure", pct: 10, color: "bg-orange-500", desc: "Servers, security, team operations" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 bg-zinc-900/40 border border-zinc-800 rounded-xl p-4">
                    <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                      {item.pct}%
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{item.label}</div>
                      <div className="text-xs text-zinc-500">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* TOKENOMICS TAB */}
          <TabsContent value="tokenomics">
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-bold mb-6">Token Distribution</h2>
                <div className="space-y-3">
                  {TOKENOMICS.map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${item.color} flex-shrink-0`} />
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-zinc-300">{item.label}</span>
                          <span className="text-white font-semibold">{item.tokens} ({item.pct}%)</span>
                        </div>
                        <Progress value={item.pct} className="h-1.5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-2">Token Specifications</h2>
                <div className="bg-zinc-900/60 border border-zinc-700 rounded-xl overflow-hidden">
                  {[
                    { label: "Token Name", value: "SKYCOIN4444" },
                    { label: "Ticker", value: "SKY444" },
                    { label: "Total Supply", value: "1,000,000,000" },
                    { label: "Decimals", value: "8" },
                    { label: "Networks", value: "ETH · SOL · BNB" },
                    { label: "Max Burn", value: "300M (30%)" },
                    { label: "Seed Price", value: "$0.001" },
                    { label: "Pre-Sale Price", value: "$0.005" },
                    { label: "Public Price", value: "$0.010" },
                  ].map((row, i) => (
                    <div key={row.label} className={`flex justify-between px-4 py-3 text-sm ${i % 2 === 0 ? "bg-zinc-800/30" : ""}`}>
                      <span className="text-zinc-400">{row.label}</span>
                      <span className="text-white font-medium">{row.value}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border border-orange-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span className="font-semibold text-orange-300">Deflationary Burn Mechanics</span>
                  </div>
                  <div className="space-y-2 text-sm text-zinc-300">
                    <div className="flex justify-between">
                      <span>Platform fee burns</span>
                      <span className="text-orange-400">10% of fees</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Transaction burns</span>
                      <span className="text-orange-400">0.5% per transfer</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quarterly buyback & burn</span>
                      <span className="text-orange-400">5% of revenue</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ROADMAP TAB */}
          <TabsContent value="roadmap">
            <div className="space-y-6">
              {ROADMAP.map((phase, i) => (
                <div
                  key={phase.phase}
                  className={`relative border rounded-xl p-6 ${
                    phase.status === "complete" ? "border-emerald-500/30 bg-emerald-900/10" :
                    phase.status === "active" ? "border-violet-500/40 bg-violet-900/15" :
                    "border-zinc-700 bg-zinc-900/30"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-bold text-zinc-500">{phase.phase}</span>
                        <Badge className={`text-xs ${
                          phase.status === "complete" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
                          phase.status === "active" ? "bg-violet-500/20 text-violet-300 border-violet-500/30" :
                          "bg-zinc-700 text-zinc-400"
                        }`}>
                          {phase.status === "complete" ? "✓ COMPLETE" : phase.status === "active" ? "IN PROGRESS" : "UPCOMING"}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold">{phase.title}</h3>
                      <div className="text-sm text-zinc-500">{phase.q}</div>
                    </div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-black ${
                      phase.status === "complete" ? "bg-emerald-500/20 text-emerald-400" :
                      phase.status === "active" ? "bg-violet-500/20 text-violet-400" :
                      "bg-zinc-700 text-zinc-500"
                    }`}>
                      {i + 1}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-2">
                    {phase.items.map((item) => (
                      <div key={item} className="flex items-center gap-2 text-sm">
                        <CheckCircle className={`w-3.5 h-3.5 flex-shrink-0 ${
                          phase.status === "complete" ? "text-emerald-400" :
                          phase.status === "active" ? "text-violet-400" :
                          "text-zinc-600"
                        }`} />
                        <span className={phase.status === "upcoming" ? "text-zinc-500" : "text-zinc-300"}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* PORTFOLIO TAB */}
          <TabsContent value="portfolio">
            {!user ? (
              <div className="text-center py-16">
                <Lock className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Sign In to View Your Portfolio</h3>
                <p className="text-zinc-500 mb-6">Track your SKY444 purchases, vesting schedule, and claimable tokens.</p>
                <Button onClick={() => window.location.href = getLoginUrl()} className="bg-violet-600 hover:bg-violet-500">
                  Sign In
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Referral Code */}
                {myReferral && (
                  <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 border border-violet-500/30 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Gift className="w-4 h-4 text-violet-400" />
                      <span className="font-semibold text-violet-300">Your Referral Code</span>
                      <Badge className="ml-auto bg-green-500/20 text-green-400 border-green-500/30 text-xs">5% commission</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <code className="flex-1 bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2 text-lg font-mono text-white tracking-widest">
                        {(myReferral as any).code}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText((myReferral as any).code);
                          toast.success("Referral code copied!");
                        }}
                        className="border-zinc-600"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-zinc-500 mt-2">
                      Share this code. When someone uses it to buy SKY444, you earn 5% of their purchase in bonus tokens.
                    </p>
                  </div>
                )}

                {/* Purchases */}
                <div>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-blue-400" />
                    My Purchases & Vesting
                  </h3>
                  {!myPurchases || (myPurchases as any[]).length === 0 ? (
                    <div className="text-center py-12 bg-zinc-900/40 border border-zinc-800 rounded-xl">
                      <Coins className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                      <p className="text-zinc-400 mb-4">No purchases yet. Join the Pre-Sale to get started.</p>
                      <Button
                        onClick={() => document.querySelector('[data-state="active"]')?.scrollIntoView()}
                        className="bg-violet-600 hover:bg-violet-500"
                      >
                        Buy SKY444 Now
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {(myPurchases as any[]).map((purchase: any) => {
                        const totalTokens = parseFloat(purchase.token_amount ?? 0) + parseFloat(purchase.bonus_tokens ?? 0);
                        const released = parseFloat(purchase.tokens_released ?? 0);
                        const vestingPct = totalTokens > 0 ? (released / totalTokens) * 100 : 0;
                        return (
                          <div key={purchase.id} className="bg-zinc-900/60 border border-zinc-700 rounded-xl p-5">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/30 text-xs mb-1">
                                  {purchase.tier_id?.toUpperCase() ?? "ICO"}
                                </Badge>
                                <div className="text-lg font-bold">{totalTokens.toLocaleString()} SKY444</div>
                                <div className="text-sm text-zinc-500">${parseFloat(purchase.usd_amount ?? 0).toLocaleString()} USD</div>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => claimVested.mutate({ purchaseId: purchase.id })}
                                disabled={claimVested.isPending}
                                className="bg-emerald-600 hover:bg-emerald-500"
                              >
                                <Download className="w-3.5 h-3.5 mr-1.5" />
                                Claim
                              </Button>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs text-zinc-500">
                                <span>Vesting progress</span>
                                <span>{vestingPct.toFixed(1)}% released</span>
                              </div>
                              <Progress value={vestingPct} className="h-2" />
                              <div className="flex justify-between text-xs">
                                <span className="text-zinc-500">Released: {released.toLocaleString()} SKY444</span>
                                <span className="text-zinc-500">Locked: {(totalTokens - released).toLocaleString()} SKY444</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          {/* LEADERBOARD TAB */}
          <TabsContent value="leaderboard">
            <div>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-400" />
                Top ICO Investors
              </h2>
              {!leaderboard || (leaderboard as any[]).length === 0 ? (
                <div className="text-center py-16 bg-zinc-900/40 border border-zinc-800 rounded-xl">
                  <Crown className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                  <p className="text-zinc-400">Be the first investor on the leaderboard!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {(leaderboard as any[]).map((entry: any, i: number) => (
                    <div key={entry.user_id} className={`flex items-center gap-4 p-4 rounded-xl border ${
                      i === 0 ? "border-yellow-500/30 bg-yellow-900/10" :
                      i === 1 ? "border-zinc-400/30 bg-zinc-800/30" :
                      i === 2 ? "border-orange-500/30 bg-orange-900/10" :
                      "border-zinc-800 bg-zinc-900/30"
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        i === 0 ? "bg-yellow-500 text-black" :
                        i === 1 ? "bg-zinc-400 text-black" :
                        i === 2 ? "bg-orange-500 text-black" :
                        "bg-zinc-700 text-zinc-300"
                      }`}>
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{entry.username ?? `Investor ${i + 1}`}</div>
                        <div className="text-xs text-zinc-500">{parseInt(entry.purchase_count ?? 0)} purchases</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-violet-300">{parseFloat(entry.total_tokens ?? 0).toLocaleString()} SKY444</div>
                        <div className="text-xs text-zinc-500">${parseFloat(entry.total_usd ?? 0).toLocaleString()} invested</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* LEGAL DOCS TAB */}
          <TabsContent value="legal">
            <div>
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4 mb-6 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-200">
                  <strong>Important:</strong> Please read all legal documents before participating in the ICO. Purchasing SKY444 tokens involves significant risk, including the risk of total loss. These documents constitute binding legal agreements.
                </div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {LEGAL_DOCS.map(({ name, icon: Icon, path, desc }) => (
                  <a
                    key={name}
                    href={path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-4 bg-zinc-900/60 border border-zinc-700 hover:border-violet-500/40 rounded-xl p-5 transition-all"
                  >
                    <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-violet-500/20 transition-colors">
                      <Icon className="w-5 h-5 text-violet-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm mb-1 group-hover:text-violet-300 transition-colors">{name}</div>
                      <div className="text-xs text-zinc-500">{desc}</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-violet-400 transition-colors flex-shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* FAQ TAB */}
          <TabsContent value="faq">
            <div className="max-w-3xl mx-auto space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-zinc-900/60 border border-zinc-700 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-zinc-800/40 transition-colors"
                  >
                    <span className="font-semibold text-sm pr-4">{faq.q}</span>
                    {expandedFaq === i ? (
                      <ChevronUp className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                    )}
                  </button>
                  {expandedFaq === i && (
                    <div className="px-5 pb-5 text-sm text-zinc-400 leading-relaxed border-t border-zinc-800 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom CTA */}
      <div className="border-t border-zinc-800 bg-gradient-to-br from-zinc-950 to-violet-950/20">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h2 className="text-3xl font-black mb-3">Ready to Invest?</h2>
          <p className="text-zinc-400 mb-6">Pre-Sale closes when $2.5M hard cap is reached. Don't miss the 15% bonus.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 font-bold px-8"
            >
              <Rocket className="w-4 h-4 mr-2" />
              Buy SKY444 Now
            </Button>
            <Button variant="outline" asChild className="border-zinc-600">
              <a href="/whitepaper.md" target="_blank">
                <BookOpen className="w-4 h-4 mr-2" />
                Read White Paper
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
