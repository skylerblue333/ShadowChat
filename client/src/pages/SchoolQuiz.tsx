import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Clock, Trophy, Zap, ArrowRight, RotateCcw } from "lucide-react";

const QUESTIONS = [
  { q: "What is the primary purpose of a cryptographic hash function in blockchain?", options: ["Encrypt data for privacy", "Create a fixed-size fingerprint of data", "Sign transactions with private keys", "Compress data for storage"], correct: 1, explanation: "Hash functions create a fixed-size output (digest) from any input. In blockchain, this ensures data integrity — any change to the data produces a completely different hash." },
  { q: "Which consensus mechanism does Bitcoin use?", options: ["Proof of Stake", "Delegated Proof of Stake", "Proof of Work", "Proof of Authority"], correct: 2, explanation: "Bitcoin uses Proof of Work (PoW), where miners compete to solve computationally expensive puzzles to add new blocks to the chain." },
  { q: "What is a smart contract?", options: ["A legal document stored on blockchain", "Self-executing code stored on a blockchain", "A type of cryptocurrency wallet", "A centralized database contract"], correct: 1, explanation: "Smart contracts are self-executing programs stored on a blockchain that automatically enforce and execute the terms of an agreement when predefined conditions are met." },
  { q: "What does 'immutability' mean in the context of blockchain?", options: ["Data can be easily modified", "Data cannot be changed once recorded", "Data is encrypted at rest", "Data is replicated across nodes"], correct: 1, explanation: "Immutability means that once data is written to a blockchain, it cannot be altered or deleted. This is achieved through cryptographic linking of blocks." },
  { q: "What is the Ethereum Virtual Machine (EVM)?", options: ["A cloud server running Ethereum", "A hardware wallet for ETH", "A sandboxed runtime for executing smart contracts", "Ethereum's mining algorithm"], correct: 2, explanation: "The EVM is a sandboxed virtual machine that executes smart contract bytecode. It's deterministic and isolated, ensuring consistent execution across all nodes." },
  { q: "What is a 51% attack?", options: ["Attacking 51% of user wallets", "When one entity controls majority of network hash rate", "A type of smart contract vulnerability", "Stealing 51% of a token supply"], correct: 1, explanation: "A 51% attack occurs when a single entity gains control of more than 50% of a blockchain's mining power, potentially allowing them to manipulate transactions." },
  { q: "What is gas in Ethereum?", options: ["The native currency of Ethereum", "A fee paid for computational work on the network", "A type of smart contract", "The block reward for miners"], correct: 1, explanation: "Gas is the unit that measures computational effort required to execute operations on Ethereum. Users pay gas fees (in ETH) to compensate validators for processing transactions." },
  { q: "What is a private key in cryptocurrency?", options: ["A password for an exchange account", "A secret number that proves ownership of funds", "A public identifier for receiving funds", "A key used to encrypt blockchain data"], correct: 1, explanation: "A private key is a secret cryptographic number that proves ownership of a cryptocurrency address. Anyone with your private key has full control of your funds." },
  { q: "What is DeFi?", options: ["Decentralized Finance — financial services without intermediaries", "Digital Finance — finance using digital currencies only", "Deferred Finance — delayed payment systems", "Distributed Finance — finance across multiple banks"], correct: 0, explanation: "DeFi (Decentralized Finance) refers to financial services and applications built on blockchain that operate without traditional intermediaries like banks." },
  { q: "What is a blockchain fork?", options: ["A copy of a blockchain for testing", "A change to the blockchain protocol", "A type of wallet backup", "A method of mining blocks faster"], correct: 1, explanation: "A fork is a change to the blockchain protocol. Soft forks are backward-compatible changes; hard forks create a permanent divergence in the blockchain, potentially creating two separate chains." },
];

