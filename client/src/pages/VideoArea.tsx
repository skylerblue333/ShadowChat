import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Play, Heart, MessageCircle, Share2, Upload, Search,
  TrendingUp, Radio, ChevronUp, ChevronDown, Volume2, VolumeX,
  Bookmark, MoreHorizontal, Plus, Eye, Clock
} from "lucide-react";

// Mock video data for demo
const MOCK_REELS = [
  { id: 1, user: "CryptoKing", avatar: "👑", title: "How I made 10x on TRUMP token 🚀", views: "2.4M", likes: 184200, comments: 3420, duration: "0:45", tags: ["crypto","trump","defi"], url: "", thumb: "https://picsum.photos/seed/reel1/400/700" },
  { id: 2, user: "SkyWhale", avatar: "🐋", title: "DeFi yield farming explained in 60 seconds", views: "890K", likes: 67300, comments: 1820, duration: "1:00", tags: ["defi","yield","tutorial"], url: "", thumb: "https://picsum.photos/seed/reel2/400/700" },
  { id: 3, user: "MoonRider", avatar: "🌙", title: "Ethereum vs Solana — which wins 2025?", views: "1.2M", likes: 98400, comments: 5610, duration: "0:58", tags: ["eth","sol","comparison"], url: "", thumb: "https://picsum.photos/seed/reel3/400/700" },
  { id: 4, user: "NFTQueen", avatar: "👸", title: "My NFT collection just hit 100 ETH floor 💎", views: "445K", likes: 42100, comments: 890, duration: "0:52", tags: ["nft","ethereum","art"], url: "", thumb: "https://picsum.photos/seed/reel4/400/700" },
  { id: 5, user: "HackerDev", avatar: "💻", title: "I found a $2M bug in a DeFi protocol", views: "3.1M", likes: 241000, comments: 8900, duration: "0:59", tags: ["security","defi","bug"], url: "", thumb: "https://picsum.photos/seed/reel5/400/700" },
];

const MOCK_VIDEOS = [
  { id: 1, user: "SkyAcademy", avatar: "🎓", title: "Complete Solidity Course 2025 — Build DeFi from Scratch", views: "128K", likes: 9800, duration: "4:22:15", thumb: "https://picsum.photos/seed/vid1/640/360", category: "Tutorial" },
  { id: 2, user: "CryptoNews", avatar: "📰", title: "TRUMP Token Analysis — Is $100 Possible?", views: "84K", likes: 6200, duration: "18:44", thumb: "https://picsum.photos/seed/vid2/640/360", category: "Analysis" },
  { id: 3, user: "DeFiMaster", avatar: "🏦", title: "How to Earn $1000/day with Yield Farming", views: "342K", likes: 28400, duration: "32:11", thumb: "https://picsum.photos/seed/vid3/640/360", category: "Strategy" },
  { id: 4, user: "HackersUnite", avatar: "🔐", title: "Ethical Hacking Full Course — Zero to Hero", views: "512K", likes: 41200, duration: "8:14:30", thumb: "https://picsum.photos/seed/vid4/640/360", category: "Course" },
  { id: 5, user: "AIBuilder", avatar: "🤖", title: "Build an AI Trading Bot in Python — Full Tutorial", views: "198K", likes: 15600, duration: "2:45:00", thumb: "https://picsum.photos/seed/vid5/640/360", category: "Tutorial" },
  { id: 6, user: "Web3Dev", avatar: "⛓️", title: "Smart Contract Security Audit Walkthrough", views: "67K", likes: 5400, duration: "1:12:44", thumb: "https://picsum.photos/seed/vid6/640/360", category: "Security" },
  { id: 7, user: "SkyStreamer", avatar: "🎮", title: "Live Coding — Building a DEX from Scratch", views: "45K", likes: 3800, duration: "3:30:00", thumb: "https://picsum.photos/seed/vid7/640/360", category: "Live" },
  { id: 8, user: "CryptoKing", avatar: "👑", title: "Portfolio Update — My Top 10 Crypto Picks 2025", views: "221K", likes: 18900, duration: "24:33", thumb: "https://picsum.photos/seed/vid8/640/360", category: "Portfolio" },
];

const LIVE_STREAMS = [
  { id: 1, user: "SkyStreamer", avatar: "🎮", title: "🔴 LIVE: Building DeFi Protocol — Day 3", viewers: 1842, category: "Coding" },
  { id: 2, user: "CryptoKing", avatar: "👑", title: "🔴 LIVE: TRUMP Token Analysis & Trading", viewers: 3241, category: "Trading" },
  { id: 3, user: "HackerDev", avatar: "💻", title: "🔴 LIVE: CTF Competition — Hacking Challenge", viewers: 892, category: "Hacking" },
];

