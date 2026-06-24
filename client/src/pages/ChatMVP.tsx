/**
 * ChatMVP — YC MVP Surface 1
 * "Chat that can execute actions"
 * Core loop: user chats → AI helps → action happens → value flows → user returns
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { Link } from "wouter";
import {
  Send, Bot, Zap, DollarSign, Briefcase, ShoppingBag, Heart,
  Paperclip, Smile, MoreVertical, ArrowLeft, Search, Plus,
  CheckCheck, Check, Sparkles, X, ChevronRight, Loader2,
  Mic, Video, Phone, Star, Shield, TrendingUp
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
type Message = {
  id: number;
  content: string;
  senderId: number;
  senderName: string;
  senderAvatar?: string;
  timestamp: Date;
  type: "text" | "tip" | "action" | "ai" | "system";
  tipAmount?: number;
  actionType?: string;
  actionData?: Record<string, unknown>;
  status?: "sending" | "sent" | "delivered" | "read";
};

type ActionType = "tip" | "request_service" | "create_listing" | "match_request" | "ai_task";

const ACTION_QUICK_BUTTONS: { type: ActionType; label: string; icon: React.ElementType; color: string }[] = [
  { type: "tip", label: "Send Tip", icon: DollarSign, color: "text-yellow-400" },
  { type: "ai_task", label: "Ask AI", icon: Bot, color: "text-purple-400" },
  { type: "request_service", label: "Request Service", icon: Briefcase, color: "text-blue-400" },
  { type: "create_listing", label: "Create Listing", icon: ShoppingBag, color: "text-green-400" },
];

const AI_COMMANDS = [
  { cmd: "/find designer", desc: "Find a designer and pay" },
  { cmd: "/tip 20", desc: "Send 20 SKY444 tip" },
  { cmd: "/sell item", desc: "Create a listing" },
  { cmd: "/match", desc: "Find a match" },
  { cmd: "/earn", desc: "Show earning options" },
  { cmd: "/analyze", desc: "Analyze conversation" },
];

// ─── Mock conversation data (replaced by real tRPC below) ────────────────────
const DEMO_CONVERSATIONS = [
  { id: 1, name: "NOVA AI", avatar: "🤖", lastMessage: "I found 3 designers for you", unread: 2, isAI: true, online: true },
  { id: 2, name: "Alex Chen", avatar: "👤", lastMessage: "Thanks for the tip!", unread: 0, isAI: false, online: true },
  { id: 3, name: "Sarah K.", avatar: "👤", lastMessage: "Can you send $20?", unread: 1, isAI: false, online: false },
  { id: 4, name: "Creator Hub", avatar: "⭐", lastMessage: "New collab opportunity", unread: 0, isAI: false, online: true },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function ChatMVP() {
  const { user } = useAuth();
  const [selectedConvId, setSelectedConvId] = useState<number>(1);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1, content: "Hey! I'm NOVA, your AI assistant. I can help you earn money, find services, send payments, and more. Try typing /find designer or /tip 20 to see what I can do.", senderId: 0, senderName: "NOVA AI", timestamp: new Date(Date.now() - 120000), type: "ai", status: "read"
    },
    {
      id: 2, content: "That's amazing! Can you find me a logo designer for $50?", senderId: user?.id ?? 1, senderName: user?.username ?? "You", timestamp: new Date(Date.now() - 60000), type: "text", status: "read"
    },
    {
      id: 3, content: "Found 3 designers matching your budget:\n\n1. **PixelPro** — 4.9★ · $45 · 2-day delivery\n2. **DesignNova** — 4.7★ · $50 · 1-day delivery\n3. **ArtCore** — 4.8★ · $40 · 3-day delivery\n\nShall I send payment to PixelPro and start the project?", senderId: 0, senderName: "NOVA AI", timestamp: new Date(Date.now() - 30000), type: "ai", status: "read"
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [showActions, setShowActions] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  const [tipAmount, setTipAmount] = useState("10");
  const [tipMessage, setTipMessage] = useState("");
  const [aiThinking, setAiThinking] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Real tRPC data
  const { data: conversations } = trpc.dm.conversations.useQuery();
  const sendMsgMut = trpc.dm.send.useMutation();
  const tipMut = trpc.creator.tip.useMutation({
    onSuccess: () => {
      toast.success(`Tip of ${tipAmount} SKY444 sent!`);
      setShowTipModal(false);
      addSystemMessage(`💰 Tip of ${tipAmount} SKY444 sent successfully`);
    },
    onError: () => toast.error("Tip failed — check your balance"),
  });
  const aiChatMut = trpc.ai.chat.useMutation();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addSystemMessage = (content: string) => {
    setMessages(prev => [...prev, {
      id: Date.now(), content, senderId: -1, senderName: "System",
      timestamp: new Date(), type: "system", status: "delivered"
    }]);
  };

  const handleSend = useCallback(async () => {
    if (!inputText.trim()) return;
    const text = inputText.trim();
    setInputText("");
    setShowCommands(false);

    // Add user message optimistically
    const userMsg: Message = {
      id: Date.now(), content: text, senderId: user?.id ?? 1,
      senderName: user?.username ?? "You", timestamp: new Date(),
      type: "text", status: "sending"
    };
    setMessages(prev => [...prev, userMsg]);

    // Check for AI commands
    const isAIConv = selectedConvId === 1;
    const isCommand = text.startsWith("/");

    if (isAIConv || isCommand) {
      setAiThinking(true);
      try {
        const systemPrompt = `You are NOVA, an AI assistant inside ShadowChat. You help users earn money, find services, send payments, and execute real-world actions through conversation. Keep responses concise and action-oriented. When users ask to find/hire/pay someone, show 3 options with prices. When they want to tip, confirm the amount. Format important info with **bold**. Available actions: /tip [amount], /find [service], /sell [item], /match, /earn.`;
        const result = await aiChatMut.mutateAsync({
          message: text,
          systemPrompt,
        });
        const aiContent = (result as any)?.content ?? (result as any)?.message ?? "I'm processing your request...";
        setMessages(prev => [...prev, {
          id: Date.now() + 1, content: aiContent, senderId: 0,
          senderName: "NOVA AI", timestamp: new Date(), type: "ai", status: "delivered"
        }]);
      } catch {
        setMessages(prev => [...prev, {
          id: Date.now() + 1, content: "I'm having trouble connecting right now. Try again in a moment.", senderId: 0,
          senderName: "NOVA AI", timestamp: new Date(), type: "ai", status: "delivered"
        }]);
      } finally {
        setAiThinking(false);
      }
    }
  }, [inputText, selectedConvId, user, aiChatMut]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
    if (e.key === "/" && inputText === "") setShowCommands(true);
    if (e.key === "Escape") setShowCommands(false);
  };

  const handleTipSend = () => {
    if (!user) return toast.error("Login required");
    const conv = DEMO_CONVERSATIONS.find(c => c.id === selectedConvId);
    if (!conv || conv.isAI) return toast.error("Can't tip an AI");
    tipMut.mutate({ recipientId: selectedConvId, amount: Number(tipAmount), message: tipMessage });
  };

  const selectedConv = DEMO_CONVERSATIONS.find(c => c.id === selectedConvId);
  const filteredConvs = DEMO_CONVERSATIONS.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* ── Sidebar: Conversation list ── */}
      <div className="w-80 border-r border-border/50 flex flex-col shrink-0">
        {/* Header */}
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between mb-3">
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="font-bold text-lg bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              ShadowChat
            </h1>
            <button
              onClick={() => toast.info("New conversation")}
              className="p-1.5 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-secondary/30 border border-border/30 rounded-xl pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground/60"
              placeholder="Search conversations..."
            />
          </div>
        </div>

        {/* NOVA AI pinned at top */}
        <div className="p-2">
          <div
            onClick={() => setSelectedConvId(1)}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${selectedConvId === 1 ? "bg-primary/10 border border-primary/30" : "hover:bg-secondary/30"}`}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-primary flex items-center justify-center text-white font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-background" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">NOVA AI</span>
                <span className="text-xs text-primary font-medium">AI</span>
              </div>
              <div className="text-xs text-muted-foreground truncate">I found 3 designers for you</div>
            </div>
            <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-xs text-primary-foreground font-bold">2</div>
          </div>
        </div>

        <div className="px-3 py-1">
          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">People</div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {filteredConvs.filter(c => !c.isAI).map(conv => (
            <div
              key={conv.id}
              onClick={() => setSelectedConvId(conv.id)}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${selectedConvId === conv.id ? "bg-secondary/50" : "hover:bg-secondary/30"}`}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center text-lg">
                  {conv.avatar}
                </div>
                {conv.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-background" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{conv.name}</span>
                  <span className="text-xs text-muted-foreground">now</span>
                </div>
                <div className="text-xs text-muted-foreground truncate">{conv.lastMessage}</div>
              </div>
              {conv.unread > 0 && (
                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-xs text-primary-foreground font-bold">{conv.unread}</div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom nav shortcuts */}
        <div className="p-3 border-t border-border/50 grid grid-cols-4 gap-1">
          {[
            { icon: Bot, label: "AI", href: "/ai-brain" },
            { icon: TrendingUp, label: "Feed", href: "/social" },
            { icon: DollarSign, label: "Wallet", href: "/wallet" },
            { icon: Star, label: "More", href: "/" },
          ].map(item => (
            <Link key={item.label} href={item.href} className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-secondary/30 transition-colors text-muted-foreground hover:text-foreground">
              <item.icon className="w-4 h-4" />
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Main chat area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between bg-background/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-base ${selectedConv?.isAI ? "bg-gradient-to-br from-purple-500 to-primary" : "bg-secondary"}`}>
                {selectedConv?.isAI ? <Bot className="w-4 h-4 text-white" /> : selectedConv?.avatar}
              </div>
              {selectedConv?.online && <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-background" />}
            </div>
            <div>
              <div className="font-semibold text-sm flex items-center gap-1.5">
                {selectedConv?.name}
                {selectedConv?.isAI && <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">AI</span>}
              </div>
              <div className="text-xs text-muted-foreground">
                {selectedConv?.online ? "Online now" : "Last seen recently"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => toast.info("Voice call")} className="p-2 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground"><Phone className="w-4 h-4" /></button>
            <button onClick={() => toast.info("Video call")} className="p-2 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground"><Video className="w-4 h-4" /></button>
            <button onClick={() => toast.info("More options")} className="p-2 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground"><MoreVertical className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map(msg => {
            const isOwn = msg.senderId === (user?.id ?? 1);
            const isSystem = msg.type === "system";
            const isAI = msg.type === "ai";

            if (isSystem) {
              return (
                <div key={msg.id} className="flex justify-center">
                  <span className="text-xs text-muted-foreground bg-secondary/30 px-3 py-1 rounded-full">{msg.content}</span>
                </div>
              );
            }

            return (
              <div key={msg.id} className={`flex gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
                {!isOwn && (
                  <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs ${isAI ? "bg-gradient-to-br from-purple-500 to-primary" : "bg-secondary"}`}>
                    {isAI ? <Bot className="w-3.5 h-3.5 text-white" /> : "👤"}
                  </div>
                )}
                <div className={`max-w-[70%] space-y-1 ${isOwn ? "items-end" : "items-start"} flex flex-col`}>
                  <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    isOwn
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : isAI
                        ? "bg-gradient-to-br from-purple-500/20 to-primary/20 border border-primary/20 rounded-tl-sm"
                        : "bg-secondary/70 rounded-tl-sm"
                  }`}>
                    {isAI && (
                      <div className="flex items-center gap-1 mb-1 text-xs text-primary font-medium">
                        <Sparkles className="w-3 h-3" />
                        NOVA AI
                      </div>
                    )}
                    {/* Render markdown-like bold */}
                    {msg.content.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
                      part.startsWith("**") && part.endsWith("**")
                        ? <strong key={i}>{part.slice(2, -2)}</strong>
                        : <span key={i}>{part}</span>
                    )}
                    {/* Action buttons for AI messages */}
                    {isAI && msg.content.includes("Shall I send payment") && (
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => { toast.success("Payment sent to PixelPro — project started!"); addSystemMessage("✅ $45 sent to PixelPro · Project #4821 started"); }}
                          className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity font-medium"
                        >
                          Yes, pay PixelPro $45
                        </button>
                        <button
                          onClick={() => toast.info("Showing more options...")}
                          className="text-xs bg-secondary/50 px-3 py-1.5 rounded-lg hover:bg-secondary transition-colors"
                        >
                          See more
                        </button>
                      </div>
                    )}
                  </div>
                  <div className={`flex items-center gap-1 text-xs text-muted-foreground ${isOwn ? "flex-row-reverse" : ""}`}>
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    {isOwn && (
                      msg.status === "read" ? <CheckCheck className="w-3 h-3 text-primary" /> :
                      msg.status === "delivered" ? <CheckCheck className="w-3 h-3" /> :
                      <Check className="w-3 h-3" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* AI thinking indicator */}
          {aiThinking && (
            <div className="flex gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-primary flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="bg-gradient-to-br from-purple-500/20 to-primary/20 border border-primary/20 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Command suggestions */}
        {showCommands && (
          <div className="mx-4 mb-2 card p-2 space-y-1 border border-primary/20">
            <div className="text-xs text-muted-foreground px-2 py-1 font-medium">AI Commands</div>
            {AI_COMMANDS.map(cmd => (
              <button
                key={cmd.cmd}
                onClick={() => { setInputText(cmd.cmd); setShowCommands(false); inputRef.current?.focus(); }}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-secondary/50 transition-colors text-left"
              >
                <span className="text-sm font-mono text-primary">{cmd.cmd}</span>
                <span className="text-xs text-muted-foreground">{cmd.desc}</span>
              </button>
            ))}
          </div>
        )}

        {/* Quick action buttons */}
        {showActions && (
          <div className="mx-4 mb-2 flex gap-2 overflow-x-auto pb-1">
            {ACTION_QUICK_BUTTONS.map(action => (
              <button
                key={action.type}
                onClick={() => {
                  if (action.type === "tip") setShowTipModal(true);
                  else if (action.type === "ai_task") { setInputText("/"); setShowCommands(true); }
                  else toast.info(`${action.label} — coming in Phase 2`);
                  setShowActions(false);
                }}
                className="flex items-center gap-1.5 px-3 py-2 bg-secondary/50 hover:bg-secondary rounded-xl text-sm whitespace-nowrap transition-colors shrink-0"
              >
                <action.icon className={`w-4 h-4 ${action.color}`} />
                {action.label}
              </button>
            ))}
          </div>
        )}

        {/* Input bar */}
        <div className="p-3 border-t border-border/50 bg-background/80 backdrop-blur-sm">
          <div className="flex items-end gap-2">
            <button
              onClick={() => setShowActions(!showActions)}
              className={`p-2.5 rounded-xl transition-colors shrink-0 ${showActions ? "bg-primary text-primary-foreground" : "bg-secondary/50 hover:bg-secondary text-muted-foreground"}`}
            >
              {showActions ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                value={inputText}
                onChange={e => {
                  setInputText(e.target.value);
                  if (e.target.value === "/") setShowCommands(true);
                  else if (!e.target.value.startsWith("/")) setShowCommands(false);
                }}
                onKeyDown={handleKeyDown}
                className="w-full bg-secondary/30 border border-border/30 rounded-2xl px-4 py-2.5 text-sm pr-10 placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50"
                placeholder={selectedConv?.isAI ? "Ask NOVA anything... or type / for commands" : "Message..."}
              />
              <button onClick={() => toast.info("Voice message")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                <Mic className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={handleSend}
              disabled={!inputText.trim() || aiThinking}
              className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40 shrink-0"
            >
              {aiThinking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Tip Modal ── */}
      {showTipModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card p-6 w-full max-w-sm animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-yellow-400" />
                Send Tip
              </h3>
              <button onClick={() => setShowTipModal(false)} className="p-1.5 rounded-lg hover:bg-secondary/50 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Amount (SKY444)</label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {["5", "10", "25", "50"].map(amt => (
                    <button
                      key={amt}
                      onClick={() => setTipAmount(amt)}
                      className={`py-2 rounded-xl text-sm font-medium transition-colors ${tipAmount === amt ? "bg-primary text-primary-foreground" : "bg-secondary/50 hover:bg-secondary"}`}
                    >
                      {amt}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={tipAmount}
                  onChange={e => setTipAmount(e.target.value)}
                  className="w-full bg-secondary/50 border border-border/50 rounded-xl px-3 py-2 text-sm"
                  placeholder="Custom amount"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Message (optional)</label>
                <input
                  value={tipMessage}
                  onChange={e => setTipMessage(e.target.value)}
                  className="w-full bg-secondary/50 border border-border/50 rounded-xl px-3 py-2 text-sm"
                  placeholder="Great work! 🔥"
                />
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground bg-secondary/30 rounded-xl p-3">
                <span>Platform fee (5%)</span>
                <span>{(Number(tipAmount) * 0.05).toFixed(2)} SKY444</span>
              </div>
              <button
                onClick={handleTipSend}
                disabled={tipMut.isPending || !tipAmount}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {tipMut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                Send {tipAmount} SKY444
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
