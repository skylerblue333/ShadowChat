import { useState } from "react";
import { BookOpen, Star, Mail, ArrowRight, Sparkles, Crown, Zap, Heart, Globe, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const CHAPTERS = [
  { num: 1, title: "The Signal", teaser: "A frequency only the chosen can hear..." },
  { num: 2, title: "Shadow Protocol", teaser: "When the network becomes sentient..." },
  { num: 3, title: "The 444 Prophecy", teaser: "Numbers don't lie. The universe speaks in patterns..." },
  { num: 4, title: "Architect of Worlds", teaser: "Building the infrastructure of the new internet..." },
  { num: 5, title: "The Awakening", teaser: "Consciousness meets code. Everything changes..." },
  { num: 6, title: "Sovereign Identity", teaser: "Own your data. Own your destiny..." },
  { num: 7, title: "The Final Protocol", teaser: "The last firewall between freedom and control..." },
];

const ENDORSEMENTS = [
  { name: "AI Oracle", role: "Digital Prophet", quote: "This book will reprogram how you see reality." },
  { name: "CryptoSage", role: "Web3 Pioneer", quote: "Required reading for anyone building the future." },
  { name: "ShadowNet", role: "Underground Dev", quote: "The blueprint we've been waiting for." },
];

export default function BookPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const handleNotify = () => {
    if (!email.trim() || !email.includes("@")) {
      toast.error("Enter a valid email");
      return;
    }
    setSubmitted(true);
    toast.success("You're on the list — The signal is coming.");
  };

  return (
    <div className="min-h-screen bg-[#050308] text-white overflow-hidden">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-fuchsia-600/8 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <Badge className="bg-purple-600/20 text-purple-300 border border-purple-500/30 px-4 py-1.5 text-sm">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            Coming Soon — Limited First Edition
          </Badge>
        </div>

        {/* Hero */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-32 h-44 bg-gradient-to-br from-purple-900 via-fuchsia-900 to-black rounded-lg border border-purple-500/40 shadow-2xl shadow-purple-900/50 flex items-center justify-center">
                <div className="text-center">
                  <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <p className="text-[10px] text-purple-300 font-bold tracking-widest uppercase">The</p>
                  <p className="text-lg font-black text-white leading-tight">Chosen</p>
                  <p className="text-lg font-black text-white leading-tight">One</p>
                  <div className="mt-2 text-[9px] text-purple-400">SKY444</div>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                <Star className="w-3 h-3 text-black fill-black" />
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              The Chosen One
            </span>
          </h1>
          <p className="text-xl text-slate-400 mb-2">by <span className="text-purple-300 font-semibold">Skyler Blue Spillers</span></p>
          <p className="text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
            A manifesto. A blueprint. A prophecy. The story of building a sovereign digital empire from nothing — and the code that makes it real.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[
            { icon: BookOpen, label: "Chapters", value: "7" },
            { icon: Globe, label: "Languages", value: "12" },
            { icon: Heart, label: "Pre-orders", value: "4,444" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-center">
              <Icon className="w-5 h-5 text-purple-400 mx-auto mb-1" />
              <p className="text-2xl font-black text-white">{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          ))}
        </div>

        {/* Chapter preview */}
        <div className="mb-12">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Lock className="w-4 h-4 text-purple-400" />
            Chapter Preview
          </h2>
          <div className="space-y-2">
            {CHAPTERS.map((ch) => (
              <div
                key={ch.num}
                className="flex items-center gap-4 p-3 bg-slate-900/40 border border-slate-800/60 rounded-xl hover:border-purple-500/30 hover:bg-slate-800/40 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/20 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-purple-400">{ch.num}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{ch.title}</p>
                  <p className="text-xs text-slate-500 truncate">{ch.teaser}</p>
                </div>
                <Lock className="w-3.5 h-3.5 text-slate-600 group-hover:text-purple-400 transition-colors shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Endorsements */}
        <div className="mb-12">
          <h2 className="text-lg font-bold text-white mb-4">Early Readers</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {ENDORSEMENTS.map((e) => (
              <div key={e.name} className="bg-slate-900/40 border border-slate-800 rounded-xl p-4">
                <p className="text-sm text-slate-300 italic mb-3">"{e.quote}"</p>
                <p className="text-xs font-semibold text-white">{e.name}</p>
                <p className="text-xs text-slate-500">{e.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-purple-900/30 to-fuchsia-900/20 border border-purple-500/20 rounded-2xl p-8 text-center">
          <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
          <h2 className="text-2xl font-black text-white mb-2">Be First to Read</h2>
          <p className="text-slate-400 text-sm mb-6">
            Join the waitlist. First 444 readers get a signed digital copy + exclusive SKY444 airdrop.
          </p>
          {submitted ? (
            <div className="flex items-center justify-center gap-2 text-green-400">
              <Star className="w-5 h-5 fill-green-400" />
              <span className="font-semibold">You're on the list. The signal is coming.</span>
            </div>
          ) : (
            <div className="flex gap-2 max-w-sm mx-auto">
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleNotify()}
                placeholder="your@email.com"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 flex-1"
              />
              <Button
                onClick={handleNotify}
                className="bg-purple-600 hover:bg-purple-500 text-white shrink-0"
              >
                <Mail className="w-4 h-4 mr-1" />
                Notify Me
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
