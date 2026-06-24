import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Shield, Lock, Eye, AlertTriangle, CheckCircle, Zap, Key, Fingerprint, Globe, Bug, Server, Activity } from "lucide-react";

const SECURITY_FEATURES = [
  { icon: Lock, label: "End-to-End Encryption", status: "active", desc: "All DMs and sensitive data encrypted at rest and in transit" },
  { icon: Fingerprint, label: "2FA Authentication", status: "active", desc: "TOTP and hardware key support for all accounts" },
  { icon: Eye, label: "Audit Logging", status: "active", desc: "Every action logged with IP, timestamp, and user agent" },
  { icon: Globe, label: "WAF Protection", status: "active", desc: "Web Application Firewall blocks malicious traffic" },
  { icon: Bug, label: "Bug Bounty Program", status: "active", desc: "Earn up to $10,000 for critical vulnerability reports" },
  { icon: Key, label: "API Key Management", status: "active", desc: "Scoped API keys with expiry and rate limiting" },
];

export default function Security() {
  return (
    <div className="container py-8 max-w-5xl animate-page-in">
      <PageHeader backHref="/dashboard" icon={Shield} title="Security Center" subtitle="Enterprise-grade security protecting your assets and data" badge="SOC 2 Ready" badgeVariant="default" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Shield} label="Threats Blocked" value="12,847" change={-5.2} changeLabel="this month" color="success" />
        <StatCard icon={Activity} label="Uptime" value="..." change={0.01} color="primary" />
        <StatCard icon={AlertTriangle} label="Active Alerts" value="0" color="warning" />
        <StatCard icon={Bug} label="Bugs Reported" value="3" change={-25} changeLabel="this month" color="accent" />
      </div>
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {SECURITY_FEATURES.map(f => (
          <div key={f.label} className="card p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-success/10 border border-success/20 flex items-center justify-center shrink-0">
              <f.icon className="w-4 h-4 text-success" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">{f.label}</span>
                <Badge variant="outline" className="text-xs text-success border-success/30">Active</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="card p-6 border-warning/30 bg-warning/5">
        <h3 className="font-semibold mb-3 flex items-center gap-2"><Bug className="w-5 h-5 text-warning" />Bug Bounty Program</h3>
        <p className="text-sm text-muted-foreground mb-4">Found a vulnerability? Report it responsibly and earn rewards up to $10,000 in SKY444.</p>
        <div className="grid sm:grid-cols-3 gap-3 mb-4">
          {[{level:"Critical",reward:"$5,000–$10,000"},{level:"High",reward:"$1,000–$5,000"},{level:"Medium",reward:"$100–$1,000"}].map(b => (
            <div key={b.level} className="p-3 bg-secondary/50 rounded-lg text-center">
              <div className="text-sm font-semibold">{b.level}</div>
              <div className="text-xs font-mono text-primary mt-1">{b.reward}</div>
            </div>
          ))}
        </div>
        <Button className="btn-primary gap-2"><Bug className="w-4 h-4" />Report Vulnerability</Button>
      </div>
    </div>
  );
}
