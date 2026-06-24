import { useState, useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp, TrendingDown, Users, Eye, DollarSign, Heart,
  Star, Award, BarChart3, ArrowUpRight, ArrowDownRight, Play,
  MessageSquare, Share2, Zap, Crown, Target, Calendar
} from "lucide-react";

function StatCard({ label, value, change, icon: Icon, color = "text-cyan-400", prefix = "", suffix = "" }: {
  label: string; value: string | number; change?: number; icon: any; color?: string; prefix?: string; suffix?: string;
}) {
  const isPositive = (change ?? 0) >= 0;
  return (
    <Card className="bg-gray-900/60 border-gray-700/50 hover:border-cyan-500/30 transition-all">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2 rounded-lg bg-gray-800/80 ${color}`}>
            <Icon className="w-4 h-4" />
          </div>
          {change !== undefined && (
            <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? "text-purple-400" : "text-red-400"}`}>
              {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {Math.abs(change)}%
            </div>
          )}
        </div>
        <div className="text-2xl font-bold text-white mb-1">
          {prefix}{typeof value === "number" ? value.toLocaleString() : value}{suffix}
        </div>
        <div className="text-xs text-gray-400">{label}</div>
      </CardContent>
    </Card>
  );
}

function MilestoneCard({ milestone }: { milestone: any }) {
  const progress = milestone.currentValue && milestone.targetValue
    ? Math.min(100, Math.round((milestone.currentValue / milestone.targetValue) * 100))
    : milestone.progress || 0;
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-800/40 rounded-xl border border-gray-700/30 hover:border-cyan-500/20 transition-all">
      <div className="text-2xl">{milestone.icon || "🏆"}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-white truncate">{milestone.title || milestone.name}</span>
          <span className="text-xs text-cyan-400 ml-2 shrink-0">{progress}%</span>
        </div>
        <Progress value={progress} className="h-1.5 bg-gray-700" />
        {milestone.reward && (
          <div className="text-xs text-yellow-400 mt-1">Reward: {milestone.reward}</div>
        )}
      </div>
      {milestone.completed && (
        <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30 shrink-0">Done</Badge>
      )}
    </div>
  );
}


function generateChartData(days: number) {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    return {
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      followers: Math.floor(800 + i * 12 + Math.random() * 30),
      views: Math.floor(1200 + i * 45 + Math.random() * 200),
      revenue: Math.floor(20 + i * 2.5 + Math.random() * 15),
      likes: Math.floor(300 + i * 8 + Math.random() * 50),
    };
  });
}

