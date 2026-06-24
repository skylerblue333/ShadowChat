/**
 * DatingHome — Full Dating System Hub
 * AI-ranked match feed, compatibility scores, boost monetization
 * Tinder-style + AI intelligence layer
 */
import { useState } from "react";
import { Heart, X, Star, Zap, Brain, MessageCircle, Settings, ChevronRight, Flame, Shield, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { toast } from "sonner";

const MOCK_PROFILES = [
  {
    id: 1,
    name: "Alex Rivera",
    age: 26,
    location: "San Francisco, CA",
    bio: "Crypto trader by day, DJ by night. Looking for someone who gets both worlds.",
    interests: ["Web3", "Music", "Travel", "DeFi"],
    compatibility: 94,
    trustScore: 87,
    isVerified: true,
    isPremium: false,
    avatar: null,
    aiSummary: "High compatibility: shared interests in crypto and nightlife. Communication style: direct and enthusiastic.",
    intentTag: "serious",
  },
  {
    id: 2,
    name: "Jordan Kim",
    age: 29,
    location: "New York, NY",
    bio: "AI researcher building the future. Passionate about ethics and good coffee.",
    interests: ["AI", "Philosophy", "Coffee", "Running"],
    compatibility: 88,
    trustScore: 92,
    isVerified: true,
    isPremium: true,
    avatar: null,
    aiSummary: "Strong intellectual match. Both value depth over surface. Potential for meaningful connection.",
    intentTag: "networking",
  },
  {
    id: 3,
    name: "Sam Chen",
    age: 24,
    location: "Austin, TX",
    bio: "Startup founder, amateur chef, and professional overthinker.",
    interests: ["Startups", "Cooking", "Gaming", "Hiking"],
    compatibility: 82,
    trustScore: 79,
    isVerified: false,
    isPremium: false,
    avatar: null,
    aiSummary: "Creative energy match. Shared entrepreneurial mindset. Good conversation potential.",
    intentTag: "casual",
  },
];

const INTENT_COLORS: Record<string, string> = {
  serious: "bg-pink-500/20 text-pink-400",
  casual: "bg-blue-500/20 text-blue-400",
  networking: "bg-purple-500/20 text-purple-400",
};

export default function DatingHome() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showAI, setShowAI] = useState(false);
  const [likedIds, setLikedIds] = useState<number[]>([]);

  const profile = MOCK_PROFILES[currentIdx];

  const handleLike = () => {
    if (!profile) return;
    setLikedIds(prev => [...prev, profile.id]);
    toast.success(`You liked ${profile.name}! 💜`);
    setCurrentIdx(prev => Math.min(prev + 1, MOCK_PROFILES.length - 1));
  };

  const handlePass = () => {
    setCurrentIdx(prev => Math.min(prev + 1, MOCK_PROFILES.length - 1));
  };

  const handleSuperLike = () => {
    toast("Super Like requires Premium — upgrade to unlock!", { icon: "⭐" });
  };

  return (
    <div className="min-h-screen bg-background p-4 max-w-md mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500" />
            ShadowMatch
          </h1>
          <p className="text-xs text-muted-foreground">AI-powered connections</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dating/matchmaker">
            <Button variant="outline" size="sm" className="gap-1">
              <Brain className="w-3.5 h-3.5" />
              AI
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={() => toast("Settings coming soon")}>
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-2">
        <div className="card p-2 text-center">
          <div className="text-lg font-bold text-pink-400">{likedIds.length}</div>
          <div className="text-xs text-muted-foreground">Liked</div>
        </div>
        <div className="card p-2 text-center">
          <div className="text-lg font-bold text-purple-400">3</div>
          <div className="text-xs text-muted-foreground">Matches</div>
        </div>
        <div className="card p-2 text-center">
          <div className="text-lg font-bold text-blue-400">94%</div>
          <div className="text-xs text-muted-foreground">Top Match</div>
        </div>
      </div>

      {/* Main card */}
      {profile ? (
        <div className="card overflow-hidden">
          {/* Profile image area */}
          <div className="relative h-72 bg-gradient-to-br from-purple-900 via-pink-900 to-blue-900 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl font-bold text-white">
              {profile.name[0]}
            </div>
            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-1.5">
              {profile.isVerified && (
                <Badge className="bg-blue-500/90 text-white text-xs gap-1">
                  <Shield className="w-2.5 h-2.5" />
                  Verified
                </Badge>
              )}
              {profile.isPremium && (
                <Badge className="bg-yellow-500/90 text-white text-xs gap-1">
                  <Crown className="w-2.5 h-2.5" />
                  Premium
                </Badge>
              )}
            </div>
            {/* Compatibility score */}
            <div className="absolute top-3 right-3 w-12 h-12 rounded-full bg-black/60 backdrop-blur flex flex-col items-center justify-center">
              <div className="text-sm font-bold text-green-400">{profile.compatibility}%</div>
              <div className="text-xs text-muted-foreground">match</div>
            </div>
            {/* Intent tag */}
            <div className="absolute bottom-3 left-3">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${INTENT_COLORS[profile.intentTag]}`}>
                {profile.intentTag}
              </span>
            </div>
          </div>

          {/* Profile info */}
          <div className="p-4 space-y-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">{profile.name}, {profile.age}</h2>
                <span className="text-xs text-muted-foreground">Trust: {profile.trustScore}</span>
              </div>
              <p className="text-xs text-muted-foreground">{profile.location}</p>
            </div>
            <p className="text-sm text-muted-foreground">{profile.bio}</p>

            {/* Interests */}
            <div className="flex flex-wrap gap-1.5">
              {profile.interests.map(i => (
                <span key={i} className="px-2 py-0.5 rounded-full bg-secondary text-xs">{i}</span>
              ))}
            </div>

            {/* AI Summary toggle */}
            <button
              onClick={() => setShowAI(!showAI)}
              className="flex items-center gap-2 text-xs text-purple-400 hover:text-purple-300 transition-colors"
            >
              <Brain className="w-3.5 h-3.5" />
              {showAI ? "Hide" : "Show"} AI Analysis
              <ChevronRight className={`w-3 h-3 transition-transform ${showAI ? "rotate-90" : ""}`} />
            </button>
            {showAI && (
              <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300">
                {profile.aiSummary}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="card p-8 text-center">
          <Heart className="w-12 h-12 text-pink-500/30 mx-auto mb-3" />
          <h3 className="font-semibold">You've seen everyone!</h3>
          <p className="text-sm text-muted-foreground mt-1">Check back later for new matches.</p>
        </div>
      )}

      {/* Action buttons */}
      {profile && (
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="lg"
            className="w-14 h-14 rounded-full border-2 border-red-500/30 hover:border-red-500 hover:bg-red-500/10"
            onClick={handlePass}
          >
            <X className="w-6 h-6 text-red-400" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-12 h-12 rounded-full border-2 border-yellow-500/30 hover:border-yellow-500 hover:bg-yellow-500/10"
            onClick={handleSuperLike}
          >
            <Star className="w-5 h-5 text-yellow-400" />
          </Button>
          <Button
            size="lg"
            className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400"
            onClick={handleLike}
          >
            <Heart className="w-6 h-6 text-white" />
          </Button>
        </div>
      )}

      {/* Navigation links */}
      <div className="grid grid-cols-2 gap-2">
        <Link href="/dating/matches">
          <Button variant="outline" className="w-full gap-2 text-sm">
            <MessageCircle className="w-4 h-4" />
            My Matches
          </Button>
        </Link>
        <Link href="/dating/premium">
          <Button className="w-full gap-2 text-sm bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400">
            <Crown className="w-4 h-4" />
            Go Premium
          </Button>
        </Link>
      </div>

      {/* Boost CTA */}
      <div className="card p-3 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border-pink-500/20 flex items-center gap-3">
        <Flame className="w-8 h-8 text-orange-400 shrink-0" />
        <div className="flex-1">
          <div className="text-sm font-semibold">Boost your profile</div>
          <div className="text-xs text-muted-foreground">10x more visibility for 30 min — $2.99</div>
        </div>
        <Button size="sm" className="bg-orange-500 hover:bg-orange-400 shrink-0" onClick={() => toast("Boost purchased! Your profile is now featured 🔥")}>
          <Zap className="w-3.5 h-3.5 mr-1" />
          Boost
        </Button>
      </div>
    </div>
  );
}
