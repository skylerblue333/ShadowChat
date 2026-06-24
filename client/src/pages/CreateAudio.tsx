import { useState, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Upload, Play, Pause, Trash2, ChevronLeft, Globe, Star, Lock, Save, Send, Music, Headphones, Clock } from "lucide-react";

export default function CreateAudio() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [recording, setRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [visibility, setVisibility] = useState<"public" | "subscribers" | "private">("public");
  const [audioType, setAudioType] = useState<"podcast" | "music" | "voice" | "interview">("podcast");
  const [saving, setSaving] = useState(false);

  const startRecording = () => { setRecording(true); };
  const stopRecording = () => { setRecording(false); setHasRecording(true); setDuration(142); };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
  };

  const formatDuration = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur px-4 py-2.5 flex items-center gap-3">
        <Link href="/creator-onboarding">
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground"><ChevronLeft className="h-4 w-4" />Back</Button>
        </Link>
        <Badge variant="outline" className="text-xs font-mono text-purple-400 border-purple-500/30">Audio</Badge>
        <div className="flex-1" />
        <Button variant="outline" size="sm" className="gap-1" onClick={handleSave} disabled={saving || !hasRecording}>
          <Save className="h-4 w-4" />{saving ? "Saving..." : "Save Draft"}
        </Button>
        <Button size="sm" className="bg-purple-500 hover:bg-purple-600 text-white gap-1" disabled={!title || !hasRecording}>
          <Send className="h-4 w-4" />Publish
        </Button>
      </div>

      <div className="container max-w-3xl py-10">
        {/* Type Selector */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {([
            { value: "podcast", label: "Podcast", icon: Headphones },
            { value: "music", label: "Music", icon: Music },
            { value: "voice", label: "Voice Note", icon: Mic },
            { value: "interview", label: "Interview", icon: Headphones },
          ] as const).map(t => (
            <button key={t.value} onClick={() => setAudioType(t.value)} className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${audioType === t.value ? "border-purple-500/50 bg-purple-500/10 text-purple-400" : "border-border/50 text-muted-foreground hover:border-border"}`}>
              <t.icon className="h-4 w-4" />{t.label}
            </button>
          ))}
        </div>

        {/* Title & Description */}
        <div className="space-y-4 mb-8">
          <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Episode title..." className="text-lg h-12 bg-card/30 border-border/50" />
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe your audio content..." className="w-full h-24 rounded-xl border border-border/50 bg-card/30 p-4 text-sm resize-none focus:outline-none focus:border-purple-500/50" />
        </div>

        {/* Recording Studio */}
        <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-violet-500/5 p-8 mb-6 text-center">
          <p className="text-sm text-muted-foreground mb-6">Record directly in your browser or upload an audio file</p>

          {/* Waveform Visualizer */}
          <div className="flex items-center justify-center gap-0.5 h-16 mb-6">
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={i} className={`w-1 rounded-full transition-all ${recording ? "bg-purple-400 animate-pulse" : hasRecording ? "bg-purple-500/60" : "bg-border/50"}`}
                style={{ height: recording ? `${20 + Math.random() * 40}px` : hasRecording ? `${8 + Math.sin(i * 0.4) * 20 + 20}px` : "8px" }} />
            ))}
          </div>

          {hasRecording && (
            <div className="flex items-center justify-center gap-3 mb-6">
              <button onClick={() => setPlaying(p => !p)} className="w-12 h-12 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center hover:bg-purple-500/30 transition-colors">
                {playing ? <Pause className="h-5 w-5 text-purple-400" /> : <Play className="h-5 w-5 text-purple-400 ml-0.5" />}
              </button>
              <div className="flex-1 max-w-xs h-1.5 bg-border/50 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 w-1/3 rounded-full" />
              </div>
              <span className="text-sm font-mono text-muted-foreground">{formatDuration(duration)}</span>
              <button onClick={() => { setHasRecording(false); setDuration(0); }} className="text-muted-foreground hover:text-red-400 transition-colors"><Trash2 className="h-4 w-4" /></button>
            </div>
          )}

          <div className="flex items-center justify-center gap-4">
            {!recording ? (
              <Button onClick={startRecording} className="bg-red-500 hover:bg-red-600 text-white gap-2 h-12 px-6">
                <Mic className="h-5 w-5" />Start Recording
              </Button>
            ) : (
              <Button onClick={stopRecording} className="bg-red-500 hover:bg-red-600 text-white gap-2 h-12 px-6 animate-pulse">
                <MicOff className="h-5 w-5" />Stop Recording
              </Button>
            )}
            <span className="text-muted-foreground text-sm">or</span>
            <Button variant="outline" className="gap-2 h-12">
              <Upload className="h-5 w-5" />Upload File
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3">Supports MP3, WAV, OGG, M4A · Max 100MB</p>
        </div>

        {/* Settings */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border/50 bg-card/30 p-4">
            <p className="text-sm font-semibold mb-3">Visibility</p>
            <div className="space-y-2">
              {([
                { value: "public", label: "Public", icon: Globe, color: "text-purple-400" },
                { value: "subscribers", label: "Subscribers Only", icon: Star, color: "text-yellow-400" },
                { value: "private", label: "Private", icon: Lock, color: "text-muted-foreground" },
              ] as const).map(v => (
                <button key={v.value} onClick={() => setVisibility(v.value)} className={`w-full flex items-center gap-2 p-2.5 rounded-lg border text-sm transition-all ${visibility === v.value ? "border-purple-500/50 bg-purple-500/10" : "border-border/30 hover:border-border/60"}`}>
                  <v.icon className={`h-4 w-4 ${v.color}`} />{v.label}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4">
            <p className="text-sm font-semibold text-yellow-400 mb-3">💰 Earnings</p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between"><span>Per 1K plays</span><span className="text-yellow-400">~22 SKY444</span></div>
              <div className="flex justify-between"><span>Tip revenue</span><span className="text-purple-400">100%</span></div>
              <div className="flex justify-between"><span>Subscriber plays</span><span className="text-purple-400">+50%</span></div>
              <div className="flex justify-between"><span>Platform fee</span><span>5%</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
