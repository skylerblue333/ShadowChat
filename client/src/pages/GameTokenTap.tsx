import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Heart, Trophy, Zap, ArrowRight, RotateCcw, Droplets } from "lucide-react";

type Particle = { id: number; x: number; y: number; opacity: number; scale: number };

export default function GameTokenTap() {
  const [gameState, setGameState] = useState<"idle" | "playing" | "finished">("idle");
  const [taps, setTaps] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [donated, setDonated] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const particleId = useRef(0);
  const lastTapTime = useRef(0);
  const comboTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (gameState !== "playing") return;
    if (timeLeft <= 0) { setGameState("finished"); return; }
    const t = setTimeout(() => setTimeLeft(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, gameState]);

  const handleTap = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (gameState !== "playing") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const now = Date.now();
    const timeSinceLast = now - lastTapTime.current;
    lastTapTime.current = now;

    const newCombo = timeSinceLast < 500 ? combo + 1 : 1;
    setCombo(newCombo);
    setMaxCombo(p => Math.max(p, newCombo));

    if (comboTimer.current) clearTimeout(comboTimer.current);
    comboTimer.current = setTimeout(() => setCombo(0), 800);

    const multiplier = newCombo >= 10 ? 3 : newCombo >= 5 ? 2 : 1;
    setTaps(p => p + multiplier);
    setDonated(p => p + multiplier);
    setXpEarned(p => p + multiplier * 10);

    const pid = ++particleId.current;
    setParticles(p => [...p, { id: pid, x, y, opacity: 1, scale: 1 }]);
    setTimeout(() => setParticles(p => p.filter(pt => pt.id !== pid)), 600);
  }, [gameState, combo]);

  const startGame = () => {
    setGameState("playing");
    setTaps(0);
    setTimeLeft(30);
    setCombo(0);
    setMaxCombo(0);
    setDonated(0);
    setXpEarned(0);
    setParticles([]);
  };

  const tapsPerSec = timeLeft < 30 ? (taps / (30 - timeLeft)).toFixed(1) : "0.0";
  const progressPct = ((30 - timeLeft) / 30) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur px-4 py-3 flex items-center gap-3">
        <Link href="/gaming-for-charity">
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground"><ChevronLeft className="h-4 w-4" />Back</Button>
        </Link>
        <span className="text-lg">👆</span>
        <span className="font-bold text-sm">Token Tap Frenzy</span>
        <Badge variant="outline" className="text-purple-400 border-purple-500/30 text-xs">Arcade</Badge>
        <div className="flex-1" />
        {gameState === "playing" && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <Droplets className="h-3.5 w-3.5 text-cyan-400" />
              <span className="text-xs font-bold text-cyan-400">{donated} SKY444</span>
            </div>
          </div>
        )}
      </div>

      <div className="container max-w-lg py-8 flex flex-col items-center">
        {gameState === "idle" && (
          <div className="text-center">
            <div className="text-7xl mb-6">👆</div>
            <h1 className="text-3xl font-bold mb-3">Token Tap Frenzy</h1>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">Tap as fast as you can for 30 seconds! Every tap donates SKY444 to the Clean Water Initiative. Build combos for multipliers!</p>
            <div className="grid grid-cols-3 gap-4 mb-8 max-w-xs mx-auto">
              {[{ label: "Duration", value: "30s" }, { label: "Combo 5x", value: "2x pts" }, { label: "Combo 10x", value: "3x pts" }].map(s => (
                <div key={s.label} className="rounded-xl border border-border/50 bg-card/30 p-3 text-center">
                  <p className="text-lg font-bold text-purple-400">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
            <Button onClick={startGame} className="bg-purple-600 hover:bg-purple-600 text-white gap-2 h-12 px-8 text-base">
              <Zap className="h-5 w-5" />Start Tapping!
            </Button>
          </div>
        )}

        {gameState === "playing" && (
          <div className="w-full">
            {/* Stats bar */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{taps}</p>
                <p className="text-xs text-muted-foreground">Taps</p>
              </div>
              <div className={`text-center px-4 py-2 rounded-xl transition-all ${combo >= 10 ? "bg-red-500/20 border border-red-500/30" : combo >= 5 ? "bg-orange-500/20 border border-orange-500/30" : "bg-card/30 border border-border/50"}`}>
                <p className={`text-2xl font-bold ${combo >= 10 ? "text-red-400" : combo >= 5 ? "text-orange-400" : "text-foreground"}`}>{combo >= 10 ? "3x" : combo >= 5 ? "2x" : "1x"}</p>
                <p className="text-xs text-muted-foreground">Combo {combo > 0 ? `(${combo})` : ""}</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${timeLeft <= 10 ? "text-red-400" : "text-foreground"}`}>{timeLeft}s</p>
                <p className="text-xs text-muted-foreground">Left</p>
              </div>
            </div>
            <Progress value={progressPct} className="h-2 mb-6" />

            {/* Tap Zone */}
            <div
              onClick={handleTap}
              className="relative w-full aspect-square max-w-xs mx-auto rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-4 border-purple-500/30 flex items-center justify-center cursor-pointer select-none active:scale-95 transition-transform overflow-hidden"
              style={{ touchAction: "none" }}
            >
              <div className="text-center pointer-events-none">
                <div className="text-6xl mb-2">💧</div>
                <p className="text-white font-bold text-lg">TAP!</p>
                <p className="text-white/60 text-sm">{tapsPerSec}/sec</p>
              </div>
              {particles.map(p => (
                <div key={p.id} className="absolute pointer-events-none text-purple-400 font-bold text-sm animate-bounce" style={{ left: p.x, top: p.y, transform: "translate(-50%, -50%)" }}>
                  +{combo >= 10 ? 3 : combo >= 5 ? 2 : 1}
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-muted-foreground mt-4">Tap faster to build combos!</p>
          </div>
        )}

        {gameState === "finished" && (
          <div className="text-center w-full">
            <div className="text-6xl mb-4">{taps >= 200 ? "🏆" : taps >= 100 ? "🥈" : "👆"}</div>
            <h2 className="text-3xl font-bold mb-2">{taps >= 200 ? "Incredible!" : taps >= 100 ? "Great Speed!" : "Nice Try!"}</h2>
            <p className="text-muted-foreground mb-6">{taps} taps · {tapsPerSec} avg/sec</p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: "Total Taps", value: taps.toString(), color: "text-purple-400" },
                { label: "Max Combo", value: `${maxCombo}x`, color: "text-orange-400" },
                { label: "Donated", value: `${donated} SKY444`, color: "text-cyan-400" },
              ].map(s => (
                <div key={s.label} className="rounded-xl border border-border/50 bg-card/30 p-3 text-center">
                  <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-4 mb-6">
              <p className="text-sm font-semibold text-cyan-400 mb-1">💧 Clean Water Initiative</p>
              <p className="text-xs text-muted-foreground">{donated} SKY444 donated to provide clean water!</p>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Button onClick={startGame} variant="outline" className="gap-2"><RotateCcw className="h-4 w-4" />Play Again</Button>
              <Link href="/gaming-for-charity">
                <Button className="bg-primary text-primary-foreground gap-2">More Games <ArrowRight className="h-4 w-4" /></Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
