/**
 * MatchChat — Dating System Chat
 * AI icebreakers, safety filters, conversation scoring, engagement tracking
 */
import { useState, useRef, useEffect } from "react";
import { Send, Brain, Shield, Heart, Star, ArrowLeft, MoreVertical, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { toast } from "sonner";

const ICEBREAKERS = [
  "What's the most interesting thing you've learned this week?",
  "If you could live anywhere in the world for a year, where would it be?",
  "What's your favorite way to spend a Sunday morning?",
  "What's a skill you've been wanting to learn?",
  "What's the best meal you've ever had?",
];

const MOCK_MESSAGES = [
  { id: 1, sender: "them", text: "Hey! I saw we matched 💜 Your profile is really interesting!", time: "2:30 PM" },
  { id: 2, sender: "me", text: "Thanks! I loved your bio about the DeFi work. What protocol are you most excited about right now?", time: "2:32 PM" },
  { id: 3, sender: "them", text: "Honestly Uniswap V4 has been blowing my mind. The hook architecture is so elegant. Are you into DeFi too?", time: "2:35 PM" },
];

export default function MatchChat() {
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [input, setInput] = useState("");
  const [showIcebreakers, setShowIcebreakers] = useState(false);
  const [conversationScore, setConversationScore] = useState(72);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const newMsg = { id: Date.now(), sender: "me" as const, text: text.trim(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setMessages(prev => [...prev, newMsg]);
    setInput("");
    setConversationScore(prev => Math.min(100, prev + 3));

    // Simulate reply
    setTimeout(() => {
      const replies = [
        "That's really interesting! Tell me more...",
        "I totally agree with that perspective.",
        "Wow, I hadn't thought about it that way!",
        "You seem really knowledgeable about this 😊",
      ];
      const reply = { id: Date.now() + 1, sender: "them" as const, text: replies[Math.floor(Math.random() * replies.length)], time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
      setMessages(prev => [...prev, reply]);
    }, 1500);
  };

  return (
    <div className="h-screen bg-background flex flex-col max-w-lg mx-auto">
      {/* Header */}
      <div className="p-3 border-b flex items-center gap-3 shrink-0">
        <Link href="/dating/matches">
          <Button variant="ghost" size="sm" className="p-1">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-sm font-bold text-white">
            A
          </div>
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-background" />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm">Alex Rivera</div>
          <div className="text-xs text-green-400">Online · 94% match</div>
        </div>
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-xs">
            <Heart className="w-2.5 h-2.5 text-pink-400" />
            <span className="text-muted-foreground">{conversationScore}%</span>
          </div>
          <Button variant="ghost" size="sm" className="p-1" onClick={() => toast("Match options coming soon")}>
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Safety notice */}
      <div className="px-3 py-2 bg-blue-500/10 border-b border-blue-500/20 flex items-center gap-2 text-xs text-blue-400 shrink-0">
        <Shield className="w-3.5 h-3.5 shrink-0" />
        <span>Safety filters active · Report or block from menu</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Match notification */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-xs text-pink-400">
            <Heart className="w-3 h-3" />
            You matched with Alex Rivera!
            <Star className="w-3 h-3" />
          </div>
        </div>

        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] ${msg.sender === "me" ? "items-end" : "items-start"} flex flex-col gap-0.5`}>
              <div className={`px-3 py-2 rounded-2xl text-sm ${msg.sender === "me" ? "bg-gradient-to-br from-pink-500 to-purple-500 text-white rounded-br-sm" : "bg-secondary text-foreground rounded-bl-sm"}`}>
                {msg.text}
              </div>
              <span className="text-xs text-muted-foreground px-1">{msg.time}</span>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Icebreakers */}
      {showIcebreakers && (
        <div className="px-3 py-2 border-t bg-secondary/30 shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-xs font-medium text-purple-400">AI Icebreakers</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {ICEBREAKERS.map((ib, idx) => (
              <button
                key={idx}
                onClick={() => { sendMessage(ib); setShowIcebreakers(false); }}
                className="shrink-0 px-2.5 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 hover:bg-purple-500/20 transition-colors text-left max-w-[200px]"
              >
                {ib}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t flex gap-2 shrink-0">
        <Button
          variant="outline"
          size="sm"
          className={`shrink-0 ${showIcebreakers ? "border-purple-500 text-purple-400" : ""}`}
          onClick={() => setShowIcebreakers(!showIcebreakers)}
        >
          <Brain className="w-4 h-4" />
        </Button>
        <Input
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage(input)}
          className="flex-1"
        />
        <Button
          size="sm"
          className="shrink-0 bg-gradient-to-br from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400"
          onClick={() => sendMessage(input)}
          disabled={!input.trim()}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
