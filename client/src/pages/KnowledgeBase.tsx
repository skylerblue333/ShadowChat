import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen, Search, FileText, HelpCircle, ChevronRight, Star,
  Clock, Users, Zap, Shield, Coins, Bot, MessageSquare, TrendingUp,
  Play,
} from "lucide-react";

const CATEGORIES = [
  { icon: Bot, name: "Hope AI", articles: 24, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
  { icon: Coins, name: "Crypto & Staking", articles: 18, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
  { icon: Shield, name: "Privacy & Security", articles: 15, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
  { icon: TrendingUp, name: "Trading & DeFi", articles: 22, color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
  { icon: MessageSquare, name: "Social & Community", articles: 12, color: "text-pink-400", bg: "bg-pink-500/10 border-pink-500/20" },
  { icon: Zap, name: "Getting Started", articles: 8, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
];

const ARTICLES = [
  { title: "How to connect your wallet to SKYCOIN4444", category: "Getting Started", views: 12400, time: "3 min", rating: 4.9, href: "#" },
  { title: "Understanding SKY444 staking rewards and APY", category: "Crypto & Staking", views: 8900, time: "5 min", rating: 4.8, href: "#" },
  { title: "Activating Ghost Mode for maximum privacy", category: "Privacy & Security", views: 6700, time: "4 min", rating: 4.9, href: "#" },
  { title: "Using Hope AI to execute multi-step actions", category: "Hope AI", views: 15200, time: "6 min", rating: 5.0, href: "#" },
  { title: "Setting up Shadow Relay for anonymous routing", category: "Privacy & Security", views: 4300, time: "7 min", rating: 4.7, href: "#" },
  { title: "Creating and monetizing your creator channel", category: "Social & Community", views: 9800, time: "8 min", rating: 4.8, href: "#" },
  { title: "AI trading bot strategies and risk management", category: "Trading & DeFi", views: 11000, time: "10 min", rating: 4.6, href: "#" },
  { title: "Participating in DAO governance and voting", category: "Crypto & Staking", views: 5600, time: "4 min", rating: 4.7, href: "#" },
];

const VIDEOS = [
  { title: "Platform Overview: SKYCOIN4444 in 5 Minutes", duration: "5:12", views: "24K", thumbnail: "🎬" },
  { title: "Hope AI Deep Dive: Gray Area Features", duration: "12:34", views: "18K", thumbnail: "🤖" },
  { title: "Staking Tutorial: Earn Passive Income", duration: "8:45", views: "31K", thumbnail: "💰" },
  { title: "Privacy Masterclass: Ghost Mode + Tor Bridge", duration: "15:20", views: "9K", thumbnail: "🛡️" },
  { title: "DHgate Marketplace: Finding & Ordering Products", duration: "6:58", views: "14K", thumbnail: "🛍️" },
  { title: "Voice Commands: Navigate the Platform Hands-Free", duration: "4:22", views: "7K", thumbnail: "🎤" },
];

const FAQS = [
  { q: "What is SKYCOIN4444?", a: "SKYCOIN4444 is a fully integrated AI-powered Web3 social ecosystem combining social media, DeFi, gaming, marketplace, governance, and privacy tools into one platform." },
  { q: "When is the SKY444 ICO?", a: "The public ICO launches on April 24, 2027. Early access and whitelist spots are available through the ICO Launchpad page." },
  { q: "How does Hope AI work?", a: "Hope AI reads your behavioral signals (typing cadence, scroll depth, session time) to infer your emotional state and respond with the appropriate tone. It can also execute platform actions from natural language commands." },
  { q: "Is my data private?", a: "Yes. You can activate Ghost Mode to mask your identity, use Shadow Relay for anonymous routing, or connect through Tor Bridge. All privacy tools are built-in and require no external software." },
  { q: "How do I earn on the platform?", a: "You can earn through staking SKY444 tokens, creating content and receiving tips, selling in the marketplace, participating in tournaments, completing AI tasks, and through the DHgate affiliate program." },
  { q: "What wallets are supported?", a: "MetaMask, WalletConnect, Coinbase Wallet, and any EVM-compatible wallet. The platform also has a built-in custodial wallet for new users." },
];

export default function KnowledgeBase() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("articles");

  const filtered = ARTICLES.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto py-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-white/50 text-xs font-mono mb-4">
          <BookOpen className="w-3 h-3" /> KNOWLEDGE BASE
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-3">How can we help?</h1>
        <p className="text-white/50 mb-6">Search our docs, guides, and video tutorials</p>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
          <Input
            placeholder="Search articles, guides, FAQs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-12 h-12 bg-white/5 border-white/10 text-base"
          />
        </div>
        <div className="flex flex-wrap justify-center gap-2 mt-3">
          {["Wallet Setup", "Staking", "Hope AI", "Privacy", "Trading"].map(tag => (
            <button key={tag} onClick={() => setSearch(tag)} className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-colors">
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {CATEGORIES.map(cat => (
          <Card key={cat.name} className={`glass-card border cursor-pointer hover:scale-105 transition-transform ${cat.bg}`}>
            <CardContent className="p-4 text-center">
              <cat.icon className={`w-6 h-6 ${cat.color} mx-auto mb-2`} />
              <div className="text-sm font-semibold">{cat.name}</div>
              <div className="text-xs text-white/40 mt-1">{cat.articles} articles</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="videos">Video Guides</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        {/* Articles */}
        <TabsContent value="articles" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtered.map((article, i) => (
              <Card key={i} className="glass-card border-white/10 hover:border-white/20 transition-colors cursor-pointer group">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <FileText className="w-4 h-4 text-white/30 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm group-hover:text-purple-400 transition-colors leading-snug">{article.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <Badge variant="outline" className="text-xs border-white/10 text-white/40">{article.category}</Badge>
                        <span className="text-xs text-white/30 flex items-center gap-1"><Clock className="w-3 h-3" /> {article.time}</span>
                        <span className="text-xs text-yellow-400 flex items-center gap-1"><Star className="w-3 h-3 fill-current" /> {article.rating}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors flex-shrink-0 mt-0.5" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-white/30">
              <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No articles found for &quot;{search}&quot;</p>
              <Button variant="outline" className="mt-4 border-white/10" onClick={() => setSearch("")}>Clear search</Button>
            </div>
          )}
        </TabsContent>

        {/* Videos */}
        <TabsContent value="videos" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {VIDEOS.map((video, i) => (
              <Card key={i} className="glass-card border-white/10 hover:border-white/20 transition-colors cursor-pointer group overflow-hidden">
                <div className="h-32 bg-gradient-to-br from-purple-900/40 to-cyan-900/20 flex items-center justify-center relative">
                  <span className="text-4xl">{video.thumbnail}</span>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <Play className="w-5 h-5 text-white fill-current" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 text-xs bg-black/60 px-2 py-0.5 rounded font-mono">{video.duration}</div>
                </div>
                <CardContent className="p-3">
                  <h3 className="font-semibold text-sm leading-snug group-hover:text-purple-400 transition-colors">{video.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-white/30 flex items-center gap-1"><Users className="w-3 h-3" /> {video.views} views</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* FAQ */}
        <TabsContent value="faq" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {FAQS.map((faq, i) => (
              <Card key={i} className="glass-card border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-sm mb-2">{faq.q}</h3>
                      <p className="text-sm text-white/50 leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="glass-card border-purple-500/20 bg-purple-500/5 mt-4">
            <CardContent className="p-6 text-center">
              <MessageSquare className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Still need help?</h3>
              <p className="text-sm text-white/50 mb-4">Ask Hope AI directly — it knows everything about the platform</p>
              <Button className="gradient-psychedelic text-white gap-2">
                <Bot className="w-4 h-4" /> Ask Hope AI
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
