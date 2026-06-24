import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Webhook, Plus, Trash2, Play, CheckCircle, XCircle, Clock, Copy, RefreshCw, Zap } from "lucide-react";

const WEBHOOK_EVENTS = [
  "post.created", "post.liked", "post.commented",
  "user.followed", "user.subscribed",
  "stream.started", "stream.ended", "stream.gifted",
  "marketplace.order.created", "marketplace.order.fulfilled",
  "wallet.transaction", "staking.reward",
  "tournament.started", "tournament.ended",
  "charity.donation",
];

interface WebhookEntry {
  id: string;
  url: string;
  events: string[];
  secret: string;
  status: "active" | "failing" | "paused";
  lastDelivery?: string;
  successRate: number;
}

const MOCK_WEBHOOKS: WebhookEntry[] = [
  { id: "wh_1", url: "https://api.example.com/hooks/shadowchat", events: ["post.created", "user.followed"], secret: "sk_live_••••••••", status: "active", lastDelivery: "2 min ago", successRate: 98.5 },
  { id: "wh_2", url: "https://discord.com/api/webhooks/123/abc", events: ["stream.started", "stream.gifted"], secret: "sk_live_••••••••", status: "active", lastDelivery: "1h ago", successRate: 100 },
];

export default function WebhookManager() {
  const { user } = useAuth();
  const [webhooks, setWebhooks] = useState<WebhookEntry[]>(MOCK_WEBHOOKS);
  const [showAdd, setShowAdd] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newSecret, setNewSecret] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  const registerMutation = trpc.distribution.registerWebhook.useMutation({
    onSuccess: () => {
      const newHook: WebhookEntry = {
        id: `wh_${Date.now()}`,
        url: newUrl,
        events: selectedEvents,
        secret: newSecret || "auto-generated",
        status: "active",
        successRate: 100,
      };
      setWebhooks(prev => [...prev, newHook]);
      setShowAdd(false);
      setNewUrl("");
      setNewSecret("");
      setSelectedEvents([]);
      toast.success("Webhook registered successfully!");
    },
    onError: () => toast.error("Failed to register webhook"),
  });

  const handleRegister = () => {
    if (!newUrl || selectedEvents.length === 0) {
      toast.error("Enter a URL and select at least one event");
      return;
    }
    if (!user) { toast.error("Sign in to register webhooks"); return; }
    registerMutation.mutate({
      userId: user.id,
      url: newUrl,
      events: selectedEvents,
      secret: newSecret || crypto.randomUUID(),
    });
  };

  const toggleEvent = (event: string) => {
    setSelectedEvents(prev =>
      prev.includes(event) ? prev.filter(e => e !== event) : [...prev, event]
    );
  };

  const copySecret = (secret: string) => {
    navigator.clipboard.writeText(secret).catch(() => {});
    toast.success("Secret copied!");
  };

  const testWebhook = (id: string) => {
    toast.info("Sending test event...");
    setTimeout(() => toast.success("Test event delivered!"), 1500);
  };

  const deleteWebhook = (id: string) => {
    setWebhooks(prev => prev.filter(w => w.id !== id));
    toast.success("Webhook deleted");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <PageHeader
          title="Webhook Manager"
          subtitle="Receive real-time events from the SKYCOIN4444 platform"
          backHref="/settings"
          icon={Webhook}
          actions={
            <Button onClick={() => setShowAdd(!showAdd)} className="bg-violet-600 hover:bg-violet-700 gap-2">
              <Plus className="w-4 h-4" /> Add Webhook
            </Button>
          }
        />

        {/* Add Webhook Form */}
        {showAdd && (
          <Card className="bg-zinc-900 border-violet-700/50">
            <CardHeader><CardTitle className="text-sm text-violet-400">Register New Webhook</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-400">Endpoint URL *</Label>
                  <Input
                    placeholder="https://your-server.com/webhooks/shadowchat"
                    value={newUrl}
                    onChange={e => setNewUrl(e.target.value)}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-400">Secret (optional — auto-generated if empty)</Label>
                  <Input
                    placeholder="sk_live_..."
                    value={newSecret}
                    onChange={e => setNewSecret(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 font-mono"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-zinc-400">Events to subscribe *</Label>
                <div className="flex flex-wrap gap-2">
                  {WEBHOOK_EVENTS.map(event => (
                    <button
                      key={event}
                      onClick={() => toggleEvent(event)}
                      className={`px-2.5 py-1 rounded-full text-xs font-mono transition-colors ${
                        selectedEvents.includes(event)
                          ? "bg-violet-600 text-white"
                          : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                      }`}
                    >
                      {event}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowAdd(false)} className="border-zinc-700">Cancel</Button>
                <Button
                  onClick={handleRegister}
                  disabled={registerMutation.isPending}
                  className="bg-violet-600 hover:bg-violet-700 gap-2"
                >
                  {registerMutation.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  Register
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Webhook List */}
        {webhooks.length === 0 ? (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-8 text-center">
              <Webhook className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-400 text-sm">No webhooks yet. Add one to receive real-time events.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {webhooks.map(hook => (
              <Card key={hook.id} className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={`text-xs ${
                          hook.status === "active" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
                          hook.status === "failing" ? "bg-red-500/20 text-red-400 border-red-500/30" :
                          "bg-zinc-700 text-zinc-400 border-zinc-600"
                        }`}>
                          {hook.status === "active" ? <CheckCircle className="w-3 h-3 mr-1" /> :
                           hook.status === "failing" ? <XCircle className="w-3 h-3 mr-1" /> :
                           <Clock className="w-3 h-3 mr-1" />}
                          {hook.status}
                        </Badge>
                        <span className="text-xs text-zinc-500">{hook.successRate}% success</span>
                        {hook.lastDelivery && <span className="text-xs text-zinc-500">Last: {hook.lastDelivery}</span>}
                      </div>
                      <p className="text-sm font-mono text-white truncate">{hook.url}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-xs text-zinc-500">Secret:</span>
                        <code className="text-xs font-mono text-zinc-400">{hook.secret}</code>
                        <button onClick={() => copySecret(hook.secret)} className="text-zinc-600 hover:text-zinc-400">
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {hook.events.map(e => (
                          <span key={e} className="px-1.5 py-0.5 bg-zinc-800 rounded text-xs font-mono text-zinc-400">{e}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <Button size="sm" variant="outline" onClick={() => testWebhook(hook.id)} className="border-zinc-700 gap-1 text-xs">
                        <Play className="w-3 h-3" /> Test
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => deleteWebhook(hook.id)} className="border-red-800 text-red-400 hover:bg-red-900/20">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Docs */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader><CardTitle className="text-sm">Webhook Payload Format</CardTitle></CardHeader>
          <CardContent>
            <pre className="text-xs font-mono text-zinc-300 bg-zinc-800/50 p-3 rounded-lg overflow-auto">
{`POST https://your-server.com/webhooks/shadowchat
Content-Type: application/json
X-Shadowchat-Signature: sha256=<hmac>

{
  "event": "post.created",
  "timestamp": 1718700000000,
  "data": {
    "postId": 123,
    "userId": 456,
    "content": "Hello world!"
  }
}`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
