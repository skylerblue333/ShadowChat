import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/StatCard";
import { EmptyState } from "@/components/EmptyState";
import {
  Video, Image, FileText, Music, Mic, Upload, Play, Eye, Heart,
  DollarSign, TrendingUp, Users, Star, Zap, Plus, Settings,
  BarChart3, Calendar, Gift, Crown, Sparkles, Camera, Edit3,
  Share2, Download, Clock, CheckCircle, AlertCircle
} from "lucide-react";

const CONTENT_TYPES = [
  { icon: Video,    label: "Video",          desc: "Upload and monetize video content",   color: "text-red-400",    bg: "bg-red-500/10",    border: "border-red-500/20",    href: "/streaming" },
  { icon: Image,    label: "Photo Post",     desc: "Share images with your audience",     color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/20",   href: "/social" },
  { icon: FileText, label: "Article",        desc: "Long-form written content",           color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", href: "/social" },
  { icon: Music,    label: "Audio",          desc: "Podcasts, music, voice notes",        color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20", href: "/streaming" },
  { icon: Mic,      label: "Live Stream",    desc: "Go live with your community",         color: "text-cyan-400",   bg: "bg-cyan-500/10",   border: "border-cyan-500/20",   href: "/streaming" },
  { icon: Gift,     label: "Exclusive Drop", desc: "NFT or premium content drop",         color: "text-amber-400",  bg: "bg-amber-500/10",  border: "border-amber-500/20",  href: "/marketplace" },
];

const MONETIZATION = [
  { icon: Crown,      label: "Subscriptions", value: "$0/mo",      desc: "Set up monthly memberships",         action: "Enable", href: "/subscriptions" },
  { icon: DollarSign, label: "Paid Content",  value: "0 items",    desc: "Lock premium posts behind paywall",  action: "Create", href: "/social" },
  { icon: Gift,       label: "Tips & Gifts",  value: "$0 received", desc: "Accept crypto tips from fans",      action: "Enable", href: "/crypto" },
  { icon: Star,       label: "Creator NFTs",  value: "0 minted",   desc: "Mint exclusive creator NFTs",        action: "Mint",   href: "/marketplace" },
];

export default function CreatorStudio() {
  const [activeTab, setActiveTab] = useState<"overview"|"content"|"monetize"|"analytics">("overview");

  return (
    <div className="animate-page-in">
      {/* ═══ CINEMATIC CREATOR STUDIO HERO ═══ */}
      <div className="hero-cinematic border-b border-slate-800/60" style={{ minHeight: 200 }}>
        <div className="glow-orb glow-orb-purple w-72 h-72 -top-10 right-10 animate-hero-float" />
        <div className="glow-orb w-48 h-48 top-5 left-20 animate-hero-float" style={{ background: 'oklch(0.65 0.28 30 / 0.15)', animationDelay: '1.5s' }} />
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-10 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, oklch(0.65 0.28 30), oklch(0.72 0.28 305))', boxShadow: '0 0 24px oklch(0.65 0.28 30 / 0.4)' }}>
              <Camera className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-black text-rainbow">Creator Studio</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 border border-amber-500/30 text-amber-400">CREATOR</span>
              </div>
              <p className="text-sm desc-metallic">Your command center for content creation, publishing, and monetization</p>
            </div>
          </div>
          <Link href="/social">
            <Button className="btn-primary gap-2 shrink-0">
              <Plus className="w-4 h-4" />
              New Post
            </Button>
          </Link>
        </div>
      </div>

      <div className="container py-8 max-w-6xl">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Eye}        label="Total Views"  value="0"   change={0} changeLabel="this month"    color="primary" />
          <StatCard icon={Users}      label="Followers"    value="0"   change={0} changeLabel="this week"     color="accent" />
          <StatCard icon={DollarSign} label="Revenue"      value="$0"  change={0} changeLabel="this month"    color="success" />
          <StatCard icon={Heart}      label="Engagement"   value="0%"  change={0} changeLabel="vs last month" color="warning" />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-secondary/50 rounded-xl mb-8 w-fit">
          {(["overview","content","monetize","analytics"] as const).map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize ${
                activeTab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Quick Create */}
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Quick Create
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {CONTENT_TYPES.map(ct => (
                  <Link key={ct.label} href={ct.href}>
                    <div className={`card-epic p-4 text-center cursor-pointer group hover:border-primary/40 transition-all duration-200`}>
                      <div className={`w-10 h-10 rounded-xl ${ct.bg} border ${ct.border} flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                        <ct.icon className={`w-5 h-5 ${ct.color}`} />
                      </div>
                      <div className="text-sm font-medium text-white">{ct.label}</div>
                      <div className="text-xs text-slate-500 mt-1 hidden md:block">{ct.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Getting Started */}
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                Getting Started Checklist
              </h2>
              <div className="card divide-y divide-border/50">
                {[
                  { done: true,  label: "Create your account",      desc: "You're in!",                              href: undefined },
                  { done: false, label: "Complete your profile",     desc: "Add bio, avatar, and links",              href: "/profile" },
                  { done: false, label: "Make your first post",      desc: "Share something with the world",          href: "/social" },
                  { done: false, label: "Enable subscriptions",      desc: "Start earning from your fans",            href: "/subscriptions" },
                  { done: false, label: "Connect your wallet",       desc: "Accept crypto payments",                  href: "/crypto" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${item.done ? "border-green-500 bg-green-500/20" : "border-border"}`}>
                      {item.done && <CheckCircle className="w-4 h-4 text-green-400" />}
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm font-medium ${item.done ? "line-through text-muted-foreground" : ""}`}>{item.label}</div>
                      <div className="text-xs text-muted-foreground">{item.desc}</div>
                    </div>
                    {!item.done && item.href && (
                      <Link href={item.href}>
                        <Button size="sm" variant="outline" className="text-xs">Start</Button>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "content" && (
          <EmptyState
            icon={<Video className="w-8 h-8 text-primary" />}
            title="No content yet"
            description="Start creating! Upload videos, write articles, share photos, or go live. Your content will appear here."
            action={{ label: "Create First Post", onClick: () => window.location.href = "/social" }}
          />
        )}

        {activeTab === "monetize" && (
          <div className="grid md:grid-cols-2 gap-4">
            {MONETIZATION.map(m => (
              <div key={m.label} className="card-epic p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <m.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-white">{m.label}</span>
                    <Badge variant="outline" className="text-xs">{m.value}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{m.desc}</p>
                  <Link href={m.href}>
                    <Button size="sm" className="btn-primary text-xs">{m.action}</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "analytics" && (
          <EmptyState
            icon={<BarChart3 className="w-8 h-8 text-primary" />}
            title="No analytics yet"
            description="Once you start posting content, your analytics will appear here — views, engagement, revenue, and audience insights."
            action={{ label: "Create Content", onClick: () => window.location.href = "/social" }}
          />
        )}
      </div>
    </div>
  );
}