export default function CreatorAnalytics() {
  const { user } = useAuth();
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("30d");

  const { data: analytics, isLoading: analyticsLoading } = trpc.creator.analytics.useQuery(undefined, { enabled: !!user });
  const { data: earnings } = trpc.creator.earnings.useQuery(undefined, { enabled: !!user });
  const { data: milestones } = trpc.creator.milestones.useQuery(undefined, { enabled: !!user });
  const { data: fanScores } = trpc.creator.fanScores.useQuery(undefined, { enabled: !!user });
  const { data: forecast } = trpc.creator.revenueForecasting.useQuery(undefined, { enabled: !!user });
  const { data: subscribers } = trpc.creator.mySubscriptions.useQuery(undefined, { enabled: !!user });
  const chartData = useMemo(() => generateChartData(period === "7d" ? 7 : period === "30d" ? 30 : 90), [period]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Crown className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Creator Analytics</h2>
          <p className="text-gray-400 mb-4">Sign in to view your creator analytics</p>
          <Link href="/"><Button className="bg-cyan-500 hover:bg-cyan-600">Sign In</Button></Link>
        </div>
      </div>
    );
  }

  const a = analytics as any;
  const e = earnings as any;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <PageHeader
        title="Creator Analytics"
        subtitle="Track your growth, earnings, and audience insights"
        backHref="/creator-studio"
        actions={
          <div className="flex gap-2">
            {(["7d","30d","90d"] as const).map(p => (
              <Button
                key={p}
                variant={period === p ? "default" : "outline"}
                size="sm"
                onClick={() => setPeriod(p)}
                className={period === p ? "bg-cyan-500 hover:bg-cyan-600 text-white" : "border-gray-600 text-gray-300 hover:bg-gray-800"}
              >
                {p}
              </Button>
            ))}
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Views" value={a?.totalViews || a?.views || 0} change={12} icon={Eye} color="text-blue-400" />
          <StatCard label="Followers" value={a?.followers || a?.followerCount || 0} change={8} icon={Users} color="text-purple-400" />
          <StatCard label="Total Revenue" value={e?.totalRevenue || 0} change={23} icon={DollarSign} color="text-purple-400" prefix="$" />
          <StatCard label="Engagement Rate" value={a?.engagementRate || 4.2} change={-2} icon={Heart} color="text-pink-400" suffix="%" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Subscribers" value={e?.subscriptions || subscribers?.length || 0} change={15} icon={Crown} color="text-yellow-400" />
          <StatCard label="Tip Revenue" value={e?.tipRevenue || 0} change={31} icon={Zap} color="text-orange-400" prefix="$" />
          <StatCard label="Sub Revenue" value={e?.subRevenue || 0} change={18} icon={Star} color="text-cyan-400" prefix="$" />
          <StatCard label="Avg Rating" value={a?.avgRating || 4.8} icon={Award} color="text-emerald-400" suffix="★" />
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-gray-900/60 border border-gray-700/50 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">Overview</TabsTrigger>
            <TabsTrigger value="audience" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">Audience</TabsTrigger>
            <TabsTrigger value="revenue" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">Revenue</TabsTrigger>
            <TabsTrigger value="milestones" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">Milestones</TabsTrigger>
            <TabsTrigger value="fans" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">Top Fans</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-gray-900/60 border-gray-700/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-gray-300 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    Content Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { label: "Posts Published", value: a?.postsCount || a?.posts || 0, icon: MessageSquare, color: "text-blue-400" },
                    { label: "Total Likes", value: a?.totalLikes || a?.likes || 0, icon: Heart, color: "text-pink-400" },
                    { label: "Total Comments", value: a?.totalComments || a?.comments || 0, icon: MessageSquare, color: "text-purple-400" },
                    { label: "Total Shares", value: a?.totalShares || 0, icon: Share2, color: "text-purple-400" },
                    { label: "Video Views", value: a?.videoViews || 0, icon: Play, color: "text-orange-400" },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-800/50 last:border-0">
                      <div className="flex items-center gap-2">
                        <item.icon className={`w-4 h-4 ${item.color}`} />
                        <span className="text-sm text-gray-300">{item.label}</span>
                      </div>
                      <span className="text-sm font-semibold text-white">{Number(item.value).toLocaleString()}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-gray-900/60 border-gray-700/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-gray-300 flex items-center gap-2">
                    <Target className="w-4 h-4 text-cyan-400" />
                    Revenue Forecast
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {forecast ? (
                    <>
                      <div className="text-center py-4">
                        <div className="text-3xl font-bold text-purple-400">
                          ${Number((forecast as any).projected30Day || (forecast as any).monthly || 0).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">Projected 30-day revenue</div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                          <div className="text-lg font-bold text-cyan-400">${Number((forecast as any).subscriptionRevenue || 0).toFixed(2)}</div>
                          <div className="text-xs text-gray-400">Subscriptions</div>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                          <div className="text-lg font-bold text-yellow-400">${Number((forecast as any).tipRevenue || 0).toFixed(2)}</div>
                          <div className="text-xs text-gray-400">Tips</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Forecast data loading...</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="audience" className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="bg-gray-900/60 border-gray-700/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-gray-300">Follower Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-400 mb-1">
                    {Number(a?.followers || 0).toLocaleString()}
                  </div>
                  <div className="text-xs text-purple-400 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +{a?.followerGrowth || 8}% this month
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">New this week</span>
                      <span className="text-white">{a?.newFollowersWeek || 0}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">New this month</span>
                      <span className="text-white">{a?.newFollowersMonth || 0}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Retention rate</span>
                      <span className="text-white">{a?.retentionRate || 87}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/60 border-gray-700/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-gray-300">Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-pink-400 mb-1">
                    {a?.engagementRate || 4.2}%
                  </div>
                  <div className="text-xs text-gray-400 mb-4">Average engagement rate</div>
                  <div className="space-y-2">
                    {[
                      { label: "Likes/Post", value: a?.avgLikesPerPost || 0 },
                      { label: "Comments/Post", value: a?.avgCommentsPerPost || 0 },
                      { label: "Shares/Post", value: a?.avgSharesPerPost || 0 },
                    ].map(item => (
                      <div key={item.label} className="flex justify-between text-xs">
                        <span className="text-gray-400">{item.label}</span>
                        <span className="text-white">{Number(item.value).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/60 border-gray-700/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-gray-300">Reach</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-400 mb-1">
                    {Number(a?.totalReach || a?.totalViews || 0).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400 mb-4">Total content reach</div>
                  <div className="space-y-2">
                    {[
                      { label: "Organic", value: `${a?.organicReach || 72}%`, color: "text-purple-400" },
                      { label: "Viral", value: `${a?.viralReach || 18}%`, color: "text-purple-400" },
                      { label: "Paid", value: `${a?.paidReach || 10}%`, color: "text-yellow-400" },
                    ].map(item => (
                      <div key={item.label} className="flex justify-between text-xs">
                        <span className="text-gray-400">{item.label}</span>
                        <span className={item.color}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-4">
            <Card className="bg-gray-900/60 border-gray-700/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-300 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-yellow-400" />
                  Daily Revenue ({period})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 10 }} tickLine={false} interval="preserveStartEnd" />
                    <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", fontSize: 12 }} formatter={(v: any) => [`$${v}`, "Revenue"]} />
                    <Bar dataKey="revenue" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Revenue ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-gray-900/60 border-gray-700/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-gray-300 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-purple-400" />
                    Revenue Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: "Subscriptions", value: e?.subRevenue || 0, color: "bg-cyan-500", pct: 45 },
                    { label: "Tips & Gifts", value: e?.tipRevenue || 0, color: "bg-yellow-500", pct: 30 },
                    { label: "Content Sales", value: 0, color: "bg-purple-500", pct: 15 },
                    { label: "Affiliate", value: 0, color: "bg-purple-600", pct: 10 },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-300">{item.label}</span>
                        <span className="text-white font-medium">${Number(item.value).toFixed(2)}</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full transition-all`} style={{ width: `${item.pct}%` }} />
                      </div>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-gray-700/50 flex justify-between">
                    <span className="text-sm text-gray-300 font-medium">Total Revenue</span>
                    <span className="text-sm font-bold text-purple-400">${Number(e?.totalRevenue || 0).toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/60 border-gray-700/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-gray-300">Recent Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  {e?.recentTips?.length > 0 ? (
                    <div className="space-y-3">
                      {e.recentTips.slice(0, 6).map((tip: any, i: number) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-gray-800/50 last:border-0">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-xs font-bold text-white">
                              {(tip.senderName || "A")[0].toUpperCase()}
                            </div>
                            <div>
                              <div className="text-xs font-medium text-white">{tip.senderName || "Anonymous"}</div>
                              {tip.message && <div className="text-xs text-gray-400 truncate max-w-[120px]">{tip.message}</div>}
                            </div>
                          </div>
                          <span className="text-xs font-bold text-yellow-400">+{tip.amount} SKY</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No tips yet</p>
                      <p className="text-xs mt-1">Share your content to start earning</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="milestones" className="space-y-3">
            <Card className="bg-gray-900/60 border-gray-700/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-300 flex items-center gap-2">
                  <Award className="w-4 h-4 text-yellow-400" />
                  Creator Milestones
                </CardTitle>
              </CardHeader>
              <CardContent>
                {milestones && (milestones as any[]).length > 0 ? (
                  <div className="space-y-3">
                    {(milestones as any[]).map((m, i) => (
                      <MilestoneCard key={i} milestone={m} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {[
                      { title: "First 100 Followers", icon: "👥", progress: 45, reward: "100 SKY444" },
                      { title: "First $100 Earned", icon: "💰", progress: 23, reward: "Creator Badge" },
                      { title: "10 Posts Published", icon: "📝", progress: 70, reward: "50 XP" },
                      { title: "First Live Stream", icon: "🎥", progress: 0, reward: "Streamer Badge" },
                      { title: "100 Total Likes", icon: "❤️", progress: 88, reward: "25 SKY444" },
                    ].map((m, i) => (
                      <MilestoneCard key={i} milestone={m} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fans" className="space-y-3">
            <Card className="bg-gray-900/60 border-gray-700/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-300 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  Top Fans
                </CardTitle>
              </CardHeader>
              <CardContent>
                {fanScores && (fanScores as any[]).length > 0 ? (
                  <div className="space-y-3">
                    {(fanScores as any[]).slice(0, 10).map((fan: any, i: number) => (
                      <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-800/50 last:border-0">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          i === 0 ? "bg-yellow-500 text-black" : i === 1 ? "bg-gray-400 text-black" : i === 2 ? "bg-orange-600 text-white" : "bg-gray-700 text-gray-300"
                        }`}>
                          {i + 1}
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-sm font-bold text-white">
                          {(fan.username || fan.name || "F")[0].toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-white">{fan.username || fan.name || "Fan"}</div>
                          <div className="text-xs text-gray-400">Score: {fan.score || fan.engagementScore || 0}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-yellow-400 font-medium">{fan.totalTips || 0} SKY</div>
                          <div className="text-xs text-gray-500">{fan.interactions || 0} interactions</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No fan data yet</p>
                    <p className="text-xs mt-1">Grow your audience to see top fans</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
