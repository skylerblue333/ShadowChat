import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Zap, RotateCcw, AlertTriangle, Trophy } from "lucide-react";

const SYMBOLS = ["🍒","🍋","🍊","🍇","⭐","💎","7️⃣","🎰","🚀","💰"];
const SYMBOL_VALUES: Record<string, number> = {
  "🍒":2,"🍋":3,"🍊":4,"🍇":5,"⭐":8,"💎":15,"7️⃣":25,"🎰":50,"🚀":100,"💰":200
};
const REELS = 5;
const ROWS = 3;

function getRandomSymbol() { return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]; }

function initGrid() {
  return Array.from({ length: ROWS }, () => Array.from({ length: REELS }, getRandomSymbol));
}

function checkWin(grid: string[][], bet: number): { winAmount: number; lines: number[] } {
  let winAmount = 0;
  const lines: number[] = [];
  for (let row = 0; row < ROWS; row++) {
    const rowSymbols = grid[row];
    const allSame = rowSymbols.every(s => s === rowSymbols[0]);
    if (allSame) {
      const mult = SYMBOL_VALUES[rowSymbols[0]] || 1;
      winAmount += bet * mult;
      lines.push(row);
    }
    // Check 3-in-a-row
    for (let col = 0; col <= REELS - 3; col++) {
      if (rowSymbols[col] === rowSymbols[col+1] && rowSymbols[col+1] === rowSymbols[col+2]) {
        const mult = Math.floor((SYMBOL_VALUES[rowSymbols[col]] || 1) * 0.5);
        winAmount += bet * mult;
      }
    }
  }
  return { winAmount, lines };
}

