import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/PageHeader";
import { getLoginUrl } from "@/const";
import {
  Code2, Zap, Play, RefreshCw, Copy, Check, Terminal, GitBranch,
  Bot, Activity, FileCode, Cpu, ChevronRight, AlertTriangle, CheckCircle,
  Clock, TrendingUp, Layers, Sparkles, Eye, Download
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";

const BOT_COLORS: Record<string, string> = {
  NOVA: "#4ade80", CIPHER: "#f87171", ATLAS: "#60a5fa", PRISM: "#c084fc",
  FORGE: "#fb923c", VECTOR: "#22d3ee", NEXUS: "#818cf8", PULSE: "#facc15",
  SHIELD: "#34d399", ORACLE: "#f472b6", ECHO: "#a78bfa", TITAN: "#fbbf24",
};

const BOT_ICONS: Record<string, string> = {
  NOVA: "⚡", CIPHER: "🔐", ATLAS: "🌐", PRISM: "🎨",
  FORGE: "🔧", VECTOR: "🤖", NEXUS: "🔗", PULSE: "📊",
  SHIELD: "🛡️", ORACLE: "👁️", ECHO: "📡", TITAN: "👑",
};

const LANGUAGES = ["typescript", "javascript", "python", "rust", "go", "solidity", "sql", "bash", "yaml", "json", "css", "html"] as const;
const MODES = ["generate", "review", "refactor", "test", "document", "audit"] as const;

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="p-1.5 rounded hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground">
      {copied ? <Check className="w-3.5 h-3.5 text-purple-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function DownloadBtn({ code, filename }: { code: string; filename: string }) {
  const download = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <button onClick={download} className="p-1.5 rounded hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground">
      <Download className="w-3.5 h-3.5" />
    </button>
  );
}

function CodeOutput({ code, filename, language }: { code: string; filename?: string; language: string }) {
  return (
    <div className="rounded-xl overflow-hidden border border-border/40">
      <div className="flex items-center justify-between px-4 py-2.5 bg-secondary/60 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-purple-600/60" />
          </div>
          <span className="text-xs font-mono text-muted-foreground ml-2">{filename || `output.${language}`}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-muted-foreground mr-2">{code.split("\n").length} lines</span>
          <CopyBtn text={code} />
          {filename && <DownloadBtn code={code} filename={filename} />}
        </div>
      </div>
      <pre className="p-4 bg-black/50 overflow-x-auto text-xs font-mono text-purple-400 leading-relaxed max-h-[500px] overflow-y-auto whitespace-pre-wrap">{code}</pre>
    </div>
  );
}

