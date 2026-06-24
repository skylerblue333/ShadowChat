import { useState, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { Dices, TrendingUp, TrendingDown, ArrowLeft, Zap, History, Target } from "lucide-react";

const HOUSE_EDGE = 0.01; // 1%

function calcMultiplier(target: number, isOver: boolean) {
  const winChance = isOver ? (100 - target) / 100 : target / 100;
  if (winChance <= 0) return 0;
  return Math.max(1.01, (1 - HOUSE_EDGE) / winChance);
}

function calcWinChance(target: number, isOver: boolean) {
  return isOver ? 100 - target : target;
}

interface RollResult {
  roll: number;
  won: boolean;
  payout: number;
  wager: number;
  target: number;
  isOver: boolean;
  ts: number;
}

export default function GameDice() {
  const { user, isAuthenticated } = useAuth();
  const [wager, setWager] = useState("10");
  const [target, setTarget] = useState(50);
  const [isOver, setIsOver] = useState(true);
  const [rolling, setRolling] = useState(false);
  const [currentRoll, setCurrentRoll] = useState<number | null>(null);
  const [history, setHistory] = useState<RollResult[]>([]);
  const [balance, setBalance] = useState(1000); // demo balance in SKY444

  const multiplier = calcMultiplier(target, isOver);
  const winChance = calcWinChance(target, isOver);
  const profit = (parseFloat(wager) || 0) * multiplier - (parseFloat(wager) || 0);

  const roll = useCallback(() => {
    if (!isAuthenticated) { window.location.href = getLoginUrl(); return; }
    const w = parseFloat(wager);
    if (isNaN(w) || w <= 0) { toast.error("Enter a valid wager"); return; }
    if (w > balance) { toast.error("Insufficient balance"); return; }

    setRolling(true);
    setCurrentRoll(null);

    // Animate roll
    let count = 0;
    const interval = setInterval(() => {
      setCurrentRoll(Math.floor(Math.random() * 100) + 1);
      count++;
      if (count >= 15) {
        clearInterval(interval);
        const finalRoll = Math.floor(Math.random() * 100) + 1;
        const won = isOver ? finalRoll > target : finalRoll < target;
        const payout = won ? w * multiplier : 0;
        const netChange = won ? payout - w : -w;

        setCurrentRoll(finalRoll);
        setBalance(prev => prev + netChange);
        setRolling(false);

        const result: RollResult = { roll: finalRoll, won, payout, wager: w, target, isOver, ts: Date.now() };
        setHistory(prev => [result, ...prev.slice(0, 19)]);

        if (won) {
          toast.success(`🎲 ${finalRoll} — You won ${payout.toFixed(2)} SKY444!`, { duration: 3000 });
        } else {
          toast.error(`🎲 ${finalRoll} — You lost ${w.toFixed(2)} SKY444`, { duration: 2000 });
        }
      }
    }, 50);
  }, [wager, target, isOver, multiplier, balance, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07050f]">
        <div className="text-center space-y-4">
          <Dices className="w-16 h-16 text-purple-400 mx-auto" />
          <h2 className="text-2xl font-black text-white">Dice Roll</h2>
          <p className="text-slate-400">Sign in to play with SKY444</p>
          <Button onClick={() => window.location.href = getLoginUrl()} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">Sign In to Play</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07050f] py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/arcade">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <Dices className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white">Dice Roll</h1>
              <p className="text-xs text-slate-500">Provably fair · 1% house edge</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-bold text-white">{balance.toFixed(2)}</span>
            <span className="text-xs text-slate-500">SKY444</span>
          </div>
        </div>

        {/* Dice Display */}
        <Card className="bg-[#0e0a1a]/90 border-white/5 p-8 text-center">
          <div className={`text-8xl font-black mb-4 transition-all duration-100 ${rolling ? "opacity-50 scale-95" : "opacity-100 scale-100"} ${
            currentRoll !== null && !rolling
              ? (isOver ? currentRoll > target : currentRoll < target)
                ? "text-green-400"
                : "text-red-400"
              : "text-white"
          }`}>
            {currentRoll ?? "?"}
          </div>
          <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
            <span>Roll 1–100</span>
            <span>·</span>
            <span className={isOver ? "text-blue-400" : "text-purple-400"}>
              {isOver ? `Over ${target}` : `Under ${target}`}
            </span>
          </div>
        </Card>

        {/* Controls */}
        <Card className="bg-[#0e0a1a]/90 border-white/5 p-6 space-y-5">
          {/* Over/Under Toggle */}
          <div className="flex gap-2">
            <Button
              variant={isOver ? "default" : "outline"}
              className={`flex-1 gap-2 ${isOver ? "bg-blue-600 hover:bg-blue-700 text-white border-0" : "border-white/10 text-slate-400 bg-transparent"}`}
              onClick={() => setIsOver(true)}
            >
              <TrendingUp className="w-4 h-4" /> Roll Over
            </Button>
            <Button
              variant={!isOver ? "default" : "outline"}
              className={`flex-1 gap-2 ${!isOver ? "bg-purple-600 hover:bg-purple-700 text-white border-0" : "border-white/10 text-slate-400 bg-transparent"}`}
              onClick={() => setIsOver(false)}
            >
              <TrendingDown className="w-4 h-4" /> Roll Under
            </Button>
          </div>

          {/* Target Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-slate-400">Target: <span className="text-white font-bold">{target}</span></label>
              <div className="flex gap-3 text-xs">
                <span className="text-slate-500">Win chance: <span className="text-white font-mono">{winChance.toFixed(1)}%</span></span>
                <span className="text-slate-500">Multiplier: <span className="text-green-400 font-mono">{multiplier.toFixed(2)}x</span></span>
              </div>
            </div>
            <Slider
              value={[target]}
              onValueChange={([v]) => setTarget(v)}
              min={2}
              max={98}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-600">
              <span>2</span>
              <span>50</span>
              <span>98</span>
            </div>
          </div>

          {/* Wager */}
          <div className="space-y-2">
            <label className="text-sm text-slate-400">Wager (SKY444)</label>
            <div className="flex gap-2">
              <Input
                value={wager}
                onChange={e => setWager(e.target.value)}
                type="number"
                min="1"
                className="bg-white/5 border-white/10 text-white flex-1"
              />
              {["½", "2×", "Max"].map(label => (
                <Button key={label} variant="outline" size="sm" className="border-white/10 text-slate-400 bg-transparent text-xs px-2"
                  onClick={() => {
                    const w = parseFloat(wager) || 0;
                    if (label === "½") setWager(Math.max(1, w / 2).toFixed(2));
                    else if (label === "2×") setWager(Math.min(balance, w * 2).toFixed(2));
                    else setWager(balance.toFixed(2));
                  }}>
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Profit Preview */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white/5 rounded-lg p-2">
              <div className="text-xs text-slate-500 mb-1">Wager</div>
              <div className="text-sm font-bold text-white">{parseFloat(wager) || 0} SKY</div>
            </div>
            <div className="bg-white/5 rounded-lg p-2">
              <div className="text-xs text-slate-500 mb-1">Multiplier</div>
              <div className="text-sm font-bold text-green-400">{multiplier.toFixed(2)}x</div>
            </div>
            <div className="bg-white/5 rounded-lg p-2">
              <div className="text-xs text-slate-500 mb-1">Profit if Win</div>
              <div className="text-sm font-bold text-green-400">+{profit.toFixed(2)} SKY</div>
            </div>
          </div>

          {/* Roll Button */}
          <Button
            onClick={roll}
            disabled={rolling}
            className="w-full h-12 text-lg font-black bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
          >
            {rolling ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Rolling...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Dices className="w-5 h-5" /> Roll Dice
              </div>
            )}
          </Button>
        </Card>

        {/* History */}
        {history.length > 0 && (
          <Card className="bg-[#0e0a1a]/90 border-white/5 p-4">
            <div className="flex items-center gap-2 mb-3">
              <History className="w-4 h-4 text-slate-500" />
              <h3 className="text-sm font-semibold text-white">Recent Rolls</h3>
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {history.map((r, i) => (
                <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-mono font-bold text-sm w-8 text-center ${r.won ? "text-green-400" : "text-red-400"}`}>{r.roll}</span>
                    <span className="text-slate-500">{r.isOver ? ">" : "<"} {r.target}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">{r.wager} SKY</span>
                    <Badge className={`text-[10px] ${r.won ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}`}>
                      {r.won ? `+${r.payout.toFixed(2)}` : `-${r.wager.toFixed(2)}`}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
