import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import { Trophy, TrendingUp, Flame, Coins, Medal } from "lucide-react";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function Leaderboards() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const topMiners = trpc.leaderboards.getTopMiners.useQuery({ limit: 20 }, { enabled: isAuthenticated });
  const topStakers = trpc.leaderboards.getTopStakers.useQuery({ limit: 20 }, { enabled: isAuthenticated });
  const topBurners = trpc.leaderboards.getTopBurners.useQuery({ limit: 20 }, { enabled: isAuthenticated });
  const wealthiest = trpc.leaderboards.getWealthiest.useQuery({ limit: 20 }, { enabled: isAuthenticated });
  const userRanks = trpc.leaderboards.getUserRanks.useQuery(undefined, { enabled: isAuthenticated });
  const weeklyRewards = trpc.leaderboards.getWeeklyRewards.useQuery(undefined, { enabled: isAuthenticated });

  if (authLoading) {
    return (
      <div className="container py-16 flex justify-center">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container py-16 text-center">
        <Trophy className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
        <h1 className="text-2xl font-bold mb-2">Leaderboards</h1>
        <p className="text-muted-foreground">Sign in to see rankings and compete with others.</p>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold flex items-center gap-3 mb-4">
          <Trophy className="w-8 h-8 text-yellow-400" />
          Leaderboards
        </h1>

        {/* User Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="p-3">
            <div className="text-xs text-muted-foreground">Mining Rank</div>
            <div className="text-2xl font-extrabold text-cyan-400">#{userRanks.data?.miningRank || "—"}</div>
          </Card>
          <Card className="p-3">
            <div className="text-xs text-muted-foreground">Staking Rank</div>
            <div className="text-2xl font-extrabold text-purple-400">#{userRanks.data?.stakingRank || "—"}</div>
          </Card>
          <Card className="p-3">
            <div className="text-xs text-muted-foreground">Burning Rank</div>
            <div className="text-2xl font-extrabold text-orange-400">#{userRanks.data?.burningRank || "—"}</div>
          </Card>
          <Card className="p-3">
            <div className="text-xs text-muted-foreground">Wealth Rank</div>
            <div className="text-2xl font-extrabold text-green-400">#{userRanks.data?.wealthRank || "—"}</div>
          </Card>
        </div>
      </div>

      {/* Weekly Rewards */}
      <Card className="p-4 mb-6 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/30">
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <Coins className="w-5 h-5 text-cyan-400" />
          This Week's Rewards
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <div className="text-sm text-muted-foreground">Mining</div>
            <div className="text-xl font-extrabold text-cyan-400">
              {weeklyRewards.data?.miningReward?.toFixed(2) || "0.00"}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Staking</div>
            <div className="text-xl font-extrabold text-purple-400">
              {weeklyRewards.data?.stakingReward?.toFixed(2) || "0.00"}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Burning Bonus</div>
            <div className="text-xl font-extrabold text-orange-400">
              {weeklyRewards.data?.burningReward?.toFixed(4) || "0.00"}
            </div>
          </div>
        </div>
      </Card>

      {/* Leaderboards */}
      <Tabs defaultValue="miners" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6 w-full">
          <TabsTrigger value="miners" className="text-xs md:text-sm">
            <TrendingUp className="w-4 h-4 mr-1" /> Miners
          </TabsTrigger>
          <TabsTrigger value="stakers" className="text-xs md:text-sm">
            <Coins className="w-4 h-4 mr-1" /> Stakers
          </TabsTrigger>
          <TabsTrigger value="burners" className="text-xs md:text-sm">
            <Flame className="w-4 h-4 mr-1" /> Burners
          </TabsTrigger>
          <TabsTrigger value="wealthy" className="text-xs md:text-sm">
            <Medal className="w-4 h-4 mr-1" /> Wealthy
          </TabsTrigger>
        </TabsList>

        {/* TOP MINERS */}
        <TabsContent value="miners">
          <Card className="p-4">
            <h3 className="font-bold mb-3">Top Miners</h3>
            {topMiners.isLoading ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : topMiners.data && topMiners.data.length > 0 ? (
              <div className="space-y-2">
                {topMiners.data.map((miner: any, idx: number) => (
                  <div key={miner.userId} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-lg font-extrabold w-6 text-center">
                        {idx < 3 ? MEDALS[idx] : `#${idx + 1}`}
                      </span>
                      <span className="text-sm text-muted-foreground truncate">User {miner.userId}</span>
                    </div>
                    <span className="font-extrabold text-cyan-400 whitespace-nowrap ml-2">
                      {miner.totalMined?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No mining data yet.</p>
            )}
          </Card>
        </TabsContent>

        {/* TOP STAKERS */}
        <TabsContent value="stakers">
          <Card className="p-4">
            <h3 className="font-bold mb-3">Top Stakers</h3>
            {topStakers.isLoading ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : topStakers.data && topStakers.data.length > 0 ? (
              <div className="space-y-2">
                {topStakers.data.map((staker: any, idx: number) => (
                  <div key={staker.userId} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-lg font-extrabold w-6 text-center">
                        {idx < 3 ? MEDALS[idx] : `#${idx + 1}`}
                      </span>
                      <div className="min-w-0">
                        <span className="text-sm text-muted-foreground truncate block">User {staker.userId}</span>
                        <span className="text-xs text-purple-400">Rewards: {staker.totalRewards?.toFixed(2)}</span>
                      </div>
                    </div>
                    <span className="font-extrabold text-purple-400 whitespace-nowrap ml-2">
                      {staker.totalStaked?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No staking data yet.</p>
            )}
          </Card>
        </TabsContent>

        {/* TOP BURNERS */}
        <TabsContent value="burners">
          <Card className="p-4">
            <h3 className="font-bold mb-3">Top Burners</h3>
            {topBurners.isLoading ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : topBurners.data && topBurners.data.length > 0 ? (
              <div className="space-y-2">
                {topBurners.data.map((burner: any, idx: number) => (
                  <div key={burner.userId} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-lg font-extrabold w-6 text-center">
                        {idx < 3 ? MEDALS[idx] : `#${idx + 1}`}
                      </span>
                      <div className="min-w-0">
                        <span className="text-sm text-muted-foreground truncate block">User {burner.userId}</span>
                        <span className="text-xs text-orange-400">Supply Reduction: {burner.supplyReduction?.toFixed(2)}</span>
                      </div>
                    </div>
                    <span className="font-extrabold text-orange-400 whitespace-nowrap ml-2">
                      {burner.totalBurned?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No burning data yet.</p>
            )}
          </Card>
        </TabsContent>

        {/* WEALTHIEST */}
        <TabsContent value="wealthy">
          <Card className="p-4">
            <h3 className="font-bold mb-3">Wealthiest Users</h3>
            {wealthiest.isLoading ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : wealthiest.data && wealthiest.data.length > 0 ? (
              <div className="space-y-2">
                {wealthiest.data.map((user: any, idx: number) => (
                  <div key={user.userId} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-lg font-extrabold w-6 text-center">
                        {idx < 3 ? MEDALS[idx] : `#${idx + 1}`}
                      </span>
                      <div className="min-w-0">
                        <span className="text-sm text-muted-foreground truncate block">User {user.userId}</span>
                        <span className="text-xs text-green-400">Staked: {user.stakedBalance?.toFixed(2)}</span>
                      </div>
                    </div>
                    <span className="font-extrabold text-green-400 whitespace-nowrap ml-2">
                      {user.totalBalance?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No wealth data yet.</p>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
