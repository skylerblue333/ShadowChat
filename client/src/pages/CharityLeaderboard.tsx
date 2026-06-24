import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Heart, Trophy, TrendingUp, Globe, Users, DollarSign, Target, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Link } from "wouter";

// All data comes from live DB — no mock arrays

export default function CharityLeaderboard() {
  // Live DB queries — no mock data
  const { data: stats, isLoading: statsLoading } = trpc.charity.stats.useQuery();
  const { data: campaigns, isLoading: campaignsLoading } = trpc.charity.campaigns.useQuery({ limit: 10 });
  const { data: leaderboard, isLoading: leaderboardLoading } = trpc.charity.leaderboard.useQuery({ limit: 20 });

  const fmtSky = (n: number) =>
    n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(1)}K` : String(n);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <PageHeader backHref="/charity" title="Charity Leaderboard" subtitle="Top donors driving real-world impact with SKY444" icon={Heart} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-4 border-border/50 text-center">
          <DollarSign className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <p className="text-2xl font-black text-purple-400">
            {statsLoading ? "…" : fmtSky(stats?.totalRaised ?? 0)} SKY444
          </p>
          <p className="text-xs text-muted-foreground">Total Donated</p>
        </Card>
        <Card className="p-4 border-border/50 text-center">
          <Users className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-2xl font-black text-primary">
            {statsLoading ? "…" : (stats?.totalDonors ?? 0).toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">Total Donors</p>
        </Card>
        <Card className="p-4 border-border/50 text-center">
          <Globe className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-black text-blue-400">
            {statsLoading ? "…" : (stats?.activeCampaigns ?? 0).toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">Active Campaigns</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-bold mb-4 flex items-center gap-2"><Trophy className="w-4 h-4 text-yellow-400" /> Top Donors</h3>
          {leaderboardLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
          ) : !Array.isArray(leaderboard) || leaderboard.length === 0 ? (
            <Card className="p-8 text-center border-border/50">
              <Heart className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No donations yet. Be the first to give!</p>
              <Link href="/charity" className="text-primary text-sm hover:underline mt-2 inline-block">Browse campaigns →</Link>
            </Card>
          ) : (
            <div className="space-y-3">
              {(leaderboard as any[]).map((d: any, i: number) => (
                <Card key={d.id ?? i} className={`p-4 border-border/50 flex items-center gap-3 ${i < 3 ? "border-yellow-500/20 bg-yellow-500/5" : "bg-card/60"}`}>
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${i === 0 ? "bg-yellow-500/20 text-yellow-400" : i === 1 ? "bg-gray-400/20 text-gray-400" : i === 2 ? "bg-orange-500/20 text-orange-400" : "bg-muted text-muted-foreground"}`}>{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{d.isAnonymous ? "Anonymous" : (d.donorName ?? d.username ?? `User #${d.donorId}`)}</p>
                    <p className="text-xs text-muted-foreground">{d.campaignCount ?? 1} campaign{(d.campaignCount ?? 1) !== 1 ? "s" : ""}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-purple-400">{Number(d.totalDonated ?? d.amount ?? 0).toLocaleString()} SKY444</p>
                    <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                      {i === 0 ? "Diamond Donor" : i === 1 ? "Platinum Donor" : i === 2 ? "Gold Donor" : "Donor"}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="font-bold mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" /> Active Campaigns</h3>
          {campaignsLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
          ) : !Array.isArray(campaigns) || campaigns.length === 0 ? (
            <Card className="p-8 text-center border-border/50">
              <Target className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No active campaigns yet.</p>
              <Link href="/charity" className="text-primary text-sm hover:underline mt-2 inline-block">Create a campaign →</Link>
            </Card>
          ) : (
            <div className="space-y-4">
              {(campaigns as any[]).map((c: any) => {
                const raised = Number(c.raisedAmount ?? 0);
                const goal = Number(c.goal ?? 1);
                const pct = Math.min(100, Math.round((raised / goal) * 100));
                return (
                  <Card key={c.id} className="p-4 border-border/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-1">
                        <p className="font-semibold">{c.title}</p>
                        <p className="text-xs text-muted-foreground">{c.category ?? "general"}</p>
                      </div>
                      <Badge variant="outline" className="border-purple-500/30 text-purple-400">{pct}%</Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 mb-2">
                      <div className="bg-purple-600 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{raised.toLocaleString()} SKY444 raised</span>
                      <span>Goal: {goal.toLocaleString()} SKY444</span>
                    </div>
                    <Link href={`/charity/${c.id}`}>
                      <Button size="sm" className="w-full mt-3 gap-1 h-8 text-xs"><Heart className="w-3 h-3" /> Donate Now</Button>
                    </Link>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Impact note — chart will show real data once donations are made */}
      <div className="mt-8">
        <Card className="p-6 border-border/50 text-center">
          <TrendingUp className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Impact analytics will appear here as donations are made.</p>
          <Link href="/charity" className="text-primary text-sm hover:underline mt-2 inline-block">Start donating →</Link>
        </Card>
      </div>
    </div>
  );
}
