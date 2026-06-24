/**
 * MatchFeed — Dating System Matches List
 * Conversation previews, safety filters, engagement scoring
 */
import { useState } from "react";
import { Heart, MessageCircle, Search, Filter, Star, Shield, Clock, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { toast } from "sonner";

const MATCHES = [
  {
    id: 1,
    name: "Alex Rivera",
    age: 26,
    lastMessage: "That DeFi protocol you mentioned sounds interesting...",
    lastMessageTime: "2m ago",
    unread: 2,
    compatibility: 94,
    isOnline: true,
    isVerified: true,
    engagementScore: 87,
    conversationStage: "active",
  },
  {
    id: 2,
    name: "Jordan Kim",
    age: 29,
    lastMessage: "I'd love to hear more about your AI research!",
    lastMessageTime: "1h ago",
    unread: 0,
    compatibility: 88,
    isOnline: false,
    isVerified: true,
    engagementScore: 72,
    conversationStage: "warm",
  },
  {
    id: 3,
    name: "Sam Chen",
    age: 24,
    lastMessage: "You: Hey! Loved your profile 👋",
    lastMessageTime: "3h ago",
    unread: 0,
    compatibility: 82,
    isOnline: true,
    isVerified: false,
    engagementScore: 45,
    conversationStage: "new",
  },
  {
    id: 4,
    name: "Riley Park",
    age: 27,
    lastMessage: "Match! Say hello 💜",
    lastMessageTime: "1d ago",
    unread: 0,
    compatibility: 79,
    isOnline: false,
    isVerified: false,
    engagementScore: 20,
    conversationStage: "new",
  },
];

const STAGE_COLORS: Record<string, string> = {
  active: "text-green-400",
  warm: "text-yellow-400",
  new: "text-blue-400",
};

const STAGE_LABELS: Record<string, string> = {
  active: "Active",
  warm: "Warming up",
  new: "New match",
};

export default function MatchFeed() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "online">("all");

  const filtered = MATCHES.filter(m => {
    if (filter === "unread" && m.unread === 0) return false;
    if (filter === "online" && !m.isOnline) return false;
    if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background p-4 max-w-lg mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500" />
            My Matches
          </h1>
          <p className="text-xs text-muted-foreground">{MATCHES.length} connections</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => toast("Filters coming soon")}>
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search matches..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 bg-secondary/50 rounded-xl">
        {(["all", "unread", "online"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${filter === f ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* New matches row */}
      <div>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">New Matches</h2>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {MATCHES.filter(m => m.conversationStage === "new").map(m => (
            <Link key={m.id} href={`/dating/chat/${m.id}`}>
              <div className="flex flex-col items-center gap-1 cursor-pointer">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-xl font-bold text-white">
                    {m.name[0]}
                  </div>
                  {m.isOnline && <div className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />}
                </div>
                <span className="text-xs text-muted-foreground">{m.name.split(" ")[0]}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Conversations */}
      <div>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Conversations</h2>
        <div className="space-y-2">
          {filtered.map(match => (
            <Link key={match.id} href={`/dating/chat/${match.id}`}>
              <div className="card p-3 flex items-center gap-3 hover:bg-secondary/30 transition-colors cursor-pointer">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-lg font-bold text-white">
                    {match.name[0]}
                  </div>
                  {match.isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="font-semibold text-sm">{match.name}</span>
                    {match.isVerified && <Shield className="w-3 h-3 text-blue-400" />}
                    <span className={`text-xs ml-auto ${STAGE_COLORS[match.conversationStage]}`}>
                      {STAGE_LABELS[match.conversationStage]}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{match.lastMessage}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Clock className="w-2.5 h-2.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{match.lastMessageTime}</span>
                    <span className="text-xs text-green-400 ml-auto">{match.compatibility}% match</span>
                  </div>
                </div>

                {/* Unread badge */}
                {match.unread > 0 && (
                  <Badge className="bg-pink-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full p-0 shrink-0">
                    {match.unread}
                  </Badge>
                )}
              </div>
            </Link>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-8">
              <Heart className="w-10 h-10 text-pink-500/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No matches found</p>
            </div>
          )}
        </div>
      </div>

      {/* Engagement tip */}
      <div className="card p-3 bg-gradient-to-r from-orange-500/10 to-pink-500/10 border-orange-500/20 flex items-center gap-3">
        <Flame className="w-6 h-6 text-orange-400 shrink-0" />
        <div className="flex-1 text-xs">
          <span className="font-semibold">Pro tip:</span>
          <span className="text-muted-foreground"> Matches with 80%+ compatibility are 3x more likely to respond within 1 hour.</span>
        </div>
      </div>
    </div>
  );
}
