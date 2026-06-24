/**
 * SpinWheel — Daily spin wheel with weighted prizes, animation, and DB persistence
 */
import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Zap, Gift, ChevronLeft, Trophy, Star, Coins, Crown } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

const PRIZE_COLORS = [
  "#f59e0b", "#f97316", "#ef4444", "#8b5cf6",
  "#7c3aed", "#06b6d4", "#10b981", "#6b7280",
];

function SpinWheelCanvas({ prizes, spinning, targetIndex, onSpinEnd }: {
  prizes: { label: string; color: string }[];
  spinning: boolean;
  targetIndex: number;
  onSpinEnd: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);
  const animRef = useRef<number>(0);

  const drawWheel = (rotation: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r = cx - 10;
    const arc = (2 * Math.PI) / prizes.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    prizes.forEach((prize, i) => {
      const start = rotation + i * arc;
      const end = start + arc;

      // Slice
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, end);
      ctx.closePath();
      ctx.fillStyle = PRIZE_COLORS[i % PRIZE_COLORS.length];
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(start + arc / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#fff";
      ctx.font = "bold 13px Inter, sans-serif";
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 4;
      ctx.fillText(prize.label, r - 12, 5);
      ctx.restore();
    });

    // Center circle
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, 2 * Math.PI);
    ctx.fillStyle = "#0a0a0f";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Center icon
    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("★", cx, cy);
  };

  useEffect(() => {
    drawWheel(rotationRef.current);
  }, [prizes]);

  useEffect(() => {
    if (!spinning) return;

    const arc = (2 * Math.PI) / prizes.length;
    // Target: land on targetIndex — pointer is at top (3π/2), so rotate to align
    const targetAngle = (2 * Math.PI) - (targetIndex * arc) - arc / 2 + (3 * Math.PI / 2);
    const spins = 5 * 2 * Math.PI; // 5 full rotations
    const finalAngle = spins + targetAngle;

    const startAngle = rotationRef.current;
    const startTime = performance.now();
    const duration = 4000;

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = easeOut(t);
      rotationRef.current = startAngle + finalAngle * eased;
      drawWheel(rotationRef.current);

      if (t < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        rotationRef.current = rotationRef.current % (2 * Math.PI);
        onSpinEnd();
      }
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [spinning, targetIndex]);

  return (
    <div className="relative">
      {/* Pointer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[20px] border-l-transparent border-r-transparent border-b-amber-400 drop-shadow-lg" />
      <canvas
        ref={canvasRef}
        width={320}
        height={320}
        className="rounded-full shadow-2xl ring-4 ring-white/10"
      />
    </div>
  );
}

export default function SpinWheel() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [spinning, setSpinning] = useState(false);
  const [targetIndex, setTargetIndex] = useState(0);
  const [result, setResult] = useState<{ label: string; type: string; amount: number } | null>(null);
  const [showResult, setShowResult] = useState(false);

  const { data: prizes = [] } = trpc.gamification.getSpinPrizes.useQuery();
  const { data: state, refetch } = trpc.gamification.getState.useQuery(undefined, { enabled: !!user });

  const spinMutation = trpc.gamification.spin.useMutation({
    onSuccess: (data: any) => {
      const idx = prizes.findIndex((p: any) => p.id === data.prize.id);
      setTargetIndex(idx >= 0 ? idx : 0);
      setResult(data.prize);
      setSpinning(true);
    },
    onError: (err: any) => {
      toast.error(err.message);
    },
  });

  const handleSpin = (): void => {
    if (spinning || (state as any)?.hasSpunToday) return;
    spinMutation.mutate();
  };

  const handleSpinEnd = () => {
    setSpinning(false);
    setShowResult(true);
    refetch();
  };

  const prizeItems = (Array.isArray(prizes) && prizes.length > 0) ? prizes : [
    { id: "loading", label: "Loading...", color: "#333", type: "nothing" as const, amount: 0, weight: 1 },
  ];

  return (
    <div className="min-h-screen bg-[#050508] text-white">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-950/40 via-[#050508] to-purple-950/30 py-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="glow-orb w-64 h-64 bg-amber-500/15 top-0 left-1/4" />
          <div className="glow-orb w-48 h-48 bg-purple-500/15 bottom-0 right-1/4" />
        </div>
        <div className="container max-w-4xl mx-auto px-4 text-center relative z-10">
          <button
            onClick={() => navigate(-1 as any)}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-sm font-medium mb-4">
            <Gift className="w-4 h-4" /> Daily Reward
          </div>
          <h1 className="text-5xl font-black mb-3 rainbow-text">Daily Spin Wheel</h1>
          <p className="text-lg text-muted-foreground metallic-shimmer">Spin once per day. Win XP, SKY444 tokens, badges, and boosts.</p>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Wheel */}
          <div className="flex flex-col items-center gap-6">
            <SpinWheelCanvas
              prizes={prizeItems as any}
              spinning={spinning}
              targetIndex={targetIndex}
              onSpinEnd={handleSpinEnd}
            />

            {/* Spin button */}
            {!user ? (
              <div className="text-center text-muted-foreground">Sign in to spin</div>
            ) : (state as any)?.hasSpunToday ? (
              <div className="text-center">
                <div className="text-muted-foreground text-sm mb-1">Already spun today!</div>
                {(state as any)?.lastSpin && (
                  <div className="text-amber-400 font-bold">Last prize: {((state as any).lastSpin as any).prize}</div>
                )}
                <div className="text-xs text-muted-foreground mt-2">Come back tomorrow for another spin</div>
              </div>
            ) : (
              <button
                onClick={handleSpin}
                disabled={spinning || spinMutation.isPending}
                className="px-8 py-4 rounded-xl font-black text-lg bg-gradient-to-r from-amber-500 to-yellow-400 text-black hover:from-amber-400 hover:to-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/30"
              >
                {spinning ? "Spinning..." : "🎡 SPIN NOW"}
              </button>
            )}
          </div>

          {/* Prize list + result */}
          <div className="space-y-4">
            {/* Result popup */}
            {showResult && result && (
              <div className="rounded-xl border border-amber-500/50 bg-amber-500/10 p-6 text-center animate-in fade-in zoom-in-95 duration-300">
                <div className="text-4xl mb-2">🎉</div>
                <div className="text-xl font-black text-amber-300 mb-1">You won!</div>
                <div className="text-3xl font-black text-white mb-2">{result.label}</div>
                {result.type === "xp" && <div className="text-amber-400">+{result.amount} XP added to your account</div>}
                {result.type === "sky444" && <div className="text-purple-400">+{result.amount} SKY444 tokens added to your wallet</div>}
                {result.type === "badge" && <div className="text-green-400">Lucky Spinner badge added to your profile!</div>}
                {result.type === "boost" && <div className="text-cyan-400">2x XP boost active for 1 hour!</div>}
                <button
                  onClick={() => setShowResult(false)}
                  className="mt-4 px-4 py-2 rounded-lg bg-white/10 text-sm hover:bg-white/20 transition-colors"
                >
                  Awesome!
                </button>
              </div>
            )}

            {/* Prize table */}
            <div className="rounded-xl border border-white/10 bg-white/3 overflow-hidden">
              <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-bold text-white">Possible Prizes</span>
              </div>
              <div className="divide-y divide-white/5">
                {prizeItems.map((prize: any, i: number) => (
                  <div key={prize.id} className="flex items-center gap-3 px-4 py-2.5">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: PRIZE_COLORS[i % PRIZE_COLORS.length] }} />
                    <span className="flex-1 text-sm text-white">{prize.label}</span>
                    <span className="text-xs text-muted-foreground">{prize.weight}% chance</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Streak bonus info */}
            <div className="rounded-xl border border-white/10 bg-white/3 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-bold text-white">Login Streak Bonuses</span>
              </div>
              <div className="space-y-1.5 text-xs">
                {[
                  { days: 7,  bonus: "+100 XP",  color: "text-yellow-400" },
                  { days: 14, bonus: "+200 XP",  color: "text-orange-400" },
                  { days: 30, bonus: "+500 XP",  color: "text-red-400"    },
                ].map(b => (
                  <div key={b.days} className="flex items-center justify-between">
                    <span className="text-muted-foreground">{b.days}-day streak</span>
                    <span className={`font-bold ${b.color}`}>{b.bonus}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
