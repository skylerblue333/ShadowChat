import { useState } from "react";
import {
  Globe,
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Users,
  TrendingUp,
  DollarSign,
  Camera,
  FlaskConical,
  Zap,
  ChevronRight,
  Bot,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

const PERSONAS = [
  { id: "nova", name: "NOVA", role: "Trend Amplifier", active: true, posts: 847, influence: 92 },
  { id: "cipher", name: "CIPHER", role: "Market Analyst", active: true, posts: 412, influence: 78 },
  { id: "prism", name: "PRISM", role: "Social Connector", active: true, posts: 1240, influence: 88 },
  { id: "echo", name: "ECHO", role: "Content Creator", active: false, posts: 203, influence: 65 },
  { id: "flux", name: "FLUX", role: "Chaos Agent", active: false, posts: 89, influence: 71 },
];

const SCENARIOS = [
  { id: "viral", name: "Viral Trend Spike", desc: "Inject a viral hashtag and watch feed + engagement respond", risk: "low" },
  { id: "market_crash", name: "Market Crash Simulation", desc: "Drop SKYCOIN price 40% and observe user behavior", risk: "medium" },
  { id: "user_surge", name: "10x User Surge", desc: "Simulate 10x concurrent users joining simultaneously", risk: "medium" },
  { id: "payment_storm", name: "Payment Storm", desc: "100 simultaneous payment actions — test escrow + rate limits", risk: "high" },
  { id: "ai_overload", name: "AI Overload", desc: "Max out AI call budget and test fallback behavior", risk: "high" },
];

const SNAPSHOTS = [
  { id: "snap1", label: "Pre-launch baseline", tick: 0, ts: "2025-01-10 09:00" },
  { id: "snap2", label: "After first 100 users", tick: 1440, ts: "2025-01-11 14:22" },
  { id: "snap3", label: "Viral event #SKY444", tick: 8760, ts: "2025-01-15 18:45" },
  { id: "snap4", label: "Current state", tick: 12441, ts: "Now" },
];

export default function WorldSimulationControl() {
  const [tick, setTick] = useState(12441);
  const [speed, setSpeed] = useState([1]);
  const [running, setRunning] = useState(false);
  const [personas, setPersonas] = useState(PERSONAS);
  const [trendInput, setTrendInput] = useState("");

  const tickMutation = trpc.simulation.tick.useMutation({
    onSuccess: () => {
      setTick((t) => t + 1);
      toast.success("World tick advanced");
    },
  });

  const togglePersona = (id: string) => {
    setPersonas((prev) => prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));
    const p = personas.find((p) => p.id === id);
    toast.success(`${p?.name} ${p?.active ? "deactivated" : "activated"}`);
  };

  const injectTrend = () => {
    if (!trendInput.trim()) return;
    toast.success(`Trend injected: #${trendInput.replace(/^#/, "")}`);
    setTrendInput("");
  };

  const runScenario = (name: string) => {
    toast.success(`Scenario started: ${name}`);
  };

  return (
    <div className="min-h-screen bg-[oklch(0.08_0.02_270)] text-white">
      <div className="border-b border-white/10 bg-[oklch(0.1_0.03_270)]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-[oklch(0.75_0.2_145)]" />
            <div>
              <h1 className="text-lg font-bold">World Simulation Control</h1>
              <p className="text-xs text-white/40">Timeline · Personas · Trend injection · Scenarios · Snapshots</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[oklch(0.75_0.2_145)] border-[oklch(0.75_0.2_145)]/30 text-xs">
              Tick #{tick.toLocaleString()}
            </Badge>
            <Button
              size="sm"
              variant="outline"
              className="text-xs border-white/20 text-white/60 hover:text-white"
              onClick={() => tickMutation.mutate()}
              disabled={tickMutation.isPending}
            >
              <SkipForward className="w-3 h-3 mr-1" />
              Manual Tick
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Timeline controller */}
        <Card className="bg-white/5 border-white/10 mb-6">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm font-semibold text-white/80">Simulation Timeline</div>
                <div className="text-xs text-white/40">Tick #{tick.toLocaleString()} — {Math.floor(tick / 1440)} days elapsed</div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs border-white/20 text-white/60 hover:text-white"
                  onClick={() => setRunning((r) => !r)}
                >
                  {running ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
                  {running ? "Pause" : "Run"}
                </Button>
                <Button size="sm" variant="outline" className="text-xs border-white/20 text-white/60 hover:text-white">
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Reset
                </Button>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-white/40 mb-1">
                  <span>Simulation Speed</span>
                  <span>{speed[0]}x</span>
                </div>
                <Slider value={speed} onValueChange={setSpeed} min={1} max={100} step={1} className="w-full" />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {SNAPSHOTS.map((snap) => (
                  <button
                    key={snap.id}
                    onClick={() => {
                      setTick(snap.tick);
                      toast.success(`Restored snapshot: ${snap.label}`);
                    }}
                    className="shrink-0 text-left p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <div className="text-xs font-medium text-white/80">{snap.label}</div>
                    <div className="text-[10px] text-white/30 font-mono">{snap.ts}</div>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="personas">
          <TabsList className="bg-white/5 border border-white/10 mb-6">
            <TabsTrigger value="personas" className="text-xs data-[state=active]:bg-white/10">
              <Bot className="w-3 h-3 mr-1" /> Personas
            </TabsTrigger>
            <TabsTrigger value="trends" className="text-xs data-[state=active]:bg-white/10">
              <TrendingUp className="w-3 h-3 mr-1" /> Trend Injection
            </TabsTrigger>
            <TabsTrigger value="users" className="text-xs data-[state=active]:bg-white/10">
              <Users className="w-3 h-3 mr-1" /> Synthetic Users
            </TabsTrigger>
            <TabsTrigger value="economy" className="text-xs data-[state=active]:bg-white/10">
              <DollarSign className="w-3 h-3 mr-1" /> Economy Flow
            </TabsTrigger>
            <TabsTrigger value="scenarios" className="text-xs data-[state=active]:bg-white/10">
              <FlaskConical className="w-3 h-3 mr-1" /> Scenarios
            </TabsTrigger>
          </TabsList>

          {/* Personas */}
          <TabsContent value="personas">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {personas.map((p) => (
                <Card key={p.id} className={`border transition-all ${p.active ? "bg-white/8 border-[oklch(0.75_0.2_145)]/30" : "bg-white/5 border-white/10"}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${p.active ? "bg-[oklch(0.75_0.2_145)]/20 text-[oklch(0.75_0.2_145)]" : "bg-white/10 text-white/40"}`}>
                          {p.name[0]}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">{p.name}</div>
                          <div className="text-xs text-white/40">{p.role}</div>
                        </div>
                      </div>
                      <button onClick={() => togglePersona(p.id)} className="transition-transform active:scale-95">
                        <div className={`w-10 h-5 rounded-full transition-colors relative ${p.active ? "bg-[oklch(0.75_0.2_145)]" : "bg-white/20"}`}>
                          <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${p.active ? "translate-x-5" : "translate-x-0.5"}`} />
                        </div>
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-white/5 rounded p-2">
                        <div className="text-white/40">Posts</div>
                        <div className="font-bold text-white">{p.posts.toLocaleString()}</div>
                      </div>
                      <div className="bg-white/5 rounded p-2">
                        <div className="text-white/40">Influence</div>
                        <div className="font-bold text-white">{p.influence}/100</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Trend Injection */}
          <TabsContent value="trends">
            <Card className="bg-white/5 border-white/10 mb-4">
              <CardContent className="p-4">
                <div className="text-sm font-semibold text-white/80 mb-3">Inject Trend</div>
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 border border-white/10">
                    <span className="text-white/40">#</span>
                    <input
                      value={trendInput}
                      onChange={(e) => setTrendInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && injectTrend()}
                      placeholder="hashtag or topic"
                      className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
                    />
                  </div>
                  <Button size="sm" onClick={injectTrend} className="bg-[oklch(0.75_0.2_145)]/20 text-[oklch(0.75_0.2_145)] border-[oklch(0.75_0.2_145)]/30 hover:bg-[oklch(0.75_0.2_145)]/30">
                    <Zap className="w-3 h-3 mr-1" /> Inject
                  </Button>
                </div>
              </CardContent>
            </Card>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {["#SKY444", "#AIAgents", "#Web3OS", "#ShadowChat", "#SKYCOIN", "#ChatToEarn", "#MatchSpace", "#WorldBrain"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => { toast.success(`Trend injected: ${tag}`); }}
                  className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm text-[oklch(0.8_0.15_200)] font-mono"
                >
                  {tag}
                </button>
              ))}
            </div>
          </TabsContent>

          {/* Synthetic Users */}
          <TabsContent value="users">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-sm text-white/80">Synthetic User Generator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {[
                    { label: "Active Synthetic Users", value: "47" },
                    { label: "Actions Today", value: "1,240" },
                    { label: "Avg Trust Score", value: "72" },
                    { label: "Wallet Balance (avg)", value: "240 SKY" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white/5 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-white">{stat.value}</div>
                      <div className="text-[10px] text-white/40">{stat.label}</div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-xs border-white/20 text-white/60 hover:text-white" onClick={() => toast.success("10 synthetic users spawned")}>
                    Spawn 10 Users
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs border-white/20 text-white/60 hover:text-white" onClick={() => toast.success("100 synthetic users spawned")}>
                    Spawn 100 Users
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs border-[oklch(0.7_0.2_25)]/40 text-[oklch(0.7_0.2_25)] hover:bg-[oklch(0.7_0.2_25)]/10" onClick={() => toast.success("All synthetic users removed")}>
                    Clear All
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Economy Flow */}
          <TabsContent value="economy">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Total SKYCOIN Circulation", value: "4,200,000", change: "+2.4%" },
                { label: "Treasury Balance", value: "840,000 SKY", change: "+0.8%" },
                { label: "Daily Transaction Volume", value: "$124,400", change: "+18%" },
                { label: "Active Wallets", value: "8,420", change: "+340" },
              ].map((stat) => (
                <Card key={stat.label} className="bg-white/5 border-white/10">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-white/40">{stat.label}</div>
                      <div className="text-xl font-bold text-white mt-1">{stat.value}</div>
                    </div>
                    <Badge variant="outline" className="text-[oklch(0.75_0.2_145)] border-[oklch(0.75_0.2_145)]/30 text-xs">
                      {stat.change}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Scenarios */}
          <TabsContent value="scenarios">
            <div className="space-y-3">
              {SCENARIOS.map((sc) => (
                <Card key={sc.id} className="bg-white/5 border-white/10">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-white/90">{sc.name}</span>
                        <Badge
                          variant="outline"
                          className={`text-[9px] ${sc.risk === "low" ? "text-[oklch(0.75_0.2_145)] border-[oklch(0.75_0.2_145)]/30" : sc.risk === "medium" ? "text-[oklch(0.85_0.18_90)] border-[oklch(0.85_0.18_90)]/30" : "text-[oklch(0.7_0.2_25)] border-[oklch(0.7_0.2_25)]/30"}`}
                        >
                          {sc.risk} risk
                        </Badge>
                      </div>
                      <p className="text-xs text-white/40">{sc.desc}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="ml-4 text-xs border-white/20 text-white/60 hover:text-white shrink-0"
                      onClick={() => runScenario(sc.name)}
                    >
                      <Play className="w-3 h-3 mr-1" /> Run
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
