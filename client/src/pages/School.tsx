import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BookOpen, Search, Star, Clock, Users, Trophy, Brain, Code2,
  TrendingUp, Shield, Coins, Gamepad2, Globe, Play, Award,
  Target, GraduationCap, BarChart3, Lock, Sparkles, ArrowRight,
  Video, BookMarked, Layers, Flame
} from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "All Courses", icon: Layers },
  { id: "blockchain", label: "Blockchain", icon: Coins },
  { id: "defi", label: "DeFi & Trading", icon: TrendingUp },
  { id: "ai", label: "AI & ML", icon: Brain },
  { id: "web3", label: "Web3 Dev", icon: Code2 },
  { id: "security", label: "Security", icon: Shield },
  { id: "nft", label: "NFTs", icon: Sparkles },
  { id: "gaming", label: "GameFi", icon: Gamepad2 },
  { id: "creator", label: "Creator", icon: Globe },
];

const COURSES = [
  { id: 1, slug: "blockchain-fundamentals", category: "blockchain", title: "Blockchain Fundamentals", subtitle: "Master distributed ledger technology", instructor: "Dr. Alex Chen", instructorAvatar: "AC", level: "Beginner", duration: "12h 30m", lessons: 48, students: 24891, rating: 4.9, reviews: 3241, price: 0, tags: ["Bitcoin", "Ethereum", "Consensus"], thumbnail: "🔗", color: "from-yellow-500/20 to-orange-500/20", border: "border-yellow-500/30", badge: "Most Popular", badgeColor: "bg-yellow-500/20 text-yellow-400", description: "Learn how blockchain works from the ground up. Covers consensus mechanisms, cryptographic hashing, smart contracts, and real-world applications." },
  { id: 2, slug: "defi-mastery", category: "defi", title: "DeFi Mastery", subtitle: "Yield farming, liquidity pools, protocol analysis", instructor: "Sarah Kim", instructorAvatar: "SK", level: "Intermediate", duration: "18h 45m", lessons: 72, students: 18234, rating: 4.8, reviews: 2187, price: 299, tags: ["Uniswap", "Aave", "Yield Farming"], thumbnail: "💎", color: "from-green-500/20 to-emerald-500/20", border: "border-purple-500/30", badge: "Top Rated", badgeColor: "bg-purple-600/20 text-purple-400", description: "Deep dive into decentralized finance. Navigate DEXs, optimize yield strategies, manage risk, and analyze protocol tokenomics." },
  { id: 3, slug: "ai-trading-systems", category: "ai", title: "AI Trading Systems", subtitle: "Build algorithmic trading bots with ML", instructor: "Marcus Webb", instructorAvatar: "MW", level: "Advanced", duration: "24h 15m", lessons: 96, students: 12456, rating: 4.9, reviews: 1876, price: 599, tags: ["Python", "TensorFlow", "Backtesting"], thumbnail: "🤖", color: "from-purple-500/20 to-violet-500/20", border: "border-purple-500/30", badge: "New", badgeColor: "bg-purple-500/20 text-purple-400", description: "Build production-grade AI trading systems. Covers sentiment analysis, price prediction models, backtesting frameworks, and live deployment." },
  { id: 4, slug: "solidity-smart-contracts", category: "web3", title: "Solidity Smart Contracts", subtitle: "Write, test, and deploy production contracts", instructor: "Elena Vasquez", instructorAvatar: "EV", level: "Intermediate", duration: "20h 00m", lessons: 80, students: 21034, rating: 4.7, reviews: 2934, price: 399, tags: ["Solidity", "Hardhat", "ERC-20"], thumbnail: "⚡", color: "from-blue-500/20 to-cyan-500/20", border: "border-blue-500/30", badge: "Bestseller", badgeColor: "bg-blue-500/20 text-blue-400", description: "Master Solidity from basics to advanced patterns. Build ERC-20 tokens, NFT contracts, DAOs, and DeFi protocols with security best practices." },
  { id: 5, slug: "crypto-security", category: "security", title: "Crypto Security Masterclass", subtitle: "Protect assets and audit smart contracts", instructor: "James Park", instructorAvatar: "JP", level: "Advanced", duration: "16h 30m", lessons: 64, students: 8923, rating: 4.8, reviews: 1123, price: 499, tags: ["Auditing", "Reentrancy", "MEV"], thumbnail: "🛡️", color: "from-red-500/20 to-rose-500/20", border: "border-red-500/30", badge: "Expert", badgeColor: "bg-red-500/20 text-red-400", description: "Identify and prevent the most critical vulnerabilities in DeFi. Covers reentrancy attacks, flash loan exploits, MEV, and secure key management." },
  { id: 6, slug: "nft-creation", category: "nft", title: "NFT Creation & Business", subtitle: "Launch, market, and monetize NFT collections", instructor: "Aria Johnson", instructorAvatar: "AJ", level: "Beginner", duration: "10h 15m", lessons: 40, students: 31245, rating: 4.6, reviews: 4521, price: 0, tags: ["Art", "IPFS", "Royalties"], thumbnail: "🎨", color: "from-pink-500/20 to-fuchsia-500/20", border: "border-pink-500/30", badge: "Trending", badgeColor: "bg-pink-500/20 text-pink-400", description: "Create and launch a successful NFT collection. Covers digital art creation, metadata standards, IPFS storage, and community building." },
  { id: 7, slug: "gamefi-p2e", category: "gaming", title: "GameFi & Play-to-Earn", subtitle: "Design blockchain gaming economies", instructor: "Tyler Storm", instructorAvatar: "TS", level: "Intermediate", duration: "14h 00m", lessons: 56, students: 15678, rating: 4.7, reviews: 1892, price: 349, tags: ["Unity", "P2E", "Token Economics"], thumbnail: "🎮", color: "from-orange-500/20 to-amber-500/20", border: "border-orange-500/30", badge: "Hot", badgeColor: "bg-orange-500/20 text-orange-400", description: "Build the next generation of blockchain games. Learn P2E mechanics, NFT item systems, in-game economies, and sustainable tokenomics design." },
  { id: 8, slug: "web3-creator", category: "creator", title: "Web3 Creator Economy", subtitle: "Monetize content with crypto and NFTs", instructor: "Mia Chen", instructorAvatar: "MC", level: "Beginner", duration: "8h 45m", lessons: 35, students: 28934, rating: 4.8, reviews: 3876, price: 0, tags: ["Social Tokens", "DAOs", "Token Gating"], thumbnail: "🌟", color: "from-cyan-500/20 to-teal-500/20", border: "border-cyan-500/30", badge: "Free", badgeColor: "bg-cyan-500/20 text-cyan-400", description: "Transform your creative work with Web3 tools. Learn social tokens, NFT memberships, token-gated content, and DAO governance for creators." },
  { id: 9, slug: "tokenomics-design", category: "defi", title: "Tokenomics Design", subtitle: "Engineer sustainable crypto economies", instructor: "Dr. Raj Patel", instructorAvatar: "RP", level: "Advanced", duration: "22h 00m", lessons: 88, students: 9234, rating: 4.9, reviews: 1234, price: 699, tags: ["Vesting", "Supply", "Game Theory"], thumbnail: "📊", color: "from-violet-500/20 to-purple-500/20", border: "border-violet-500/30", badge: "Premium", badgeColor: "bg-violet-500/20 text-violet-400", description: "Design token economies that last. Covers supply mechanics, vesting schedules, incentive alignment, game theory, and real tokenomics case studies." },
  { id: 10, slug: "zero-knowledge", category: "security", title: "Zero-Knowledge Proofs", subtitle: "Privacy-preserving cryptography for Web3", instructor: "Dr. Yuki Tanaka", instructorAvatar: "YT", level: "Expert", duration: "28h 30m", lessons: 112, students: 4521, rating: 5.0, reviews: 678, price: 899, tags: ["ZK-SNARKs", "Circom", "StarkNet"], thumbnail: "🔐", color: "from-slate-500/20 to-zinc-500/20", border: "border-slate-500/30", badge: "Expert", badgeColor: "bg-slate-500/20 text-slate-400", description: "Master zero-knowledge cryptography. Build ZK circuits, implement ZK-SNARKs, and deploy privacy-preserving applications on StarkNet and zkSync." },
  { id: 11, slug: "dao-governance", category: "blockchain", title: "DAO Governance & Ops", subtitle: "Launch and run a decentralized organization", instructor: "Carlos Rivera", instructorAvatar: "CR", level: "Intermediate", duration: "15h 00m", lessons: 60, students: 11234, rating: 4.7, reviews: 1456, price: 299, tags: ["Snapshot", "Gnosis Safe", "Treasury"], thumbnail: "🏛️", color: "from-amber-500/20 to-yellow-500/20", border: "border-amber-500/30", badge: "Popular", badgeColor: "bg-amber-500/20 text-amber-400", description: "Build and operate a DAO from scratch. Covers governance frameworks, voting mechanisms, treasury management, and contributor incentives." },
  { id: 12, slug: "sky444-ecosystem", category: "blockchain", title: "SKYCOIN4444 Ecosystem", subtitle: "Master the full SKY444 platform", instructor: "Skyler Spillers", instructorAvatar: "SS", level: "Beginner", duration: "6h 00m", lessons: 24, students: 45678, rating: 5.0, reviews: 6789, price: 0, tags: ["SKY444", "Staking", "Social"], thumbnail: "🚀", color: "from-primary/20 to-green-500/20", border: "border-primary/30", badge: "Official", badgeColor: "bg-primary/20 text-primary", description: "The official SKYCOIN4444 onboarding course. Learn every platform feature, earn SKY444 rewards for completion, and become a certified ecosystem expert." },
];

