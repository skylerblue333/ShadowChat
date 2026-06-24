import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Award, Share2, Download, ExternalLink, CheckCircle2, Twitter, Linkedin, Copy, ChevronRight, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function SchoolCertificate() {
  const params = useParams<{ id: string }>();
  const [copied, setCopied] = useState(false);
  const hash = "0x7f4e2a1b9c3d5e8f0a2b4c6d8e0f1a3b5c7d9e1f";
  const shortHash = hash.slice(0, 10) + "..." + hash.slice(-8);

  const handleCopy = () => { navigator.clipboard.writeText(`https://shadowchat-xvi6fbz3.manus.space/school/certificate/${params.id}`); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/50 bg-card/30 px-4 py-3">
        <div className="container flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/school"><span className="hover:text-foreground cursor-pointer">Sky School</span></Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground">Certificate</span>
        </div>
      </div>

      <div className="container py-10 max-w-4xl">
        {/* Certificate */}
        <div className="relative rounded-2xl overflow-hidden mb-8 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/40 via-zinc-900 to-purple-900/40" />
          <div className="absolute inset-0 border-8 border-yellow-500/20 rounded-2xl" />
          <div className="absolute inset-2 border-2 border-yellow-500/10 rounded-xl" />
          <div className="relative z-10 p-12 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center text-xl">🚀</div>
              <div>
                <div className="text-xl font-bold text-primary font-mono">SKYCOIN4444</div>
                <div className="text-xs text-muted-foreground tracking-widest uppercase">Sky School</div>
              </div>
            </div>
            <div className="text-yellow-400/60 text-sm tracking-widest uppercase mb-4 font-mono">Certificate of Completion</div>
            <div className="text-muted-foreground text-sm mb-2">This certifies that</div>
            <div className="text-3xl md:text-4xl font-bold text-foreground mb-2" style={{ fontFamily: "Georgia, serif" }}>Skyler Blue</div>
            <div className="text-muted-foreground text-sm mb-4">has successfully completed</div>
            <div className="text-2xl md:text-3xl font-bold text-primary mb-2">Blockchain Fundamentals</div>
            <div className="text-muted-foreground text-sm mb-8">with a score of <span className="text-purple-400 font-bold">94%</span> on June 17, 2026</div>
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="w-24 h-px bg-foreground/30 mb-1" />
                <div className="text-xs text-muted-foreground">Dr. Alex Chen</div>
                <div className="text-xs text-muted-foreground/60">Instructor</div>
              </div>
              <Award className="h-12 w-12 text-yellow-400" />
              <div className="text-center">
                <div className="w-24 h-px bg-foreground/30 mb-1" />
                <div className="text-xs text-muted-foreground">Skyler Spillers</div>
                <div className="text-xs text-muted-foreground/60">Platform CEO</div>
              </div>
            </div>
            <div className="mt-6 text-xs text-muted-foreground/50 font-mono">{shortHash}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-xl border border-border/50 bg-card/30 p-5">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-purple-400" />On-Chain Verification</h3>
            <p className="text-sm text-muted-foreground mb-3">This certificate is permanently recorded on-chain and can be verified by anyone.</p>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-card/50 border border-border/30 mb-3">
              <code className="text-xs text-primary font-mono flex-1 truncate">{shortHash}</code>
              <Button variant="ghost" size="sm" onClick={handleCopy}><Copy className="h-3.5 w-3.5" /></Button>
            </div>
            <Button variant="outline" size="sm" className="w-full gap-2"><ExternalLink className="h-3.5 w-3.5" />View on Explorer</Button>
          </div>
          <div className="rounded-xl border border-border/50 bg-card/30 p-5">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><Share2 className="h-4 w-4 text-blue-400" />Share Achievement</h3>
            <p className="text-sm text-muted-foreground mb-3">Share your certificate on social media and with employers.</p>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full gap-2 border-blue-500/30 text-blue-400 hover:bg-blue-500/10"><Twitter className="h-3.5 w-3.5" />Share on Twitter</Button>
              <Button variant="outline" size="sm" className="w-full gap-2 border-blue-600/30 text-blue-500 hover:bg-blue-600/10"><Linkedin className="h-3.5 w-3.5" />Add to LinkedIn</Button>
              <Button variant="outline" size="sm" className="w-full gap-2" onClick={handleCopy}><Copy className="h-3.5 w-3.5" />{copied ? "Copied!" : "Copy Link"}</Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[{ label: "Completion Date", value: "Jun 17, 2026" }, { label: "Time Spent", value: "11h 24m" }, { label: "Quiz Score", value: "94%" }, { label: "XP Earned", value: "2,400" }].map(s => (
            <div key={s.label} className="rounded-xl border border-border/50 bg-card/30 p-4 text-center">
              <div className="text-lg font-bold text-primary">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Next Courses */}
        <div>
          <h3 className="font-bold text-lg mb-4">Continue Your Journey</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[{ title: "DeFi Mastery", emoji: "💎", level: "Intermediate", href: "/school/course/defi-mastery" }, { title: "Solidity Smart Contracts", emoji: "⚡", level: "Intermediate", href: "/school/course/solidity-smart-contracts" }, { title: "Crypto Security", emoji: "🛡️", level: "Advanced", href: "/school/course/crypto-security" }].map(c => (
              <Link key={c.title} href={c.href}>
                <div className="rounded-xl border border-border/50 bg-card/30 p-4 hover:border-primary/30 transition-all cursor-pointer flex items-center gap-3">
                  <span className="text-2xl">{c.emoji}</span>
                  <div className="flex-1"><p className="font-medium text-sm">{c.title}</p><p className="text-xs text-muted-foreground">{c.level}</p></div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
