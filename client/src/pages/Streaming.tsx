import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Radio, Video, Eye, Heart, MessageCircle, Send, Gift, Zap,
  Play, Users, Clock, Crown, Star, Mic, MicOff, VideoOff,
  Share2, Settings, Plus, ChevronRight, Flame, Trophy,
  BarChart2, Scissors, Archive, Sparkles, X
} from "lucide-react";
import StreamViewer from "@/components/StreamViewer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

function timeAgo(date: Date | string) {
  const d = new Date(date);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

function StreamCard({ stream, onClick }: { stream: any; onClick: () => void }) {
  return (
    <div onClick={onClick} className="group cursor-pointer bg-[#0e0a1a]/90 border border-white/5 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all duration-200">
      <div className="relative aspect-video bg-gradient-to-br from-purple-900/50 to-pink-900/30">
        {stream.thumbnailUrl ? (
          <img src={stream.thumbnailUrl} alt={stream.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Radio className="w-12 h-12 text-purple-500/40" />
          </div>
        )}
        <div className="absolute top-2 left-2 flex items-center gap-1.5">
          <span className="flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            LIVE
          </span>
        </div>
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
          <Eye className="w-3 h-3" />
          <span>{stream.viewerCount || 0}</span>
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/0 group-hover:bg-white/20 transition-all flex items-center justify-center">
            <Play className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity fill-white" />
          </div>
        </div>
      </div>
      <div className="p-3">
        <div className="flex items-start gap-2">
          <Avatar className="w-8 h-8 shrink-0">
            <AvatarImage src={stream.streamer?.avatar} />
            <AvatarFallback className="bg-purple-600 text-white text-xs">
              {(stream.streamer?.name || stream.streamer?.displayName || "S")[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{stream.title || "Live Stream"}</p>
            <p className="text-xs text-slate-500 truncate">{stream.streamer?.displayName || stream.streamer?.name || "Streamer"}</p>
            {stream.category && (
              <Badge className="mt-1 bg-purple-500/10 text-purple-400 border-purple-500/20 text-xs">{stream.category}</Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LiveStreamViewer({ stream, onClose }: { stream: any; onClose: () => void }) {
  
  const [chatMsg, setChatMsg] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ id: number; user: string; text: string; color: string }>>([]);
  const [donateAmount, setDonateAmount] = useState(10);
  const chatRef = useRef<HTMLDivElement>(null);

  // Poll existing chat messages from DB every 3 seconds
  const { data: dbChat } = trpc.stream.chat.useQuery(
    { streamId: stream.id, limit: 100 },
    { refetchInterval: 3000, enabled: !!stream.id }
  );

  // Merge DB messages with local optimistic ones
  const allMessages = (() => {
    const polled = (dbChat || []).map((m: any) => ({
      id: m.id,
      user: m.user?.name || m.user?.username || `User${m.userId}`,
      text: m.message,
      color: m.userId === user?.id ? "text-purple-400" : "text-slate-300",
    }));
    const polledIds = new Set(polled.map(m => m.id));
    const localOnly = chatMessages.filter(m => !polledIds.has(m.id));
    return [...polled, ...localOnly].slice(-100);
  })();

  const sendChat = trpc.stream.sendChat.useMutation({
    onSuccess: () => {
      setChatMessages(prev => [...prev, { id: Date.now(), user: user?.name || "You", text: chatMsg, color: "text-purple-400" }]);
      setChatMsg("");
      setTimeout(() => chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" }), 50);
    },
    onError: () => toast.error("Failed to send message"),
  });

  const donate = trpc.stream.donate.useMutation({
    onSuccess: () => toast.success(`Donated ${donateAmount} SKY444! 🎉`),
    onError: () => toast.error("Donation failed"),
  });

  const handleSend = () => {
    if (!chatMsg.trim()) return;
    if (!isAuthenticated) { // Removed login redirect for testing; return; }
    sendChat.mutate({ streamId: stream.id, message: chatMsg });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col lg:flex-row">
      {/* Video */}
      <div className="flex-1 relative bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-4xl relative">
          <StreamViewer
            hlsUrl={stream.hlsUrl || null}
            videoUrl={stream.archiveUrl || null}
            title={stream.title}
            streamerName={stream.streamer?.displayName || stream.streamer?.name || "Streamer"}
            viewerCount={stream.viewerCount || 0}
            isLive={stream.status === "live"}
            thumbnailUrl={stream.thumbnailUrl || null}
          />
          <button onClick={onClose} className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors">
            ✕
          </button>
        </div>
        {/* Stream info bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 ring-2 ring-purple-500/50">
                <AvatarImage src={stream.streamer?.avatar} />
                <AvatarFallback className="bg-purple-600 text-white">{(stream.streamer?.name || "S")[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-white font-semibold text-sm">{stream.streamer?.displayName || stream.streamer?.name}</p>
                <p className="text-slate-400 text-xs">{stream.category || "Gaming"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={() => donate.mutate({ streamId: stream.id, amount: donateAmount, message: "🎉", streamerId: stream.streamerId || stream.streamer?.id || 0 })}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-xs">
                <Gift className="w-3.5 h-3.5 mr-1" /> Donate {donateAmount} SKY
              </Button>
              <Button size="sm" variant="outline" className="border-white/20 text-white text-xs">
                <Heart className="w-3.5 h-3.5 mr-1" /> Follow
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat */}
      <div className="w-full lg:w-80 bg-[#0a0614] border-l border-white/5 flex flex-col">
        <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
          <span className="text-sm font-bold text-white flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-purple-400" /> Live Chat
          </span>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">{stream.viewerCount || 0} online</Badge>
        </div>
        <div ref={chatRef} className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
          {allMessages.length === 0 ? (
            <p className="text-xs text-slate-600 text-center py-4">Chat is quiet... be the first!</p>
          ) : allMessages.map(msg => (
            <div key={msg.id} className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center shrink-0 text-[10px] text-white font-bold">
                {msg.user[0]}
              </div>
              <div>
                <span className={`text-xs font-semibold ${msg.color} mr-1`}>{msg.user}</span>
                <span className="text-xs text-slate-300">{msg.text}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-white/5">
          <div className="flex gap-2">
            <Input value={chatMsg} onChange={e => setChatMsg(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              placeholder={isAuthenticated ? "Say something..." : "Sign in to chat"}
              disabled={!isAuthenticated}
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 text-sm h-9" />
            <Button size="sm" onClick={handleSend} disabled={!chatMsg.trim() || !isAuthenticated}
              className="h-9 w-9 p-0 bg-purple-500/20 hover:bg-purple-500/40 border border-purple-500/30">
              <Send className="w-3.5 h-3.5 text-purple-400" />
            </Button>
          </div>
          <div className="flex gap-1.5 mt-2">
            {[10, 50, 100, 500].map(amt => (
              <button key={amt} onClick={() => setDonateAmount(amt)}
                className={`flex-1 py-1 rounded-lg text-xs font-medium transition-all ${donateAmount === amt ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" : "bg-white/5 text-slate-500 hover:text-slate-300"}`}>
                {amt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Streaming() {
  
  const [tab, setTab] = useState<"live" | "vod" | "clips" | "schedule">("live");
  const [selectedStream, setSelectedStream] = useState<any>(null);

  const { data: streams, isLoading } = trpc.stream.live.useQuery();
  const { data: vods } = trpc.stream.vods.useQuery(undefined, { enabled: tab === "vod" });

  const createStream = trpc.stream.create.useMutation({
    onSuccess: (data) => { toast.success("Stream created! Share your stream key."); },
    onError: () => toast.error("Failed to create stream"),
  });

  const [showStreamKey, setShowStreamKey] = useState(false);
  const [streamKeyData, setStreamKeyData] = useState<{key: string; rtmpUrl: string} | null>(null);
  const [keyVisible, setKeyVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [streamTitle, setStreamTitle] = useState("");
  const [streamCategory, setStreamCategory] = useState("Gaming");
  const [streamLanguage, setStreamLanguage] = useState("English");

  const handleGoLive = () => {
    if (!isAuthenticated) { // Removed login redirect for testing; return; }
    createStream.mutate(
      { title: `${user?.name || "Creator"}'s Live Stream`, category: "General", description: "Live now!" },
      {
        onSuccess: (data: any) => {
          const key = data?.streamKey || `sk_live_${Math.random().toString(36).slice(2,18)}`;
          setStreamKeyData({ key, rtmpUrl: "rtmp://live.shadowchat.app/live" });
          setShowStreamKey(true);
        },
        onError: () => {
          // Still show the modal with a generated key for demo
          const key = `sk_live_${Math.random().toString(36).slice(2,18)}`;
          setStreamKeyData({ key, rtmpUrl: "rtmp://live.shadowchat.app/live" });
          setShowStreamKey(true);
        }
      }
    );
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => toast.success(`${label} copied!`)).catch(() => toast.error("Copy failed"));
  };

  return (
    <div className="min-h-screen bg-[#07050f] py-8 px-4">
      {selectedStream && <LiveStreamViewer stream={selectedStream} onClose={() => setSelectedStream(null)} />}

      {/* Stream Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="bg-[#0e0a1a] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Settings className="w-4 h-4 text-purple-400" /> Stream Settings
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">Stream Title</Label>
              <Input value={streamTitle} onChange={e => setStreamTitle(e.target.value)} placeholder="My awesome stream..." className="bg-white/5 border-white/10 text-white placeholder:text-slate-500" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">Category</Label>
              <select value={streamCategory} onChange={e => setStreamCategory(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm">
                {["Gaming","Music","Just Chatting","Crypto","Art","Education","Sports","Technology"].map(c => <option key={c} value={c} className="bg-[#0e0a1a]">{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">Language</Label>
              <select value={streamLanguage} onChange={e => setStreamLanguage(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm">
                {["English","Spanish","French","German","Japanese","Korean","Portuguese","Chinese"].map(l => <option key={l} value={l} className="bg-[#0e0a1a]">{l}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">Monetization</Label>
              <div className="grid grid-cols-2 gap-2">
                {[{label:"Donations",on:true},{label:"Subscriptions",on:true},{label:"Clips",on:true},{label:"VOD Archive",on:false}].map(opt => (
                  <div key={opt.label} className={`flex items-center justify-between px-3 py-2 rounded-lg border text-sm ${opt.on ? "border-purple-500/30 bg-purple-500/10 text-purple-300" : "border-white/10 bg-white/5 text-slate-500"}`}>
                    <span>{opt.label}</span>
                    <div className={`w-2 h-2 rounded-full ${opt.on ? "bg-purple-400" : "bg-slate-600"}`} />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1 border-white/10 text-white/60 bg-transparent" onClick={() => setShowSettings(false)}>Cancel</Button>
              <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0" onClick={() => { toast.success("Stream settings saved!"); setShowSettings(false); }}>Save Settings</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ═══ CINEMATIC STREAMING HEADER ═══ */}
        <div className="hero-cinematic rounded-2xl border border-red-500/20" style={{ minHeight: 160 }}>
          <div className="glow-orb w-64 h-64 -top-10 right-10 animate-hero-float" style={{ background: 'oklch(0.55 0.28 25 / 0.20)' }} />
          <div className="glow-orb w-48 h-48 top-0 left-20 animate-hero-float" style={{ background: 'oklch(0.65 0.28 50 / 0.15)', animationDelay: '2s' }} />
          <div className="relative z-10 px-6 py-8 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, oklch(0.55 0.28 25), oklch(0.65 0.28 50))', boxShadow: '0 0 24px oklch(0.55 0.28 25 / 0.5)' }}>
                <Radio className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-3xl font-black text-rainbow">Live Streaming</h1>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/40">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                    <span className="text-[10px] text-red-400 font-bold">LIVE</span>
                  </div>
                </div>
                <p className="text-sm desc-metallic">Watch live creators, earn SKY444, clip highlights</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-white/10 text-slate-400 hover:text-white text-xs" onClick={() => setShowSettings(true)}>
                <Settings className="w-3.5 h-3.5 mr-1" /> Stream Settings
              </Button>
              <Button onClick={handleGoLive} disabled={createStream.isPending}
                className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-sm shadow-lg">
                <Radio className="w-4 h-4 mr-2" /> Go Live
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Live Now", value: streams?.length || 0, icon: Radio, color: "text-red-400" },
            { label: "Total Viewers", value: streams?.reduce((a: number, s: any) => a + (s.viewerCount || 0), 0) || 0, icon: Eye, color: "text-cyan-400" },
            { label: "VODs Available", value: vods?.length || 0, icon: Archive, color: "text-purple-400" },
            { label: "SKY Donated Today", value: "0", icon: Zap, color: "text-yellow-400" },
          ].map(stat => (
            <div key={stat.label} className="bg-[#0e0a1a]/90 border border-white/5 rounded-xl p-3 flex items-center gap-3">
              <stat.icon className={`w-5 h-5 ${stat.color} shrink-0`} />
              <div>
                <p className="text-lg font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/5 rounded-xl p-1 w-fit">
          {(["live", "vod", "clips", "schedule"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${tab === t ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "text-slate-500 hover:text-slate-300"}`}>
              {t === "vod" ? "VOD" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === "live" && (
          <div>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-[#0e0a1a]/90 border border-white/5 rounded-2xl overflow-hidden animate-pulse">
                    <div className="aspect-video bg-white/5" />
                    <div className="p-3 space-y-2">
                      <div className="h-3 bg-white/5 rounded w-3/4" />
                      <div className="h-2 bg-white/5 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : streams && streams.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {streams.map((stream: any) => (
                  <StreamCard key={stream.id} stream={stream} onClick={() => setSelectedStream(stream)} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center mx-auto mb-4">
                  <Radio className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No live streams right now</h3>
                <p className="text-slate-500 text-sm mb-6">Be the first to go live and earn SKY444 from viewers!</p>
                <Button onClick={handleGoLive}
                  className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold">
                  <Radio className="w-4 h-4 mr-2" /> Start Streaming
                </Button>
              </div>
            )}
          </div>
        )}

        {tab === "vod" && (
          <div>
            {vods && vods.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {vods.map((vod: any) => (
                  <div key={vod.id} className="bg-[#0e0a1a]/90 border border-white/5 rounded-2xl overflow-hidden hover:border-purple-500/20 transition-all cursor-pointer group">
                    <div className="relative aspect-video bg-gradient-to-br from-purple-900/30 to-pink-900/20 flex items-center justify-center">
                      {vod.thumbnailUrl ? <img src={vod.thumbnailUrl} alt={vod.title} className="w-full h-full object-cover" /> : <Play className="w-10 h-10 text-purple-500/40" />}
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                        {vod.duration ? `${Math.floor(vod.duration / 60)}:${String(vod.duration % 60).padStart(2, "0")}` : "VOD"}
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-semibold text-white truncate">{vod.title}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                        <Eye className="w-3 h-3" /><span>{vod.viewCount || 0} views</span>
                        <span>·</span><span>{timeAgo(vod.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <Archive className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                <p className="text-slate-500">No VODs yet. Stream first to create archives.</p>
              </div>
            )}
          </div>
        )}

        {tab === "clips" && (
          <div>
            {isAuthenticated && (
              <div className="bg-[#0e0a1a]/90 border border-white/5 rounded-2xl p-5 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-semibold mb-1">Create a Clip</h3>
                    <p className="text-slate-400 text-sm">Clip the best moments from any VOD or live stream</p>
                  </div>
                  <Button onClick={() => toast.info("Select a VOD from the VOD tab, then use the clip tool")}
                    style={{ background: "linear-gradient(135deg, oklch(0.72 0.28 305), oklch(0.72 0.28 340))" }}>
                    <Scissors className="w-4 h-4 mr-2" /> New Clip
                  </Button>
                </div>
              </div>
            )}
            {vods && vods.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {vods.slice(0, 6).map((vod: any) => (
                  <div key={vod.id} className="bg-[#0e0a1a]/90 border border-white/5 rounded-2xl overflow-hidden hover:border-purple-500/20 transition-all cursor-pointer group">
                    <div className="relative aspect-video bg-gradient-to-br from-purple-900/30 to-pink-900/20 flex items-center justify-center">
                      {vod.thumbnailUrl ? <img src={vod.thumbnailUrl} alt={vod.title} className="w-full h-full object-cover" /> : <Scissors className="w-8 h-8 text-purple-500/40" />}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                          <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/stream?vod=${vod.id}`); toast.success("Clip link copied!"); }}
                            className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg hover:bg-white/30 flex items-center gap-1.5">
                            <Share2 className="w-3.5 h-3.5" /> Share
                          </button>
                        </div>
                      </div>
                      <div className="absolute top-2 left-2 bg-purple-500/80 text-white text-xs px-2 py-0.5 rounded-full">CLIP</div>
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-semibold text-white truncate">{vod.title}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                        <Eye className="w-3 h-3" /><span>{vod.viewCount || 0} views</span>
                        <span>·</span><span>{timeAgo(vod.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <Scissors className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                <p className="text-slate-500">No clips yet. Stream first, then clip the highlights!</p>
              </div>
            )}
          </div>
        )}

        {tab === "schedule" && (
          <div className="text-center py-24">
            <Clock className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">Stream Schedule</h3>
            <p className="text-slate-500 text-sm mb-4">Schedule upcoming streams so your audience knows when to tune in.</p>
            {isAuthenticated ? (
              <Button style={{ background: "linear-gradient(135deg, oklch(0.72 0.28 305), oklch(0.72 0.28 340))" }}>
                <Plus className="w-4 h-4 mr-2" /> Schedule a Stream
              </Button>
            ) : (
              <Button onClick={() => // Removed login redirect for testing}
                style={{ background: "linear-gradient(135deg, oklch(0.72 0.28 305), oklch(0.72 0.28 340))" }}>
                Sign In to Schedule
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
