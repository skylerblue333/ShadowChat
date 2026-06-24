import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Users, Shield, Crown, Hash, Lock, Globe, Star, Zap,
  MessageCircle, Plus, Search, Settings, Volume2, Video, Coins
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { getLoginUrl } from "@/const";

const FEATURED_COMMUNITIES = [
  { id: 1, name: "SKYCOIN4444 Official", members: 0, category: "Official", description: "Main community hub for SKYCOIN4444 ecosystem", tokenGated: false, icon: "S4" },
  { id: 2, name: "SKY444 Traders", members: 0, category: "Trading", description: "Token trading strategies and signals", tokenGated: true, icon: "TR" },
  { id: 3, name: "Creator Guild", members: 0, category: "Creators", description: "For verified creators building on the platform", tokenGated: true, icon: "CG" },
  { id: 4, name: "GameFi Arena", members: 0, category: "Gaming", description: "PvP tournaments, guild wars, and gaming chat", tokenGated: false, icon: "GF" },
  { id: 5, name: "Governance DAO", members: 0, category: "Governance", description: "Propose and vote on platform changes", tokenGated: true, icon: "DAO" },
  { id: 6, name: "Dev Hub", members: 0, category: "Development", description: "API discussions, integrations, and bug reports", tokenGated: false, icon: "DH" },
];

const CHANNELS = [
  { name: "general", type: "text", icon: Hash },
  { name: "announcements", type: "text", icon: Hash },
  { name: "trading-signals", type: "text", icon: Hash },
  { name: "creator-showcase", type: "text", icon: Hash },
  { name: "voice-lounge", type: "voice", icon: Volume2 },
  { name: "stream-watch-party", type: "voice", icon: Video },
];

const ROLES = [
  { name: "Admin", color: "text-red-400", permissions: "Full access" },
  { name: "Moderator", color: "text-blue-400", permissions: "Manage messages & users" },
  { name: "Creator", color: "text-purple-400", permissions: "Post in creator channels" },
  { name: "Whale", color: "text-yellow-400", permissions: "Token-gated access (10K+ SKY444)" },
  { name: "Member", color: "text-purple-400", permissions: "Basic access" },
];

