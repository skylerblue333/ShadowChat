import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import {
  Zap, TrendingUp, Users, Clock, Award, Coins,
  Cpu, BarChart3, Shield, RefreshCw, Star, Lock
} from "lucide-react";

const TRUMP_PRICE_MOCK = 8.42;
const MINING_RATES: Record<string, { rate: number; power: number; cost: number; label: string; color: string }> = {
  basic:    { rate: 0.001, power: 10,  cost: 0,    label: "Basic Miner",    color: "text-slate-400" },
  silver:   { rate: 0.005, power: 50,  cost: 100,  label: "Silver Rig",     color: "text-slate-300" },
  gold:     { rate: 0.015, power: 150, cost: 500,  label: "Gold Rig",       color: "text-yellow-400" },
  platinum: { rate: 0.05,  power: 500, cost: 2000, label: "Platinum Rig",   color: "text-cyan-400" },
  quantum:  { rate: 0.20,  power: 2000,cost: 10000,label: "Quantum Rig",    color: "text-purple-400" },
};

const LEADERBOARD = [
  { rank: 1, name: "TrumpWhale", mined: 48291.44, rig: "quantum" },
  { rank: 2, name: "MAGA_Miner", mined: 31042.88, rig: "quantum" },
  { rank: 3, name: "GoldRigger", mined: 18774.21, rig: "platinum" },
  { rank: 4, name: "CryptoKing", mined: 12003.55, rig: "platinum" },
  { rank: 5, name: "SkyMiner99", mined: 8441.20, rig: "gold" },
];

const BOOSTS = [
  { id: "referral", name: "Referral Boost", mult: 1.5, cost: 0, desc: "Invite 3 friends to unlock", icon: "👥" },
  { id: "stake",    name: "Stake Boost",    mult: 2.0, cost: 1000, desc: "Stake 1000 SKY444 for 2x", icon: "🔒" },
  { id: "nft",      name: "NFT Boost",      mult: 3.0, cost: 0, desc: "Hold a SkyNFT for 3x", icon: "🎨" },
  { id: "premium",  name: "Premium Boost",  mult: 5.0, cost: 500, desc: "Subscribe for 5x rate", icon: "⭐" },
];

