import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "wouter";
import {
  Crown, Hammer, Brain, Zap, Heart, Building2, CheckCircle2,
  Star, Shield, Code2, Globe, Cpu, Lock, TrendingUp, Users,
  Award, BookOpen, Github, ExternalLink, Sparkles, ChevronRight,
  BarChart3, Layers, Database, Server, Flame
} from "lucide-react";

const ICON_MAP: Record<string, React.ReactNode> = {
  hammer: <Hammer className="w-5 h-5" />,
  brain: <Brain className="w-5 h-5" />,
  zap: <Zap className="w-5 h-5" />,
  cross: <Star className="w-5 h-5" />,
  heart: <Heart className="w-5 h-5" />,
  building: <Building2 className="w-5 h-5" />,
  check: <CheckCircle2 className="w-5 h-5" />,
  crown: <Crown className="w-5 h-5" />,
};

const SKILL_ICONS: Record<string, React.ReactNode> = {
  "Full-Stack Software Engineering": <Code2 className="w-4 h-4" />,
  "AI & Machine Learning Systems": <Brain className="w-4 h-4" />,
  "Web3 & Blockchain Architecture": <Layers className="w-4 h-4" />,
  "Cybersecurity & Threat Modeling": <Shield className="w-4 h-4" />,
  "IT Consulting & Enterprise Solutions": <Building2 className="w-4 h-4" />,
  "Ecosystem Design & Platform Strategy": <Globe className="w-4 h-4" />,
  "Cloud Infrastructure & DevOps": <Server className="w-4 h-4" />,
  "Crypto Token Economics": <TrendingUp className="w-4 h-4" />,
};

const ACHIEVEMENT_COLORS: Record<string, string> = {
  solo_builder: "from-orange-500 to-red-500",
  ai_architect: "from-purple-500 to-fuchsia-500",
  web3_pioneer: "from-cyan-500 to-blue-500",
  god_first: "from-yellow-400 to-amber-500",
  father_3: "from-pink-500 to-rose-500",
  iitr_ceo: "from-emerald-500 to-teal-500",
  "1851_tests": "from-green-500 to-emerald-500",
  legendary_status: "from-yellow-400 to-orange-500",
};

function StatCard({ value, label, icon }: { value: string | number; label: string; icon: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-1 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-yellow-500/30 transition-all">
      <div className="text-yellow-400/80 mb-1">{icon}</div>
      <div className="text-2xl font-black text-white">{typeof value === "number" ? value.toLocaleString() : value}</div>
      <div className="text-xs text-white/50 text-center">{label}</div>
    </div>
  );
}

