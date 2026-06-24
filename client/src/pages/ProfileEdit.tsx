import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Link, useLocation } from "wouter";
import {
  User, Camera, Palette, Wallet, Globe, Twitter,
  Instagram, Youtube, Link2, ArrowLeft, Zap,
  CheckCircle, Loader2, MapPin, Edit3
} from "lucide-react";

const THEME_PRESETS = [
  { id: "psychedelic", name: "Psychedelic", colors: ["#bf00ff","#ff006e","#00d4ff","#ff6b00"], desc: "Tie-dye LSD drip" },
  { id: "cyber", name: "Cyber Void", colors: ["#00d4ff","#7c3aed","#1e1b4b","#0f172a"], desc: "Dark cyber aesthetic" },
  { id: "gold", name: "Gold Rush", colors: ["#f5a623","#ff6b00","#1a0a00","#0f0800"], desc: "Molten gold & orange" },
  { id: "neon", name: "Neon Night", colors: ["#ff006e","#00ff88","#0a0a0a","#111111"], desc: "Classic neon vibes" },
  { id: "ocean", name: "Deep Ocean", colors: ["#00d4ff","#0066ff","#001a33","#000d1a"], desc: "Deep sea blues" },
  { id: "aurora", name: "Aurora", colors: ["#00ff88","#00d4ff","#bf00ff","#0a0a1a"], desc: "Northern lights" },
];

