
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Gift, Rocket, Diamond, Crown, Zap, Flame, Sparkles, Gem, TrendingUp, Users, DollarSign, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

// Interfaces for data structures
interface GiftItem {
  id: string;
  emoji: string;
  name: string;
  price: number;
}

interface RecentGift {
  id: string;
  gifter: string;
  gift: GiftItem;
  timestamp: number;
  comboMultiplier?: number;
}

interface TopGifter {
  id: string;
  name: string;
  totalValue: number;
}

const giftCatalog: GiftItem[] = [
  { id: 'rose', emoji: '🌹', name: 'Rose', price: 1 },
  { id: 'rocket', emoji: '🚀', name: 'Rocket', price: 5 },
  { id: 'diamond', emoji: '💎', name: 'Diamond', price: 50 },
  { id: 'crown', emoji: '👑', name: 'Crown', price: 100 },
  { id: 'lightning', emoji: '⚡', name: 'Lightning', price: 10 },
  { id: 'fire', emoji: '🔥', name: 'Fire', price: 3 },
  { id: 'galaxy', emoji: '🌌', name: 'Sparkles', price: 500 },
  { id: 'godmode', emoji: '🌟', name: 'God Mode', price: 1000 },
];

const initialTopGifters: TopGifter[] = [
  { id: '1', name: 'CryptoKing', totalValue: 15000 },
  { id: '2', name: 'NFTQueen', totalValue: 12000 },
  { id: '3', name: 'DeFiMaster', totalValue: 8000 },
  { id: '4', name: 'BlockchainBabe', totalValue: 6000 },
  { id: '5', name: 'TokenTitan', totalValue: 4500 },
  { id: '6', name: 'MetaverseMage', totalValue: 3000 },
];

const generateRandomGift = (): RecentGift => {
  const randomGifter = [
    'Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace', 'Heidi',
  ][Math.floor(Math.random() * 8)];
  const randomGift = giftCatalog[Math.floor(Math.random() * giftCatalog.length)];
  return {
    id: Math.random().toString(36).substring(7),
    gifter: randomGifter,
    gift: randomGift,
    timestamp: Date.now(),
  };
};

