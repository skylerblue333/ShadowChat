import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Coins, Users, Heart, Zap, Shield, Globe, Star, Play, Trophy, Cpu, BookOpen } from "lucide-react";

const SKYLER_PHOTO = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400";
const TEAM_PHOTOS = [
  { name: "Skyler Blue", role: "Founder & CEO", photo: SKYLER_PHOTO, bio: "Software engineer turned Web3 builder. Started SkyCoin4444 to create a platform where everyone earns from what they love." },
  { name: "Hope AI", role: "AI Core System", photo: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400", bio: "The intelligence layer powering every recommendation, moderation decision, and personalized experience on the platform." },
];

const STATS = [
  { label: "Active Users", value: "48,200+", icon: Users, color: "text-cyan-400" },
  { label: "SKY444 Distributed", value: "2.4M+", icon: Coins, color: "text-yellow-400" },
  { label: "Charities Funded", value: "$127K+", icon: Heart, color: "text-pink-400" },
  { label: "Games Played", value: "890K+", icon: Trophy, color: "text-purple-400" },
];

const FEATURES = [
  { icon: Play, title: "Watch & Earn", desc: "Earn SKY444 just by watching videos. Puzzle mini-games during breaks multiply your rewards.", color: "from-cyan-500 to-blue-600" },
  { icon: Cpu, title: "Mine Crypto", desc: "Browser-based SKY444 mining. No hardware needed. Start earning in seconds.", color: "from-orange-500 to-yellow-500" },
  { icon: Heart, title: "Gaming for Charity", desc: "Every game you play donates to verified charities. Fun with real-world impact.", color: "from-pink-500 to-red-500" },
  { icon: BookOpen, title: "Sky School", desc: "Learn Web3, AI, and crypto from real practitioners. Earn certificates on-chain.", color: "from-green-500 to-emerald-600" },
  { icon: Zap, title: "Hope AI", desc: "Your personal AI assistant with voice commands, 44 specialized agents, and real-time market intelligence.", color: "from-purple-500 to-violet-600" },
  { icon: Globe, title: "Creator Economy", desc: "Post, stream, sell, and earn. Subscriptions, tips, and exclusive drops — all in one place.", color: "from-indigo-500 to-blue-600" },
];

const TIMELINE = [
  { year: "2023", event: "SkyCoin4444 concept born — one platform for social, crypto, and impact" },
  { year: "2024 Q1", event: "Core team assembled. Backend architecture designed. First 100 beta users." },
  { year: "2024 Q3", event: "Hope AI integrated. Watch-to-Earn and mining launched. 10K users." },
  { year: "2025 Q1", event: "Sky School opens. Gaming for Charity raises $50K. 30K users." },
  { year: "2025 Q4", event: "Marketplace launches. 44 AI agents deployed. 48K+ active users." },
  { year: "2026", event: "ICO launch. Token listed. Full DeFi suite. Global expansion." },
];

export default function About() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-transparent" />
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl" />
        <div className="absolute bottom-0 left-20 w-64 h-64 rounded-full bg-purple-500/5 blur-3xl" />
        <div className="max-w-6xl mx-auto px-4 py-24 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                Built by Skyler Blue
              </Badge>
              <h1 className="text-5xl font-black leading-tight mb-6">
                One Platform.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                  Infinite Opportunity.
                </span>
              </h1>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                SkyCoin4444 started with a simple idea: what if the time you spend online actually paid you back? 
                Watch videos, play games, learn, create, and connect — all while earning real cryptocurrency.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold px-6 py-3 rounded-xl">
                    Get Started <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/watch-earn">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/5 px-6 py-3 rounded-xl">
                    <Play className="w-4 h-4 mr-2" />Watch & Earn
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="w-full aspect-square max-w-md mx-auto relative">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 blur-xl" />
                <img
                  src={SKYLER_PHOTO}
                  alt="Skyler Blue — Founder"
                  className="relative w-full h-full object-cover rounded-3xl border border-white/10"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <div className="font-bold">Skyler Blue</div>
                  <div className="text-sm text-cyan-400">Founder & CEO · Software Engineer</div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 rounded-full bg-purple-600" />
                    <span className="text-xs text-gray-400">Online · Building the future</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/5 bg-[#0d1220]/50">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black mb-4">Everything in One Place</h2>
          <p className="text-gray-400 text-lg">Six ways to earn, learn, and connect — all powered by SKY444</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="bg-[#111827] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all group">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Founder Story */}
      <section className="bg-[#0d1220]/50 border-y border-white/5">
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4">The Story</h2>
          </div>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 to-purple-500" />
            <div className="space-y-8 pl-12">
              {TIMELINE.map((item, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-10 w-4 h-4 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 border-2 border-[#0a0e1a]" />
                  <div className="bg-[#111827] border border-white/5 rounded-xl p-4">
                    <Badge className="mb-2 bg-cyan-500/10 border-cyan-500/30 text-cyan-400 text-xs">{item.year}</Badge>
                    <p className="text-gray-300">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/10 rounded-3xl p-12">
          <h2 className="text-4xl font-black mb-4">Ready to Start Earning?</h2>
          <p className="text-gray-400 text-lg mb-8">Join 48,200+ users already earning SKY444 every day</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold px-8 py-4 rounded-xl text-lg">
                Create Account <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/mining">
              <Button variant="outline" className="border-orange-500/40 text-orange-400 hover:bg-orange-500/10 px-8 py-4 rounded-xl text-lg">
                <Cpu className="w-5 h-5 mr-2" />Start Mining
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
