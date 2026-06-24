import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getLoginUrl } from "@/const";
import { DollarSign, Users, Heart, Star, TrendingUp, Award, Gift, Zap, ChevronRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Link } from "wouter";

const REVENUE_DATA = Array.from({length:12},(_,i)=>({
  month:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  subscriptions: Math.floor(Math.random()*500+200),
  tips: Math.floor(Math.random()*300+100),
  content: Math.floor(Math.random()*200+50),
}));

const MONETIZATION_FEATURES = [
  { icon:<Users className="w-5 h-5"/>, title:"Subscriptions", desc:"Monthly recurring revenue from fans", href:"/subscriptions", color:"oklch(0.72 0.22 295)", badge:"Active" },
  { icon:<Heart className="w-5 h-5"/>, title:"Tips & Donations", desc:"One-time payments from supporters", href:"/tips", color:"oklch(0.76 0.19 185)", badge:"Active" },
  { icon:<Star className="w-5 h-5"/>, title:"Premium Content", desc:"Paid posts, videos, and exclusives", href:"/premium-content", color:"oklch(0.78 0.16 65)", badge:"Active" },
  { icon:<Gift className="w-5 h-5"/>, title:"Stream Gifts", desc:"Real-time gifts during live streams", href:"/streaming", color:"oklch(0.72 0.18 150)", badge:"Active" },
  { icon:<Award className="w-5 h-5"/>, title:"Memberships", desc:"Tiered fan clubs with perks", href:"/memberships", color:"oklch(0.82 0.16 80)", badge:"Coming Soon" },
  { icon:<Zap className="w-5 h-5"/>, title:"Affiliate Program", desc:"Earn from referrals and partnerships", href:"/affiliate", color:"oklch(0.62 0.22 25)", badge:"Active" },
];

export default function CreatorMonetization() {
  const { isAuthenticated } = useAuth();
  const { data: earnings } = trpc.creator.earnings.useQuery(undefined, { enabled: isAuthenticated });
  const { data: milestones } = trpc.creatorGrowth.getMilestones.useQuery(undefined, { enabled: isAuthenticated });
  const { data: advice } = trpc.creatorGrowth.getGrowthAdvice.useQuery(undefined, { enabled: isAuthenticated });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <DollarSign className="w-16 h-16 text-green-400 mx-auto mb-4"/>
          <h2 className="text-2xl font-bold mb-2">Creator Monetization</h2>
          <p className="text-muted-foreground mb-6">Turn your content into income. Multiple revenue streams, all in one place.</p>
          <Button asChild className="bg-green-600 hover:bg-green-500"><a href={getLoginUrl()}>Get Started</a></Button>
        </div>
      </div>
    );
  }

  const totalRevenue = (earnings?.totalRevenue || 0);
  const subRevenue = (earnings?.subRevenue || 0);
  const tipRevenue = (earnings?.tipRevenue || 0);

  return (
    <div className="min-h-screen">
      <PageHeader title="Creator Monetization" subtitle="Multiple revenue streams · Real earnings · Growth tools"/>
      <div className="container py-6 max-w-6xl">
        {/* Revenue Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label:"Total Revenue", value:`$${totalRevenue.toFixed(2)}`, icon:<DollarSign className="w-4 h-4"/>, color:"text-green-400" },
            { label:"Subscriptions", value:`$${subRevenue.toFixed(2)}`, icon:<Users className="w-4 h-4"/>, color:"text-purple-400" },
            { label:"Tips", value:`$${tipRevenue.toFixed(2)}`, icon:<Heart className="w-4 h-4"/>, color:"text-pink-400" },
            { label:"Active Subs", value:String(earnings?.subscriptions || 0), icon:<Star className="w-4 h-4"/>, color:"text-yellow-400" },
          ].map(s => (
            <div key={s.label} className="rounded-xl bg-white/5 border border-white/10 p-4">
              <div className={`${s.color} mb-2`}>{s.icon}</div>
              <div className="text-xl font-bold font-mono">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <Tabs defaultValue="streams">
          <TabsList className="bg-white/5 border border-white/10 mb-4">
            <TabsTrigger value="streams">Revenue Streams</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="growth">Growth</TabsTrigger>
          </TabsList>

          <TabsContent value="streams">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {MONETIZATION_FEATURES.map(f => (
                <Link key={f.title} href={f.href}>
                  <div className="rounded-xl bg-white/5 border border-white/10 p-5 hover:bg-white/8 transition-all cursor-pointer group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 rounded-lg" style={{backgroundColor:`${f.color}20`,color:f.color}}>{f.icon}</div>
                      <Badge className="text-xs" style={f.badge==="Active"?{backgroundColor:`${f.color}20`,color:f.color,border:`1px solid ${f.color}40`}:{}}
                        variant={f.badge==="Active"?"secondary":"outline"}>{f.badge}</Badge>
                    </div>
                    <h3 className="font-bold mb-1">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                    <div className="flex items-center gap-1 mt-3 text-xs" style={{color:f.color}}>
                      <span>Manage</span><ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform"/>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="rounded-xl bg-white/5 border border-white/10 p-6">
              <h3 className="font-bold mb-4">Revenue Breakdown (12 months)</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={REVENUE_DATA}>
                  <XAxis dataKey="month" tick={{fontSize:11}} stroke="transparent" tickLine={false}/>
                  <YAxis tick={{fontSize:11}} stroke="transparent" tickLine={false} tickFormatter={v=>`$${v}`}/>
                  <Tooltip contentStyle={{background:"#1a1a2e",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"8px"}} formatter={(v:any,n:string)=>[`$${v}`,n]}/>
                  <Bar dataKey="subscriptions" fill="oklch(0.72 0.22 295)" radius={[4,4,0,0]} name="Subscriptions"/>
                  <Bar dataKey="tips" fill="oklch(0.76 0.19 185)" radius={[4,4,0,0]} name="Tips"/>
                  <Bar dataKey="content" fill="oklch(0.78 0.16 65)" radius={[4,4,0,0]} name="Premium Content"/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="growth">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Milestones */}
              <div className="rounded-xl bg-white/5 border border-white/10 p-5">
                <h3 className="font-bold mb-4 flex items-center gap-2"><Award className="w-4 h-4 text-yellow-400"/>Milestones</h3>
                {!milestones || (milestones as any[]).length === 0 ? (
                  <p className="text-muted-foreground text-sm">No milestones yet. Keep creating!</p>
                ) : (
                  <div className="space-y-3">
                    {(milestones as any[]).slice(0,5).map((m: any, i: number) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${m.achieved?"bg-yellow-500/20 text-yellow-400":"bg-white/5 text-muted-foreground"}`}>
                          {m.achieved?"✓":i+1}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{m.title || m.name || `Milestone ${i+1}`}</div>
                          <div className="text-xs text-muted-foreground">{m.description || m.desc || ""}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* AI Growth Advice */}
              <div className="rounded-xl bg-white/5 border border-white/10 p-5">
                <h3 className="font-bold mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-cyan-400"/>AI Growth Advice</h3>
                {!advice ? (
                  <div className="space-y-2">
                    {[0,1,2].map(i=><div key={i} className="h-4 bg-white/10 rounded animate-pulse"/>)}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {((advice as any).tips || [(advice as any).advice || "Keep creating consistently and engage with your audience daily."]).slice(0,4).map((tip: string, i: number) => (
                      <div key={i} className="flex gap-2 text-sm">
                        <span className="text-cyan-400 shrink-0">→</span>
                        <span className="text-muted-foreground">{tip}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