export default function School() {
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [activeTab, setActiveTab] = useState<"courses" | "tracks" | "my-learning">("courses");

  const filtered = COURSES.filter(c => {
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchCat = selectedCategory === "all" || c.category === selectedCategory;
    const matchLevel = selectedLevel === "all" || c.level.toLowerCase() === selectedLevel;
    return matchSearch && matchCat && matchLevel;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-border/50 bg-gradient-to-br from-primary/5 via-background to-purple-500/5">
        <div className="container py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono mb-6">
              <GraduationCap className="h-3.5 w-3.5" /> SKY SCHOOL — LEARN. EARN. BUILD.
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Master <span className="text-primary">Web3</span> &amp; <span className="text-purple-400">AI</span><br />Earn While You Learn
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl">World-class courses on blockchain, DeFi, AI trading, and Web3 development. Complete courses to earn SKY444 rewards and verifiable on-chain certificates.</p>
            <div className="flex flex-wrap gap-6 text-sm">
              {[{ icon: BookOpen, label: "12 Courses", color: "text-primary" }, { icon: Users, label: "231K+ Students", color: "text-blue-400" }, { icon: Trophy, label: "On-Chain Certs", color: "text-yellow-400" }, { icon: Coins, label: "Earn SKY444", color: "text-purple-400" }].map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex items-center gap-2"><Icon className={`h-4 w-4 ${color}`} /><span className="font-medium">{label}</span></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[{ label: "Total Students", value: "231K+", icon: Users, color: "text-blue-400" }, { label: "Courses Available", value: "12", icon: BookOpen, color: "text-primary" }, { label: "SKY444 Earned", value: "8.4M", icon: Coins, color: "text-yellow-400" }, { label: "Certificates Issued", value: "47K", icon: Award, color: "text-purple-400" }].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-xl border border-border/50 bg-card/50 p-4 text-center">
              <Icon className={`h-5 w-5 ${color} mx-auto mb-2`} />
              <div className="text-2xl font-bold font-mono">{value}</div>
              <div className="text-xs text-muted-foreground mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-border/50">
          {[{ id: "courses", label: "All Courses", icon: BookOpen }, { id: "tracks", label: "Learning Tracks", icon: Target }, { id: "my-learning", label: "My Learning", icon: BarChart3 }].map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id as any)} className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px ${activeTab === id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              <Icon className="h-4 w-4" />{label}
            </button>
          ))}
        </div>

        {activeTab === "courses" && (
          <>
            <div className="flex flex-col md:flex-row gap-3 mb-5">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search courses, topics..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-card/50 border-border/50" />
              </div>
              <select value={selectedLevel} onChange={e => setSelectedLevel(e.target.value)} className="px-3 py-2 rounded-lg border border-border/50 bg-card/50 text-sm text-foreground">
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>
            <div className="flex gap-2 flex-wrap mb-6">
              {CATEGORIES.map(cat => {
                const Icon = cat.icon;
                return (
                  <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${selectedCategory === cat.id ? "border-primary bg-primary/10 text-primary" : "border-border/50 bg-card/30 text-muted-foreground hover:text-foreground"}`}>
                    <Icon className="h-3 w-3" />{cat.label}
                  </button>
                );
              })}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(course => (
                <Link key={course.id} href={`/school/course/${course.slug}`}>
                  <div className={`rounded-xl border ${course.border} bg-gradient-to-br ${course.color} hover:scale-[1.02] transition-all duration-200 cursor-pointer group overflow-hidden`}>
                    <div className="relative h-32 flex items-center justify-center bg-card/30 border-b border-border/30">
                      <span className="text-5xl">{course.thumbnail}</span>
                      <div className="absolute top-3 left-3"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${course.badgeColor}`}>{course.badge}</span></div>
                      <div className="absolute top-3 right-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${course.level === "Beginner" ? "border-purple-500/40 text-purple-400 bg-purple-600/10" : course.level === "Intermediate" ? "border-blue-500/40 text-blue-400 bg-blue-500/10" : course.level === "Advanced" ? "border-orange-500/40 text-orange-400 bg-orange-500/10" : "border-red-500/40 text-red-400 bg-red-500/10"}`}>{course.level}</span></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold"><Play className="h-4 w-4" /> Preview</div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors line-clamp-1">{course.title}</h3>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{course.description}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{course.duration}</span>
                        <span className="flex items-center gap-1"><Video className="h-3 w-3" />{course.lessons}</span>
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" />{course.students.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs font-bold">{course.rating}</span>
                          <span className="text-xs text-muted-foreground">({course.reviews.toLocaleString()})</span>
                        </div>
                        <div className={`text-sm font-bold ${course.price === 0 ? "text-purple-400" : "text-primary"}`}>{course.price === 0 ? "FREE" : `${course.price} SKY444`}</div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {activeTab === "tracks" && (
          <div className="space-y-4">
            {[
              { id: "defi-dev", label: "DeFi Developer", courses: [1,2,4,9], icon: "💰", xp: 2400, desc: "From blockchain basics to advanced DeFi protocol development" },
              { id: "ai-quant", label: "AI Quant Trader", courses: [3,2,9], icon: "🤖", xp: 1800, desc: "Build ML-powered trading systems and algorithmic strategies" },
              { id: "web3-builder", label: "Web3 Builder", courses: [1,4,11], icon: "⚡", xp: 2100, desc: "Full-stack Web3 development from smart contracts to dApps" },
              { id: "security-expert", label: "Security Expert", courses: [5,1,10], icon: "🛡️", xp: 2700, desc: "Master smart contract auditing and cryptographic security" },
            ].map(track => {
              const trackCourses = COURSES.filter(c => track.courses.includes(c.id));
              return (
                <div key={track.id} className="rounded-xl border border-border/50 bg-card/30 p-6 hover:border-primary/30 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{track.icon}</span>
                      <div>
                        <h3 className="font-bold text-lg">{track.label}</h3>
                        <p className="text-sm text-muted-foreground">{track.desc}</p>
                        <p className="text-xs text-muted-foreground mt-1">{trackCourses.length} courses · {track.xp.toLocaleString()} XP</p>
                      </div>
                    </div>
                    <Button size="sm" className="bg-primary text-primary-foreground">Start Track <ArrowRight className="h-3.5 w-3.5 ml-1" /></Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {trackCourses.map(c => (
                      <Link key={c.id} href={`/school/course/${c.slug}`}>
                        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-background/50 border border-border/30 hover:border-primary/30 transition-all text-xs cursor-pointer">
                          <span className="text-lg">{c.thumbnail}</span>
                          <div><div className="font-medium line-clamp-1">{c.title}</div><div className="text-muted-foreground">{c.duration}</div></div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "my-learning" && (
          <div className="text-center py-16">
            {isAuthenticated ? (
              <>
                <BookMarked className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No courses enrolled yet</h3>
                <p className="text-muted-foreground text-sm mb-6">Enroll in a course to start your learning journey and earn SKY444 rewards.</p>
                <Button onClick={() => setActiveTab("courses")} className="bg-primary text-primary-foreground">Browse Courses</Button>
              </>
            ) : (
              <>
                <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Sign in to track your progress</h3>
                <p className="text-muted-foreground text-sm mb-6">Create an account to enroll in courses, track progress, and earn certificates.</p>
                <Link href="/signup"><Button className="bg-primary text-primary-foreground">Get Started Free</Button></Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
