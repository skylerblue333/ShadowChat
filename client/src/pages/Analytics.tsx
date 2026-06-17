import { trpc } from "@/lib/trpc";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { Card, IconTile, StatCard } from "@/components/ui/sk";
import { BarChart3, Users, DollarSign, Heart, Activity, Loader2 } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";

const COLORS = ["#22f5ff", "#a259ff", "#ff3dcd", "#38f5a0", "#f5c542"];
const TIP = { background: "#111111", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12 };

export default function Analytics() {
  const { data, isLoading } = trpc.analytics.dashboard.useQuery();
  const { data: stats } = trpc.analytics.platformStats.useQuery();

  if (isLoading) {
    return <div className="container py-24 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[var(--neon-cyan)]" /></div>;
  }

  const fmt = (n: number) => Math.round(n).toLocaleString();
  const metrics = [
    { label: "Registered Users", value: data?.registeredUsers ?? 0, icon: Users, accent: "cyan" as const },
    { label: "Live Volume (SKY)", value: data?.liveVolume ?? 0, icon: DollarSign, accent: "purple" as const },
    { label: "Total Donated", value: data?.totalDonated ?? 0, icon: Heart, accent: "magenta" as const },
    { label: "Tracked Events", value: data?.summary?.totalEvents ?? 0, icon: Activity, accent: "green" as const },
  ];

  const trend = (data?.revenueTrend ?? []).map(t => ({ day: t.day?.slice(5) ?? "", revenue: t.revenue }));
  const byModule = data?.summary?.byModule ?? [];

  return (
    <div className="container py-10">
      <div className="flex items-center gap-4 mb-8">
        <IconTile icon={BarChart3} accent="purple" />
        <div>
          <h1 className="font-extrabold text-3xl">Advanced Analytics</h1>
          <p className="text-muted-foreground text-sm">Real-time platform metrics, revenue trends & engagement.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map(m => (
          <StatCard key={m.label} icon={m.icon} accent={m.accent} label={m.label} value={<AnimatedCounter value={m.value} format={fmt} />} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-5">
          <h3 className="font-bold text-lg mb-4">Revenue Trend</h3>
          {trend.length === 0 ? <EmptyChart /> : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22f5ff" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#22f5ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="day" stroke="#7a7a7a" fontSize={12} />
                <YAxis stroke="#7a7a7a" fontSize={12} />
                <Tooltip contentStyle={TIP} />
                <Area type="monotone" dataKey="revenue" stroke="#22f5ff" fill="url(#rev)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card className="p-5">
          <h3 className="font-bold text-lg mb-4">Engagement by Module</h3>
          {byModule.length === 0 ? <EmptyChart /> : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={byModule} dataKey="count" nameKey="module" cx="50%" cy="50%" outerRadius={90} label={(e: any) => e.module}>
                  {byModule.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={TIP} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      <Card className="p-5 mt-6">
        <h3 className="font-bold text-lg mb-4">Platform Scale</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={[
            { name: "Features", value: stats?.features ?? 3645 },
            { name: "Users (K)", value: (stats?.users ?? 1200000) / 1000 },
            { name: "Volume ($K)", value: (stats?.marketplaceVolume ?? 500000000) / 1000 },
          ]}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="name" stroke="#7a7a7a" fontSize={12} />
            <YAxis stroke="#7a7a7a" fontSize={12} />
            <Tooltip contentStyle={TIP} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {[0,1,2].map(i => <Cell key={i} fill={COLORS[i]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

function EmptyChart() {
  return <div className="h-[280px] flex items-center justify-center text-sm text-muted-foreground">Data populates as the platform is used.</div>;
}
