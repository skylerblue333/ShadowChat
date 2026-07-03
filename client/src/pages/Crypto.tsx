import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, Coins, ArrowUpDown, TrendingUp, ArrowUp, ArrowDown, Zap, RefreshCw, Shield } from "lucide-react";
import { toast } from "sonner";

const TOKENS = [
  { symbol: "SKY444", name: "SKYCOIN4444", purpose: "Platform utility & governance", color: "from-[oklch(0.72 0.28 305)] to-[oklch(0.6_0.15_200)]", price: 0.042, change: 12.5 },
  { symbol: "DODGE", name: "Dodge", purpose: "Gaming & rewards", color: "from-[oklch(0.8_0.15_90)] to-[oklch(0.7_0.15_60)]", price: 0.0001, change: -3.2 },
  { symbol: "TRUMP", name: "Trump", purpose: "Governance voting", color: "from-[oklch(0.7_0.15_280)] to-[oklch(0.6_0.2_300)]", price: 12.45, change: 5.8 },
  { symbol: "BTC", name: "Bitcoin", purpose: "Store of value", color: "from-[oklch(0.8_0.15_60)] to-[oklch(0.7_0.15_40)]", price: 104250, change: 1.2 },
  { symbol: "USDT", name: "Tether", purpose: "Stablecoin payments", color: "from-[oklch(0.72 0.28 305)] to-[oklch(0.6_0.15_140)]", price: 1.00, change: 0.01 },
  { symbol: "MONERO", name: "Monero", purpose: "Privacy transactions", color: "from-[oklch(0.7_0.2_30)] to-[oklch(0.6_0.15_15)]", price: 178.30, change: -1.5 },
];

export default function Crypto() {
  
  const { data: balances } = trpc.token.balances.useQuery(undefined, { enabled: isAuthenticated });
  const { data: transactions } = trpc.token.transactions.useQuery({ limit: 10 }, { enabled: isAuthenticated });

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="bg-gradient-to-r from-[oklch(0.72 0.28 305)] to-[oklch(0.8_0.15_90)] bg-clip-text text-transparent">
              Crypto Wallet
            </span>
          </h1>
          <p className="text-muted-foreground">6-token ecosystem with portfolio tracking, swaps, and real-time prices.</p>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-5 border-border/50 bg-card/80 backdrop-blur col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Wallet className="w-4 h-4 text-primary" /> Portfolio Value
              </h3>
              <Badge variant="secondary" className="text-[10px]">
                {isAuthenticated ? "CONNECTED" : "NOT CONNECTED"}
              </Badge>
            </div>
            <div className="text-3xl font-bold font-mono mb-1">
              ${isAuthenticated ? (balances && balances.length > 0 ? balances.reduce((sum: number, b: any) => sum + b.balance * 0.042, 0).toFixed(2) : "0.00") : "---"}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-purple-400 flex items-center gap-0.5">
                <ArrowUp className="w-3 h-3" /> +12.5%
              </span>
              <span className="text-muted-foreground">24h change</span>
            </div>
          </Card>
          <Card className="p-5 border-border/50 bg-card/80 backdrop-blur">
            <h3 className="font-semibold text-sm flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-[oklch(0.8_0.15_90)]" /> Quick Actions
            </h3>
            <div className="space-y-2">
              <Button className="w-full justify-start bg-primary/10 text-primary hover:bg-primary/20" size="sm" onClick={() => toast.info("Swap feature coming soon!")}>
                <ArrowUpDown className="w-4 h-4 mr-2" /> Swap Tokens
              </Button>
              <Button className="w-full justify-start bg-purple-600/10 text-purple-400 hover:bg-purple-600/20" size="sm" onClick={() => toast.info("Send feature coming soon!")}>
                <ArrowUp className="w-4 h-4 mr-2" /> Send
              </Button>
              <Button className="w-full justify-start bg-blue-500/10 text-blue-400 hover:bg-blue-500/20" size="sm" onClick={() => toast.info("Receive feature coming soon!")}>
                <ArrowDown className="w-4 h-4 mr-2" /> Receive
              </Button>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="tokens" className="w-full">
          <TabsList className="w-full bg-card/80 border border-border/50">
            <TabsTrigger value="tokens" className="flex-1">Tokens</TabsTrigger>
            <TabsTrigger value="transactions" className="flex-1">Transactions</TabsTrigger>
            <TabsTrigger value="defi" className="flex-1">DeFi</TabsTrigger>
          </TabsList>

          <TabsContent value="tokens" className="mt-4">
            <div className="space-y-3">
              {TOKENS.map((token) => (
                <Card key={token.symbol} className="p-4 border-border/50 bg-card/80 hover:border-primary/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${token.color} flex items-center justify-center shrink-0`}>
                      <span className="text-xs font-bold text-white">{token.symbol[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm">{token.symbol}</h3>
                        <span className="text-xs text-muted-foreground">{token.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{token.purpose}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm font-medium">
                        ${token.price < 1 ? token.price.toFixed(4) : token.price.toLocaleString()}
                      </div>
                      <div className={`text-xs font-mono flex items-center justify-end gap-0.5 ${token.change >= 0 ? "text-purple-400" : "text-red-400"}`}>
                        {token.change >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                        {Math.abs(token.change)}%
                      </div>
                    </div>
                    <div className="text-right hidden md:block">
                      <div className="font-mono text-sm">
                        {isAuthenticated ? "0.00" : "---"}
                      </div>
                      <div className="text-xs text-muted-foreground">Balance</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="mt-4">
            {isAuthenticated && transactions && transactions.length > 0 ? (
              <div className="space-y-2">
                {transactions.map((tx: any) => (
                  <Card key={tx.id} className="p-3 border-border/50 bg-card/80">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === "deposit" ? "bg-purple-600/10" : "bg-red-500/10"}`}>
                        {tx.type === "deposit" ? <ArrowDown className="w-4 h-4 text-purple-400" /> : <ArrowUp className="w-4 h-4 text-red-400" />}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium capitalize">{tx.type}</div>
                        <div className="text-xs text-muted-foreground">{new Date(tx.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div className="text-right">
                        <div className={`font-mono text-sm ${tx.type === "deposit" ? "text-purple-400" : "text-red-400"}`}>
                          {tx.type === "deposit" ? "+" : "-"}{tx.amount} {tx.currency}
                        </div>
                        <Badge variant="secondary" className="text-[10px]">{tx.status}</Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center border-border/50 bg-card/80">
                <RefreshCw className="w-10 h-10 text-primary/50 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">No transactions yet</h3>
                <p className="text-xs text-muted-foreground">Your transaction history will appear here once you start trading.</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="defi" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-5 border-border/50 bg-card/80">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Yield Farming</h3>
                    <p className="text-xs text-muted-foreground">Earn rewards by providing liquidity</p>
                  </div>
                </div>
                <div className="text-2xl font-mono font-bold text-primary mb-2">12-45% APY</div>
                <Button size="sm" className="w-full" variant="outline" onClick={() => toast.info("Yield farming coming soon!")}>
                  Start Farming
                </Button>
              </Card>
              <Card className="p-5 border-border/50 bg-card/80">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[oklch(0.7_0.15_280)]/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-[oklch(0.7_0.15_280)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Insurance Pool</h3>
                    <p className="text-xs text-muted-foreground">Protect your assets with coverage</p>
                  </div>
                </div>
                <div className="text-2xl font-mono font-bold text-[oklch(0.7_0.15_280)] mb-2">$2.5M TVL</div>
                <Button size="sm" className="w-full" variant="outline" onClick={() => toast.info("Insurance coming soon!")}>
                  Get Coverage
                </Button>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