function BotSelector({ bots, selected, onSelect }: { bots: any[]; selected: string; onSelect: (id: string) => void }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {bots.map(bot => {
        const color = BOT_COLORS[bot.id] || "#4ade80";
        const icon = BOT_ICONS[bot.id] || "🤖";
        const isSelected = selected === bot.id;
        return (
          <button key={bot.id} onClick={() => onSelect(bot.id)}
            className={`p-3 rounded-xl border text-left transition-all ${isSelected ? "border-primary/50 bg-primary/10" : "border-border/30 bg-secondary/20 hover:border-border/50"}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">{icon}</span>
              <span className="text-xs font-bold" style={{ color }}>{bot.id}</span>
            </div>
            <div className="text-[10px] text-muted-foreground truncate">{bot.specialty || bot.name}</div>
          </button>
        );
      })}
    </div>
  );
}

function CodeGenPanel({ bots }: { bots: any[] }) {
  const [botId, setBotId] = useState("NOVA");
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState<typeof LANGUAGES[number]>("typescript");
  const [mode, setMode] = useState<typeof MODES[number]>("generate");
  const [context, setContext] = useState("");
  const [targetFile, setTargetFile] = useState("");
  const [result, setResult] = useState<{ code: string; explanation: string; linesGenerated: number; suggestions: string[] } | null>(null);
  const [showContext, setShowContext] = useState(false);
  const [streamedCode, setStreamedCode] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const esRef = useRef<EventSource | null>(null);

  const genMut = trpc.aiEngineer.generateCode.useMutation({
    onSuccess: (data) => setResult(data),
  });

  const startSSEStream = useCallback(() => {
    if (!prompt.trim() || isStreaming) return;
    // Close any existing stream
    if (esRef.current) { esRef.current.close(); esRef.current = null; }
    setStreamedCode("");
    setResult(null);
    setIsStreaming(true);
    const params = new URLSearchParams({ prompt: `[${language}/${mode}] ${prompt}${context ? `\n\nContext:\n${context}` : ""}`, model: "claude-sonnet-4-5" });
    const es = new EventSource(`/api/ai/code-stream?${params}`);
    esRef.current = es;
    es.addEventListener("chunk", (e) => {
      try { const d = JSON.parse(e.data); setStreamedCode(prev => prev + (d.text || "")); } catch {}
    });
    es.addEventListener("done", (e) => {
      try {
        const d = JSON.parse(e.data);
        setIsStreaming(false);
        es.close();
        esRef.current = null;
        // Build a result-compatible object from the streamed content
        setResult(prev => prev || { code: streamedCode, explanation: `Generated ${d.totalChars} chars via ${d.model}`, linesGenerated: streamedCode.split("\n").length, suggestions: [] });
      } catch {}
    });
    es.addEventListener("error", () => {
      setIsStreaming(false);
      es.close();
      esRef.current = null;
      // Fall back to tRPC mutation
      genMut.mutate({ botId: botId as any, prompt, language, context: context || undefined, targetFile: targetFile || undefined, mode });
    });
  }, [prompt, language, mode, context, targetFile, botId, isStreaming, genMut]);

  const QUICK_TASKS = [
    { label: "React Component", prompt: "Create a reusable React component with TypeScript props, proper types, and Tailwind styling", lang: "typescript" as const, file: "client/src/components/NewComponent.tsx" },
    { label: "tRPC Route", prompt: "Add a new tRPC procedure with input validation, database query, and error handling", lang: "typescript" as const, file: "server/routers.ts" },
    { label: "Solidity Contract", prompt: "Write a production-ready ERC-20 token contract with burn, mint, and governance hooks", lang: "solidity" as const, file: "contracts/Token.sol" },
    { label: "API Tests", prompt: "Write comprehensive Vitest tests for authentication and user management procedures", lang: "typescript" as const, file: "server/auth.test.ts" },
    { label: "DB Schema", prompt: "Design a Drizzle ORM schema for a social media post with reactions, comments, and media", lang: "typescript" as const, file: "drizzle/schema.ts" },
    { label: "CI/CD Pipeline", prompt: "Write a GitHub Actions workflow with lint, test, build, and deploy stages", lang: "yaml" as const, file: ".github/workflows/ci.yml" },
  ];

  return (
    <div className="flex gap-4 h-full">
      {/* Left: Config */}
      <div className="w-72 shrink-0 flex flex-col gap-4 overflow-y-auto">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Select Bot</p>
          <BotSelector bots={bots} selected={botId} onSelect={setBotId} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Language</label>
            <Select value={language} onValueChange={v => setLanguage(v as any)}>
              <SelectTrigger className="h-8 text-xs bg-secondary/30 border-border/40"><SelectValue /></SelectTrigger>
              <SelectContent>{LANGUAGES.map(l => <SelectItem key={l} value={l} className="text-xs">{l}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Mode</label>
            <Select value={mode} onValueChange={v => setMode(v as any)}>
              <SelectTrigger className="h-8 text-xs bg-secondary/30 border-border/40"><SelectValue /></SelectTrigger>
              <SelectContent>{MODES.map(m => <SelectItem key={m} value={m} className="text-xs capitalize">{m}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Target File (optional)</label>
          <input value={targetFile} onChange={e => setTargetFile(e.target.value)}
            placeholder="e.g. server/routers.ts"
            className="w-full h-8 px-3 text-xs rounded-lg bg-secondary/30 border border-border/40 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50" />
        </div>
        <button onClick={() => setShowContext(!showContext)} className="text-xs text-muted-foreground hover:text-foreground text-left flex items-center gap-1">
          <ChevronRight className={`w-3 h-3 transition-transform ${showContext ? "rotate-90" : ""}`} />
          Add context code
        </button>
        {showContext && (
          <Textarea value={context} onChange={e => setContext(e.target.value)}
            placeholder="Paste existing code for context..."
            className="resize-none text-xs font-mono bg-black/30 border-border/40 min-h-[100px]" rows={4} />
        )}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Quick Tasks</p>
          <div className="flex flex-col gap-1.5">
            {QUICK_TASKS.map(t => (
              <button key={t.label} onClick={() => { setPrompt(t.prompt); setLanguage(t.lang); setTargetFile(t.file); }}
                className="text-left px-3 py-2 rounded-lg bg-secondary/20 hover:bg-secondary/40 border border-border/30 text-xs transition-all">
                <span className="font-medium">{t.label}</span>
                <span className="text-muted-foreground block truncate">{t.file}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Right: Prompt + Output */}
      <div className="flex-1 flex flex-col gap-4 min-w-0 overflow-y-auto">
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">What should {botId} build?</label>
          <Textarea value={prompt} onChange={e => setPrompt(e.target.value)}
            placeholder={`Describe what you want ${botId} to generate, review, or refactor...`}
            className="resize-none min-h-[120px] text-sm bg-secondary/30 border-border/40 font-sans" rows={5} />
        </div>
        <Button onClick={startSSEStream}
          disabled={!prompt.trim() || isStreaming || genMut.isPending}
          className="w-full gap-2 font-bold text-sm bg-primary hover:bg-primary/90 h-11">
          {(isStreaming || genMut.isPending)
            ? <><RefreshCw className="w-4 h-4 animate-spin" />{BOT_ICONS[botId]} {botId} is coding...</>
            : <><Zap className="w-4 h-4" />{BOT_ICONS[botId]} Generate with {botId} (SSE)</>}
        </Button>
        {/* Live SSE streaming output */}
        {isStreaming && streamedCode && (
          <div className="rounded-xl border border-primary/30 bg-black/40 overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-border/30 bg-primary/5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-mono text-primary">Live output — {streamedCode.split("\n").length} lines</span>
            </div>
            <pre className="p-3 text-xs font-mono text-green-300 overflow-x-auto max-h-64 overflow-y-auto whitespace-pre-wrap">{streamedCode}</pre>
          </div>
        )}
        {result && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-600/10 border border-purple-500/20">
              <CheckCircle className="w-4 h-4 text-purple-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-purple-400">{result.explanation}</p>
                <p className="text-xs text-muted-foreground">{result.linesGenerated} lines generated</p>
              </div>
            </div>
            {result.suggestions.length > 0 && (
              <div className="p-3 rounded-xl bg-secondary/30 border border-border/40">
                <p className="text-xs font-semibold text-muted-foreground mb-2">Suggestions</p>
                {result.suggestions.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground mb-1">
                    <Sparkles className="w-3 h-3 shrink-0 mt-0.5 text-primary" />{s}
                  </div>
                ))}
              </div>
            )}
            <CodeOutput code={result.code} filename={targetFile || undefined} language={language} />
          </div>
        )}
      </div>
    </div>
  );
}

function AutonomousPanel() {
  const { data: stats, refetch: refetchStats } = trpc.aiEngineer.getStats.useQuery(undefined, { refetchInterval: 3000 });
  const { data: log, refetch: refetchLog } = trpc.aiEngineer.getLog.useQuery({ limit: 50 }, { refetchInterval: 3000 });
  const { data: pushHistory } = trpc.aiEngineer.getPushHistory.useQuery({ limit: 30 }, { refetchInterval: 5000 });
  const { data: sessions } = trpc.aiEngineer.getSessions.useQuery(undefined, { refetchInterval: 3000 });
  const logRef = useRef<HTMLDivElement>(null);

  const cycleMut = trpc.aiEngineer.runAutonomousCycle.useMutation({
    onSuccess: () => { refetchStats(); refetchLog(); },
  });

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  const logColors: Record<string, string> = {
    success: "text-purple-400", error: "text-red-400", warning: "text-yellow-400", info: "text-cyan-400",
  };

  return (
    <div className="flex gap-4 h-full">
      {/* Left: Stats + Controls */}
      <div className="w-72 shrink-0 flex flex-col gap-4 overflow-y-auto">
        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold">TITAN Orchestrator</span>
            </div>
            <Badge variant="outline" className={`text-[10px] ${stats?.isAutonomousRunning ? "border-purple-500/30 text-purple-400" : "border-border/40 text-muted-foreground"}`}>
              {stats?.isAutonomousRunning ? "RUNNING" : "IDLE"}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {[
              { label: "Lines Generated", value: (stats?.totalLinesGenerated || 0).toLocaleString(), color: "text-purple-400" },
              { label: "Tasks Done", value: (stats?.totalTasksCompleted || 0).toLocaleString(), color: "text-cyan-400" },
              { label: "Total Pushes", value: (stats?.totalPushes || 0).toLocaleString(), color: "text-purple-400" },
              { label: "Active Bots", value: `${stats?.activeBots || 0}/12`, color: "text-yellow-400" },
            ].map((s, i) => (
              <div key={i} className="p-2 rounded-lg bg-secondary/30 border border-border/30">
                <div className={`text-lg font-bold font-mono ${s.color}`}>{s.value}</div>
                <div className="text-[10px] text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
          {stats?.nextTaskTitle && (
            <div className="text-xs text-muted-foreground">
              <span className="text-primary">Next:</span> {stats.nextTaskTitle}
            </div>
          )}
        </div>
        <Button onClick={() => cycleMut.mutate()} disabled={cycleMut.isPending || stats?.isAutonomousRunning}
          className="w-full gap-2 font-bold bg-primary hover:bg-primary/90">
          {cycleMut.isPending ? <><RefreshCw className="w-4 h-4 animate-spin" />Running cycle...</> : <><Play className="w-4 h-4" />Run Autonomous Cycle</>}
        </Button>
        {cycleMut.data && (
          <div className="p-3 rounded-xl bg-purple-600/10 border border-purple-500/20 text-xs">
            <p className="text-purple-400 font-semibold mb-1">Cycle Complete!</p>
            <p className="text-muted-foreground">{cycleMut.data.tasksRun} tasks · {cycleMut.data.linesGenerated} lines generated</p>
          </div>
        )}
        {/* Bot Status Grid */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Bot Status</p>
          <div className="grid grid-cols-3 gap-1.5">
            {(sessions || []).map((s: any) => {
              const color = BOT_COLORS[s.botId] || "#4ade80";
              const statusColors: Record<string, string> = { working: "bg-purple-600", idle: "bg-secondary", error: "bg-red-500", complete: "bg-blue-500" };
              return (
                <div key={s.botId} className="p-2 rounded-lg bg-secondary/20 border border-border/30 text-center">
                  <div className="text-base mb-0.5">{BOT_ICONS[s.botId] || "🤖"}</div>
                  <div className="text-[9px] font-bold" style={{ color }}>{s.botId}</div>
                  <div className={`w-1.5 h-1.5 rounded-full mx-auto mt-1 ${statusColors[s.status] || "bg-secondary"}`} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Right: Log + Push History */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {/* Live Log */}
        <div className="flex-1 min-h-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">Live Engine Log</span>
            </div>
            <Badge variant="outline" className="text-[10px] border-purple-500/30 text-purple-400 animate-pulse">LIVE</Badge>
          </div>
          <div ref={logRef} className="h-48 overflow-y-auto bg-black/50 rounded-xl border border-border/40 p-3 font-mono text-xs space-y-1">
            {(log || []).length === 0 && (
              <p className="text-muted-foreground">Waiting for autonomous cycle... Click "Run Autonomous Cycle" to start.</p>
            )}
            {(log || []).map((entry: any, i: number) => (
              <div key={i} className="flex gap-2">
                <span className="text-muted-foreground shrink-0">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                <span className={logColors[entry.level] || "text-foreground"}>{entry.message}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Push History */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="flex items-center gap-2 mb-2">
            <GitBranch className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">Push History</span>
            <span className="text-xs text-muted-foreground">({(pushHistory || []).length} pushes)</span>
          </div>
          <div className="space-y-2">
            {(pushHistory || []).length === 0 && (
              <p className="text-xs text-muted-foreground p-3">No pushes yet. Run an autonomous cycle to generate code.</p>
            )}
            {(pushHistory || []).map((push: any, i: number) => {
              const color = BOT_COLORS[push.botId] || "#4ade80";
              return (
                <div key={push.id || i} className="p-3 rounded-xl bg-secondary/20 border border-border/30 hover:border-border/50 transition-all">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{BOT_ICONS[push.botId] || "🤖"}</span>
                      <span className="text-xs font-bold" style={{ color }}>{push.botId}</span>
                      <Badge variant="outline" className="text-[9px] border-purple-500/20 text-purple-400">{push.status || "applied"}</Badge>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{new Date(push.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-xs font-medium mb-1">{push.description}</p>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1"><FileCode className="w-3 h-3" />{push.targetFile}</span>
                    <span className="flex items-center gap-1 text-purple-400"><TrendingUp className="w-3 h-3" />+{push.linesAdded} lines</span>
                  </div>
                  {push.code && (
                    <details className="mt-2">
                      <summary className="text-[10px] text-muted-foreground cursor-pointer hover:text-foreground flex items-center gap-1">
                        <Eye className="w-3 h-3" />View generated code
                      </summary>
                      <pre className="mt-2 p-3 bg-black/40 rounded-lg text-[10px] font-mono text-purple-400 overflow-x-auto max-h-[200px] overflow-y-auto whitespace-pre-wrap">{push.code.slice(0, 2000)}{push.code.length > 2000 ? "\n... (truncated)" : ""}</pre>
                    </details>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyzePanel() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("typescript");
  const [analysisType, setAnalysisType] = useState<"security" | "performance" | "quality" | "all">("all");
  const [result, setResult] = useState<{ issues: any[]; score: number; summary: string } | null>(null);

  const analyzeMut = trpc.aiEngineer.analyzeCode.useMutation({
    onSuccess: (data) => setResult(data as any),
  });

  const severityColors: Record<string, string> = {
    critical: "text-red-400 border-red-500/30 bg-red-500/10",
    high: "text-orange-400 border-orange-500/30 bg-orange-500/10",
    medium: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",
    low: "text-blue-400 border-blue-500/30 bg-blue-500/10",
  };

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto">
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-xs text-muted-foreground mb-1.5 block">Language</label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="h-9 text-sm bg-secondary/30 border-border/40"><SelectValue /></SelectTrigger>
            <SelectContent>{LANGUAGES.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <label className="text-xs text-muted-foreground mb-1.5 block">Analysis Type</label>
          <Select value={analysisType} onValueChange={v => setAnalysisType(v as any)}>
            <SelectTrigger className="h-9 text-sm bg-secondary/30 border-border/40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Full Analysis</SelectItem>
              <SelectItem value="security">Security Audit</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
              <SelectItem value="quality">Code Quality</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <label className="text-xs text-muted-foreground mb-1.5 block">Paste code to analyze</label>
        <Textarea value={code} onChange={e => setCode(e.target.value)}
          placeholder="Paste your code here for AI-powered analysis..."
          className="resize-none min-h-[200px] text-xs font-mono bg-black/30 border-border/40" rows={8} />
      </div>
      <Button onClick={() => analyzeMut.mutate({ code, language, analysisType })}
        disabled={!code.trim() || analyzeMut.isPending}
        className="w-full gap-2 font-bold bg-primary hover:bg-primary/90">
        {analyzeMut.isPending ? <><RefreshCw className="w-4 h-4 animate-spin" />Analyzing...</> : <><Activity className="w-4 h-4" />Analyze Code</>}
      </Button>
      {result && (
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 border border-border/40">
            <div className={`text-4xl font-bold font-mono ${result.score >= 80 ? "text-purple-400" : result.score >= 60 ? "text-yellow-400" : "text-red-400"}`}>{result.score}</div>
            <div className="flex-1">
              <div className="w-full bg-secondary/50 rounded-full h-2 mb-2">
                <div className={`h-2 rounded-full ${result.score >= 80 ? "bg-purple-600" : result.score >= 60 ? "bg-yellow-400" : "bg-red-400"}`} style={{ width: `${result.score}%` }} />
              </div>
              <p className="text-sm text-muted-foreground">{result.summary}</p>
            </div>
          </div>
          {result.issues.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{result.issues.length} Issues Found</p>
              {result.issues.map((issue: any, i: number) => (
                <div key={i} className={`p-3 rounded-xl border ${severityColors[issue.severity] || "border-border/40 bg-secondary/20"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-xs font-semibold capitalize">{issue.severity}</span>
                    <span className="text-xs text-muted-foreground">— {issue.type}</span>
                  </div>
                  <p className="text-xs mb-1.5">{issue.description}</p>
                  <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                    <CheckCircle className="w-3 h-3 shrink-0 mt-0.5 text-purple-400" />
                    <span>{issue.fix}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {result.issues.length === 0 && (
            <div className="p-4 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-purple-400" />
              <p className="text-sm text-purple-400 font-semibold">No issues found — code looks clean!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AICodeStudio() {
  const { isAuthenticated } = useAuth();
  const { data: bots } = trpc.aiEngineer.getBots.useQuery();
  const { data: stats } = trpc.aiEngineer.getStats.useQuery(undefined, { refetchInterval: 5000 });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-12 text-center max-w-md rounded-2xl border border-border/40 bg-secondary/10">
          <Code2 className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">AI Code Studio</h2>
          <p className="text-muted-foreground mb-6">Sign in to access the AI self-coding system — 12 bots generating real production code.</p>
          <a href={getLoginUrl()}><Button className="bg-primary text-primary-foreground font-semibold">Sign In to Continue</Button></a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        <PageHeader
          icon={Code2}
          title="AI Code Studio"
          subtitle="12 AI bots powered by real LLM — generate, analyze, and autonomously improve platform code"
          badge="12 BOTS LIVE"
          backHref="/ai-engineer"
        />
        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: "Lines Generated", value: (stats?.totalLinesGenerated || 0).toLocaleString(), icon: Code2, color: "text-purple-400" },
            { label: "Tasks Completed", value: (stats?.totalTasksCompleted || 0).toLocaleString(), icon: CheckCircle, color: "text-cyan-400" },
            { label: "Total Pushes", value: (stats?.totalPushes || 0).toLocaleString(), icon: GitBranch, color: "text-purple-400" },
            { label: "Active Bots", value: `${stats?.activeBots || 0} / 12`, icon: Bot, color: "text-yellow-400" },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="p-4 rounded-xl bg-secondary/20 border border-border/40 flex items-center gap-3">
                <Icon className={`w-5 h-5 shrink-0 ${s.color}`} />
                <div>
                  <div className={`text-xl font-bold font-mono ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ height: "calc(100vh - 320px)", minHeight: "600px" }}>
          <Tabs defaultValue="generate" className="flex flex-col h-full">
            <TabsList className="shrink-0 w-full justify-start bg-secondary/30 border border-border/40 rounded-xl p-1 mb-3">
              <TabsTrigger value="generate" className="gap-2 text-xs"><Zap className="w-3.5 h-3.5" />Code Generator</TabsTrigger>
              <TabsTrigger value="autonomous" className="gap-2 text-xs"><Cpu className="w-3.5 h-3.5" />Autonomous Sprint</TabsTrigger>
              <TabsTrigger value="analyze" className="gap-2 text-xs"><Activity className="w-3.5 h-3.5" />Code Analyzer</TabsTrigger>
            </TabsList>
            <div className="flex-1 min-h-0 bg-secondary/10 border border-border/40 rounded-xl p-4 overflow-hidden">
              <TabsContent value="generate" className="h-full m-0 overflow-y-auto">
                <CodeGenPanel bots={bots || []} />
              </TabsContent>
              <TabsContent value="autonomous" className="h-full m-0 overflow-y-auto">
                <AutonomousPanel />
              </TabsContent>
              <TabsContent value="analyze" className="h-full m-0 overflow-y-auto">
                <AnalyzePanel />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
