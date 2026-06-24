import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Calendar, Clock, ArrowLeft, Plus, Trash2, Edit3,
  Image, Video, FileText, Send, CheckCircle, AlertCircle,
  Instagram, Twitter, Globe, Zap, Eye, BarChart3
} from "lucide-react";

interface ScheduledPost {
  id: string;
  content: string;
  mediaType: "text" | "image" | "video";
  platforms: string[];
  scheduledAt: Date;
  status: "scheduled" | "published" | "failed" | "draft";
  views?: number;
  engagement?: number;
}

const DEMO_QUEUE: ScheduledPost[] = [
  {
    id: "1",
    content: "🚀 Big announcement coming tomorrow! Stay tuned for something that will change the game. #SKY444 #Web3",
    mediaType: "text",
    platforms: ["shadowchat", "twitter"],
    scheduledAt: new Date(Date.now() + 3600000 * 2),
    status: "scheduled",
  },
  {
    id: "2",
    content: "New tutorial: How to stake SKY444 tokens and earn 24% APY. Full guide dropping at 3PM EST 🔥",
    mediaType: "image",
    platforms: ["shadowchat", "instagram"],
    scheduledAt: new Date(Date.now() + 3600000 * 5),
    status: "scheduled",
  },
  {
    id: "3",
    content: "Going live in 30 minutes! Crypto market breakdown + SKY444 price analysis. Don't miss it 📈",
    mediaType: "video",
    platforms: ["shadowchat"],
    scheduledAt: new Date(Date.now() - 3600000 * 2),
    status: "published",
    views: 4820,
    engagement: 312,
  },
  {
    id: "4",
    content: "Draft: Community AMA session recap — top questions answered by the team...",
    mediaType: "text",
    platforms: ["shadowchat"],
    scheduledAt: new Date(Date.now() + 3600000 * 24),
    status: "draft",
  },
];

const PLATFORMS = [
  { id: "shadowchat", label: "ShadowChat", icon: "🌑", color: "purple" },
  { id: "twitter", label: "Twitter/X", icon: "𝕏", color: "blue" },
  { id: "instagram", label: "Instagram", icon: "📸", color: "pink" },
  { id: "tiktok", label: "TikTok", icon: "🎵", color: "red" },
];

const statusConfig = {
  scheduled: { label: "Scheduled", color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: Clock },
  published: { label: "Published", color: "bg-green-500/20 text-green-400 border-green-500/30", icon: CheckCircle },
  failed: { label: "Failed", color: "bg-red-500/20 text-red-400 border-red-500/30", icon: AlertCircle },
  draft: { label: "Draft", color: "bg-gray-500/20 text-gray-400 border-gray-500/30", icon: Edit3 },
};

