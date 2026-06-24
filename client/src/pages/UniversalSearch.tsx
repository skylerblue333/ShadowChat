import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Users, FileText, Coins, Gamepad2, ShoppingBag, Trophy, Heart, Vote, Zap, Star, TrendingUp, Hash, X, ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useDebounce } from "@/hooks/useDebounce";

const CATEGORIES = [
  { id: "all", label: "All", icon: Search },
  { id: "users", label: "Creators", icon: Users },
  { id: "posts", label: "Posts", icon: FileText },
  { id: "tokens", label: "Tokens", icon: Coins },
  { id: "communities", label: "Communities", icon: Hash },
  { id: "games", label: "Games", icon: Gamepad2 },
  { id: "marketplace", label: "Marketplace", icon: ShoppingBag },
  { id: "tournaments", label: "Tournaments", icon: Trophy },
  { id: "charity", label: "Charity", icon: Heart },
];

const TRENDING = ["SKYCOIN4444", "DeFi staking", "Assembly Puzzle", "Charity DAO", "Creator economy", "Web3 social", "AI coding bots", "GameFi rewards"];

const MOCK_RESULTS = [
  { type: "user", title: "Skyler Blue", sub: "@skylerblue · Software Engineer", href: "/profile", icon: Users, color: "text-blue-400", badge: "VERIFIED" },
  { type: "post", title: "Building a $15M SaaS from scratch", sub: "2.4K likes · 342 comments · 1h ago", href: "/social", icon: FileText, color: "text-slate-400", badge: null },
  { type: "token", title: "SKY444 Token", sub: "$0.0044 · +12.4% · $1.03B treasury", href: "/staking", icon: Coins, color: "text-emerald-400", badge: "LIVE" },
  { type: "community", title: "DeFi Builders", sub: "12.4K members · 89 online", href: "/communities", icon: Hash, color: "text-purple-400", badge: null },
  { type: "game", title: "Assembly Puzzle", sub: "TIS-100 style · 1,247 players · SKY444 rewards", href: "/arcade", icon: Gamepad2, color: "text-amber-400", badge: "HOT" },
  { type: "marketplace", title: "Next.js SaaS Starter", sub: "$149 · 8,420 downloads · ★4.9", href: "/developer-marketplace", icon: ShoppingBag, color: "text-teal-400", badge: "BESTSELLER" },
  { type: "tournament", title: "SKY444 Championship S3", sub: "$50,000 prize pool · 128 players · Live", href: "/tournaments", icon: Trophy, color: "text-rose-400", badge: "LIVE" },
  { type: "charity", title: "Clean Water Initiative", sub: "$847K raised · 94% funded · 12 days left", href: "/charity", icon: Heart, color: "text-pink-400", badge: null },
];

export default function UniversalSearch() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("all");
  const debouncedQuery = useDebounce(query, 300);
  const [recentSearches, setRecentSearches] = useState<string[]>(["SKYCOIN4444", "staking rewards", "Assembly Puzzle"]);

  const { data: searchData, isLoading } = trpc.search.global.useQuery(
    { query: debouncedQuery, limit: 20 },
    { enabled: debouncedQuery.length >= 2, retry: false }
  );

  // Flatten search results from all categories
  const backendResults = searchData ? [
    ...(searchData.users ?? []).map((u: any) => ({ type: "users", title: u.name ?? u.username, sub: `@${u.username ?? u.openId} · ${u.role}`, href: "/profile", badge: u.verified ? "VERIFIED" : null })),
    ...(searchData.posts ?? []).map((p: any) => ({ type: "posts", title: p.title ?? p.content?.slice(0,60), sub: `${p.likes ?? 0} likes · ${p.commentsCount ?? 0} comments`, href: "/social", badge: null })),
    ...(searchData.communities ?? []).map((c: any) => ({ type: "communities", title: c.name, sub: c.description?.slice(0,60), href: "/communities", badge: null })),
  ] : [];

  const displayResults = backendResults.length > 0 ? backendResults : (debouncedQuery.length >= 2 ? MOCK_RESULTS : []);
  const filteredResults = cat === "all" ? displayResults : displayResults.filter((r: any) => r.type === cat || r.type === cat.replace(/s$/, ""));

  const addRecent = useCallback((q: string) => {
    if (!q.trim()) return;
    setRecentSearches(p => [q, ...p.filter(x => x !== q)].slice(0, 8));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100">
      <div className="border-b border-slate-800/60 bg-[#0d0d14]/90 backdrop-blur sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
            <input
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addRecent(query)}
              placeholder="Search creators, posts, tokens, games, communities..."
              className="w-full bg-slate-900/80 border border-slate-700 rounded-2xl pl-12 pr-12 py-4 text-base text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            {query && <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"><X className="h-4 w-4" /></button>}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Category tabs */}
        <div className="flex gap-1 flex-wrap">
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => setCat(c.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${cat===c.id?"bg-emerald-600 text-white":"bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800"}`}>
              <c.icon className="h-3 w-3" />{c.label}
            </button>
          ))}
        </div>

        {/* Trending */}
        {!query && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <h2 className="text-sm font-semibold text-slate-300">Trending Now</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {TRENDING.map(t => (
                <button key={t} onClick={() => setQuery(t)} className="bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 text-slate-300 text-xs px-3 py-1.5 rounded-lg transition-all hover:text-emerald-400">
                  #{t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Recent searches */}
        {!query && recentSearches.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-slate-400 mb-3">Recent Searches</h2>
            <div className="space-y-1">
              {recentSearches.map(s => (
                <button key={s} onClick={() => setQuery(s)} className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg hover:bg-slate-900/60 text-slate-400 hover:text-slate-200 text-sm transition-all">
                  <Search className="h-3.5 w-3.5 shrink-0" />{s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {(query.length >= 2 || filteredResults.length > 0) && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-300">
                {isLoading ? "Searching..." : `${filteredResults.length} results`}
                {query && <span className="text-slate-500 ml-2">for "{query}"</span>}
              </h2>
            </div>
            <div className="space-y-2">
              {filteredResults.map((r: any, i: number) => {
                const Icon = CATEGORIES.find(c => c.id === r.type)?.icon ?? Search;
                const colorMap: Record<string, string> = { user: "text-blue-400", post: "text-slate-400", token: "text-emerald-400", community: "text-purple-400", game: "text-amber-400", marketplace: "text-teal-400", tournament: "text-rose-400", charity: "text-pink-400" };
                const color = colorMap[r.type] ?? "text-slate-400";
                return (
                  <Link key={i} href={r.href ?? "/"}>
                    <div className="flex items-center gap-4 p-4 bg-slate-900/40 rounded-xl border border-slate-800/60 hover:border-slate-700 cursor-pointer transition-all group">
                      <div className={`h-9 w-9 rounded-lg bg-slate-800 flex items-center justify-center shrink-0`}>
                        <Icon className={`h-4 w-4 ${color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white text-sm truncate">{r.title ?? r.name ?? r.username}</span>
                          {r.badge && <Badge className={`text-xs border-0 px-1.5 py-0 ${r.badge==="LIVE"?"bg-rose-500/15 text-rose-400":r.badge==="VERIFIED"?"bg-blue-500/15 text-blue-400":r.badge==="HOT"?"bg-amber-500/15 text-amber-400":"bg-slate-800 text-slate-400"}`}>{r.badge}</Badge>}
                        </div>
                        <div className="text-xs text-slate-500 truncate">{r.sub ?? r.description ?? r.content}</div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-700 group-hover:text-slate-400 shrink-0 transition-colors" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
