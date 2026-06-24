/**
 * Creator Spotlight — ShadowChat / SKYCOIN4444
 * Discover and follow top creators with live stats, subscriber counts, and content previews.
 */
import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  Star, Users, TrendingUp, Play, Heart, Eye, Zap, Crown,
  Search, Sparkles, Flame, Award, ChevronRight, Plus,
  Video, Image, FileText, Coins, Shield, CheckCircle2
} from "lucide-react";

// ─── Mock creator data (would come from DB in production) ────────────────────
const FEATURED_CREATORS = [
  {
    id: "c1", name: "SkylerDev", handle: "@skylerdev", avatar: "S", tier: "Legendary",
    bio: "Building the future of Web3 social. AI researcher, crypto trader, content creator.",
    subscribers: 142800, followers: 89400, posts: 1247, views: 4200000,
    earnings: 28400, categories: ["Tech", "Crypto", "AI"],
    isVerified: true, isLive: true, liveViewers: 847,
    gradient: "from-purple-600 to-pink-600",
    recentContent: ["New AI trading strategy drops tonight 🔥", "Web3 tutorial series — Part 12", "SKYCOIN4444 deep dive"],
  },
  {
    id: "c2", name: "CryptoQueen", handle: "@cryptoqueen", avatar: "C", tier: "Elite",
    bio: "DeFi analyst & NFT curator. Making crypto accessible for everyone.",
    subscribers: 98200, followers: 67300, posts: 892, views: 2800000,
    earnings: 19200, categories: ["DeFi", "NFTs", "Trading"],
    isVerified: true, isLive: false, liveViewers: 0,
    gradient: "from-blue-600 to-cyan-600",
    recentContent: ["Top 5 DeFi protocols this week", "NFT market analysis Q2 2026", "How I made 10x on SKYCOIN"],
  },
  {
    id: "c3", name: "NeonStreamer", handle: "@neonstreamer", avatar: "N", tier: "Pro",
    bio: "Live streaming, gaming, and crypto commentary. 24/7 content machine.",
    subscribers: 74600, followers: 52100, posts: 2341, views: 8900000,
    earnings: 14800, categories: ["Gaming", "Streaming", "Entertainment"],
    isVerified: true, isLive: true, liveViewers: 2341,
    gradient: "from-green-600 to-teal-600",
    recentContent: ["Shadow Arena world record attempt", "Crypto gaming marathon — 12hrs", "New merch drop this Friday"],
  },
  {
    id: "c4", name: "AIArtist", handle: "@aiartist", avatar: "A", tier: "Rising",
    bio: "Generative AI art, digital collectibles, and creative tech exploration.",
    subscribers: 41200, followers: 38900, posts: 567, views: 1200000,
    earnings: 8600, categories: ["Art", "AI", "NFTs"],
    isVerified: false, isLive: false, liveViewers: 0,
    gradient: "from-orange-600 to-red-600",
    recentContent: ["New generative art collection", "AI art tutorial — Stable Diffusion", "Collab with @skylerdev"],
  },
  {
    id: "c5", name: "TechPhilosopher", handle: "@techphil", avatar: "T", tier: "Pro",
    bio: "Long-form essays on technology, society, and the future of human connection.",
    subscribers: 62400, followers: 44700, posts: 234, views: 3400000,
    earnings: 11200, categories: ["Tech", "Philosophy", "Writing"],
    isVerified: true, isLive: false, liveViewers: 0,
    gradient: "from-indigo-600 to-purple-600",
    recentContent: ["The attention economy is broken", "Why Web3 changes everything", "AI consciousness — a deep dive"],
  },
  {
    id: "c6", name: "FitnessCrypto", handle: "@fitcrypto", avatar: "F", tier: "Rising",
    bio: "Fitness meets crypto. Earn tokens while you work out. Move-to-earn pioneer.",
    subscribers: 28900, followers: 31200, posts: 445, views: 890000,
    earnings: 5400, categories: ["Fitness", "Crypto", "Lifestyle"],
    isVerified: false, isLive: false, liveViewers: 0,
    gradient: "from-yellow-600 to-orange-600",
    recentContent: ["30-day move-to-earn challenge", "Best crypto fitness apps 2026", "Morning routine + portfolio review"],
  },
];

