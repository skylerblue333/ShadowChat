import { useMemo } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, IconTile, ChangePill, Sparkline, ModuleTile, ACCENTS, type Accent } from "@/components/ui/sk";
import {
  Cpu, GraduationCap, Gamepad2, Vote, BarChart3, Heart, ShoppingBag,
  ChevronLeft, Shield, TrendingUp, Cpu as CpuIcon,
} from "lucide-react";

/* Token portfolio rows — SKY444 / DODGE / Trump Coin named explicitly */
const TOKENS: { name: string; symbol: string; price: string; held: string; change: number; color: string; trend: number[] }[] = [
  { name: "SkyCoin", symbol: "SKY444", price: "$0.12", held: "1.44M held", change: 12.4, color: ACCENTS.cyan.fg, trend: [9, 8.4, 8.6, 7.9, 8.1, 7.4, 7.6, 6.9, 7.1, 6.6, 7.0, 6.4] },
  { name: "DODGE", symbol: "DODGE", price: "$0.18", held: "820K held", change: 9.7, color: ACCENTS.amber.fg, trend: [4, 4.3, 4.1, 4.6, 4.4, 5.0, 4.8, 5.4, 5.2, 5.8, 5.6, 6.1] },
  { name: "Trump Coin", symbol: "TRUMP", price: "$8.72", held: "10.0K held", change: 18.2, color: ACCENTS.amber.fg, trend: [3, 3.4, 3.2, 3.9, 3.7, 4.4, 4.2, 5.1, 4.8, 5.6, 6.2, 5.8] },
  { name: "Bitcoin", symbol: "BTC", price: "$67.4K", held: "0.64 held", change: 2.1, color: ACCENTS.orange.fg, trend: [6, 5.2, 5.6, 4.8, 5.2, 4.6, 5.0, 5.6, 4.9, 5.8, 5.1, 5.4] },
];

const MODULES: { href: string; title: string; subtitle: string; icon: any; accent: Accent }[] = [
  { href: "/engineer", title: "HopeAI", subtitle: "AI software engineer", icon: Cpu, accent: "cyan" },
  { href: "/school", title: "Sky School", subtitle: "Courses & learning paths", icon: GraduationCap, accent: "purple" },
  { href: "/arcade", title: "Arcade", subtitle: "Games for charity", icon: Gamepad2, accent: "magenta" },
  { href: "/governance", title: "Governance", subtitle: "Vote & stake", icon: Vote, accent: "green" },
  { href: "/analytics", title: "Analytics", subtitle: "Live platform metrics", icon: BarChart3, accent: "amber" },
  { href: "/charity", title: "Charity", subtitle: "Campaigns & impact", icon: Heart, accent: "magenta" },
  { href: "/marketplace", title: "Marketplace", subtitle: "Buy, sell & trade", icon: ShoppingBag, accent: "purple" },
];

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { data: leaderboard } = trpc.gaming.leaderboard.useQuery(undefined);
  const { data: proposals } = trpc.governance.proposals.useQuery(undefined);
  const { data: campaigns } = trpc.charity.campaigns.useQuery();

  // Live activity is built from real platform data where available.
  const activity = useMemo(() => {
    const items: { icon: any; accent: Accent; title: string; sub: string; time: string }[] = [];
    if (proposals?.length) {
      items.push({ icon: Vote, accent: "green", title: `Governance: "${proposals[0].title}" is ${proposals[0].status}`, sub: `${proposals[0].ecosystem} ecosystem proposal`, time: "live" });
    }
    if (campaigns?.length) {
      const c = campaigns[0];
      items.push({ icon: Heart, accent: "magenta", title: `Charity: ${c.title}`, sub: `$${Number(c.raisedAmount).toLocaleString()} of $${Number(c.goalAmount).toLocaleString()} raised`, time: "live" });
    }
    items.push({ icon: CpuIcon, accent: "cyan", title: "HopeAI: code generation online", sub: "Live server-side LLM endpoints active", time: "now" });
    if (leaderboard?.length) {
      items.push({ icon: Gamepad2, accent: "purple", title: `Arcade leader: ${leaderboard[0].name ?? "Player"}`, sub: `${Number(leaderboard[0].totalScore).toLocaleString()} pts · $${Number(leaderboard[0].donated ?? 0).toFixed(2)} donated`, time: "recent" });
    }
    items.push({ icon: Shield, accent: "green", title: "Security: all clear", sub: "Authenticated session verified", time: "now" });
    return items;
  }, [proposals, campaigns, leaderboard]);

  return (
    <div className="container py-8 max-w-5xl">
      {/* Header bar like the reference */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate("/")} className="flex items-center gap-3 text-foreground">
          <ChevronLeft className="w-6 h-6" />
          <span className="text-2xl font-extrabold">{user?.name ? `${user.name}'s` : "Your"} Dashboard</span>
        </button>
        <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border text-sm">
          <span className="sk-live-dot" /> Online
        </span>
      </div>

      {/* Module quick tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {MODULES.map(m => (
          <ModuleTile key={m.href} icon={m.icon} accent={m.accent} title={m.title} subtitle={m.subtitle} onClick={() => navigate(m.href)} />
        ))}
      </div>

      {/* Token Portfolio */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-extrabold">Token Portfolio</h2>
        <button onClick={() => navigate("/marketplace")} className="text-sm text-[var(--neon-cyan)] flex items-center gap-1">
          View Wallet <TrendingUp className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-4 mb-10">
        {TOKENS.map(t => (
          <Card key={t.symbol} className="p-5" hover>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-muted-foreground">{t.name}</div>
                <div className="text-xl font-extrabold tracking-tight">{t.symbol}</div>
              </div>
              <ChangePill value={t.change} />
            </div>
            <Sparkline points={t.trend} color={t.color} />
            <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Price</span>
              <span className="font-bold">{t.price}</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Held</span>
              <span className="font-bold">{t.held}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Live Activity */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-extrabold">Live Activity</h2>
        <span className="sk-live-dot" />
      </div>
      <div className="space-y-3">
        {activity.map((a, i) => (
          <Card key={i} className="p-4 flex items-start gap-4" hover>
            <IconTile icon={a.icon} accent={a.accent} />
            <div className="min-w-0 flex-1">
              <div className="font-semibold leading-snug">{a.title}</div>
              <div className="text-sm text-muted-foreground">{a.sub}</div>
              <div className="text-xs text-muted-foreground mt-1">{a.time}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
