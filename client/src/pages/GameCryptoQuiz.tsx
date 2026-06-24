import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Clock, Heart, Trophy, Zap, CheckCircle2, XCircle, ArrowRight, RotateCcw } from "lucide-react";

const QUESTIONS = [
  { q: "What does 'DeFi' stand for?", options: ["Decentralized Finance", "Digital Finance", "Defined Finance", "Distributed Finance"], answer: 0, xp: 100 },
  { q: "Which consensus mechanism does Ethereum currently use?", options: ["Proof of Work", "Proof of Stake", "Delegated PoS", "Proof of Authority"], answer: 1, xp: 150 },
  { q: "What is a 'smart contract'?", options: ["A legal document", "Self-executing code on blockchain", "A crypto wallet", "A trading bot"], answer: 1, xp: 100 },
  { q: "What does 'NFT' stand for?", options: ["New Financial Token", "Non-Fungible Token", "Network File Transfer", "Null Function Type"], answer: 1, xp: 100 },
  { q: "What is the maximum supply of Bitcoin?", options: ["18 million", "21 million", "100 million", "Unlimited"], answer: 1, xp: 150 },
  { q: "What is 'gas' in Ethereum?", options: ["A cryptocurrency", "Fee for transactions", "A mining reward", "A wallet type"], answer: 1, xp: 150 },
  { q: "What is a 'DAO'?", options: ["Digital Asset Organization", "Decentralized Autonomous Organization", "Direct Access Order", "Distributed App Operator"], answer: 1, xp: 200 },
  { q: "What is 'staking' in crypto?", options: ["Selling tokens", "Locking tokens to earn rewards", "Mining new coins", "Trading on DEX"], answer: 1, xp: 150 },
  { q: "What does 'HODL' mean in crypto culture?", options: ["Hold On for Dear Life", "High Order Digital Ledger", "Hash Output Data Layer", "Hybrid On-chain DeFi Liquidity"], answer: 0, xp: 100 },
  { q: "What is a 'seed phrase'?", options: ["A farming NFT", "Recovery words for a wallet", "A new token launch", "A staking reward"], answer: 1, xp: 200 },
];

type GameState = "idle" | "playing" | "answered" | "finished";

