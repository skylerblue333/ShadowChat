// @ts-nocheck
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function Guilds() {
  const { user } = useAuth();
  const [createOpen, setCreateOpen] = useState(false);
  const [guildName, setGuildName] = useState("");
  const [guildDesc, setGuildDesc] = useState("");
  const [warTarget, setWarTarget] = useState("");

  const { data: guilds, isLoading } = trpc.gamefi.guilds.useQuery();
  const { data: wars } = trpc.gamefi.guildWars.useQuery();
  const { data: leaderboard } = trpc.gamefi.leaderboard.useQuery();

  const createGuild = trpc.gamefi.createGuild.useMutation({
    onSuccess: () => {
      toast.success("Guild created successfully!");
      setCreateOpen(false);
      setGuildName("");
      setGuildDesc("");
    },
    onError: (err) => toast.error(err.message),
  });

  const joinGuild = trpc.gamefi.joinGuild.useMutation({
    onSuccess: () => toast.success("Joined guild!"),
    onError: (err) => toast.error(err.message),
  });

  const declareWar = trpc.gamefi.declareWar.useMutation({
    onSuccess: () => {
      toast.success("War declared!");
      setWarTarget("");
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Guild Arena
            </h1>
            <p className="text-muted-foreground mt-1">
              Form alliances, compete in wars, and climb the leaderboard
            </p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Create Guild
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle>Create New Guild</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Guild Name</label>
                  <Input
                    value={guildName}
                    onChange={(e) => setGuildName(e.target.value)}
                    placeholder="Enter guild name..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <Textarea
                    value={guildDesc}
                    onChange={(e) => setGuildDesc(e.target.value)}
                    placeholder="Describe your guild..."
                    className="mt-1"
                    rows={3}
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={() => createGuild.mutate({ name: guildName, tag: guildName.substring(0, 4).toUpperCase() })}
                  disabled={!guildName || createGuild.isPending}
                >
                  {createGuild.isPending ? "Creating..." : "Create Guild"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="guilds" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="guilds">All Guilds</TabsTrigger>
            <TabsTrigger value="wars">Guild Wars</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          {/* Guilds Tab */}
          <TabsContent value="guilds" className="space-y-4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="bg-card/50 border-border animate-pulse">
                    <CardContent className="p-6 h-40" />
                  </Card>
                ))}
              </div>
            ) : guilds && guilds.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {guilds.map((guild: { id: string; name: string; description?: string; memberCount?: number; level?: number; xp?: number }) => (
                  <Card key={guild.id} className="bg-card/50 border-border hover:border-purple-500/50 transition-colors">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{guild.name}</CardTitle>
                        <Badge variant="outline" className="text-purple-400 border-purple-400/50">
                          Lv.{guild.level || 1}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {guild.description || "No description"}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {guild.memberCount || 0} members
                        </span>
                        <span className="text-purple-400">
                          {guild.xp || 0} XP
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => joinGuild.mutate({ guildId: Number(guild.id) })}
                        disabled={joinGuild.isPending}
                      >
                        Join Guild
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-card/50 border-border">
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground text-lg">No guilds yet. Be the first to create one!</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Wars Tab */}
          <TabsContent value="wars" className="space-y-4">
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle className="text-lg">Declare War</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-3">
                <Input
                  value={warTarget}
                  onChange={(e) => setWarTarget(e.target.value)}
                  placeholder="Target guild ID..."
                  className="flex-1"
                />
                <Button
                  onClick={() => declareWar.mutate({ attackerGuildId: 1, defenderGuildId: Number(warTarget), wager: 100 })}
                  disabled={!warTarget || declareWar.isPending}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Declare War
                </Button>
              </CardContent>
            </Card>

            {wars && wars.length > 0 ? (
              <div className="space-y-3">
                {wars.map((war: { id: any; attacker: any; defender: any; status: any; startedAt?: any; attackerScore: number; defenderScore: number }) => (
                  <Card key={war.id} className="bg-card/50 border-border">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-red-400">{war.attacker}</span>
                        <span className="text-muted-foreground">vs</span>
                        <span className="font-bold text-blue-400">{war.defender}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono">
                          {war.attackerScore} - {war.defenderScore}
                        </span>
                        <Badge variant={war.status === "active" ? "default" : "secondary"}>
                          {war.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-card/50 border-border">
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">No active wars. Peace reigns... for now.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-4">
            <Card className="bg-card/50 border-border">
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  <div className="grid grid-cols-5 gap-4 p-4 text-sm font-medium text-muted-foreground bg-muted/30">
                    <span>Rank</span>
                    <span>Player</span>
                    <span className="text-right">Level</span>
                    <span className="text-right">XP</span>
                    <span className="text-right">Wins</span>
                  </div>
                  {leaderboard && leaderboard.length > 0 ? (
                    leaderboard.map((entry: { rank: number; username: string; avatar: string | null; xp: number; level: number; reputation: number; verified: boolean; badge: string }, index: number) => (
                      <div
                        key={entry.username}
                        className={`grid grid-cols-5 gap-4 p-4 text-sm items-center`}
                      >
                        <span className={`font-bold ${
                          index === 0 ? "text-yellow-400" :
                          index === 1 ? "text-gray-300" :
                          index === 2 ? "text-amber-600" :
                          "text-muted-foreground"
                        }`}>
                          #{entry.rank}
                        </span>
                        <span className="font-medium">{entry.username}</span>
                        <span className="text-right text-purple-400">Lv.{entry.level}</span>
                        <span className="text-right">{entry.xp.toLocaleString()}</span>
                        <span className="text-right text-purple-400">{entry.reputation}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      No leaderboard data yet. Start playing to rank up!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