export default function Community() {
  const { user, isAuthenticated } = useAuth();
  const { data: communities, isLoading } = trpc.community.list.useQuery({});
  const [searchQuery, setSearchQuery] = useState("");

  const joinCommunity = trpc.community.join.useMutation({
    onSuccess: () => toast.success("Joined community!"),
    onError: () => toast.error("Please sign in to join."),
  });

  const displayCommunities = communities && communities.length > 0 ? communities : FEATURED_COMMUNITIES;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Communities
              </span>
            </h1>
            <p className="text-muted-foreground">Discord-level community system with servers, channels, roles, and token-gated access.</p>
          </div>
          {isAuthenticated ? (
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => toast.info("Community creation coming soon!")}>
              <Plus className="w-4 h-4 mr-2" /> Create Community
            </Button>
          ) : (
            <a href={getLoginUrl()}>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Sign In</Button>
            </a>
          )}
        </div>

        {/* External Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { name: "Discord", url: "https://discord.gg/skycoin4444", color: "text-indigo-400", bg: "bg-indigo-500/10" },
            { name: "Telegram", url: "https://t.me/skycoin4444", color: "text-blue-400", bg: "bg-blue-500/10" },
            { name: "Reddit", url: "https://reddit.com/r/skycoin4444", color: "text-orange-400", bg: "bg-orange-500/10" },
            { name: "X (Twitter)", url: "https://x.com/skycoin4444", color: "text-white", bg: "bg-white/5" },
          ].map(s => (
            <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer">
              <Card className="p-4 border-border/50 bg-card/80 hover:border-primary/30 transition-all text-center">
                <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${s.bg}`}>
                  <Users className={`w-5 h-5 ${s.color}`} />
                </div>
                <h3 className="font-semibold text-sm">{s.name}</h3>
              </Card>
            </a>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 text-center border-border/50 bg-card/80">
            <Globe className="w-5 h-5 text-primary mx-auto mb-2" />
            <div className="text-xl font-mono font-bold">{displayCommunities.length}</div>
            <div className="text-xs text-muted-foreground">Communities</div>
          </Card>
          <Card className="p-4 text-center border-border/50 bg-card/80">
            <Users className="w-5 h-5 text-blue-400 mx-auto mb-2" />
            <div className="text-xl font-mono font-bold">0</div>
            <div className="text-xs text-muted-foreground">Total Members</div>
          </Card>
          <Card className="p-4 text-center border-border/50 bg-card/80">
            <Lock className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
            <div className="text-xl font-mono font-bold">3</div>
            <div className="text-xs text-muted-foreground">Token-Gated</div>
          </Card>
          <Card className="p-4 text-center border-border/50 bg-card/80">
            <MessageCircle className="w-5 h-5 text-purple-400 mx-auto mb-2" />
            <div className="text-xl font-mono font-bold">0</div>
            <div className="text-xs text-muted-foreground">Messages Today</div>
          </Card>
        </div>

        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="w-full bg-card/80 border border-border/50">
            <TabsTrigger value="browse" className="flex-1">
              <Globe className="w-3 h-3 mr-1.5" /> Browse
            </TabsTrigger>
            <TabsTrigger value="channels" className="flex-1">
              <Hash className="w-3 h-3 mr-1.5" /> Channels
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex-1">
              <Shield className="w-3 h-3 mr-1.5" /> Roles
            </TabsTrigger>
            <TabsTrigger value="token-gated" className="flex-1">
              <Lock className="w-3 h-3 mr-1.5" /> Token-Gated
            </TabsTrigger>
          </TabsList>

          {/* Browse Communities */}
          <TabsContent value="browse" className="mt-4">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search communities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-card/80 border-border/50"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(displayCommunities as any[])
                .filter((c: any) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((community: any) => (
                <Card
                  key={community.id}
                  className="p-4 border-border/50 bg-card/80 hover:border-primary/30 transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                        {community.icon || community.name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm truncate">{community.name}</h3>
                        {community.tokenGated && <Lock className="w-3 h-3 text-yellow-400 shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground">{community.members || community.memberCount || 0} members</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{community.description || "No description"}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-[10px]">{community.category || "General"}</Badge>
                    <Button size="sm" variant="outline" className="h-7 text-xs border-border/50" onClick={() => {
                      if (!isAuthenticated) { toast.error("Sign in to join"); return; }
                      joinCommunity.mutate({ communityId: community.id });
                    }} disabled={joinCommunity.isPending}>
                      {joinCommunity.isPending ? "Joining..." : "Join"}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Channels */}
          <TabsContent value="channels" className="mt-4">
            <Card className="border-border/50 bg-card/80 overflow-hidden">
              <div className="p-4 border-b border-border/50">
                <h3 className="font-semibold flex items-center gap-2">
                  <Hash className="w-4 h-4 text-primary" /> Channel Structure
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Each community has text and voice channels.</p>
              </div>
              <div className="divide-y divide-border/30">
                {CHANNELS.map(channel => (
                  <div key={channel.name} className="p-3 flex items-center gap-3 hover:bg-background/50 transition-colors">
                    <channel.icon className={`w-4 h-4 ${channel.type === 'voice' ? 'text-purple-400' : 'text-muted-foreground'}`} />
                    <span className="text-sm">{channel.name}</span>
                    <Badge variant="secondary" className="text-[10px] ml-auto">{channel.type}</Badge>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-border/50 bg-background/30">
                <p className="text-xs text-muted-foreground">Community admins can create unlimited channels with custom permissions.</p>
              </div>
            </Card>
          </TabsContent>

          {/* Roles */}
          <TabsContent value="roles" className="mt-4">
            <Card className="border-border/50 bg-card/80 overflow-hidden">
              <div className="p-4 border-b border-border/50">
                <h3 className="font-semibold flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" /> Role System
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Hierarchical roles with granular permissions.</p>
              </div>
              <div className="divide-y divide-border/30">
                {ROLES.map(role => (
                  <div key={role.name} className="p-4 flex items-center gap-3">
                    <Crown className={`w-4 h-4 ${role.color}`} />
                    <div className="flex-1">
                      <span className={`text-sm font-medium ${role.color}`}>{role.name}</span>
                      <p className="text-xs text-muted-foreground">{role.permissions}</p>
                    </div>
                    <Settings className="w-4 h-4 text-muted-foreground/50" />
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Token-Gated */}
          <TabsContent value="token-gated" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-5 border-border/50 bg-card/80 border-yellow-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Token-Gated Access</h3>
                    <p className="text-xs text-muted-foreground">Hold SKY444 to unlock premium communities</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-background/50 border border-border/30 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">Basic Access</div>
                      <div className="text-xs text-muted-foreground">Hold 100+ SKY444</div>
                    </div>
                    <Badge className="bg-purple-600/10 text-purple-400 border-purple-500/30 text-[10px]">Open</Badge>
                  </div>
                  <div className="p-3 rounded-lg bg-background/50 border border-border/30 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">Whale Lounge</div>
                      <div className="text-xs text-muted-foreground">Hold 10,000+ SKY444</div>
                    </div>
                    <Badge variant="outline" className="text-[10px]">Locked</Badge>
                  </div>
                  <div className="p-3 rounded-lg bg-background/50 border border-border/30 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">DAO Council</div>
                      <div className="text-xs text-muted-foreground">Hold 100,000+ SKY444</div>
                    </div>
                    <Badge variant="outline" className="text-[10px]">Locked</Badge>
                  </div>
                </div>
              </Card>

              <Card className="p-5 border-border/50 bg-card/80">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Coins className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Premium Benefits</h3>
                    <p className="text-xs text-muted-foreground">What token holders get</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    "Exclusive trading signals channel",
                    "Early access to new features",
                    "Priority creator support",
                    "Governance voting power",
                    "Revenue share participation",
                    "Private voice channels",
                    "Custom roles & badges",
                    "Direct team access"
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <Zap className="w-3 h-3 text-primary shrink-0" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
