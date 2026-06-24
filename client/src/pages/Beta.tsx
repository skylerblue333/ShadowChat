import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/PageHeader";
import { Rocket, Zap, Shield, Star, CheckCircle, ArrowRight, Users, Code2, Bug, Gift } from "lucide-react";

const BETA_FEATURES = [
  { label: "AI Code Review Bot", status: "testing", desc: "Automated PR reviews with security scanning" },
  { label: "Voice-to-Post", status: "testing", desc: "Dictate social posts with voice commands" },
  { label: "Cross-Chain Bridge", status: "coming", desc: "Bridge SKY444 across 5 blockchains" },
  { label: "DAO Delegation", status: "testing", desc: "Delegate your voting power to trusted members" },
  { label: "Creator Collab Tools", status: "coming", desc: "Co-create content with other creators" },
  { label: "AI Trading Signals", status: "live", desc: "ML-powered buy/sell signals for SKY444" },
];

export default function Beta() {
  return (
    <div className="container py-8 max-w-4xl animate-page-in">
      <PageHeader backHref="/dashboard" icon={Rocket} title="Beta Program" subtitle="Early access to cutting-edge features before public launch" badge="Invite Only" badgeVariant="destructive" />
      <div className="card p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0"><Gift className="w-6 h-6 text-primary" /></div>
          <div>
            <h3 className="font-bold text-lg mb-1">Beta Tester Perks</h3>
            <div className="grid sm:grid-cols-2 gap-2 mt-3">
              {["500 SKY444 bonus tokens", "Lifetime 30% fee discount", "Exclusive Beta badge", "Direct dev team access", "Early feature voting rights", "Priority support queue"].map(p => (
                <div key={p} className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-success shrink-0" />{p}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-3 mb-8">
        <h3 className="font-semibold flex items-center gap-2"><Zap className="w-5 h-5 text-primary" />Beta Features</h3>
        {BETA_FEATURES.map(f => (
          <div key={f.label} className="card p-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="font-medium text-sm">{f.label}</div>
              <div className="text-xs text-muted-foreground">{f.desc}</div>
            </div>
            <Badge variant={f.status === "live" ? "default" : f.status === "testing" ? "secondary" : "outline"} className="text-xs shrink-0">
              {f.status === "live" ? "Live" : f.status === "testing" ? "Testing" : "Coming Soon"}
            </Badge>
          </div>
        ))}
      </div>
      <div className="card p-6 text-center">
        <h3 className="font-bold text-lg mb-2">Apply for Beta Access</h3>
        <p className="text-muted-foreground text-sm mb-4">Limited spots available. Must hold 100+ SKY444 tokens.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/staking"><Button className="btn-primary gap-2"><Star className="w-4 h-4" />Apply Now</Button></Link>
          <Link href="/crypto"><Button variant="outline" gap-2>Get SKY444 <ArrowRight className="w-4 h-4" /></Button></Link>
        </div>
      </div>
    </div>
  );
}
