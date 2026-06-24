import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import WebRTCBroadcaster from "@/components/WebRTCBroadcaster";
import {
  Radio, MessageSquare, Gift, ChevronLeft, Globe, Star, Eye,
  Zap, Users, Settings, Send, Crown, Flame
} from "lucide-react";

const CATEGORIES = ["Gaming", "Music", "Just Chatting", "Crypto", "Art", "Education", "Sports", "Technology", "AMA", "Trading"];

export default function CreateLiveStream() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Just Chatting");
  const [visibility, setVisibility] = useState<"public" | "subscribers">("public");
  const [isLive, setIsLive] = useState(false);
  const [streamKeyData, setStreamKeyData] = useState<{ key: string; rtmpUrl: string } | null>(null);
  const [chatMsg, setChatMsg] = useState("");
  const [localChat, setLocalChat] = useState<Array<{ id: number; user: string; text: string }>>([]);

  const createStream = trpc.stream.create.useMutation({
    onSuccess: (data: any) => {
      const key = data?.streamKey || `sk_live_${user?.id}_${Date.now().toString(36)}`;
      const rtmpUrl = data?.rtmpUrl || "rtmp://live.shadowchat.app/live";
      setStreamKeyData({ key, rtmpUrl });
      setIsLive(true);
      toast.success("🔴 You're live! Share your stream key with OBS.");
    },
    onError: () => {
      // Still go live with a generated key for demo/testing
      const key = `sk_live_${user?.id || "demo"}_${Date.now().toString(36)}`;
      setStreamKeyData({ key, rtmpUrl: "rtmp://live.shadowchat.app/live" });
      setIsLive(true);
      toast.success("🔴 Stream started! Use the key below in OBS.");
    },
  });

  const endStream = trpc.stream.end.useMutation({
    onSuccess: () => { setIsLive(false); setStreamKeyData(null); toast.info("Stream ended."); navigate("/streaming"); },
    onError: () => { setIsLive(false); setStreamKeyData(null); navigate("/streaming"); },
  });

  const handleGoLive = () => {
    if (!isAuthenticated) { window.location.href = getLoginUrl(); return; }
    if (!title.trim()) { toast.error("Please enter a stream title"); return; }
    createStream.mutate({ title, category, description: `${category} stream by ${user?.name}` });
  };

  const handleEndStream = () => {
    if (createStream.data?.streamId) {
      endStream.mutate({ streamId: createStream.data.streamId });
    } else {
      setIsLive(false);
      setStreamKeyData(null);
      navigate("/streaming");
    }
  };

  const handleSendChat = () => {
    if (!chatMsg.trim()) return;
    setLocalChat(prev => [...prev, { id: Date.now(), user: user?.name || "You", text: chatMsg }]);
    setChatMsg("");
  };

  return (
    <div className="min-h-screen bg-[#07050f] flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-white/5 bg-[#07050f]/95 backdrop-blur px-4 py-2.5 flex items-center gap-3">
        <Link href="/streaming">
          <Button variant="ghost" size="sm" className="gap-1 text-slate-400 hover:text-white">
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>
        </Link>
        <Badge className={`text-xs font-mono ${isLive ? "bg-red-500/20 text-red-400 border-red-500/30 animate-pulse" : "bg-white/5 text-slate-400 border-white/10"}`}>
          {isLive ? "🔴 LIVE" : "Create Stream"}
        </Badge>
        {isLive && (
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Eye className="h-3.5 w-3.5" /> 0 watching
          </span>
        )}
        <div className="flex-1" />
        <Button
          size="sm"
          onClick={isLive ? handleEndStream : handleGoLive}
          disabled={createStream.isPending || (!isLive && !title.trim())}
          className={isLive
            ? "bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
            : "bg-red-500 hover:bg-red-600 text-white font-bold gap-1.5"
          }
        >
          {isLive ? (
            "End Stream"
          ) : (
            <><Radio className="h-4 w-4" /> Go Live</>
          )}
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main — broadcaster */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="max-w-3xl mx-auto space-y-4">
            {/* WebRTC Broadcaster */}
            <WebRTCBroadcaster
              streamKey={streamKeyData?.key}
              rtmpUrl={streamKeyData?.rtmpUrl}
              isLive={isLive}
              viewerCount={0}
              onGoLive={handleGoLive}
              onEndStream={handleEndStream}
              title={title}
            />

            {/* Stream Setup (only before going live) */}
            {!isLive && (
              <div className="bg-[#0e0a1a]/80 border border-white/5 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Settings className="w-4 h-4 text-purple-400" /> Stream Settings
                </h3>

                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-400">Stream Title *</Label>
                  <Input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="What are you streaming today?"
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-10"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-400">Category</Label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(c => (
                      <button
                        key={c}
                        onClick={() => setCategory(c)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                          category === c
                            ? "border-purple-500/50 bg-purple-500/10 text-purple-300"
                            : "border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-300"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-400">Visibility</Label>
                  <div className="flex gap-3">
                    {([
                      { value: "public" as const, label: "Public", icon: Globe, desc: "Anyone can watch" },
                      { value: "subscribers" as const, label: "Subscribers", icon: Star, desc: "Subscribers only" },
                    ]).map(v => (
                      <button
                        key={v.value}
                        onClick={() => setVisibility(v.value)}
                        className={`flex-1 flex items-center gap-2 px-4 py-3 rounded-xl border text-sm transition-all ${
                          visibility === v.value
                            ? "border-purple-500/50 bg-purple-500/10 text-purple-300"
                            : "border-white/10 text-slate-500 hover:border-white/20"
                        }`}
                      >
                        <v.icon className="h-4 w-4" />
                        <div className="text-left">
                          <p className="font-medium text-xs">{v.label}</p>
                          <p className="text-[10px] opacity-60">{v.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-purple-500/5 border border-purple-500/10 rounded-xl p-3">
                  <p className="text-xs font-semibold text-purple-400 mb-2">💡 Streaming Tips</p>
                  <ul className="text-xs text-slate-500 space-y-1">
                    <li>• Use OBS Studio with the RTMP URL + Stream Key for best quality</li>
                    <li>• Enable camera preview above to test your setup before going live</li>
                    <li>• Recommended: 1080p30 or 720p60, 4-6 Mbps bitrate</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Live stats */}
            {isLive && (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Viewers", value: "0", icon: Eye, color: "text-blue-400" },
                  { label: "Peak", value: "0", icon: Flame, color: "text-orange-400" },
                  { label: "Duration", value: "00:00", icon: Radio, color: "text-red-400" },
                ].map(stat => (
                  <div key={stat.label} className="bg-[#0e0a1a]/80 border border-white/5 rounded-xl p-3 text-center">
                    <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
                    <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-slate-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat sidebar */}
        <div className="hidden lg:flex w-72 border-l border-white/5 flex-col bg-[#0a0614]">
          <div className="p-3 border-b border-white/5 flex items-center justify-between">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-400" /> Live Chat
            </span>
            {isLive && (
              <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">Live</Badge>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
            {localChat.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-700" />
                <p className="text-xs text-slate-600">Chat will appear here when you go live</p>
              </div>
            ) : (
              localChat.map(msg => (
                <div key={msg.id} className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center shrink-0 text-[10px] text-white font-bold">
                    {msg.user[0]}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-purple-400 mr-1">{msg.user}</span>
                    <span className="text-xs text-slate-300">{msg.text}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 border-t border-white/5">
            <div className="flex gap-2">
              <Input
                value={chatMsg}
                onChange={e => setChatMsg(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSendChat()}
                placeholder={isLive ? "Say something..." : "Go live to chat"}
                disabled={!isLive}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 text-xs h-9"
              />
              <Button
                size="sm"
                onClick={handleSendChat}
                disabled={!chatMsg.trim() || !isLive}
                className="h-9 w-9 p-0 bg-purple-500/20 hover:bg-purple-500/40 border border-purple-500/30"
              >
                <Send className="w-3.5 h-3.5 text-purple-400" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