export default function TrumpMining() {
  const { isAuthenticated } = useAuth();
  const [mined, setMined] = useState(0.00);
  const [isMining, setIsMining] = useState(false);
  const [rig, setRig] = useState("basic");
  const [activeBoosts, setActiveBoosts] = useState<string[]>([]);
  const [hashRate, setHashRate] = useState(0);
  const [blockProgress, setBlockProgress] = useState(0);
  const [blocksFound, setBlocksFound] = useState(0);
  const [totalHashPower, setTotalHashPower] = useState(0);
  const [networkDiff, setNetworkDiff] = useState(42.7);
  const [tab, setTab] = useState("mine");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hashAnimRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [displayHash, setDisplayHash] = useState("0x0000000000000000");
  const [rigBalance, setRigBalance] = useState(500); // SKY444 to buy rigs

  const currentRig = MINING_RATES[rig];
  const boostMult = activeBoosts.reduce((m, b) => {
    const boost = BOOSTS.find(bo => bo.id === b);
    return m * (boost?.mult || 1);
  }, 1);
  const effectiveRate = currentRig.rate * boostMult;
  const dailyEarnings = effectiveRate * 86400;
  const dailyUSD = dailyEarnings * TRUMP_PRICE_MOCK;

  const generateHash = () => {
    const chars = "0123456789abcdef";
    return "0x" + Array.from({ length: 16 }, () => chars[Math.floor(Math.random() * 16)]).join("");
  };

  const handleLogin = () => {
    // Use window.location.href for server-side redirect to avoid pushState security error
    window.location.href = getLoginUrl();
  };

  const startMining = () => {
    if (!isAuthenticated) { toast.error("Sign in to start mining"); return; }
    setIsMining(true);
    setHashRate(currentRig.power);
    toast.success(`⛏️ Mining started with ${currentRig.label}!`);

    // Hash animation
    hashAnimRef.current = setInterval(() => {
      setDisplayHash(generateHash());
    }, 100);

    // Mining interval
    intervalRef.current = setInterval(() => {
      setMined(m => parseFloat((m + effectiveRate / 10).toFixed(6)));
      setBlockProgress(p => {
        const next = p + (currentRig.power / 10000);
        if (next >= 100) {
          setBlocksFound(b => b + 1);
          setMined(m => parseFloat((m + effectiveRate * 10).toFixed(6)));
          toast.success("⛏️ Block found! Bonus reward!");
          return 0;
        }
        return next;
      });
      setTotalHashPower(h => h + currentRig.power);
    }, 100);
  };

  const stopMining = () => {
    setIsMining(false);
    setHashRate(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (hashAnimRef.current) clearInterval(hashAnimRef.current);
    setDisplayHash("0x0000000000000000");
    toast.info("Mining stopped");
  };

  const upgradeRig = (rigId: string) => {
    const r = MINING_RATES[rigId];
    if (rigBalance < r.cost) { toast.error(`Need ${r.cost} SKY444 to upgrade`); return; }
    if (isMining) stopMining();
    setRigBalance(b => b - r.cost);
    setRig(rigId);
    toast.success(`Upgraded to ${r.label}!`);
  };

  const activateBoost = (boostId: string) => {
    if (activeBoosts.includes(boostId)) return;
    const boost = BOOSTS.find(b => b.id === boostId);
    if (!boost) return;
    if (boost.cost > 0 && rigBalance < boost.cost) { toast.error(`Need ${boost.cost} SKY444`); return; }
    if (boost.cost > 0) setRigBalance(b => b - boost.cost);
    setActiveBoosts(prev => [...prev, boostId]);
    toast.success(`${boost.name} activated! ${boost.mult}x boost!`);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (hashAnimRef.current) clearInterval(hashAnimRef.current);
    };
  }, []);

  // Simulate network difficulty changes
  useEffect(() => {
    const t = setInterval(() => {
      setNetworkDiff(d => parseFloat((d + (Math.random() - 0.5) * 0.5).toFixed(1)));
    }, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#07050f] text-white">
      {/* Hero */}
      <div className="relative overflow-hidden py-10 px-4" style={{ background: "linear-gradient(135deg, #1a0a00 0%, #2a1000 50%, #1a0a00 100%)" }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,165,0,0.15),transparent_60%)]" />
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="text-6xl mb-3">🇺🇸</div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-red-400 via-white to-blue-400 bg-clip-text text-transparent mb-2">
            TRUMP MINING
          </h1>
          <p className="text-orange-300/70 text-sm mb-4">Mine TRUMP token · Earn while you hold · No farm needed</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 text-sm text-orange-300">
              💰 TRUMP Price: ${TRUMP_PRICE_MOCK.toFixed(2)}
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5 text-sm text-red-300">
              🌐 Network Difficulty: {networkDiff}T
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-sm text-blue-300">
              ⛏️ Active Miners: 14,832
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-white/5 border border-white/10 mb-6">
            <TabsTrigger value="mine" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-300">⛏️ Mine</TabsTrigger>
            <TabsTrigger value="rigs" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-300">🖥️ Rigs</TabsTrigger>
            <TabsTrigger value="boosts" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">⚡ Boosts</TabsTrigger>
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">🏆 Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="mine">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Main mining panel */}
              <div className="lg:col-span-2 space-y-4">
                {/* Mining display */}
                <div className="bg-[#0e0a1a] border border-orange-500/20 rounded-2xl p-6">
                  <div className="text-center mb-6">
                    <div className={`text-6xl mb-2 transition-all duration-300 ${isMining ? "animate-bounce" : ""}`}>
                      {isMining ? "⛏️" : "🔒"}
                    </div>
                    <div className="text-4xl font-black text-orange-400 tabular-nums">
                      {mined.toFixed(6)} TRUMP
                    </div>
                    <div className="text-slate-500 text-sm mt-1">
                      ≈ ${(mined * TRUMP_PRICE_MOCK).toFixed(2)} USD
                    </div>
                  </div>

                  {/* Hash display */}
                  <div className="bg-black/40 rounded-xl p-3 mb-4 font-mono text-xs text-center">
                    <span className="text-slate-600">Current Hash: </span>
                    <span className={`${isMining ? "text-green-400" : "text-slate-700"}`}>{displayHash}</span>
                  </div>

                  {/* Block progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Block Progress</span>
                      <span>{blockProgress.toFixed(1)}%</span>
                    </div>
                    <Progress value={blockProgress} className="h-2 bg-white/5" />
                    <div className="text-xs text-slate-600 mt-1">Blocks found: {blocksFound}</div>
                  </div>

                  {!isAuthenticated ? (
                    <Button
                      className="w-full h-14 text-lg font-black bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white"
                      onClick={handleLogin}
                    >
                      <><Lock className="w-5 h-5 mr-2" />Sign In to Mine</>
                    </Button>
                  ) : (
                    <Button
                      className={`w-full h-14 text-lg font-black transition-all ${isMining ? "bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30" : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-black"}`}
                      onClick={isMining ? stopMining : startMining}
                    >
                      {isMining ? <><RefreshCw className="w-5 h-5 mr-2 animate-spin" />Stop Mining</> : <><Zap className="w-5 h-5 mr-2" />Start Mining</>}
                    </Button>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Hash Rate", value: `${hashRate} H/s`, icon: Cpu, color: "text-green-400" },
                    { label: "Daily Earnings", value: `${dailyEarnings.toFixed(4)} TRUMP`, icon: TrendingUp, color: "text-orange-400" },
                    { label: "Daily USD", value: `$${dailyUSD.toFixed(2)}`, icon: Coins, color: "text-yellow-400" },
                    { label: "Boost Multiplier", value: `${boostMult.toFixed(1)}x`, icon: Zap, color: "text-purple-400" },
                  ].map(stat => (
                    <div key={stat.label} className="bg-[#0e0a1a] border border-white/5 rounded-xl p-3 flex items-center gap-3">
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      <div>
                        <p className="text-white font-bold text-sm">{stat.value}</p>
                        <p className="text-slate-600 text-xs">{stat.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Side panel */}
              <div className="space-y-4">
                <div className="bg-[#0e0a1a] border border-white/5 rounded-2xl p-4">
                  <h3 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2"><BarChart3 className="w-4 h-4" />Current Rig</h3>
                  <div className="text-center py-3">
                    <div className="text-3xl mb-2">🖥️</div>
                    <p className={`font-bold ${currentRig.color}`}>{currentRig.label}</p>
                    <p className="text-slate-500 text-xs mt-1">{currentRig.power} H/s</p>
                    <p className="text-orange-400 text-xs">{currentRig.rate}/sec base rate</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2 text-center">
                    <p className="text-xs text-slate-500">SKY444 Balance</p>
                    <p className="text-yellow-400 font-bold">{rigBalance}</p>
                  </div>
                </div>

                <div className="bg-[#0e0a1a] border border-white/5 rounded-2xl p-4">
                  <h3 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2"><Shield className="w-4 h-4" />Active Boosts</h3>
                  {activeBoosts.length === 0 ? (
                    <p className="text-slate-600 text-xs text-center py-3">No active boosts. Go to Boosts tab!</p>
                  ) : (
                    <div className="space-y-2">
                      {activeBoosts.map(bid => {
                        const b = BOOSTS.find(bo => bo.id === bid);
                        return b ? (
                          <div key={bid} className="flex items-center justify-between text-xs bg-purple-500/10 rounded-lg px-2 py-1.5">
                            <span>{b.icon} {b.name}</span>
                            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-[10px]">{b.mult}x</Badge>
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>

                <div className="bg-[#0e0a1a] border border-orange-500/10 rounded-2xl p-4">
                  <h3 className="text-sm font-semibold text-orange-400 mb-2">💡 Mining Tips</h3>
                  <ul className="space-y-1.5 text-xs text-slate-500">
                    <li>• Upgrade rigs for higher hash rates</li>
                    <li>• Stack boosts for exponential gains</li>
                    <li>• Refer friends for free 1.5x boost</li>
                    <li>• Stake SKY444 for 2x multiplier</li>
                    <li>• Hold NFTs for 3x boost</li>
                    <li>• TRUMP earnings auto-compound</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rigs">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(MINING_RATES).map(([rigId, rigData]) => (
                <Card key={rigId} className={`bg-[#0e0a1a] border transition-all ${rig === rigId ? "border-orange-500/40 shadow-lg shadow-orange-900/20" : "border-white/5 hover:border-white/10"}`}>
                  <CardContent className="p-5">
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-2">🖥️</div>
                      <h3 className={`font-bold text-lg ${rigData.color}`}>{rigData.label}</h3>
                      {rig === rigId && <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs mt-1">Active</Badge>}
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Hash Rate</span>
                        <span className="text-white font-semibold">{rigData.power} H/s</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Base Rate</span>
                        <span className="text-orange-400 font-semibold">{rigData.rate} TRUMP/s</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Daily (base)</span>
                        <span className="text-green-400 font-semibold">{(rigData.rate * 86400).toFixed(2)} TRUMP</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Daily USD</span>
                        <span className="text-yellow-400 font-semibold">${(rigData.rate * 86400 * TRUMP_PRICE_MOCK).toFixed(2)}</span>
                      </div>
                    </div>
                    {rig === rigId ? (
                      <Button className="w-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-sm" disabled>Currently Active</Button>
                    ) : rigData.cost === 0 ? (
                      <Button className="w-full bg-green-500/20 text-green-400 border border-green-500/30 text-sm" onClick={() => upgradeRig(rigId)}>Free — Activate</Button>
                    ) : (
                      <Button className={`w-full text-sm ${rigBalance >= rigData.cost ? "bg-gradient-to-r from-orange-500/20 to-yellow-500/20 text-yellow-300 border border-yellow-500/30 hover:from-orange-500/30 hover:to-yellow-500/30" : "bg-white/5 text-slate-600 border border-white/5"}`} onClick={() => upgradeRig(rigId)} disabled={rigBalance < rigData.cost}>
                        {rigBalance >= rigData.cost ? `Upgrade — ${rigData.cost} SKY444` : <><Lock className="w-3 h-3 mr-1" />{rigData.cost} SKY444 needed</>}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="boosts">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {BOOSTS.map(boost => (
                <Card key={boost.id} className={`bg-[#0e0a1a] border transition-all ${activeBoosts.includes(boost.id) ? "border-purple-500/40" : "border-white/5 hover:border-white/10"}`}>
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3 mb-4">
                      <span className="text-3xl">{boost.icon}</span>
                      <div>
                        <h3 className="font-bold text-white">{boost.name}</h3>
                        <p className="text-slate-500 text-xs mt-0.5">{boost.desc}</p>
                      </div>
                      <Badge className="ml-auto bg-purple-500/20 text-purple-400 border-purple-500/30 shrink-0">{boost.mult}x</Badge>
                    </div>
                    {activeBoosts.includes(boost.id) ? (
                      <Button className="w-full bg-purple-500/20 text-purple-400 border border-purple-500/30" disabled>✓ Active</Button>
                    ) : (
                      <Button className="w-full bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-sm" onClick={() => activateBoost(boost.id)}>
                        {boost.cost > 0 ? `Activate — ${boost.cost} SKY444` : "Activate Free"}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-4 p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl">
              <p className="text-orange-300 font-semibold text-sm mb-1">⚡ Stack All Boosts</p>
              <p className="text-orange-400/60 text-xs">Activate all 4 boosts for a combined {BOOSTS.reduce((m,b) => m*b.mult, 1)}x multiplier. At Quantum Rig + all boosts, you earn {(MINING_RATES.quantum.rate * BOOSTS.reduce((m,b) => m*b.mult, 1) * 86400).toFixed(2)} TRUMP/day (${(MINING_RATES.quantum.rate * BOOSTS.reduce((m,b) => m*b.mult, 1) * 86400 * TRUMP_PRICE_MOCK).toFixed(2)}/day).</p>
            </div>
          </TabsContent>

          <TabsContent value="leaderboard">
            <div className="bg-[#0e0a1a] border border-white/5 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-white/5">
                <h3 className="font-bold text-white flex items-center gap-2"><Award className="w-4 h-4 text-yellow-400" />Top TRUMP Miners</h3>
                <p className="text-slate-500 text-xs mt-0.5">All-time leaderboard · Updated every 10 minutes</p>
              </div>
              <div className="divide-y divide-white/5">
                {LEADERBOARD.map(entry => (
                  <div key={entry.rank} className="flex items-center gap-4 p-4 hover:bg-white/3 transition-colors">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${entry.rank === 1 ? "bg-yellow-500/20 text-yellow-400" : entry.rank === 2 ? "bg-slate-400/20 text-slate-300" : entry.rank === 3 ? "bg-orange-700/20 text-orange-400" : "bg-white/5 text-slate-500"}`}>
                      {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : entry.rank}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-semibold text-sm">{entry.name}</p>
                      <p className={`text-xs ${MINING_RATES[entry.rig]?.color || "text-slate-500"}`}>{MINING_RATES[entry.rig]?.label}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-orange-400 font-bold text-sm">{entry.mined.toLocaleString()} TRUMP</p>
                      <p className="text-slate-600 text-xs">${(entry.mined * TRUMP_PRICE_MOCK).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
