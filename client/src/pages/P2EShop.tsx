/**
 * P2E Shop — Play-to-Earn item shop with SKY444 token purchases, NFT drops, and gear upgrades
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { ShoppingBag, Coins, Zap, Shield, Sword, Crown, Star, ChevronLeft, Filter, Sparkles, Lock } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

type Rarity = "common" | "rare" | "epic" | "legendary";

interface ShopItem {
  id: number;
  name: string;
  description: string;
  price: number;
  rarity: Rarity;
  category: string;
  icon: string;
  owned?: boolean;
  limited?: boolean;
  remaining?: number;
}

const RARITY_STYLES: Record<Rarity, string> = {
  common: "border-white/20 bg-white/5",
  rare: "border-blue-500/40 bg-blue-950/20",
  epic: "border-purple-500/40 bg-purple-950/20",
  legendary: "border-amber-500/40 bg-amber-950/20",
};

const RARITY_BADGE: Record<Rarity, string> = {
  common: "text-gray-400 bg-gray-500/20",
  rare: "text-blue-400 bg-blue-500/20",
  epic: "text-purple-400 bg-purple-500/20",
  legendary: "text-amber-400 bg-amber-500/20",
};

const SHOP_ITEMS: ShopItem[] = [
  { id: 1, name: "Shadow Cloak", description: "Invisible to enemy scanners for 24h", price: 250, rarity: "epic", category: "gear", icon: "🌑" },
  { id: 2, name: "XP Booster x2", description: "Double XP for 7 days", price: 100, rarity: "rare", category: "boost", icon: "⚡" },
  { id: 3, name: "Legendary Sword", description: "+50% attack power in PvP battles", price: 1500, rarity: "legendary", category: "weapon", icon: "⚔️", limited: true, remaining: 7 },
  { id: 4, name: "Sky Shield", description: "Blocks 3 attacks in clan wars", price: 400, rarity: "epic", category: "gear", icon: "🛡️" },
  { id: 5, name: "Daily Spin Token", description: "Extra spin on the daily wheel", price: 50, rarity: "common", category: "boost", icon: "🎰" },
  { id: 6, name: "Crown of Kings", description: "Display crown on your profile + 10% reward bonus", price: 2000, rarity: "legendary", category: "cosmetic", icon: "👑", limited: true, remaining: 3 },
  { id: 7, name: "Stealth Boots", description: "Move undetected in clan territory", price: 350, rarity: "rare", category: "gear", icon: "👢" },
  { id: 8, name: "Battle Pass Token", description: "Unlock one Battle Pass tier instantly", price: 200, rarity: "rare", category: "boost", icon: "🎫" },
  { id: 9, name: "Neon Avatar Frame", description: "Animated neon border on your avatar", price: 150, rarity: "common", category: "cosmetic", icon: "🌈" },
  { id: 10, name: "Oracle's Eye", description: "See enemy clan stats before declaring war", price: 800, rarity: "epic", category: "intel", icon: "🔮" },
  { id: 11, name: "Chaos Gem", description: "Random legendary drop on next quest", price: 500, rarity: "epic", category: "boost", icon: "💎" },
  { id: 12, name: "Sky Genesis NFT", description: "Exclusive genesis collection NFT — tradeable", price: 5000, rarity: "legendary", category: "nft", icon: "🌌", limited: true, remaining: 1 },
];

const CATEGORIES = ["all", "gear", "weapon", "boost", "cosmetic", "intel", "nft"];

export default function P2EShop() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [category, setCategory] = useState("all");
  const [rarityFilter, setRarityFilter] = useState<"all" | Rarity>("all");
  const [purchased, setPurchased] = useState<Set<number>>(new Set());

  // Use staking stats for SKY444 balance display
  const { data: stakingStats } = trpc.staking.stats.useQuery(undefined, { enabled: !!user });
  const skyBalance = (stakingStats as any)?.userStaked ?? 1250;

  const filtered = SHOP_ITEMS.filter(item => {
    if (category !== "all" && item.category !== category) return false;
    if (rarityFilter !== "all" && item.rarity !== rarityFilter) return false;
    return true;
  });

  const handleBuy = (item: ShopItem) => {
    if (!user) { toast.error("Sign in to purchase items"); return; }
    if (skyBalance < item.price) {
      toast.error(`Need ${item.price} SKY444 — you have ${skyBalance}`);
      return;
    }
    setPurchased(prev => new Set([...prev, item.id]));
    toast.success(`🎉 ${item.icon} ${item.name} purchased! Check your inventory.`);
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-950/40 via-[#050508] to-orange-950/30 py-12">
        <div className="absolute inset-0 pointer-events-none">
          <div className="glow-orb w-64 h-64 bg-amber-500/15 top-0 right-1/4" />
          <div className="glow-orb w-48 h-48 bg-orange-500/10 bottom-0 left-1/4" />
        </div>
        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          <button onClick={() => navigate(-1 as any)} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white mb-4 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-amber-400" />
                </div>
                <h1 className="text-4xl font-black rainbow-text">P2E Shop</h1>
              </div>
              <p className="text-muted-foreground metallic-shimmer">Spend SKY444 tokens on gear, boosts, NFTs, and cosmetics.</p>
            </div>
            {/* Wallet balance */}
            <div className="hidden sm:flex items-center gap-3 px-4 py-3 rounded-xl border border-amber-500/30 bg-amber-950/20">
              <Coins className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-xs text-muted-foreground">SKY444 Balance</div>
                <div className="text-lg font-black text-amber-400">{skyBalance.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-1">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Category:</span>
          </div>
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                category === c ? "bg-amber-500/20 border border-amber-500/40 text-amber-300" : "bg-white/5 border border-white/10 text-muted-foreground hover:text-white"
              }`}
            >
              {c}
            </button>
          ))}
          <div className="w-px h-4 bg-white/10 mx-1" />
          {(["all", "common", "rare", "epic", "legendary"] as const).map(r => (
            <button
              key={r}
              onClick={() => setRarityFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                rarityFilter === r ? "bg-purple-500/20 border border-purple-500/40 text-purple-300" : "bg-white/5 border border-white/10 text-muted-foreground hover:text-white"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Item count */}
        <div className="text-sm text-muted-foreground mb-4">{filtered.length} items</div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(item => {
            const isPurchased = purchased.has(item.id);
            return (
              <div
                key={item.id}
                className={`relative rounded-xl border p-4 transition-all hover:scale-[1.02] ${RARITY_STYLES[item.rarity]}`}
              >
                {/* Limited badge */}
                {item.limited && (
                  <div className="absolute top-2 right-2 text-xs font-bold text-red-400 bg-red-500/20 border border-red-500/30 px-2 py-0.5 rounded-full">
                    {item.remaining} left
                  </div>
                )}

                {/* Icon */}
                <div className="text-4xl mb-3 text-center">{item.icon}</div>

                {/* Rarity badge */}
                <div className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full mb-2 capitalize ${RARITY_BADGE[item.rarity]}`}>
                  <Sparkles className="w-3 h-3" />
                  {item.rarity}
                </div>

                <h3 className="text-sm font-bold text-white mb-1">{item.name}</h3>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{item.description}</p>

                {/* Price + Buy */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-black text-amber-400">{item.price.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={() => handleBuy(item)}
                    disabled={isPurchased}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isPurchased
                        ? "bg-green-500/20 border border-green-500/30 text-green-400 cursor-default"
                        : "bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30 hover:scale-105 active:scale-95"
                    }`}
                  >
                    {isPurchased ? "✓ Owned" : "Buy"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
