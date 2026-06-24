import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/PageHeader";
import { getLoginUrl } from "@/const";
import {
  Brain, Sparkles, Shield, TrendingUp, Activity, BarChart3, AlertTriangle,
  Network, Target, Cpu, Send, RefreshCw, Copy, Check, Code, Zap,
  BookOpen, Lightbulb, MessageSquare, Bot, ChevronRight
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";

const AI_MODULES = [
  { name: "Feed Ranking", status: "active", accuracy: 94, icon: TrendingUp, color: "#4ade80", description: "Personalized content ranking using engagement signals" },
  { name: "Content Moderation", status: "active", accuracy: 97, icon: Shield, color: "#60a5fa", description: "Automated toxicity detection and content filtering" },
  { name: "Fraud Detection", status: "active", accuracy: 99, icon: AlertTriangle, color: "#f87171", description: "Real-time fraud and manipulation detection" },
  { name: "Recommendation Engine", status: "active", accuracy: 91, icon: Sparkles, color: "#c084fc", description: "User-to-content and user-to-user recommendations" },
  { name: "Sentiment Analysis", status: "active", accuracy: 88, icon: Activity, color: "#facc15", description: "Real-time community sentiment tracking" },
  { name: "Trend Forecasting", status: "active", accuracy: 85, icon: BarChart3, color: "#22d3ee", description: "Predictive trend and viral content detection" },
  { name: "Creator Growth AI", status: "active", accuracy: 92, icon: Target, color: "#fb923c", description: "Personalized growth strategies for creators" },
  { name: "Social Graph", status: "active", accuracy: 96, icon: Network, color: "#818cf8", description: "Relationship mapping and community clustering" },
];

interface ChatMsg { role: "user" | "assistant"; content: string; timestamp: Date; model?: string; }

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="p-1.5 rounded hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground">
      {copied ? <Check className="w-3.5 h-3.5 text-purple-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function LiveChatPanel() {
  const [msgs, setMsgs] = useState<ChatMsg[]>([
    { role: "assistant", content: "Hello! I'm SKYCOIN4444 AI — smarter than ChatGPT, Grok, and Manus. I specialize in Web3, DeFi, crypto trading, smart contracts, and full-stack development. What can I help you with today?", timestamp: new Date() }
  ]);
  const [input, setInput] = useState("");
  const [model, setModel] = useState("default");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [showSystem, setShowSystem] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: models } = trpc.ai.getModels.useQuery();

  const chatMut = trpc.ai.chat.useMutation({
    onSuccess: (data) => setMsgs(p => [...p, { role: "assistant", content: data.reply, timestamp: new Date(), model: data.model }]),
  });

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs]);

  const send = useCallback(() => {
    if (!input.trim() || chatMut.isPending) return;
    const history = msgs.slice(-12).map(m => ({ role: m.role, content: m.content }));
    setMsgs(p => [...p, { role: "user", content: input, timestamp: new Date() }]);
    chatMut.mutate({ message: input, model: model !== "default" ? model : undefined, history, systemPrompt: systemPrompt || undefined });
    setInput("");
  }, [input, msgs, model, systemPrompt, chatMut]);

  const QUICK_PROMPTS = [
    "Explain DeFi yield farming", "Write a Solidity ERC-20 token", "How does SKY444 staking work?",
    "Analyze BTC market trend", "Create a React hook for wallet connect", "What is a DAO?",
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-3 border-b border-border/40 bg-background/30 shrink-0">
        <Brain className="w-4 h-4 text-primary shrink-0" />
        <Select value={model} onValueChange={setModel}>
          <SelectTrigger className="h-8 text-xs bg-secondary/30 border-border/40 w-48">
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">SKYCOIN AI (Auto)</SelectItem>
            {models?.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <button onClick={() => setShowSystem(!showSystem)}
          className="ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
          <Cpu className="w-3 h-3" />System Prompt
        </button>
        <Badge variant="outline" className="text-[10px] border-purple-500/30 text-purple-400 shrink-0">LIVE AI</Badge>
      </div>
      {showSystem && (
        <div className="px-3 py-2 border-b border-border/40 bg-secondary/10 shrink-0">
          <Textarea value={systemPrompt} onChange={e => setSystemPrompt(e.target.value)}
            placeholder="Custom system prompt (optional)..."
            className="resize-none text-xs bg-transparent border-0 p-0 focus-visible:ring-0 min-h-[48px]" rows={2} />
        </div>
      )}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {msgs.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            {m.role === "assistant" && (
              <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                <Brain className="w-4 h-4 text-primary" />
              </div>
            )}
            <div className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${m.role === "user" ? "bg-primary/20 border border-primary/30 ml-auto" : "bg-secondary/40 border border-border/30"}`}>
              <pre className="whitespace-pre-wrap font-sans">{m.content}</pre>
              <div className="text-[10px] text-muted-foreground mt-1.5 flex items-center justify-between gap-2">
                <span>{m.timestamp.toLocaleTimeString()}{m.model && m.model !== "default" ? ` · ${m.model}` : ""}</span>
                {m.role === "assistant" && <CopyBtn text={m.content} />}
              </div>
            </div>
          </div>
        ))}
        {chatMut.isPending && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
              <Brain className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-secondary/40 border border-border/30 rounded-xl px-4 py-3">
              <div className="flex gap-1.5 items-center">
                {[0, 150, 300].map(d => <div key={d} className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
                <span className="text-xs text-muted-foreground ml-1">SKYCOIN AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="px-4 pt-2 flex gap-2 flex-wrap shrink-0">
        {QUICK_PROMPTS.map(p => (
          <button key={p} onClick={() => setInput(p)}
            className="text-[10px] px-2 py-1 rounded border border-border/40 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">{p}</button>
        ))}
      </div>
      <div className="p-4 border-t border-border/40 shrink-0">
        <div className="flex gap-2">
          <Textarea value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Ask SKYCOIN AI anything... (Enter to send, Shift+Enter for new line)"
            className="resize-none min-h-[60px] max-h-[120px] text-sm bg-secondary/30 border-border/40" rows={2} />
          <Button onClick={send} disabled={!input.trim() || chatMut.isPending}
            className="shrink-0 h-auto px-4 bg-primary hover:bg-primary/90">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function CodeToolsPanel() {
  const [tab, setTab] = useState<"generate" | "debug" | "review" | "optimize">("generate");
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState("typescript");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<string>("");
  const [score, setScore] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const genMut = trpc.ai.generateCode.useMutation({ onSuccess: d => setResult(d.code) });
  const debugMut = trpc.ai.debugCode.useMutation({ onSuccess: d => { setResult(d.fixed); setSuggestions(d.issues as string[]); } });
  const reviewMut = trpc.ai.reviewCode.useMutation({ onSuccess: d => { setResult(d.review); setScore(d.score); setSuggestions((d as any).suggestions || []); } });
  const optimizeMut = trpc.ai.optimizeCode.useMutation({ onSuccess: d => setResult(d.optimized) });

  const isPending = genMut.isPending || debugMut.isPending || reviewMut.isPending || optimizeMut.isPending;

  const run = () => {
    setResult(""); setScore(null); setSuggestions([]);
    if (tab === "generate") genMut.mutate({ prompt, language });
    else if (tab === "debug") debugMut.mutate({ code, error: error || undefined });
    else if (tab === "review") reviewMut.mutate({ code });
    else if (tab === "optimize") optimizeMut.mutate({ code });
  };

  const LANGS = ["typescript", "javascript", "python", "rust", "go", "solidity", "sql", "bash"];

  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto h-full">
      <div className="flex gap-2 flex-wrap">
        {(["generate", "debug", "review", "optimize"] as const).map(t => (
          <button key={t} onClick={() => { setTab(t); setResult(""); setScore(null); setSuggestions([]); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${tab === t ? "bg-primary text-primary-foreground" : "bg-secondary/30 text-muted-foreground hover:text-foreground border border-border/40"}`}>
            {t === "generate" ? "⚡ Generate" : t === "debug" ? "🔍 Debug" : t === "review" ? "👁️ Review" : "🚀 Optimize"}
          </button>
        ))}
      </div>
      {tab === "generate" ? (
        <>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Language</label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="h-9 text-sm bg-secondary/30 border-border/40"><SelectValue /></SelectTrigger>
              <SelectContent>{LANGS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">What to generate</label>
            <Textarea value={prompt} onChange={e => setPrompt(e.target.value)}
              placeholder="Describe what you want to generate..."
              className="resize-none min-h-[100px] text-sm bg-secondary/30 border-border/40" rows={4} />
          </div>
        </>
      ) : (
        <>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Paste your code</label>
            <Textarea value={code} onChange={e => setCode(e.target.value)}
              placeholder="Paste code here..."
              className="resize-none min-h-[150px] text-sm bg-black/30 border-border/40 font-mono text-xs" rows={6} />
          </div>
          {tab === "debug" && (
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Error message (optional)</label>
              <Textarea value={error} onChange={e => setError(e.target.value)}
                placeholder="Paste error message here..."
                className="resize-none min-h-[60px] text-sm bg-secondary/30 border-border/40 font-mono text-xs" rows={2} />
            </div>
          )}
        </>
      )}
      <Button onClick={run} disabled={isPending || (tab === "generate" ? !prompt.trim() : !code.trim())}
        className="w-full gap-2 font-semibold bg-primary hover:bg-primary/90">
        {isPending ? <><RefreshCw className="w-4 h-4 animate-spin" />Processing...</> : <><Zap className="w-4 h-4" />Run AI</>}
      </Button>
      {result && (
        <div className="space-y-3">
          {score !== null && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border/40">
              <div className={`text-3xl font-bold font-mono ${score >= 80 ? "text-purple-400" : score >= 60 ? "text-yellow-400" : "text-red-400"}`}>{score}</div>
              <div className="flex-1">
                <div className="w-full bg-secondary/50 rounded-full h-1.5 mb-1">
                  <div className={`h-1.5 rounded-full ${score >= 80 ? "bg-purple-600" : score >= 60 ? "bg-yellow-400" : "bg-red-400"}`} style={{ width: `${score}%` }} />
                </div>
                <p className="text-xs text-muted-foreground">Code Quality Score</p>
              </div>
            </div>
          )}
          {suggestions.length > 0 && (
            <div className="p-3 rounded-lg bg-secondary/30 border border-border/40">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Issues / Suggestions</p>
              {suggestions.map((s, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground mb-1">
                  <ChevronRight className="w-3 h-3 shrink-0 mt-0.5 text-primary" />{s}
                </div>
              ))}
            </div>
          )}
          <div className="relative">
            <div className="flex items-center justify-between px-3 py-2 bg-secondary/60 border border-border/40 rounded-t-lg">
              <span className="text-xs font-mono text-muted-foreground">Output</span>
              <CopyBtn text={result} />
            </div>
            <pre className="p-4 bg-black/40 border border-t-0 border-border/40 rounded-b-lg overflow-x-auto text-xs font-mono text-purple-400 leading-relaxed max-h-[400px] overflow-y-auto whitespace-pre-wrap">{result}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

function LearnPanel() {
  const [topic, setTopic] = useState("");
  const [lesson, setLesson] = useState("");
  const learnMut = trpc.ai.learnTopic.useMutation({ onSuccess: d => setLesson(d.lesson) });

  const TOPICS = ["DeFi yield farming", "Smart contract security", "Web3 wallet integration", "NFT minting", "DAO governance", "Tokenomics design", "Layer 2 scaling", "Cross-chain bridges"];

  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto h-full">
      <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <span className="font-semibold text-sm">AI-Powered Learning</span>
        </div>
        <p className="text-xs text-muted-foreground">Ask SKYCOIN AI to teach you anything about Web3, DeFi, crypto, or development. Get structured lessons with examples.</p>
      </div>
      <div>
        <label className="text-xs text-muted-foreground mb-1.5 block">Topic to learn</label>
        <Textarea value={topic} onChange={e => setTopic(e.target.value)}
          placeholder="What do you want to learn? e.g. 'How does Uniswap V3 concentrated liquidity work?'"
          className="resize-none min-h-[80px] text-sm bg-secondary/30 border-border/40" rows={3} />
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">Quick topics:</p>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map(t => (
            <button key={t} onClick={() => setTopic(t)}
              className="text-[10px] px-2 py-1 rounded border border-border/40 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">{t}</button>
          ))}
        </div>
      </div>
      <Button onClick={() => learnMut.mutate({ topic })} disabled={!topic.trim() || learnMut.isPending}
        className="w-full gap-2 font-semibold bg-primary hover:bg-primary/90">
        {learnMut.isPending ? <><RefreshCw className="w-4 h-4 animate-spin" />Generating lesson...</> : <><Lightbulb className="w-4 h-4" />Teach Me</>}
      </Button>
      {lesson && (
        <div className="p-4 rounded-xl bg-secondary/30 border border-border/40">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">Your Lesson</span>
            </div>
            <CopyBtn text={lesson} />
          </div>
          <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans text-foreground/90">{lesson}</pre>
        </div>
      )}
    </div>
  );
}