const TIER_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  Legendary: { label: "Legendary", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30", icon: Crown },
  Elite:     { label: "Elite",     color: "text-purple-400 bg-purple-500/10 border-purple-500/30", icon: Star },
  Pro:       { label: "Pro",       color: "text-blue-400 bg-blue-500/10 border-blue-500/30",       icon: Award },
  Rising:    { label: "Rising",    color: "text-green-400 bg-green-500/10 border-green-500/30",    icon: TrendingUp },
};

function CreatorCard({ creator }: { creator: typeof FEATURED_CREATORS[0] }) {
  const { user, isAuthenticated } = useAuth();
  const [followed, setFollowed] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const tier = TIER_CONFIG[creator.tier] || TIER_CONFIG.Rising;
  const TierIcon = tier.icon;

  const handleFollow = () => {
    if (!isAuthenticated) { toast.error("Sign in to follow creators"); return; }
    setFollowed(f => !f);
    toast.success(followed ? `Unfollowed ${creator.name}` : `Following ${creator.name}!`);
  };

  const handleSubscribe = () => {
    if (!isAuthenticated) { toast.error("Sign in to subscribe"); return; }
    setSubscribed(s => !s);
    toast.success(subscribed ? "Unsubscribed" : `Subscribed to ${creator.name}! 🎉`);
  };

  return (
    <div className="group bg-card border border-border/50 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-200">
      {/* Cover gradient */}
      <div className={`h-24 bg-gradient-to-br ${creator.gradient} relative`}>
        {creator.isLive && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-red-500 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-[10px] font-bold text-white">LIVE</span>
            <span className="text-[10px] text-white/80">{creator.liveViewers.toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* Avatar + tier */}
      <div className="px-4 pb-4">
        <div className="flex items-end justify-between -mt-8 mb-3">
          <Avatar className="w-16 h-16 border-4 border-card text-xl font-bold">
            <AvatarFallback className={`bg-gradient-to-br ${creator.gradient} text-white text-xl font-bold`}>
              {creator.avatar}
            </AvatarFallback>
          </Avatar>
          <Badge variant="outline" className={`text-[10px] ${tier.color}`}>
            <TierIcon className="w-2.5 h-2.5 mr-1" />{tier.label}
          </Badge>
        </div>

        <div className="mb-3">
          <div className="flex items-center gap-1.5">
            <h3 className="font-bold text-base">{creator.name}</h3>
            {creator.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
          </div>
          <p className="text-xs text-muted-foreground">{creator.handle}</p>
          <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{creator.bio}</p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-1 mb-3">
          {creator.categories.map(c => (
            <Badge key={c} variant="secondary" className="text-[10px] px-2">{c}</Badge>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-3 bg-secondary/50 rounded-xl p-2.5">
          <div className="text-center">
            <p className="text-sm font-bold">{creator.subscribers >= 1000 ? `${(creator.subscribers/1000).toFixed(0)}K` : creator.subscribers}</p>
            <p className="text-[10px] text-muted-foreground">Subs</p>
          </div>
          <div className="text-center border-x border-border/50">
            <p className="text-sm font-bold">{creator.followers >= 1000 ? `${(creator.followers/1000).toFixed(0)}K` : creator.followers}</p>
            <p className="text-[10px] text-muted-foreground">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold">{creator.views >= 1000000 ? `${(creator.views/1000000).toFixed(1)}M` : `${(creator.views/1000).toFixed(0)}K`}</p>
            <p className="text-[10px] text-muted-foreground">Views</p>
          </div>
        </div>

        {/* Recent content */}
        <div className="mb-3 space-y-1">
          {creator.recentContent.slice(0,2).map((c, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-1 h-1 rounded-full bg-primary/50 shrink-0" />
              <span className="truncate">{c}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={followed ? "secondary" : "outline"}
            className="flex-1 text-xs"
            onClick={handleFollow}
          >
            {followed ? "Following ✓" : <><Plus className="w-3 h-3 mr-1" />Follow</>}
          </Button>
          <Button
            size="sm"
            className={`flex-1 text-xs ${subscribed ? "bg-secondary text-foreground" : "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0"}`}
            onClick={handleSubscribe}
          >
            {subscribed ? "Subscribed ✓" : <><Star className="w-3 h-3 mr-1" />Subscribe</>}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CreatorSpotlight() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = FEATURED_CREATORS.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.handle.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || (filter === "live" && c.isLive) || (filter === "verified" && c.isVerified) || c.tier.toLowerCase() === filter;
    return matchSearch && matchFilter;
  });

  const liveCreators = FEATURED_CREATORS.filter(c => c.isLive);

  return (
    <div className="container max-w-7xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Crown className="w-6 h-6 text-yellow-400" />
            Creator Spotlight
          </h1>
          <p className="text-sm text-muted-foreground">Discover top creators, subscribe for exclusive content, and support your favorites</p>
        </div>
        <Link href="/creator-onboarding">
          <Button className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
            <Zap className="w-4 h-4" />
            Become a Creator
          </Button>
        </Link>
      </div>

      {/* Live now banner */}
      {liveCreators.length > 0 && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-bold text-sm text-red-400">Live Now</span>
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-[10px]">{liveCreators.length} creators</Badge>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {liveCreators.map(c => (
              <div key={c.id} className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-card border border-border/50 rounded-xl hover:border-red-500/30 transition-all cursor-pointer">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className={`bg-gradient-to-br ${c.gradient} text-white text-sm font-bold`}>{c.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs font-semibold">{c.name}</p>
                  <div className="flex items-center gap-1 text-[10px] text-red-400">
                    <Eye className="w-2.5 h-2.5" />{c.liveViewers.toLocaleString()} watching
                  </div>
                </div>
                <Play className="w-3.5 h-3.5 text-red-400 ml-1" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Platform stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Creators", value: "12,400+", icon: Users, color: "text-purple-400" },
          { label: "Total Subscribers", value: "2.1M+", icon: Star, color: "text-yellow-400" },
          { label: "Creator Earnings", value: "$840K+", icon: Coins, color: "text-green-400" },
          { label: "Content Pieces", value: "890K+", icon: Sparkles, color: "text-blue-400" },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border/50 rounded-xl p-3 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl bg-secondary flex items-center justify-center ${s.color}`}>
              <s.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-sm">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search creators..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {[
            { id: "all", label: "All" },
            { id: "live", label: "🔴 Live" },
            { id: "legendary", label: "👑 Legendary" },
            { id: "elite", label: "⭐ Elite" },
            { id: "verified", label: "✓ Verified" },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${filter === f.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Creator grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(creator => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No creators match your search.</p>
          <Button variant="outline" className="mt-4" onClick={() => { setSearch(""); setFilter("all"); }}>Clear filters</Button>
        </div>
      )}

      {/* Become a creator CTA */}
      <div className="mt-12 bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-2xl p-8 text-center">
        <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Ready to become a creator?</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Join 12,400+ creators earning on SKYCOIN4444. Subscriptions, tips, PPV content, and live streaming — all in one platform.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/creator-onboarding">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 gap-2 px-6">
              <Zap className="w-4 h-4" />Start Creating
            </Button>
          </Link>
          <Link href="/creator-monetization">
            <Button variant="outline" className="gap-2 px-6">
              <Coins className="w-4 h-4" />View Monetization
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
