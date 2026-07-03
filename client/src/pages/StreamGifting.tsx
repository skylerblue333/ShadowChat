import { useState, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Gift, Zap, Star, Heart, Crown, Flame, Diamond, Rocket, Send, TrendingUp } from "lucide-react";
import { Link } from "wouter";

interface GiftAnimation {
  id: string;
  emoji: string;
  name: string;
  sender: string;
  amount: number;
  x: number;
  y: number;
  color: string;
}

const GIFTS = [
  { id: "rose", name: "Rose", emoji: "🌹", cost: 1, color: "#ef4444", icon: Heart },
  { id: "star", name: "Star", emoji: "⭐", cost: 5, color: "#eab308", icon: Star },
  { id: "fire", name: "Fire", emoji: "🔥", cost: 10, color: "#f97316", icon: Flame },
  { id: "rocket", name: "Rocket", emoji: "🚀", cost: 25, color: "#8b5cf6", icon: Rocket },
  { id: "crown", name: "Crown", emoji: "👑", cost: 50, color: "#f59e0b", icon: Crown },
  { id: "diamond", name: "Diamond", emoji: "💎", cost: 100, color: "#06b6d4", icon: Diamond },
  { id: "lightning", name: "Lightning", emoji: "⚡", cost: 250, color: "#a855f7", icon: Zap },
  { id: "galaxy", name: "Galaxy", emoji: "🌌", cost: 1000, color: "#ec4899", icon: Star },
];

const MOCK_RECENT_GIFTS = [
  { sender: "CryptoKing", gift: "Galaxy", emoji: "🌌", amount: 1000, time: "2s ago" },
  { sender: "SkyWhale", gift: "Lightning", emoji: "⚡", amount: 250, time: "15s ago" },
  { sender: "NeonByte", gift: "Diamond", emoji: "💎", amount: 100, time: "32s ago" },
  { sender: "QuantumX", gift: "Crown", emoji: "👑", amount: 50, time: "1m ago" },
  { sender: "VoidHunter", gift: "Rocket", emoji: "🚀", amount: 25, time: "2m ago" },
];

const TOP_GIFTERS = [
  { name: "CryptoKing", total: 12400, emoji: "👑" },
  { name: "SkyWhale", total: 8900, emoji: "🐋" },
  { name: "NeonByte", total: 6200, emoji: "⚡" },
  { name: "QuantumX", total: 4100, emoji: "🔮" },
  { name: "VoidHunter", total: 2800, emoji: "🎯" },
];

