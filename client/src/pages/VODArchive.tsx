import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Play, Clock, Eye, Grid, List, Share2, Filter, Tv, Download } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = ["All", "Gaming", "Education", "Crypto", "Music", "Art", "Tech", "IRL"];
const SORT_OPTIONS = [
  { value: "recent", label: "Most Recent" },
  { value: "popular", label: "Most Viewed" },
  { value: "longest", label: "Longest" },
];

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatViews(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

export default function VODArchive() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<any>(null);
  const [page, setPage] = useState(0);

  const { data: vodsRaw, isLoading } = trpc.stream.vods.useQuery(
    { streamerId: 0, limit: 50 },
    { staleTime: 60_000 }
  );

  const vods = useMemo(() => {
    let list = (vodsRaw || []) as any[];

    // Enrich with mock data for display when real data is sparse
    if (list.length === 0) {
      list = [
        { id: 1, title: "DeFi Yield Strategies 2025 — Full Masterclass", streamerName: "CryptoSkyler", viewerCount: 48200, duration: 8073, category: "Education", startedAt: new Date("2025-06-10"), endedAt: new Date(), status: "ended" },
        { id: 2, title: "SKY444 Token Deep Dive — Live Analysis", streamerName: "SkyTrader", viewerCount: 31500, duration: 5400, category: "Crypto", startedAt: new Date("2025-06-08"), endedAt: new Date(), status: "ended" },
        { id: 3, title: "Ethical Hacking Bootcamp — Zero to Hero", streamerName: "HackSky", viewerCount: 22100, duration: 14400, category: "Tech", startedAt: new Date("2025-06-05"), endedAt: new Date(), status: "ended" },
        { id: 4, title: "NFT Art Creation with AI Tools", streamerName: "ArtSky", viewerCount: 15800, duration: 3600, category: "Art", startedAt: new Date("2025-06-03"), endedAt: new Date(), status: "ended" },
        { id: 5, title: "Solidity Smart Contract Workshop", streamerName: "DevSky", viewerCount: 28900, duration: 10800, category: "Tech", startedAt: new Date("2025-06-01"), endedAt: new Date(), status: "ended" },
        { id: 6, title: "Crypto Portfolio Management 101", streamerName: "PortfolioSky", viewerCount: 19200, duration: 4500, category: "Education", startedAt: new Date("2025-05-30"), endedAt: new Date(), status: "ended" },
      ];
    }

    // Filter by search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((v: any) =>
        (v.title || "").toLowerCase().includes(q) ||
        (v.streamerName || v.creator || "").toLowerCase().includes(q)
      );
    }

    // Filter by category
    if (category !== "All") {
      list = list.filter((v: any) => (v.category || "").toLowerCase() === category.toLowerCase());
    }

    // Sort
    if (sortBy === "popular") list = [...list].sort((a, b) => (b.viewerCount || 0) - (a.viewerCount || 0));
    else if (sortBy === "longest") list = [...list].sort((a, b) => (b.duration || 0) - (a.duration || 0));
    else list = [...list].sort((a, b) => new Date(b.startedAt || 0).getTime() - new Date(a.startedAt || 0).getTime());

    return list;
  }, [vodsRaw, search, category, sortBy]);

  const PAGE_SIZE = 12;
  const paginated = vods.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(vods.length / PAGE_SIZE);

  return (
    <div className="min-h-screen">
      <PageHeader title="VOD Archive" subtitle="Browse past streams, replays, and recorded sessions" />
      <div className="container py-6 max-w-7xl">

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total VODs", value: vods.length.toLocaleString(), icon: Tv },
            { label: "Total Views", value: formatViews(vods.reduce((s: number, v: any) => s + (v.viewerCount || 0), 0)), icon: Eye },
            { label: "Hours of Content", value: `${Math.round(vods.reduce((s: number, v: any) => s + (v.duration || 0), 0) / 3600)}h`, icon: Clock },
            { label: "Creators", value: new Set(vods.map((v: any) => v.streamerName || v.creator)).size.toString(), icon: Grid },
          ].map(({ label, value, icon: Icon }) => (
            <Card key={label} className="bg-white/5 border-white/10">
              <CardContent className="p-4 flex items-center gap-3">
                <Icon className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-xl font-bold">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(0); }}
              placeholder="Search VODs..."
              className="pl-9 bg-white/5 border-white/10"
            />
          </div>
          <Select value={category} onValueChange={v => { setCategory(v); setPage(0); }}>
            <SelectTrigger className="w-36 bg-white/5 border-white/10">
              <Filter className="w-4 h-4 mr-1" /><SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={v => { setSortBy(v); setPage(0); }}>
            <SelectTrigger className="w-40 bg-white/5 border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex gap-1">
            <Button size="icon" variant={viewMode === "grid" ? "default" : "ghost"} onClick={() => setViewMode("grid")}><Grid className="w-4 h-4" /></Button>
            <Button size="icon" variant={viewMode === "list" ? "default" : "ghost"} onClick={() => setViewMode("list")}><List className="w-4 h-4" /></Button>
          </div>
        </div>

        {/* VOD Grid / List */}
        {isLoading ? (
          <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white/5 rounded-xl h-48" />
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Tv className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No VODs found{search ? ` for "${search}"` : ""}.</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginated.map((vod: any) => (
              <Card key={vod.id} className="bg-white/5 border-white/10 hover:border-purple-500/50 transition-all cursor-pointer group" onClick={() => setSelected(vod)}>
                <CardContent className="p-0">
                  <div className="relative bg-gradient-to-br from-purple-900/40 to-cyan-900/40 h-36 rounded-t-xl flex items-center justify-center">
                    <Play className="w-10 h-10 text-white/60 group-hover:text-white transition-colors" />
                    {vod.duration && (
                      <span className="absolute bottom-2 right-2 text-xs bg-black/70 px-1.5 py-0.5 rounded font-mono">
                        {formatDuration(vod.duration)}
                      </span>
                    )}
                    {vod.status === "live" && (
                      <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs animate-pulse">LIVE</Badge>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm line-clamp-2 mb-1">{vod.title || `Stream #${vod.id}`}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{vod.streamerName || vod.creator || "Creator"}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatViews(vod.viewerCount || 0)}</span>
                      {vod.category && <Badge variant="outline" className="text-xs py-0">{vod.category}</Badge>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {paginated.map((vod: any) => (
              <Card key={vod.id} className="bg-white/5 border-white/10 hover:border-purple-500/50 transition-all cursor-pointer" onClick={() => setSelected(vod)}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 w-24 h-14 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Play className="w-6 h-6 text-white/60" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{vod.title || `Stream #${vod.id}`}</h3>
                    <p className="text-xs text-muted-foreground">{vod.streamerName || "Creator"}</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground flex-shrink-0">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatViews(vod.viewerCount || 0)}</span>
                    {vod.duration && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDuration(vod.duration)}</span>}
                    {vod.category && <Badge variant="outline" className="text-xs py-0">{vod.category}</Badge>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous</Button>
            <span className="flex items-center text-sm text-muted-foreground px-3">
              Page {page + 1} of {totalPages}
            </span>
            <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        )}
      </div>

      {/* VOD Player Dialog */}
      {selected && (
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="max-w-3xl bg-zinc-950 border-white/10">
            <DialogHeader>
              <DialogTitle className="text-lg">{selected.title || `Stream #${selected.id}`}</DialogTitle>
            </DialogHeader>
            <div className="bg-gradient-to-br from-purple-900/30 to-cyan-900/30 rounded-xl h-64 flex items-center justify-center mb-4">
              <div className="text-center">
                <Play className="w-16 h-16 text-white/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">VOD Playback</p>
                <p className="text-xs text-muted-foreground mt-1">Connect a CDN/HLS source to enable playback</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{selected.streamerName || "Creator"}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatViews(selected.viewerCount || 0)} views</span>
                  {selected.duration && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDuration(selected.duration)}</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(window.location.href + `?vod=${selected.id}`); toast.success("Link copied!"); }}>
                  <Share2 className="w-4 h-4 mr-1" />Share
                </Button>
                <Button size="sm" variant="outline" onClick={() => toast.info("Download requires VOD CDN integration")}>
                  <Download className="w-4 h-4 mr-1" />Download
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