function ReelViewer({ reels }: { reels: typeof MOCK_REELS }) {
  const [current, setCurrent] = useState(0);
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [saved, setSaved] = useState<Set<number>>(new Set());
  const [muted, setMuted] = useState(true);

  const reel = reels[current];

  const prev = () => setCurrent(c => Math.max(0, c - 1));
  const next = () => setCurrent(c => Math.min(reels.length - 1, c + 1));

  const toggleLike = (id: number) => {
    setLiked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="relative flex items-center justify-center" style={{ height: "calc(100vh - 200px)", minHeight: 500 }}>
      <div className="relative w-full max-w-sm mx-auto" style={{ aspectRatio: "9/16" }}>
        {/* Video background */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden bg-black">
          <img src={reel.thumb} alt={reel.title} className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
        </div>

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/30 transition-all">
            <Play className="w-8 h-8 text-white fill-white ml-1" />
          </div>
        </div>

        {/* Top bar */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <div className="flex gap-1">
            {reel.tags.map(tag => (
              <Badge key={tag} className="bg-black/40 text-white border-white/20 text-[10px] backdrop-blur-sm">#{tag}</Badge>
            ))}
          </div>
          <button onClick={() => setMuted(!muted)} className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white">
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-4 left-4 right-16">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{reel.avatar}</span>
            <span className="text-white font-semibold text-sm">@{reel.user}</span>
            <Button size="sm" className="h-6 text-xs bg-purple-500/80 hover:bg-purple-500 text-white px-2 py-0">Follow</Button>
          </div>
          <p className="text-white text-sm font-medium leading-snug">{reel.title}</p>
          <p className="text-white/60 text-xs mt-1">{reel.views} views · {reel.duration}</p>
        </div>

        {/* Right actions */}
        <div className="absolute right-2 bottom-4 flex flex-col items-center gap-4">
          <button onClick={() => toggleLike(reel.id)} className="flex flex-col items-center gap-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${liked.has(reel.id) ? "bg-red-500" : "bg-black/40 backdrop-blur-sm"}`}>
              <Heart className={`w-5 h-5 ${liked.has(reel.id) ? "fill-white text-white" : "text-white"}`} />
            </div>
            <span className="text-white text-xs">{((reel.likes + (liked.has(reel.id) ? 1 : 0)) / 1000).toFixed(1)}K</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-white text-xs">{(reel.comments / 1000).toFixed(1)}K</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-white text-xs">Share</span>
          </button>
          <button onClick={() => setSaved(prev => { const n = new Set(prev); if(n.has(reel.id)) n.delete(reel.id); else n.add(reel.id); return n; })} className="flex flex-col items-center gap-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${saved.has(reel.id) ? "bg-yellow-500" : "bg-black/40 backdrop-blur-sm"}`}>
              <Bookmark className={`w-5 h-5 ${saved.has(reel.id) ? "fill-white text-white" : "text-white"}`} />
            </div>
            <span className="text-white text-xs">Save</span>
          </button>
        </div>

        {/* Navigation arrows */}
        <button onClick={prev} disabled={current === 0} className="absolute left-1/2 -translate-x-1/2 top-2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white disabled:opacity-30">
          <ChevronUp className="w-5 h-5" />
        </button>
        <button onClick={next} disabled={current === reels.length - 1} className="absolute left-1/2 -translate-x-1/2 bottom-2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white disabled:opacity-30">
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Reel dots */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1.5">
        {reels.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`w-1.5 rounded-full transition-all ${i === current ? "h-6 bg-white" : "h-1.5 bg-white/30"}`} />
        ))}
      </div>
    </div>
  );
}

