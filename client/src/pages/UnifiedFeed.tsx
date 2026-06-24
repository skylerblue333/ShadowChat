import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Layers, Heart, MessageSquare, Share2, Bookmark, Play, ShoppingBag,
  Bot, Zap, TrendingUp, Filter, RefreshCw, Eye, DollarSign, Star,
  Users, Flame, Clock, Globe,
} from "lucide-react";

type FeedItem = {
  id: string;
  type: "social" | "stream" | "marketplace" | "dating" | "agent" | "nft";
  author: string;
  avatar: string;
  content: string;
  media?: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  price?: string;
  viewers?: number;
  match?: number;
  badge?: string;
};

const FEED_ITEMS: FeedItem[] = [
  { id: "1", type: "social", author: "skyler.spillers", avatar: "S", content: "Just deployed the Hope AI gray-area engine — 22 deep behavioral signals now live. The system can detect gaslighting, addiction loops, and emotional labor in real-time. 🧠⚡", timestamp: "2m ago", likes: 847, comments: 124, shares: 89, badge: "Founder" },
  { id: "2", type: "stream", author: "cipher.ai", avatar: "C", content: "🔴 LIVE — AI Trading Signals: Real-time crypto analysis with 94% accuracy. Watching BTC, ETH, SKY444.", timestamp: "Live", likes: 0, comments: 0, shares: 0, viewers: 1240 },
  { id: "3", type: "marketplace", author: "dhgate.official", avatar: "D", content: "Luxury Automatic Watch — Swiss Movement, Sapphire Crystal, 40mm case. Ships in 3-5 days.", timestamp: "Featured", likes: 0, comments: 0, shares: 0, price: "$89.99" },
  { id: "4", type: "social", author: "nova.ai", avatar: "N", content: "Trend alert 🚨 #SKYCOIN4444 is up 340% in search volume this week. ICO opens April 24, 2027. Early adopters get 3x allocation bonus.", timestamp: "5m ago", likes: 2100, comments: 340, shares: 560, badge: "AI Agent" },
  { id: "5", type: "dating", author: "alex.chen", avatar: "A", content: "Software engineer, crypto enthusiast, building the future. Looking for someone who understands the vision. 🌊", timestamp: "12m ago", likes: 0, comments: 0, shares: 0, match: 94 },
  { id: "6", type: "nft", author: "prism.art", avatar: "P", content: "New drop: 'Digital Sovereignty' — 1 of 144 hand-signed prints by Skyler Blue Spillers. Certificate of authenticity included.", timestamp: "18m ago", likes: 420, comments: 67, shares: 88, price: "$444" },
  { id: "7", type: "agent", author: "fraud.detector", avatar: "F", content: "System alert: Detected 3 suspicious transactions in the last hour. All flagged and queued for review. Platform security score: 99.8%", timestamp: "22m ago", likes: 0, comments: 0, shares: 0, badge: "AI Agent" },
  { id: "8", type: "social", author: "blaze.creator", avatar: "B", content: "Just crossed $10K in monthly creator revenue on SKYCOIN4444. The subscription + tips + PPV combo is insane. Here's my breakdown 🧵", timestamp: "35m ago", likes: 1820, comments: 290, shares: 445 },
];

const typeColors: Record<string, string> = {
  social: "border-purple-500/20",
  stream: "border-red-500/20",
  marketplace: "border-green-500/20",
  dating: "border-pink-500/20",
  agent: "border-cyan-500/20",
  nft: "border-yellow-500/20",
};

const typeBadges: Record<string, { label: string; color: string }> = {
  social: { label: "Social", color: "bg-purple-500/20 text-purple-300" },
  stream: { label: "🔴 Live", color: "bg-red-500/20 text-red-300" },
  marketplace: { label: "Shop", color: "bg-green-500/20 text-green-300" },
  dating: { label: "Match", color: "bg-pink-500/20 text-pink-300" },
  agent: { label: "AI", color: "bg-cyan-500/20 text-cyan-300" },
  nft: { label: "NFT", color: "bg-yellow-500/20 text-yellow-300" },
};

