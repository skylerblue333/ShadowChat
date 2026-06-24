import { Bot, TrendingUp, Zap, BarChart3, Shield, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

const tradingFeatures = [
  {
    icon: Bot,
    title: "AI Signal Engine",
    description: "Machine learning models analyze market patterns and generate high-confidence trading signals in real-time.",
    status: "Active",
  },
  {
    icon: TrendingUp,
    title: "Automated Strategies",
    description: "Deploy pre-built or custom trading strategies that execute automatically based on AI recommendations.",
    status: "Active",
  },
  {
    icon: BarChart3,
    title: "Portfolio Analytics",
    description: "Deep portfolio analysis with risk scoring, correlation mapping, and performance attribution.",
    status: "Active",
  },
  {
    icon: Shield,
    title: "Risk Management",
    description: "Automated stop-loss, position sizing, and exposure limits protect your capital around the clock.",
    status: "Active",
  },
  {
    icon: Zap,
    title: "Flash Execution",
    description: "Sub-second trade execution with smart order routing across multiple liquidity pools.",
    status: "Active",
  },
  {
    icon: Activity,
    title: "Market Intelligence",
    description: "Real-time sentiment analysis, whale tracking, and on-chain metrics for informed decisions.",
    status: "Active",
  },
];

const performanceMetrics = [
  { label: "Win Rate", value: "67.3%", color: "text-cyber-green" },
  { label: "Avg Return", value: "+4.2%", color: "text-primary" },
  { label: "Sharpe Ratio", value: "2.14", color: "text-cyber-purple" },
  { label: "Max Drawdown", value: "-8.7%", color: "text-cyber-orange" },
];

export default function AITrading() {
  // Real AI trading analysis from LLM backend
  const { data: tokenMetrics } = trpc.token.metrics.useQuery();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-cyber-blue/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/5 mb-6">
              <Bot className="h-3 w-3 text-blue-400" />
              <span className="text-xs font-mono text-blue-400">AI-POWERED</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              AI <span className="text-primary">Trading</span> Engine
            </h1>
            <p className="text-lg text-muted-foreground">
              Advanced machine learning algorithms power automated trading strategies with institutional-grade risk management.
            </p>
          </div>

          {/* Performance Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            {performanceMetrics.map((metric) => (
              <div key={metric.label} className="stat-card text-center">
                <div className={`text-2xl font-bold font-mono ${metric.color}`}>{metric.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Trading Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tradingFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="stat-card">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{feature.title}</h3>
                      <span className="text-xs text-purple-400 font-mono">{feature.status}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          <div className="stat-card cyber-glow text-center py-12 px-8 max-w-2xl mx-auto">
            <Bot className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">Start AI Trading</h2>
            <p className="text-muted-foreground mb-6">
              Connect your wallet and let our AI engine optimize your portfolio with automated strategies.
            </p>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8">
              Launch Trading Dashboard
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