export default function VideoArea() {
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("reels");
  const [likedVideos, setLikedVideos] = useState<Set<number>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: dbVideos } = trpc.video.listVideos.useQuery({ limit: 20 });

  const filtered = MOCK_VIDEOS.filter(v =>
    !search || v.title.toLowerCase().includes(search.toLowerCase()) || v.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpload = () => {
    if (!isAuthenticated) { toast.error("Sign in to upload"); return; }
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500 * 1024 * 1024) { toast.error("Max file size 500MB"); return; }
    toast.success(`Uploading ${file.name}...`);
    // In production: upload to S3 via storagePut, then call trpc.video.uploadVideo
  };

  return (
    <div className="min-h-screen bg-[#07050f] text-white">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#07050f]/95 backdrop-blur-xl border-b border-white/5 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <h1 className="text-xl font-black bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent whitespace-nowrap">SKY VIDEO</h1>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input placeholder="Search videos..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-9" />
          </div>
          <Button size="sm" className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 shrink-0" onClick={handleUpload}>
            <Upload className="w-4 h-4 mr-1.5" />Upload
          </Button>
          <input ref={fileInputRef} type="file" accept="video/*" className="hidden" onChange={handleFileChange} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-4">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-white/5 border border-white/10 mb-6">
            <TabsTrigger value="reels" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
              <Play className="w-3.5 h-3.5 mr-1.5" />Reels
            </TabsTrigger>
            <TabsTrigger value="videos" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">
              <Eye className="w-3.5 h-3.5 mr-1.5" />Videos
            </TabsTrigger>
            <TabsTrigger value="live" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-300">
              <Radio className="w-3.5 h-3.5 mr-1.5" />Live
              <Badge className="ml-1.5 bg-red-500 text-white text-[9px] px-1 py-0">{LIVE_STREAMS.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="trending" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-300">
              <TrendingUp className="w-3.5 h-3.5 mr-1.5" />Trending
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reels">
            <div className="flex flex-col items-center">
              <div className="w-full max-w-sm">
                <ReelViewer reels={MOCK_REELS} />
              </div>
              <p className="text-slate-600 text-xs mt-4">Swipe or use arrows to navigate · Tap to play</p>
            </div>
          </TabsContent>

          <TabsContent value="videos">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map(video => (
                <div key={video.id} className="group cursor-pointer" onClick={() => toast.info("Video player coming soon!")}>
                  <div className="relative rounded-xl overflow-hidden mb-2 bg-black aspect-video">
                    <img src={video.thumb} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    <div className="absolute bottom-2 right-2 bg-black/70 rounded px-1.5 py-0.5 text-white text-[10px] font-mono">{video.duration}</div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                      </div>
                    </div>
                    <Badge className="absolute top-2 left-2 bg-purple-500/80 text-white border-0 text-[10px]">{video.category}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xl shrink-0 mt-0.5">{video.avatar}</span>
                    <div>
                      <h3 className="text-white text-sm font-medium line-clamp-2 group-hover:text-purple-300 transition-colors">{video.title}</h3>
                      <p className="text-slate-500 text-xs mt-0.5">@{video.user}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-600 mt-0.5">
                        <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" />{video.views}</span>
                        <span className="flex items-center gap-0.5"><Heart className="w-3 h-3" />{(video.likes/1000).toFixed(1)}K</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-16 text-slate-500">
                <Play className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No videos found for "{search}"</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="live">
            <div className="space-y-4">
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-red-400 text-sm font-semibold">{LIVE_STREAMS.length} streams live now</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {LIVE_STREAMS.map(stream => (
                  <div key={stream.id} className="group cursor-pointer bg-[#0e0a1a] border border-white/5 hover:border-red-500/30 rounded-xl overflow-hidden transition-all" onClick={() => toast.info("Opening stream...")}>
                    <div className="relative aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                      <span className="text-5xl">{stream.avatar}</span>
                      <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-red-500 rounded px-2 py-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <span className="text-white text-[10px] font-bold">LIVE</span>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 rounded px-2 py-0.5 text-white text-[10px] flex items-center gap-1">
                        <Eye className="w-3 h-3" />{stream.viewers.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="text-white text-sm font-medium group-hover:text-red-300 transition-colors">{stream.title}</h3>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-slate-500 text-xs">@{stream.user}</span>
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-[10px]">{stream.category}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trending">
            <div className="space-y-3">
              {MOCK_VIDEOS.sort((a,b) => b.likes - a.likes).map((video, i) => (
                <div key={video.id} className="flex gap-3 p-3 bg-[#0e0a1a] border border-white/5 hover:border-white/10 rounded-xl cursor-pointer group transition-all" onClick={() => toast.info("Video player coming soon!")}>
                  <div className="text-2xl font-black text-slate-700 w-8 shrink-0 flex items-center justify-center">
                    {i < 3 ? ["🥇","🥈","🥉"][i] : i+1}
                  </div>
                  <div className="relative w-32 h-20 rounded-lg overflow-hidden shrink-0">
                    <img src={video.thumb} alt={video.title} className="w-full h-full object-cover" />
                    <div className="absolute bottom-1 right-1 bg-black/70 rounded px-1 text-[9px] text-white font-mono">{video.duration}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white text-sm font-medium line-clamp-2 group-hover:text-purple-300 transition-colors">{video.title}</h3>
                    <p className="text-slate-500 text-xs mt-1">@{video.user}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-600">
                      <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" />{video.views}</span>
                      <span className="flex items-center gap-0.5"><Heart className="w-3 h-3" />{(video.likes/1000).toFixed(1)}K</span>
                      <span className="flex items-center gap-0.5"><TrendingUp className="w-3 h-3 text-green-500" />Trending</span>
                    </div>
                  </div>
                  <Badge className="shrink-0 self-start bg-purple-500/20 text-purple-400 border-purple-500/30 text-[10px]">{video.category}</Badge>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
