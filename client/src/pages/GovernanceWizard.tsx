import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Vote, ChevronRight, ChevronLeft, CheckCircle2, FileText, Users, Clock, Zap } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";

const STEPS = ["Type", "Details", "Options", "Review", "Submit"];
const PROPOSAL_TYPES = [
  { id: "parameter", label: "Parameter Change", icon: "⚙️", desc: "Modify protocol parameters (fees, limits, thresholds)" },
  { id: "treasury", label: "Treasury Spend", icon: "💰", desc: "Allocate treasury funds to a project or initiative" },
  { id: "upgrade", label: "Protocol Upgrade", icon: "🔧", desc: "Propose a smart contract or protocol upgrade" },
  { id: "community", label: "Community Initiative", icon: "🌍", desc: "Launch a community program or partnership" },
  { id: "emergency", label: "Emergency Action", icon: "🚨", desc: "Urgent security or critical fix proposal" },
];

export default function GovernanceWizard() {
  const [step, setStep] = useState(0);
  const [type, setType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["Yes — Approve", "No — Reject", "Abstain"]);
  const [duration, setDuration] = useState("7");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    toast.success("Governance proposal submitted for community vote!");
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 text-center">
        <div className="w-20 h-20 rounded-full bg-purple-600/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10 text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Proposal Submitted!</h2>
        <p className="text-muted-foreground mb-6">Your governance proposal is now live for community voting. Voting period: {duration} days.</p>
        <div className="bg-card border border-border/50 rounded-xl p-4 text-left mb-6">
          <p className="font-semibold">{title || "Untitled Proposal"}</p>
          <p className="text-sm text-muted-foreground mt-1">{description || "No description provided"}</p>
          <div className="flex gap-2 mt-3">
            <Badge variant="outline" className="border-primary/30 text-primary">{type}</Badge>
            <Badge variant="outline" className="border-purple-500/30 text-purple-400">Active</Badge>
          </div>
        </div>
        <Button onClick={() => { setSubmitted(false); setStep(0); setType(""); setTitle(""); setDescription(""); }}>
          Create Another Proposal
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <PageHeader backHref="/governance" title="Create Governance Proposal" subtitle="Shape the future of SKYCOIN4444" icon={Vote} />

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${i < step ? "bg-purple-600 text-white" : i === step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              {i < step ? "✓" : i + 1}
            </div>
            {i < STEPS.length - 1 && <div className={`h-0.5 w-8 transition-all ${i < step ? "bg-purple-600" : "bg-border"}`} />}
          </div>
        ))}
        <span className="ml-2 text-sm text-muted-foreground">{STEPS[step]}</span>
      </div>

      <Card className="p-6 border-border/50">
        {step === 0 && (
          <div>
            <h3 className="font-bold text-lg mb-4">Select Proposal Type</h3>
            <div className="space-y-3">
              {PROPOSAL_TYPES.map(pt => (
                <button key={pt.id} onClick={() => setType(pt.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${type === pt.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"}`}>
                  <span className="text-2xl">{pt.icon}</span>
                  <div>
                    <p className="font-semibold">{pt.label}</p>
                    <p className="text-xs text-muted-foreground">{pt.desc}</p>
                  </div>
                  {type === pt.id && <CheckCircle2 className="w-5 h-5 text-primary ml-auto" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg mb-4">Proposal Details</h3>
            <div>
              <label className="text-sm font-medium mb-1 block">Title</label>
              <Input placeholder="Short, clear title for your proposal" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Description</label>
              <textarea
                className="w-full min-h-[120px] rounded-lg border border-border bg-background/60 p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Detailed description of the proposal, rationale, and expected impact..."
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Voting Duration</label>
              <div className="flex gap-2">
                {["3", "7", "14", "30"].map(d => (
                  <button key={d} onClick={() => setDuration(d)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${duration === d ? "bg-primary text-primary-foreground" : "border border-border hover:border-primary/40"}`}>
                    {d} days
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="font-bold text-lg mb-4">Voting Options</h3>
            <div className="space-y-3">
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input value={opt} onChange={e => { const o = [...options]; o[i] = e.target.value; setOptions(o); }} />
                  {options.length > 2 && (
                    <button onClick={() => setOptions(options.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-300 text-sm px-2">✕</button>
                  )}
                </div>
              ))}
              {options.length < 5 && (
                <Button variant="outline" size="sm" onClick={() => setOptions([...options, `Option ${options.length + 1}`])}>
                  + Add Option
                </Button>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="font-bold text-lg mb-4">Review Proposal</h3>
            <div className="space-y-3">
              <div className="bg-background/60 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Type</p>
                <p className="font-semibold capitalize">{type}</p>
              </div>
              <div className="bg-background/60 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Title</p>
                <p className="font-semibold">{title || "—"}</p>
              </div>
              <div className="bg-background/60 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Description</p>
                <p className="text-sm">{description || "—"}</p>
              </div>
              <div className="bg-background/60 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Voting Options</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {options.map((o, i) => <Badge key={i} variant="outline">{o}</Badge>)}
                </div>
              </div>
              <div className="bg-background/60 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Duration</p>
                <p className="font-semibold">{duration} days</p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-sm">
                <p className="font-semibold text-yellow-400 mb-1">⚠️ Submission Requirement</p>
                <p className="text-muted-foreground">You need 1,000 SKY444 staked to submit a proposal. Your current stake: 2,500 SKY444 ✓</p>
              </div>
            </div>
          </div>
        )}
      </Card>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 0} className="gap-2">
          <ChevronLeft className="w-4 h-4" /> Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep(s => s + 1)} disabled={step === 0 && !type} className="gap-2">
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="gap-2 bg-purple-600 hover:bg-purple-600">
            <Vote className="w-4 h-4" /> Submit Proposal
          </Button>
        )}
      </div>
    </div>
  );
}