export default function SchoolQuiz() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    if (finished) return;
    const t = setInterval(() => setTimeLeft(p => { if (p <= 1) { setFinished(true); return 0; } return p - 1; }), 1000);
    return () => clearInterval(t);
  }, [finished]);

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const correct = idx === QUESTIONS[current].correct;
    if (correct) setScore(s => s + 1);
    setAnswers(a => [...a, correct]);
  };

  const handleNext = () => {
    if (current + 1 >= QUESTIONS.length) { setFinished(true); return; }
    setCurrent(c => c + 1);
    setSelected(null);
    setAnswered(false);
  };

  const handleRetry = () => { setCurrent(0); setSelected(null); setAnswered(false); setScore(0); setAnswers([]); setFinished(false); setTimeLeft(600); };

  const pct = Math.round((score / QUESTIONS.length) * 100);
  const passed = pct >= 70;
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  if (finished) return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className={`rounded-2xl border p-8 text-center ${passed ? "border-purple-500/30 bg-purple-600/5" : "border-red-500/30 bg-red-500/5"}`}>
          <div className="text-6xl mb-4">{passed ? "🏆" : "📚"}</div>
          <div className={`text-5xl font-bold mb-2 ${passed ? "text-purple-400" : "text-red-400"}`}>{pct}%</div>
          <div className={`text-lg font-semibold mb-1 ${passed ? "text-purple-400" : "text-red-400"}`}>{passed ? "Quiz Passed!" : "Keep Studying"}</div>
          <p className="text-muted-foreground text-sm mb-6">{score}/{QUESTIONS.length} correct answers</p>
          {passed && <div className="flex items-center justify-center gap-2 text-yellow-400 text-sm font-medium mb-6"><Zap className="h-4 w-4" />+200 XP Earned!</div>}
          <div className="grid grid-cols-10 gap-1 mb-6">
            {answers.map((a, i) => <div key={i} className={`h-2 rounded-full ${a ? "bg-purple-600" : "bg-red-500"}`} />)}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 gap-2" onClick={handleRetry}><RotateCcw className="h-4 w-4" />Retry</Button>
            <Link href="/school/lesson/8" className="flex-1">
              <Button className="w-full bg-primary text-primary-foreground gap-2">Continue<ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  const q = QUESTIONS[current];
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/50 bg-card/30 px-4 py-3">
        <div className="container max-w-2xl flex items-center justify-between">
          <span className="text-sm font-medium">Blockchain Fundamentals — Module Quiz</span>
          <div className="flex items-center gap-4">
            <span className={`flex items-center gap-1 text-sm font-mono ${timeLeft < 60 ? "text-red-400 animate-pulse" : "text-muted-foreground"}`}><Clock className="h-4 w-4" />{mins}:{secs.toString().padStart(2, "0")}</span>
            <span className="text-sm text-muted-foreground">Q {current + 1}/{QUESTIONS.length}</span>
          </div>
        </div>
      </div>
      <div className="container max-w-2xl py-8">
        <Progress value={((current + (answered ? 1 : 0)) / QUESTIONS.length) * 100} className="mb-8 h-2" />
        <div className="rounded-2xl border border-border/50 bg-card/30 p-6 md:p-8 mb-6">
          <p className="text-lg font-semibold mb-6">{q.q}</p>
          <div className="space-y-3">
            {q.options.map((opt, i) => {
              let cls = "rounded-xl border p-4 cursor-pointer transition-all text-sm ";
              if (!answered) cls += "border-border/50 bg-card/20 hover:border-primary/50 hover:bg-primary/5";
              else if (i === q.correct) cls += "border-purple-500/50 bg-purple-600/10 text-purple-400";
              else if (i === selected && i !== q.correct) cls += "border-red-500/50 bg-red-500/10 text-red-400";
              else cls += "border-border/30 bg-card/10 text-muted-foreground";
              return (
                <div key={i} className={cls} onClick={() => handleSelect(i)}>
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 ${!answered ? "border-border/50" : i === q.correct ? "border-purple-500 bg-purple-600/20" : i === selected ? "border-red-500 bg-red-500/20" : "border-border/30"}`}>
                      {answered && i === q.correct ? <CheckCircle2 className="h-3.5 w-3.5 text-purple-400" /> : answered && i === selected && i !== q.correct ? <XCircle className="h-3.5 w-3.5 text-red-400" /> : String.fromCharCode(65 + i)}
                    </div>
                    {opt}
                  </div>
                </div>
              );
            })}
          </div>
          {answered && <div className="mt-4 p-4 rounded-xl bg-card/50 border border-border/30 text-sm text-muted-foreground"><strong className="text-foreground">Explanation: </strong>{q.explanation}</div>}
        </div>
        {answered && <div className="flex justify-end"><Button className="bg-primary text-primary-foreground gap-2" onClick={handleNext}>{current + 1 >= QUESTIONS.length ? "See Results" : "Next Question"}<ArrowRight className="h-4 w-4" /></Button></div>}
      </div>
    </div>
  );
}
