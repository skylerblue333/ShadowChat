import { useState } from "react";
import { Scissors, Play, Share2, Download, Heart, Eye, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";

const clips = [
  { id: "c1", title: "Epic 5x Combo in Sky Arena", creator: "ProGamer_X", views: 12847, likes: 892, duration: "0:32", thumbnail: "🎮", game: "Sky Arena", created: "2h ago" },
  { id: "c2", title: "SKY444 Token hits $1.00!", creator: "CryptoKing", views: 8234, likes: 634, duration: "0:45", thumbnail: "💰", game: "Crypto Stream", created: "5h ago" },
  { id: "c3", title: "Perfect Assembly Solution", creator: "CodeWizard", views: 5621, likes: 421, duration: "1:12", thumbnail: "💻", game: "Assembly Puzzle", created: "1d ago" },
  { id: "c4", title: "Tournament Final Round", creator: "ChampionZ", views: 24891, likes: 1847, duration: "2:18", thumbnail: "🏆", game: "Tournament", created: "2d ago" },
];

export default function StreamClip() {
  const [clipStart, setClipStart] = useState([30]);
  const [clipEnd, setClipEnd] = useState([90]);
  const [clipTitle, setClipTitle] = useState("");
  const [creating, setCreating] = useState(false);

  const createClip = () => {
    if (!clipTitle) { toast.error("Add a title for your clip"); return; }
    setCreating(true);
    setTimeout(() => {
      setCreating(false);
      toast.success("Clip created and shared!");
      setClipTitle("");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 max-w-5xl">
        <PageHeader backHref="/streaming" icon={Scissors} title="Stream Clips" subtitle="Create, share, and discover the best moments from streams" />

        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Plus className="w-4 h-4" />Create New Clip</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Clip Title</Label>
              <Input value={clipTitle} onChange={e => setClipTitle(e.target.value)} placeholder="Name your epic moment..." className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Start Time: {clipStart[0]}s</Label>
                <Slider value={clipStart} onValueChange={setClipStart} min={0} max={300} step={1} className="mt-2" />
              </div>
              <div>
                <Label className="text-xs">End Time: {clipEnd[0]}s</Label>
                <Slider value={clipEnd} onValueChange={setClipEnd} min={0} max={300} step={1} className="mt-2" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Duration: <span className="text-primary font-medium">{clipEnd[0] - clipStart[0]}s</span>
              </div>
              <Button onClick={createClip} disabled={creating} className="ml-auto">
                <Scissors className="w-4 h-4 mr-2" />
                {creating ? "Creating..." : "Create Clip"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <h2 className="text-lg font-semibold mb-4">Trending Clips</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {clips.map(clip => (
            <Card key={clip.id} className="border-border/50 hover:border-primary/40 transition-colors group">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center text-3xl shrink-0">{clip.thumbnail}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{clip.title}</p>
                    <p className="text-xs text-muted-foreground">{clip.creator} · {clip.created}</p>
                    <Badge variant="outline" className="text-xs mt-1">{clip.game}</Badge>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{clip.views.toLocaleString()}</span>
                      <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{clip.likes}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{clip.duration}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.success("Playing clip...")}><Play className="w-3 h-3 mr-1" />Play</Button>
                  <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(`https://skycoin4444.io/clips/${clip.id}`); toast.success("Link copied!"); }}><Share2 className="w-3 h-3" /></Button>
                  <Button size="sm" variant="outline" onClick={() => toast.success("Downloading...")}><Download className="w-3 h-3" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
