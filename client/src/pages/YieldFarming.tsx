import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import { Sprout, TrendingUp, Lock, Zap, Plus, Minus, RefreshCw, DollarSign, Droplets, Award } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const POOLS = [
  { id:"sky-eth",   name:"SKY444/ETH",  protocol:"SkyDEX",    apy:44.4,  tvl:"$2.1M",  risk:"Low",    color:"oklch(0.72 0.22 295)" },
  { id:"sky-usdc",  name:"SKY444/USDC", protocol:"SkyDEX",    apy:32.1,  tvl:"$1.8M",  risk:"Low",    color:"oklch(0.76 0.19 185)" },
  { id:"eth-usdc",  name:"ETH/USDC",    protocol:"Uniswap V3",apy:18.7,  tvl:"$45M",   risk:"Low",    color:"oklch(0.78 0.16 65)"  },
  { id:"sky-btc",   name:"SKY444/BTC",  protocol:"SkyDEX",    apy:88.8,  tvl:"$890K",  risk:"Medium", color:"oklch(0.72 0.18 150)" },
  { id:"degen-sky", name:"DEGEN/SKY444",protocol:"SkyDEX",    apy:144.4, tvl:"$220K",  risk:"High",   color:"oklch(0.62 0.22 25)"  },
];

const CHART_DATA = Array.from({length:30},(_,i)=>({
  day:`D${i+1}`,
  apy: 40 + Math.sin(i/3)*15 + Math.random()*10,
  tvl: 2000000 + Math.cos(i/4)*500000 + Math.random()*200000,
}));

