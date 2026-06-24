import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { TrendingUp, Users, DollarSign, Target, Rocket, Share2, Gift, Star, ArrowRight, BarChart3, Zap } from "lucide-react";

const GROWTH_CHANNELS = [
  { icon: Share2, label: "Referral Program", desc: "Earn 10% of referred user's first month revenue", reward: "10% commission", href: "/referrals", color: "text-primary" },
  { icon: Gift, label: "Airdrop Campaigns", desc: "Complete tasks to earn free SKY444 tokens", reward: "Up to 1,000 SKY444", href: "/airdrops", color: "text-accent" },
  { icon: Star, label: "Creator Incentives", desc: "Top creators earn bonus rewards monthly", reward: "Up to $5,000/mo", href: "/creator-studio", color: "text-warning" },
  { icon: Rocket, label: "Launch Partner", desc: "Early adopter benefits and lifetime discounts", reward: "50% lifetime discount", href: "/enterprise", color: "text-success" },
];

export default function Growth() {
  return (
    <div className="container py-8 max-w-5xl animate-page-in">
      <PageHeader backHref="/analytics" icon={TrendingUp} title="Growth Hub" subtitle="Referrals, incentives, and growth programs to accelerate your journey" badge="Active" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Total Users" value="24,891" change={12.4} changeLabel="this month" color="primary" />
        <StatCard icon={DollarSign} label="Rewards Paid" value="$48,230" change={8.7} changeLabel="this month" color="success" />
        <StatCard icon={Target} label="Conversion Rate" value="4.2%" change={1.3} changeLabel="vs last month" color="accent" />
        <StatCard icon={BarChart3} label="Viral Coefficient" value="1.34" change={5.2} changeLabel="this week" color="warning" />
      </div>
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {GROWTH_CHANNELS.map(ch => (
          <div key={ch.label} className="card p-5 hover:border-primary/40 transition-all duration-200">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <ch.icon className={`w-5 h-5 ${ch.color}`} />
              </div>
              <div className="flex-1">
                <div className="font-semibold mb-1">{ch.label}</div>
                <p className="text-sm text-muted-foreground mb-2">{ch.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">{ch.reward}</span>
                  <Link href={ch.href}><Button size="sm" variant="outline" className="text-xs gap-1">Join <ArrowRight className="w-3 h-3" /></Button></Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="card p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-lg font-bold mb-1">Your Referral Link</h3>
            <p className="text-sm text-muted-foreground">Share and earn 10% of every referral's revenue</p>
          </div>
          <div className="flex gap-2">
            <div className="px-4 py-2 bg-secondary rounded-lg font-mono text-sm">skycoin4444.com/ref/you</div>
            <Button className="btn-primary gap-2"><Share2 className="w-4 h-4" />Copy Link</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
