import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, IconTile } from "@/components/ui/sk";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, Volume2, Zap, Mic } from "lucide-react";

const SYMBOLS = ["BTC", "ETH", "DODGE", "SKY444", "TRUMP"];

export default function DayTradeRoom() {
  const [selectedSymbol, setSelectedSymbol] = useState("BTC");
  const [currentPrice, setCurrentPrice] = useState(45000);
  const [quantity, setQuantity] = useState(1);
  const [isVoiceOn, setIsVoiceOn] = useState(false);

  const { data: signals } = trpc.trading.getSignals.useQuery({ symbol: selectedSymbol });
  const generateSignal = trpc.trading.generateSignal.useMutation();
  const openTrade = trpc.trading.openTrade.useMutation();
  const { data: tradeHistory } = trpc.trading.getTradeHistory.useQuery();

  const handleGenerateSignal = async () => {
    await generateSignal.mutateAsync({ symbol: selectedSymbol, currentPrice });
  };

  const handleOpenTrade = async () => {
    await openTrade.mutateAsync({
      symbol: selectedSymbol,
      entryPrice: currentPrice,
      quantity,
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Day Trade Room</h1>
          <p className="text-muted-foreground">AI-powered trading with voice partner and real-time signals</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trading Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Symbol Selector */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Select Trading Pair</h2>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {SYMBOLS.map(sym => (
                  <button
                    key={sym}
                    onClick={() => setSelectedSymbol(sym)}
                    className={`p-3 rounded-lg font-semibold transition-colors ${
                      selectedSymbol === sym
                        ? "bg-[var(--neon-cyan)] text-black"
                        : "bg-card border border-border hover:bg-secondary"
                    }`}
                  >
                    {sym}
                  </button>
                ))}
              </div>
            </Card>

            {/* Price Input */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Market Entry</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Current Price ($)</label>
                  <Input
                    type="number"
                    value={currentPrice}
                    onChange={e => setCurrentPrice(Number(e.target.value))}
                    className="mt-2"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Quantity</label>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={e => setQuantity(Number(e.target.value))}
                    className="mt-2"
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  Total: ${(currentPrice * quantity).toLocaleString()}
                </div>
              </div>
            </Card>

            {/* AI Signals */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">AI Trading Signals</h2>
              <Button
                onClick={handleGenerateSignal}
                disabled={generateSignal.isPending}
                className="w-full sk-gradient mb-4"
              >
                <Zap className="w-4 h-4 mr-2" />
                {generateSignal.isPending ? "Generating..." : "Generate Signal"}
              </Button>

              {signals && signals.length > 0 && (
                <div className="space-y-2">
                  {signals.slice(0, 3).map((signal, i) => (
                    <div key={i} className="p-3 bg-card border border-border rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className={`font-semibold uppercase ${
                          signal.signal === "buy" ? "text-[var(--neon-green)]" :
                          signal.signal === "sell" ? "text-red-500" :
                          "text-yellow-500"
                        }`}>
                          {signal.signal}
                        </span>
                        <span className="text-[var(--neon-cyan)]">
                          {(signal.confidence * 100).toFixed(0)}% confidence
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">${signal.price}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Trade Action */}
            <Card className="p-6">
              <Button
                onClick={handleOpenTrade}
                disabled={openTrade.isPending}
                className="w-full bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90 font-bold py-3"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                {openTrade.isPending ? "Opening..." : "Open Trade"}
              </Button>
            </Card>
          </div>

          {/* Voice Partner Panel */}
          <div className="space-y-6">
            {/* AI Voice Partner */}
            <Card className="p-6 text-center">
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center transition-all ${
                isVoiceOn 
                  ? "bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-magenta)] animate-pulse"
                  : "bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-magenta)]"
              }`}>
                <Volume2 className="w-10 h-10 text-black" />
              </div>
              <h3 className="text-lg font-bold mb-2">AI Voice Partner</h3>
              <p className="text-sm text-muted-foreground mb-4">Real-time trading insights & analysis</p>
              <Button
                onClick={() => setIsVoiceOn(!isVoiceOn)}
                variant={isVoiceOn ? "default" : "outline"}
                className="w-full"
              >
                <Mic className="w-4 h-4 mr-2" />
                {isVoiceOn ? "Voice: ON" : "Voice: OFF"}
              </Button>
              {isVoiceOn && (
                <p className="text-xs text-[var(--neon-cyan)] mt-3">🎙️ Voice partner active</p>
              )}
            </Card>

            {/* Trade History */}
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Recent Trades</h3>
              {tradeHistory && tradeHistory.length > 0 ? (
                <div className="space-y-2">
                  {tradeHistory.slice(0, 5).map(trade => (
                    <div key={trade.id} className="p-2 bg-card border border-border rounded text-sm">
                      <div className="flex justify-between">
                        <span className="font-semibold">{trade.symbol}</span>
                        <span className={trade.profitLoss >= 0 ? "text-[var(--neon-green)]" : "text-red-500"}>
                          {trade.profitLoss >= 0 ? "+" : ""}{trade.profitLoss.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {trade.status === "open" ? "🟢 Open" : "🔴 Closed"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No trades yet. Start trading!</p>
              )}
            </Card>

            {/* Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Trades:</span>
                  <span className="font-semibold">{tradeHistory?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Win Rate:</span>
                  <span className="font-semibold text-[var(--neon-green)]">
                    {tradeHistory && tradeHistory.length > 0
                      ? ((tradeHistory.filter(t => t.profitLoss > 0).length / tradeHistory.length) * 100).toFixed(0) + "%"
                      : "N/A"}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