export default function LegendaryStatus() {
  const { data: profile, isLoading } = trpc.legendary.founderProfile.useQuery();
  const { data: metrics } = trpc.legendary.platformMetrics.useQuery();

  // Use uploaded photo URL
  const photoUrl = "/manus-storage/Screenshot_20260618-004749_Facebook_a1b2c3d4.png";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[oklch(0.08_0.02_280)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Crown className="w-12 h-12 text-yellow-400 animate-pulse" />
          <div className="text-white/50 text-sm">Loading Legendary Profile…</div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-[oklch(0.08_0.02_280)] text-white">
      {/* Hero — Legendary Banner */}
      <div className="relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-orange-500/10 to-purple-500/20 animate-pulse" style={{ animationDuration: "4s" }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.72_0.28_70/0.15),transparent_60%)]" />

        {/* Legendary crown particles */}
        <div className="absolute top-8 left-1/4 w-2 h-2 bg-yellow-400 rounded-full opacity-60 animate-bounce" style={{ animationDelay: "0s" }} />
        <div className="absolute top-16 right-1/3 w-1.5 h-1.5 bg-orange-400 rounded-full opacity-50 animate-bounce" style={{ animationDelay: "0.5s" }} />
        <div className="absolute top-12 left-2/3 w-1 h-1 bg-yellow-300 rounded-full opacity-70 animate-bounce" style={{ animationDelay: "1s" }} />

        <div className="relative max-w-5xl mx-auto px-4 pt-16 pb-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-36 h-36 rounded-2xl overflow-hidden border-4 border-yellow-400/60 shadow-[0_0_40px_oklch(0.72_0.28_70/0.4)]">
                <img
                  src={photoUrl}
                  alt="Skyler Blue Spillers"
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                    (e.target as HTMLImageElement).parentElement!.innerHTML =
                      '<div class="w-full h-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-5xl font-black text-black">S</div>';
                  }}
                />
              </div>
              {/* Legendary badge */}
              <div className="absolute -bottom-3 -right-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-2 shadow-lg border-2 border-black">
                <Crown className="w-5 h-5 text-black" />
              </div>
            </div>

            {/* Name + Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start mb-2">
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black text-xs px-3 py-1 border-0">
                  ✦ LEGENDARY
                </Badge>
                <Badge className="bg-white/10 text-white/70 text-xs border-white/20">
                  PLATFORM FOUNDER
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-300 text-xs border-purple-500/30">
                  TOP 0.001%
                </Badge>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-white mb-1 tracking-tight">
                {profile.name}
              </h1>
              <p className="text-yellow-400/80 font-semibold text-lg mb-1">{profile.title}</p>
              <p className="text-white/60 text-sm mb-3">{profile.role} · {profile.company}</p>

              {/* Faith + Family */}
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                <span className="flex items-center gap-1.5 text-yellow-300 text-sm font-medium">
                  <Star className="w-4 h-4 fill-yellow-300" /> {profile.faith}
                </span>
                <span className="text-white/30">·</span>
                <span className="flex items-center gap-1.5 text-pink-300 text-sm font-medium">
                  <Heart className="w-4 h-4 fill-pink-300" /> {profile.family}
                </span>
              </div>

              {/* Degrees */}
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                {profile.degrees.map((d, i) => (
                  <div key={i} className="flex items-center gap-1.5 bg-white/8 border border-white/15 rounded-lg px-3 py-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-white/80 text-xs font-semibold">{d.level} {d.field}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Link href="/profile">
                  <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold hover:opacity-90 gap-2">
                    <Crown className="w-4 h-4" /> View Full Profile
                  </Button>
                </Link>
                <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="border-white/20 text-white/70 hover:text-white gap-2">
                    <Github className="w-4 h-4" /> GitHub
                  </Button>
                </a>
                <Link href="/social">
                  <Button variant="outline" className="border-cyan-500/30 text-cyan-400 hover:text-cyan-300 gap-2">
                    <Users className="w-4 h-4" /> Social Feed
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-yellow-400" />
          <h2 className="text-lg font-bold text-white">Platform Built by One Person</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <StatCard value={profile.platformStats.pagesBuilt} label="Pages Built" icon={<Layers className="w-4 h-4" />} />
          <StatCard value={profile.platformStats.linesOfCode.toLocaleString()} label="Lines of Code" icon={<Code2 className="w-4 h-4" />} />
          <StatCard value={profile.platformStats.testsWritten.toLocaleString()} label="Tests Passing" icon={<CheckCircle2 className="w-4 h-4" />} />
          <StatCard value={profile.platformStats.dbTables} label="DB Tables" icon={<Database className="w-4 h-4" />} />
          <StatCard value={profile.platformStats.routerNamespaces} label="API Namespaces" icon={<Server className="w-4 h-4" />} />
          <StatCard value={`${profile.platformStats.yearsBuilding}yr`} label="Building" icon={<Flame className="w-4 h-4" />} />
        </div>

        {/* Live metrics from DB */}
        {metrics && (
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard value={metrics.totalUsers} label="Total Users" icon={<Users className="w-4 h-4" />} />
            <StatCard value={metrics.totalPosts} label="Total Posts" icon={<Globe className="w-4 h-4" />} />
            <StatCard value={metrics.platformValue} label="Platform Value" icon={<TrendingUp className="w-4 h-4" />} />
            <StatCard value={metrics.uptime} label="Uptime" icon={<Shield className="w-4 h-4" />} />
          </div>
        )}
      </div>

      {/* Achievements */}
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-yellow-400" />
          <h2 className="text-lg font-bold text-white">Legendary Achievements</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {profile.achievements.map((ach) => (
            <Tooltip key={ach.id}>
              <TooltipTrigger asChild>
                <div className={`relative p-4 rounded-xl bg-gradient-to-br ${ACHIEVEMENT_COLORS[ach.id] || "from-white/10 to-white/5"} bg-opacity-10 border border-white/10 cursor-default hover:scale-105 transition-transform`}>
                  <div className="absolute inset-0 rounded-xl bg-black/60" />
                  <div className="relative flex flex-col items-center gap-2 text-center">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${ACHIEVEMENT_COLORS[ach.id] || "from-white/20 to-white/10"} flex items-center justify-center text-white`}>
                      {ICON_MAP[ach.icon] || <Star className="w-5 h-5" />}
                    </div>
                    <div className="text-sm font-bold text-white">{ach.label}</div>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-black/90 border-white/20 text-white text-xs max-w-[160px] text-center">
                {ach.desc}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="flex items-center gap-2 mb-4">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">Core Skills</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {profile.skills.map((skill) => (
            <div key={skill} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all">
              <div className="text-cyan-400 flex-shrink-0">
                {SKILL_ICONS[skill] || <Code2 className="w-4 h-4" />}
              </div>
              <span className="text-sm text-white/80 font-medium">{skill}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Company Section */}
      <div className="max-w-5xl mx-auto px-4 py-4 pb-16">
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Building2 className="w-5 h-5 text-emerald-400" />
              {profile.company}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              Innovative Information Technology Resolutions LLC (IITR LLC) is a technology consulting and software development company specializing in custom AI systems, cybersecurity solutions, cloud infrastructure, and enterprise IT strategy. Founded and led by Skyler Blue Spillers, IITR LLC delivers cutting-edge technology solutions to businesses of all sizes.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "AI Systems", icon: <Brain className="w-4 h-4 text-purple-400" /> },
                { label: "Cybersecurity", icon: <Shield className="w-4 h-4 text-red-400" /> },
                { label: "Cloud & DevOps", icon: <Server className="w-4 h-4 text-blue-400" /> },
                { label: "IT Consulting", icon: <Building2 className="w-4 h-4 text-emerald-400" /> },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10">
                  {s.icon}
                  <span className="text-xs text-white/70">{s.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reputation Score */}
        <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 text-center">
          <div className="text-yellow-400 text-sm font-semibold mb-1 uppercase tracking-widest">Reputation Score</div>
          <div className="text-6xl font-black text-white mb-1">
            {profile.reputationScore.toLocaleString()}
          </div>
          <div className="text-white/50 text-sm">Top 0.001% of all platform builders worldwide</div>
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <Link href="/social">
              <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0 gap-1">
                <Users className="w-3.5 h-3.5" /> Go Social <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
            <Link href="/crypto-hub">
              <Button size="sm" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black border-0 gap-1">
                <Zap className="w-3.5 h-3.5" /> Mine Now <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
            <Link href="/ai-brain">
              <Button size="sm" className="bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white border-0 gap-1">
                <Brain className="w-3.5 h-3.5" /> AI Brain <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
            <Link href="/investor">
              <Button size="sm" variant="outline" className="border-white/20 text-white/70 gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Investor Room <ExternalLink className="w-3 h-3" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
