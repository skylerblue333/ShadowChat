import { useState, useCallback, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { ArrowLeft, Zap, History, Circle } from "lucide-react";

const ROWS = 12;
const MULTIPLIERS_LOW: number[] = [5.6, 2.1, 1.1, 1.0, 0.5, 0.3, 0.2, 0.3, 0.5, 1.0, 1.1, 2.1, 5.6];
const MULTIPLIERS_MED: number[] = [13, 3, 1.3, 0.7, 0.4, 0.2, 0.2, 0.2, 0.4, 0.7, 1.3, 3, 13];
const MULTIPLIERS_HIGH: number[] = [29, 4, 1.5, 0.3, 0.2, 0.2, 0.2, 0.2, 0.2, 0.3, 1.5, 4, 29];

type Risk = "low" | "medium" | "high";

function getMultipliers(risk: Risk) {
  if (risk === "low") return MULTIPLIERS_LOW;
  if (risk === "medium") return MULTIPLIERS_MED;
  return MULTIPLIERS_HIGH;
}

function getBucketColor(mult: number) {
  if (mult >= 10) return "bg-yellow-500 text-black";
  if (mult >= 3) return "bg-orange-500 text-white";
  if (mult >= 1.5) return "bg-green-600 text-white";
  if (mult >= 1) return "bg-blue-600 text-white";
  return "bg-slate-700 text-slate-300";
}

interface DropResult {
  bucket: number;
  multiplier: number;
  wager: number;
  payout: number;
  path: boolean[];
  ts: number;
}

export default function GamePlinko() {
  const { isAuthenticated } = useAuth();
  const [balance, setBalance] = useState(1000);
  const [wager, setWager] = useState("10");
  const [risk, setRisk] = useState<Risk>("medium");
  const [dropping, setDropping] = useState(false);
  const [activePath, setActivePath] = useState<boolean[] | null>(null);
  const [activeBucket, setActiveBucket] = useState<number | null>(null);
  const [history, setHistory] = useState<DropResult[]>([]);
  const animRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const multipliers = getMultipliers(risk);

  const drop = useCallback(() => {
    if (!isAuthenticated) { window.location.href = getLoginUrl(); return; }
    const w = parseFloat(wager);
    if (isNaN(w) || w <= 0) { toast.error("Enter a valid wager"); return; }
    if (w > balance) { toast.error("Insufficient balance"); return; }

    setDropping(true);
    setActivePath(null);
    setActiveBucket(null);

    // Generate path
    const path: boolean[] = [];
    let pos = 0;
    for (let r = 0; r < ROWS; r++) {
      const goRight = Math.random() < 0.5;
      path.push(goRight);
      if (goRight) pos++;
    }

    const bucket = pos;
    const mult = multipliers[bucket];
    const payout = w * mult;

    // Animate row by row
    let row = 0;
    const animate = () => {
      if (row <= ROWS) {
        setActivePath(path.slice(0, row));
        row++;
        animRef.current = setTimeout(animate, 80);
      } else {
        setActiveBucket(bucket);
        setDropping(false);
        setBalance(prev => prev - w + payout);
        const net = payout - w;
        if (net > 0) {
          toast.success(`🎯 ${mult}x — Won ${payout.toFixed(2)} SKY444!`, { duration: 3000 });
        } else {
          toast.error(`🎯 ${mult}x — Lost ${(w - payout).toFixed(2)} SKY444`, { duration: 2000 });
        }
        setHistory(prev => [{ bucket, multiplier: mult, wager: w, payout, path, ts: Date.now() }, ...prev.slice(0, 14)]);
      }
    };
    animate();
  }, [wager, risk, balance, multipliers, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07050f]">
        <div className="text-center space-y-4">
          <Circle className="w-16 h-16 text-yellow-400 mx-auto" />
          <h2 className="text-2xl font-black text-white">Plinko</h2>
          <p className="text-slate-400">Sign in to play with SKY444</p>
          <Button onClick={() => window.location.href = getLoginUrl()} className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white border-0">Sign In to Play</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07050f] py-8 px-4">
      <div className="max-w-xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/arcade">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
              <Circle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white">Plinko</h1>
              <p className="text-xs text-slate-500">Drop the ball · Win big</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-bold text-white">{balance.toFixed(2)}</span>
            <span className="text-xs text-slate-500">SKY444</span>
          </div>
        </div>

        {/* Board */}
        <Card className="bg-[#0e0a1a]/90 border-white/5 p-4">
          <div className="flex flex-col items-center gap-3">
            {/* Peg rows */}
            {Array.from({ length: ROWS }, (_, row) => (
              <div key={row} className="flex gap-3 justify-center">
                {Array.from({ length: row + 2 }, (_, col) => {
                  const isActive = activePath && activePath.length > row;
                  let ballHere = false;
                  if (isActive) {
                    let pos = 0;
                    for (let r = 0; r < row; r++) pos += activePath[r] ? 1 : 0;
                    ballHere = col === pos;
                  }
                  return (
                    <div key={col} className={`w-3 h-3 rounded-full transition-all duration-100 ${ballHere ? "bg-yellow-400 shadow-lg shadow-yellow-400/50 scale-125" : "bg-slate-600"}`} />
                  );
                })}
              </div>
            ))}

            {/* Buckets */}
            <div className="flex gap-1 mt-2">
              {multipliers.map((mult, i) => (
                <div key={i} className={`flex-1 min-w-0 rounded-md py-1.5 text-center text-[10px] font-bold transition-all duration-200 ${getBucketColor(mult)} ${activeBucket === i ? "scale-110 ring-2 ring-yellow-400 ring-offset-1 ring-offset-[#0e0a1a]" : ""}`}>
                  {mult}x
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Controls */}
        <Card className="bg-[#0e0a1a]/90 border-white/5 p-4 space-y-4">
          {/* Risk */}
          <div className="space-y-2">
            <label className="text-sm text-slate-400">Risk Level</label>
            <div className="flex gap-2">
              {(["low", "medium", "high"] as Risk[]).map(r => (
                <Button key={r} variant={risk === r ? "default" : "outline"}
                  className={`flex-1 capitalize text-xs ${risk === r ? "bg-yellow-600 hover:bg-yellow-700 text-white border-0" : "border-white/10 text-slate-400 bg-transparent"}`}
                  onClick={() => setRisk(r)}>
                  {r}
                </Button>
              ))}
            </div>
          </div>

          {/* Wager */}
          <div className="space-y-2">
            <label className="text-sm text-slate-400">Wager (SKY444)</label>
            <div className="flex gap-2">
              <Input value={wager} onChange={e => setWager(e.target.value)} type="number" min="1" className="bg-white/5 border-white/10 text-white flex-1" />
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

          <Button onClick={drop} disabled={dropping}
            className="w-full h-12 text-lg font-black bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black border-0">
            {dropping ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Dropping...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Circle className="w-5 h-5" /> Drop Ball ({parseFloat(wager) || 0} SKY)
              </div>
            )}
          </Button>
        </Card>

        {/* History */}
        {history.length > 0 && (
          <Card className="bg-[#0e0a1a]/90 border-white/5 p-4">
            <div className="flex items-center gap-2 mb-3">
              <History className="w-4 h-4 text-slate-500" />
              <h3 className="text-sm font-semibold text-white">Recent Drops</h3>
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {history.map((r, i) => (
                <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-mono font-bold text-sm ${r.payout >= r.wager ? "text-green-400" : "text-red-400"}`}>{r.multiplier}x</span>
                    <span className="text-slate-500">Bucket {r.bucket + 1}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">{r.wager} SKY</span>
                    <Badge className={`text-[10px] ${r.payout >= r.wager ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}`}>
                      {r.payout >= r.wager ? `+${(r.payout - r.wager).toFixed(2)}` : `-${(r.wager - r.payout).toFixed(2)}`}
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
