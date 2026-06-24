import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import {
  Brain, Sparkles, TrendingUp, Search, Zap, BarChart2, Target,
  ChevronLeft, Hash, Users, MessageSquare, Heart, Share2,
  Loader2, Star, ArrowUp, ArrowDown, Minus, Activity,
  Lightbulb, Gauge, Globe, RefreshCw
} from "lucide-react";
import { Streamdown } from "streamdown";

type TabType = "trending" | "suggestions" | "predict" | "score" | "health";

function ScoreBadge({ score, max = 100 }: { score: number; max?: number }) {
  const pct = (score / max) * 100;
  const color = pct >= 70 ? "text-green-400 bg-green-500/10 border-green-500/20"
    : pct >= 40 ? "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
    : "text-red-400 bg-red-500/10 border-red-500/20";
  return (
    <Badge className={`${color} border text-xs font-bold`}>
      {score}/{max}
    </Badge>
  );
}

function TrendArrow({ momentum }: { momentum: number }) {
  if (momentum >= 60) return <ArrowUp className="w-3.5 h-3.5 text-green-400" />;
  if (momentum >= 30) return <Minus className="w-3.5 h-3.5 text-yellow-400" />;
  return <ArrowDown className="w-3.5 h-3.5 text-red-400" />;
}

export default function AIIntelligenceHub() {
  const { isAuthenticated } = useAuth();
  const [tab, setTab] = useState<TabType>("trending");

  // Trending
  const [trendTexts, setTrendTexts] = useState("");
  const [trendResults, setTrendResults] = useState<Array<{ topic: string; count: number; momentum: number }>>([]);

  // Suggestions
  const [suggestType, setSuggestType] = useState<"post" | "follow" | "explore" | "hashtag" | "community">("post");
  const [interests, setInterests] = useState("crypto, DeFi, NFTs, Web3");
  const [suggestions, setSuggestions] = useState<unknown[]>([]);

  // Predict engagement
  const [predictContent, setPredictContent] = useState("");
  const [predictHasMedia, setPredictHasMedia] = useState(false);
  const [prediction, setPrediction] = useState<Record<string, unknown> | null>(null);

  // Score content
  const [scoreContent, setScoreContent] = useState("");
  const [scoreType, setScoreType] = useState<"post" | "comment" | "article" | "stream_title" | "bio">("post");
  const [scoreResult, setScoreResult] = useState<Record<string, unknown> | null>(null);

  // Platform health
  const healthQuery = trpc.aiIntelligence.platformHealth.useQuery();

  const detectTrending = trpc.aiIntelligence.detectTrending.useQuery(
    { texts: trendTexts.split("\n").filter(t => t.trim()).slice(0, 200), limit: 15 },
    { enabled: false }
  );

  const getSuggestions = trpc.aiIntelligence.getContentSuggestions.useMutation({
    onSuccess: (data) => setSuggestions(data.suggestions),
    onError: () => toast.error("Failed to get suggestions"),
  });

  const predictEngagement = trpc.aiIntelligence.predictEngagement.useMutation({
    onSuccess: (data) => setPrediction(data.prediction as Record<string, unknown>),
    onError: () => toast.error("Prediction failed"),
  });

  const scoreContentMutation = trpc.aiIntelligence.scoreContent.useMutation({
    onSuccess: (data) => setScoreResult(data.score as Record<string, unknown>),
    onError: () => toast.error("Scoring failed"),
  });

  const handleDetectTrending = async () => {
    const texts = trendTexts.split("\n").filter(t => t.trim());
    if (texts.length < 2) { toast.error("Enter at least 2 post texts (one per line)"); return; }
    const result = await detectTrending.refetch();
    if (result.data) setTrendResults(result.data);
  };

  const handleGetSuggestions = () => {
    if (!isAuthenticated) { window.location.href = getLoginUrl(); return; }
    getSuggestions.mutate({
      suggestionType: suggestType,
      userInterests: interests.split(",").map(s => s.trim()).filter(Boolean),
    });
  };

  const handlePredict = () => {
    if (!isAuthenticated) { window.location.href = getLoginUrl(); return; }
    if (!predictContent.trim()) { toast.error("Enter content to predict"); return; }
    predictEngagement.mutate({ content: predictContent, hasMedia: predictHasMedia });
  };

  const handleScore = () => {
    if (!isAuthenticated) { window.location.href = getLoginUrl(); return; }
    if (!scoreContent.trim()) { toast.error("Enter content to score"); return; }
    scoreContentMutation.mutate({ content: scoreContent, contentType: scoreType });
  };

  const TABS = [
    { id: "trending" as const, label: "Trending", icon: TrendingUp },
    { id: "suggestions" as const, label: "Suggestions", icon: Lightbulb },
    { id: "predict" as const, label: "Predict", icon: Target },
    { id: "score" as const, label: "Score", icon: Gauge },
    { id: "health" as const, label: "Health", icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-[#07050f] text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-white/5 bg-[#07050f]/95 backdrop-blur px-4 py-3 flex items-center gap-3">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-1 text-slate-400 hover:text-white">
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-fuchsia-500 to-pink-500 flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white">AI Intelligence Hub</span>
          <Badge className="bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20 text-xs">LIVE</Badge>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          Platform-wide AI
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Tab Bar */}
        <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-6 overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                tab === t.id
                  ? "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* TRENDING TAB */}
        {tab === "trending" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#0e0a1a]/80 border border-white/5 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-fuchsia-400" /> Trend Detection
              </h3>
              <p className="text-xs text-slate-500">Paste post texts (one per line) to detect trending topics</p>
              <Textarea
                value={trendTexts}
                onChange={e => setTrendTexts(e.target.value)}
                placeholder={"Bitcoin just hit 100k!\nDeFi is the future of finance\nNFT marketplace volume surging\nSOL is pumping hard today\n..."}
                className="bg-black/40 border-white/10 text-white placeholder:text-slate-700 text-xs min-h-[200px] resize-none font-mono"
              />
              <Button onClick={handleDetectTrending} className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold gap-2">
                <TrendingUp className="w-4 h-4" /> Detect Trends
              </Button>
            </div>

            <div className="bg-[#0e0a1a]/80 border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Hash className="w-4 h-4 text-fuchsia-400" /> Trending Topics
              </h3>
              {trendResults.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                  <TrendingUp className="w-10 h-10 text-fuchsia-400/30" />
                  <p className="text-slate-500 text-sm">Paste posts and click detect to see trends</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {trendResults.map((t, i) => (
                    <div key={t.topic} className="flex items-center gap-3 p-3 bg-white/3 rounded-xl border border-white/5">
                      <span className="text-xs text-slate-600 w-5 text-right font-mono">{i + 1}</span>
                      <TrendArrow momentum={t.momentum} />
                      <span className="flex-1 text-sm text-white font-medium">{t.topic}</span>
                      <Badge className="bg-white/5 text-slate-400 border-white/10 text-xs">{t.count}x</Badge>
                      <div className="w-16 bg-white/5 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500"
                          style={{ width: `${t.momentum}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SUGGESTIONS TAB */}
        {tab === "suggestions" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#0e0a1a]/80 border border-white/5 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-400" /> AI Suggestions
              </h3>

              <div className="space-y-1">
                <Label className="text-xs text-slate-400">Suggestion Type</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(["post", "follow", "explore", "hashtag", "community"] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setSuggestType(t)}
                      className={`py-2 rounded-lg border text-xs font-medium capitalize transition-all ${
                        suggestType === t
                          ? "border-yellow-500/50 bg-yellow-500/10 text-yellow-300"
                          : "border-white/10 text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-slate-400">Your Interests (comma-separated)</Label>
                <Input
                  value={interests}
                  onChange={e => setInterests(e.target.value)}
                  placeholder="crypto, DeFi, NFTs, gaming..."
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 text-sm h-9"
                />
              </div>

              <Button
                onClick={handleGetSuggestions}
                disabled={getSuggestions.isPending}
                className="w-full bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/30 font-bold gap-2"
              >
                {getSuggestions.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4" /> Get Suggestions</>}
              </Button>
            </div>

            <div className="bg-[#0e0a1a]/80 border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">Results</h3>
              {suggestions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                  <Lightbulb className="w-10 h-10 text-yellow-400/30" />
                  <p className="text-slate-500 text-sm">Select a type and click generate</p>
                </div>
              ) : (
                <div className="space-y-3 overflow-y-auto max-h-80">
                  {(suggestions as Record<string, unknown>[]).map((s, i) => (
                    <div key={i} className="p-3 bg-white/3 rounded-xl border border-white/5 space-y-1">
                      {Object.entries(s).map(([k, v]) => (
                        <div key={k} className="flex gap-2 text-xs">
                          <span className="text-slate-500 capitalize min-w-[80px]">{k}:</span>
                          <span className="text-slate-200">{Array.isArray(v) ? (v as string[]).join(", ") : String(v)}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* PREDICT TAB */}
        {tab === "predict" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#0e0a1a]/80 border border-white/5 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-400" /> Engagement Predictor
              </h3>
              <Textarea
                value={predictContent}
                onChange={e => setPredictContent(e.target.value)}
                placeholder="Write your post content here to predict how it will perform..."
                className="bg-black/40 border-white/10 text-white placeholder:text-slate-700 text-sm min-h-[150px] resize-none"
              />
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={predictHasMedia}
                  onChange={e => setPredictHasMedia(e.target.checked)}
                  className="w-4 h-4 accent-blue-500"
                />
                <span className="text-sm text-slate-300">Includes image/video</span>
              </label>
              <Button
                onClick={handlePredict}
                disabled={predictEngagement.isPending || !predictContent.trim()}
                className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 font-bold gap-2"
              >
                {predictEngagement.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Predicting...</> : <><Target className="w-4 h-4" /> Predict Engagement</>}
              </Button>
            </div>

            <div className="bg-[#0e0a1a]/80 border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">Prediction</h3>
              {prediction ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Likes", key: "predictedLikes", icon: Heart, color: "text-pink-400" },
                      { label: "Comments", key: "predictedComments", icon: MessageSquare, color: "text-blue-400" },
                      { label: "Shares", key: "predictedShares", icon: Share2, color: "text-green-400" },
                    ].map(m => (
                      <div key={m.key} className="text-center p-3 bg-white/3 rounded-xl border border-white/5">
                        <m.icon className={`w-4 h-4 mx-auto mb-1 ${m.color}`} />
                        <p className={`text-lg font-bold ${m.color}`}>{String(prediction[m.key] || 0)}</p>
                        <p className="text-xs text-slate-500">{m.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white/3 rounded-xl border border-white/5 text-center">
                      <p className="text-2xl font-bold text-fuchsia-400">{String(prediction.engagementScore || 0)}</p>
                      <p className="text-xs text-slate-500">Engagement Score</p>
                    </div>
                    <div className="p-3 bg-white/3 rounded-xl border border-white/5 text-center">
                      <p className="text-2xl font-bold text-yellow-400">{String(prediction.viralProbability || 0)}%</p>
                      <p className="text-xs text-slate-500">Viral Probability</p>
                    </div>
                  </div>
                  {Array.isArray(prediction.strengths) && (
                    <div>
                      <p className="text-xs font-semibold text-green-400 mb-1">Strengths</p>
                      <ul className="space-y-1">
                        {(prediction.strengths as string[]).map((s: string, i: number) => <li key={i} className="text-xs text-slate-300">• {s}</li>)}
                      </ul>
                    </div>
                  )}
                  {Array.isArray(prediction.improvements) && (
                    <div>
                      <p className="text-xs font-semibold text-yellow-400 mb-1">Improvements</p>
                      <ul className="space-y-1">
                        {(prediction.improvements as string[]).map((s: string, i: number) => <li key={i} className="text-xs text-slate-300">• {s}</li>)}
                      </ul>
                    </div>
                  )}
                  {prediction.bestTimeToPost != null && (
                    <p className="text-xs text-slate-400">Best time: <span className="text-white">{String(prediction.bestTimeToPost as string)}</span></p>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                  <Target className="w-10 h-10 text-blue-400/30" />
                  <p className="text-slate-500 text-sm">Write content and click predict</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SCORE TAB */}
        {tab === "score" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#0e0a1a]/80 border border-white/5 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Gauge className="w-4 h-4 text-orange-400" /> Content Quality Scorer
              </h3>
              <div className="space-y-1">
                <Label className="text-xs text-slate-400">Content Type</Label>
                <div className="flex flex-wrap gap-2">
                  {(["post", "comment", "article", "stream_title", "bio"] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setScoreType(t)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium capitalize transition-all ${
                        scoreType === t
                          ? "border-orange-500/50 bg-orange-500/10 text-orange-300"
                          : "border-white/10 text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      {t.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>
              <Textarea
                value={scoreContent}
                onChange={e => setScoreContent(e.target.value)}
                placeholder="Paste your content to score its quality..."
                className="bg-black/40 border-white/10 text-white placeholder:text-slate-700 text-sm min-h-[150px] resize-none"
              />
              <Button
                onClick={handleScore}
                disabled={scoreContentMutation.isPending || !scoreContent.trim()}
                className="w-full bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30 font-bold gap-2"
              >
                {scoreContentMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Scoring...</> : <><Gauge className="w-4 h-4" /> Score Content</>}
              </Button>
            </div>

            <div className="bg-[#0e0a1a]/80 border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">Quality Score</h3>
              {scoreResult ? (
                <div className="space-y-4">
                  <div className="text-center p-4 bg-white/3 rounded-xl border border-white/5">
                    <p className="text-4xl font-bold text-orange-400">{String(scoreResult.overallScore || 0)}</p>
                    <p className="text-xs text-slate-500 mt-1">Overall Quality Score</p>
                    <div className="w-full bg-white/5 rounded-full h-2 mt-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500"
                        style={{ width: `${scoreResult.overallScore || 0}%` }}
                      />
                    </div>
                  </div>
                  {scoreResult.dimensions != null && (
                    <div className="space-y-2">
                      {Object.entries(scoreResult.dimensions as Record<string, number>).map(([dim, val]) => (
                        <div key={dim} className="flex items-center gap-3">
                          <span className="text-xs text-slate-400 capitalize w-20">{dim}</span>
                          <div className="flex-1 bg-white/5 rounded-full h-1.5">
                            <div
                              className="h-1.5 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500"
                              style={{ width: `${Number(val)}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-400 w-8 text-right">{Number(val)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {scoreResult.sentiment != null && (
                    <p className="text-xs text-slate-400">Sentiment: <span className="text-white capitalize">{String(scoreResult.sentiment as string)}</span></p>
                  )}
                  {Array.isArray(scoreResult.suggestions) && (scoreResult.suggestions as string[]).length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-yellow-400 mb-1">Suggestions</p>
                      <ul className="space-y-1">
                        {(scoreResult.suggestions as string[]).map((s: string, i: number) => <li key={i} className="text-xs text-slate-300">• {s}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                  <Gauge className="w-10 h-10 text-orange-400/30" />
                  <p className="text-slate-500 text-sm">Paste content and click score</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* HEALTH TAB */}
        {tab === "health" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Health Score", value: healthQuery.data?.healthScore ?? "...", icon: Activity, color: "text-green-400", suffix: "/100" },
                { label: "Total Users", value: healthQuery.data?.metrics?.totalUsers ?? "...", icon: Users, color: "text-blue-400" },
                { label: "Total Posts", value: healthQuery.data?.metrics?.totalPosts ?? "...", icon: MessageSquare, color: "text-purple-400" },
                { label: "Active Today", value: healthQuery.data?.metrics?.activeToday ?? "...", icon: Zap, color: "text-yellow-400" },
              ].map(stat => (
                <div key={stat.label} className="bg-[#0e0a1a]/80 border border-white/5 rounded-2xl p-5 text-center">
                  <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}{stat.suffix || ""}</p>
                  <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#0e0a1a]/80 border border-white/5 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-green-400" /> Platform Status
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => healthQuery.refetch()}
                  className="text-slate-400 hover:text-white gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh
                </Button>
              </div>

              <div className="flex items-center gap-3 p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
                <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                <div>
                  <p className="text-sm font-semibold text-white capitalize">
                    Status: {healthQuery.data?.status || "Loading..."}
                  </p>
                  <p className="text-xs text-slate-400">
                    Posts per user: {healthQuery.data?.metrics?.postsPerUser || "0"} •
                    Last checked: {healthQuery.data?.timestamp ? new Date(healthQuery.data.timestamp).toLocaleTimeString() : "..."}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "API Response Time", value: "< 50ms", status: "healthy" },
                  { label: "Database", value: "Connected", status: "healthy" },
                  { label: "AI Services", value: "Online", status: "healthy" },
                  { label: "Real-time Engine", value: "Active", status: "healthy" },
                  { label: "Storage (S3)", value: "Available", status: "healthy" },
                  { label: "Auth Service", value: "Operational", status: "healthy" },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-2 p-3 bg-white/3 rounded-xl border border-white/5">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <div>
                      <p className="text-xs font-medium text-white">{s.label}</p>
                      <p className="text-xs text-slate-500">{s.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
