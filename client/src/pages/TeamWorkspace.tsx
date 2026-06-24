import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { toast } from "sonner";
import {
  Users, MessageSquare, CheckSquare, FileText, Settings,
  Plus, Hash, Video, Bell, Search, Star, Zap,
  BarChart2, Calendar, Folder, Shield, Globe, ChevronRight
} from "lucide-react";

const DEMO_CHANNELS = [
  { id: "general", name: "general", type: "text", unread: 3, members: 24 },
  { id: "dev", name: "development", type: "text", unread: 12, members: 18 },
  { id: "design", name: "design", type: "text", unread: 0, members: 8 },
  { id: "marketing", name: "marketing", type: "text", unread: 5, members: 11 },
  { id: "standup", name: "daily-standup", type: "voice", unread: 0, members: 24 },
];

const DEMO_TASKS = [
  { id: "1", title: "Redesign onboarding flow", status: "in_progress", priority: "high", assignee: "Alex", due: "Jun 22" },
  { id: "2", title: "API rate limiting implementation", status: "todo", priority: "high", assignee: "Sam", due: "Jun 24" },
  { id: "3", title: "Q2 analytics report", status: "done", priority: "medium", assignee: "Jordan", due: "Jun 20" },
  { id: "4", title: "Mobile push notifications", status: "in_progress", priority: "medium", assignee: "Taylor", due: "Jun 26" },
  { id: "5", title: "Security audit review", status: "todo", priority: "low", assignee: "Morgan", due: "Jun 28" },
];

const DEMO_MEMBERS = [
  { id: "1", name: "Alex Chen", role: "Engineering Lead", status: "online", avatar: "AC" },
  { id: "2", name: "Sam Park", role: "Backend Engineer", status: "online", avatar: "SP" },
  { id: "3", name: "Jordan Lee", role: "Product Manager", status: "away", avatar: "JL" },
  { id: "4", name: "Taylor Kim", role: "Frontend Engineer", status: "online", avatar: "TK" },
  { id: "5", name: "Morgan Wu", role: "Security Engineer", status: "offline", avatar: "MW" },
  { id: "6", name: "Riley Zhang", role: "Designer", status: "online", avatar: "RZ" },
];

const STATUS_COLORS: Record<string, string> = {
  todo: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  in_progress: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  done: "bg-green-500/20 text-green-400 border-green-500/30",
};

const PRIORITY_COLORS: Record<string, string> = {
  high: "text-red-400",
  medium: "text-yellow-400",
  low: "text-green-400",
};

const MEMBER_STATUS_COLORS: Record<string, string> = {
  online: "bg-green-400",
  away: "bg-yellow-400",
  offline: "bg-gray-500",
};