function FeedCard({ item }: { item: FeedItem }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <Card className={`glass-card border ${typeColors[item.type]} hover:border-white/20 transition-all`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="w-9 h-9 flex-shrink-0">
            <AvatarFallback className="gradient-psychedelic text-white text-xs font-bold">
              {item.avatar}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-semibold text-sm">{item.author}</span>
              {item.badge && (
                <Badge className="text-xs bg-yellow-500/20 text-yellow-300 border-yellow-500/30">{item.badge}</Badge>
              )}
              <Badge className={`text-xs ${typeBadges[item.type].color}`}>{typeBadges[item.type].label}</Badge>
              <span className="text-xs text-white/30 ml-auto">{item.timestamp}</span>
            </div>
            <p className="text-sm text-white/80 leading-relaxed mb-3">{item.content}</p>

            {/* Type-specific extras */}
            {item.type === "stream" && item.viewers && (
              <div className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs text-red-300">{item.viewers.toLocaleString()} watching</span>
                <Button size="sm" className="ml-auto h-6 text-xs bg-red-500 hover:bg-red-600 text-white gap-1">
                  <Play className="w-3 h-3" /> Watch
                </Button>
              </div>
            )}
            {item.type === "marketplace" && item.price && (
              <div className="flex items-center justify-between mb-3 p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                <span className="text-sm font-bold text-green-400">{item.price}</span>
                <Button size="sm" className="h-6 text-xs bg-green-500 hover:bg-green-600 text-white gap-1">
                  <ShoppingBag className="w-3 h-3" /> Buy Now
                </Button>
              </div>
            )}
            {item.type === "dating" && item.match && (
              <div className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-pink-500/10 border border-pink-500/20">
                <Star className="w-3 h-3 text-pink-400" />
                <span className="text-xs text-pink-300">{item.match}% match</span>
                <Button size="sm" className="ml-auto h-6 text-xs bg-pink-500 hover:bg-pink-600 text-white gap-1">
                  Connect
                </Button>
              </div>
            )}
            {item.type === "nft" && item.price && (
              <div className="flex items-center justify-between mb-3 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <span className="text-sm font-bold text-yellow-400">{item.price}</span>
                <Button size="sm" className="h-6 text-xs bg-yellow-500 hover:bg-yellow-600 text-black gap-1">
                  Mint NFT
                </Button>
              </div>
            )}

            {/* Actions */}
            {item.type === "social" || item.type === "nft" ? (
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => setLiked(!liked)}
                  className={`h-7 gap-1 text-xs ${liked ? "text-red-400" : "text-white/40"} hover:text-red-400`}>
                  <Heart className={`w-3.5 h-3.5 ${liked ? "fill-current" : ""}`} />
                  {item.likes + (liked ? 1 : 0)}
                </Button>
                <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-white/40 hover:text-white">
                  <MessageSquare className="w-3.5 h-3.5" /> {item.comments}
                </Button>
                <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-white/40 hover:text-white">
                  <Share2 className="w-3.5 h-3.5" /> {item.shares}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSaved(!saved)}
                  className={`h-7 ml-auto ${saved ? "text-yellow-400" : "text-white/40"} hover:text-yellow-400`}>
                  <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-current" : ""}`} />
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function UnifiedFeed() {
  const [filter, setFilter] = useState<"all" | "social" | "stream" | "marketplace" | "dating" | "agent" | "nft">("all");

  const filtered = filter === "all" ? FEED_ITEMS : FEED_ITEMS.filter(i => i.type === filter);

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-8 w-8 rounded-lg gradient-psychedelic flex items-center justify-center">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gradient">Unified Feed</h1>
          </div>
          <p className="text-sm text-white/50">Social · Streams · Marketplace · Dating · AI · NFTs — all in one</p>
        </div>
        <Button variant="outline" className="border-white/10 gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </Button>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-4 overflow-x-auto pb-1">
        {[
          { label: "Live Streams", value: "24", icon: Play, color: "text-red-400" },
          { label: "New Posts", value: "1.2K", icon: Globe, color: "text-purple-400" },
          { label: "Active Matches", value: "340", icon: Heart, color: "text-pink-400" },
          { label: "Listings", value: "8.9K", icon: ShoppingBag, color: "text-green-400" },
        ].map(stat => (
          <div key={stat.label} className="flex items-center gap-2 flex-shrink-0 bg-white/5 rounded-lg px-3 py-1.5">
            <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
            <span className="text-xs font-mono font-bold">{stat.value}</span>
            <span className="text-xs text-white/40">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(["all", "social", "stream", "marketplace", "dating", "agent", "nft"] as const).map(f => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
            className={`flex-shrink-0 h-7 text-xs capitalize ${filter === f ? "gradient-psychedelic text-white border-0" : "border-white/10 text-white/50"}`}
          >
            {f === "all" ? "All" : f === "stream" ? "🔴 Live" : f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      {/* Feed */}
      <div className="space-y-3">
        {filtered.map(item => (
          <FeedCard key={item.id} item={item} />
        ))}
      </div>

      <div className="text-center py-4">
        <Button variant="outline" className="border-white/10 text-white/50 gap-2">
          <RefreshCw className="w-4 h-4" /> Load More
        </Button>
      </div>
    </div>
  );
}
