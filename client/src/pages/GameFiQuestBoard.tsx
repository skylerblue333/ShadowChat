import { useState } from "react";
import { Sword, Star, Zap, Trophy, Clock, CheckCircle, Lock, Gift, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";

const quests = [
  { id: "q1", title: "First Blood", desc: "Win your first tournament match", reward: 50, rewardToken: "SKY444", xp: 100, progress: 1, total: 1, completed: true, category: "tournament", difficulty: "easy" },
  { id: "q2", title: "Social Butterfly", desc: "Make 10 posts and get 50 likes", reward: 25, rewardToken: "SKY444", xp: 75, progress: 7, total: 10, completed: false, category: "social", difficulty: "easy" },
  { id: "q3", title: "Diamond Hands", desc: "Stake SKY444 for 30 days without unstaking", reward: 500, rewardToken: "SKY444", xp: 500, progress: 12, total: 30, completed: false, category: "defi", difficulty: "hard" },
  { id: "q4", title: "Code Warrior", desc: "Solve 5 Assembly Puzzle challenges", reward: 150, rewardToken: "SKY444", xp: 250, progress: 3, total: 5, completed: false, category: "gaming", difficulty: "medium" },
  { id: "q5", title: "Whale Watcher", desc: "Monitor 10 whale transactions", reward: 75, rewardToken: "SKY444", xp: 150, progress: 10, total: 10, completed: true, category: "defi", difficulty: "easy" },
  { id: "q6", title: "Community Champion", desc: "Get 100 followers and 500 total likes", reward: 200, rewardToken: "SKY444", xp: 300, progress: 67, total: 100, completed: false, category: "social", difficulty: "medium" },
  { id: "q7", title: "Governance Guru", desc: "Vote on 5 governance proposals", reward: 100, rewardToken: "SKY444", xp: 200, progress: 2, total: 5, completed: false, category: "governance", difficulty: "easy" },
  { id: "q8", title: "NFT Collector", desc: "Own 10 different NFTs from the marketplace", reward: 300, rewardToken: "SKY444", xp: 400, progress: 4, total: 10, completed: false, category: "nft", difficulty: "hard" },
];

const dailyQuests = [
  { title: "Daily Login", reward: 5, completed: true },
  { title: "Post Something", reward: 10, completed: true },
  { title: "Like 5 Posts", reward: 8, completed: false },
  { title: "Check Price Feed", reward: 3, completed: false },
];

const difficultyColors: Record<string, string> = {
  easy: "text-purple-400 border-purple-500/30",
  medium: "text-yellow-400 border-yellow-400/30",
  hard: "text-red-400 border-red-400/30",
};

const categoryIcons: Record<string, string> = {
  tournament: "🏆", social: "💬", defi: "💎", gaming: "🎮", governance: "🗳️", nft: "🖼️",
};

export default function GameFiQuestBoard() {
  const [claimed, setClaimed] = useState<string[]>([]);
  const [filter, setFilter] = useState("all");

  const claimReward = (questId: string, reward: number) => {
    setClaimed(prev => [...prev, questId]);
    toast.success(`Claimed ${reward} SKY444! Reward sent to your wallet.`);
  };

  const filteredQuests = filter === "all" ? quests : quests.filter(q => q.category === filter);
  const totalXP = quests.filter(q => q.completed).reduce((sum, q) => sum + q.xp, 0);
  const completedCount = quests.filter(q => q.completed).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 max-w-5xl">
        <PageHeader backHref="/gaming" icon={Sword} title="GameFi Quest Board" subtitle="Complete quests, earn SKY444 rewards, and level up your reputation" />

        {/* Player Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total XP", value: totalXP.toLocaleString(), icon: Star, color: "text-yellow-400" },
            { label: "Quests Done", value: `${completedCount}/${quests.length}`, icon: CheckCircle, color: "text-purple-400" },
            { label: "SKY444 Earned", value: "725", icon: Gift, color: "text-primary" },
            { label: "Rank", value: "#847", icon: TrendingUp, color: "text-purple-400" },
          ].map(s => (
            <Card key={s.label} className="border-border/50">
              <CardContent className="pt-6">
                <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="quests">
          <TabsList className="mb-6">
            <TabsTrigger value="quests">All Quests</TabsTrigger>
            <TabsTrigger value="daily">Daily Quests</TabsTrigger>
          </TabsList>

          <TabsContent value="quests">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {["all", "social", "defi", "gaming", "tournament", "governance", "nft"].map(cat => (
                <Button key={cat} size="sm" variant={filter === cat ? "default" : "outline"} onClick={() => setFilter(cat)} className="capitalize">{cat}</Button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredQuests.map(quest => {
                const pct = (quest.progress / quest.total) * 100;
                const isClaimed = claimed.includes(quest.id);
                return (
                  <Card key={quest.id} className={`border-border/50 ${quest.completed ? "border-purple-500/20 bg-purple-600/5" : ""}`}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{categoryIcons[quest.category]}</span>
                          <div>
                            <p className="font-medium text-sm">{quest.title}</p>
                            <p className="text-xs text-muted-foreground">{quest.desc}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={`text-xs ${difficultyColors[quest.difficulty]}`}>{quest.difficulty}</Badge>
                      </div>

                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Progress</span>
                          <span>{quest.progress}/{quest.total}</span>
                        </div>
                        <Progress value={pct} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-primary font-medium">+{quest.reward} {quest.rewardToken}</span>
                          <span className="text-yellow-400">+{quest.xp} XP</span>
                        </div>
                        {quest.completed ? (
                          isClaimed ? (
                            <Badge variant="outline" className="text-purple-400 border-purple-500/30 text-xs">Claimed</Badge>
                          ) : (
                            <Button size="sm" onClick={() => claimReward(quest.id, quest.reward)} className="bg-purple-600 hover:bg-purple-600 text-white">
                              <Gift className="w-3 h-3 mr-1" />Claim
                            </Button>
                          )
                        ) : (
                          <Badge variant="secondary" className="text-xs"><Clock className="w-3 h-3 mr-1" />In Progress</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="daily">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  Daily Quests — Resets in 14h 32m
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dailyQuests.map((q, i) => (
                    <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${q.completed ? "bg-purple-600/10 border border-purple-500/20" : "bg-muted/30"}`}>
                      <div className="flex items-center gap-3">
                        {q.completed ? <CheckCircle className="w-4 h-4 text-purple-400" /> : <Clock className="w-4 h-4 text-muted-foreground" />}
                        <span className="text-sm">{q.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-primary font-medium">+{q.reward} SKY444</span>
                        {q.completed && <Badge variant="outline" className="text-purple-400 border-purple-500/30 text-xs">Done</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-sm font-medium">Complete all daily quests for a 2x bonus!</p>
                  <Progress value={50} className="h-2 mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">2/4 completed</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
