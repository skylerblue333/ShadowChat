import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Users, Building2, DollarSign, TrendingUp, Phone, Mail, MessageSquare,
  Plus, Search, Filter, Star, Target, Activity, BarChart3, Calendar,
  ChevronRight, CheckCircle2, Clock, AlertCircle, Zap, ArrowUpRight,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const PIPELINE_STAGES = [
  { name: "Lead", count: 24, value: 48000, color: "bg-blue-500" },
  { name: "Qualified", count: 12, value: 96000, color: "bg-purple-500" },
  { name: "Proposal", count: 8, value: 128000, color: "bg-yellow-500" },
  { name: "Negotiation", count: 5, value: 85000, color: "bg-orange-500" },
  { name: "Closed Won", count: 18, value: 324000, color: "bg-green-500" },
];

const CONTACTS = [
  { id: 1, name: "Alex Chen", company: "TechVentures", email: "alex@techventures.io", stage: "Qualified", value: 12000, score: 92, lastContact: "2h ago", tags: ["Hot Lead", "Enterprise"] },
  { id: 2, name: "Maria Santos", company: "CryptoDAO", email: "maria@cryptodao.xyz", stage: "Proposal", value: 45000, score: 78, lastContact: "1d ago", tags: ["Web3", "Investor"] },
  { id: 3, name: "James Park", company: "SkyFund", email: "james@skyfund.com", stage: "Negotiation", value: 85000, score: 95, lastContact: "3h ago", tags: ["VIP", "Fund"] },
  { id: 4, name: "Priya Patel", company: "AILabs", email: "priya@ailabs.dev", stage: "Lead", value: 8000, score: 65, lastContact: "3d ago", tags: ["Developer", "API"] },
  { id: 5, name: "Carlos Rivera", company: "MetaMarket", email: "carlos@metamarket.io", stage: "Closed Won", value: 32000, score: 88, lastContact: "5h ago", tags: ["NFT", "Marketplace"] },
];

const REVENUE_DATA = [
  { month: "Jan", pipeline: 120000, closed: 45000 },
  { month: "Feb", pipeline: 145000, closed: 62000 },
  { month: "Mar", pipeline: 180000, closed: 78000 },
  { month: "Apr", pipeline: 210000, closed: 95000 },
  { month: "May", pipeline: 265000, closed: 112000 },
  { month: "Jun", pipeline: 310000, closed: 145000 },
];

const ACTIVITIES = [
  { type: "call", contact: "Alex Chen", note: "Discussed enterprise plan pricing", time: "2h ago", icon: Phone },
  { type: "email", contact: "Maria Santos", note: "Sent proposal deck v2", time: "5h ago", icon: Mail },
  { type: "meeting", contact: "James Park", note: "Contract review scheduled", time: "1d ago", icon: Calendar },
  { type: "message", contact: "Priya Patel", note: "API integration questions", time: "2d ago", icon: MessageSquare },
];

const stageColors: Record<string, string> = {
  Lead: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Qualified: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Proposal: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  Negotiation: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "Closed Won": "bg-green-500/20 text-green-300 border-green-500/30",
};

