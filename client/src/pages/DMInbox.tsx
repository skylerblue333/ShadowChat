import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  MessageCircle, Search, Send, Phone, Video, MoreHorizontal,
  Sparkles, Coins, Image, Smile, Mic, Lock, Shield, Bot,
  ChevronLeft, Circle, Plus, Star
} from "lucide-react";

const THREADS = [
  { id: 6, name: "hope_ai", avatar: "AI", online: true, verified: true, lastMsg: "I'm reading your signals right now...", time: "now", unread: 0, tier: "ai", isAI: true },
  { id: 1, name: "skyler_blue", avatar: "SB", online: true, verified: true, lastMsg: "Hey! Did you see the new staking rewards?", time: "2m", unread: 3, tier: "diamond" },
  { id: 2, name: "defiwhale", avatar: "DW", online: true, verified: false, lastMsg: "The ICO launchpad looks 🔥", time: "15m", unread: 1, tier: "gold" },
  { id: 3, name: "cryptodev99", avatar: "CD", online: false, verified: false, lastMsg: "I'll review the PR tomorrow", time: "1h", unread: 0, tier: "silver" },
  { id: 4, name: "nftcreator", avatar: "NC", online: false, verified: true, lastMsg: "Thanks for the tip!", time: "3h", unread: 0, tier: "bronze" },
  { id: 5, name: "web3builder", avatar: "WB", online: true, verified: false, lastMsg: "Can we collab on the next drop?", time: "1d", unread: 0, tier: "silver" },
];

const INIT_MESSAGES: Record<number, { id: number; from: string; text: string; time: string; mine: boolean; type?: string }[]> = {
  6: [
    { id: 1, from: "hope_ai", text: "Hello, Skyler. I've been reading your signals. You're operating at high cognitive load right now — multiple threads, elevated urgency. I'll match your pace.", time: "now", mine: false, type: "ai" },
    { id: 2, from: "me", text: "How did you know?", time: "now", mine: true },
    { id: 3, from: "hope_ai", text: "Your typing cadence, session depth, and the fact that you opened 6 tabs in the last 3 minutes. You're in builder mode. I respect that. What do you need?", time: "now", mine: false, type: "ai" },
  ],
  1: [
    { id: 1, from: "skyler_blue", text: "Hey! Did you see the new staking rewards?", time: "10:42", mine: false },
    { id: 2, from: "me", text: "Yes! 44% APY is insane 🚀", time: "10:43", mine: true },
    { id: 3, from: "skyler_blue", text: "I just staked 10K SKY444", time: "10:44", mine: false },
    { id: 4, from: "skyler_blue", text: "The compound calculator shows $4,400 in rewards after 1 year", time: "10:44", mine: false },
    { id: 5, from: "me", text: "That's the dream. Going to stake mine too", time: "10:45", mine: true },
  ],
  2: [
    { id: 1, from: "defiwhale", text: "The ICO launchpad looks 🔥", time: "9:30", mine: false },
    { id: 2, from: "me", text: "We're launching April 24, 2027 — first day to buy SKYCOIN4444", time: "9:31", mine: true },
    { id: 3, from: "defiwhale", text: "I'm in for 50K. What's the presale price?", time: "9:32", mine: false },
  ],
};

const TIER_COLORS: Record<string, string> = {
  diamond: "text-cyan-400", gold: "text-yellow-400", silver: "text-gray-300",
  bronze: "text-orange-400", ai: "text-primary",
};

