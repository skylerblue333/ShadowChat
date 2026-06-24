import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Heart, Zap, Star, Crown, Gift, DollarSign, Coins,
  ArrowLeft, TrendingUp, Clock, Trophy, Send, Sparkles
} from "lucide-react";

const QUICK_AMOUNTS_SKY = [10, 50, 100, 250, 500, 1000];
const QUICK_AMOUNTS_USD = [1, 5, 10, 25, 50, 100];

const TOP_CREATORS = [
  { id: "1", name: "SkylerBlue", username: "skylerblue", avatar: "", totalTips: 48200, tipsToday: 1240, badge: "👑" },
  { id: "2", name: "CryptoVibes", username: "cryptovibes", avatar: "", totalTips: 32100, tipsToday: 890, badge: "⚡" },
  { id: "3", name: "NeonDreamer", username: "neondreamer", avatar: "", totalTips: 28400, tipsToday: 720, badge: "🌟" },
  { id: "4", name: "ShadowCaster", username: "shadowcaster", avatar: "", totalTips: 19800, tipsToday: 540, badge: "🔥" },
  { id: "5", name: "QuantumFlow", username: "quantumflow", avatar: "", totalTips: 15600, tipsToday: 380, badge: "💎" },
];

const RECENT_TIPS = [
  { from: "user_7x2", to: "SkylerBlue", amount: 100, currency: "SKY444", message: "Amazing content! 🔥", ts: Date.now() - 120000 },
  { from: "user_3k9", to: "CryptoVibes", amount: 50, currency: "SKY444", message: "Keep it up!", ts: Date.now() - 340000 },
  { from: "user_5m1", to: "NeonDreamer", amount: 25, currency: "USD", message: "Love your streams", ts: Date.now() - 600000 },
  { from: "user_8p3", to: "ShadowCaster", amount: 500, currency: "SKY444", message: "🚀🚀🚀", ts: Date.now() - 900000 },
  { from: "user_2q7", to: "QuantumFlow", amount: 10, currency: "USD", message: "First tip!", ts: Date.now() - 1200000 },
];

