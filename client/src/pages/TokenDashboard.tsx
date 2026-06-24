import { trpc } from "@/lib/trpc";
import { Flame, Coins, Users, Vote, TrendingUp, BarChart3, Loader2 } from "lucide-react";

const allocation = [
  { name: "Public Sale", percentage: 30, amount: "300,000,000", color: "bg-primary" },
  { name: "Staking Rewards", percentage: 20, amount: "200,000,000", color: "bg-cyber-purple" },
  { name: "Ecosystem Fund", percentage: 20, amount: "200,000,000", color: "bg-cyber-blue" },
  { name: "Team & Advisors", percentage: 15, amount: "150,000,000", color: "bg-cyber-green" },
  { name: "Liquidity", percentage: 10, amount: "100,000,000", color: "bg-cyber-orange" },
  { name: "Treasury Reserve", percentage: 5, amount: "50,000,000", color: "bg-cyber-red" },
];

export default function TokenDashboard() {
  const { data: metrics, isLoading: metricsLoading } = trpc.token.metrics.useQuery();
  const { data: burnHistory, isLoading: burnLoading } = trpc.token.burnHistory.useQuery();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-cyber-purple/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/5 mb-6">
              <Coins className="h-3 w-3 text-purple-400" />
              <span className="text-xs font-mono text-purple-400">TOKENOMICS</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-primary font-mono">SKY444</span> Token
            </h1>
            <p className="text-lg text-muted-foreground">
              Deflationary utility token powering the Shadowchat ecosystem. Governance, staking, and burn mechanisms drive long-term value.
            </p>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          {metricsLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="stat-card">
                <div className="flex items-center gap-2 mb-3">
                  <Coins className="h-4 w-4 text-primary" />
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Total Supply</span>
                </div>
                <div className="text-2xl md:text-3xl font-bold font-mono">{(metrics?.totalSupply ?? 0).toLocaleString()}</div>
                <div className="text-sm text-muted-foreground font-mono mt-1">SKY444</div>
              </div>
              <div className="stat-card">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-cyber-blue" />
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Circulating Supply</span>
                </div>
                <div className="text-2xl md:text-3xl font-bold font-mono">{(metrics?.circulatingSupply ?? 0).toLocaleString()}</div>
                <div className="text-sm text-muted-foreground font-mono mt-1">
                  {((metrics?.circulatingSupply ?? 0) / (metrics?.totalSupply || 1) * 100).toFixed(1)}%
                </div>
              </div>
              <div className="stat-card">
                <div className="flex items-center gap-2 mb-3">
                  <Flame className="h-4 w-4 text-cyber-orange" />
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Burned Tokens</span>
                </div>
                <div className="text-2xl md:text-3xl font-bold font-mono">{(metrics?.burnedTokens ?? 0).toLocaleString()}</div>
                <div className="text-sm text-muted-foreground font-mono mt-1">
                  {((metrics?.burnedTokens ?? 0) / (metrics?.totalSupply || 1) * 100).toFixed(1)}%
                </div>
              </div>
              <div className="stat-card">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="h-4 w-4 text-cyber-green" />
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Staking Ratio</span>
                </div>
                <div className="text-2xl md:text-3xl font-bold font-mono">200,000,000</div>
                <div className="text-sm text-muted-foreground font-mono mt-1">{metrics?.stakingRatio ?? 0}%</div>
              </div>
              <div className="stat-card">
                <div className="flex items-center gap-2 mb-3">
                  <Vote className="h-4 w-4 text-cyber-purple" />
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Governance Votes</span>
                </div>
                <div className="text-2xl md:text-3xl font-bold font-mono">{metrics?.stakingParticipants ?? 0}</div>
                <div className="text-sm text-muted-foreground font-mono mt-1">Staking Participants</div>
              </div>
              <div className="stat-card">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Unique Holders</span>
                </div>
                <div className="text-2xl md:text-3xl font-bold font-mono">{(metrics?.uniqueHolders ?? 0).toLocaleString()}</div>
                <div className="text-sm text-muted-foreground font-mono mt-1">Wallets</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Token Allocation */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Token Allocation</h2>
          <div className="stat-card">
            <div className="h-8 rounded-lg overflow-hidden flex mb-6">
              {allocation.map((item) => (
                <div
                  key={item.name}
                  className={`${item.color} transition-all hover:opacity-80`}
                  style={{ width: `${item.percentage}%` }}
                  title={`${item.name}: ${item.percentage}%`}
                />
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {allocation.map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-sm ${item.color}`} />
                  <div>
                    <div className="text-sm font-medium">{item.name}</div>
                    <div className="text-xs text-muted-foreground font-mono">
                      {item.amount} ({item.percentage}%)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Burn History */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Burn History</h2>
          {burnLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : (
            <div className="stat-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/30">
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Date</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Amount</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {burnHistory?.map((burn, i) => (
                      <tr key={i} className="border-b border-border/20 last:border-0 hover:bg-primary/5 transition-colors">
                        <td className="py-3 px-4 font-mono">{new Date(burn.date).toLocaleDateString()}</td>
                        <td className="py-3 px-4 font-mono text-cyber-orange">-{burn.amount.toLocaleString()} SKY444</td>
                        <td className="py-3 px-4">{burn.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