export default function GameCryptoQuiz() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [donated, setDonated] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [streak, setStreak] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);

  const question = QUESTIONS[currentQ];

  useEffect(() => {
    if (gameState !== "playing") return;
    if (timeLeft <= 0) { handleAnswer(-1); return; }
    const t = setTimeout(() => setTimeLeft(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, gameState]);

  const handleAnswer = useCallback((idx: number) => {
    if (gameState !== "playing") return;
    setSelected(idx);
    setGameState("answered");
    const correct = idx === question.answer;
    const newResults = [...results, correct];
    setResults(newResults);
    if (correct) {
      const bonus = streak >= 2 ? 1.5 : 1;
      const xp = Math.round(question.xp * bonus);
      setScore(p => p + 1);
      setXpEarned(p => p + xp);
      setDonated(p => p + Math.round(xp * 0.1));
      setStreak(p => p + 1);
    } else {
      setStreak(0);
    }
    setTimeout(() => {
      if (currentQ + 1 >= QUESTIONS.length) {
        setGameState("finished");
      } else {
        setCurrentQ(p => p + 1);
        setSelected(null);
        setTimeLeft(20);
        setGameState("playing");
      }
    }, 1200);
  }, [gameState, question, currentQ, results, streak]);

  const startGame = () => {
    setGameState("playing");
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setXpEarned(0);
    setDonated(0);
    setTimeLeft(20);
    setStreak(0);
    setResults([]);
  };

  const accuracy = results.length > 0 ? Math.round((results.filter(Boolean).length / results.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur px-4 py-3 flex items-center gap-3">
        <Link href="/gaming-for-charity">
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground"><ChevronLeft className="h-4 w-4" />Back</Button>
        </Link>
        <span className="text-lg">🧠</span>
        <span className="font-bold text-sm">Crypto Quiz Blitz</span>
        <Badge variant="outline" className="text-blue-400 border-blue-500/30 text-xs">Quiz</Badge>
        <div className="flex-1" />
        {gameState === "playing" && (
          <div className="flex items-center gap-3">
            {streak >= 2 && <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs">🔥 {streak}x streak</Badge>}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/10 border border-purple-500/20">
              <Heart className="h-3.5 w-3.5 text-purple-400" />
              <span className="text-xs font-bold text-purple-400">{donated} SKY444</span>
            </div>
          </div>
        )}
      </div>

      <div className="container max-w-2xl py-10">
        {gameState === "idle" && (
          <div className="text-center">
            <div className="text-7xl mb-6">🧠</div>
            <h1 className="text-3xl font-bold mb-3">Crypto Quiz Blitz</h1>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">Answer 10 blockchain questions. Every correct answer donates SKY444 to the Education Fund. You have 20 seconds per question.</p>
            <div className="grid grid-cols-3 gap-4 mb-8 max-w-sm mx-auto">
              {[
                { label: "Questions", value: "10" },
                { label: "Time/Q", value: "20s" },
                { label: "Max XP", value: "1,500" },
              ].map(s => (
                <div key={s.label} className="rounded-xl border border-border/50 bg-card/30 p-3 text-center">
                  <p className="text-xl font-bold text-primary">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
            <Button onClick={startGame} className="bg-blue-500 hover:bg-blue-600 text-white gap-2 h-12 px-8 text-base">
              <Zap className="h-5 w-5" />Start Quiz
            </Button>
          </div>
        )}

        {(gameState === "playing" || gameState === "answered") && (
          <div>
            {/* Progress */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm text-muted-foreground font-mono">{currentQ + 1}/{QUESTIONS.length}</span>
              <Progress value={((currentQ) / QUESTIONS.length) * 100} className="flex-1 h-2" />
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold transition-colors ${timeLeft <= 5 ? "bg-red-500/20 text-red-400" : "bg-card/50 text-foreground"}`}>
                <Clock className="h-3.5 w-3.5" />{timeLeft}s
              </div>
            </div>

            {/* Question */}
            <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 p-6 mb-6">
              <p className="text-lg font-bold leading-relaxed">{question.q}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs text-yellow-400 border-yellow-500/30">+{question.xp} XP</Badge>
                {streak >= 2 && <Badge variant="outline" className="text-xs text-orange-400 border-orange-500/30">🔥 1.5x bonus</Badge>}
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((opt, i) => {
                let style = "border-border/50 bg-card/30 hover:border-blue-500/50 hover:bg-blue-500/5";
                if (gameState === "answered") {
                  if (i === question.answer) style = "border-purple-500/50 bg-purple-600/10 text-purple-400";
                  else if (i === selected && selected !== question.answer) style = "border-red-500/50 bg-red-500/10 text-red-400";
                  else style = "border-border/30 bg-card/20 opacity-50";
                } else if (selected === i) {
                  style = "border-blue-500/50 bg-blue-500/10";
                }
                return (
                  <button key={i} onClick={() => handleAnswer(i)} disabled={gameState === "answered"} className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${style}`}>
                    <span className="w-7 h-7 rounded-full border border-current/30 flex items-center justify-center text-sm font-bold shrink-0">{String.fromCharCode(65 + i)}</span>
                    <span className="text-sm font-medium">{opt}</span>
                    {gameState === "answered" && i === question.answer && <CheckCircle2 className="h-4 w-4 text-purple-400 ml-auto" />}
                    {gameState === "answered" && i === selected && selected !== question.answer && <XCircle className="h-4 w-4 text-red-400 ml-auto" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {gameState === "finished" && (
          <div className="text-center">
            <div className="text-6xl mb-4">{score >= 8 ? "🏆" : score >= 5 ? "🥈" : "🎮"}</div>
            <h2 className="text-3xl font-bold mb-2">{score >= 8 ? "Excellent!" : score >= 5 ? "Good Job!" : "Keep Learning!"}</h2>
            <p className="text-muted-foreground mb-6">{score}/{QUESTIONS.length} correct · {accuracy}% accuracy</p>

            <div className="grid grid-cols-3 gap-4 mb-8 max-w-sm mx-auto">
              {[
                { label: "Score", value: `${score}/${QUESTIONS.length}`, color: "text-blue-400" },
                { label: "XP Earned", value: `+${xpEarned}`, color: "text-yellow-400" },
                { label: "Donated", value: `${donated} SKY444`, color: "text-purple-400" },
              ].map(s => (
                <div key={s.label} className="rounded-xl border border-border/50 bg-card/30 p-3 text-center">
                  <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-purple-500/30 bg-purple-600/5 p-4 mb-6 max-w-sm mx-auto">
              <p className="text-sm font-semibold text-purple-400 mb-1">📚 Education Fund</p>
              <p className="text-xs text-muted-foreground">{donated} SKY444 has been donated on your behalf!</p>
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
