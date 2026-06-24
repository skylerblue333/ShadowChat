import { useState, useCallback } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { ArrowLeft, Zap, History, CircleDot } from "lucide-react";

const RED_NUMBERS = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
const BLACK_NUMBERS = [2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35];

function getColor(n: number) {
  if (n === 0) return "green";
  if (RED_NUMBERS.includes(n)) return "red";
  return "black";
}

type BetType = "red" | "black" | "even" | "odd" | "1-18" | "19-36" | "1st12" | "2nd12" | "3rd12" | "straight";

interface Bet {
  type: BetType;
  number?: number;
  amount: number;
}

interface SpinResult {
  number: number;
  color: string;
  bets: Bet[];
  payout: number;
  ts: number;
}

function calcPayout(bet: Bet, result: number): number {
  const color = getColor(result);
  switch (bet.type) {
    case "red": return color === "red" ? bet.amount * 2 : 0;
    case "black": return color === "black" ? bet.amount * 2 : 0;
    case "even": return result !== 0 && result % 2 === 0 ? bet.amount * 2 : 0;
    case "odd": return result !== 0 && result % 2 !== 0 ? bet.amount * 2 : 0;
    case "1-18": return result >= 1 && result <= 18 ? bet.amount * 2 : 0;
    case "19-36": return result >= 19 && result <= 36 ? bet.amount * 2 : 0;
    case "1st12": return result >= 1 && result <= 12 ? bet.amount * 3 : 0;
    case "2nd12": return result >= 13 && result <= 24 ? bet.amount * 3 : 0;
    case "3rd12": return result >= 25 && result <= 36 ? bet.amount * 3 : 0;
    case "straight": return bet.number === result ? bet.amount * 36 : 0;
    default: return 0;
  }
}