const LiveGifting = () => {
  const [selectedGift, setSelectedGift] = useState<GiftItem | null>(null);
  const [userSkyBalance, setUserSkyBalance] = useState<number>(2500);
  const [recentGifts, setRecentGifts] = useState<RecentGift[]>([]);
  const [totalGiftsSent, setTotalGiftsSent] = useState<number>(0);
  const [creatorEarnings, setCreatorEarnings] = useState<number>(0);
  const [currentCombo, setCurrentCombo] = useState<number>(0);
  const [lastGifter, setLastGifter] = useState<string | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false);

  // Simulate new gifts arriving
  useEffect(() => {
    const interval = setInterval(() => {
      setRecentGifts((prevGifts) => {
        const newGift = generateRandomGift();
        return [newGift, ...prevGifts.slice(0, 9)]; // Keep last 10 gifts
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleGiftSelect = useCallback((gift: GiftItem) => {
    setSelectedGift(gift);
  }, []);

  const handleSendGift = useCallback(() => {
    if (!selectedGift) return;

    if (userSkyBalance < selectedGift.price) {
      alert('Not enough SKY to send this gift!');
      return;
    }

    setIsConfirmDialogOpen(true);
  }, [selectedGift, userSkyBalance]);

  const confirmSendGift = useCallback(() => {
    if (!selectedGift) return;

    setUserSkyBalance((prevBalance) => prevBalance - selectedGift.price);
    setTotalGiftsSent((prevCount) => prevCount + 1);
    setCreatorEarnings((prevEarnings) => prevEarnings + selectedGift.price * 0.7); // Simulate 70% earnings

    const newGift: RecentGift = {
      id: Math.random().toString(36).substring(7),
      gifter: 'You', // Assuming the current user is sending
      gift: selectedGift,
      timestamp: Date.now(),
      comboMultiplier: 1, // Reset or calculate combo here
    };

    // Combo logic
    if (lastGifter === 'You' && selectedGift.id === recentGifts[0]?.gift.id) {
      setCurrentCombo((prevCombo) => prevCombo + 1);
      newGift.comboMultiplier = currentCombo + 1;
    } else {
      setCurrentCombo(1);
      newGift.comboMultiplier = 1;
    }
    setLastGifter('You');

    setRecentGifts((prevGifts) => [newGift, ...prevGifts.slice(0, 9)]);
    setSelectedGift(null);
    setIsConfirmDialogOpen(false);
  }, [selectedGift, userSkyBalance, currentCombo, lastGifter, recentGifts]);

  const sortedTopGifters = useMemo(() => {
    return [...initialTopGifters].sort((a, b) => b.totalValue - a.totalValue);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-gray-100 p-6 font-sans">
      <h1 className="text-4xl font-bold text-[#00d4ff] mb-8 text-center">Live Gifting Panel</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gift Catalog */}
        <Card className="bg-[#111827] p-6 rounded-lg shadow-lg col-span-2">
          <h2 className="text-2xl font-semibold text-[#00ff88] mb-4 flex items-center">
            <Gift className="mr-2" /> Gift Catalog
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {giftCatalog.map((gift) => (
              <div
                key={gift.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                  ${selectedGift?.id === gift.id ? 'border-[#00d4ff] bg-cyan-900/20' : 'border-[#111827] hover:border-gray-700 bg-gray-800/30'}
                `}
                onClick={() => handleGiftSelect(gift)}
              >
                <div className="text-4xl text-center mb-2">{gift.emoji}</div>
                <div className="text-lg font-medium text-center text-gray-200">{gift.name}</div>
                <div className="text-md text-center text-[#f5a623] flex items-center justify-center">
                  {gift.price} <span className="ml-1 text-sm">SKY</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between">
            <div className="text-lg text-gray-300">
              Your Balance: <span className="font-bold text-[#f5a623]">{userSkyBalance} SKY</span>
            </div>
            <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className={`bg-[#00d4ff] hover:bg-[#00a3cc] text-[#0a0e1a] font-bold py-2 px-6 rounded-lg transition-colors duration-200
                    ${!selectedGift || userSkyBalance < (selectedGift?.price || 0) ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  onClick={handleSendGift}
                  disabled={!selectedGift || userSkyBalance < (selectedGift?.price || 0)}
                >
                  <Send className="mr-2 h-5 w-5" /> Send Gift
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#111827] text-gray-100 border-[#00d4ff]">
                <DialogHeader>
                  <DialogTitle className="text-[#00ff88]">Confirm Gift Send</DialogTitle>
                  <DialogDescription className="text-gray-300">
                    Are you sure you want to send <span className="font-bold text-[#f5a623]">{selectedGift?.name}</span> for <span className="font-bold text-[#f5a623]">{selectedGift?.price} SKY</span>?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)} className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    Cancel
                  </Button>
                  <Button onClick={confirmSendGift} className="bg-[#00d4ff] hover:bg-[#00a3cc] text-[#0a0e1a]">
                    Confirm
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          {currentCombo > 1 && (
            <div className="mt-4 text-center text-xl font-bold text-[#f5a623] animate-pulse">
              COMBO x{currentCombo}! Gift Multiplier Active!
            </div>
          )}
        </Card>

        <div className="space-y-8">
          {/* Recent Gifts Feed */}
          <Card className="bg-[#111827] p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-[#00ff88] mb-4 flex items-center">
              <TrendingUp className="mr-2" /> Recent Gifts
            </h2>
            <div className="h-64 overflow-y-auto custom-scrollbar pr-2">
              {recentGifts.length === 0 ? (
                <p className="text-gray-400">No gifts yet. Be the first to send one!</p>
              ) : (
                <ul className="space-y-3">
                  {recentGifts.map((rg) => (
                    <li key={rg.id} className="flex items-center justify-between bg-gray-800/50 p-3 rounded-md animate-fade-in">
                      <span className="text-gray-200">
                        <span className="font-bold text-[#00d4ff]">{rg.gifter}</span> sent {rg.gift.emoji} {rg.gift.name}
                      </span>
                      <Badge className="bg-[#f5a623] text-[#0a0e1a] font-bold">
                        {rg.gift.price} SKY {rg.comboMultiplier && rg.comboMultiplier > 1 && `x${rg.comboMultiplier}`}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>

          {/* Top Gifters Leaderboard */}
          <Card className="bg-[#111827] p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-[#00ff88] mb-4 flex items-center">
              <Users className="mr-2" /> Top Gifters
            </h2>
            <div className="h-64 overflow-y-auto custom-scrollbar pr-2">
              <ul className="space-y-3">
                {sortedTopGifters.map((gifter, index) => (
                  <li key={gifter.id} className="flex items-center justify-between bg-gray-800/50 p-3 rounded-md">
                    <span className="text-gray-200">
                      <Badge className={`mr-2 ${index === 0 ? 'bg-[#f5a623]' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-700' : 'bg-gray-600'} text-[#0a0e1a] font-bold`}>
                        #{index + 1}
                      </Badge>
                      <span className="font-bold text-[#00d4ff]">{gifter.name}</span>
                    </span>
                    <Badge className="bg-[#00ff88] text-[#0a0e1a] font-bold">
                      {gifter.totalValue} SKY
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>
      </div>

      {/* Stats and Earnings */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-[#111827] p-6 rounded-lg shadow-lg flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#00ff88] flex items-center">
            <Gift className="mr-2" /> Total Gifts Sent
          </h2>
          <span className="text-4xl font-bold text-[#f5a623]">{totalGiftsSent}</span>
        </Card>
        <Card className="bg-[#111827] p-6 rounded-lg shadow-lg flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#00ff88] flex items-center">
            <DollarSign className="mr-2" /> Creator Earnings
          </h2>
          <span className="text-4xl font-bold text-[#00ff88]">{creatorEarnings.toFixed(2)} SKY</span>
        </Card>
      </div>

      {/* Custom Scrollbar Styling */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0a0e1a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #00d4ff;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #00a3cc;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LiveGifting;
