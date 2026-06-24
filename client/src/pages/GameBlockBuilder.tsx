import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Zap, ArrowRight, RotateCcw, Heart } from "lucide-react";

const BLOCK_COLORS = [
  "bg-blue-500", "bg-purple-500", "bg-purple-600", "bg-yellow-500",
  "bg-red-500", "bg-pink-500", "bg-cyan-500", "bg-orange-500",
];

const BLOCK_LABELS = ["BTC", "ETH", "SOL", "BNB", "ADA", "DOT", "LINK", "MATIC"];

type Block = { id: number; color: string; label: string; width: number };
type StackedBlock = Block & { offset: number; perfect: boolean };

export default function GameBlockBuilder() {
  const [gameState, setGameState] = useState<"idle" | "playing" | "finished">("idle");
  const [stack, setStack] = useState<StackedBlock[]>([]);
  const [currentBlock, setCurrentBlock] = useState<Block | null>(null);
  const [position, setPosition] = useState(0);
  const [direction, setDirection] = useState(1);
  const [score, setScore] = useState(0);
  const [donated, setDonated] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [speed, setSpeed] = useState(2);
  const [perfectStreak, setPerfectStreak] = useState(0);

  const PLATFORM_WIDTH = 280;
  const MOVE_RANGE = 240;

  useEffect(() => {
    if (gameState !== "playing" || !currentBlock) return;
    const interval = setInterval(() => {
      setPosition(p => {
        const next = p + direction * speed;
        if (next >= MOVE_RANGE || next <= -MOVE_RANGE) {
          setDirection(d => -d);
          return p - direction * speed;
        }
        return next;
      });
    }, 16);
    return () => clearInterval(interval);
  }, [gameState, currentBlock, direction, speed]);

  const generateBlock = useCallback((width: number): Block => {
    const idx = Math.floor(Math.random() * BLOCK_COLORS.length);
    return { id: Date.now(), color: BLOCK_COLORS[idx], label: BLOCK_LABELS[idx], width };
  }, []);

  const startGame = () => {
    const firstBlock = generateBlock(PLATFORM_WIDTH);
    setStack([{ ...firstBlock, offset: 0, perfect: true }]);
    setCurrentBlock(generateBlock(PLATFORM_WIDTH));
    setPosition(0);
    setDirection(1);
    setScore(0);
    setDonated(0);
    setXpEarned(0);
    setSpeed(2);
    setPerfectStreak(0);
    setGameState("playing");
  };

  const dropBlock = useCallback(() => {
    if (gameState !== "playing" || !currentBlock || stack.length === 0) return;

    const topBlock = stack[stack.length - 1];
    const topCenter = topBlock.offset;
    const currentCenter = position;
    const overlap = Math.abs(currentCenter - topCenter);
    const maxOverlap = (topBlock.width + currentBlock.width) / 2;

    if (overlap >= maxOverlap) {
      // Missed completely
      setGameState("finished");
      return;
    }

    const newWidth = Math.max(0, Math.min(topBlock.width, currentBlock.width) - overlap * 1.5);
    const isPerfect = overlap < 8;

    if (isPerfect) {
      setPerfectStreak(p => p + 1);
    } else {
      setPerfectStreak(0);
    }

    const newBlock: StackedBlock = {
      ...currentBlock,
      width: isPerfect ? topBlock.width : newWidth,
      offset: isPerfect ? topCenter : (currentCenter + topCenter) / 2,
      perfect: isPerfect,
    };

    const newStack = [...stack, newBlock];
    setStack(newStack);
    setScore(p => p + 1);
    setDonated(p => p + (isPerfect ? 2 : 1));
    setXpEarned(p => p + (isPerfect ? 150 : 100));

    const newSpeed = Math.min(6, 2 + newStack.length * 0.15);
    setSpeed(newSpeed);

    const nextBlock = generateBlock(isPerfect ? newBlock.width : Math.max(60, newBlock.width - 10));
    setCurrentBlock(nextBlock);
    setPosition(0);
    setDirection(1);
  }, [gameState, currentBlock, stack, position, generateBlock]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowDown") { e.preventDefault(); dropBlock(); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [dropBlock]);

  const visibleStack = stack.slice(-8);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur px-4 py-3 flex items-center gap-3">
        <Link href="/gaming-for-charity">
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground"><ChevronLeft className="h-4 w-4" />Back</Button>
        </Link>
        <span className="text-lg">🏗️</span>
        <span className="font-bold text-sm">Block Builder</span>
        <Badge variant="outline" className="text-purple-400 border-purple-500/30 text-xs">Puzzle</Badge>
        <div className="flex-1" />
        {gameState === "playing" && (
          <div className="flex items-center gap-2">
            {perfectStreak >= 2 && <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">✨ {perfectStreak} perfect!</Badge>}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/10 border border-purple-500/20">
              <Heart className="h-3.5 w-3.5 text-purple-400" />
              <span className="text-xs font-bold text-purple-400">{donated} SKY444</span>
            </div>
          </div>
        )}
      </div>

      <div className="container max-w-lg py-8 flex flex-col items-center">
        {gameState === "idle" && (
          <div className="text-center">
            <div className="text-7xl mb-6">🏗️</div>
            <h1 className="text-3xl font-bold mb-3">Block Builder</h1>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">Stack blockchain blocks as high as possible! Tap or press Space to drop each block. Perfect drops keep the full width. Each block = 1 SKY444 donated to Hunger Relief.</p>
            <div className="grid grid-cols-3 gap-4 mb-8 max-w-xs mx-auto">
              {[{ label: "Perfect Drop", value: "+2 SKY444" }, { label: "Normal Drop", value: "+1 SKY444" }, { label: "Miss", value: "Game Over" }].map(s => (
                <div key={s.label} className="rounded-xl border border-border/50 bg-card/30 p-3 text-center">
                  <p className="text-sm font-bold text-purple-400">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
            <Button onClick={startGame} className="bg-purple-500 hover:bg-purple-600 text-white gap-2 h-12 px-8 text-base">
              <Zap className="h-5 w-5" />Start Building!
            </Button>
          </div>
        )}

        {gameState === "playing" && (
          <div className="w-full flex flex-col items-center" onClick={dropBlock}>
            <div className="flex items-center justify-between w-full max-w-xs mb-4">
              <div className="text-center"><p className="text-2xl font-bold text-purple-400">{score}</p><p className="text-xs text-muted-foreground">Blocks</p></div>
              <div className="text-center"><p className="text-2xl font-bold text-yellow-400">{xpEarned}</p><p className="text-xs text-muted-foreground">XP</p></div>
              <div className="text-center"><p className="text-2xl font-bold text-purple-400">{donated}</p><p className="text-xs text-muted-foreground">Donated</p></div>
            </div>

            {/* Game Area */}
            <div className="relative bg-gradient-to-b from-zinc-950 to-zinc-900 rounded-2xl border border-border/50 overflow-hidden cursor-pointer select-none" style={{ width: 320, height: 420 }}>
              {/* Moving block */}
              {currentBlock && (
                <div className={`absolute top-4 h-10 rounded-md flex items-center justify-center text-white text-xs font-bold transition-none ${currentBlock.color}`}
                  style={{ width: currentBlock.width, left: `calc(50% + ${position}px - ${currentBlock.width / 2}px)` }}>
                  {currentBlock.label}
                </div>
              )}

              {/* Stack */}
              <div className="absolute bottom-0 left-0 right-0 flex flex-col-reverse items-center pb-0">
                {visibleStack.map((block, i) => (
                  <div key={block.id} className={`h-10 rounded-md flex items-center justify-center text-white text-xs font-bold mb-0.5 transition-all ${block.color} ${block.perfect ? "ring-2 ring-yellow-400/50" : ""}`}
                    style={{ width: block.width, marginLeft: block.offset }}>
                    {block.label}
                  </div>
                ))}
              </div>

              {/* Tap hint */}
              <div className="absolute bottom-4 right-4 text-xs text-white/30">TAP TO DROP</div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">Tap anywhere or press Space to drop!</p>
          </div>
        )}

        {gameState === "finished" && (
          <div className="text-center w-full">
            <div className="text-6xl mb-4">{score >= 15 ? "🏆" : score >= 8 ? "🥈" : "🏗️"}</div>
            <h2 className="text-3xl font-bold mb-2">{score >= 15 ? "Master Builder!" : score >= 8 ? "Good Stack!" : "Keep Practicing!"}</h2>
            <p className="text-muted-foreground mb-6">{score} blocks stacked</p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: "Blocks", value: score.toString(), color: "text-purple-400" },
                { label: "XP Earned", value: `+${xpEarned}`, color: "text-yellow-400" },
                { label: "Donated", value: `${donated} SKY444`, color: "text-purple-400" },
              ].map(s => (
                <div key={s.label} className="rounded-xl border border-border/50 bg-card/30 p-3 text-center">
                  <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-purple-500/30 bg-purple-600/5 p-4 mb-6">
              <p className="text-sm font-semibold text-purple-400 mb-1">🍎 Hunger Relief</p>
              <p className="text-xs text-muted-foreground">{donated} SKY444 donated to fight hunger!</p>
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