export default function GameRoulette() {
  const { isAuthenticated } = useAuth();
  const [balance, setBalance] = useState(1000);
  const [wager, setWager] = useState("10");
  const [bets, setBets] = useState<Bet[]>([]);
  const [spinning, setSpinning] = useState(false);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [history, setHistory] = useState<SpinResult[]>([]);

  const totalBet = bets.reduce((s, b) => s + b.amount, 0);

  const placeBet = (type: BetType, number?: number) => {
    if (!isAuthenticated) { window.location.href = getLoginUrl(); return; }
    const amount = parseFloat(wager);
    if (isNaN(amount) || amount <= 0) { toast.error("Enter a valid wager"); return; }
    if (totalBet + amount > balance) { toast.error("Insufficient balance"); return; }
    setBets(prev => {
      const existing = prev.find(b => b.type === type && b.number === number);
      if (existing) return prev.map(b => b.type === type && b.number === number ? { ...b, amount: b.amount + amount } : b);
      return [...prev, { type, number, amount }];
    });
    toast.success(`Bet placed: ${type}${number !== undefined ? ` #${number}` : ""} — ${amount} SKY`);
  };

  const clearBets = () => setBets([]);

  const spin = useCallback(() => {
    if (!isAuthenticated) { window.location.href = getLoginUrl(); return; }
    if (bets.length === 0) { toast.error("Place at least one bet first"); return; }
    if (totalBet > balance) { toast.error("Insufficient balance"); return; }

    setBalance(prev => prev - totalBet);
    setSpinning(true);
    setCurrentNumber(null);

    let count = 0;
    const interval = setInterval(() => {
      setCurrentNumber(Math.floor(Math.random() * 37));
      count++;
      if (count >= 20) {
        clearInterval(interval);
        const result = Math.floor(Math.random() * 37);
        setCurrentNumber(result);
        setSpinning(false);

        const totalPayout = bets.reduce((sum, bet) => sum + calcPayout(bet, result), 0);
        setBalance(prev => prev + totalPayout);

        const net = totalPayout - totalBet;
        if (totalPayout > 0) {
          toast.success(`🎰 ${result} ${getColor(result).toUpperCase()} — Won ${totalPayout.toFixed(2)} SKY444!`, { duration: 3000 });
        } else {
          toast.error(`🎰 ${result} ${getColor(result).toUpperCase()} — Lost ${totalBet.toFixed(2)} SKY444`, { duration: 2000 });
        }

        setHistory(prev => [{ number: result, color: getColor(result), bets: [...bets], payout: totalPayout, ts: Date.now() }, ...prev.slice(0, 14)]);
        setBets([]);
      }
    }, 80);
  }, [bets, totalBet, balance, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07050f]">
        <div className="text-center space-y-4">
          <CircleDot className="w-16 h-16 text-red-400 mx-auto" />
          <h2 className="text-2xl font-black text-white">Roulette</h2>
          <p className="text-slate-400">Sign in to play with SKY444</p>
          <Button onClick={() => window.location.href = getLoginUrl()} className="bg-gradient-to-r from-red-600 to-orange-600 text-white border-0">Sign In to Play</Button>
        </div>
      </div>
    );
  }

  const colorClass = currentNumber === null ? "text-white" : getColor(currentNumber) === "red" ? "text-red-400" : getColor(currentNumber) === "black" ? "text-slate-300" : "text-green-400";

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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center">
              <CircleDot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white">Roulette</h1>
              <p className="text-xs text-slate-500">European · 2.7% house edge</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-bold text-white">{balance.toFixed(2)}</span>
            <span className="text-xs text-slate-500">SKY444</span>
          </div>
        </div>

        {/* Wheel Display */}
        <Card className="bg-[#0e0a1a]/90 border-white/5 p-8 text-center">
          <div className={`text-8xl font-black mb-3 transition-all duration-100 ${spinning ? "opacity-50 scale-95" : "opacity-100 scale-100"} ${colorClass}`}>
            {currentNumber ?? "?"}
          </div>
          {currentNumber !== null && !spinning && (
            <Badge className={`text-sm px-4 py-1 ${getColor(currentNumber) === "red" ? "bg-red-500/20 text-red-400 border-red-500/30" : getColor(currentNumber) === "black" ? "bg-slate-500/20 text-slate-300 border-slate-500/30" : "bg-green-500/20 text-green-400 border-green-500/30"}`}>
              {getColor(currentNumber).toUpperCase()}
            </Badge>
          )}
          {/* Recent history dots */}
          {history.length > 0 && (
            <div className="flex items-center justify-center gap-1 mt-4 flex-wrap">
              {history.slice(0, 12).map((h, i) => (
                <div key={i} className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white ${h.color === "red" ? "bg-red-600" : h.color === "black" ? "bg-slate-700" : "bg-green-600"}`}>
                  {h.number}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Wager Input */}
        <Card className="bg-[#0e0a1a]/90 border-white/5 p-4 space-y-3">
          <div className="flex gap-2 items-center">
            <label className="text-sm text-slate-400 whitespace-nowrap">Bet Amount:</label>
            <Input value={wager} onChange={e => setWager(e.target.value)} type="number" min="1" className="bg-white/5 border-white/10 text-white flex-1" />
            {["5","10","25","50","100"].map(v => (
              <Button key={v} variant="outline" size="sm" className="border-white/10 text-slate-400 bg-transparent text-xs px-2" onClick={() => setWager(v)}>{v}</Button>
            ))}
          </div>
          {bets.length > 0 && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">{bets.length} bet{bets.length !== 1 ? "s" : ""} · Total: <span className="text-white font-bold">{totalBet} SKY</span></span>
              <button onClick={clearBets} className="text-red-400 hover:text-red-300">Clear All</button>
            </div>
          )}
        </Card>

        {/* Betting Board */}
        <Card className="bg-[#0e0a1a]/90 border-white/5 p-4 space-y-3">
          <h3 className="text-sm font-semibold text-white">Place Bets</h3>

          {/* Outside Bets */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { type: "red" as BetType, label: "🔴 Red", cls: "border-red-500/30 text-red-400 hover:bg-red-500/10" },
              { type: "black" as BetType, label: "⚫ Black", cls: "border-slate-500/30 text-slate-300 hover:bg-slate-500/10" },
              { type: "even" as BetType, label: "Even", cls: "border-white/10 text-slate-300 hover:bg-white/5" },
              { type: "odd" as BetType, label: "Odd", cls: "border-white/10 text-slate-300 hover:bg-white/5" },
              { type: "1-18" as BetType, label: "1–18", cls: "border-white/10 text-slate-300 hover:bg-white/5" },
              { type: "19-36" as BetType, label: "19–36", cls: "border-white/10 text-slate-300 hover:bg-white/5" },
            ].map(b => (
              <Button key={b.type} variant="outline" size="sm" className={`${b.cls} bg-transparent border text-xs h-9`} onClick={() => placeBet(b.type)}>
                {b.label} <span className="ml-1 text-slate-500 text-[10px]">2x</span>
              </Button>
            ))}
          </div>

          {/* Dozens */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { type: "1st12" as BetType, label: "1st 12" },
              { type: "2nd12" as BetType, label: "2nd 12" },
              { type: "3rd12" as BetType, label: "3rd 12" },
            ].map(b => (
              <Button key={b.type} variant="outline" size="sm" className="border-white/10 text-slate-300 bg-transparent hover:bg-white/5 text-xs h-9" onClick={() => placeBet(b.type)}>
                {b.label} <span className="ml-1 text-slate-500 text-[10px]">3x</span>
              </Button>
            ))}
          </div>

          {/* Number Grid */}
          <div>
            <p className="text-xs text-slate-500 mb-2">Straight Up (36x)</p>
            <div className="grid grid-cols-9 gap-1">
              <button onClick={() => placeBet("straight", 0)} className="col-span-1 h-8 rounded text-xs font-bold bg-green-600/20 text-green-400 border border-green-600/30 hover:bg-green-600/30 transition-all">0</button>
              {Array.from({ length: 36 }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => placeBet("straight", n)}
                  className={`h-8 rounded text-xs font-bold border transition-all ${
                    getColor(n) === "red"
                      ? "bg-red-600/20 text-red-400 border-red-600/30 hover:bg-red-600/30"
                      : "bg-slate-700/30 text-slate-300 border-slate-600/30 hover:bg-slate-700/50"
                  }`}>
                  {n}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Spin Button */}
        <Button onClick={spin} disabled={spinning || bets.length === 0}
          className="w-full h-12 text-lg font-black bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white border-0">
          {spinning ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Spinning...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <CircleDot className="w-5 h-5" /> Spin ({totalBet} SKY)
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}
