import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

type Suit = "♠"|"♥"|"♦"|"♣";
type Rank = "A"|"2"|"3"|"4"|"5"|"6"|"7"|"8"|"9"|"10"|"J"|"Q"|"K";
type Card = { rank: Rank; suit: Suit; hidden: boolean };
type GamePhase = "betting"|"playing"|"dealer"|"result";

const SUITS: Suit[] = ["♠","♥","♦","♣"];
const RANKS: Rank[] = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];

function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) for (const rank of RANKS) deck.push({ rank, suit, hidden: false });
  return deck.sort(() => Math.random() - 0.5);
}

function cardValue(card: Card): number {
  if (["J","Q","K"].includes(card.rank)) return 10;
  if (card.rank === "A") return 11;
  return parseInt(card.rank);
}

function handValue(hand: Card[]): number {
  let total = hand.filter(c => !c.hidden).reduce((s, c) => s + cardValue(c), 0);
  let aces = hand.filter(c => !c.hidden && c.rank === "A").length;
  while (total > 21 && aces > 0) { total -= 10; aces--; }
  return total;
}

function CardDisplay({ card }: { card: Card }) {
  const isRed = card.suit === "♥" || card.suit === "♦";
  if (card.hidden) {
    return (
      <div className="w-16 h-24 rounded-xl bg-gradient-to-br from-blue-900 to-blue-800 border border-blue-700 flex items-center justify-center shadow-lg">
        <span className="text-2xl">🂠</span>
      </div>
    );
  }
  return (
    <div className={`w-16 h-24 rounded-xl bg-white border-2 ${isRed ? "border-red-200" : "border-slate-200"} flex flex-col items-center justify-center shadow-lg`}>
      <span className={`text-lg font-black leading-none ${isRed ? "text-red-600" : "text-slate-900"}`}>{card.rank}</span>
      <span className={`text-xl leading-none ${isRed ? "text-red-600" : "text-slate-900"}`}>{card.suit}</span>
    </div>
  );
}

