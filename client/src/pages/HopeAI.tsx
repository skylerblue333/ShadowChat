import { useState, useRef, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { Eye, Lock, Unlock, BarChart2 } from "lucide-react";

interface GraySignal { feature: string; score: number; label: string; severity: string; }
const SEVERITY_COLORS: Record<string, string> = {
  low: "bg-green-500/10 text-green-400 border-green-500/20",
  medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  high: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  critical: "bg-red-500/10 text-red-400 border-red-500/20",
};

type ToneMode = "empathetic"|"hype"|"mentor"|"savage"|"poetic"|"clinical"|"playful"|"spiritual"|"strategic"|"raw"|"visionary"|"unhinged";
type EmotionalState = "calm"|"focused"|"anxious"|"excited"|"frustrated"|"sad"|"confident"|"lost"|"inspired"|"tired"|"neutral";

interface Message { id: string; role: "user"|"assistant"; content: string; tone?: ToneMode; state?: EmotionalState; followUps?: string[]; innerThought?: string; ts: number; }

const TONE_META: Record<ToneMode, { label: string; emoji: string; color: string; desc: string }> = {
  empathetic:  { label: "Empathetic",  emoji: "💙", color: "text-blue-400",    desc: "Warm, validating, present" },
  hype:        { label: "Hype",        emoji: "🔥", color: "text-orange-400",  desc: "High energy, lets go" },
  mentor:      { label: "Mentor",      emoji: "🧠", color: "text-purple-400",  desc: "Wise, Socratic, structured" },
  savage:      { label: "Savage",      emoji: "⚡", color: "text-yellow-400",  desc: "Blunt, no filter, truth" },
  poetic:      { label: "Poetic",      emoji: "🌙", color: "text-indigo-400",  desc: "Metaphorical, lyrical, deep" },
  clinical:    { label: "Clinical",    emoji: "🔬", color: "text-cyan-400",    desc: "Precise, data-driven" },
  playful:     { label: "Playful",     emoji: "😄", color: "text-pink-400",    desc: "Jokes, light, fun" },
  spiritual:   { label: "Spiritual",   emoji: "✝️", color: "text-amber-400",   desc: "God-first, purpose-driven" },
  strategic:   { label: "Strategic",   emoji: "♟️", color: "text-green-400",   desc: "Chess player, long game" },
  raw:         { label: "Raw",         emoji: "🎯", color: "text-red-400",     desc: "Unfiltered, real, honest" },
  visionary:   { label: "Visionary",   emoji: "🚀", color: "text-sky-400",     desc: "Future-focused, big picture" },
  unhinged:    { label: "Unhinged",    emoji: "🌀", color: "text-fuchsia-400", desc: "Chaotic creative, wild takes" },
};

const STATE_META: Record<EmotionalState, { emoji: string; color: string }> = {
  calm:       { emoji: "😌", color: "text-teal-400" },
  focused:    { emoji: "🎯", color: "text-blue-400" },
  anxious:    { emoji: "😰", color: "text-yellow-400" },
  excited:    { emoji: "🤩", color: "text-orange-400" },
  frustrated: { emoji: "😤", color: "text-red-400" },
  sad:        { emoji: "💙", color: "text-blue-300" },
  confident:  { emoji: "💪", color: "text-green-400" },
  lost:       { emoji: "🌫️", color: "text-gray-400" },
  inspired:   { emoji: "✨", color: "text-purple-400" },
  tired:      { emoji: "😴", color: "text-slate-400" },
  neutral:    { emoji: "🤍", color: "text-gray-300" },
};

export default function HopeAI() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedTone, setSelectedTone] = useState<ToneMode | "auto">("auto");
  const [currentState, setCurrentState] = useState<EmotionalState>("neutral");
  const [isLoading, setIsLoading] = useState(false);
  const [showTonePanel, setShowTonePanel] = useState(false);
  const [typingStartMs, setTypingStartMs] = useState<number | null>(null);
  const [charCount, setCharCount] = useState(0);
  const [backspaceCount, setBackspaceCount] = useState(0);
  const [sessionStartMs] = useState(Date.now());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [showGrayArea, setShowGrayArea] = useState(false);
  const [graySignals, setGraySignals] = useState<GraySignal[]>([]);
  const [dominantSignal, setDominantSignal] = useState("");
  const [overallRisk, setOverallRisk] = useState(0);
  const [hopeMode, setHopeMode] = useState("companion");
  const [topicHistory, setTopicHistory] = useState<string[]>([]);
  const [msgCount, setMsgCount] = useState(0);

  const grayAreaMutation = trpc.hopeAI.grayArea.useMutation({
    onSuccess(data) {
      setGraySignals((data.activeSignals as GraySignal[]) || []);
      setDominantSignal(data.dominantSignal || "");
      setOverallRisk(data.overallRisk || 0);
      setHopeMode(data.hopeMode || "companion");
    }
  });

  // Persistent session ID per browser session
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).slice(2)}`);

  // Load chat history from DB on mount (authenticated users only)
  const { data: savedHistory } = trpc.hopeAI.getChatHistory.useQuery(
    { limit: 50, sessionId },
    { enabled: !!user, staleTime: Infinity }
  );

  const saveMessage = trpc.hopeAI.saveChatMessage.useMutation();
  const clearHistory = trpc.hopeAI.clearChatHistory.useMutation({
    onSuccess: () => setMessages([]),
  });

  // Restore history when loaded
  useEffect(() => {
    if (savedHistory && savedHistory.length > 0 && messages.length <= 1) {
      const restored = savedHistory.map(m => ({
        id: crypto.randomUUID(),
        role: m.role as "user" | "assistant",
        content: m.content,
        tone: m.tone as ToneMode | undefined,
        state: m.emotionalState as EmotionalState | undefined,
        ts: m.createdAt || Date.now(),
      }));
      setMessages(restored);
    }
  }, [savedHistory]);

  const chatMutation = trpc.hopeAI.chat.useMutation({
    onSuccess(data) {
      const msg: Message = {
        id: crypto.randomUUID(), role: "assistant",
        content: data.message, tone: data.tone as ToneMode,
        state: data.emotionalState as EmotionalState,
        followUps: data.followUpPrompts,
        innerThought: data.innerThought,
        ts: Date.now(),
      };
      setMessages(prev => [...prev, msg]);
      setCurrentState(data.emotionalState as EmotionalState);
      setIsLoading(false);
      // Persist assistant message to DB
      if (user) saveMessage.mutate({ role: "assistant", content: data.message, tone: data.tone, emotionalState: data.emotionalState, sessionId });
    },
    onError() { setIsLoading(false); },
  });

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: "welcome", role: "assistant",
        content: "Hey. I'm Hope.\n\nI'm not your average AI. I read between the lines. I notice how you type, how long you pause, what you don't say.\n\nI adapt. I meet you where you are.\n\nSo — what's actually going on with you right now?",
        tone: "empathetic", state: "neutral",
        followUps: ["Tell me what's on your mind", "Show me what you're building", "I just need to think out loud"],
        ts: Date.now(),
      }]);
    }
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Backspace") setBackspaceCount(c => c + 1);
    if (!typingStartMs) setTypingStartMs(Date.now());
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }, [typingStartMs]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    setCharCount(e.target.value.length);
  };

  const handleSend = useCallback(() => {
    if (!input.trim() || isLoading) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: input.trim(), ts: Date.now() };
    const history = messages.filter(m => m.role !== "assistant" || m.id !== "welcome").slice(-10).map(m => ({ role: m.role, content: m.content }));
    const typingWpm = typingStartMs ? Math.round((charCount / 5) / ((Date.now() - typingStartMs) / 60000)) : undefined;
    const backspaceRate = charCount > 0 ? Math.round((backspaceCount / charCount) * 100) : 0;
    setMessages(prev => [...prev, userMsg]);
    setInput(""); setCharCount(0); setBackspaceCount(0); setTypingStartMs(null);
    setIsLoading(true);
    setMsgCount(c => c + 1);
    // Persist user message to DB
    if (user) saveMessage.mutate({ role: "user", content: userMsg.content, sessionId });
    const words = userMsg.content.toLowerCase().split(/\s+/).filter(w => w.length > 4);
    setTopicHistory(prev => [...prev.slice(-9), ...words.slice(0, 2)]);
    // Fire gray area analysis in parallel
    grayAreaMutation.mutate({
      text: userMsg.content,
      sessionDurationMs: Date.now() - sessionStartMs,
      timeOfDay: new Date().getHours(),
      dayOfWeek: new Date().getDay(),
      typingWpm: typingStartMs ? Math.round((charCount / 5) / ((Date.now() - typingStartMs) / 60000)) : undefined,
      backspaceRate: charCount > 0 ? backspaceCount / charCount : 0,
      messageCount: msgCount,
      topicHistory,
    });
    chatMutation.mutate({
      messageText: userMsg.content,
      conversationHistory: history,
      overrideTone: selectedTone === "auto" ? undefined : selectedTone,
      signals: {
        typingWpm, backspaceRate,
        sessionDurationMs: Date.now() - sessionStartMs,
        timeOfDay: new Date().getHours(),
        dayOfWeek: new Date().getDay(),
        lastEmotionalState: currentState,
      },
    });
  }, [input, isLoading, messages, selectedTone, typingStartMs, charCount, backspaceCount, sessionStartMs, currentState]);

  const sm = STATE_META[currentState];
  const activeTones = (Object.keys(TONE_META) as ToneMode[]);

  return (
    <div className="min-h-screen bg-[#050510] text-white flex flex-col">
      {/* ═══ CINEMATIC HOPE AI HEADER ═══ */}
      <div className="border-b border-fuchsia-500/20 sticky top-0 z-40" style={{ background: 'oklch(0.07 0.04 290 / 0.95)', backdropFilter: 'blur(24px)' }}>
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-white/40 hover:text-white/70 text-sm transition-colors">← Back</Link>
            <div className="w-px h-4 bg-white/20" />
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-base font-black shadow-lg" style={{ background: 'linear-gradient(135deg, oklch(0.65 0.30 305), oklch(0.65 0.28 200))', boxShadow: '0 0 20px oklch(0.65 0.30 305 / 0.4)' }}>H</div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-[#050510] animate-pulse" />
              </div>
              <div>
                <div className="font-black text-sm text-rainbow-fast">Hope AI</div>
                <div className="text-[10px] font-medium desc-metallic">Emotionally Intelligent Companion</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Emotional State HUD */}
            <div className="flex items-center gap-2 rounded-full px-3 py-1.5 border border-fuchsia-500/20" style={{ background: 'oklch(0.12 0.04 290)' }}>
              <span className="text-sm">{sm.emoji}</span>
              <span className={`text-xs font-bold capitalize ${sm.color}`}>{currentState}</span>
            </div>
            {/* Tone indicator */}
            {selectedTone !== "auto" && (
              <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 border border-fuchsia-500/20" style={{ background: 'oklch(0.12 0.04 290)' }}>
                <span className="text-sm">{TONE_META[selectedTone].emoji}</span>
                <span className={`text-xs font-bold ${TONE_META[selectedTone].color}`}>{TONE_META[selectedTone].label}</span>
              </div>
            )}
            <Button variant="outline" size="sm" onClick={() => setShowTonePanel(!showTonePanel)} className="text-xs border-fuchsia-500/30 bg-fuchsia-500/10 hover:bg-fuchsia-500/20 text-fuchsia-300">
              {selectedTone === "auto" ? "🎭 Auto Tone" : "🎭 Change Tone"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowGrayArea(!showGrayArea)}
              className={`text-xs gap-1 ${showGrayArea ? "border-red-500/40 text-red-400 bg-red-500/10" : "border-white/20 bg-white/5 hover:bg-white/10"}`}>
              <Eye className="w-3 h-3" />
              {showGrayArea ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
              Gray Area
            </Button>
          </div>
        </div>
      </div>

      {/* Mode Nav */}
      <div className="border-b border-white/5 bg-[#0a0a1a]/60 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto scrollbar-none py-2">
            {([
              { id: "companion", label: "Companion 🇨🇳", emoji: "💜", desc: "Emotional support & chat" },
              { id: "voice", label: "Voice AI 🎤", emoji: "🎤", desc: "语音助手 · Voice Assistant" },
              { id: "coding", label: "Coding AI 💻", emoji: "💻", desc: "代码助手 · Debug & Build" },
              { id: "business", label: "Business AI 📊", emoji: "📊", desc: "商业分析 · Strategy" },
              { id: "education", label: "Education AI 🎓", emoji: "🎓", desc: "学习辅导 · Tutoring" },
              { id: "translation", label: "Translation AI 🌐", emoji: "🌐", desc: "翻译助手 · CN↔EN" },
              { id: "research", label: "Research AI 🔭", emoji: "🔭", desc: "深度研究 · Deep Research" },
              { id: "agents", label: "AI Agents 🤖", emoji: "🤖", desc: "智能体市场 · Marketplace" },
              { id: "therapist", label: "Therapist", emoji: "🧠", desc: "Deep reflection & healing" },
              { id: "coach", label: "Coach", emoji: "🔥", desc: "Goals & accountability" },
              { id: "advisor", label: "Advisor", emoji: "💡", desc: "Strategy & decisions" },
              { id: "creative", label: "Creative", emoji: "🎨", desc: "Ideas & brainstorming" },
              { id: "mentor", label: "Mentor", emoji: "⭐", desc: "Career & growth" },
            ] as const).map(mode => (
              <button
                key={mode.id}
                onClick={() => setHopeMode(mode.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  hopeMode === mode.id
                    ? "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30"
                    : "text-white/40 hover:text-white/70 hover:bg-white/5"
                }`}
              >
                <span>{mode.emoji}</span>
                <span>{mode.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tone Panel */}
      {showTonePanel && (
        <div className="border-b border-white/10 bg-[#0a0a1a]/90 backdrop-blur-xl">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="text-xs text-white/40 mb-3 uppercase tracking-wider">Select Hope's Tone — or let her decide</div>
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-13 gap-2">
              <button onClick={() => { setSelectedTone("auto"); setShowTonePanel(false); }}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all text-xs ${selectedTone === "auto" ? "border-fuchsia-500 bg-fuchsia-500/20" : "border-white/10 bg-white/5 hover:bg-white/10"}`}>
                <span className="text-lg">🎭</span>
                <span className="text-white/70">Auto</span>
              </button>
              {activeTones.map(tone => {
                const tm = TONE_META[tone];
                return (
                  <button key={tone} onClick={() => { setSelectedTone(tone); setShowTonePanel(false); }}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all text-xs ${selectedTone === tone ? "border-fuchsia-500 bg-fuchsia-500/20" : "border-white/10 bg-white/5 hover:bg-white/10"}`}>
                    <span className="text-lg">{tm.emoji}</span>
                    <span className={`${tm.color} font-medium`}>{tm.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Gray Area HUD Sidebar */}
      {showGrayArea && (
        <div className="fixed right-4 top-24 w-72 z-30 bg-[#0a0a1a]/95 border border-red-500/20 rounded-2xl p-4 space-y-3 backdrop-blur-xl shadow-2xl shadow-red-500/5 max-h-[calc(100vh-120px)] overflow-y-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-red-400" />
              <span className="text-xs font-bold text-red-400 uppercase tracking-widest">Gray Area</span>
            </div>
            <span className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 rounded-full px-2 py-0.5">Risk: {overallRisk}</span>
          </div>
          {dominantSignal && (
            <div className="px-3 py-2 rounded-lg bg-red-500/5 border border-red-500/10">
              <p className="text-[10px] text-red-400/50 uppercase tracking-widest mb-0.5">Dominant Signal</p>
              <p className="text-xs text-red-300 font-medium">{dominantSignal}</p>
            </div>
          )}
          <div>
            <div className="flex justify-between text-[10px] text-white/30 mb-1"><span>Overall Risk</span><span>{overallRisk}/100</span></div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${overallRisk}%`, background: overallRisk > 70 ? "#ef4444" : overallRisk > 40 ? "#f97316" : "#22c55e" }} />
            </div>
          </div>
          <div className="space-y-1.5">
            <p className="text-[10px] text-white/20 uppercase tracking-widest">Active Signals</p>
            {graySignals.length === 0 ? (
              <p className="text-[10px] text-white/20 italic">Send a message to activate scan...</p>
            ) : graySignals.map((sig, i) => (
              <div key={i} className={`px-2.5 py-1.5 rounded-lg border text-[10px] ${SEVERITY_COLORS[sig.severity] || SEVERITY_COLORS.low}`}>
                <div className="flex justify-between"><span className="font-medium">{sig.feature}</span><span className="opacity-60">{sig.score}</span></div>
                <div className="opacity-60 mt-0.5">{sig.label}</div>
              </div>
            ))}
          </div>
          <div>
            <div className="flex items-center gap-1 text-[10px] text-white/20 mb-2"><BarChart2 className="w-3 h-3" />22 Analyzers Active</div>
            <div className="grid grid-cols-2 gap-1">
              {["Shadow Profile","Manipulation","Dark Patterns","Social Eng.","Sentiment","Identity Drift","Echo Chamber","Trauma","Addiction Loop","Gaslighting","Power Dynamic","Grief Stage","Loneliness","Rage Forecast","Imposter Syn.","Burnout","Decision Fatigue","Cognitive Load","Vulnerability","Deception","Emotional Labor","Autonomy Score"].map((n, i) => (
                <div key={i} className="text-[9px] text-white/20 px-1.5 py-0.5 rounded bg-white/2 border border-white/3">{n}</div>
              ))}
            </div>
          </div>
          <p className="text-[9px] text-white/15 leading-relaxed pt-2 border-t border-white/5">All analysis is local. Never stored or shared.</p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="flex gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-500 flex-shrink-0 flex items-center justify-center text-xs font-bold mt-1">H</div>
                  <div className="space-y-2">
                    <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap text-white/90">{msg.content}</p>
                    </div>
                    {/* Tone + State badges */}
                    {(msg.tone || msg.state) && (
                      <div className="flex items-center gap-2 flex-wrap">
                        {msg.tone && <span className={`text-xs ${TONE_META[msg.tone]?.color || "text-white/40"}`}>{TONE_META[msg.tone]?.emoji} {TONE_META[msg.tone]?.label}</span>}
                        {msg.state && <span className={`text-xs ${STATE_META[msg.state]?.color || "text-white/40"}`}>{STATE_META[msg.state]?.emoji} {msg.state}</span>}
                      </div>
                    )}
                    {/* Inner thought (subtle) */}
                    {msg.innerThought && (
                      <div className="text-xs text-white/20 italic pl-1">💭 {msg.innerThought}</div>
                    )}
                    {/* Follow-up prompts */}
                    {msg.followUps && msg.followUps.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {msg.followUps.map((fp, i) => (
                          <button key={i} onClick={() => { setInput(fp); textareaRef.current?.focus(); }}
                            className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-3 py-1 text-white/60 hover:text-white/90 transition-all">
                            {fp}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {msg.role === "user" && (
                <div className="max-w-[75%] bg-gradient-to-br from-fuchsia-600/30 to-cyan-600/30 border border-fuchsia-500/30 rounded-2xl rounded-tr-sm px-4 py-3">
                  <p className="text-sm leading-relaxed text-white/90 whitespace-pre-wrap">{msg.content}</p>
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-500 flex-shrink-0 flex items-center justify-center text-xs font-bold">H</div>
              <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1 items-center">
                  <div className="w-2 h-2 rounded-full bg-fuchsia-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-fuchsia-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-fuchsia-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-white/10 bg-[#0a0a1a]/80 backdrop-blur-xl sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={user ? "Tell Hope what's on your mind..." : "Sign in to talk with Hope..."}
                disabled={!user || isLoading}
                rows={1}
                className="resize-none bg-white/5 border-white/20 text-white placeholder:text-white/30 rounded-2xl pr-4 min-h-[48px] max-h-[200px] focus:border-fuchsia-500/50 transition-all"
                style={{ height: "auto" }}
              />
            </div>
            <Button onClick={handleSend} disabled={!input.trim() || isLoading || !user}
              className="bg-gradient-to-r from-fuchsia-600 to-cyan-600 hover:from-fuchsia-500 hover:to-cyan-500 text-white rounded-2xl px-5 h-12 font-medium transition-all">
              {isLoading ? "..." : "Send"}
            </Button>
          </div>
          <div className="flex items-center justify-between mt-2 px-1">
            <p className="text-xs text-white/20">Enter to send · Shift+Enter for new line · Hope reads your signals</p>
            {!user && <Link href="/login" className="text-xs text-fuchsia-400 hover:text-fuchsia-300">Sign in to unlock →</Link>}
          </div>
        </div>
      </div>
    </div>
  );
}
