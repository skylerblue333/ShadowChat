import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  Globe, Users, Shield, BarChart3, Zap, Coins,
  CheckCircle, XCircle, Crown, Heart, Vote, Star, Palette
} from "lucide-react";

// ─── Token Registry Tab ───────────────────────────────────────────────────────
function TokenRegistryTab() {
  const { data } = trpc.goc.tokenRegistry.useQuery();
  const roleColors: Record<string, string> = {
    core: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    community: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    governance: "bg-red-500/20 text-red-300 border-red-500/30",
    charity: "bg-green-500/20 text-green-300 border-green-500/30",
    progression: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    creator: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    premium: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
  };
  const iconMap: Record<string, React.ReactNode> = {
    Coins: <Coins className="w-5 h-5" />,
    Heart: <Heart className="w-5 h-5" />,
    Vote: <Vote className="w-5 h-5" />,
    HandHeart: <Heart className="w-5 h-5 text-green-400" />,
    Star: <Star className="w-5 h-5" />,
    Palette: <Palette className="w-5 h-5" />,
    Crown: <Crown className="w-5 h-5" />,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Coins className="w-5 h-5 text-amber-400" />
        <h2 className="text-lg font-semibold text-white">Ecosystem Token Registry</h2>
        <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
          Genesis Vote #001 PASSED
        </Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(data?.all ?? []).map((token) => (
          <Card key={token.symbol} className="bg-zinc-900/60 border-zinc-700/50">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{token.emoji}</span>
                  <div>
                    <div className="font-bold text-white text-sm">{token.symbol}</div>
                    <div className="text-xs text-zinc-400">{token.name}</div>
                  </div>
                </div>
                <Badge className={`text-xs border ${roleColors[token.role] ?? ""}`}>
                  {token.role}
                </Badge>
              </div>
              <p className="text-xs text-zinc-400 mb-3">{token.description}</p>
              <div className="flex flex-wrap gap-1">
                {token.stakeable && <Badge className="bg-zinc-800 text-zinc-300 text-xs">Stakeable</Badge>}
                {token.burnable && <Badge className="bg-zinc-800 text-zinc-300 text-xs">Burnable</Badge>}
                {token.tippable && <Badge className="bg-zinc-800 text-zinc-300 text-xs">Tippable</Badge>}
                {token.earnable && <Badge className="bg-zinc-800 text-zinc-300 text-xs">Earnable</Badge>}
                {token.swappable && <Badge className="bg-zinc-800 text-zinc-300 text-xs">Swappable</Badge>}
                {token.govWeight > 0 && (
                  <Badge className="bg-amber-500/20 text-amber-300 text-xs">
                    Gov {token.govWeight > 1 ? `${token.govWeight}x` : "1x"}
                  </Badge>
                )}
                {token.newUserAirdrop > 0 && (
                  <Badge className="bg-blue-500/20 text-blue-300 text-xs">
                    Airdrop {token.newUserAirdrop}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Regions / Compliance Tab ─────────────────────────────────────────────────
function RegionsTab() {
  const { data: regions, isLoading } = trpc.goc.regions.useQuery();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type R = any;
  const features = [
    { key: "cryptoEnabled", label: "Crypto" },
    { key: "walletEnabled", label: "Wallet" },
    { key: "miningEnabled", label: "Mining" },
    { key: "stakingEnabled", label: "Staking" },
    { key: "dexEnabled", label: "DEX" },
    { key: "governanceEnabled", label: "Gov" },
    { key: "marketplaceEnabled", label: "Market" },
    { key: "gamingEnabled", label: "Gaming" },
    { key: "educationEnabled", label: "Edu" },
    { key: "aiAgentsEnabled", label: "AI" },
  ];

  if (isLoading) return <div className="flex justify-center py-12"><Spinner /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-amber-400" />
        <h2 className="text-lg font-semibold text-white">Global Compliance Matrix</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-zinc-700">
              <th className="text-left py-2 px-3 text-zinc-400 font-medium">Region</th>
              {features.map(f => (
                <th key={f.key} className="py-2 px-2 text-zinc-400 font-medium text-center">{f.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {((regions ?? []) as any[]).map((r: any) => (
              <tr key={String(r.regionCode)} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                <td className="py-2 px-3 text-white font-medium">
                  <div>{String(r.regionName)}</div>
                  <div className="text-zinc-500 text-xs">{String(r.regionCode)}</div>
                </td>
                {features.map(f => (
                  <td key={f.key} className="py-2 px-2 text-center">
                    {r[f.key] ? (
                      <CheckCircle className="w-4 h-4 text-green-400 mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400 mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Ambassadors Tab ──────────────────────────────────────────────────────────
function AmbassadorsTab() {
  const { data: ambassadors, isLoading } = trpc.goc.ambassadors.useQuery({});
  const roleIcons: Record<string, string> = {
    country: "🌍", community: "👥", language: "🗣️",
    education: "📚", developer: "💻", religion: "✝️",
    charity: "💚", gaming: "🎮", creator: "🎨",
  };
  const roleColors: Record<string, string> = {
    religion: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    country: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    community: "bg-green-500/20 text-green-300 border-green-500/30",
    developer: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    charity: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    gaming: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    creator: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    education: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    language: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  };

  if (isLoading) return <div className="flex justify-center py-12"><Spinner /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-semibold text-white">Global Ambassador Program</h2>
        </div>
        <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
          {(ambassadors ?? []).length} Active
        </Badge>
      </div>
      {(ambassadors ?? []).length === 0 ? (
        <Card className="bg-zinc-900/60 border-zinc-700/50">
          <CardContent className="p-8 text-center">
            <Crown className="w-12 h-12 text-amber-400/30 mx-auto mb-3" />
            <p className="text-zinc-400 text-sm">No ambassadors appointed yet.</p>
            <p className="text-zinc-500 text-xs mt-1">
              Roles available: Country Leader, Community Leader, Language Leader, Education Leader,
              Developer Advocate, <strong className="text-purple-300">Religion Leader</strong>, Charity Champion, Gaming Ambassador, Creator Ambassador.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {((ambassadors ?? []) as any[]).map((a: any) => (
            <Card key={String(a.id)} className="bg-zinc-900/60 border-zinc-700/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-lg">
                    {roleIcons[String(a.role)] ?? "🌟"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white text-sm truncate">
                      {String(a.displayName ?? a.username ?? `User #${a.userId}`)}
                    </div>
                    <div className="text-zinc-400 text-xs">{String(a.regionCode)}</div>
                  </div>
                  <Badge className={`text-xs border ${roleColors[String(a.role)] ?? ""}`}>
                    {String(a.role)}
                  </Badge>
                </div>
                {a.bio && <p className="text-xs text-zinc-400 mt-2 line-clamp-2">{String(a.bio)}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Heatmap Tab ──────────────────────────────────────────────────────────────
function HeatmapTab() {
  const { data: heatmap, isLoading } = trpc.goc.heatmap.useQuery();

  if (isLoading) return <div className="flex justify-center py-12"><Spinner /></div>;

      const maxUsers = Math.max(...((heatmap ?? []) as any[]).map((r: any) => Number(r.activeUsers ?? 0)), 1);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="w-5 h-5 text-amber-400" />
        <h2 className="text-lg font-semibold text-white">Global Activity Heatmap</h2>
      </div>
      <div className="space-y-2">
        {((heatmap ?? []) as any[]).map((r: any) => {
          const users = Number(r.activeUsers ?? 0);
          const pct = Math.round((users / maxUsers) * 100);
          return (
            <div key={String(r.regionCode)} className="flex items-center gap-3">
              <div className="w-28 text-sm text-zinc-300 shrink-0">{String(r.regionName)}</div>
              <div className="flex-1 bg-zinc-800 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-700"
                  style={{ width: `${Math.max(pct, 2)}%` }}
                />
              </div>
              <div className="w-16 text-right text-xs text-zinc-400 shrink-0">
                {users.toLocaleString()} users
              </div>
              <div className="flex gap-1 shrink-0">
                {!r.cryptoEnabled && <Badge className="bg-red-500/20 text-red-300 text-xs px-1">no crypto</Badge>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── AI Growth Engine Tab ─────────────────────────────────────────────────────
function GrowthEngineTab() {
  const { user } = useAuth();
  const { data, isLoading, refetch, isFetching } = trpc.goc.growthAnalysis.useQuery(undefined, {
    enabled: user?.role === "admin",
  });

  if (user?.role !== "admin") {
    return (
      <Card className="bg-zinc-900/60 border-zinc-700/50">
        <CardContent className="p-8 text-center">
          <Zap className="w-12 h-12 text-amber-400/30 mx-auto mb-3" />
          <p className="text-zinc-400 text-sm">AI Growth Engine is available to platform admins.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-semibold text-white">HOPE AI Growth Engine</h2>
        </div>
        <Button
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30"
        >
          {isFetching ? <Spinner className="w-4 h-4" /> : "Regenerate"}
        </Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: "Total Users", value: data?.metrics?.totalUsers?.toLocaleString() ?? "—" },
              { label: "Total Posts", value: data?.metrics?.totalPosts?.toLocaleString() ?? "—" },
              { label: "Transactions", value: data?.metrics?.totalTransactions?.toLocaleString() ?? "—" },
            ].map(m => (
              <Card key={m.label} className="bg-zinc-900/60 border-zinc-700/50">
                <CardContent className="p-3 text-center">
                  <div className="text-xl font-bold text-amber-400">{m.value}</div>
                  <div className="text-xs text-zinc-400">{m.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="bg-zinc-900/60 border-zinc-700/50">
            <CardContent className="p-4">
              <pre className="text-sm text-zinc-300 whitespace-pre-wrap font-sans leading-relaxed">
                {String(data?.analysis ?? "No analysis available.")}
              </pre>
              {data?.generatedAt && (
                <p className="text-xs text-zinc-600 mt-3">
                  Generated {new Date(data.generatedAt).toLocaleString()}
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function GlobalOperationsCenter() {
  const [tab, setTab] = useState("tokens");

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <Globe className="w-6 h-6 text-amber-400" />
          <div>
            <h1 className="text-lg font-bold text-white">Global Operations Center</h1>
            <p className="text-xs text-zinc-400">Token Registry · Region Compliance · Ambassador Program · AI Growth Engine</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-zinc-900 border border-zinc-700 mb-6 flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="tokens" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-300">
              <Coins className="w-4 h-4 mr-1" /> Tokens
            </TabsTrigger>
            <TabsTrigger value="regions" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-300">
              <Shield className="w-4 h-4 mr-1" /> Regions
            </TabsTrigger>
            <TabsTrigger value="ambassadors" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-300">
              <Crown className="w-4 h-4 mr-1" /> Ambassadors
            </TabsTrigger>
            <TabsTrigger value="heatmap" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-300">
              <Globe className="w-4 h-4 mr-1" /> Heatmap
            </TabsTrigger>
            <TabsTrigger value="growth" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-300">
              <Zap className="w-4 h-4 mr-1" /> AI Growth
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tokens"><TokenRegistryTab /></TabsContent>
          <TabsContent value="regions"><RegionsTab /></TabsContent>
          <TabsContent value="ambassadors"><AmbassadorsTab /></TabsContent>
          <TabsContent value="heatmap"><HeatmapTab /></TabsContent>
          <TabsContent value="growth"><GrowthEngineTab /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
