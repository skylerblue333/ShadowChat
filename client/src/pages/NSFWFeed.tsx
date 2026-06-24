import { useState } from "react";
import { Shield, Eye, EyeOff, Lock, Star, Heart, MessageCircle, Bookmark, Crown, Flame, Filter, Grid, List, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";

const MOCK_CONTENT = [
  { id: 1, creator: "ShadowCreator", handle: "@shadow_x", tier: "Premium", type: "photo", title: "Exclusive Set #44", likes: 2840, comments: 156, price: 9.99, locked: true, tags: ["exclusive", "premium"] },
  { id: 2, creator: "CryptoMuse",   handle: "@cryptomuse", tier: "VIP",     type: "video", title: "Behind the Scenes", likes: 5120, comments: 302, price: 0,    locked: false, tags: ["free", "preview"] },
  { id: 3, creator: "NightOwl",     handle: "@nightowl",   tier: "Premium", type: "photo", title: "Late Night Session", likes: 3670, comments: 211, price: 14.99, locked: true, tags: ["exclusive"] },
  { id: 4, creator: "PixelDreamer", handle: "@pixeldream", tier: "Basic",   type: "photo", title: "Digital Art Series", likes: 1890, comments: 98,  price: 4.99,  locked: true, tags: ["art", "digital"] },
  { id: 5, creator: "ShadowCreator",handle: "@shadow_x",   tier: "Free",    type: "video", title: "Teaser Clip",       likes: 9200, comments: 445, price: 0,    locked: false, tags: ["free"] },
  { id: 6, creator: "MidnightMuse", handle: "@midnight",   tier: "VIP",     type: "photo", title: "VIP Collection",    likes: 4410, comments: 267, price: 24.99, locked: true, tags: ["vip", "exclusive"] },
];

const TIER_COLORS: Record<string, string> = {
  Free:    "bg-slate-700 text-slate-300",
  Basic:   "bg-blue-900/50 text-blue-300",
  Premium: "bg-purple-900/50 text-purple-300",
  VIP:     "bg-yellow-900/50 text-yellow-300",
};

function AgeGateBanner({ onConfirm }: { onConfirm: () => void }) {
  return (
    <div className="min-h-screen bg-[#050308] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-red-500/30 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="text-2xl font-black text-white mb-2">Age Verification Required</h1>
        <p className="text-slate-400 text-sm mb-6">
          This section contains adult content intended for users 18 years of age or older. By continuing, you confirm you are at least 18 years old.
        </p>
        <div className="space-y-3">
          <Button onClick={onConfirm} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3">
            <Shield className="w-4 h-4 mr-2" />
            I am 18 or older — Enter
          </Button>
          <Link href="/social">
            <Button variant="outline" className="w-full border-slate-700 text-slate-400 hover:text-white">
              Exit — Take me back
            </Button>
          </Link>
        </div>
        <p className="text-xs text-slate-600 mt-4">
          This platform complies with 18 U.S.C. § 2257. All performers are 18+ with verified documentation.
        </p>
      </div>
    </div>
  );
}

export default function NSFWFeed() {
  const { user } = useAuth();
  const [ageVerified, setAgeVerified] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState<"all" | "free" | "premium" | "vip">("all");
  const [blurred, setBlurred] = useState<Record<number, boolean>>({});

  if (!ageVerified) return <AgeGateBanner onConfirm={() => setAgeVerified(true)} />;

  const filtered = MOCK_CONTENT.filter(c => {
    if (filter === "all") return true;
    if (filter === "free") return !c.locked;
    if (filter === "premium") return c.tier === "Premium";
    if (filter === "vip") return c.tier === "VIP";
    return true;
  });

  return (
    <div className="min-h-screen bg-[#050308] text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#050308]/95 backdrop-blur border-b border-red-900/20 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-400" />
            <span className="font-black text-white">ShadowFans</span>
            <Badge className="bg-red-600/20 text-red-400 border-red-500/30 text-[10px]">18+</Badge>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter tabs */}
            {(["all", "free", "premium", "vip"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${filter === f ? "bg-red-600 text-white" : "text-slate-500 hover:text-white hover:bg-slate-800"}`}
              >
                {f}
              </button>
            ))}
            <div className="flex border border-slate-800 rounded-lg overflow-hidden ml-2">
              <button onClick={() => setViewMode("grid")} className={`p-1.5 ${viewMode === "grid" ? "bg-slate-700 text-white" : "text-slate-500"}`}><Grid className="w-4 h-4" /></button>
              <button onClick={() => setViewMode("list")} className={`p-1.5 ${viewMode === "list" ? "bg-slate-700 text-white" : "text-slate-500"}`}><List className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Creator bar */}
        <div className="flex gap-3 overflow-x-auto pb-3 mb-6 scrollbar-hide">
          {["ShadowCreator", "CryptoMuse", "NightOwl", "PixelDreamer", "MidnightMuse"].map(name => (
            <div key={name} className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-600 to-purple-600 flex items-center justify-center border-2 border-red-500/40 group-hover:border-red-400 transition-colors">
                <span className="text-lg font-black text-white">{name[0]}</span>
              </div>
              <span className="text-[10px] text-slate-400 group-hover:text-white transition-colors truncate w-14 text-center">{name}</span>
            </div>
          ))}
        </div>

        {/* Content grid */}
        <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 gap-4" : "space-y-3"}>
          {filtered.map(item => (
            <div
              key={item.id}
              className={`bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden hover:border-red-500/30 transition-all group ${viewMode === "list" ? "flex gap-4 p-3" : ""}`}
            >
              {/* Thumbnail */}
              <div className={`relative ${viewMode === "list" ? "w-24 h-20 shrink-0 rounded-lg overflow-hidden" : "aspect-[4/3]"} bg-gradient-to-br from-slate-800 to-slate-900`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  {item.type === "video" ? (
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-t-[6px] border-b-[6px] border-l-[10px] border-transparent border-l-white ml-1" />
                    </div>
                  ) : (
                    <Star className="w-8 h-8 text-slate-600" />
                  )}
                </div>
                {item.locked && (
                  <div
                    className={`absolute inset-0 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${blurred[item.id] !== true ? "backdrop-blur-md bg-black/60" : ""}`}
                    onClick={() => setBlurred(b => ({ ...b, [item.id]: !b[item.id] }))}
                  >
                    {blurred[item.id] !== true && (
                      <>
                        <Lock className="w-5 h-5 text-white" />
                        <span className="text-[10px] text-white font-semibold">${item.price}</span>
                        <EyeOff className="w-3 h-3 text-slate-400" />
                      </>
                    )}
                  </div>
                )}
                <Badge className={`absolute top-2 left-2 text-[9px] px-1.5 py-0.5 ${TIER_COLORS[item.tier]}`}>{item.tier}</Badge>
              </div>

              {/* Info */}
              <div className={viewMode === "list" ? "flex-1 min-w-0" : "p-3"}>
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-red-600 to-purple-600 flex items-center justify-center shrink-0">
                    <span className="text-[8px] font-black text-white">{item.creator[0]}</span>
                  </div>
                  <span className="text-xs text-slate-400 truncate">{item.handle}</span>
                  {item.tier === "VIP" && <Crown className="w-3 h-3 text-yellow-400 shrink-0" />}
                </div>
                <p className="text-sm font-semibold text-white truncate mb-2">{item.title}</p>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{item.likes.toLocaleString()}</span>
                  <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{item.comments}</span>
                  {item.locked && (
                    <Button size="sm" className="ml-auto h-6 px-2 text-[10px] bg-red-600 hover:bg-red-500 text-white">
                      Unlock ${item.price}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Become a creator CTA */}
        <div className="mt-10 bg-gradient-to-br from-red-900/20 to-purple-900/20 border border-red-500/20 rounded-2xl p-6 text-center">
          <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
          <h2 className="text-xl font-black text-white mb-1">Become a Creator</h2>
          <p className="text-slate-400 text-sm mb-4">Earn 80% revenue share. Set your own prices. Build your empire.</p>
          <Link href="/creator-studio">
            <Button className="bg-red-600 hover:bg-red-500 text-white font-bold">
              Start Creating
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