export default function GameBlackjack() {
  const [deck, setDeck] = useState<Card[]>(createDeck());
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [splitHand, setSplitHand] = useState<Card[]>([]);
  const [phase, setPhase] = useState<GamePhase>("betting");
  const [bet, setBet] = useState("25");
  const [balance, setBalance] = useState(1000);
  const [result, setResult] = useState("");
  const [canDouble, setCanDouble] = useState(false);
  const [canSplit, setCanSplit] = useState(false);
  const [activeHand, setActiveHand] = useState<"main"|"split">("main");
  const [stats, setStats] = useState({ wins: 0, losses: 0, pushes: 0 });

  const drawCard = (d: Card[], hidden = false): [Card, Card[]] => {
    const card = { ...d[0], hidden };
    return [card, d.slice(1)];
  };

  const deal = () => {
    const betAmt = parseFloat(bet);
    if (isNaN(betAmt) || betAmt <= 0) { toast.error("Invalid bet"); return; }
    if (betAmt > balance) { toast.error("Insufficient balance"); return; }
    let d = [...deck];
    const [p1, d1] = drawCard(d); d = d1;
    const [dealer1, d2] = drawCard(d); d = d2;
    const [p2, d3] = drawCard(d); d = d3;
    const [dealer2, d4] = drawCard(d, true); d = d4;
    const ph = [p1, p2];
    const dh = [dealer1, dealer2];
    setPlayerHand(ph);
    setDealerHand(dh);
    setSplitHand([]);
    setDeck(d);
    setBalance(b => b - betAmt);
    setResult("");
    setActiveHand("main");
    setCanDouble(betAmt <= balance - betAmt);
    setCanSplit(p1.rank === p2.rank && betAmt <= balance - betAmt);
    // Check blackjack
    if (handValue(ph) === 21) {
      revealAndSettle(ph, dh, d, betAmt, true);
    } else {
      setPhase("playing");
    }
  };

  const hit = () => {
    let d = [...deck];
    const [card, nd] = drawCard(d); d = nd;
    setDeck(d);
    const newHand = activeHand === "main" ? [...playerHand, card] : [...splitHand, card];
    if (activeHand === "main") setPlayerHand(newHand);
    else setSplitHand(newHand);
    setCanDouble(false);
    setCanSplit(false);
    if (handValue(newHand) > 21) {
      if (activeHand === "main" && splitHand.length > 0) {
        setActiveHand("split");
      } else {
        settleGame(newHand, dealerHand, d, parseFloat(bet));
      }
    }
  };

  const stand = () => {
    if (activeHand === "main" && splitHand.length > 0) {
      setActiveHand("split");
    } else {
      dealerPlay();
    }
  };

  const double = () => {
    const betAmt = parseFloat(bet);
    setBalance(b => b - betAmt);
    let d = [...deck];
    const [card, nd] = drawCard(d); d = nd;
    setDeck(d);
    const newHand = [...playerHand, card];
    setPlayerHand(newHand);
    setCanDouble(false);
    setCanSplit(false);
    if (handValue(newHand) > 21) {
      settleGame(newHand, dealerHand, d, betAmt * 2);
    } else {
      dealerPlayWith(newHand, dealerHand, d, betAmt * 2);
    }
  };

  const split = () => {
    const betAmt = parseFloat(bet);
    setBalance(b => b - betAmt);
    const [c1, c2] = playerHand;
    let d = [...deck];
    const [nc1, d1] = drawCard(d); d = d1;
    const [nc2, d2] = drawCard(d); d = d2;
    setPlayerHand([c1, nc1]);
    setSplitHand([c2, nc2]);
    setDeck(d);
    setCanSplit(false);
    setCanDouble(false);
    setActiveHand("main");
  };

  const dealerPlay = () => {
    dealerPlayWith(playerHand, dealerHand, deck, parseFloat(bet));
  };

  const dealerPlayWith = (ph: Card[], dh: Card[], d: Card[], betAmt: number) => {
    setPhase("dealer");
    const revealed = dh.map(c => ({ ...c, hidden: false }));
    let currentDh = revealed;
    let currentD = d;
    while (handValue(currentDh) < 17) {
      const [card, nd] = drawCard(currentD);
      currentDh = [...currentDh, card];
      currentD = nd;
    }
    setDealerHand(currentDh);
    setDeck(currentD);
    settleGame(ph, currentDh, currentD, betAmt);
  };

  const revealAndSettle = (ph: Card[], dh: Card[], d: Card[], betAmt: number, isBlackjack: boolean) => {
    const revealed = dh.map(c => ({ ...c, hidden: false }));
    setDealerHand(revealed);
    if (isBlackjack && handValue(ph) === 21) {
      const dealerBJ = handValue(revealed) === 21;
      if (dealerBJ) {
        setResult("Push — Both Blackjack!");
        setBalance(b => b + betAmt);
        setStats(s => ({ ...s, pushes: s.pushes + 1 }));
      } else {
        const winnings = betAmt * 2.5;
        setResult(`Blackjack! +${winnings} SKY444`);
        setBalance(b => b + winnings);
        setStats(s => ({ ...s, wins: s.wins + 1 }));
        toast.success(`🃏 Blackjack! +${winnings} SKY444`);
      }
      setPhase("result");
    }
  };

  const settleGame = (ph: Card[], dh: Card[], _d: Card[], betAmt: number) => {
    const pv = handValue(ph);
    const dv = handValue(dh.map(c => ({ ...c, hidden: false })));
    const revealedDh = dh.map(c => ({ ...c, hidden: false }));
    setDealerHand(revealedDh);
    let msg = "";
    if (pv > 21) {
      msg = `Bust! Lost ${betAmt} SKY444`;
      setStats(s => ({ ...s, losses: s.losses + 1 }));
    } else if (dv > 21 || pv > dv) {
      const win = betAmt * 2;
      setBalance(b => b + win);
      msg = `You Win! +${win} SKY444`;
      setStats(s => ({ ...s, wins: s.wins + 1 }));
      toast.success(`+${win} SKY444`);
    } else if (pv === dv) {
      setBalance(b => b + betAmt);
      msg = "Push — Bet returned";
      setStats(s => ({ ...s, pushes: s.pushes + 1 }));
    } else {
      msg = `Dealer Wins. Lost ${betAmt} SKY444`;
      setStats(s => ({ ...s, losses: s.losses + 1 }));
    }
    setResult(msg);
    setPhase("result");
  };

  const newGame = () => {
    if (deck.length < 20) setDeck(createDeck());
    setPlayerHand([]);
    setDealerHand([]);
    setSplitHand([]);
    setResult("");
    setPhase("betting");
    setCanDouble(false);
    setCanSplit(false);
  };

  const pv = handValue(playerHand);
  const dv = handValue(dealerHand.filter(c => !c.hidden));

  return (
    <div className="min-h-screen bg-[#07050f] text-white p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">♠ BLACKJACK</h1>
          <p className="text-slate-500 text-sm mt-1">Standard Rules · Split · Double Down · SKY444 Chips</p>
        </div>

        {/* Stats */}
        <div className="flex gap-3 justify-center mb-4">
          <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-center">
            <p className="text-xs text-slate-500">Balance</p>
            <p className="text-yellow-400 font-bold">{balance.toFixed(0)} SKY</p>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2 text-center">
            <p className="text-xs text-green-500">Wins</p>
            <p className="text-green-400 font-bold">{stats.wins}</p>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2 text-center">
            <p className="text-xs text-red-500">Losses</p>
            <p className="text-red-400 font-bold">{stats.losses}</p>
          </div>
          <div className="bg-slate-500/10 border border-slate-500/20 rounded-lg px-4 py-2 text-center">
            <p className="text-xs text-slate-500">Pushes</p>
            <p className="text-slate-400 font-bold">{stats.pushes}</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-gradient-to-b from-green-900/40 to-green-950/60 border border-green-800/30 rounded-3xl p-6 mb-4 min-h-[400px] flex flex-col justify-between">
          {/* Dealer */}
          <div>
            <p className="text-xs text-green-400/70 mb-2 font-semibold">DEALER {phase !== "betting" && dealerHand.length > 0 && `(${dv})`}</p>
            <div className="flex gap-2 flex-wrap">
              {dealerHand.map((card, i) => <CardDisplay key={i} card={card} />)}
            </div>
          </div>

          {/* Result */}
          {result && (
            <div className={`text-center py-3 px-4 rounded-xl font-bold text-lg ${result.includes("Win") || result.includes("Blackjack") ? "bg-green-500/20 text-green-300" : result.includes("Push") ? "bg-slate-500/20 text-slate-300" : "bg-red-500/20 text-red-300"}`}>
              {result}
            </div>
          )}

          {/* Player */}
          <div>
            {splitHand.length > 0 && (
              <div className="mb-3">
                <p className={`text-xs mb-2 font-semibold ${activeHand === "split" ? "text-yellow-400" : "text-slate-500"}`}>SPLIT HAND ({handValue(splitHand)}) {activeHand === "split" && "← Active"}</p>
                <div className="flex gap-2 flex-wrap">
                  {splitHand.map((card, i) => <CardDisplay key={i} card={card} />)}
                </div>
              </div>
            )}
            <p className={`text-xs mb-2 font-semibold ${activeHand === "main" && phase === "playing" ? "text-yellow-400" : "text-slate-500"}`}>
              YOUR HAND {phase !== "betting" && playerHand.length > 0 && `(${pv})`} {pv > 21 && "— BUST"} {activeHand === "main" && splitHand.length > 0 && "← Active"}
            </p>
            <div className="flex gap-2 flex-wrap">
              {playerHand.map((card, i) => <CardDisplay key={i} card={card} />)}
            </div>
          </div>
        </div>

        {/* Controls */}
        {phase === "betting" && (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Bet Amount (SKY444)</label>
              <div className="flex gap-2">
                <Input value={bet} onChange={e => setBet(e.target.value)} className="bg-white/5 border-white/10 text-white text-center font-bold" />
                {[10,25,50,100,250].map(amt => (
                  <Button key={amt} size="sm" variant="outline" className="border-white/10 text-slate-400 text-xs" onClick={() => setBet(String(amt))}>{amt}</Button>
                ))}
              </div>
            </div>
            <Button className="w-full h-12 text-lg font-black bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black" onClick={deal}>
              Deal Cards
            </Button>
          </div>
        )}

        {phase === "playing" && (
          <div className="grid grid-cols-2 gap-2">
            <Button className="h-12 font-bold bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30" onClick={hit}>Hit</Button>
            <Button className="h-12 font-bold bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30" onClick={stand}>Stand</Button>
            {canDouble && <Button className="h-12 font-bold bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/30" onClick={double}>Double Down</Button>}
            {canSplit && <Button className="h-12 font-bold bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30" onClick={split}>Split</Button>}
          </div>
        )}

        {phase === "result" && (
          <Button className="w-full h-12 font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-black" onClick={newGame}>
            New Hand
          </Button>
        )}

        <div className="mt-3 p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg flex items-start gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-yellow-500 shrink-0 mt-0.5" />
          <p className="text-[10px] text-yellow-600">Standard Blackjack rules. House edge ~0.5%. SKY444 is a platform token, not real currency. Play responsibly.</p>
        </div>
      </div>
    </div>
  );
}