export default function ContentScheduler() {
  const { user } = useAuth();
  const [queue, setQueue] = useState<ScheduledPost[]>(DEMO_QUEUE);
  const [content, setContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["shadowchat"]);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [mediaType, setMediaType] = useState<"text" | "image" | "video">("text");
  const [activeTab, setActiveTab] = useState("queue");

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleSchedule = () => {
    if (!content.trim()) { toast.error("Add some content first"); return; }
    if (!scheduledDate || !scheduledTime) { toast.error("Set a date and time"); return; }
    if (selectedPlatforms.length === 0) { toast.error("Select at least one platform"); return; }

    const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`);
    if (scheduledAt <= new Date()) { toast.error("Scheduled time must be in the future"); return; }

    const newPost: ScheduledPost = {
      id: Math.random().toString(36).slice(2),
      content,
      mediaType,
      platforms: selectedPlatforms,
      scheduledAt,
      status: "scheduled",
    };

    setQueue(prev => [newPost, ...prev]);
    setContent("");
    setScheduledDate("");
    setScheduledTime("");
    toast.success("Post scheduled successfully! 📅");
    setActiveTab("queue");
  };

  const handleDelete = (id: string) => {
    setQueue(prev => prev.filter(p => p.id !== id));
    toast.success("Post removed from queue");
  };

  const scheduledCount = queue.filter(p => p.status === "scheduled").length;
  const publishedCount = queue.filter(p => p.status === "published").length;
  const totalViews = queue.filter(p => p.status === "published").reduce((a, p) => a + (p.views || 0), 0);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/creator">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
          </Link>
          <Calendar className="w-5 h-5 text-blue-400" />
          <h1 className="text-lg font-bold">Content Scheduler</h1>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
            {scheduledCount} queued
          </Badge>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Scheduled", value: scheduledCount, icon: Clock, color: "text-blue-400", bg: "bg-blue-500/10" },
            { label: "Published", value: publishedCount, icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/10" },
            { label: "Total Views", value: totalViews.toLocaleString(), icon: Eye, color: "text-purple-400", bg: "bg-purple-500/10" },
          ].map(stat => (
            <Card key={stat.label} className={`${stat.bg} border-white/10`}>
              <CardContent className="p-4 flex items-center gap-3">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                <div>
                  <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white/5 border border-white/10 mb-4">
            <TabsTrigger value="queue" className="data-[state=active]:bg-purple-600">
              <Calendar className="w-3 h-3 mr-1" /> Queue ({queue.length})
            </TabsTrigger>
            <TabsTrigger value="create" className="data-[state=active]:bg-purple-600">
              <Plus className="w-3 h-3 mr-1" /> Schedule Post
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">
              <BarChart3 className="w-3 h-3 mr-1" /> Analytics
            </TabsTrigger>
          </TabsList>

          {/* Queue */}
          <TabsContent value="queue">
            <div className="space-y-3">
              {queue.length === 0 ? (
                <Card className="bg-black/40 border-white/10">
                  <CardContent className="p-12 text-center">
                    <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No scheduled posts yet</p>
                    <Button
                      onClick={() => setActiveTab("create")}
                      className="mt-4 bg-purple-600 hover:bg-purple-500"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Schedule your first post
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                queue.map(post => {
                  const cfg = statusConfig[post.status];
                  const StatusIcon = cfg.icon;
                  return (
                    <Card key={post.id} className="bg-black/40 border-white/10 hover:border-white/20 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <Badge className={`text-xs ${cfg.color}`}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {cfg.label}
                              </Badge>
                              {post.platforms.map(p => {
                                const plt = PLATFORMS.find(pl => pl.id === p);
                                return plt ? (
                                  <Badge key={p} className="text-xs bg-white/10 text-gray-300 border-white/20">
                                    {plt.icon} {plt.label}
                                  </Badge>
                                ) : null;
                              })}
                              <Badge className="text-xs bg-white/5 text-gray-400 border-white/10">
                                {post.mediaType === "text" ? <FileText className="w-3 h-3 mr-1" /> :
                                 post.mediaType === "image" ? <Image className="w-3 h-3 mr-1" /> :
                                 <Video className="w-3 h-3 mr-1" />}
                                {post.mediaType}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-300 line-clamp-2">{post.content}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {post.scheduledAt.toLocaleString()}
                              </span>
                              {post.views !== undefined && (
                                <span className="flex items-center gap-1 text-green-400">
                                  <Eye className="w-3 h-3" /> {post.views.toLocaleString()} views
                                </span>
                              )}
                              {post.engagement !== undefined && (
                                <span className="flex items-center gap-1 text-blue-400">
                                  <Zap className="w-3 h-3" /> {post.engagement} engagements
                                </span>
                              )}
                            </div>
                          </div>
                          {post.status !== "published" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(post.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          {/* Create */}
          <TabsContent value="create">
            <Card className="bg-black/40 border-white/10">
              <CardHeader>
                <CardTitle className="text-sm">Schedule a New Post</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Media type */}
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">Content Type</label>
                  <div className="flex gap-2">
                    {(["text", "image", "video"] as const).map(type => (
                      <button
                        key={type}
                        onClick={() => setMediaType(type)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                          mediaType === type
                            ? "border-purple-500 bg-purple-500/20 text-purple-300"
                            : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20"
                        }`}
                      >
                        {type === "text" ? <FileText className="w-4 h-4" /> :
                         type === "image" ? <Image className="w-4 h-4" /> :
                         <Video className="w-4 h-4" />}
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">Post Content</label>
                  <Textarea
                    placeholder="What do you want to share? Use #hashtags and @mentions..."
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    rows={4}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/50 resize-none"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">
                      {content.length}/500 characters
                    </span>
                    <span className="text-xs text-gray-500">
                      {content.split(" ").filter(w => w.startsWith("#")).length} hashtags
                    </span>
                  </div>
                </div>

                {/* Platforms */}
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">Publish To</label>
                  <div className="grid grid-cols-2 gap-2">
                    {PLATFORMS.map(platform => (
                      <button
                        key={platform.id}
                        onClick={() => togglePlatform(platform.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-sm transition-all ${
                          selectedPlatforms.includes(platform.id)
                            ? "border-purple-500/50 bg-purple-500/10 text-white"
                            : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20"
                        }`}
                      >
                        <span className="text-lg">{platform.icon}</span>
                        <span className="font-medium">{platform.label}</span>
                        {selectedPlatforms.includes(platform.id) && (
                          <CheckCircle className="w-4 h-4 text-purple-400 ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400 mb-2 block">Date</label>
                    <Input
                      type="date"
                      value={scheduledDate}
                      onChange={e => setScheduledDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="bg-white/5 border-white/10 text-white focus:border-purple-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-2 block">Time</label>
                    <Input
                      type="time"
                      value={scheduledTime}
                      onChange={e => setScheduledTime(e.target.value)}
                      className="bg-white/5 border-white/10 text-white focus:border-purple-500/50"
                    />
                  </div>
                </div>

                {/* Best times hint */}
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <p className="text-xs text-blue-300 flex items-center gap-2">
                    <Zap className="w-3 h-3" />
                    <strong>Best times to post:</strong> 9AM, 12PM, 7PM EST — highest engagement windows
                  </p>
                </div>

                <Button
                  onClick={handleSchedule}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl"
                >
                  <Send className="w-4 h-4 mr-2" /> Schedule Post
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-black/40 border-white/10">
                <CardHeader><CardTitle className="text-sm">Best Performing Posts</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {queue.filter(p => p.status === "published").map(post => (
                    <div key={post.id} className="p-3 rounded-lg bg-white/5 space-y-1">
                      <p className="text-xs text-gray-300 line-clamp-1">{post.content}</p>
                      <div className="flex gap-3 text-xs">
                        <span className="text-green-400">👁 {post.views?.toLocaleString()}</span>
                        <span className="text-blue-400">⚡ {post.engagement}</span>
                        <span className="text-gray-500">{post.scheduledAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                  {queue.filter(p => p.status === "published").length === 0 && (
                    <p className="text-gray-500 text-sm text-center py-4">No published posts yet</p>
                  )}
                </CardContent>
              </Card>
              <Card className="bg-black/40 border-white/10">
                <CardHeader><CardTitle className="text-sm">Platform Performance</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {PLATFORMS.map(platform => {
                    const count = queue.filter(p => p.platforms.includes(platform.id)).length;
                    return (
                      <div key={platform.id} className="flex items-center gap-3">
                        <span className="text-lg">{platform.icon}</span>
                        <div className="flex-1">
                          <div className="flex justify-between text-xs mb-1">
                            <span>{platform.label}</span>
                            <span className="text-gray-400">{count} posts</span>
                          </div>
                          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                              style={{ width: `${Math.min(100, (count / Math.max(1, queue.length)) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