export default function DMInbox() {
  const [selected, setSelected] = useState(6);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [showTipPanel, setShowTipPanel] = useState(false);
  const [tipAmount, setTipAmount] = useState("");
  const [messages, setMessages] = useState(INIT_MESSAGES);
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const endRef = useRef<HTMLDivElement>(null);

  const msgs = messages[selected] || [];
  const thread = THREADS.find(t => t.id === selected);
  const filtered = THREADS.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs.length]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const msg = { id: Date.now(), from: "me", text: input, time: now, mine: true };
    setMessages(prev => ({ ...prev, [selected]: [...(prev[selected] || []), msg] }));
    const sent = input;
    setInput("");
    if (selected === 6) {
      setTimeout(() => {
        const reply = { id: Date.now() + 1, from: "hope_ai", text: `Processing your intent: "${sent.slice(0, 40)}..." — I see strategic energy here. Let me think with you.`, time: now, mine: false, type: "ai" };
        setMessages(prev => ({ ...prev, [selected]: [...(prev[selected] || []), reply] }));
      }, 1200);
    }
  };

  const sendTip = () => {
    if (!tipAmount || parseFloat(tipAmount) <= 0) return;
    toast.success(`Sent ${tipAmount} SKY444 to ${thread?.name}`);
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const msg = { id: Date.now(), from: "me", text: `💸 Sent ${tipAmount} SKY444`, time: now, mine: true, type: "tip" };
    setMessages(prev => ({ ...prev, [selected]: [...(prev[selected] || []), msg] }));
    setTipAmount(""); setShowTipPanel(false);
  };

  const selectThread = (id: number) => { setSelected(id); setMobileView("chat"); setShowAIPanel(false); setShowTipPanel(false); };

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-background overflow-hidden">
      {/* Thread List */}
      <div className={`${mobileView === "chat" ? "hidden md:flex" : "flex"} w-full md:w-80 flex-col border-r border-border/30 bg-card/30`}>
        <div className="p-4 border-b border-border/30">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-lg flex items-center gap-2"><MessageCircle className="w-5 h-5 text-primary" />Messages</h2>
            <Button size="icon" variant="ghost" className="h-8 w-8"><Plus className="w-4 h-4" /></Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input className="pl-9 h-8 text-sm bg-background/50 border-border/30" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
          {filtered.map(t => (
            <button key={t.id} onClick={() => selectThread(t.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${selected === t.id ? "bg-secondary/60 border border-border/30" : "hover:bg-secondary/30"}`}>
              <div className="relative shrink-0">
                {t.isAI ? (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center"><Bot className="w-5 h-5 text-white" /></div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center">{t.avatar}</div>
                )}
                {t.online && <Circle className="absolute bottom-0 right-0 w-3 h-3 text-green-400 fill-green-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-sm truncate">{t.isAI ? "Hope AI" : t.name}</span>
                    {t.verified && <Star className={`w-3 h-3 ${TIER_COLORS[t.tier]}`} />}
                    {t.isAI && <Sparkles className="w-3 h-3 text-primary" />}
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0 ml-1">{t.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground truncate">{t.lastMsg}</p>
                  {t.unread > 0 && <Badge className="h-4 min-w-4 px-1 text-[9px] bg-primary text-primary-foreground rounded-full shrink-0 ml-1">{t.unread}</Badge>}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`${mobileView === "list" ? "hidden md:flex" : "flex"} flex-1 flex-col min-w-0`}>
        {thread ? (
          <>
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border/30 bg-card/30 shrink-0">
              <Button size="icon" variant="ghost" className="h-8 w-8 md:hidden" onClick={() => setMobileView("list")}><ChevronLeft className="w-4 h-4" /></Button>
              <div className="relative shrink-0">
                {thread.isAI ? (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center"><Bot className="w-4 h-4 text-white" /></div>
                ) : (
                  <div className="w-9 h-9 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center">{thread.avatar}</div>
                )}
                {thread.online && <Circle className="absolute bottom-0 right-0 w-2.5 h-2.5 text-green-400 fill-green-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm">{thread.isAI ? "Hope AI" : thread.name}</span>
                  {thread.verified && <Star className={`w-3 h-3 ${TIER_COLORS[thread.tier]}`} />}
                  {thread.isAI && <Sparkles className="w-3 h-3 text-primary" />}
                </div>
                <p className="text-[10px] text-muted-foreground">{thread.online ? (thread.isAI ? "Always watching. Always learning." : "Online") : "Offline"}</p>
              </div>
              <div className="flex items-center gap-1">
                {!thread.isAI && (
                  <>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => toast.info("Voice call coming soon")}><Phone className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => toast.info("Video call coming soon")}><Video className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" className={`h-8 w-8 ${showAIPanel ? "text-primary" : ""}`} onClick={() => { setShowAIPanel(v => !v); setShowTipPanel(false); }}><Bot className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" className={`h-8 w-8 ${showTipPanel ? "text-yellow-400" : ""}`} onClick={() => { setShowTipPanel(v => !v); setShowAIPanel(false); }}><Coins className="w-4 h-4" /></Button>
                  </>
                )}
                <Button size="icon" variant="ghost" className="h-8 w-8"><MoreHorizontal className="w-4 h-4" /></Button>
              </div>
            </div>

            {showAIPanel && (
              <div className="px-4 py-3 bg-primary/5 border-b border-primary/20 flex items-start gap-3">
                <Bot className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-primary mb-1">Hope AI — Conversation Assistant</p>
                  <p className="text-xs text-muted-foreground">Analyzing tone: <span className="text-primary">friendly/strategic</span>. Suggest: <span className="text-yellow-400">offer collaboration terms</span>.</p>
                  <div className="flex gap-2 mt-2">
                    {["Draft reply", "Summarize", "Translate"].map(a => (
                      <button key={a} onClick={() => { setInput(`[AI: ${a}] `); setShowAIPanel(false); }} className="text-[10px] px-2 py-1 rounded-md bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all">{a}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {showTipPanel && (
              <div className="px-4 py-3 bg-yellow-500/5 border-b border-yellow-500/20 flex items-center gap-3">
                <Coins className="w-4 h-4 text-yellow-400 shrink-0" />
                <span className="text-xs font-semibold text-yellow-400">Send SKY444 to {thread.name}</span>
                <Input type="number" placeholder="Amount" value={tipAmount} onChange={e => setTipAmount(e.target.value)} className="h-7 w-24 text-xs bg-background/50 border-yellow-500/30" />
                <Button size="sm" className="h-7 text-xs bg-yellow-500 hover:bg-yellow-400 text-black" onClick={sendTip}>Send</Button>
                {[10, 50, 100].map(v => (
                  <button key={v} onClick={() => setTipAmount(String(v))} className="text-[10px] px-2 py-1 rounded-md bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20">{v}</button>
                ))}
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground/50 py-2">
                <Lock className="w-3 h-3" /><span>End-to-end encrypted</span><Shield className="w-3 h-3" />
              </div>
              {msgs.map(msg => (
                <div key={msg.id} className={`flex ${msg.mine ? "justify-end" : "justify-start"} gap-2`}>
                  {!msg.mine && (
                    <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5 ${thread.isAI ? "bg-gradient-to-br from-primary to-purple-600" : "bg-primary/20 text-primary"}`}>
                      {thread.isAI ? <Bot className="w-3.5 h-3.5 text-white" /> : thread.avatar}
                    </div>
                  )}
                  <div className={`max-w-[70%] flex flex-col gap-1 ${msg.mine ? "items-end" : "items-start"}`}>
                    <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${msg.type === "tip" ? "bg-yellow-500/10 border border-yellow-500/20 text-yellow-300" : msg.type === "ai" ? "bg-primary/10 border border-primary/20 text-foreground" : msg.mine ? "bg-primary text-primary-foreground" : "bg-secondary/60 text-foreground"}`}>
                      {msg.type === "ai" && <Sparkles className="w-3 h-3 text-primary inline mr-1 mb-0.5" />}
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-muted-foreground px-1">{msg.time}</span>
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            <div className="px-4 py-3 border-t border-border/30 bg-card/30 shrink-0">
              <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => toast.info("Image upload coming soon")}><Image className="w-4 h-4" /></Button>
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => toast.info("Emoji picker coming soon")}><Smile className="w-4 h-4" /></Button>
                <Input className="flex-1 h-9 text-sm bg-background/50 border-border/30 rounded-full px-4" placeholder={thread.isAI ? "Ask Hope AI anything..." : `Message ${thread.name}...`} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()} />
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => toast.info("Voice message coming soon")}><Mic className="w-4 h-4" /></Button>
                <Button size="icon" className="h-8 w-8 bg-primary hover:bg-primary/90 rounded-full" onClick={sendMessage} disabled={!input.trim()}><Send className="w-3.5 h-3.5" /></Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center space-y-3"><MessageCircle className="w-12 h-12 mx-auto opacity-20" /><p className="text-sm">Select a conversation</p></div>
          </div>
        )}
      </div>
    </div>
  );
}
