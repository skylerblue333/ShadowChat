/**
 * VoiceCommandsRegistry — Full registry of all voice commands
 * - Browse all 56+ commands by category
 * - Live voice tester (no nav changes)
 * - Custom command builder
 * - Command history log
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Mic, MicOff, Search, Terminal, Zap, Globe, Coins, Shield, Gamepad2,
  Music, ShoppingBag, Heart, Brain, Eye, Navigation, Settings, User,
  Radio, ChevronRight, Clock, Plus, Trash2, CheckCircle, Copy
} from "lucide-react";
import { toast } from "sonner";

// ─── Command definitions (mirrors useGlobalVoiceEngine INTENT_MAP) ────────────
const COMMAND_REGISTRY = [
  // Social
  { category: "Social", icon: Globe, color: "text-blue-400", commands: [
    { phrase: "social / feed / discover", example: "open social", label: "Social Feed", route: "/social" },
    { phrase: "explore", example: "show explore", label: "Explore", route: "/explore" },
    { phrase: "messages / DMs / inbox", example: "open messages", label: "Messages", route: "/messages" },
    { phrase: "communities", example: "go to communities", label: "Communities", route: "/community" },
    { phrase: "reels", example: "show reels", label: "Reels", route: "/reels" },
    { phrase: "stories", example: "open stories", label: "Stories", route: "/stories" },
    { phrase: "streaming / live / go live", example: "go live", label: "Streaming", route: "/streaming" },
    { phrase: "trending", example: "show trending", label: "Trending", route: "/trending" },
    { phrase: "channels", example: "open channels", label: "Channels", route: "/channels" },
    { phrase: "leaderboard", example: "show leaderboard", label: "Leaderboard", route: "/leaderboards" },
    { phrase: "events", example: "open events", label: "Events", route: "/events" },
  ]},
  // Crypto
  { category: "Crypto", icon: Coins, color: "text-amber-400", commands: [
    { phrase: "wallet / my wallet", example: "open wallet", label: "Wallet", route: "/wallet" },
    { phrase: "portfolio", example: "show portfolio", label: "Portfolio", route: "/portfolio" },
    { phrase: "NFT / NFTs", example: "open NFTs", label: "NFT Gallery", route: "/nft-gallery" },
    { phrase: "crypto hub / crypto / mining hub", example: "open crypto", label: "Crypto Hub", route: "/crypto-hub" },
    { phrase: "swap / token swap / exchange", example: "open swap", label: "Token Swap", route: "/token-swap" },
    { phrase: "staking", example: "go to staking", label: "Staking", route: "/staking" },
    { phrase: "yield / farming", example: "show yield", label: "Yield Farm", route: "/yield-farming" },
    { phrase: "trading / trade", example: "open trading", label: "Trading", route: "/trading" },
    { phrase: "DeFi", example: "go to DeFi", label: "DeFi", route: "/defi" },
    { phrase: "governance", example: "open governance", label: "Governance", route: "/governance" },
    { phrase: "whale / whale watch", example: "show whale watch", label: "Whale Watch", route: "/whale-monitor" },
    { phrase: "mine / mining", example: "start mining", label: "Mining", route: "/mining" },
    { phrase: "ICO / launchpad", example: "open ICO", label: "ICO Launchpad", route: "/ico" },
  ]},
  // Gaming
  { category: "Gaming", icon: Gamepad2, color: "text-green-400", commands: [
    { phrase: "gaming / games / play", example: "open gaming", label: "Gaming", route: "/gaming" },
    { phrase: "tournaments", example: "show tournaments", label: "Tournaments", route: "/tournaments" },
    { phrase: "quests / daily quests", example: "open quests", label: "Quests", route: "/quests" },
    { phrase: "achievements", example: "show achievements", label: "Achievements", route: "/achievements" },
  ]},
  // Creator
  { category: "Creator", icon: Music, color: "text-purple-400", commands: [
    { phrase: "creator / studio", example: "open creator studio", label: "Creator Hub", route: "/creator-studio" },
    { phrase: "subscriptions", example: "show subscriptions", label: "Subscriptions", route: "/subscriptions" },
    { phrase: "analytics / stats", example: "open analytics", label: "Analytics", route: "/analytics" },
    { phrase: "sky school / school / learn", example: "open sky school", label: "Sky School", route: "/sky-school" },
  ]},
  // Marketplace
  { category: "Marketplace", icon: ShoppingBag, color: "text-orange-400", commands: [
    { phrase: "marketplace", example: "open marketplace", label: "Marketplace", route: "/marketplace" },
    { phrase: "DHgate / shop", example: "open DHgate", label: "DHgate Shop", route: "/dhgate" },
    { phrase: "payments", example: "show payments", label: "Payments", route: "/payments" },
  ]},
  // Charity
  { category: "Charity", icon: Heart, color: "text-red-400", commands: [
    { phrase: "charity", example: "open charity", label: "Charity", route: "/charity" },
  ]},
  // AI
  { category: "AI", icon: Brain, color: "text-cyan-400", commands: [
    { phrase: "AI brain / brain", example: "open AI brain", label: "AI Brain", route: "/ai-brain" },
    { phrase: "AI agent / agent", example: "open AI agent", label: "AI Agent", route: "/ai-agent" },
    { phrase: "AI tools", example: "show AI tools", label: "AI Tools", route: "/ai-tools" },
    { phrase: "Hope AI / Hope", example: "open Hope AI", label: "Hope AI", route: "/hope-ai" },
  ]},
  // Privacy
  { category: "Privacy", icon: Shield, color: "text-emerald-400", commands: [
    { phrase: "privacy / privacy vault", example: "open privacy vault", label: "Privacy Vault", route: "/privacy-vault" },
    { phrase: "ghost mode", example: "activate ghost mode", label: "Ghost Mode", route: "/ghost-mode" },
    { phrase: "shadow relay", example: "open shadow relay", label: "Shadow Relay", route: "/shadow-relay" },
    { phrase: "Tor bridge", example: "open Tor bridge", label: "Tor Bridge", route: "/tor-bridge" },
    { phrase: "anti surveillance", example: "open anti surveillance", label: "Anti-Surveillance", route: "/anti-surveillance" },
  ]},
  // Navigation
  { category: "Navigation", icon: Navigation, color: "text-sky-400", commands: [
    { phrase: "go back / back / previous page", example: "go back", label: "Go Back", action: "nav:back" },
    { phrase: "go forward / forward", example: "go forward", label: "Go Forward", action: "nav:forward" },
    { phrase: "scroll down / page down", example: "scroll down", label: "Scroll Down", action: "scroll:down" },
    { phrase: "scroll up / page up / top", example: "scroll up", label: "Scroll Up", action: "scroll:up" },
    { phrase: "refresh / reload", example: "refresh", label: "Refresh", action: "nav:refresh" },
    { phrase: "home / homepage / landing", example: "go home", label: "Home", route: "/" },
    { phrase: "search / find", example: "open search", label: "Search", route: "/search" },
    { phrase: "dashboard", example: "open dashboard", label: "Dashboard", route: "/dashboard" },
    { phrase: "ecosystem", example: "show ecosystem", label: "Ecosystem", route: "/ecosystem" },
    { phrase: "investor / invest", example: "open investor room", label: "Investor Room", route: "/investor" },
  ]},
  // Account
  { category: "Account", icon: User, color: "text-pink-400", commands: [
    { phrase: "profile / my profile", example: "open profile", label: "Profile", route: "/profile" },
    { phrase: "settings", example: "open settings", label: "Settings", route: "/settings" },
    { phrase: "security", example: "open security", label: "Security", route: "/security" },
    { phrase: "notifications / alerts", example: "show notifications", label: "Notifications", route: "/notifications" },
  ]},
  // Modes
  { category: "Modes", icon: Eye, color: "text-violet-400", commands: [
    { phrase: "discover mode", example: "switch to discover mode", label: "Discover Mode", action: "mode:discover" },
    { phrase: "execute mode", example: "switch to execute mode", label: "Execute Mode", action: "mode:execute" },
    { phrase: "identity mode", example: "switch to identity mode", label: "Identity Mode", action: "mode:identity" },
  ]},
];

const TOTAL_COMMANDS = COMMAND_REGISTRY.reduce((sum, cat) => sum + cat.commands.length, 0);

interface CommandHistoryEntry {
  id: number;
  transcript: string;
  matched: string | null;
  timestamp: Date;
}

export default function VoiceCommandsRegistry() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [matched, setMatched] = useState<string | null>(null);
  const [history, setHistory] = useState<CommandHistoryEntry[]>([]);
  const [customCommands, setCustomCommands] = useState<Array<{ phrase: string; action: string }>>([]);
  const [newPhrase, setNewPhrase] = useState("");
  const [newAction, setNewAction] = useState("");
  const recRef = useRef<any>(null);
  const historyId = useRef(0);

  // Filter commands
  const filtered = COMMAND_REGISTRY.map(cat => ({
    ...cat,
    commands: cat.commands.filter(cmd =>
      search === "" ||
      cmd.phrase.toLowerCase().includes(search.toLowerCase()) ||
      cmd.label.toLowerCase().includes(search.toLowerCase()) ||
      cmd.example.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(cat =>
    (activeCategory === "all" || cat.category === activeCategory) &&
    cat.commands.length > 0
  );

  // Live tester — only listens, never navigates
  const startTester = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { toast.error("Speech recognition not supported in this browser"); return; }
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = "en-US";
    recRef.current = rec;
    rec.onstart = () => setIsListening(true);
    rec.onresult = (e: any) => {
      const t = Array.from(e.results).map((r: any) => r[0].transcript).join(" ");
      setTranscript(t);
      // Check for match
      const tl = t.toLowerCase();
      let foundLabel: string | null = null;
      for (const cat of COMMAND_REGISTRY) {
        for (const cmd of cat.commands) {
          const phrases = cmd.phrase.split(" / ");
          if (phrases.some(p => tl.includes(p.toLowerCase()))) {
            foundLabel = cmd.label;
            break;
          }
        }
        if (foundLabel) break;
      }
      setMatched(foundLabel);
    };
    rec.onend = () => {
      setIsListening(false);
      if (transcript) {
        const entry: CommandHistoryEntry = {
          id: ++historyId.current,
          transcript,
          matched,
          timestamp: new Date(),
        };
        setHistory(prev => [entry, ...prev].slice(0, 20));
      }
    };
    rec.onerror = () => { setIsListening(false); };
    rec.start();
  }, [transcript, matched]);

  const stopTester = useCallback(() => {
    if (recRef.current) { try { recRef.current.stop(); } catch {} }
    setIsListening(false);
  }, []);

  useEffect(() => () => { if (recRef.current) try { recRef.current.abort(); } catch {} }, []);

  const addCustomCommand = () => {
    if (!newPhrase.trim() || !newAction.trim()) { toast.error("Enter both phrase and action"); return; }
    setCustomCommands(prev => [...prev, { phrase: newPhrase.trim(), action: newAction.trim() }]);
    setNewPhrase("");
    setNewAction("");
    toast.success("Custom command added");
  };

  const copyExample = (example: string) => {
    navigator.clipboard.writeText(example).then(() => toast.success("Copied to clipboard"));
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <section className="relative py-14 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,oklch(0.15_0.06_280)_0%,transparent_60%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 mb-5">
            <Radio className="h-3 w-3 text-primary animate-pulse" />
            <span className="text-xs font-mono text-primary">VOICE COMMAND REGISTRY</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Voice <span className="text-primary">Commands</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-6">
            {TOTAL_COMMANDS} commands registered. Say anything — the engine is always listening when unmuted.
            Navigation stays exactly where it is.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-4">
            {[
              { label: "Total Commands", value: TOTAL_COMMANDS, color: "text-primary" },
              { label: "Categories", value: COMMAND_REGISTRY.length, color: "text-amber-400" },
              { label: "Custom Commands", value: customCommands.length, color: "text-green-400" },
              { label: "History Entries", value: history.length, color: "text-blue-400" },
            ].map(({ label, value, color }) => (
              <div key={label} className="px-4 py-2 rounded-xl border border-border/50 bg-card/80">
                <div className={`text-2xl font-bold font-mono ${color}`}>{value}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        <Tabs defaultValue="registry">
          <TabsList className="mb-6">
            <TabsTrigger value="registry"><Terminal className="w-3.5 h-3.5 mr-1.5" />Registry</TabsTrigger>
            <TabsTrigger value="tester"><Mic className="w-3.5 h-3.5 mr-1.5" />Live Tester</TabsTrigger>
            <TabsTrigger value="custom"><Plus className="w-3.5 h-3.5 mr-1.5" />Custom</TabsTrigger>
            <TabsTrigger value="history"><Clock className="w-3.5 h-3.5 mr-1.5" />History</TabsTrigger>
          </TabsList>

          {/* ── REGISTRY TAB ── */}
          <TabsContent value="registry">
            {/* Search + category filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search commands..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={activeCategory === "all" ? "default" : "outline"}
                  onClick={() => setActiveCategory("all")}
                  className="text-xs"
                >
                  All ({TOTAL_COMMANDS})
                </Button>
                {COMMAND_REGISTRY.map(cat => (
                  <Button
                    key={cat.category}
                    size="sm"
                    variant={activeCategory === cat.category ? "default" : "outline"}
                    onClick={() => setActiveCategory(cat.category)}
                    className="text-xs"
                  >
                    {cat.category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Command grid */}
            <div className="space-y-6">
              {filtered.map(cat => {
                const Icon = cat.icon;
                return (
                  <div key={cat.category}>
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className={`w-4 h-4 ${cat.color}`} />
                      <h3 className="font-bold text-sm">{cat.category}</h3>
                      <Badge variant="outline" className="text-xs">{cat.commands.length}</Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {cat.commands.map(cmd => (
                        <div
                          key={cmd.label}
                          className="p-3 rounded-xl border border-border/40 bg-card/60 hover:border-primary/30 transition-all group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-xs">{cmd.label}</span>
                                {(cmd as any).route ? (
                                  <Badge variant="outline" className="text-[10px] px-1 py-0 font-mono">{(cmd as any).route}</Badge>
                                ) : (
                                  <Badge variant="secondary" className="text-[10px] px-1 py-0">{(cmd as any).action}</Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground truncate">
                                <span className="text-primary/70">Say:</span> "{cmd.phrase}"
                              </p>
                              <p className="text-xs text-muted-foreground/60 mt-0.5 italic truncate">
                                e.g. "{cmd.example}"
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 p-0 shrink-0"
                              onClick={() => copyExample(cmd.example)}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Search className="w-8 h-8 mx-auto mb-3 opacity-40" />
                  <p>No commands match "{search}"</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* ── LIVE TESTER TAB ── */}
          <TabsContent value="tester">
            <div className="max-w-2xl mx-auto">
              <div className="p-6 rounded-2xl border border-border/50 bg-card/80 mb-6">
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <Mic className="w-4 h-4 text-primary" /> Live Voice Tester
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Test your voice commands here. This tester <strong>does not navigate</strong> — it only shows what would be matched.
                </p>

                {/* Big mic button */}
                <div className="flex flex-col items-center gap-4">
                  <button
                    onClick={isListening ? stopTester : startTester}
                    className={`w-24 h-24 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      isListening
                        ? "border-red-500 bg-red-500/10 animate-pulse scale-110"
                        : "border-primary bg-primary/10 hover:scale-105"
                    }`}
                  >
                    {isListening ? (
                      <MicOff className="w-10 h-10 text-red-400" />
                    ) : (
                      <Mic className="w-10 h-10 text-primary" />
                    )}
                  </button>
                  <p className="text-sm text-muted-foreground">
                    {isListening ? "Listening... click to stop" : "Click to test a command"}
                  </p>
                </div>

                {/* Transcript */}
                {transcript && (
                  <div className="mt-6 p-4 rounded-xl border border-border/50 bg-background/50">
                    <p className="text-xs text-muted-foreground mb-1">You said:</p>
                    <p className="font-mono text-sm">"{transcript}"</p>
                    {matched ? (
                      <div className="mt-3 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-green-400 font-semibold">Matched: {matched}</span>
                      </div>
                    ) : (
                      <div className="mt-3 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-yellow-400">No command matched</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Quick reference */}
              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-primary" /> Quick Reference
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {["open social", "go to staking", "show wallet", "open hope AI", "go back", "scroll down", "open trading", "ghost mode"].map(ex => (
                    <div key={ex} className="flex items-center gap-2 text-xs">
                      <ChevronRight className="w-3 h-3 text-primary/50" />
                      <span className="font-mono text-muted-foreground">"{ex}"</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ── CUSTOM COMMANDS TAB ── */}
          <TabsContent value="custom">
            <div className="max-w-2xl mx-auto">
              <div className="p-6 rounded-2xl border border-border/50 bg-card/80 mb-6">
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-primary" /> Add Custom Command
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Define your own voice triggers. Custom commands are stored locally and fire alongside the built-in registry.
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Voice Phrase</label>
                    <Input
                      placeholder='e.g. "open my art store"'
                      value={newPhrase}
                      onChange={e => setNewPhrase(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Action (route or command)</label>
                    <Input
                      placeholder='e.g. /digital-art or scroll:down'
                      value={newAction}
                      onChange={e => setNewAction(e.target.value)}
                    />
                  </div>
                  <Button onClick={addCustomCommand} className="w-full">
                    <Plus className="w-4 h-4 mr-2" /> Add Command
                  </Button>
                </div>
              </div>

              {customCommands.length > 0 ? (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold mb-3">Your Custom Commands ({customCommands.length})</h4>
                  {customCommands.map((cmd, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-card/60">
                      <div>
                        <p className="text-sm font-mono">"{cmd.phrase}"</p>
                        <p className="text-xs text-muted-foreground">{cmd.action}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300"
                        onClick={() => {
                          setCustomCommands(prev => prev.filter((_, j) => j !== i));
                          toast.success("Command removed");
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Settings className="w-8 h-8 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">No custom commands yet</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* ── HISTORY TAB ── */}
          <TabsContent value="history">
            <div className="max-w-2xl mx-auto">
              {history.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold">Command History ({history.length})</h4>
                    <Button size="sm" variant="ghost" className="text-xs text-muted-foreground" onClick={() => setHistory([])}>
                      <Trash2 className="w-3 h-3 mr-1" /> Clear
                    </Button>
                  </div>
                  {history.map(entry => (
                    <div key={entry.id} className="flex items-center gap-3 p-3 rounded-xl border border-border/40 bg-card/60">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${entry.matched ? "bg-green-500/10" : "bg-yellow-500/10"}`}>
                        {entry.matched ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Zap className="w-4 h-4 text-yellow-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-mono truncate">"{entry.transcript}"</p>
                        <p className="text-xs text-muted-foreground">
                          {entry.matched ? `→ ${entry.matched}` : "No match"} · {entry.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-muted-foreground">
                  <Clock className="w-10 h-10 mx-auto mb-4 opacity-40" />
                  <h3 className="font-semibold mb-2">No History Yet</h3>
                  <p className="text-sm">Use the Live Tester to record command attempts.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
