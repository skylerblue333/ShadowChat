import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Play, Calendar, Users, Eye, Heart, Share2, Settings, Loader2, Radio, Clock } from "lucide-react";

interface Stream {
  id: string;
  title: string;
  description: string;
  status: "live" | "scheduled" | "ended";
  viewers: number;
  duration: number;
  likes: number;
  scheduledAt?: Date;
  thumbnail?: string;
}

const mockStreams: Stream[] = [
  {
    id: "1",
    title: "Web3 Trading Strategies",
    description: "Learn advanced trading techniques on SKYCOIN4444",
    status: "live",
    viewers: 1243,
    duration: 45,
    likes: 523,
    thumbnail: "https://via.placeholder.com/300x170",
  },
  {
    id: "2",
    title: "Mining Pool Deep Dive",
    description: "Everything you need to know about mining pools",
    status: "scheduled",
    viewers: 0,
    duration: 0,
    likes: 0,
    scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  },
  {
    id: "3",
    title: "Community Q&A Session",
    description: "Ask me anything about SKYCOIN4444",
    status: "ended",
    viewers: 2156,
    duration: 120,
    likes: 1245,
  },
];

export function LivestreamDashboard() {
  const [activeTab, setActiveTab] = useState("live");
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    scheduledTime: "",
  });

  const handleCreateStream = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      if (!formData.title) {
        toast.error("Please enter a stream title");
        setIsCreating(false);
        return;
      }
      toast.success("Stream scheduled successfully!");
      setFormData({ title: "", description: "", scheduledTime: "" });
    } catch (error) {
      toast.error("Failed to create stream");
    } finally {
      setIsCreating(false);
    }
  };

  const handleGoLive = async (streamId: string) => {
    try {
      toast.success("Going live! Redirecting to stream...");
      // Redirect to stream
    } catch (error) {
      toast.error("Failed to start stream");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Livestream Dashboard</h1>
            <p className="text-slate-400">Manage your live streams and broadcasts</p>
          </div>
          <Button className="bg-red-600 hover:bg-red-700 flex items-center gap-2">
            <Radio className="w-4 h-4" />
            Go Live Now
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800 border border-slate-700">
            <TabsTrigger value="live" className="text-slate-300">Live</TabsTrigger>
            <TabsTrigger value="scheduled" className="text-slate-300">Scheduled</TabsTrigger>
            <TabsTrigger value="ended" className="text-slate-300">Ended</TabsTrigger>
            <TabsTrigger value="create" className="text-slate-300">Create</TabsTrigger>
          </TabsList>

          {/* Live Streams */}
          <TabsContent value="live" className="space-y-4">
            {mockStreams
              .filter((s) => s.status === "live")
              .map((stream) => (
                <Card key={stream.id} className="border-slate-700 bg-slate-800/50 overflow-hidden">
                  <div className="flex gap-4 p-4">
                    <div className="w-40 h-24 bg-slate-700 rounded-lg flex items-center justify-center relative">
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-red-600 animate-pulse">LIVE</Badge>
                      </div>
                      <Play className="w-8 h-8 text-white/50" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1">{stream.title}</h3>
                      <p className="text-sm text-slate-400 mb-3">{stream.description}</p>
                      <div className="flex gap-6 text-sm">
                        <div className="flex items-center gap-1 text-slate-300">
                          <Eye className="w-4 h-4" />
                          {stream.viewers.toLocaleString()} viewers
                        </div>
                        <div className="flex items-center gap-1 text-slate-300">
                          <Clock className="w-4 h-4" />
                          {stream.duration} min
                        </div>
                        <div className="flex items-center gap-1 text-slate-300">
                          <Heart className="w-4 h-4" />
                          {stream.likes.toLocaleString()} likes
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                        <Settings className="w-4 h-4 mr-1" />
                        Settings
                      </Button>
                      <Button size="sm" variant="outline" className="border-slate-600">
                        <Share2 className="w-4 h-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
          </TabsContent>

          {/* Scheduled Streams */}
          <TabsContent value="scheduled" className="space-y-4">
            {mockStreams
              .filter((s) => s.status === "scheduled")
              .map((stream) => (
                <Card key={stream.id} className="border-slate-700 bg-slate-800/50">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">{stream.title}</h3>
                        <p className="text-sm text-slate-400 mb-2">{stream.description}</p>
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <Calendar className="w-4 h-4" />
                          {stream.scheduledAt?.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleGoLive(stream.id)} className="bg-red-600 hover:bg-red-700">
                          Go Live
                        </Button>
                        <Button variant="outline" className="border-slate-600">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          {/* Ended Streams */}
          <TabsContent value="ended" className="space-y-4">
            {mockStreams
              .filter((s) => s.status === "ended")
              .map((stream) => (
                <Card key={stream.id} className="border-slate-700 bg-slate-800/50">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">{stream.title}</h3>
                        <div className="flex gap-6 text-sm text-slate-400">
                          <span>{stream.viewers.toLocaleString()} viewers</span>
                          <span>{stream.duration} minutes</span>
                          <span>{stream.likes.toLocaleString()} likes</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" className="border-slate-600">
                          Watch Replay
                        </Button>
                        <Button variant="outline" className="border-slate-600">
                          Share
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          {/* Create Stream */}
          <TabsContent value="create" className="space-y-4">
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white">Schedule a New Stream</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateStream} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">Stream Title</label>
                    <Input
                      placeholder="Enter stream title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                      disabled={isCreating}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">Description</label>
                    <Textarea
                      placeholder="Describe your stream"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                      disabled={isCreating}
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">Scheduled Time (Optional)</label>
                    <Input
                      type="datetime-local"
                      value={formData.scheduledTime}
                      onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                      disabled={isCreating}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isCreating}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Stream"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default LivestreamDashboard;
