import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Newspaper, Plus, Users, Bell, BellOff, Hash, TrendingUp, Star, ArrowRight, Search, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const CATEGORIES = ["All", "Crypto", "AI", "Dev", "DeFi", "Creator", "Gaming", "NFT", "Trading", "Charity", "Community"];

// Fallback seed channels shown when DB is empty
const SEED_CHANNELS = [
  { id: 0, name: "SKY444 News",    description: "Official SKY444 token updates, listings, and announcements", memberCount: 24800, category: "Crypto",   slug: "sky444-news",    isVerified: true  },
  { id: 0, name: "AI World",       description: "Latest AI breakthroughs, models, and agent news",            memberCount: 18200, category: "AI",       slug: "ai-world",       isVerified: true  },
  { id: 0, name: "Web3 Builders",  description: "Developer discussions, tutorials, and open-source projects", memberCount: 12400, category: "Dev",      slug: "web3-builders",  isVerified: false },
  { id: 0, name: "DeFi Alpha",     description: "High-signal DeFi opportunities, yield strategies, and pools",memberCount: 9700,  category: "DeFi",     slug: "defi-alpha",     isVerified: false },
  { id: 0, name: "Creator Hub",    description: "Tips, tools, and strategies for content creators",           memberCount: 8100,  category: "Creator",  slug: "creator-hub",    isVerified: false },
  { id: 0, name: "Gaming Arena",   description: "GameFi, tournaments, and play-to-earn opportunities",        memberCount: 7300,  category: "Gaming",   slug: "gaming-arena",   isVerified: false },
  { id: 0, name: "NFT Drops",      description: "Upcoming NFT mints, whitelists, and secondary market picks", memberCount: 6800,  category: "NFT",      slug: "nft-drops",      isVerified: false },
  { id: 0, name: "Trading Desk",   description: "Technical analysis, signals, and market commentary",         memberCount: 5900,  category: "Trading",  slug: "trading-desk",   isVerified: false },
  { id: 0, name: "Charity Chain",  description: "Blockchain-verified charity campaigns and impact reports",   memberCount: 4200,  category: "Charity",  slug: "charity-chain",  isVerified: false },
  { id: 0, name: "ShadowChat OG",  description: "Original community — platform updates and feedback",         memberCount: 3800,  category: "Community",slug: "shadowchat-og",  isVerified: true  },
];

function categoryIcon(cat: string) {
  const map: Record<string, string> = { Crypto: "💎", AI: "🤖", Dev: "🔨", DeFi: "📈", Creator: "🎨", Gaming: "🎮", NFT: "🖼️", Trading: "📊", Charity: "💚", Community: "👥" };
  return map[cat] || "📢";
}

export default function Channels() {
  const { user, isAuthenticated } = useAuth();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [joiningId, setJoiningId] = useState<number | null>(null);

  const utils = trpc.useUtils();

  // Load real communities from DB
  const { data: communities, isLoading } = trpc.community.list.useQuery({ limit: 50, offset: 0 });

  const joinMutation = trpc.community.join.useMutation({
    onMutate: ({ communityId }) => setJoiningId(communityId),
    onSuccess: (data, { communityId }) => {
      setJoiningId(null);
      toast.success(data.joined ? "Joined channel!" : "Left channel");
      utils.community.list.invalidate();
    },
    onError: () => { setJoiningId(null); toast.error("Failed to update subscription"); },
  });

  const handleJoin = (communityId: number) => {
    if (!isAuthenticated) { window.location.href = getLoginUrl(); return; }
    joinMutation.mutate({ communityId });
  };

  // Use real DB data or fallback to seeds
  const allChannels = (communities && communities.length > 0)
    ? communities.map((c: any) => ({
        id: c.id,
        name: c.name,
        description: c.description || "",
        memberCount: c.memberCount || 0,
        category: c.category || "Community",
        slug: c.slug,
        isVerified: c.isVerified || false,
      }))
    : SEED_CHANNELS;

  const filtered = allChannels.filter((c: any) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || c.category === category;
    return matchSearch && matchCat;
  });

  const hotChannels = allChannels.filter((c: any) => c.memberCount > 5000);

  return (
    <div className="container py-8 max-w-4xl animate-page-in">
      <PageHeader
        backHref="/social"
        icon={Newspaper}
        title="Channels"
        subtitle="Follow topic channels and never miss important updates"
        actions={
          <Link href="/communities/create">
            <Button className="btn-primary gap-2">
              <Plus className="w-4 h-4" /> Create Channel
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Newspaper} label="Total Channels" value={allChannels.length.toString()} color="primary" />
        <StatCard icon={Users} label="Members" value={allChannels.reduce((s: number, c: any) => s + (c.memberCount || 0), 0).toLocaleString()} color="success" />
        <StatCard icon={TrendingUp} label="Hot Channels" value={hotChannels.length.toString()} color="warning" />
        <StatCard icon={Star} label="Verified" value={allChannels.filter((c: any) => c.isVerified).length.toString()} color="accent" />
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search channels…"
            className="pl-9"
          />
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-1.5 flex-wrap mb-6">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-[0.97] ${
              category === cat
                ? "bg-primary text-primary-foreground"
                : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground border border-slate-700/40"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Channel list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Hash className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No channels found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((ch: any, idx: number) => {
            const isHot = ch.memberCount > 5000;
            const isJoining = joiningId === ch.id;
            return (
              <div key={ch.id || idx} className="card p-4 flex items-center gap-4 hover:border-slate-700/60 transition-all">
                <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center text-2xl shrink-0">
                  {categoryIcon(ch.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <Link href={`/community/${ch.slug || ch.id}`} className="font-semibold text-sm hover:text-primary transition-colors">
                      {ch.name}
                    </Link>
                    {ch.isVerified && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/20 font-medium">✓ Verified</span>
                    )}
                    {isHot && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/20 font-medium">🔥 Hot</span>
                    )}
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary/60 text-muted-foreground border border-slate-700/30">
                      {ch.category}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">{ch.description}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <Users className="w-3 h-3" /> {(ch.memberCount || 0).toLocaleString()} members
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/community/${ch.slug || ch.id}`}>
                    <Button size="sm" variant="ghost" className="text-xs gap-1 text-primary">
                      View <ArrowRight className="w-3 h-3" />
                    </Button>
                  </Link>
                  {ch.id > 0 && (
                    <button
                      onClick={() => handleJoin(ch.id)}
                      disabled={isJoining}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95 bg-secondary/50 text-muted-foreground border border-slate-700/40 hover:bg-primary/20 hover:text-primary hover:border-primary/30 disabled:opacity-50"
                    >
                      {isJoining ? <Loader2 className="w-3 h-3 animate-spin" /> : <Bell className="w-3 h-3" />}
                      Join
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
