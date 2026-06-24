import { useState } from "react";
import { Lock, Unlock, Star, Download, Eye, Crown, Zap, Shield, Filter, Search, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

const VAULT_ITEMS = [
  { id: 1, title: "Exclusive Photo Set #001", type: "photo", tier: "Basic",   size: "24 photos", unlocked: true,  date: "Jun 12", views: 1240 },
  { id: 2, title: "Behind the Scenes Video",  type: "video", tier: "Premium", size: "18 min",    unlocked: true,  date: "Jun 10", views: 890  },
  { id: 3, title: "VIP Private Collection",   type: "photo", tier: "VIP",     size: "48 photos", unlocked: false, date: "Jun 8",  views: 3200 },
  { id: 4, title: "Exclusive Audio Message",  type: "audio", tier: "Basic",   size: "4 min",     unlocked: true,  date: "Jun 6",  views: 560  },
  { id: 5, title: "Full Length Video #3",     type: "video", tier: "Premium", size: "42 min",    unlocked: false, date: "Jun 4",  views: 2100 },
  { id: 6, title: "Signed Digital Print",     type: "photo", tier: "VIP",     size: "1 file",    unlocked: false, date: "Jun 2",  views: 4500 },
  { id: 7, title: "Personalized Shoutout",    type: "video", tier: "Basic",   size: "2 min",     unlocked: true,  date: "May 30", views: 780  },
  { id: 8, title: "Exclusive Story Archive",  type: "photo", tier: "Premium", size: "36 photos", unlocked: false, date: "May 28", views: 1650 },
];

const TIER_COLORS: Record<string, string> = {
  Basic:   "bg-blue-900/50 text-blue-300 border-blue-500/20",
  Premium: "bg-purple-900/50 text-purple-300 border-purple-500/20",
  VIP:     "bg-yellow-900/50 text-yellow-300 border-yellow-500/20",
};

const TYPE_ICONS: Record<string, string> = { photo: "🖼️", video: "🎬", audio: "🎵" };

export default function ContentVault() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unlocked" | "locked">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filtered = VAULT_ITEMS.filter(item => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || (filter === "unlocked" ? item.unlocked : !item.unlocked);
    return matchSearch && matchFilter;
  });

  const unlockedCount = VAULT_ITEMS.filter(i => i.unlocked).length;
  const lockedCount = VAULT_ITEMS.filter(i => !i.unlocked).length;

  return (
    <div className="min-h-screen bg-[#050308] text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#050308]/95 backdrop-blur border-b border-slate-800 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-400" />
            <span className="font-black text-white">Content Vault</span>
            <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/30 text-[10px]">
              {unlockedCount}/{VAULT_ITEMS.length} Unlocked
            </Badge>
          </div>
          <Link href="/nsfw-feed">
            <Button size="sm" variant="outline" className="border-slate-700 text-slate-400 hover:text-white text-xs">
              Browse Feed
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Unlocked", value: unlockedCount, icon: Unlock, color: "text-green-400" },
            { label: "Locked",   value: lockedCount,   icon: Lock,   color: "text-red-400"   },
            { label: "Total",    value: VAULT_ITEMS.length, icon: Star, color: "text-purple-400" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-center">
              <Icon className={`w-5 h-5 ${color} mx-auto mb-1`} />
              <p className="text-2xl font-black text-white">{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search vault..."
              className="pl-9 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>
          <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
            {(["all", "unlocked", "locked"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition-all ${filter === f ? "bg-purple-600 text-white" : "text-slate-500 hover:text-white"}`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex border border-slate-800 rounded-lg overflow-hidden">
            <button onClick={() => setViewMode("grid")} className={`p-2 ${viewMode === "grid" ? "bg-slate-700 text-white" : "text-slate-500"}`}><Grid className="w-4 h-4" /></button>
            <button onClick={() => setViewMode("list")} className={`p-2 ${viewMode === "list" ? "bg-slate-700 text-white" : "text-slate-500"}`}><List className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Items */}
        <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" : "space-y-3"}>
          {filtered.map(item => (
            <div
              key={item.id}
              className={`bg-slate-900/60 border rounded-xl overflow-hidden transition-all group cursor-pointer ${item.unlocked ? "border-slate-700 hover:border-purple-500/40" : "border-slate-800 hover:border-red-500/30"} ${viewMode === "list" ? "flex gap-4 p-3 items-center" : ""}`}
            >
              {/* Thumbnail */}
              <div className={`relative bg-gradient-to-br from-slate-800 to-slate-900 ${viewMode === "list" ? "w-16 h-16 rounded-lg shrink-0" : "aspect-square"} flex items-center justify-center`}>
                <span className="text-2xl">{TYPE_ICONS[item.type]}</span>
                {!item.unlocked && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-lg">
                    <Lock className="w-5 h-5 text-red-400" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className={viewMode === "list" ? "flex-1 min-w-0" : "p-3"}>
                <p className={`text-sm font-semibold truncate mb-1 ${item.unlocked ? "text-white" : "text-slate-500"}`}>{item.title}</p>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={`text-[9px] px-1.5 py-0.5 border ${TIER_COLORS[item.tier]}`}>{item.tier}</Badge>
                  <span className="text-[10px] text-slate-600">{item.size}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-600 flex items-center gap-1">
                    <Eye className="w-3 h-3" />{item.views.toLocaleString()}
                  </span>
                  {item.unlocked ? (
                    <Button size="sm" className="h-6 px-2 text-[10px] bg-green-700 hover:bg-green-600 text-white">
                      <Download className="w-3 h-3 mr-1" />View
                    </Button>
                  ) : (
                    <Button size="sm" className="h-6 px-2 text-[10px] bg-red-700 hover:bg-red-600 text-white">
                      <Zap className="w-3 h-3 mr-1" />Unlock
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <Shield className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No items match your filter</p>
          </div>
        )}

        {/* Upgrade CTA */}
        {lockedCount > 0 && (
          <div className="mt-10 bg-gradient-to-br from-purple-900/20 to-fuchsia-900/20 border border-purple-500/20 rounded-2xl p-6 text-center">
            <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <h2 className="text-xl font-black text-white mb-1">Unlock {lockedCount} More Items</h2>
            <p className="text-slate-400 text-sm mb-4">Upgrade your subscription to access the full vault.</p>
            <Link href="/subscriptions">
              <Button className="bg-purple-600 hover:bg-purple-500 text-white font-bold">
                Upgrade Subscription
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
