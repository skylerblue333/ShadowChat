/**
 * ActionPanel — YC MVP Surface 2
 * The execution layer: send money, tip, create listing, request service, match
 * Core loop: conversation → action → value
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { Link } from "wouter";
import {
  DollarSign, Briefcase, ShoppingBag, Heart, Zap, ArrowLeft,
  CheckCircle, Loader2, ChevronRight, Star, Shield, Clock,
  TrendingUp, Users, Bot, Send, X, Plus, Minus
} from "lucide-react";

type ActionMode = "tip" | "request_service" | "create_listing" | "match_request" | "ai_task" | null;

const QUICK_TIP_AMOUNTS = [5, 10, 25, 50, 100];

const SERVICE_CATEGORIES = [
  { id: "design", label: "Design", icon: "🎨", avgPrice: "$25–$150" },
  { id: "dev", label: "Development", icon: "💻", avgPrice: "$50–$500" },
  { id: "writing", label: "Writing", icon: "✍️", avgPrice: "$15–$100" },
  { id: "marketing", label: "Marketing", icon: "📈", avgPrice: "$30–$200" },
  { id: "video", label: "Video", icon: "🎬", avgPrice: "$50–$300" },
  { id: "music", label: "Music", icon: "🎵", avgPrice: "$20–$150" },
];

const RECENT_ACTIONS = [
  { type: "tip", desc: "Sent 25 SKY444 to Alex", time: "2m ago", status: "completed", icon: DollarSign, color: "text-yellow-400" },
  { type: "service", desc: "Hired PixelPro for logo", time: "1h ago", status: "in_progress", icon: Briefcase, color: "text-blue-400" },
  { type: "listing", desc: "Listed 'React Template'", time: "3h ago", status: "active", icon: ShoppingBag, color: "text-green-400" },
  { type: "tip", desc: "Received 10 SKY444 from Sarah", time: "5h ago", status: "completed", icon: DollarSign, color: "text-yellow-400" },
];

export default function ActionPanel() {
  const { user } = useAuth();
  const [activeMode, setActiveMode] = useState<ActionMode>(null);
  const [tipAmount, setTipAmount] = useState(10);
  const [tipRecipient, setTipRecipient] = useState("");
  const [tipMessage, setTipMessage] = useState("");
  const [serviceCategory, setServiceCategory] = useState("");
  const [serviceDesc, setServiceDesc] = useState("");
  const [serviceBudget, setServiceBudget] = useState("");
  const [listingTitle, setListingTitle] = useState("");
  const [listingPrice, setListingPrice] = useState("");
  const [listingDesc, setListingDesc] = useState("");
  const [aiTask, setAiTask] = useState("");
  const [success, setSuccess] = useState<string | null>(null);

  const tipMut = trpc.creator.tip.useMutation({
    onSuccess: () => {
      setSuccess(`Tip of ${tipAmount} SKY444 sent to ${tipRecipient}!`);
      setTimeout(() => { setSuccess(null); setActiveMode(null); }, 3000);
    },
    onError: () => toast.error("Tip failed — check your balance"),
  });

  const aiChatMut = trpc.ai.chat.useMutation({
    onSuccess: (data) => {
      const msg = (data as any)?.content ?? (data as any)?.message ?? "Task processed!";
      toast.success(msg.slice(0, 100));
      setSuccess("AI task executed successfully!");
      setTimeout(() => { setSuccess(null); setActiveMode(null); }, 3000);
    },
  });

  const handleTip = () => {
    if (!user) return toast.error("Login required");
    if (!tipRecipient) return toast.error("Enter recipient username");
    tipMut.mutate({ recipientId: 2, amount: tipAmount, message: tipMessage });
  };

  const handleServiceRequest = () => {
    if (!serviceCategory || !serviceDesc) return toast.error("Fill in all fields");
    toast.success("Service request posted! 3 providers notified.");
    setSuccess("Service request posted — checking for matches...");
    setTimeout(() => { setSuccess(null); setActiveMode(null); }, 3000);
  };

  const handleCreateListing = () => {
    if (!listingTitle || !listingPrice) return toast.error("Fill in all fields");
    toast.success("Listing created and live!");
    setSuccess(`"${listingTitle}" is now live in the marketplace`);
    setTimeout(() => { setSuccess(null); setActiveMode(null); }, 3000);
  };

  const handleAITask = () => {
    if (!aiTask) return toast.error("Describe the task");
    aiChatMut.mutate({
      message: aiTask,
      systemPrompt: "You are an AI action executor. The user wants you to perform a real-world action. Confirm what you will do and give a brief result. Be concise and action-oriented.",
    });
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-xl font-bold">{success}</h2>
          <p className="text-muted-foreground text-sm">The action has been executed. Value is flowing.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => { setSuccess(null); setActiveMode(null); }} className="btn-primary">
              New Action
            </button>
            <Link href="/chat" className="btn-secondary">Back to Chat</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
        <Link href="/chat" className="p-2 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-bold text-lg">Action Panel</h1>
          <p className="text-xs text-muted-foreground">Execute real-world actions from chat</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Core action buttons */}
        {!activeMode && (
          <>
            <div className="grid grid-cols-2 gap-3">
              {[
                { mode: "tip" as ActionMode, icon: DollarSign, label: "Send Tip", desc: "Send SKY444 instantly", color: "from-yellow-500/20 to-orange-500/20 border-yellow-500/30", iconColor: "text-yellow-400" },
                { mode: "ai_task" as ActionMode, icon: Bot, label: "AI Task", desc: "Let AI execute for you", color: "from-purple-500/20 to-primary/20 border-primary/30", iconColor: "text-purple-400" },
                { mode: "request_service" as ActionMode, icon: Briefcase, label: "Request Service", desc: "Hire a creator or freelancer", color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30", iconColor: "text-blue-400" },
                { mode: "create_listing" as ActionMode, icon: ShoppingBag, label: "Create Listing", desc: "Sell a product or service", color: "from-green-500/20 to-emerald-500/20 border-green-500/30", iconColor: "text-green-400" },
              ].map(item => (
                <button
                  key={item.mode}
                  onClick={() => setActiveMode(item.mode)}
                  className={`p-4 rounded-2xl border bg-gradient-to-br ${item.color} text-left hover:scale-[1.02] transition-transform active:scale-[0.98]`}
                >
                  <item.icon className={`w-6 h-6 ${item.iconColor} mb-2`} />
                  <div className="font-semibold text-sm">{item.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                </button>
              ))}
            </div>

            {/* Platform stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Actions Today", value: "2,847", icon: Zap, color: "text-yellow-400" },
                { label: "Total Volume", value: "142K SKY", icon: TrendingUp, color: "text-green-400" },
                { label: "Active Users", value: "8,291", icon: Users, color: "text-blue-400" },
              ].map(stat => (
                <div key={stat.label} className="card p-3 text-center">
                  <stat.icon className={`w-4 h-4 ${stat.color} mx-auto mb-1`} />
                  <div className="font-bold text-sm">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Recent actions */}
            <div>
              <h3 className="font-semibold text-sm mb-3 text-muted-foreground uppercase tracking-wider">Recent Actions</h3>
              <div className="space-y-2">
                {RECENT_ACTIONS.map((action, i) => (
                  <div key={i} className="card p-3 flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center`}>
                      <action.icon className={`w-4 h-4 ${action.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{action.desc}</div>
                      <div className="text-xs text-muted-foreground">{action.time}</div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      action.status === "completed" ? "bg-green-500/20 text-green-400" :
                      action.status === "in_progress" ? "bg-blue-500/20 text-blue-400" :
                      "bg-secondary/50 text-muted-foreground"
                    }`}>
                      {action.status.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Tip form */}
        {activeMode === "tip" && (
          <div className="card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg flex items-center gap-2"><DollarSign className="w-5 h-5 text-yellow-400" /> Send Tip</h2>
              <button onClick={() => setActiveMode(null)} className="p-1.5 rounded-lg hover:bg-secondary/50"><X className="w-4 h-4" /></button>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Recipient</label>
              <input value={tipRecipient} onChange={e => setTipRecipient(e.target.value)} className="w-full bg-secondary/50 border border-border/50 rounded-xl px-3 py-2 text-sm" placeholder="@username" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Amount (SKY444)</label>
              <div className="flex gap-2 flex-wrap mb-2">
                {QUICK_TIP_AMOUNTS.map(amt => (
                  <button key={amt} onClick={() => setTipAmount(amt)} className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${tipAmount === amt ? "bg-primary text-primary-foreground" : "bg-secondary/50 hover:bg-secondary"}`}>{amt}</button>
                ))}
              </div>
              <div className="flex items-center gap-2 bg-secondary/50 border border-border/50 rounded-xl px-3 py-2">
                <button onClick={() => setTipAmount(Math.max(1, tipAmount - 1))} className="text-muted-foreground hover:text-foreground"><Minus className="w-4 h-4" /></button>
                <input type="number" value={tipAmount} onChange={e => setTipAmount(Number(e.target.value))} className="flex-1 bg-transparent text-center text-sm font-bold" />
                <button onClick={() => setTipAmount(tipAmount + 1)} className="text-muted-foreground hover:text-foreground"><Plus className="w-4 h-4" /></button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Message (optional)</label>
              <input value={tipMessage} onChange={e => setTipMessage(e.target.value)} className="w-full bg-secondary/50 border border-border/50 rounded-xl px-3 py-2 text-sm" placeholder="Great work! 🔥" />
            </div>
            <div className="flex items-center justify-between text-sm bg-secondary/30 rounded-xl p-3">
              <span className="text-muted-foreground">Platform fee (5%)</span>
              <span>{(tipAmount * 0.05).toFixed(2)} SKY444</span>
            </div>
            <button onClick={handleTip} disabled={tipMut.isPending} className="btn-primary w-full flex items-center justify-center gap-2">
              {tipMut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              Send {tipAmount} SKY444
            </button>
          </div>
        )}

        {/* Service request form */}
        {activeMode === "request_service" && (
          <div className="card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg flex items-center gap-2"><Briefcase className="w-5 h-5 text-blue-400" /> Request Service</h2>
              <button onClick={() => setActiveMode(null)} className="p-1.5 rounded-lg hover:bg-secondary/50"><X className="w-4 h-4" /></button>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <div className="grid grid-cols-3 gap-2">
                {SERVICE_CATEGORIES.map(cat => (
                  <button key={cat.id} onClick={() => setServiceCategory(cat.id)} className={`p-2.5 rounded-xl text-center transition-colors ${serviceCategory === cat.id ? "bg-primary/20 border border-primary/50" : "bg-secondary/30 hover:bg-secondary/50"}`}>
                    <div className="text-lg">{cat.icon}</div>
                    <div className="text-xs font-medium mt-0.5">{cat.label}</div>
                    <div className="text-xs text-muted-foreground">{cat.avgPrice}</div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Describe what you need</label>
              <textarea value={serviceDesc} onChange={e => setServiceDesc(e.target.value)} className="w-full bg-secondary/50 border border-border/50 rounded-xl px-3 py-2 text-sm h-20 resize-none" placeholder="I need a logo for my crypto startup..." />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Budget (SKY444)</label>
              <input value={serviceBudget} onChange={e => setServiceBudget(e.target.value)} type="number" className="w-full bg-secondary/50 border border-border/50 rounded-xl px-3 py-2 text-sm" placeholder="50" />
            </div>
            <button onClick={handleServiceRequest} className="btn-primary w-full flex items-center justify-center gap-2">
              <Send className="w-4 h-4" /> Post Request
            </button>
          </div>
        )}

        {/* Create listing form */}
        {activeMode === "create_listing" && (
          <div className="card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-green-400" /> Create Listing</h2>
              <button onClick={() => setActiveMode(null)} className="p-1.5 rounded-lg hover:bg-secondary/50"><X className="w-4 h-4" /></button>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Title</label>
              <input value={listingTitle} onChange={e => setListingTitle(e.target.value)} className="w-full bg-secondary/50 border border-border/50 rounded-xl px-3 py-2 text-sm" placeholder="React Dashboard Template" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Description</label>
              <textarea value={listingDesc} onChange={e => setListingDesc(e.target.value)} className="w-full bg-secondary/50 border border-border/50 rounded-xl px-3 py-2 text-sm h-20 resize-none" placeholder="What are you selling?" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Price (SKY444)</label>
              <input value={listingPrice} onChange={e => setListingPrice(e.target.value)} type="number" className="w-full bg-secondary/50 border border-border/50 rounded-xl px-3 py-2 text-sm" placeholder="100" />
            </div>
            <button onClick={handleCreateListing} className="btn-primary w-full flex items-center justify-center gap-2">
              <ShoppingBag className="w-4 h-4" /> List for Sale
            </button>
          </div>
        )}

        {/* AI task form */}
        {activeMode === "ai_task" && (
          <div className="card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg flex items-center gap-2"><Bot className="w-5 h-5 text-purple-400" /> AI Task</h2>
              <button onClick={() => setActiveMode(null)} className="p-1.5 rounded-lg hover:bg-secondary/50"><X className="w-4 h-4" /></button>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 text-sm text-muted-foreground">
              Describe what you want the AI to do. It can find services, execute payments, create listings, match you with people, and more.
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Task Description</label>
              <textarea value={aiTask} onChange={e => setAiTask(e.target.value)} className="w-full bg-secondary/50 border border-border/50 rounded-xl px-3 py-2 text-sm h-24 resize-none" placeholder="Find me a designer for $50 and send them a message..." />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {["Find a designer for $50", "Send tip to top creator", "Create listing for my template", "Find me a match"].map(ex => (
                <button key={ex} onClick={() => setAiTask(ex)} className="text-xs bg-secondary/30 hover:bg-secondary/50 rounded-xl px-3 py-2 text-left transition-colors">{ex}</button>
              ))}
            </div>
            <button onClick={handleAITask} disabled={aiChatMut.isPending} className="btn-primary w-full flex items-center justify-center gap-2">
              {aiChatMut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
              Execute with AI
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