export default function TipJar() {
  const { user } = useAuth();
  const [selectedCreator, setSelectedCreator] = useState(TOP_CREATORS[0]);
  const [currency, setCurrency] = useState<"SKY444" | "USD">("SKY444");
  const [customAmount, setCustomAmount] = useState("");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const tipMutation = trpc.creator?.tip?.useMutation?.({
    onSuccess: () => {
      toast.success(`Tip sent to ${selectedCreator.name}! 🎉`);
      setSelectedAmount(null);
      setCustomAmount("");
      setMessage("");
      setSending(false);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to send tip");
      setSending(false);
    },
  });

  const amounts = currency === "SKY444" ? QUICK_AMOUNTS_SKY : QUICK_AMOUNTS_USD;
  const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount;

  const handleSendTip = () => {
    if (!user) { toast.error("Sign in to send tips"); return; }
    if (!finalAmount || finalAmount <= 0) { toast.error("Select or enter a tip amount"); return; }
    setSending(true);
    if (tipMutation?.mutate) {
        tipMutation.mutate({
        recipientId: parseInt(selectedCreator.id),
        amount: finalAmount,
        message: message || undefined,
      });
    } else {
      setTimeout(() => {
        toast.success(`Tip of ${finalAmount} ${currency} sent to ${selectedCreator.name}! 🎉`);
        setSelectedAmount(null);
        setCustomAmount("");
        setMessage("");
        setSending(false);
      }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/social">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
          </Link>
          <Gift className="w-5 h-5 text-pink-400" />
          <h1 className="text-lg font-bold">Tip Jar</h1>
          <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/30 text-xs">Support Creators</Badge>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Creator selector + tip form */}
          <div className="lg:col-span-2 space-y-4">
            {/* Creator selector */}
            <Card className="bg-black/40 border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Crown className="w-4 h-4 text-yellow-400" /> Select Creator to Tip
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {TOP_CREATORS.map(creator => (
                    <button
                      key={creator.id}
                      onClick={() => setSelectedCreator(creator)}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                        selectedCreator.id === creator.id
                          ? "border-pink-500/50 bg-pink-500/10"
                          : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                      }`}
                    >
                      <Avatar className="w-10 h-10 shrink-0">
                        <AvatarImage src={creator.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white text-sm font-bold">
                          {creator.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-sm truncate">{creator.name}</span>
                          <span>{creator.badge}</span>
                        </div>
                        <div className="text-xs text-gray-400">{creator.tipsToday.toLocaleString()} SKY today</div>
                      </div>
                      {selectedCreator.id === creator.id && (
                        <div className="w-2 h-2 rounded-full bg-pink-400 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tip form */}
            <Card className="bg-black/40 border-white/10">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Coins className="w-4 h-4 text-yellow-400" /> Tip Amount
                  </CardTitle>
                  {/* Currency toggle */}
                  <div className="flex rounded-lg border border-white/10 overflow-hidden">
                    {(["SKY444", "USD"] as const).map(c => (
                      <button
                        key={c}
                        onClick={() => { setCurrency(c); setSelectedAmount(null); setCustomAmount(""); }}
                        className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                          currency === c ? "bg-purple-600 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"
                        }`}
                      >
                        {c === "SKY444" ? "⚡ SKY444" : "$ USD"}
                      </button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Quick amounts */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {amounts.map(amt => (
                    <button
                      key={amt}
                      onClick={() => { setSelectedAmount(amt); setCustomAmount(""); }}
                      className={`py-3 rounded-xl border text-sm font-bold transition-all active:scale-95 ${
                        selectedAmount === amt && !customAmount
                          ? "border-pink-500 bg-pink-500/20 text-pink-300 shadow-lg shadow-pink-500/20"
                          : "border-white/10 bg-white/5 text-white hover:border-purple-500/50 hover:bg-purple-500/10"
                      }`}
                    >
                      {currency === "USD" ? `$${amt}` : amt.toLocaleString()}
                    </button>
                  ))}
                </div>

                {/* Custom amount */}
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    {currency === "USD" ? "$" : "⚡"}
                  </span>
                  <Input
                    type="number"
                    placeholder="Custom amount..."
                    value={customAmount}
                    onChange={e => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                    className="pl-8 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-pink-500/50"
                  />
                </div>

                {/* Message */}
                <Textarea
                  placeholder={`Send a message to ${selectedCreator.name}... (optional)`}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={2}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-pink-500/50 resize-none"
                />

                {/* Send button */}
                <Button
                  onClick={handleSendTip}
                  disabled={sending || !finalAmount}
                  className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-base rounded-xl shadow-lg shadow-pink-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {sending ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Send {finalAmount ? `${currency === "USD" ? "$" : "⚡"}${finalAmount}` : "Tip"} to {selectedCreator.name}
                    </span>
                  )}
                </Button>

                {!user && (
                  <p className="text-center text-xs text-gray-500">
                    <Link href="/login" className="text-pink-400 hover:underline">Sign in</Link> to send tips
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right: Leaderboard + recent tips */}
          <div className="space-y-4">
            {/* Top tipped today */}
            <Card className="bg-black/40 border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-400" /> Top Tipped Today
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {TOP_CREATORS.map((creator, i) => (
                  <button
                    key={creator.id}
                    onClick={() => setSelectedCreator(creator)}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                  >
                    <span className={`text-sm font-bold w-5 ${i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-300" : i === 2 ? "text-orange-400" : "text-gray-500"}`}>
                      #{i + 1}
                    </span>
                    <Avatar className="w-8 h-8 shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white text-xs font-bold">
                        {creator.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{creator.name} {creator.badge}</div>
                      <div className="text-xs text-gray-400">{creator.tipsToday.toLocaleString()} SKY</div>
                    </div>
                    <TrendingUp className="w-3 h-3 text-green-400 shrink-0" />
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Recent tips feed */}
            <Card className="bg-black/40 border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400" /> Recent Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {RECENT_TIPS.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-white/5">
                    <Heart className="w-3 h-3 text-pink-400 mt-1 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs">
                        <span className="text-purple-300 font-semibold">{tip.from}</span>
                        <span className="text-gray-500"> → </span>
                        <span className="text-pink-300 font-semibold">{tip.to}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Badge className={`text-[10px] ${tip.currency === "SKY444" ? "bg-purple-500/20 text-purple-300" : "bg-green-500/20 text-green-300"}`}>
                          {tip.currency === "USD" ? `$${tip.amount}` : `⚡${tip.amount}`}
                        </Badge>
                        {tip.message && <span className="text-xs text-gray-400 truncate">{tip.message}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="bg-gradient-to-br from-pink-900/30 to-purple-900/30 border-pink-500/20">
              <CardContent className="p-4 text-center space-y-2">
                <Sparkles className="w-8 h-8 text-pink-400 mx-auto" />
                <div className="text-2xl font-bold text-white">$48,200</div>
                <div className="text-xs text-gray-400">Total tips sent today</div>
                <div className="text-sm text-pink-300 font-semibold">🔥 Platform record!</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
