import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";
import { Users, Lock, Globe, Coins, Crown, Loader2 } from "lucide-react";
import { getLoginUrl } from "@/const";

const CATEGORIES = ["Crypto", "AI", "Dev", "DeFi", "Creator", "Gaming", "NFT", "Trading", "Charity", "Community", "Other"];

const COMMUNITY_TYPES = [
  { id: "public",      label: "Public",       icon: Globe,  desc: "Anyone can join and view" },
  { id: "private",     label: "Private",      icon: Lock,   desc: "Members must be approved" },
  { id: "token_gated", label: "Token Gated",  icon: Coins,  desc: "Requires SKY444 tokens to join" },
  { id: "premium",     label: "Premium",      icon: Crown,  desc: "Paid subscription required" },
];

export default function CommunityCreate() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"public" | "private" | "token_gated" | "premium">("public");
  const [category, setCategory] = useState("Community");
  const [slugTouched, setSlugTouched] = useState(false);

  const createMutation = trpc.community.create.useMutation({
    onSuccess: (data) => {
      toast.success("Community created! 🎉");
      navigate(`/community`);
    },
    onError: (err) => toast.error(err.message || "Failed to create community"),
  });

  if (!isAuthenticated) {
    return (
      <div className="container py-16 max-w-lg text-center">
        <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-bold mb-2">Sign in to create a community</h2>
        <p className="text-muted-foreground mb-6">Build your own space in the SKYCOIN4444 ecosystem</p>
        <a href={getLoginUrl()}>
          <Button className="btn-primary">Sign In</Button>
        </a>
      </div>
    );
  }

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slugTouched) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    }
  };

  const handleSubmit = () => {
    if (!name.trim()) { toast.error("Community name is required"); return; }
    if (!slug.trim()) { toast.error("URL slug is required"); return; }
    if (slug.length < 3) { toast.error("Slug must be at least 3 characters"); return; }
    createMutation.mutate({ name: name.trim(), slug: slug.trim(), description: description.trim(), type, category });
  };

  return (
    <div className="container py-8 max-w-2xl animate-page-in">
      <PageHeader
        backHref="/channels"
        icon={Users}
        title="Create Community"
        subtitle="Build your own space for your audience"
      />

      <div className="space-y-6">
        {/* Basic Info */}
        <Card className="p-6 space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Community Name *</Label>
            <Input
              value={name}
              onChange={e => handleNameChange(e.target.value)}
              placeholder="e.g. SKY444 Traders"
              maxLength={100}
            />
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">URL Slug *</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">shadowchat.io/community/</span>
              <Input
                value={slug}
                onChange={e => { setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")); setSlugTouched(true); }}
                placeholder="sky444-traders"
                maxLength={100}
                className="flex-1"
              />
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">Description</Label>
            <Textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What is this community about?"
              className="min-h-[80px] resize-none"
              maxLength={500}
            />
            <div className="text-xs text-muted-foreground text-right mt-1">{description.length}/500</div>
          </div>
        </Card>

        {/* Category */}
        <Card className="p-6">
          <Label className="text-sm font-medium mb-3 block">Category</Label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${category === cat ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground hover:bg-secondary"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </Card>

        {/* Type */}
        <Card className="p-6">
          <Label className="text-sm font-medium mb-3 block">Community Type</Label>
          <div className="grid grid-cols-2 gap-3">
            {COMMUNITY_TYPES.map(t => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setType(t.id as any)}
                  className={`p-4 rounded-xl text-left border transition-all ${type === t.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/40 hover:bg-primary/5"}`}
                >
                  <Icon className={`w-5 h-5 mb-2 ${type === t.id ? "text-primary" : "text-muted-foreground"}`} />
                  <div className="font-medium text-sm">{t.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{t.desc}</div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Submit */}
        <Button
          onClick={handleSubmit}
          disabled={createMutation.isPending || !name.trim() || !slug.trim()}
          className="w-full btn-primary h-12 text-base"
        >
          {createMutation.isPending ? (
            <><Loader2 className="w-4 h-4 animate-spin mr-2" />Creating…</>
          ) : (
            <><Users className="w-4 h-4 mr-2" />Create Community</>
          )}
        </Button>
      </div>
    </div>
  );
}
