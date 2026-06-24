import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageHeader } from "@/components/PageHeader";
import { trpc } from "@/lib/trpc";
import { Input } from "@/components/ui/input";
import {
  Compass, TrendingUp, Users, Video, Gamepad2, Coins, Heart,
  Code2, Globe, Zap, Star, Radio, Search, Hash, Flame, Eye
} from "lucide-react";
import { useState } from "react";

const CATEGORIES = [
  { icon: TrendingUp, label: "Trending",    desc: "What's hot right now",           href: "/social",      color: "text-primary",    bg: "bg-primary/10" },
  { icon: Radio,      label: "Live",        desc: "Creators streaming now",          href: "/streaming",   color: "text-red-400",    bg: "bg-red-500/10" },
  { icon: Video,      label: "Reels",       desc: "Short-form video",                href: "/reels",       color: "text-pink-400",   bg: "bg-pink-500/10" },
  { icon: Gamepad2,   label: "Gaming",      desc: "Tournaments and arcade games",    href: "/arcade",      color: "text-purple-400", bg: "bg-purple-500/10" },
  { icon: Coins,      label: "DeFi",        desc: "Staking, swaps, and yields",      href: "/staking",     color: "text-amber-400",  bg: "bg-amber-500/10" },
  { icon: Heart,      label: "Charity",     desc: "Campaigns making a difference",   href: "/charity",     color: "text-rose-400",   bg: "bg-rose-500/10" },
  { icon: Code2,      label: "Dev Tools",   desc: "AI coding and developer assets",  href: "/ai-engineer", color: "text-cyan-400",   bg: "bg-cyan-500/10" },
  { icon: Users,      label: "Communities", desc: "Groups and forums",               href: "/community",   color: "text-violet-400", bg: "bg-violet-500/10" },
  { icon: Globe,      label: "Governance",  desc: "Vote on platform decisions",      href: "/governance",  color: "text-blue-400",   bg: "bg-blue-500/10" },
  { icon: Star,       label: "Marketplace", desc: "Buy, sell, and trade assets",     href: "/marketplace", color: "text-orange-400", bg: "bg-orange-500/10" },
  { icon: Zap,        label: "ICO",         desc: "New token launches",              href: "/ico",         color: "text-yellow-400", bg: "bg-yellow-500/10" },
  { icon: Hash,       label: "Channels",    desc: "Creator channels & subscriptions",href: "/channels",    color: "text-green-400",  bg: "bg-green-500/10" },
];

export default function Explore() {
  const [search, setSearch] = useState("");
  const { data: trending } = trpc.feed.trending.useQuery();
  const { data: liveStreams } = trpc.stream.live.useQuery();
  const { data: suggestions } = trpc.user.suggestedFollows.useQuery(undefined, { retry: false });

  const filteredCategories = CATEGORIES.filter(c =>
    !search || c.label.toLowerCase().includes(search.toLowerCase()) || c.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-8 max-w-6xl animate-page-in space-y-8">
      <PageHeader backHref="/social" icon={Compass} title="Explore" subtitle="Discover everything the SKYCOIN4444 ecosystem has to offer" />

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search categories, creators, topics..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Category Grid */}
      <section>
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Compass className="w-5 h-5 text-primary" /> Browse Categories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredCategories.map(c => (
            <Link key={c.label} href={c.href}>
              <div className="card p-4 text-center hover:border-primary/40 hover:shadow-glow-sm transition-all duration-200 cursor-pointer group">
                <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                  <c.icon className={`w-5 h-5 ${c.color}`} />
                </div>
                <div className="font-semibold text-xs mb-1">{c.label}</div>
                <div className="text-xs text-muted-foreground leading-tight">{c.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Live Streams */}
      {liveStreams && (liveStreams as any[]).length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Radio className="w-5 h-5 text-red-400" />
              <span>Live Now</span>
              <Badge className="bg-red-500 text-white text-xs animate-pulse">LIVE</Badge>
            </h2>
            <Link href="/streaming">
              <Button variant="ghost" size="sm">See all →</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {(liveStreams as any[]).slice(0, 3).map((s: any) => (
              <Link key={s.id} href="/streaming">
                <div className="card overflow-hidden hover:border-red-500/40 transition-all cursor-pointer group">
                  <div className="aspect-video bg-gradient-to-br from-zinc-800 to-zinc-900 relative flex items-center justify-center">
                    <Radio className="w-8 h-8 text-red-400 opacity-60" />
                    <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs">LIVE</Badge>
                    {s.viewerCount > 0 && (
                      <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 rounded px-2 py-0.5 text-xs text-white">
                        <Eye className="w-3 h-3" /> {s.viewerCount}
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="font-semibold text-sm truncate">{s.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{s.category || "Live Stream"}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Trending Posts */}
      {trending && (trending as any[]).length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400" /> Trending Posts
            </h2>
            <Link href="/social">
              <Button variant="ghost" size="sm">See all →</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(trending as any[]).slice(0, 4).map((post: any) => (
              <div key={post.id} className="card p-4 hover:border-primary/30 transition-all">
                <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8 shrink-0">
                    <AvatarFallback className="text-xs">{(post.author?.name || post.authorName || "U")[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{post.author?.name || post.authorName || "Creator"}</div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{post.content}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span>❤️ {post.likeCount || 0}</span>
                      <span>💬 {post.commentCount || 0}</span>
                      {post.trendScore && <Badge variant="outline" className="text-xs text-orange-400 border-orange-400/30">🔥 {Math.round(post.trendScore)}</Badge>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Suggested Creators */}
      {suggestions && (suggestions as any[]).length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" /> Creators to Follow
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {(suggestions as any[]).slice(0, 5).map((u: any) => (
              <Link key={u.id} href={`/creator/${u.handle || u.id}`}>
                <div className="card p-4 text-center hover:border-primary/40 transition-all cursor-pointer group">
                  <Avatar className="w-12 h-12 mx-auto mb-2">
                    <AvatarFallback className="text-sm">{(u.name || u.username || "U")[0]}</AvatarFallback>
                  </Avatar>
                  <div className="font-semibold text-sm truncate">{u.name || u.username}</div>
                  {u.bio && <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{u.bio}</div>}
                  <Badge variant="outline" className="mt-2 text-xs">Follow</Badge>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