export default function StreamGifting() {
  
  const [animations, setAnimations] = useState<GiftAnimation[]>([]);
  const [selectedGift, setSelectedGift] = useState(GIFTS[0]);
  const [quantity, setQuantity] = useState(1);
  const [streamId, setStreamId] = useState<string | null>(null);
  const [balance, setBalance] = useState(2500);

  // Gift sending handled locally with balance deduction

  const triggerAnimation = useCallback((gift: typeof GIFTS[0], sender: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    const anim: GiftAnimation = {
      id,
      emoji: gift.emoji,
      name: gift.name,
      sender,
      amount: gift.cost * quantity,
      x: 10 + Math.random() * 80,
      y: 20 + Math.random() * 60,
      color: gift.color,
    };
    setAnimations(prev => [...prev, anim]);
    setTimeout(() => {
      setAnimations(prev => prev.filter(a => a.id !== id));
    }, 3000);
  }, [quantity]);

  const handleSendGift = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to send gifts");
      return;
    }
    const total = selectedGift.cost * quantity;
    if (balance < total) {
      toast.error("Insufficient SKY444 balance");
      return;
    }
    setBalance(prev => prev - total);
    triggerAnimation(selectedGift, user?.name || "You");
    toast.success(`Sent ${quantity}x ${selectedGift.emoji} ${selectedGift.name} for ${total} SKY444!`);
  };

  // Simulate incoming gifts
  useEffect(() => {
    const interval = setInterval(() => {
      const randomGift = GIFTS[Math.floor(Math.random() * GIFTS.length)];
      const randomSender = ["CryptoKing", "SkyWhale", "NeonByte", "QuantumX", "VoidHunter"][Math.floor(Math.random() * 5)];
      triggerAnimation(randomGift, randomSender);
    }, 4000);
    return () => clearInterval(interval);
  }, [triggerAnimation]);

  return (
    <div className="min-h-screen bg-[#07050f] text-white">
      <div className="max-w-6xl mx-auto p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/20 flex items-center justify-center">
              <Gift className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white">Live Gifting</h1>
              <p className="text-slate-500 text-xs">Send animated gifts to your favorite streamers</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-[#0e0a1a] border border-white/10 rounded-xl px-3 py-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 font-bold text-sm">{balance.toLocaleString()} SKY444</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {/* Stream preview with gift animations */}
          <div className="lg:col-span-2">
            <div className="relative bg-[#0e0a1a] border border-white/5 rounded-2xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
              {/* Mock stream */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-black flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mx-auto mb-3">
                    <span className="text-3xl">🎮</span>
                  </div>
                  <p className="text-white font-bold">Live Stream</p>
                  <div className="flex items-center gap-2 justify-center mt-1">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-red-400 text-xs font-bold">LIVE</span>
                    <span className="text-slate-500 text-xs">· 2,847 viewers</span>
                  </div>
                </div>
              </div>

              {/* Gift animations */}
              {animations.map(anim => (
                <div key={anim.id}
                  className="absolute pointer-events-none animate-bounce"
                  style={{ left: `${anim.x}%`, top: `${anim.y}%`, zIndex: 10 }}>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-3xl drop-shadow-lg" style={{ filter: `drop-shadow(0 0 8px ${anim.color})` }}>
                      {anim.emoji}
                    </span>
                    <div className="bg-black/70 backdrop-blur-sm rounded-full px-2 py-0.5 text-[10px] text-white whitespace-nowrap">
                      <span style={{ color: anim.color }}>{anim.sender}</span> sent {anim.name}
                    </div>
                  </div>
                </div>
              ))}

              {/* Live gift ticker at bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <div className="flex gap-2 overflow-hidden">
                  {MOCK_RECENT_GIFTS.slice(0, 3).map((g, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 text-[10px] whitespace-nowrap">
                      <span>{g.emoji}</span>
                      <span className="text-yellow-400 font-bold">{g.sender}</span>
                      <span className="text-slate-400">sent {g.gift}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Gift selector */}
            <div className="mt-4 bg-[#0e0a1a] border border-white/5 rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Choose a Gift</h3>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mb-4">
                {GIFTS.map(gift => (
                  <button key={gift.id}
                    onClick={() => setSelectedGift(gift)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${selectedGift.id === gift.id ? "border-purple-500/50 bg-purple-500/10" : "border-white/5 hover:border-white/20 bg-white/3"}`}>
                    <span className="text-2xl">{gift.emoji}</span>
                    <span className="text-[9px] text-slate-400">{gift.name}</span>
                    <span className="text-[9px] font-bold" style={{ color: gift.color }}>{gift.cost} SKY</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-slate-400 hover:text-white w-5 h-5 flex items-center justify-center">−</button>
                  <span className="text-white font-bold w-8 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(100, q + 1))} className="text-slate-400 hover:text-white w-5 h-5 flex items-center justify-center">+</button>
                </div>
                <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-400">
                  Total: <span className="text-yellow-400 font-bold">{selectedGift.cost * quantity} SKY444</span>
                </div>
                <Button onClick={handleSendGift} className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0 gap-2">
                  <Send className="w-4 h-4" />
                  Send {selectedGift.emoji}
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Top gifters */}
            <div className="bg-[#0e0a1a] border border-white/5 rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Crown className="w-4 h-4 text-yellow-400" />Top Gifters
              </h3>
              <div className="space-y-2">
                {TOP_GIFTERS.map((gifter, i) => (
                  <div key={gifter.name} className="flex items-center gap-2">
                    <span className="text-xs text-slate-600 w-4">#{i + 1}</span>
                    <span className="text-base">{gifter.emoji}</span>
                    <span className="text-white text-xs flex-1">{gifter.name}</span>
                    <span className="text-yellow-400 text-xs font-bold">{gifter.total.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent gifts */}
            <div className="bg-[#0e0a1a] border border-white/5 rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-pink-400" />Recent Gifts
              </h3>
              <div className="space-y-2">
                {MOCK_RECENT_GIFTS.map((g, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className="text-base">{g.emoji}</span>
                    <div className="flex-1">
                      <span className="text-purple-400 font-medium">{g.sender}</span>
                      <span className="text-slate-500"> sent {g.gift}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-yellow-400 font-bold">{g.amount} SKY</p>
                      <p className="text-slate-600 text-[10px]">{g.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick amounts */}
            <div className="bg-[#0e0a1a] border border-white/5 rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Quick Top-Up</h3>
              <div className="grid grid-cols-2 gap-2">
                {[100, 500, 1000, 5000].map(amt => (
                  <Button key={amt} size="sm" variant="outline" className="border-white/10 text-slate-400 hover:text-white text-xs h-8"
                    onClick={() => { setBalance(b => b + amt); toast.success(`+${amt} SKY444 added!`); }}>
                    +{amt} SKY
                  </Button>
                ))}
              </div>
            </div>

            <Link href="/streaming">
              <Button className="w-full bg-red-500/20 text-red-300 border border-red-500/30 gap-2">
                <Flame className="w-4 h-4" />Go to Live Streams
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
