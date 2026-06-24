import { useState, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import {
  Code2, Brain, Shield, Zap, RefreshCw, Bug, FileCode, Sparkles,
  ChevronLeft, Copy, Check, Play, Search, GitBranch, Terminal,
  BookOpen, Wand2, MessageSquare, BarChart2, Loader2, ChevronDown,
  Star, Package, Lock, Gauge
} from "lucide-react";
import { Streamdown } from "streamdown";

const LANGUAGES = ["typescript", "javascript", "python", "rust", "go", "java", "sql", "css", "html", "bash"];

const ANALYSIS_TYPES = [
  { value: "review", label: "Code Review", icon: Search, color: "text-blue-400", desc: "Full review with severity ratings" },
  { value: "security", label: "Security Audit", icon: Shield, color: "text-red-400", desc: "OWASP Top 10 + vulnerability scan" },
  { value: "performance", label: "Performance", icon: Gauge, color: "text-yellow-400", desc: "Bottlenecks + Big-O analysis" },
  { value: "refactor", label: "Refactor", icon: RefreshCw, color: "text-green-400", desc: "DRY, SOLID, patterns" },
  { value: "explain", label: "Explain", icon: BookOpen, color: "text-purple-400", desc: "Plain English explanation" },
  { value: "test", label: "Generate Tests", icon: Bug, color: "text-orange-400", desc: "Unit tests + edge cases" },
  { value: "document", label: "Document", icon: FileCode, color: "text-cyan-400", desc: "JSDoc / TSDoc generation" },
] as const;

type AnalysisType = typeof ANALYSIS_TYPES[number]["value"];
type TabType = "analyze" | "generate" | "chat" | "platform";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

export default function CodeIntelligence() {
  const { isAuthenticated } = useAuth();
  const [tab, setTab] = useState<TabType>("analyze");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("typescript");
  const [analysisType, setAnalysisType] = useState<AnalysisType>("review");
  const [filename, setFilename] = useState("");
  const [result, setResult] = useState<string | null>(null);

  // Generate tab
  const [genDescription, setGenDescription] = useState("");
  const [genLanguage, setGenLanguage] = useState("typescript");
  const [genFramework, setGenFramework] = useState("");
  const [genStyle, setGenStyle] = useState<"minimal" | "production" | "documented">("production");
  const [genResult, setGenResult] = useState<string | null>(null);

  // Chat tab
  const [chatHistory, setChatHistory] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [chatMsg, setChatMsg] = useState("");
  const [chatContext, setChatContext] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Platform tab
  const platformQuery = trpc.codeIntelligence.analyzePlatform.useQuery();

  const analyzeCode = trpc.codeIntelligence.analyzeCode.useMutation({
    onSuccess: (data) => { setResult(data.analysis); },
    onError: () => toast.error("Analysis failed. Please try again."),
  });

  const generateCode = trpc.codeIntelligence.generate.useMutation({
    onSuccess: (data) => { setGenResult(data.code); },
    onError: () => toast.error("Generation failed. Please try again."),
  });

  const chatMutation = trpc.codeIntelligence.chat.useMutation({
    onSuccess: (data) => {
      setChatHistory(prev => [...prev, { role: "assistant", content: data.reply }]);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    },
    onError: () => toast.error("Chat failed. Please try again."),
  });

  const handleAnalyze = () => {
    if (!isAuthenticated) { window.location.href = getLoginUrl(); return; }
    if (!code.trim()) { toast.error("Please enter some code to analyze"); return; }
    analyzeCode.mutate({ code, language, analysisType, filename: filename || undefined });
  };

  const handleGenerate = () => {
    if (!isAuthenticated) { window.location.href = getLoginUrl(); return; }
    if (!genDescription.trim()) { toast.error("Please describe what you want to generate"); return; }
    generateCode.mutate({ description: genDescription, language: genLanguage, framework: genFramework || undefined, style: genStyle });
  };

  const handleChat = () => {
    if (!isAuthenticated) { window.location.href = getLoginUrl(); return; }
    if (!chatMsg.trim()) return;
    const msg = chatMsg;
    setChatMsg("");
    setChatHistory(prev => [...prev, { role: "user", content: msg }]);
    chatMutation.mutate({ message: msg, codeContext: chatContext || undefined, history: chatHistory });
  };

  const TABS = [
    { id: "analyze" as const, label: "Analyze", icon: Search },
    { id: "generate" as const, label: "Generate", icon: Wand2 },
    { id: "chat" as const, label: "AI Chat", icon: MessageSquare },
    { id: "platform" as const, label: "Platform", icon: BarChart2 },
  ];

  return (
    <div className="min-h-screen bg-[#07050f] text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-white/5 bg-[#07050f]/95 backdrop-blur px-4 py-3 flex items-center gap-3">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-1 text-slate-400 hover:text-white">
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white">HOPE AI Code Intelligence</span>
          <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-xs">BETA</Badge>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          Powered by Claude + GPT-5
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Tab Bar */}
        <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-6 w-fit">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t.id
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* ANALYZE TAB */}
        {tab === "analyze" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left — Input */}
            <div className="space-y-4">
              <div className="bg-[#0e0a1a]/80 border border-white/5 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-purple-400" /> Code Input
                </h3>

                <div className="flex gap-3">
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs text-slate-400">Language</Label>
                    <select
                      value={language}
                      onChange={e => setLanguage(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                    >
                      {LANGUAGES.map(l => <option key={l} value={l} className="bg-[#0e0a1a]">{l}</option>)}
                    </select>
                  </div>
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs text-slate-400">Filename (optional)</Label>
                    <Input
                      value={filename}
                      onChange={e => setFilename(e.target.value)}
                      placeholder="e.g. auth.ts"
                      className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-9 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-slate-400">Paste your code</Label>
                  <Textarea
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    placeholder="// Paste your code here..."
                    className="bg-black/40 border-white/10 text-white placeholder:text-slate-700 font-mono text-xs min-h-[300px] resize-none"
                  />
                </div>
              </div>

              {/* Analysis type selector */}
              <div className="bg-[#0e0a1a]/80 border border-white/5 rounded-2xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-white">Analysis Type</h3>
                <div className="grid grid-cols-2 gap-2">
                  {ANALYSIS_TYPES.map(at => (
                    <button
                      key={at.value}
                      onClick={() => setAnalysisType(at.value)}
                      className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                        analysisType === at.value
                          ? "border-purple-500/50 bg-purple-500/10"
                          : "border-white/5 hover:border-white/10"
                      }`}
                    >
                      <at.icon className={`w-4 h-4 shrink-0 ${at.color}`} />
                      <div>
                        <p className="text-xs font-semibold text-white">{at.label}</p>
                        <p className="text-[10px] text-slate-500">{at.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <Button
                  onClick={handleAnalyze}
                  disabled={analyzeCode.isPending || !code.trim()}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold gap-2"
                >
                  {analyzeCode.isPending ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>
                  ) : (
                    <><Play className="w-4 h-4" /> Run Analysis</>
                  )}
                </Button>
              </div>
            </div>

            {/* Right — Result */}
            <div className="bg-[#0e0a1a]/80 border border-white/5 rounded-2xl p-5 min-h-[500px] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-400" /> Analysis Result
                </h3>
                {result && <CopyButton text={result} />}
              </div>

              {analyzeCode.isPending ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
                  <p className="text-slate-400 text-sm">HOPE AI is analyzing your code...</p>
                </div>
              ) : result ? (
                <div className="flex-1 overflow-y-auto prose prose-invert prose-sm max-w-none">
                  <Streamdown>{result}</Streamdown>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                    <Brain className="w-8 h-8 text-purple-400" />
                  </div>
                  <p className="text-slate-400 text-sm">Paste code and select an analysis type to get started</p>
                  <p className="text-slate-600 text-xs">HOPE AI will provide detailed, actionable insights</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* GENERATE TAB */}
        {tab === "generate" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-[#0e0a1a]/80 border border-white/5 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-yellow-400" /> Code Generator
                </h3>

                <div className="space-y-1">
                  <Label className="text-xs text-slate-400">Describe what you want</Label>
                  <Textarea
                    value={genDescription}
                    onChange={e => setGenDescription(e.target.value)}
                    placeholder="e.g. A React hook that fetches user data with caching, error handling, and retry logic..."
                    className="bg-black/40 border-white/10 text-white placeholder:text-slate-700 text-sm min-h-[120px] resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-400">Language</Label>
                    <select
                      value={genLanguage}
                      onChange={e => setGenLanguage(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                    >
                      {LANGUAGES.map(l => <option key={l} value={l} className="bg-[#0e0a1a]">{l}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-400">Framework (optional)</Label>
                    <Input
                      value={genFramework}
                      onChange={e => setGenFramework(e.target.value)}
                      placeholder="e.g. React, Express..."
                      className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-9 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-slate-400">Code Style</Label>
                  <div className="flex gap-2">
                    {(["minimal", "production", "documented"] as const).map(s => (
                      <button
                        key={s}
                        onClick={() => setGenStyle(s)}
                        className={`flex-1 py-2 rounded-lg border text-xs font-medium capitalize transition-all ${
                          genStyle === s
                            ? "border-yellow-500/50 bg-yellow-500/10 text-yellow-300"
                            : "border-white/10 text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={generateCode.isPending || !genDescription.trim()}
                  className="w-full bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/30 font-bold gap-2"
                >
                  {generateCode.isPending ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                  ) : (
                    <><Sparkles className="w-4 h-4" /> Generate Code</>
                  )}
                </Button>
              </div>
            </div>

            <div className="bg-[#0e0a1a]/80 border border-white/5 rounded-2xl p-5 min-h-[400px] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-yellow-400" /> Generated Code
                </h3>
                {genResult && <CopyButton text={genResult} />}
              </div>

              {generateCode.isPending ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-10 h-10 text-yellow-400 animate-spin" />
                  <p className="text-slate-400 text-sm">HOPE AI is writing your code...</p>
                </div>
              ) : genResult ? (
                <div className="flex-1 overflow-y-auto prose prose-invert prose-sm max-w-none">
                  <Streamdown>{genResult}</Streamdown>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                    <Wand2 className="w-8 h-8 text-yellow-400" />
                  </div>
                  <p className="text-slate-400 text-sm">Describe what you want to build</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CHAT TAB */}
        {tab === "chat" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Context panel */}
            <div className="bg-[#0e0a1a]/80 border border-white/5 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-cyan-400" /> Code Context (optional)
              </h3>
              <Textarea
                value={chatContext}
                onChange={e => setChatContext(e.target.value)}
                placeholder="Paste code for HOPE AI to reference during the conversation..."
                className="bg-black/40 border-white/10 text-white placeholder:text-slate-700 font-mono text-xs min-h-[300px] resize-none"
              />
              <p className="text-xs text-slate-600">HOPE AI will reference this code in all responses.</p>
            </div>

            {/* Chat */}
            <div className="lg:col-span-2 bg-[#0e0a1a]/80 border border-white/5 rounded-2xl flex flex-col min-h-[500px]">
              <div className="p-4 border-b border-white/5 flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-bold text-white">HOPE AI Code Chat</span>
                <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-xs ml-auto">Online</Badge>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                {chatHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-8">
                    <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                      <MessageSquare className="w-8 h-8 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Ask HOPE AI anything about code</p>
                      <p className="text-slate-500 text-sm mt-1">Code review, debugging, architecture, best practices...</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
                      {[
                        "Review my authentication code",
                        "How do I optimize this query?",
                        "Explain this TypeScript pattern",
                        "Find bugs in my function",
                      ].map(q => (
                        <button
                          key={q}
                          onClick={() => { setChatMsg(q); }}
                          className="text-xs text-slate-400 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg px-3 py-2 text-left transition-all"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  chatHistory.map((msg, i) => (
                    <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      {msg.role === "assistant" && (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shrink-0">
                          <Brain className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.role === "user"
                          ? "bg-purple-500/20 border border-purple-500/30 text-white"
                          : "bg-white/5 border border-white/5 text-slate-200"
                      }`}>
                        {msg.role === "assistant" ? (
                          <div className="prose prose-invert prose-sm max-w-none text-sm">
                            <Streamdown>{msg.content}</Streamdown>
                          </div>
                        ) : (
                          <p className="text-sm">{msg.content}</p>
                        )}
                      </div>
                    </div>
                  ))
                )}
                {chatMutation.isPending && (
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shrink-0">
                      <Brain className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="bg-white/5 border border-white/5 rounded-2xl px-4 py-3">
                      <div className="flex gap-1">
                        {[0, 1, 2].map(i => (
                          <div key={i} className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="p-4 border-t border-white/5">
                <div className="flex gap-2">
                  <Input
                    value={chatMsg}
                    onChange={e => setChatMsg(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleChat()}
                    placeholder="Ask HOPE AI about your code..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 text-sm h-10"
                  />
                  <Button
                    onClick={handleChat}
                    disabled={!chatMsg.trim() || chatMutation.isPending}
                    className="h-10 bg-purple-500/20 hover:bg-purple-500/40 border border-purple-500/30 text-purple-300"
                  >
                    {chatMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PLATFORM TAB */}
        {tab === "platform" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Lines of Code", value: platformQuery.data?.stats.linesOfCode || "...", icon: Code2, color: "text-purple-400" },
                { label: "Test Files", value: platformQuery.data?.stats.testFiles || "...", icon: Bug, color: "text-green-400" },
                { label: "Passing Tests", value: platformQuery.data?.stats.passingTests || "...", icon: Check, color: "text-blue-400" },
                { label: "Features", value: platformQuery.data?.stats.features || "...", icon: Star, color: "text-yellow-400" },
              ].map(stat => (
                <div key={stat.label} className="bg-[#0e0a1a]/80 border border-white/5 rounded-2xl p-5 text-center">
                  <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#0e0a1a]/80 border border-white/5 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-cyan-400" /> Tech Stack
                </h3>
                {platformQuery.data?.techStack && Object.entries(platformQuery.data.techStack).map(([layer, items]) => (
                  <div key={layer}>
                    <p className="text-xs font-semibold text-slate-400 capitalize mb-2">{layer}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(items as string[]).map(item => (
                        <Badge key={item} className="bg-white/5 text-slate-300 border-white/10 text-xs">{item}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#0e0a1a]/80 border border-white/5 rounded-2xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Package className="w-4 h-4 text-orange-400" /> Platform Summary
                </h3>
                <pre className="text-xs text-slate-400 whitespace-pre-wrap font-mono bg-black/30 rounded-xl p-3 overflow-auto max-h-60">
                  {platformQuery.data?.summary || "Loading..."}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
