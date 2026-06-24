import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Lock, Upload, Image, Video, FileText, Zap, ChevronLeft, Users, Clock, DollarSign, Star, Shield, Copy, Eye, EyeOff, Plus, Minus, CheckCircle2 } from "lucide-react";

export default function CreateDrop() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dropType, setDropType] = useState<"nft" | "video" | "file" | "early-access">("nft");
  const [price, setPrice] = useState("44");
  const [supply, setSupply] = useState("100");
  const [accessType, setAccessType] = useState<"holders" | "subscribers" | "whitelist">("holders");
  const [previewVisible, setPreviewVisible] = useState(false);
  const [step, setStep] = useState(1);

  const dropTypes = [
    { value: "nft", label: "NFT Drop", icon: Image, desc: "Mint exclusive NFTs for your community", color: "text-yellow-400", border: "border-yellow-500/30", bg: "bg-yellow-500/10" },
    { value: "video", label: "Private Video", icon: Video, desc: "Token-gated video content", color: "text-blue-400", border: "border-blue-500/30", bg: "bg-blue-500/10" },
    { value: "file", label: "Digital File", icon: FileText, desc: "Exclusive downloads, templates, code", color: "text-purple-400", border: "border-purple-500/30", bg: "bg-purple-600/10" },
    { value: "early-access", label: "Early Access", icon: Zap, desc: "First access to your new content", color: "text-purple-400", border: "border-purple-500/30", bg: "bg-purple-500/10" },
  ] as const;

  const selected = dropTypes.find(d => d.value === dropType)!;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur px-4 py-2.5 flex items-center gap-3">
        <Link href="/creator-onboarding">
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground"><ChevronLeft className="h-4 w-4" />Back</Button>
        </Link>
        <Badge variant="outline" className="text-xs font-mono text-yellow-400 border-yellow-500/30">Exclusive Drop</Badge>
        <div className="flex-1" />
        <Button variant="outline" size="sm">Save Draft</Button>
        <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold gap-1" disabled={!title}>
          <Lock className="h-4 w-4" />Launch Drop
        </Button>
      </div>

      {/* Step Indicator */}
      <div className="border-b border-border/50 bg-card/20 px-4 py-3">
        <div className="container max-w-3xl flex items-center gap-2">
          {["Content Type", "Details", "Access & Pricing", "Review"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step > i + 1 ? "bg-purple-600 text-white" : step === i + 1 ? "bg-primary text-primary-foreground" : "bg-card/50 border border-border/50 text-muted-foreground"}`}>
                {step > i + 1 ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`text-xs hidden md:block ${step === i + 1 ? "text-foreground font-medium" : "text-muted-foreground"}`}>{s}</span>
              {i < 3 && <div className="w-8 h-px bg-border/50 hidden md:block" />}
            </div>
          ))}
        </div>
      </div>

      <div className="container max-w-3xl py-8">
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold mb-2">What type of exclusive drop?</h2>
            <p className="text-muted-foreground text-sm mb-6">Choose the format for your exclusive content.</p>
            <div className="grid md:grid-cols-2 gap-4">
              {dropTypes.map(dt => (
                <button key={dt.value} onClick={() => setDropType(dt.value)} className={`rounded-xl border p-5 text-left transition-all hover:scale-[1.01] ${dropType === dt.value ? `${dt.border} ${dt.bg}` : "border-border/50 bg-card/20 hover:border-border"}`}>
                  <dt.icon className={`h-8 w-8 ${dt.color} mb-3`} />
                  <p className="font-bold text-sm mb-1">{dt.label}</p>
                  <p className="text-xs text-muted-foreground">{dt.desc}</p>
                </button>
              ))}
            </div>
            <Button className="mt-6 bg-primary text-primary-foreground gap-2" onClick={() => setStep(2)}>Continue <Zap className="h-4 w-4" /></Button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold mb-6">Drop Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Drop Title</label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Genesis Collection #001" className="bg-card/30 border-border/50" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe what holders get access to..." className="w-full h-28 rounded-xl border border-border/50 bg-card/30 p-4 text-sm resize-none focus:outline-none focus:border-primary/50" />
              </div>
              <div className="rounded-xl border border-dashed border-border/50 bg-card/20 p-8 text-center">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium mb-1">Upload your content</p>
                <p className="text-xs text-muted-foreground mb-3">Images, videos, PDFs, or ZIP files · Max 500MB</p>
                <Button variant="outline" size="sm">Browse Files</Button>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button className="bg-primary text-primary-foreground gap-2" onClick={() => setStep(3)} disabled={!title}>Continue <Zap className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold mb-6">Access & Pricing</h2>
            <div className="space-y-5">
              {/* Access Type */}
              <div>
                <label className="text-sm font-medium mb-3 block">Who can access this drop?</label>
                <div className="grid grid-cols-3 gap-3">
                  {([
                    { value: "holders", label: "NFT Holders", icon: Shield, desc: "Must hold your NFT" },
                    { value: "subscribers", label: "Subscribers", icon: Star, desc: "Paying subscribers" },
                    { value: "whitelist", label: "Whitelist", icon: Users, desc: "Approved wallets" },
                  ] as const).map(a => (
                    <button key={a.value} onClick={() => setAccessType(a.value)} className={`rounded-xl border p-3 text-center transition-all ${accessType === a.value ? "border-yellow-500/50 bg-yellow-500/10" : "border-border/50 hover:border-border"}`}>
                      <a.icon className={`h-5 w-5 mx-auto mb-1.5 ${accessType === a.value ? "text-yellow-400" : "text-muted-foreground"}`} />
                      <p className="text-xs font-medium">{a.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{a.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Price (SKY444)</label>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setPrice(p => String(Math.max(0, parseInt(p) - 1)))} className="w-9 h-9 rounded-lg border border-border/50 flex items-center justify-center hover:bg-card/50"><Minus className="h-4 w-4" /></button>
                    <Input value={price} onChange={e => setPrice(e.target.value)} className="text-center bg-card/30 border-border/50" />
                    <button onClick={() => setPrice(p => String(parseInt(p) + 1))} className="w-9 h-9 rounded-lg border border-border/50 flex items-center justify-center hover:bg-card/50"><Plus className="h-4 w-4" /></button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Supply</label>
                  <Input value={supply} onChange={e => setSupply(e.target.value)} placeholder="e.g. 100 or unlimited" className="bg-card/30 border-border/50" />
                </div>
              </div>

              {/* Revenue Preview */}
              <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4">
                <p className="text-sm font-semibold text-yellow-400 mb-3">💰 Revenue Preview</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">If all {supply} sell at {price} SKY444</span><span className="font-bold text-yellow-400">{parseInt(price) * parseInt(supply)} SKY444</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Platform fee (5%)</span><span className="text-muted-foreground">-{Math.round(parseInt(price) * parseInt(supply) * 0.05)} SKY444</span></div>
                  <div className="flex justify-between font-bold"><span>Your earnings</span><span className="text-purple-400">{Math.round(parseInt(price) * parseInt(supply) * 0.95)} SKY444</span></div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button className="bg-primary text-primary-foreground gap-2" onClick={() => setStep(4)}>Review Drop <Zap className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-xl font-bold mb-6">Review & Launch</h2>
            <div className="rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/5 to-amber-500/5 p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center">
                  <Lock className="h-8 w-8 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">{title || "Untitled Drop"}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{description || "No description provided."}</p>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <span className="flex items-center gap-1 text-yellow-400"><DollarSign className="h-3.5 w-3.5" />{price} SKY444</span>
                    <span className="flex items-center gap-1 text-muted-foreground"><Users className="h-3.5 w-3.5" />{supply} supply</span>
                    <span className="flex items-center gap-1 text-muted-foreground"><Shield className="h-3.5 w-3.5" />{accessType}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold gap-2 flex-1">
                <Lock className="h-4 w-4" />Launch Exclusive Drop
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