export default function TeamWorkspace() {
  const { user } = useAuth();
  const [activeChannel, setActiveChannel] = useState("general");
  const [messageInput, setMessageInput] = useState("");
  const [taskFilter, setTaskFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: communities } = trpc.community.list.useQuery({ limit: 3 });

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    toast.success("Message sent to #" + activeChannel);
    setMessageInput("");
  };

  const filteredTasks = DEMO_TASKS.filter(t => {
    if (taskFilter === "all") return true;
    return t.status === taskFilter;
  });

  return (
    <div className="min-h-screen bg-[#050510] text-white">
      {/* ═══ CINEMATIC HERO ═══ */}
      <div className="relative overflow-hidden border-b border-blue-500/20" style={{ background: "linear-gradient(135deg, oklch(0.08 0.04 240), oklch(0.06 0.03 270), oklch(0.08 0.04 200))" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="glow-orb w-64 h-64 -top-20 -left-20 opacity-20" style={{ background: "oklch(0.65 0.25 240)" }} />
          <div className="glow-orb w-48 h-48 -bottom-16 right-20 opacity-15" style={{ background: "oklch(0.65 0.25 200)" }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-10">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/" className="text-white/40 hover:text-white/70 text-sm transition-colors">← Back</Link>
            <div className="w-px h-4 bg-white/20" />
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">Enterprise</Badge>
          </div>
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, oklch(0.65 0.25 240), oklch(0.65 0.25 200))", boxShadow: "0 0 24px oklch(0.65 0.25 240 / 0.4)" }}>
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-rainbow">Team Workspace</h1>
                  <p className="text-white/50 text-sm">团队协作空间 · Collaborate, Build, Ship Together</p>
                </div>
              </div>
              <p className="text-white/60 max-w-xl">
                Your unified workspace for team communication, project tracking, file sharing, and real-time collaboration. Built for builders.
              </p>
            </div>
            <div className="hidden md:flex gap-3">
              <div className="text-center px-4 py-2 rounded-xl border border-blue-500/20 bg-blue-500/10">
                <div className="text-2xl font-black text-blue-300 stat-number">24</div>
                <div className="text-xs text-white/40">Members</div>
              </div>
              <div className="text-center px-4 py-2 rounded-xl border border-green-500/20 bg-green-500/10">
                <div className="text-2xl font-black text-green-300 stat-number">8</div>
                <div className="text-xs text-white/40">Active Now</div>
              </div>
              <div className="text-center px-4 py-2 rounded-xl border border-purple-500/20 bg-purple-500/10">
                <div className="text-2xl font-black text-purple-300 stat-number">5</div>
                <div className="text-xs text-white/40">Open Tasks</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs defaultValue="channels">
          <TabsList className="bg-white/5 border border-white/10 mb-6">
            <TabsTrigger value="channels" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300">
              <MessageSquare className="w-4 h-4 mr-2" />Channels
            </TabsTrigger>
            <TabsTrigger value="tasks" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300">
              <CheckSquare className="w-4 h-4 mr-2" />Tasks
            </TabsTrigger>
            <TabsTrigger value="members" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300">
              <Users className="w-4 h-4 mr-2" />Members
            </TabsTrigger>
            <TabsTrigger value="files" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300">
              <Folder className="w-4 h-4 mr-2" />Files
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300">
              <BarChart2 className="w-4 h-4 mr-2" />Analytics
            </TabsTrigger>
          </TabsList>

          {/* CHANNELS TAB */}
          <TabsContent value="channels">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm text-white/70">Channels</CardTitle>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-white/40 hover:text-white">
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    {DEMO_CHANNELS.map(ch => (
                      <button
                        key={ch.id}
                        onClick={() => setActiveChannel(ch.id)}
                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-sm transition-all ${
                          activeChannel === ch.id ? "bg-blue-500/20 text-blue-300" : "text-white/50 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {ch.type === "voice" ? <Video className="w-3 h-3" /> : <Hash className="w-3 h-3" />}
                          <span>{ch.name}</span>
                        </div>
                        {ch.unread > 0 && (
                          <Badge className="bg-blue-500 text-white text-[10px] h-4 px-1 min-w-4 flex items-center justify-center">
                            {ch.unread}
                          </Badge>
                        )}
                      </button>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Chat Area */}
              <div className="lg:col-span-3">
                <Card className="bg-white/5 border-white/10 h-[500px] flex flex-col">
                  <CardHeader className="pb-2 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4 text-white/50" />
                        <span className="font-semibold">{activeChannel}</span>
                        <Badge className="bg-white/10 text-white/50 text-xs">{DEMO_CHANNELS.find(c => c.id === activeChannel)?.members} members</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" className="h-7 text-white/40 hover:text-white text-xs">
                          <Bell className="w-3 h-3 mr-1" />Notify
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 text-white/40 hover:text-white text-xs">
                          <Search className="w-3 h-3 mr-1" />Search
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
                    {/* Demo messages */}
                    {[
                      { user: "Alex Chen", avatar: "AC", msg: "Just pushed the new auth flow to staging 🚀", time: "10:24 AM", color: "oklch(0.65 0.25 240)" },
                      { user: "Sam Park", avatar: "SP", msg: "Looks great! Testing now. The rate limiting is also done.", time: "10:26 AM", color: "oklch(0.65 0.25 140)" },
                      { user: "Jordan Lee", avatar: "JL", msg: "PM update: Q2 analytics report is complete. Check the dashboard.", time: "10:31 AM", color: "oklch(0.65 0.25 70)" },
                      { user: "Riley Zhang", avatar: "RZ", msg: "New design mockups for the onboarding flow are in Figma 🎨", time: "10:45 AM", color: "oklch(0.65 0.25 305)" },
                    ].map((m, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: m.color }}>
                          {m.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm font-semibold">{m.user}</span>
                            <span className="text-xs text-white/30">{m.time}</span>
                          </div>
                          <p className="text-sm text-white/70">{m.msg}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                  <div className="p-3 border-t border-white/10">
                    <div className="flex gap-2">
                      <Input
                        value={messageInput}
                        onChange={e => setMessageInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleSendMessage()}
                        placeholder={`Message #${activeChannel}...`}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 flex-1"
                      />
                      <Button onClick={handleSendMessage} className="bg-blue-500 hover:bg-blue-600 text-white">
                        Send
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* TASKS TAB */}
          <TabsContent value="tasks">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {["all", "todo", "in_progress", "done"].map(f => (
                    <Button
                      key={f}
                      size="sm"
                      variant={taskFilter === f ? "default" : "outline"}
                      onClick={() => setTaskFilter(f)}
                      className={taskFilter === f ? "bg-blue-500 text-white" : "border-white/20 text-white/60 hover:text-white bg-transparent"}
                    >
                      {f === "all" ? "All" : f === "in_progress" ? "In Progress" : f.charAt(0).toUpperCase() + f.slice(1)}
                    </Button>
                  ))}
                </div>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white" size="sm">
                  <Plus className="w-4 h-4 mr-1" />New Task
                </Button>
              </div>
              <div className="space-y-2">
                {filteredTasks.map(task => (
                  <Card key={task.id} className="bg-white/5 border-white/10 hover:border-blue-500/30 transition-all">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckSquare className={`w-4 h-4 ${task.status === "done" ? "text-green-400" : "text-white/30"}`} />
                        <div>
                          <p className={`font-medium text-sm ${task.status === "done" ? "line-through text-white/40" : "text-white"}`}>{task.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-white/40">Assigned to {task.assignee}</span>
                            <span className="text-xs text-white/20">·</span>
                            <span className="text-xs text-white/40">Due {task.due}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${PRIORITY_COLORS[task.priority]}`}>{task.priority.toUpperCase()}</span>
                        <Badge className={`text-xs ${STATUS_COLORS[task.status]}`}>
                          {task.status === "in_progress" ? "In Progress" : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* MEMBERS TAB */}
          <TabsContent value="members">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DEMO_MEMBERS.map(member => (
                <Card key={member.id} className="bg-white/5 border-white/10 hover:border-blue-500/30 transition-all">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: "linear-gradient(135deg, oklch(0.65 0.25 240), oklch(0.65 0.25 200))" }}>
                        {member.avatar}
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#050510] ${MEMBER_STATUS_COLORS[member.status]}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{member.name}</p>
                      <p className="text-xs text-white/40 truncate">{member.role}</p>
                    </div>
                    <Badge className={`text-xs capitalize ${
                      member.status === "online" ? "bg-green-500/20 text-green-400 border-green-500/30" :
                      member.status === "away" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
                      "bg-gray-500/20 text-gray-400 border-gray-500/30"
                    }`}>
                      {member.status}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
              <Card className="bg-white/5 border-white/10 border-dashed hover:border-blue-500/30 transition-all cursor-pointer" onClick={() => toast.info("Invite team members via email or link")}>
                <CardContent className="p-4 flex items-center justify-center gap-2 text-white/30 hover:text-white/60 transition-colors h-full min-h-[80px]">
                  <Plus className="w-5 h-5" />
                  <span className="text-sm">Invite Member</span>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* FILES TAB */}
          <TabsContent value="files">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "Q2 Analytics Report.pdf", size: "2.4 MB", type: "PDF", updated: "2h ago", icon: "📊" },
                { name: "Design System v3.fig", size: "18.7 MB", type: "Figma", updated: "1d ago", icon: "🎨" },
                { name: "API Documentation.md", size: "142 KB", type: "Markdown", updated: "3d ago", icon: "📝" },
                { name: "Backend Architecture.png", size: "1.1 MB", type: "Image", updated: "5d ago", icon: "🏗️" },
                { name: "Team Roadmap 2024.xlsx", size: "890 KB", type: "Excel", updated: "1w ago", icon: "📅" },
                { name: "Brand Assets.zip", size: "45.2 MB", type: "Archive", updated: "2w ago", icon: "📦" },
              ].map((file, i) => (
                <Card key={i} className="bg-white/5 border-white/10 hover:border-blue-500/30 transition-all cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="text-2xl">{file.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{file.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge className="bg-white/10 text-white/50 text-[10px] px-1.5">{file.type}</Badge>
                        <span className="text-xs text-white/30">{file.size}</span>
                        <span className="text-xs text-white/20">·</span>
                        <span className="text-xs text-white/30">{file.updated}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ANALYTICS TAB */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Messages Sent", value: "1,247", change: "+12%", color: "text-blue-400", icon: MessageSquare },
                { label: "Tasks Completed", value: "38", change: "+8%", color: "text-green-400", icon: CheckSquare },
                { label: "Files Shared", value: "94", change: "+23%", color: "text-purple-400", icon: FileText },
                { label: "Active Members", value: "18/24", change: "75%", color: "text-yellow-400", icon: Users },
              ].map((stat, i) => (
                <Card key={i} className="bg-white/5 border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">{stat.change}</Badge>
                    </div>
                    <div className={`text-2xl font-black stat-number ${stat.color}`}>{stat.value}</div>
                    <div className="text-xs text-white/40 mt-1">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-sm text-white/70">Team Activity — This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {DEMO_MEMBERS.slice(0, 4).map(m => (
                    <div key={m.id} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: "linear-gradient(135deg, oklch(0.65 0.25 240), oklch(0.65 0.25 200))" }}>
                        {m.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium">{m.name}</span>
                          <span className="text-xs text-white/40">{Math.floor(Math.random() * 50 + 20)} actions</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: `${Math.floor(Math.random() * 60 + 40)}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Integration Links */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "CRM", href: "/crm", icon: "👥", desc: "Customer management" },
            { label: "Knowledge Base", href: "/knowledge-base", icon: "📚", desc: "Documentation hub" },
            { label: "Automation", href: "/automation-workflows", icon: "⚡", desc: "Workflow automation" },
            { label: "Enterprise", href: "/enterprise", icon: "🏢", desc: "Organization settings" },
          ].map((link, i) => (
            <Link key={i} href={link.href}>
              <Card className="bg-white/5 border-white/10 hover:border-blue-500/30 transition-all cursor-pointer">
                <CardContent className="p-3 flex items-center gap-2">
                  <span className="text-xl">{link.icon}</span>
                  <div>
                    <p className="text-sm font-medium">{link.label}</p>
                    <p className="text-xs text-white/40">{link.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/20 ml-auto" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