export default function CRM() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("pipeline");

  const filtered = CONTACTS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.company.toLowerCase().includes(search.toLowerCase())
  );

  const totalPipeline = PIPELINE_STAGES.reduce((s, p) => s + p.value, 0);
  const totalClosed = PIPELINE_STAGES.find(p => p.name === "Closed Won")?.value || 0;

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-8 w-8 rounded-lg gradient-psychedelic flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gradient">CRM Hub</h1>
          </div>
          <p className="text-sm text-white/50">Business contacts, deal pipeline, and customer analytics</p>
        </div>
        <Button className="gradient-psychedelic text-white gap-2">
          <Plus className="w-4 h-4" /> Add Contact
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Pipeline", value: `$${(totalPipeline / 1000).toFixed(0)}K`, icon: Target, color: "text-purple-400", change: "+18%" },
          { label: "Closed Won", value: `$${(totalClosed / 1000).toFixed(0)}K`, icon: CheckCircle2, color: "text-green-400", change: "+24%" },
          { label: "Active Contacts", value: "67", icon: Users, color: "text-cyan-400", change: "+12" },
          { label: "Win Rate", value: "38%", icon: TrendingUp, color: "text-yellow-400", change: "+5%" },
        ].map(kpi => (
          <Card key={kpi.label} className="glass-card border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                <span className="text-xs text-green-400 font-mono">{kpi.change}</span>
              </div>
              <div className="text-2xl font-bold font-mono">{kpi.value}</div>
              <div className="text-xs text-white/40 mt-1">{kpi.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Pipeline */}
        <TabsContent value="pipeline" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {PIPELINE_STAGES.map(stage => (
              <Card key={stage.name} className="glass-card border-white/10">
                <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold">{stage.name}</CardTitle>
                    <Badge variant="outline" className="text-xs font-mono">{stage.count}</Badge>
                  </div>
                  <div className="text-lg font-bold font-mono text-white/80">${(stage.value / 1000).toFixed(0)}K</div>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className={`h-1 w-full rounded-full ${stage.color} opacity-60`} />
                  {CONTACTS.filter(c => c.stage === stage.name).map(contact => (
                    <div key={contact.id} className="mt-3 p-2 rounded-lg bg-white/5 border border-white/8 hover:border-white/20 transition-colors cursor-pointer">
                      <div className="font-medium text-xs">{contact.name}</div>
                      <div className="text-xs text-white/40">{contact.company}</div>
                      <div className="text-xs text-green-400 font-mono mt-1">${contact.value.toLocaleString()}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Contacts */}
        <TabsContent value="contacts" className="space-y-4 mt-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <Input
                placeholder="Search contacts..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 bg-white/5 border-white/10"
              />
            </div>
            <Button variant="outline" className="border-white/10 gap-2">
              <Filter className="w-4 h-4" /> Filter
            </Button>
          </div>
          <div className="space-y-2">
            {filtered.map(contact => (
              <Card key={contact.id} className="glass-card border-white/10 hover:border-white/20 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full gradient-psychedelic flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {contact.name[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{contact.name}</div>
                        <div className="text-xs text-white/40">{contact.company} &middot; {contact.email}</div>
                        <div className="flex gap-1 mt-1">
                          {contact.tags.map(tag => (
                            <span key={tag} className="text-xs px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/50">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <Badge className={`text-xs border ${stageColors[contact.stage]}`}>{contact.stage}</Badge>
                      <div className="text-sm font-bold font-mono text-green-400">${contact.value.toLocaleString()}</div>
                      <div className="flex items-center gap-1 text-xs text-white/40">
                        <Clock className="w-3 h-3" /> {contact.lastContact}
                      </div>
                    </div>
                  </div>
                  {/* Lead score */}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs text-white/40">Lead Score</span>
                    <Progress value={contact.score} className="flex-1 h-1.5" />
                    <span className="text-xs font-mono text-white/60">{contact.score}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="glass-card border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-purple-400" /> Pipeline vs Closed Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={REVENUE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} />
                    <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} tickFormatter={v => `$${v/1000}K`} />
                    <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)" }} formatter={(v: number) => [`$${v.toLocaleString()}`, ""]} />
                    <Area type="monotone" dataKey="pipeline" stroke="#a855f7" fill="rgba(168,85,247,0.1)" strokeWidth={2} />
                    <Area type="monotone" dataKey="closed" stroke="#22c55e" fill="rgba(34,197,94,0.1)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="glass-card border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Target className="w-4 h-4 text-cyan-400" /> Stage Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={PIPELINE_STAGES}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} />
                    <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)" }} />
                    <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          {/* Conversion funnel */}
          <Card className="glass-card border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Conversion Funnel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {PIPELINE_STAGES.map((stage, i) => {
                const pct = Math.max(20, 100 - i * 18);
                return (
                  <div key={stage.name} className="flex items-center gap-3">
                    <span className="text-xs text-white/40 w-24 text-right">{stage.name}</span>
                    <div className="flex-1 bg-white/5 rounded-full h-5 overflow-hidden">
                      <div className={`h-full ${stage.color} rounded-full flex items-center justify-end pr-2`} style={{ width: `${pct}%` }}>
                        <span className="text-xs font-mono text-white/80">{stage.count}</span>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-white/40 w-16">${(stage.value / 1000).toFixed(0)}K</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity */}
        <TabsContent value="activity" className="space-y-3 mt-4">
          {ACTIVITIES.map((act, i) => (
            <Card key={i} className="glass-card border-white/10">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  <act.icon className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">{act.contact}</span>
                    <span className="text-xs text-white/30 font-mono">{act.time}</span>
                  </div>
                  <p className="text-sm text-white/50 mt-0.5">{act.note}</p>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button variant="outline" className="w-full border-white/10 text-white/50 gap-2">
            <Activity className="w-4 h-4" /> Load More Activity
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
