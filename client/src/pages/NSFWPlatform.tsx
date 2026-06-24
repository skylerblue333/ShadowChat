import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import {
  Lock, Eye, EyeOff, DollarSign, Star, Heart, Crown, Shield,
  Upload, Play, Image, Video, Gift, Users, TrendingUp, Zap,
  AlertTriangle, CheckCircle2, Settings, Bell, CreditCard,
  ChevronRight, Flame, Award, MessageSquare,
} from "lucide-react";

// Age Gate Component
function AgeGate({ onConfirm }: { onConfirm: () => void }) {
  const [checked, setChecked] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-6">
      <Card className="glass-card border-red-500/30 max-w-md w-full">
        <CardContent className="p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Age Verification Required</h2>
            <p className="text-white/50 text-sm leading-relaxed">
              This section contains adult content intended for users 18 years of age or older.
              By entering, you confirm you are of legal age in your jurisdiction.
            </p>
          </div>
          <div className="space-y-3 text-left">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-white/60">All content creators are verified adults (18+)</p>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-white/60">DMCA compliance and content moderation enforced</p>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-white/60">2257 record-keeping requirements met</p>
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <Switch checked={checked} onCheckedChange={setChecked} />
            <span className="text-sm text-white/70">I confirm I am 18 years of age or older and consent to viewing adult content</span>
          </label>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 border-white/10"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
            <Button
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              disabled={!checked}
              onClick={onConfirm}
            >
              Enter — I Am 18+
            </Button>
          </div>
          <p className="text-xs text-white/30">
            This platform complies with 18 U.S.C. § 2257 and GDPR. All performers are verified adults.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

const SUBSCRIPTION_TIERS = [
  {
    name: "Fan",
    price: 9.99,
    color: "border-white/20",
    badge: "text-white/60",
    icon: Heart,
    perks: ["Access to public posts", "Follow creator updates", "Community chat access", "Monthly exclusive photo"],
  },
  {
    name: "Supporter",
    price: 19.99,
    color: "border-purple-500/40",
    badge: "text-purple-400",
    icon: Star,
    perks: ["Everything in Fan", "Exclusive video content", "Direct message access", "2x monthly exclusives", "Behind-the-scenes content"],
    popular: true,
  },
  {
    name: "VIP",
    price: 49.99,
    color: "border-yellow-500/40",
    badge: "text-yellow-400",
    icon: Crown,
    perks: ["Everything in Supporter", "1-on-1 video calls (monthly)", "Custom content requests", "Early access to all drops", "Personalized shoutouts", "Merch discounts 20%"],
  },
];

const FEATURED_CREATORS = [
  { name: "ShadowMuse", handle: "@shadowmuse", tier: "VIP", subscribers: 4820, monthly: "$12.4K", avatar: "🌙", verified: true, categories: ["Art", "Lifestyle"] },
  { name: "NeonDream", handle: "@neondream", tier: "Supporter", subscribers: 2310, monthly: "$6.8K", avatar: "✨", verified: true, categories: ["Music", "Dance"] },
  { name: "CryptoGoddess", handle: "@cryptogoddess", tier: "VIP", subscribers: 7650, monthly: "$28.1K", avatar: "💎", verified: true, categories: ["Crypto", "Finance"] },
  { name: "VoidArtist", handle: "@voidartist", tier: "Fan", subscribers: 890, monthly: "$2.1K", avatar: "🎨", verified: false, categories: ["Art", "Photography"] },
];

const PPV_CONTENT = [
  { title: "Exclusive Photoshoot — Neon City Series", creator: "ShadowMuse", price: 14.99, type: "photo", preview: "🖼️", duration: "42 photos" },
  { title: "Behind the Scenes — Studio Session", creator: "NeonDream", price: 9.99, type: "video", preview: "🎬", duration: "18 min" },
  { title: "Crypto Trading Masterclass — Private Session", creator: "CryptoGoddess", price: 29.99, type: "video", preview: "📈", duration: "45 min" },
  { title: "Digital Art Process — Full Timelapse", creator: "VoidArtist", price: 7.99, type: "video", preview: "🎨", duration: "22 min" },
];

export default function NSFWPlatform() {
  const [ageVerified, setAgeVerified] = useState(false);
  const [activeTab, setActiveTab] = useState("discover");
  const [tipAmount, setTipAmount] = useState([10]);
  const [selectedCreator, setSelectedCreator] = useState<string | null>(null);

  if (!ageVerified) {
    return <AgeGate onConfirm={() => setAgeVerified(true)} />;
  }

  const handleSubscribe = (tier: string, price: number) => {
    toast.success(`Subscribed to ${tier} tier — $${price}/month`, {
      description: "Your subscription is now active. Welcome!",
    });
  };

  const handlePPVPurchase = (title: string, price: number) => {
    toast.success(`Purchased: ${title}`, {
      description: `$${price} charged. Content unlocked!`,
    });
  };

  const handleTip = (creator: string) => {
    toast.success(`Tipped ${tipAmount[0]} SKY444 to ${creator}`, {
      description: "Your tip has been sent! 💜",
    });
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-mono">
              <Flame className="w-3 h-3" /> CREATOR PLATFORM — 18+
            </div>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Age Verified</Badge>
          </div>
          <h1 className="text-3xl font-bold text-gradient">ShadowFans</h1>
          <p className="text-white/50 text-sm mt-1">Premium creator content — subscriptions, PPV, tips, and exclusive drops</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-white/10 gap-2" size="sm">
            <Settings className="w-4 h-4" /> Preferences
          </Button>
          <Button className="gradient-psychedelic text-white gap-2" size="sm">
            <Upload className="w-4 h-4" /> Become a Creator
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Active Creators", value: "1,284", icon: Users, color: "text-purple-400" },
          { label: "Total Subscribers", value: "48.2K", icon: Heart, color: "text-pink-400" },
          { label: "Monthly Payouts", value: "$284K", icon: DollarSign, color: "text-green-400" },
          { label: "Content Pieces", value: "92.4K", icon: Image, color: "text-cyan-400" },
        ].map(stat => (
          <Card key={stat.label} className="glass-card border-white/10">
            <CardContent className="p-4 flex items-center gap-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <div>
                <div className="font-bold text-lg">{stat.value}</div>
                <div className="text-xs text-white/40">{stat.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="ppv">Pay-Per-View</TabsTrigger>
          <TabsTrigger value="tips">Tips</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        {/* Discover */}
        <TabsContent value="discover" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FEATURED_CREATORS.map(creator => (
              <Card key={creator.handle} className="glass-card border-white/10 hover:border-white/20 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600/40 to-pink-600/40 flex items-center justify-center text-2xl flex-shrink-0">
                      {creator.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold">{creator.name}</h3>
                        {creator.verified && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                        <Badge variant="outline" className="text-xs border-white/10 text-white/40">{creator.tier}</Badge>
                      </div>
                      <p className="text-sm text-white/40 mb-2">{creator.handle}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {creator.categories.map(c => (
                          <Badge key={c} className="text-xs bg-white/5 border-white/10 text-white/60">{c}</Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-4 text-xs text-white/40">
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {creator.subscribers.toLocaleString()}</span>
                          <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {creator.monthly}/mo</span>
                        </div>
                        <Button size="sm" className="gradient-psychedelic text-white text-xs">
                          Subscribe
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Subscriptions */}
        <TabsContent value="subscriptions" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SUBSCRIPTION_TIERS.map(tier => (
              <Card key={tier.name} className={`glass-card border ${tier.color} relative ${tier.popular ? "ring-1 ring-purple-500/50" : ""}`}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-purple-600 text-white text-xs px-3">Most Popular</Badge>
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <tier.icon className={`w-5 h-5 ${tier.badge}`} />
                    <h3 className={`font-bold text-lg ${tier.badge}`}>{tier.name}</h3>
                  </div>
                  <div className="mb-6">
                    <span className="text-3xl font-bold">${tier.price}</span>
                    <span className="text-white/40 text-sm">/month</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {tier.perks.map(perk => (
                      <li key={perk} className="flex items-start gap-2 text-sm text-white/70">
                        <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        {perk}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${tier.popular ? "gradient-psychedelic text-white" : "border-white/10"}`}
                    variant={tier.popular ? "default" : "outline"}
                    onClick={() => handleSubscribe(tier.name, tier.price)}
                  >
                    Subscribe — ${tier.price}/mo
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="glass-card border-white/10 mt-4">
            <CardContent className="p-4 flex items-center gap-4">
              <Shield className="w-5 h-5 text-green-400 flex-shrink-0" />
              <p className="text-sm text-white/60">
                All subscriptions are billed monthly and can be cancelled anytime. Payments are processed securely via Stripe.
                Creator receives 80% of subscription revenue; platform fee is 20%.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pay-Per-View */}
        <TabsContent value="ppv" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PPV_CONTENT.map((item, i) => (
              <Card key={i} className="glass-card border-white/10 hover:border-white/20 transition-colors group">
                <CardContent className="p-4">
                  <div className="h-24 bg-gradient-to-br from-purple-900/30 to-pink-900/20 rounded-lg flex items-center justify-center mb-3 relative overflow-hidden">
                    <span className="text-4xl">{item.preview}</span>
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Lock className="w-6 h-6 text-white/60" />
                    </div>
                    <Badge className="absolute top-2 right-2 bg-black/60 text-white/80 text-xs">
                      {item.type === "video" ? <Video className="w-3 h-3 inline mr-1" /> : <Image className="w-3 h-3 inline mr-1" />}
                      {item.duration}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-sm mb-1 leading-snug">{item.title}</h3>
                  <p className="text-xs text-white/40 mb-3">by {item.creator}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-green-400">${item.price}</span>
                    <Button
                      size="sm"
                      className="gradient-psychedelic text-white text-xs gap-1"
                      onClick={() => handlePPVPurchase(item.title, item.price)}
                    >
                      <Lock className="w-3 h-3" /> Unlock
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tips */}
        <TabsContent value="tips" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Gift className="w-4 h-4 text-pink-400" /> Send a Tip
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-white/60 mb-2 block">Select Creator</label>
                  <div className="grid grid-cols-2 gap-2">
                    {FEATURED_CREATORS.map(c => (
                      <button
                        key={c.handle}
                        onClick={() => setSelectedCreator(c.name)}
                        className={`p-2 rounded-lg border text-left transition-colors ${selectedCreator === c.name ? "border-purple-500/60 bg-purple-500/10" : "border-white/10 bg-white/5 hover:border-white/20"}`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{c.avatar}</span>
                          <div>
                            <div className="text-xs font-semibold">{c.name}</div>
                            <div className="text-xs text-white/40">{c.handle}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-2 block">Tip Amount: <span className="text-white font-bold">{tipAmount[0]} SKY444</span></label>
                  <Slider
                    value={tipAmount}
                    onValueChange={setTipAmount}
                    min={1}
                    max={500}
                    step={1}
                    className="my-3"
                  />
                  <div className="flex gap-2">
                    {[5, 10, 25, 50, 100].map(amt => (
                      <button
                        key={amt}
                        onClick={() => setTipAmount([amt])}
                        className={`flex-1 py-1 rounded text-xs border transition-colors ${tipAmount[0] === amt ? "border-purple-500/60 bg-purple-500/10 text-purple-400" : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"}`}
                      >
                        {amt}
                      </button>
                    ))}
                  </div>
                </div>
                <Button
                  className="w-full gradient-psychedelic text-white gap-2"
                  disabled={!selectedCreator}
                  onClick={() => selectedCreator && handleTip(selectedCreator)}
                >
                  <Gift className="w-4 h-4" /> Send {tipAmount[0]} SKY444 Tip
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400" /> Top Tipped This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {FEATURED_CREATORS.map((c, i) => (
                    <div key={c.handle} className="flex items-center gap-3">
                      <div className="w-6 text-center text-sm font-bold text-white/30">#{i + 1}</div>
                      <span className="text-lg">{c.avatar}</span>
                      <div className="flex-1">
                        <div className="text-sm font-semibold">{c.name}</div>
                        <div className="text-xs text-white/40">{c.handle}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-yellow-400">{(Math.random() * 5000 + 500).toFixed(0)} SKY444</div>
                        <div className="text-xs text-white/30">this week</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Compliance */}
        <TabsContent value="compliance" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "18 U.S.C. § 2257 Compliance",
                icon: Shield,
                color: "text-green-400",
                items: [
                  "All performers verified 18+ before content upload",
                  "Government-issued ID verification required",
                  "Records maintained for minimum 7 years",
                  "Custodian of records: IITR LLC, Skyler Blue Spillers",
                  "Inspection available at registered address",
                ],
              },
              {
                title: "DMCA & Content Policy",
                icon: Award,
                color: "text-blue-400",
                items: [
                  "DMCA takedown requests processed within 24 hours",
                  "Repeat infringers permanently banned",
                  "Content fingerprinting via PhotoDNA",
                  "CSAM detection and mandatory reporting",
                  "Designated DMCA agent registered with Copyright Office",
                ],
              },
              {
                title: "GDPR & Privacy",
                icon: Lock,
                color: "text-purple-400",
                items: [
                  "Right to erasure honored within 30 days",
                  "Data portability export available",
                  "Consent management platform integrated",
                  "DPA agreements with all processors",
                  "Privacy-by-design architecture",
                ],
              },
              {
                title: "Payment & Tax Compliance",
                icon: CreditCard,
                color: "text-yellow-400",
                items: [
                  "1099-K issued to creators earning $600+/year",
                  "W-9 / W-8BEN collected before first payout",
                  "Stripe Identity for creator KYC",
                  "AML monitoring on all transactions",
                  "Chargeback protection and fraud prevention",
                ],
              },
            ].map(section => (
              <Card key={section.title} className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <section.icon className={`w-4 h-4 ${section.color}`} />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.items.map(item => (
                      <li key={item} className="flex items-start gap-2 text-xs text-white/60">
                        <CheckCircle2 className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="glass-card border-yellow-500/20 bg-yellow-500/5 mt-4">
            <CardContent className="p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-white/60">
                <strong className="text-white">Legal Notice:</strong> ShadowFans operates in full compliance with applicable federal and state laws.
                All content is produced by consenting adults. For compliance inquiries, contact{" "}
                <span className="text-purple-400">legal@shadowchat.io</span>. To report illegal content,
                use the in-platform report button or contact{" "}
                <span className="text-purple-400">safety@shadowchat.io</span>.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
