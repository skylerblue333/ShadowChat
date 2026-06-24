import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";
import { Video, Upload, X, Hash, Clock, Sparkles, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";

const EFFECTS = ["None", "Glow", "Neon", "Vintage", "Blur BG", "Mirror", "Slow Mo", "Speed Up"];
const AUDIO_TRACKS = [
  { id: "none", name: "Original Audio" },
  { id: "sky444-anthem", name: "SKY444 Anthem 🎵" },
  { id: "crypto-vibes", name: "Crypto Vibes 🔥" },
  { id: "web3-beats", name: "Web3 Beats 🎧" },
  { id: "hope-theme", name: "Hope Theme 💙" },
];

export default function CreateReel() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [caption, setCaption] = useState("");
  const [hashtagInput, setHashtagInput] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [selectedEffect, setSelectedEffect] = useState("None");
  const [selectedAudio, setSelectedAudio] = useState("none");
  const [duration, setDuration] = useState(30);
  const [isPremium, setIsPremium] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const createReelMutation = trpc.socialCore.createReel.useMutation({
    onSuccess: () => {
      toast.success("Reel published! 🎉");
      navigate("/reels");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to publish reel");
      setIsUploading(false);
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="container py-16 max-w-lg text-center">
        <Video className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-bold mb-2">Sign in to create reels</h2>
        <p className="text-muted-foreground mb-6">Share your story with the SKYCOIN4444 community</p>
        <a href={getLoginUrl()}>
          <Button className="btn-primary">Sign In</Button>
        </a>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) { toast.error("Please select a video file"); return; }
    if (file.size > 100 * 1024 * 1024) { toast.error("Video must be under 100MB"); return; }
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoPreview(url);
  };

  const addHashtag = () => {
    const tag = hashtagInput.replace(/^#/, "").trim().toLowerCase();
    if (!tag || hashtags.includes(tag) || hashtags.length >= 10) return;
    setHashtags(prev => [...prev, tag]);
    setHashtagInput("");
  };

  const removeHashtag = (tag: string) => setHashtags(prev => prev.filter(t => t !== tag));

  const handleSubmit = async () => {
    if (!caption.trim()) { toast.error("Add a caption to your reel"); return; }
    setIsUploading(true);

    try {
      let videoUrl = "";
      let thumbnailUrl = "";

      if (videoFile) {
        // Upload video file
        const formData = new FormData();
        formData.append("file", videoFile);
        const res = await fetch("/api/upload", { method: "POST", body: formData, credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          videoUrl = data.url || "";
          thumbnailUrl = data.thumbnailUrl || "";
        }
      }

      await createReelMutation.mutateAsync({
        videoUrl,
        thumbnailUrl,
        duration,
        caption: caption.trim(),
        hashtags,
        audioTrack: selectedAudio !== "none" ? (AUDIO_TRACKS.find(a => a.id === selectedAudio)?.name || selectedAudio) : undefined,
      });
    } catch {
      setIsUploading(false);
    }
  };

  return (
    <div className="container py-8 max-w-2xl animate-page-in">
      <PageHeader
        backHref="/reels"
        icon={Video}
        title="Create Reel"
        subtitle="Share a short video with the community"
      />

      <div className="space-y-6">
        {/* Video Upload */}
        <Card className="p-6">
          <Label className="text-sm font-medium mb-3 block">Video</Label>
          {videoPreview ? (
            <div className="relative rounded-xl overflow-hidden bg-black aspect-[9/16] max-h-64">
              <video src={videoPreview} className="w-full h-full object-contain" controls muted />
              <button
                onClick={() => { setVideoFile(null); setVideoPreview(null); }}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full border-2 border-dashed border-border rounded-xl p-12 flex flex-col items-center gap-3 hover:border-primary/50 hover:bg-primary/5 transition-all"
            >
              <Upload className="w-8 h-8 text-muted-foreground" />
              <div className="text-sm text-muted-foreground text-center">
                <span className="text-primary font-medium">Click to upload</span> or drag and drop<br />
                MP4, MOV, WebM · Max 100MB · Up to 90 seconds
              </div>
            </button>
          )}
          <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={handleFileChange} />
        </Card>

        {/* Caption */}
        <Card className="p-6">
          <Label className="text-sm font-medium mb-2 block">Caption</Label>
          <Textarea
            value={caption}
            onChange={e => setCaption(e.target.value)}
            placeholder="Write a caption for your reel… #SKY444 #Web3"
            className="min-h-[80px] resize-none"
            maxLength={500}
          />
          <div className="text-xs text-muted-foreground text-right mt-1">{caption.length}/500</div>
        </Card>

        {/* Hashtags */}
        <Card className="p-6">
          <Label className="text-sm font-medium mb-3 block flex items-center gap-2">
            <Hash className="w-4 h-4" /> Hashtags
          </Label>
          <div className="flex gap-2 mb-3">
            <Input
              value={hashtagInput}
              onChange={e => setHashtagInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addHashtag())}
              placeholder="#crypto #web3 #sky444"
              className="flex-1"
            />
            <Button variant="outline" onClick={addHashtag} size="sm">Add</Button>
          </div>
          {hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {hashtags.map(tag => (
                <Badge key={tag} variant="secondary" className="gap-1 cursor-pointer" onClick={() => removeHashtag(tag)}>
                  #{tag} <X className="w-3 h-3" />
                </Badge>
              ))}
            </div>
          )}
        </Card>

        {/* Duration */}
        <Card className="p-6">
          <Label className="text-sm font-medium mb-3 block flex items-center gap-2">
            <Clock className="w-4 h-4" /> Duration (seconds)
          </Label>
          <div className="flex gap-2">
            {[15, 30, 45, 60, 90].map(d => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${duration === d ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground hover:bg-secondary"}`}
              >
                {d}s
              </button>
            ))}
          </div>
        </Card>

        {/* Audio */}
        <Card className="p-6">
          <Label className="text-sm font-medium mb-3 block">Audio Track</Label>
          <div className="space-y-2">
            {AUDIO_TRACKS.map(track => (
              <button
                key={track.id}
                onClick={() => setSelectedAudio(track.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${selectedAudio === track.id ? "bg-primary/20 text-primary border border-primary/30" : "bg-secondary/30 hover:bg-secondary/60 border border-transparent"}`}
              >
                {track.name}
              </button>
            ))}
          </div>
        </Card>

        {/* Effects */}
        <Card className="p-6">
          <Label className="text-sm font-medium mb-3 block flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Effects
          </Label>
          <div className="flex flex-wrap gap-2">
            {EFFECTS.map(effect => (
              <button
                key={effect}
                onClick={() => setSelectedEffect(effect)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedEffect === effect ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground hover:bg-secondary"}`}
              >
                {effect}
              </button>
            ))}
          </div>
        </Card>

        {/* Premium toggle */}
        <Card className="p-4 flex items-center justify-between">
          <div>
            <div className="font-medium text-sm">Premium Content</div>
            <div className="text-xs text-muted-foreground">Only subscribers can view this reel</div>
          </div>
          <button
            onClick={() => setIsPremium(p => !p)}
            className={`w-11 h-6 rounded-full transition-all ${isPremium ? "bg-primary" : "bg-secondary"} relative`}
          >
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${isPremium ? "left-5.5" : "left-0.5"}`} />
          </button>
        </Card>

        {/* Submit */}
        <Button
          onClick={handleSubmit}
          disabled={isUploading || !caption.trim()}
          className="w-full btn-primary h-12 text-base"
        >
          {isUploading ? (
            <><Loader2 className="w-4 h-4 animate-spin mr-2" />Publishing…</>
          ) : (
            <><Video className="w-4 h-4 mr-2" />Publish Reel</>
          )}
        </Button>
      </div>
    </div>
  );
}