function ModulesPanel() {
  const { data: modStats } = trpc.moderation.stats.useQuery();
  const { data: platformStats } = trpc.platform.stats.useQuery();
  const totalUsers = platformStats?.totalUsers || 0;

  return (
    <div className="p-4 overflow-y-auto h-full">
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { label: "AI Models Active", value: "3", sub: "GPT-4o · Claude · Gemini", color: "text-primary" },
          { label: "Total Users Served", value: totalUsers.toLocaleString(), sub: "Platform-wide", color: "text-purple-400" },
          { label: "Moderation Actions", value: (modStats?.totalActions || 0).toLocaleString(), sub: "Auto-flagged", color: "text-yellow-400" },
          { label: "Avg Response Time", value: "<200ms", sub: "Edge inference", color: "text-cyan-400" },
        ].map((stat, i) => (
          <div key={i} className="p-4 rounded-xl bg-secondary/30 border border-border/40">
            <div className={`text-2xl font-bold font-mono mb-1 ${stat.color}`}>{stat.value}</div>
            <div className="text-xs font-medium">{stat.label}</div>
            <div className="text-[10px] text-muted-foreground">{stat.sub}</div>
          </div>
        ))}
      </div>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">AI Modules</p>
      <div className="grid grid-cols-1 gap-3">
        {AI_MODULES.map((mod, i) => {
          const Icon = mod.icon;
          const realAccuracy = mod.name === "Content Moderation" && modStats?.accuracy ? Math.round(modStats.accuracy * 100) : mod.accuracy;
          return (
            <div key={i} className="p-4 rounded-xl bg-secondary/20 border border-border/40 hover:border-border/60 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${mod.color}22` }}>
                  <Icon className="w-4 h-4" style={{ color: mod.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{mod.name}</span>
                    <Badge variant="outline" className="text-[10px] border-purple-500/30 text-purple-400">ACTIVE</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{mod.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-secondary/50 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-gradient-to-r from-primary to-primary/60 transition-all"
                    style={{ width: `${realAccuracy}%` }} />
                </div>
                <span className="text-xs font-mono text-muted-foreground shrink-0">{realAccuracy}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AIBrain() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-12 text-center max-w-md rounded-2xl border border-border/40 bg-secondary/10">
          <Brain className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">AI Brain</h2>
          <p className="text-muted-foreground mb-6">Sign in to access the full AI suite — chat, code generation, learning, and more.</p>
          <a href={getLoginUrl()}><Button className="bg-primary text-primary-foreground font-semibold">Sign In to Continue</Button></a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        <PageHeader icon={Brain} title="AI Brain" subtitle="SKYCOIN4444 AI — smarter than ChatGPT, Grok, and Manus. Real LLM-powered chat, code generation, learning, and platform intelligence." badge="LIVE AI" backHref="/dashboard" />
        <div style={{ height: "calc(100vh - 240px)", minHeight: "600px" }}>
          <Tabs defaultValue="chat" className="flex flex-col h-full">
            <TabsList className="shrink-0 w-full justify-start bg-secondary/30 border border-border/40 rounded-xl p-1 mb-3">
              <TabsTrigger value="chat" className="gap-2 text-xs"><MessageSquare className="w-3.5 h-3.5" />Live Chat</TabsTrigger>
              <TabsTrigger value="code" className="gap-2 text-xs"><Code className="w-3.5 h-3.5" />Code Tools</TabsTrigger>
              <TabsTrigger value="learn" className="gap-2 text-xs"><BookOpen className="w-3.5 h-3.5" />Learn</TabsTrigger>
              <TabsTrigger value="modules" className="gap-2 text-xs"><Bot className="w-3.5 h-3.5" />AI Modules</TabsTrigger>
            </TabsList>
            <div className="flex-1 min-h-0 bg-secondary/10 border border-border/40 rounded-xl overflow-hidden">
              <TabsContent value="chat" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
                <LiveChatPanel />
              </TabsContent>
              <TabsContent value="code" className="h-full m-0 overflow-y-auto">
                <CodeToolsPanel />
              </TabsContent>
              <TabsContent value="learn" className="h-full m-0 overflow-y-auto">
                <LearnPanel />
              </TabsContent>
              <TabsContent value="modules" className="h-full m-0 overflow-y-auto">
                <ModulesPanel />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
