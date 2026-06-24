import { useState } from "react";
import { Heart, MessageCircle, Star, Crown, Users, Lock, Zap, Share2, Bell, Grid, List, Play, Image, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

const MOCK_CREATOR = {
  name: "ShadowCreator",
  handle: "@shadow_x",
  bio: "Digital artist & content creator. Building in the shadows, shining in the light. 🌑✨ Exclusive content for subscribers only.",
  avatar: "S",
  coverGradient: "from-purple-900 via-fuchsia-900 to-black",
  subscribers: 4440,
  posts: 144,
  likes: 89200,
  verified: true,
  tiers: [
    { id: "basic",   name: "Shadow",   price: 9.99,  perks: ["Access to basic posts", "Monthly Q&A", "Discord access"] },
    { id: "premium", name: "Eclipse",  price: 24.99, perks: ["All Shadow perks", "Exclusive photo sets", "Priority DMs", "Behind the scenes"] },
    { id: "vip",     name: "Void",     price: 49.99, perks: ["All Eclipse perks", "1-on-1 video call/month", "Custom content requests", "Signed digital print"] },
  ],
  recentContent: [
    { id: 1, type: "photo", title: "Set #44",     locked: true,  likes: 1240, tier: "Shadow"  },
    { id: 2, type: "video", title: "BTS Clip",    locked: false, likes: 3800, tier: "Free"    },
    { id: 3, type: "photo", title: "Eclipse Set", locked: true,  likes: 2100, tier: "Eclipse" },
    { id: 4, type: "photo", title: "Void Only",   locked: true,  likes: 890,  tier: "Void"    },
    { id: 5, type: "video", title: "Preview",     locked: false, likes: 5600, tier: "Free"    },
    { id: 6, type: "photo", title: "Exclusive",   locked: true,  likes: 1670, tier: "Shadow"  },
  ],
};

const TIER_COLORS: Record<string, string> = {
  Shadow:  "bg-purple-900/40 border-purple-500/30",
  Eclipse: "bg-fuchsia-900/40 border-fuchsia-500/30",
  Void:    "bg-yellow-900/40 border-yellow-500/30",
  Free:    "bg-slate-800 border-slate-700",
};

const TIER_MAP: Record<string, "supporter" | "premium" | "vip"> = {
  basic: "supporter",
  premium: "premium",
  vip: "vip",
};

export default function CreatorProfile() {
  const params = useParams<{ handle?: string }>();
  const { user } = useAuth();
  const creator = MOCK_CREATOR;
  const [subscribed, setSubscribed] = useState(false);
  const [following, setFollowing] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [checkingOut, setCheckingOut] = useState<string | null>(null);

  const subscribeWithStripe = trpc.creator.subscribeWithStripe.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        if (data.mock) {
          // Stripe not configured — direct DB subscription
          setSubscribed(true);
          setSelectedTier(selectedTier);
          toast.success(`Subscribed to ${data.tierName}!`);
        } else {
          toast.info("Redirecting to Stripe checkout…");
          window.open(data.url, "_blank");
        }
      }
      setCheckingOut(null);
    },
    onError: (err) => {
      toast.error(err.message || "Subscription failed");
      setCheckingOut(null);
    },
  });

  const handleSubscribe = (tierId: string) => {
    if (!user) {
      toast.error("Please sign in to subscribe");
      return;
    }
    const tier = creator.tiers.find(t => t.id === tierId);
    if (!tier) return;
    setCheckingOut(tierId);
    setSelectedTier(tierId);
    subscribeWithStripe.mutate({
      creatorId: 1, // mock creator ID
      tier: TIER_MAP[tierId] || "supporter",
      successUrl: window.location.origin + window.location.pathname,
      cancelUrl: window.location.origin + window.location.pathname,
    });
  };

  return (
    <div className="min-h-screen bg-[#050308] text-white">
      {/* Cover */}
      <div className={`h-40 md:h-56 bg-gradient-to-br ${creator.coverGradient} relative`}>
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Profile header */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="relative -mt-12 mb-4 flex items-end justify-between gap-4">
          <div className="flex items-end gap-3">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-600 border-4 border-[#050308] flex items-center justify-center shrink-0">
              <span className="text-3xl font-black text-white">{creator.avatar}</span>
            </div>
            <div className="pb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white">{creator.name}</h1>
                {creator.verified && <Crown className="w-4 h-4 text-yellow-400" />}
              </div>
              <p className="text-sm text-slate-400">{creator.handle}</p>
            </div>
          </div>
          <div className="flex gap-2 pb-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => { setFollowing(f => !f); toast.success(following ? "Unfollowed" : "Following!"); }}
              className={`border-slate-700 text-xs ${following ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"}`}
            >
              <Bell className="w-3.5 h-3.5 mr-1" />
              {following ? "Following" : "Follow"}
            </Button>
            <Button size="sm" variant="outline" className="border-slate-700 text-slate-400 hover:text-white" onClick={() => toast.success("Link copied!")}>
              <Share2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Bio + stats */}
        <p className="text-sm text-slate-300 mb-4 max-w-xl">{creator.bio}</p>
        <div className="flex gap-6 mb-6 text-sm">
          <div className="text-center">
            <p className="font-black text-white">{creator.subscribers.toLocaleString()}</p>
            <p className="text-xs text-slate-500">Subscribers</p>
          </div>
          <div className="text-center">
            <p className="font-black text-white">{creator.posts}</p>
            <p className="text-xs text-slate-500">Posts</p>
          </div>
          <div className="text-center">
            <p className="font-black text-white">{(creator.likes / 1000).toFixed(1)}K</p>
            <p className="text-xs text-slate-500">Likes</p>
          </div>
        </div>

        {/* Subscription tiers */}
        {!subscribed && (
          <div className="mb-8">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Subscribe to Unlock Content</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {creator.tiers.map(tier => (
                <div key={tier.id} className={`border rounded-xl p-4 ${TIER_COLORS[tier.name]}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-black text-white">{tier.name}</span>
                    <span className="text-lg font-black text-white">${tier.price}<span className="text-xs text-slate-400">/mo</span></span>
                  </div>
                  <ul className="space-y-1 mb-4">
                    {tier.perks.map(perk => (
                      <li key={perk} className="text-xs text-slate-300 flex items-start gap-1.5">
                        <Star className="w-3 h-3 text-purple-400 mt-0.5 shrink-0" />{perk}
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => handleSubscribe(tier.id)}
                    disabled={checkingOut === tier.id}
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                    size="sm"
                  >
                    {checkingOut === tier.id ? (
                      <><Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />Processing…</>
                    ) : (
                      <><Zap className="w-3.5 h-3.5 mr-1" />Subscribe ${tier.price}/mo</>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {subscribed && (
          <div className="mb-6 flex items-center gap-3 p-3 bg-green-900/20 border border-green-500/20 rounded-xl">
            <Crown className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-sm font-bold text-white">You're subscribed to {creator.tiers.find(t => t.id === selectedTier)?.name} tier</p>
              <p className="text-xs text-slate-400">Full access to all locked content</p>
            </div>
            <Link href="/subscriptions">
              <Button size="sm" variant="outline" className="ml-auto border-slate-700 text-slate-400 hover:text-white text-xs">Manage</Button>
            </Link>
          </div>
        )}

        {/* Content grid */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-bold text-white">Content</h2>
          <div className="flex border border-slate-800 rounded-lg overflow-hidden">
            <button onClick={() => setViewMode("grid")} className={`p-1.5 ${viewMode === "grid" ? "bg-slate-700 text-white" : "text-slate-500"}`}><Grid className="w-4 h-4" /></button>
            <button onClick={() => setViewMode("list")} className={`p-1.5 ${viewMode === "list" ? "bg-slate-700 text-white" : "text-slate-500"}`}><List className="w-4 h-4" /></button>
          </div>
        </div>

        <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 gap-3 mb-10" : "space-y-3 mb-10"}>
          {creator.recentContent.map(item => (
            <div
              key={item.id}
              className={`bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden hover:border-purple-500/30 transition-all group cursor-pointer ${viewMode === "list" ? "flex gap-3 p-3 items-center" : ""}`}
            >
              <div className={`relative bg-gradient-to-br from-slate-800 to-slate-900 ${viewMode === "list" ? "w-16 h-16 rounded-lg shrink-0" : "aspect-square"} flex items-center justify-center`}>
                {item.type === "video" ? <Play className="w-6 h-6 text-slate-600" /> : <Image className="w-6 h-6 text-slate-600" />}
                {item.locked && !subscribed && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-lg">
                    <Lock className="w-4 h-4 text-slate-400" />
                  </div>
                )}
              </div>
              <div className={viewMode === "list" ? "flex-1 min-w-0" : "p-2.5"}>
                <p className="text-xs font-semibold text-white truncate">{item.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`text-[9px] px-1 py-0 ${TIER_COLORS[item.tier]}`}>{item.tier}</Badge>
                  <span className="text-[10px] text-slate-500 flex items-center gap-0.5"><Heart className="w-2.5 h-2.5" />{item.likes.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
