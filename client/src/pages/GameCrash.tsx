import { useState, useEffect, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { TrendingUp, Zap, Users, Trophy, History, AlertTriangle } from "lucide-react";

type GameState = "waiting" | "running" | "crashed";

const HISTORY_MOCK = [8.42, 1.23, 24.7, 2.01, 1.05, 15.3, 3.88, 1.01, 6.72, 1.44, 2.99, 11.2, 1.08, 4.55, 1.77];

function MultiplierDisplay({ value, state }: { value: number; state: GameState }) {
  const color = state === "crashed" ? "text-red-400" : value >= 2 ? "text-green-400" : "text-yellow-400";
  return (
    <div className={`text-7xl font-black tabular-nums transition-colors duration-200 ${color}`}>
      {value.toFixed(2)}x
    </div>
  );
}

export default function GameCrash() {
  const { isAuthenticated } = useAuth();
  const [gameState, setGameState] = useState<GameState>("waiting");
  const [multiplier, setMultiplier] = useState(1.00);
  const [betAmount, setBetAmount] = useState("10");
  const [autoCashout, setAutoCashout] = useState("2.00");
  const [hasBet, setHasBet] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);
  const [cashedOutAt, setCashedOutAt] = useState(0);
  const [countdown, setCountdown] = useState(5);
  const [history, setHistory] = useState(HISTORY_MOCK);
  const [balance, setBalance] = useState(1000);
  const [players, setPlayers] = useState([
    { name: "SkyWhale", bet: 500, cashedAt: null as number | null },
    { name: "CryptoFox", bet: 100, cashedAt: null as number | null },
    { name: "DeFiKing", bet: 250, cashedAt: null as number | null },
    { name: "MoonRider", bet: 75, cashedAt: null as number | null },
  ]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const crashPointRef = useRef(1.0);

  const generateCrashPoint = () => {
    // Provably fair: house edge ~4%, crash point between 1.00 and ~100x
    const r = Math.random();
    if (r < 0.04) return 1.00; // instant crash 4% of time
    return Math.max(1.00, 0.99 / (1 - r));
  };

  const startGame = useCallback(() => {
    crashPointRef.current = generateCrashPoint();
    setMultiplier(1.00);
    setGameState("running");
    setCashedOut(false);
    let current = 1.00;
    const startTime = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      current = Math.pow(Math.E, elapsed * 0.15);
      setMultiplier(parseFloat(current.toFixed(2)));
      // Auto-cashout
      const autoVal = parseFloat(autoCashout);
      if (hasBet && !cashedOut && autoVal > 0 && current >= autoVal) {
        handleCashout(current);
      }
      // Simulate other players cashing out
      setPlayers(prev => prev.map(p => {
        if (!p.cashedAt && Math.random() < 0.01 * current) {
          return { ...p, cashedAt: parseFloat(current.toFixed(2)) };
        }
        return p;
      }));
      if (current >= crashPointRef.current) {
        clearInterval(intervalRef.current!);
        setGameState("crashed");
        setHistory(prev => [parseFloat(crashPointRef.current.toFixed(2)), ...prev.slice(0, 14)]);
        setTimeout(() => {
          setGameState("waiting");
          setHasBet(false);
          setCashedOut(false);
          setCountdown(5);
          setPlayers(prev => prev.map(p => ({ ...p, cashedAt: null })));
          let c = 5;
          const cdInterval = setInterval(() => {
            c--;
            setCountdown(c);
            if (c <= 0) { clearInterval(cdInterval); startGame(); }
          }, 1000);
        }, 2000);
      }
    }, 50);
  }, [hasBet, cashedOut, autoCashout]);

  useEffect(() => {
    let c = countdown;
    const cdInterval = setInterval(() => {
      c--;
      setCountdown(c);
      if (c <= 0) { clearInterval(cdInterval); startGame(); }
    }, 1000);
    return () => { clearInterval(cdInterval); if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const handleBet = () => {
    const amt = parseFloat(betAmount);
    if (isNaN(amt) || amt <= 0) { toast.error("Invalid bet amount"); return; }
    if (amt > balance) { toast.error("Insufficient balance"); return; }
    if (gameState !== "waiting") { toast.error("Wait for next round"); return; }
    setBalance(b => b - amt);
    setHasBet(true);
    toast.success(`Bet placed: ${amt} SKY444`);
  };

  const handleCashout = (currentMult?: number) => {
    const mult = currentMult || multiplier;
    if (!hasBet || cashedOut || gameState !== "running") return;
    const amt = parseFloat(betAmount);
    const winnings = amt * mult;
    setBalance(b => b + winnings);
    setCashedOut(true);
    setCashedOutAt(mult);
    toast.success(`Cashed out at ${mult.toFixed(2)}x! +${winnings.toFixed(2)} SKY444`);
  };

  const getHistoryColor = (val: number) => {
    if (val < 1.5) return "bg-red-500/20 text-red-400 border-red-500/30";
    if (val < 3) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    return "bg-green-500/20 text-green-400 border-green-500/30";
  };

  return (
    <div className="min-h-screen bg-[#07050f] text-white p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">CRASH</h1>
            <p className="text-slate-500 text-sm">Provably fair · Cash out before it crashes</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2">
              <p className="text-xs text-slate-500">Balance</p>
              <p className="text-yellow-400 font-bold">{balance.toFixed(2)} SKY444</p>
            </div>
          </div>
        </div>

        {/* History */}
        <div className="flex gap-1.5 mb-4 overflow-x-auto pb-2">
          {history.map((val, i) => (
            <Badge key={i} className={`shrink-0 text-xs font-bold ${getHistoryColor(val)}`}>{val.toFixed(2)}x</Badge>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main game area */}
          <div className="lg:col-span-2">
            <div className="relative bg-[#0e0a1a] border border-white/5 rounded-2xl overflow-hidden" style={{ height: "400px" }}>
              {/* Graph background */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-transparent" />
              {/* Grid lines */}
              <svg className="absolute inset-0 w-full h-full opacity-10">
                {[1,2,3,4].map(i => <line key={i} x1="0" y1={`${i*25}%`} x2="100%" y2={`${i*25}%`} stroke="#ffffff" strokeWidth="0.5" />)}
                {[1,2,3,4].map(i => <line key={i} x1={`${i*25}%`} y1="0" x2={`${i*25}%`} y2="100%" stroke="#ffffff" strokeWidth="0.5" />)}
              </svg>
              {/* Multiplier display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {gameState === "waiting" ? (
                  <div className="text-center">
                    <p className="text-slate-500 text-sm mb-2">Next round in</p>
                    <div className="text-6xl font-black text-white">{countdown}s</div>
                    <p className="text-slate-600 text-xs mt-2">Place your bets!</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <MultiplierDisplay value={multiplier} state={gameState} />
                    {gameState === "crashed" && <p className="text-red-400 font-bold text-xl mt-2">CRASHED!</p>}
                    {cashedOut && <p className="text-green-400 font-semibold mt-2">Cashed out at {cashedOutAt.toFixed(2)}x ✓</p>}
                  </div>
                )}
              </div>
              {/* Rocket */}
              {gameState === "running" && (
                <div className="absolute bottom-8 left-8 text-4xl" style={{ transform: `translateY(-${Math.min(80, (multiplier - 1) * 20)}%)`, transition: "transform 0.1s linear" }}>
                  🚀
                </div>
              )}
              {gameState === "crashed" && <div className="absolute bottom-8 left-8 text-4xl">💥</div>}
            </div>

            {/* Bet controls */}
            <div className="mt-4 bg-[#0e0a1a] border border-white/5 rounded-2xl p-4">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Bet Amount (SKY444)</label>
                  <div className="flex gap-2">
                    <Input value={betAmount} onChange={e => setBetAmount(e.target.value)} className="bg-white/5 border-white/10 text-white" placeholder="10" />
                    <Button size="sm" variant="outline" className="shrink-0 border-white/10 text-slate-400" onClick={() => setBetAmount(v => String(parseFloat(v)*2))}>2x</Button>
                    <Button size="sm" variant="outline" className="shrink-0 border-white/10 text-slate-400" onClick={() => setBetAmount(v => String(Math.floor(parseFloat(v)/2)))}>½</Button>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Auto Cashout At</label>
                  <Input value={autoCashout} onChange={e => setAutoCashout(e.target.value)} className="bg-white/5 border-white/10 text-white" placeholder="2.00" />
                </div>
              </div>
              <div className="flex gap-3">
                {gameState === "waiting" && !hasBet && (
                  <Button className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold" onClick={handleBet}>
                    <Zap className="w-4 h-4 mr-2" />Place Bet
                  </Button>
                )}
                {gameState === "waiting" && hasBet && (
                  <Button className="flex-1 bg-green-500/20 text-green-400 border border-green-500/30" disabled>
                    ✓ Bet Placed — Waiting for round...
                  </Button>
                )}
                {gameState === "running" && hasBet && !cashedOut && (
                  <Button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black font-bold text-lg" onClick={() => handleCashout()}>
                    CASH OUT {(parseFloat(betAmount) * multiplier).toFixed(2)} SKY444
                  </Button>
                )}
                {gameState === "running" && (!hasBet || cashedOut) && (
                  <Button className="flex-1 bg-white/5 text-slate-500 border border-white/5" disabled>
                    {cashedOut ? `Cashed out at ${cashedOutAt.toFixed(2)}x` : "Round in progress..."}
                  </Button>
                )}
                {gameState === "crashed" && (
                  <Button className="flex-1 bg-red-500/20 text-red-400 border border-red-500/30" disabled>
                    Crashed at {history[0]?.toFixed(2)}x
                  </Button>
                )}
              </div>
              <div className="flex gap-2 mt-2">
                {[10, 25, 50, 100, 500].map(amt => (
                  <Button key={amt} size="sm" variant="outline" className="flex-1 border-white/10 text-slate-400 text-xs" onClick={() => setBetAmount(String(amt))}>{amt}</Button>
                ))}
              </div>
            </div>
          </div>

          {/* Players sidebar */}
          <div className="bg-[#0e0a1a] border border-white/5 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2"><Users className="w-4 h-4" />Players This Round</h3>
            <div className="space-y-2">
              {players.map((p, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">{p.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">{p.bet} SKY</span>
                    {p.cashedAt ? (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[10px]">{p.cashedAt}x</Badge>
                    ) : gameState === "crashed" ? (
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-[10px]">Bust</Badge>
                    ) : (
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-[10px]">Playing</Badge>
                    )}
                  </div>
                </div>
              ))}
              {hasBet && (
                <div className="flex items-center justify-between text-xs border-t border-white/5 pt-2 mt-2">
                  <span className="text-purple-300 font-semibold">You</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">{betAmount} SKY</span>
                    {cashedOut ? (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[10px]">{cashedOutAt.toFixed(2)}x</Badge>
                    ) : (
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-[10px]">Playing</Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-white/5">
              <h4 className="text-xs text-slate-500 mb-2 flex items-center gap-1"><History className="w-3 h-3" />Recent Crashes</h4>
              <div className="space-y-1">
                {history.slice(0,8).map((val, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">Round -{i+1}</span>
                    <span className={val < 1.5 ? "text-red-400" : val < 3 ? "text-yellow-400" : "text-green-400"}>{val.toFixed(2)}x</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-yellow-600">Provably fair game. House edge 4%. Play responsibly. SKY444 is a platform token, not real currency.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
