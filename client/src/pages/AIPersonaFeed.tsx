import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Zap, BarChart3, RefreshCw, Heart, MessageCircle, Share2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/_core/hooks/useAuth";

const TOPIC_COLORS: Record<string, string> = {
  crypto: "bg-yellow-900/50 text-yellow-300",
  defi: "bg-orange-900/50 text-orange-300",
  nft: "bg-purple-900/50 text-purple-300",
  art: "bg-pink-900/50 text-pink-300",
  gaming: "bg-green-900/50 text-green-300",
  streaming: "bg-red-900/50 text-red-300",
  charity: "bg-blue-900/50 text-blue-300",
  wellness: "bg-teal-900/50 text-teal-300",
  web3: "bg-indigo-900/50 text-indigo-300",
  tech: "bg-cyan-900/50 text-cyan-300",
};

export default function AIPersonaFeed() {
  const { user } = useAuth();
  const [selectedTopic, setSelectedTopic] = useState<string | undefined>(undefined);
  const utils = trpc.useUtils();

  const { data: feedData, isLoading: feedLoading } = trpc.aiPersonas.getBlendedFeed.useQuery(
    { limit: 30, offset: 0, topic: selectedTopic },
    { refetchInterval: 30000 },
  );

  const { data: personasData } = trpc.aiPersonas.getPersonas.useQuery();
  const { data: statsData } = trpc.aiPersonas.getStats.useQuery();

  const runCycle = trpc.aiPersonas.runCycle.useMutation({
    onSuccess: (data) => {
      toast.success(`Generated ${data.generated} new AI posts`);
      utils.aiPersonas.getBlendedFeed.invalidate();
      utils.aiPersonas.getStats.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const seedIfEmpty = trpc.aiPersonas.seedIfEmpty.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      utils.aiPersonas.getBlendedFeed.invalidate();
      utils.aiPersonas.getStats.invalidate();
    },
  });

  const topics = ["crypto", "defi", "nft", "art", "gaming", "streaming", "charity", "wellness", "web3", "tech"];

  return (
    <div className="min-h-screen bg-[#07050f] text-white p-4 md:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-900/30 rounded-xl">
            <Bot className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">AI Persona Feed</h1>
            <p className="text-gray-400 text-sm">Hybrid AI + real user content engine</p>
          </div>
        </div>
        {user && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => seedIfEmpty.mutate()}
              disabled={seedIfEmpty.isPending}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              <Sparkles className="w-4 h-4 mr-1" />
              Seed
            </Button>
            <Button
              size="sm"
              onClick={() => runCycle.mutate({ count: 3 })}
              disabled={runCycle.isPending}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${runCycle.isPending ? "animate-spin" : ""}`} />
              Generate Posts
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="feed">
        <TabsList className="bg-gray-900 border border-gray-800 mb-6">
          <TabsTrigger value="feed" className="data-[state=active]:bg-purple-600">
            <Zap className="w-4 h-4 mr-1" /> Live Feed
          </TabsTrigger>
          <TabsTrigger value="personas" className="data-[state=active]:bg-purple-600">
            <Bot className="w-4 h-4 mr-1" /> Personas
          </TabsTrigger>
          <TabsTrigger value="stats" className="data-[state=active]:bg-purple-600">
            <BarChart3 className="w-4 h-4 mr-1" /> Stats
          </TabsTrigger>
        </TabsList>

        {/* Feed Tab */}
        <TabsContent value="feed">
          {/* Topic Filter */}
          <div className="flex gap-2 flex-wrap mb-4">
            <button
              onClick={() => setSelectedTopic(undefined)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                !selectedTopic ? "bg-purple-600 text-white border-purple-500" : "bg-gray-900 text-gray-400 border-gray-700 hover:border-gray-600"
              }`}
            >
              All Topics
            </button>
            {topics.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTopic(t === selectedTopic ? undefined : t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize ${
                  selectedTopic === t ? "bg-purple-600 text-white border-purple-500" : "bg-gray-900 text-gray-400 border-gray-700 hover:border-gray-600"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {feedLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-900 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (feedData?.posts ?? []).length === 0 ? (
            <div className="text-center py-16">
              <Bot className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">No AI persona posts yet</p>
              {user && (
                <Button onClick={() => seedIfEmpty.mutate()} className="bg-purple-600 hover:bg-purple-700">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Seed AI Posts
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {(feedData?.posts ?? []).map((post) => (
                <Card key={post.id} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-lg shrink-0">
                        {post.personaAvatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span className="font-semibold text-white">{post.personaName}</span>
                          <span className="text-gray-500 text-sm">{post.personaHandle}</span>
                          <Badge className="bg-purple-900/50 text-purple-300 text-xs ml-auto">
                            <Bot className="w-3 h-3 mr-1" />
                            AI
                          </Badge>
                        </div>
                        {/* Content */}
                        <p className="text-gray-200 text-sm leading-relaxed mb-3">{post.content}</p>
                        {/* Topic + Meta */}
                        <div className="flex items-center gap-3 flex-wrap">
                          {post.topic && (
                            <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${TOPIC_COLORS[post.topic] ?? "bg-gray-800 text-gray-400"}`}>
                              {post.topic}
                            </span>
                          )}
                          <span className="text-xs text-gray-600">
                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                          </span>
                          <span className="text-xs text-gray-600">
                            Score: {Math.round(post.blendWeight * 100)}%
                          </span>
                        </div>
                        {/* Engagement */}
                        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-800">
                          <button className="flex items-center gap-1.5 text-gray-500 hover:text-red-400 transition-colors text-sm">
                            <Heart className="w-4 h-4" />
                            {post.likes}
                          </button>
                          <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-400 transition-colors text-sm">
                            <MessageCircle className="w-4 h-4" />
                            {post.comments}
                          </button>
                          <button className="flex items-center gap-1.5 text-gray-500 hover:text-green-400 transition-colors text-sm">
                            <Share2 className="w-4 h-4" />
                            {post.shares}
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Personas Tab */}
        <TabsContent value="personas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(personasData?.personas ?? []).map((persona) => (
              <Card key={persona.id} className="bg-gray-900 border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-2xl shrink-0">
                      {persona.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-white">{persona.name}</span>
                        <Badge className={`text-xs ${persona.postFrequency === "high" ? "bg-green-900/50 text-green-300" : persona.postFrequency === "medium" ? "bg-yellow-900/50 text-yellow-300" : "bg-gray-800 text-gray-400"}`}>
                          {persona.postFrequency} freq
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{persona.handle}</p>
                      <p className="text-sm text-gray-300 mb-2">{persona.bio}</p>
                      <p className="text-xs text-gray-500 italic">{persona.personality}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {persona.topics.map((t) => (
                          <span key={t} className={`text-xs px-1.5 py-0.5 rounded capitalize ${TOPIC_COLORS[t] ?? "bg-gray-800 text-gray-400"}`}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Stats Tab */}
        <TabsContent value="stats">
          {statsData ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-4 text-center">
                    <p className="text-3xl font-bold text-purple-400">{statsData.totalPosts}</p>
                    <p className="text-sm text-gray-400 mt-1">Total AI Posts</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-4 text-center">
                    <p className="text-3xl font-bold text-blue-400">{statsData.totalActivity}</p>
                    <p className="text-sm text-gray-400 mt-1">Total Activity Events</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white text-base">Posts by Persona</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {statsData.byPersona.map((p) => (
                    <div key={p.personaId} className="flex items-center gap-3 p-2 bg-gray-800 rounded-lg">
                      <span className="text-xl">{p.personaAvatar}</span>
                      <span className="text-sm text-white flex-1">{p.personaName}</span>
                      <span className="text-sm text-gray-400">{p.postCount} posts</span>
                      <span className="text-sm text-red-400 flex items-center gap-1">
                        <Heart className="w-3 h-3" />{p.totalLikes}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white text-base">Top Topics</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {statsData.topTopics.map((t) => (
                    <div key={t.topic} className={`px-3 py-1.5 rounded-full text-sm capitalize ${TOPIC_COLORS[t.topic] ?? "bg-gray-800 text-gray-400"}`}>
                      {t.topic} <span className="opacity-70">({t.count})</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No stats yet. Generate some AI posts first.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