export default function GameSlots() {
  const [grid, setGrid] = useState(initGrid);
  const [spinning, setSpinning] = useState(false);
  const [bet, setBet] = useState("10");
  const [balance, setBalance] = useState(1000);
  const [winLines, setWinLines] = useState<number[]>([]);
  const [lastWin, setLastWin] = useState(0);
  const [spinCount, setSpinCount] = useState(0);
  const [autoSpin, setAutoSpin] = useState(false);
  const [displayGrid, setDisplayGrid] = useState(initGrid);
  const autoRef = useRef(false);

  const spin = async () => {
    const betAmt = parseFloat(bet);
    if (isNaN(betAmt) || betAmt <= 0) { toast.error("Invalid bet"); return; }
    if (betAmt > balance) { toast.error("Insufficient balance"); return; }
    setBalance(b => b - betAmt);
    setSpinning(true);
    setWinLines([]);
    setLastWin(0);
    // Animate reels
    let frames = 0;
    const maxFrames = 20;
    const animInterval = setInterval(() => {
      setDisplayGrid(Array.from({ length: ROWS }, () => Array.from({ length: REELS }, getRandomSymbol)));
      frames++;
      if (frames >= maxFrames) {
        clearInterval(animInterval);
        const finalGrid = initGrid();
        setGrid(finalGrid);
        setDisplayGrid(finalGrid);
        const { winAmount, lines } = checkWin(finalGrid, betAmt);
        setWinLines(lines);
        setLastWin(winAmount);
        if (winAmount > 0) {
          setBalance(b => b + winAmount);
          if (winAmount >= betAmt * 25) toast.success(`🎰 JACKPOT! +${winAmount} SKY444!`);
          else if (winAmount >= betAmt * 5) toast.success(`⭐ Big Win! +${winAmount} SKY444!`);
          else toast.success(`+${winAmount} SKY444`);
        }
        setSpinCount(c => c + 1);
        setSpinning(false);
      }
    }, 50);
  };

  useEffect(() => {
    autoRef.current = autoSpin;
  }, [autoSpin]);

  useEffect(() => {
    if (!spinning && autoSpin && balance >= parseFloat(bet)) {
      const t = setTimeout(spin, 500);
      return () => clearTimeout(t);
    }
    if (!spinning && autoSpin && balance < parseFloat(bet)) {
      setAutoSpin(false);
      toast.error("Auto-spin stopped: insufficient balance");
    }
  }, [spinning, autoSpin]);

  const PAYLINES = [
    { name: "Top Row", mult: "Full match = symbol value × bet" },
    { name: "Middle Row", mult: "Full match = symbol value × bet" },
    { name: "Bottom Row", mult: "Full match = symbol value × bet" },
    { name: "3-in-a-row", mult: "Any 3 consecutive = 0.5× symbol value" },
  ];

  return (
    <div className="min-h-screen bg-[#07050f] text-white p-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">🎰 SKY SLOTS</h1>
          <p className="text-slate-500 text-sm mt-1">5-Reel · 3-Row · Multiple Paylines · SKY444 Betting</p>
        </div>

        {/* Balance */}
        <div className="flex items-center justify-between mb-4">
          <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2">
            <p className="text-xs text-slate-500">Balance</p>
            <p className="text-yellow-400 font-bold">{balance.toFixed(2)} SKY444</p>
          </div>
          {lastWin > 0 && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2 animate-pulse">
              <p className="text-xs text-green-500">Last Win</p>
              <p className="text-green-400 font-bold">+{lastWin} SKY444</p>
            </div>
          )}
          <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2">
            <p className="text-xs text-slate-500">Spins</p>
            <p className="text-white font-bold">{spinCount}</p>
          </div>
        </div>

        {/* Slot Machine */}
        <div className="bg-gradient-to-b from-[#1a0a2e] to-[#0e0a1a] border border-purple-500/20 rounded-3xl p-6 mb-4 shadow-2xl shadow-purple-900/20">
          {/* Reels */}
          <div className="bg-black/40 rounded-2xl p-4 mb-4 border border-white/5">
            {displayGrid.map((row, rowIdx) => (
              <div key={rowIdx} className={`flex justify-around mb-2 last:mb-0 rounded-xl py-2 transition-all duration-200 ${winLines.includes(rowIdx) ? "bg-yellow-500/10 border border-yellow-500/30" : ""}`}>
                {row.map((symbol, colIdx) => (
                  <div key={colIdx} className={`text-4xl transition-all duration-100 ${spinning ? "blur-sm scale-110" : "blur-0 scale-100"}`}>
                    {symbol}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="text-xs text-slate-500 mb-1 block">Bet Amount</label>
              <Input value={bet} onChange={e => setBet(e.target.value)} className="bg-white/5 border-white/10 text-white text-center font-bold" disabled={spinning} />
            </div>
            <div className="flex gap-2">
              {[5,10,25,50,100].map(amt => (
                <Button key={amt} size="sm" variant="outline" className="border-white/10 text-slate-400 text-xs px-2" onClick={() => setBet(String(amt))} disabled={spinning}>{amt}</Button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 mt-3">
            <Button
              className="flex-1 h-14 text-lg font-black bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-400 hover:via-orange-400 hover:to-red-400 text-black shadow-lg shadow-orange-900/30"
              onClick={spin}
              disabled={spinning}
            >
              {spinning ? <><RotateCcw className="w-5 h-5 mr-2 animate-spin" />Spinning...</> : <><Zap className="w-5 h-5 mr-2" />SPIN</>}
            </Button>
            <Button
              className={`h-14 px-4 font-bold ${autoSpin ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-white/5 text-slate-400 border border-white/10"}`}
              onClick={() => setAutoSpin(!autoSpin)}
              disabled={spinning && !autoSpin}
            >
              {autoSpin ? "Stop Auto" : "Auto"}
            </Button>
          </div>
        </div>

        {/* Paytable */}
        <div className="bg-[#0e0a1a] border border-white/5 rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2"><Trophy className="w-4 h-4" />Paytable</h3>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {SYMBOLS.map(sym => (
              <div key={sym} className="flex items-center justify-between bg-white/3 rounded-lg px-3 py-1.5 text-xs">
                <span className="text-xl">{sym}</span>
                <span className="text-slate-400">{SYMBOL_VALUES[sym]}x bet</span>
              </div>
            ))}
          </div>
          <div className="space-y-1">
            {PAYLINES.map((pl, i) => (
              <div key={i} className="flex items-center justify-between text-xs text-slate-500">
                <span>{pl.name}</span><span className="text-slate-600">{pl.mult}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-yellow-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-yellow-600">RTP ~96%. Play responsibly. SKY444 is a platform token, not real currency.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