export default function YieldFarming() {
  const { isAuthenticated } = useAuth();
  const [amounts, setAmounts] = useState<Record<string,string>>({});
  const [activePool, setActivePool] = useState<string|null>(null);

  const { data: positions, refetch } = trpc.token.farmingPositions.useQuery(undefined, { enabled: isAuthenticated });
  const stakeMut = trpc.token.stakeFarm.useMutation({
    onSuccess: () => { toast.success("Liquidity added to farm."); refetch(); setAmounts({}); setActivePool(null); },
    onError: (e: any) => toast.error(e.message),
  });
  const harvestMut = trpc.token.harvestFarm.useMutation({
    onSuccess: () => { toast.success("Rewards claimed to wallet."); refetch(); },
    onError: (e: any) => toast.error(e.message),
  });

  const totalEarned = (positions || []).reduce((s: number, p: any) => s + Number(p.pendingRewards || 0), 0);
  const totalStaked = (positions || []).reduce((s: number, p: any) => s + Number(p.lpTokenAmount || 0), 0);

  return (
    <div className="min-h-screen">
      <PageHeader title="Yield Farming" subtitle="Provide liquidity and earn rewards across DeFi pools"/>
      <div className="container py-6 max-w-6xl">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label:"Total TVL", value:"$50.2M", icon:<DollarSign className="w-4 h-4"/>, color:"text-green-400" },
            { label:"Your Staked", value:isAuthenticated ? `${totalStaked.toFixed(2)} LP` : "—", icon:<Lock className="w-4 h-4"/>, color:"text-purple-400" },
            { label:"Pending Rewards", value:isAuthenticated ? `${totalEarned.toFixed(4)} SKY` : "—", icon:<Award className="w-4 h-4"/>, color:"text-yellow-400" },
            { label:"Active Pools", value:"5", icon:<Droplets className="w-4 h-4"/>, color:"text-cyan-400" },
          ].map(s => (
            <div key={s.label} className="rounded-xl bg-white/5 border border-white/10 p-4">
              <div className={`${s.color} mb-2`}>{s.icon}</div>
              <div className="text-xl font-bold font-mono">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <Tabs defaultValue="pools">
          <TabsList className="bg-white/5 border border-white/10 mb-4">
            <TabsTrigger value="pools">Pools</TabsTrigger>
            <TabsTrigger value="positions">My Positions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="pools">
            <div className="space-y-3">
              {POOLS.map(pool => (
                <div key={pool.id} className="rounded-xl bg-white/5 border border-white/10 p-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold">{pool.name}</span>
                        <Badge className="text-xs" style={{backgroundColor:`${pool.color}20`,color:pool.color,border:`1px solid ${pool.color}40`}}>{pool.protocol}</Badge>
                        <Badge variant={pool.risk==="Low"?"secondary":pool.risk==="Medium"?"outline":"destructive"} className="text-xs">{pool.risk}</Badge>
                      </div>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>TVL: <span className="text-foreground font-mono">{pool.tvl}</span></span>
                        <span>APY: <span className="font-bold" style={{color:pool.color}}>{pool.apy}%</span></span>
                      </div>
                    </div>
                    {isAuthenticated && (
                      <div className="flex items-center gap-2">
                        {activePool === pool.id ? (
                          <>
                            <Input value={amounts[pool.id]||""} onChange={e=>setAmounts(p=>({...p,[pool.id]:e.target.value}))}
                              placeholder="LP amount" className="w-28 h-8 bg-white/5 border-white/10 text-sm"/>
                            <Button size="sm" onClick={()=>stakeMut.mutate({poolId:pool.id,lpTokenAmount:Number(amounts[pool.id]||0)})}
                              disabled={stakeMut.isPending||!amounts[pool.id]} className="h-8 text-xs" style={{backgroundColor:pool.color}}>
                              {stakeMut.isPending?<RefreshCw className="w-3 h-3 animate-spin"/>:<><Plus className="w-3 h-3 mr-1"/>Stake</>}
                            </Button>
                            <Button size="sm" variant="ghost" onClick={()=>setActivePool(null)} className="h-8 text-xs">Cancel</Button>
                          </>
                        ) : (
                          <Button size="sm" onClick={()=>setActivePool(pool.id)} className="h-8 text-xs bg-white/10 hover:bg-white/20">
                            <Zap className="w-3 h-3 mr-1"/>Farm
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {!isAuthenticated && (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Login to start farming</p>
                <Button asChild className="bg-green-600 hover:bg-green-500"><a href={getLoginUrl()}>Login</a></Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="positions">
            {!isAuthenticated ? (
              <div className="text-center py-12">
                <Sprout className="w-12 h-12 text-green-400 mx-auto mb-3"/>
                <p className="text-muted-foreground mb-4">Login to view your farming positions</p>
                <Button asChild className="bg-green-600 hover:bg-green-500"><a href={getLoginUrl()}>Login</a></Button>
              </div>
            ) : !positions || (positions as any[]).length === 0 ? (
              <div className="text-center py-12">
                <Sprout className="w-12 h-12 text-green-400/40 mx-auto mb-3"/>
                <p className="text-muted-foreground">No active farming positions</p>
                <p className="text-sm text-muted-foreground mt-1">Add liquidity to a pool to start earning</p>
              </div>
            ) : (
              <div className="space-y-3">
                {(positions as any[]).map((pos, i) => (
                  <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-4 flex flex-wrap items-center gap-4">
                    <div className="flex-1">
                      <div className="font-bold">{pos.poolId || "Pool"}</div>
                      <div className="text-sm text-muted-foreground">
                        Staked: <span className="text-foreground font-mono">{Number(pos.lpTokenAmount||0).toFixed(4)} LP</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400 font-bold font-mono">{Number(pos.pendingRewards||0).toFixed(6)} SKY</div>
                      <div className="text-xs text-muted-foreground">Pending Rewards</div>
                    </div>
                    <Button size="sm" onClick={()=>harvestMut.mutate({poolId:pos.poolId||""})} disabled={harvestMut.isPending}
                      className="bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-300 border border-yellow-500/30">
                      {harvestMut.isPending?<RefreshCw className="w-3 h-3 animate-spin"/>:<><Award className="w-3 h-3 mr-1"/>Harvest</>}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                <h3 className="font-bold mb-4 text-sm">APY Trend (30d)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={CHART_DATA}>
                    <defs><linearGradient id="apyGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="oklch(0.72 0.22 295)" stopOpacity={0.3}/><stop offset="95%" stopColor="oklch(0.72 0.22 295)" stopOpacity={0}/></linearGradient></defs>
                    <XAxis dataKey="day" tick={{fontSize:10}} stroke="transparent" tickLine={false}/>
                    <YAxis tick={{fontSize:10}} stroke="transparent" tickLine={false}/>
                    <Tooltip contentStyle={{background:"#1a1a2e",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"8px"}} formatter={(v:any)=>[`${Number(v).toFixed(1)}%`,"APY"]}/>
                    <Area type="monotone" dataKey="apy" stroke="oklch(0.72 0.22 295)" fill="url(#apyGrad)" strokeWidth={2}/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                <h3 className="font-bold mb-4 text-sm">TVL Trend (30d)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={CHART_DATA}>
                    <defs><linearGradient id="tvlGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="oklch(0.76 0.19 185)" stopOpacity={0.3}/><stop offset="95%" stopColor="oklch(0.76 0.19 185)" stopOpacity={0}/></linearGradient></defs>
                    <XAxis dataKey="day" tick={{fontSize:10}} stroke="transparent" tickLine={false}/>
                    <YAxis tick={{fontSize:10}} stroke="transparent" tickLine={false} tickFormatter={v=>`$${(v/1e6).toFixed(1)}M`}/>
                    <Tooltip contentStyle={{background:"#1a1a2e",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"8px"}} formatter={(v:any)=>[`$${(Number(v)/1e6).toFixed(2)}M`,"TVL"]}/>
                    <Area type="monotone" dataKey="tvl" stroke="oklch(0.76 0.19 185)" fill="url(#tvlGrad)" strokeWidth={2}/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