export default function ProfileEdit() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const utils = trpc.useUtils();

  const [form, setForm] = useState({
    displayName: "",
    username: "",
    bio: "",
    location: "",
    website: "",
    twitter: "",
    instagram: "",
    youtube: "",
    walletAddress: "",
    selectedTheme: "psychedelic",
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [savingField, setSavingField] = useState<string | null>(null);
  const [savedFields, setSavedFields] = useState<Set<string>>(new Set());

  // Pre-fill form from user data
  useEffect(() => {
    if (user) {
      setForm({
        displayName: (user as any).displayName || (user as any).name || "",
        username: (user as any).username || "",
        bio: (user as any).bio || "",
        location: (user as any).location || "",
        website: (user as any).website || "",
        twitter: (user as any).twitter || "",
        instagram: (user as any).instagram || "",
        youtube: (user as any).youtube || "",
        walletAddress: (user as any).walletAddress || "",
        selectedTheme: "psychedelic",
      });
      if ((user as any).avatar) setAvatarPreview((user as any).avatar);
      if ((user as any).banner) setBannerPreview((user as any).banner);
    }
  }, [user]);

  const updateProfile = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      utils.auth.me.invalidate();
    },
  });

  const uploadAvatar = trpc.user.uploadAvatar.useMutation({
    onSuccess: (data, variables) => {
      utils.auth.me.invalidate();
      const field = variables.type;
      setSavedFields(prev => new Set([...prev, field]));
      toast.success(`${field === "avatar" ? "Profile photo" : "Banner"} updated!`);
    },
    onError: (err) => {
      toast.error("Upload failed: " + err.message);
    },
  });

  // Auto-save field on blur
  const handleFieldBlur = useCallback(async (field: string, value: string) => {
    if (!user) return;
    const currentValue = (user as any)[field] || "";
    if (value === currentValue) return; // no change
    setSavingField(field);
    try {
      await updateProfile.mutateAsync({ [field]: value });
      setSavedFields(prev => new Set([...prev, field]));
      setTimeout(() => setSavedFields(prev => { const n = new Set(prev); n.delete(field); return n; }), 2000);
    } catch (e: any) {
      toast.error("Failed to save: " + (e.message || "Unknown error"));
    } finally {
      setSavingField(null);
    }
  }, [user, updateProfile]);

  const handleImageUpload = useCallback(async (file: File, type: "avatar" | "banner") => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (type === "avatar") setAvatarPreview(dataUrl);
      else setBannerPreview(dataUrl);
      // Upload to server
      uploadAvatar.mutate({ data: dataUrl, type, mimeType: file.type });
    };
    reader.readAsDataURL(file);
  }, [uploadAvatar]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'oklch(0.08 0.025 270)' }}>
        <div className="text-center">
          <div className="text-4xl mb-4">🔐</div>
          <h2 className="text-xl font-bold text-white mb-2">Sign in to edit your profile</h2>
          <Link href="/"><Button>Go Home</Button></Link>
        </div>
      </div>
    );
  }

  const fieldStatus = (field: string) => {
    if (savingField === field) return <Loader2 className="w-3 h-3 animate-spin text-white/50" />;
    if (savedFields.has(field)) return <CheckCircle className="w-3 h-3" style={{ color: 'oklch(0.80 0.22 145)' }} />;
    return null;
  };

  return (
    <div className="min-h-screen" style={{ background: 'oklch(0.08 0.025 270)' }}>
      {/* Banner */}
      <div
        className="relative h-48 md:h-64 cursor-pointer group overflow-hidden"
        style={{
          background: bannerPreview
            ? `url(${bannerPreview}) center/cover no-repeat`
            : 'linear-gradient(135deg, oklch(0.72 0.28 305 / 0.4), oklch(0.72 0.28 340 / 0.4), oklch(0.80 0.25 60 / 0.3))',
        }}
        onClick={() => bannerInputRef.current?.click()}
      >
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: 'rgba(0,0,0,0.6)' }}>
            <Camera className="w-4 h-4" />
            {uploadAvatar.isPending && uploadAvatar.variables?.type === "banner" ? "Uploading..." : "Change Banner"}
          </div>
        </div>
        <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], "banner")} />
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-16">
        {/* Avatar */}
        <div className="relative -mt-16 mb-6 flex items-end gap-4">
          <div
            className="relative w-28 h-28 rounded-2xl cursor-pointer group overflow-hidden flex-shrink-0"
            style={{ border: '3px solid oklch(0.72 0.28 305)', background: 'oklch(0.12 0.025 270)' }}
            onClick={() => avatarInputRef.current?.click()}
          >
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl">
                {(user as any)?.name?.[0]?.toUpperCase() || "?"}
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center">
              <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-all" />
            </div>
            {uploadAvatar.isPending && uploadAvatar.variables?.type === "avatar" && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            )}
          </div>
          <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], "avatar")} />
          <div className="pb-2">
            <h1 className="text-2xl font-bold text-white">{form.displayName || (user as any)?.name || "Your Name"}</h1>
            <p className="text-sm" style={{ color: 'oklch(0.55 0.025 275)' }}>@{form.username || "username"}</p>
          </div>
          <div className="ml-auto pb-2">
            <Link href="/profile">
              <Button variant="outline" size="sm" className="text-white border-white/20">
                <ArrowLeft className="w-4 h-4 mr-1" /> View Profile
              </Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="w-full" style={{ background: 'oklch(0.12 0.025 270)' }}>
            <TabsTrigger value="profile" className="flex-1"><User className="w-4 h-4 mr-1" /> Profile</TabsTrigger>
            <TabsTrigger value="social" className="flex-1"><Globe className="w-4 h-4 mr-1" /> Social</TabsTrigger>
            <TabsTrigger value="wallet" className="flex-1"><Wallet className="w-4 h-4 mr-1" /> Wallet</TabsTrigger>
            <TabsTrigger value="theme" className="flex-1"><Palette className="w-4 h-4 mr-1" /> Theme</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <Card style={{ background: 'oklch(0.10 0.025 270)', border: '1px solid oklch(0.72 0.28 305 / 0.20)' }}>
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <Edit3 className="w-4 h-4" style={{ color: 'oklch(0.72 0.28 305)' }} />
                  Profile Info
                  <span className="text-xs font-normal ml-auto" style={{ color: 'oklch(0.55 0.025 275)' }}>Auto-saves on change</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-white/70 text-xs">Display Name</Label>
                  <div className="relative">
                    <Input
                      value={form.displayName}
                      onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))}
                      onBlur={e => handleFieldBlur("displayName", e.target.value)}
                      placeholder="Your display name"
                      className="bg-black/30 border-white/10 text-white pr-8"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2">{fieldStatus("displayName")}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-white/70 text-xs">Username</Label>
                  <div className="relative">
                    <Input
                      value={form.username}
                      onChange={e => setForm(f => ({ ...f, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "") }))}
                      onBlur={e => handleFieldBlur("username", e.target.value)}
                      placeholder="your_username"
                      className="bg-black/30 border-white/10 text-white pr-8"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2">{fieldStatus("username")}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-white/70 text-xs">Bio</Label>
                  <div className="relative">
                    <Textarea
                      value={form.bio}
                      onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                      onBlur={e => handleFieldBlur("bio", e.target.value)}
                      placeholder="Tell the world about yourself..."
                      className="bg-black/30 border-white/10 text-white resize-none"
                      rows={3}
                      maxLength={500}
                    />
                    <span className="absolute right-2 bottom-2">{fieldStatus("bio")}</span>
                  </div>
                  <p className="text-xs text-right" style={{ color: 'oklch(0.45 0.015 275)' }}>{form.bio.length}/500</p>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-white/70 text-xs flex items-center gap-1"><MapPin className="w-3 h-3" /> Location</Label>
                  <div className="relative">
                    <Input
                      value={form.location}
                      onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                      onBlur={e => handleFieldBlur("location", e.target.value)}
                      placeholder="City, Country"
                      className="bg-black/30 border-white/10 text-white pr-8"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2">{fieldStatus("location")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Tab */}
          <TabsContent value="social" className="space-y-4">
            <Card style={{ background: 'oklch(0.10 0.025 270)', border: '1px solid oklch(0.72 0.28 305 / 0.20)' }}>
              <CardHeader>
                <CardTitle className="text-white text-sm">Social Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: "website", icon: Globe, placeholder: "https://yoursite.com", label: "Website" },
                  { key: "twitter", icon: Twitter, placeholder: "@username", label: "Twitter / X" },
                  { key: "instagram", icon: Instagram, placeholder: "@username", label: "Instagram" },
                  { key: "youtube", icon: Youtube, placeholder: "Channel URL or @handle", label: "YouTube" },
                ].map(({ key, icon: Icon, placeholder, label }) => (
                  <div key={key} className="space-y-1.5">
                    <Label className="text-white/70 text-xs flex items-center gap-1">
                      <Icon className="w-3 h-3" /> {label}
                    </Label>
                    <div className="relative">
                      <Input
                        value={(form as any)[key]}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        onBlur={e => handleFieldBlur(key, e.target.value)}
                        placeholder={placeholder}
                        className="bg-black/30 border-white/10 text-white pr-8"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2">{fieldStatus(key)}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wallet Tab */}
          <TabsContent value="wallet" className="space-y-4">
            <Card style={{ background: 'oklch(0.10 0.025 270)', border: '1px solid oklch(0.72 0.28 305 / 0.20)' }}>
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <Wallet className="w-4 h-4" style={{ color: 'oklch(0.72 0.28 305)' }} />
                  Wallet Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-white/70 text-xs">Public Wallet Address</Label>
                  <div className="relative">
                    <Input
                      value={form.walletAddress}
                      onChange={e => setForm(f => ({ ...f, walletAddress: e.target.value }))}
                      onBlur={e => handleFieldBlur("walletAddress", e.target.value)}
                      placeholder="0x..."
                      className="bg-black/30 border-white/10 text-white font-mono text-sm pr-8"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2">{fieldStatus("walletAddress")}</span>
                  </div>
                  <p className="text-xs" style={{ color: 'oklch(0.45 0.015 275)' }}>
                    This address will be shown on your public profile for tips and payments.
                  </p>
                </div>
                <div className="p-4 rounded-xl" style={{ background: 'oklch(0.72 0.28 305 / 0.10)', border: '1px solid oklch(0.72 0.28 305 / 0.25)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4" style={{ color: 'oklch(0.72 0.28 305)' }} />
                    <span className="text-white text-sm font-medium">Connect MetaMask</span>
                  </div>
                  <p className="text-xs mb-3" style={{ color: 'oklch(0.55 0.025 275)' }}>
                    Connect your wallet to enable on-chain features, staking, and token rewards.
                  </p>
                  <Button
                    className="w-full text-white font-semibold"
                    style={{ background: 'linear-gradient(135deg, oklch(0.72 0.28 305), oklch(0.72 0.28 340))', border: 'none' }}
                    onClick={() => {
                      if ((window as any).ethereum) {
                        (window as any).ethereum.request({ method: 'eth_requestAccounts' })
                          .then((accounts: string[]) => {
                            if (accounts[0]) {
                              setForm(f => ({ ...f, walletAddress: accounts[0] }));
                              updateProfile.mutate({ walletAddress: accounts[0] });
                              toast.success("Wallet connected: " + accounts[0].slice(0, 6) + "..." + accounts[0].slice(-4));
                            }
                          })
                          .catch(() => toast.error("Wallet connection rejected"));
                      } else {
                        toast.error("MetaMask not detected. Install it from metamask.io");
                      }
                    }}
                  >
                    Connect Wallet
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Theme Tab */}
          <TabsContent value="theme" className="space-y-4">
            <Card style={{ background: 'oklch(0.10 0.025 270)', border: '1px solid oklch(0.72 0.28 305 / 0.20)' }}>
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <Palette className="w-4 h-4" style={{ color: 'oklch(0.72 0.28 305)' }} />
                  Profile Theme
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {THEME_PRESETS.map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => setForm(f => ({ ...f, selectedTheme: theme.id }))}
                      className="p-3 rounded-xl text-left transition-all"
                      style={{
                        background: form.selectedTheme === theme.id ? 'oklch(0.72 0.28 305 / 0.20)' : 'oklch(0.13 0.025 275)',
                        border: `1px solid ${form.selectedTheme === theme.id ? 'oklch(0.72 0.28 305 / 0.6)' : 'oklch(0.20 0.035 280)'}`,
                      }}
                    >
                      <div className="flex gap-1.5 mb-2">
                        {theme.colors.map((c, i) => (
                          <div key={i} className="w-5 h-5 rounded-full" style={{ background: c }} />
                        ))}
                      </div>
                      <div className="text-white text-sm font-medium">{theme.name}</div>
                      <div className="text-xs mt-0.5" style={{ color: 'oklch(0.55 0.025 275)' }}>{theme.desc}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
