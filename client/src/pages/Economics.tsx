import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { BarChart3, TrendingUp, DollarSign, Coins, PieChart, ArrowRight, Zap, Lock, Flame, Users } from "lucide-react";

const TOKENOMICS = [
  { label: "Community Rewards", pct: 35, color: "bg-primary" },
  { label: "Development Fund", pct: 20, color: "bg-accent" },
  { label: "Treasury Reserve", pct: 20, color: "bg-success" },
  { label: "Team & Advisors", pct: 10, color: "bg-warning" },
  { label: "Marketing", pct: 10, color: "bg-destructive" },
  { label: "Liquidity Pool", pct: 5, color: "bg-cyber-gold" },
];

const METRICS = [
  { icon: Coins, label: "Total Supply", value: "444,444,444", color: "primary" as const },
  { icon: Flame, label: "Burned", value: "12,345,678", color: "destructive" as const },
  { icon: Lock, label: "Staked", value: "89,234,567", color: "success" as const },
  { icon: Users, label: "Holders", value: "24,891", color: "accent" as const },
];

export default function Economics() {
  return (
    <div className="container py-8 max-w-5xl animate-page-in">
      <PageHeader backHref="/token" icon={BarChart3} title="Token Economics" subtitle="SKY444 tokenomics, distribution, and live market data" badge="Live" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {METRICS.map(m => <StatCard key={m.label} icon={m.icon} label={m.label} value={m.value} color={m.color} />)}
      </div>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="card p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><PieChart className="w-5 h-5 text-primary" />Token Distribution</h3>
          <div className="space-y-3">
            {TOKENOMICS.map(t => (
              <div key={t.label}>
                <div className="flex justify-between text-sm mb-1"><span>{t.label}</span><span className="font-mono text-muted-foreground">{t.pct}%</span></div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className={`h-full ${t.color} rounded-full transition-all duration-700`} style={{ width: `${t.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary" />Price History</h3>
          <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>Live chart loading...</p>
              <Link href="/trading"><Button size="sm" className="mt-3 btn-primary">View Trading</Button></Link>
            </div>
          </div>
        </div>
      </div>
      <div className="card p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-primary" />Utility & Use Cases</h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "Governance Voting", href: "/governance" },
            { label: "Staking Rewards", href: "/staking" },
            { label: "Marketplace Payments", href: "/marketplace" },
            { label: "Premium Features", href: "/subscriptions" },
            { label: "Charity Donations", href: "/charity" },
            { label: "Gaming Rewards", href: "/arcade" },
          ].map(u => (
            <Link key={u.label} href={u.href}>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer">
                <span className="text-sm">{u.label}</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
