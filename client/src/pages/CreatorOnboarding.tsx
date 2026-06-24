import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  CheckCircle2, Circle, ArrowRight, User, FileText, Mic, Radio,
  Star, Wallet, Zap, ChevronRight, Sparkles, Globe, Lock,
  Image, Camera, Link2, Bell, CreditCard, Shield
} from "lucide-react";

const CHECKLIST = [
  {
    id: "account",
    title: "Create your account",
    desc: "You're in!",
    icon: User,
    color: "text-purple-400",
    bg: "bg-purple-600/10",
    border: "border-purple-500/30",
    completed: true,
    action: null,
    actionLabel: null,
  },
  {
    id: "profile",
    title: "Complete your profile",
    desc: "Add bio, avatar, and links",
    icon: Camera,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    completed: false,
    action: "/settings",
    actionLabel: "Start",
  },
  {
    id: "first-post",
    title: "Make your first post",
    desc: "Share something with the world",
    icon: FileText,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    completed: false,
    action: "/create/article",
    actionLabel: "Start",
  },
  {
    id: "subscriptions",
    title: "Enable subscriptions",
    desc: "Start earning from your fans",
    icon: Star,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    completed: false,
    action: "/creator-monetization",
    actionLabel: "Start",
  },
  {
    id: "wallet",
    title: "Connect your wallet",
    desc: "Accept crypto payments",
    icon: Wallet,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/30",
    completed: false,
    action: "/wallet",
    actionLabel: "Start",
  },
];

const CONTENT_TYPES = [
  {
    id: "article",
    label: "Article",
    desc: "Write long-form content, tutorials, and stories",
    icon: FileText,
    color: "from-blue-500/20 to-cyan-500/20",
    border: "border-blue-500/30",
    iconColor: "text-blue-400",
    href: "/create/article",
    examples: ["Tutorial", "Opinion", "News", "Story"],
    earnings: "Earn from tips + subscriptions",
  },
  {
    id: "audio",
    label: "Audio",
    desc: "Podcasts, music, voice notes, and audio drops",
    icon: Mic,
    color: "from-purple-500/20 to-violet-500/20",
    border: "border-purple-500/30",
    iconColor: "text-purple-400",
    href: "/create/audio",
    examples: ["Podcast", "Music", "Voice Note", "Interview"],
    earnings: "Earn from plays + subscriptions",
  },
  {
    id: "livestream",
    label: "Live Stream",
    desc: "Go live with your audience in real time",
    icon: Radio,
    color: "from-red-500/20 to-rose-500/20",
    border: "border-red-500/30",
    iconColor: "text-red-400",
    href: "/create/livestream",
    examples: ["AMA", "Trading Live", "Tutorial", "Gaming"],
    earnings: "Earn from gifts + memberships",
  },
  {
    id: "drop",
    label: "Exclusive Drop",
    desc: "Token-gated content only for your subscribers",
    icon: Lock,
    color: "from-yellow-500/20 to-amber-500/20",
    border: "border-yellow-500/30",
    iconColor: "text-yellow-400",
    href: "/create/drop",
    examples: ["NFT Drop", "Private Video", "Early Access", "Members Only"],
    earnings: "Earn from NFT sales + access fees",
  },
];

export default function CreatorOnboarding() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [checklist, setChecklist] = useState(CHECKLIST);
  const completedCount = checklist.filter(c => c.completed).length;
  const progress = Math.round((completedCount / checklist.length) * 100);

  const markComplete = (id: string) => {
    setChecklist(prev => prev.map(c => c.id === id ? { ...c, completed: true } : c));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-border/50 bg-gradient-to-br from-primary/5 via-background to-purple-500/5">
        <div className="container py-14 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono mb-5">
            <Sparkles className="h-3.5 w-3.5" /> CREATOR STUDIO — START CREATING
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to <span className="text-primary">Creator</span> Mode
          </h1>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
            Publish articles, audio, live streams, and exclusive drops. Earn SKY444 from your audience. Build your on-chain creator profile.
          </p>
          <div className="flex flex-wrap gap-5 text-sm">
            {[
              { icon: Globe, label: "Reach 231K+ users", color: "text-blue-400" },
              { icon: Zap, label: "Earn SKY444 instantly", color: "text-yellow-400" },
              { icon: Shield, label: "Own your content", color: "text-purple-400" },
              { icon: Star, label: "Build your fanbase", color: "text-purple-400" },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${color}`} />
                <span className="font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-10 max-w-4xl">
        {/* Getting Started Checklist */}
        <div className="rounded-2xl border border-border/50 bg-card/30 p-6 mb-10">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold">Getting Started Checklist</h2>
            <span className="text-sm text-muted-foreground font-mono">{completedCount}/{checklist.length} complete</span>
          </div>
          <Progress value={progress} className="h-2 mb-6" />

          <div className="space-y-3">
            {checklist.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                    item.completed
                      ? "border-purple-500/20 bg-purple-600/5"
                      : `${item.border} ${item.bg} hover:opacity-90`
                  }`}
                >
                  {/* Step number / check */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.completed ? "bg-purple-600/20 border border-purple-500/30" : `${item.bg} border ${item.border}`}`}>
                    {item.completed
                      ? <CheckCircle2 className="h-5 w-5 text-purple-400" />
                      : <Icon className={`h-5 w-5 ${item.color}`} />
                    }
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`font-semibold text-sm ${item.completed ? "line-through text-muted-foreground" : ""}`}>
                        {item.title}
                      </p>
                      {item.completed && (
                        <span className="px-2 py-0.5 rounded-full bg-purple-600/20 text-purple-400 text-xs font-medium">Done</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>

                  {/* Action */}
                  {!item.completed && item.action && (
                    <Link href={item.action}>
                      <Button
                        size="sm"
                        className="bg-primary text-primary-foreground shrink-0"
                        onClick={() => markComplete(item.id)}
                      >
                        {item.actionLabel} <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </Link>
                  )}
                  {item.completed && (
                    <CheckCircle2 className="h-5 w-5 text-purple-400 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>

          {completedCount === checklist.length && (
            <div className="mt-4 p-4 rounded-xl bg-primary/10 border border-primary/30 text-center">
              <p className="text-primary font-semibold">🎉 Setup complete! You're ready to create.</p>
              <p className="text-sm text-muted-foreground mt-1">+500 XP bonus earned for completing setup</p>
            </div>
          )}
        </div>

        {/* Content Types */}
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-2">What do you want to create?</h2>
          <p className="text-muted-foreground text-sm mb-6">Choose a content type to get started. You can create all types from your Creator Studio.</p>

          <div className="grid md:grid-cols-2 gap-4">
            {CONTENT_TYPES.map(ct => {
              const Icon = ct.icon;
              return (
                <Link key={ct.id} href={ct.href}>
                  <div className={`rounded-xl border ${ct.border} bg-gradient-to-br ${ct.color} p-5 hover:scale-[1.02] transition-all duration-200 cursor-pointer group`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-background/30 border ${ct.border} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                        <Icon className={`h-6 w-6 ${ct.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-base">{ct.label}</h3>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{ct.desc}</p>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {ct.examples.map(ex => (
                            <span key={ex} className="px-2 py-0.5 rounded-full bg-background/40 text-xs text-muted-foreground border border-border/30">{ex}</span>
                          ))}
                        </div>
                        <p className={`text-xs font-medium ${ct.iconColor}`}>{ct.earnings}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { label: "Home", desc: "Back to your feed", icon: Globe, href: "/" },
            { label: "Social", desc: "See what's trending", icon: Zap, href: "/social" },
            { label: "Creator Studio", desc: "Full creator dashboard", icon: Star, href: "/creator-studio" },
          ].map(link => {
            const Icon = link.icon;
            return (
              <Link key={link.label} href={link.href}>
                <div className="rounded-xl border border-border/50 bg-card/30 p-4 hover:border-primary/30 transition-all cursor-pointer flex items-center gap-3">
                  <Icon className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">{link.label}</p>
                    <p className="text-xs text-muted-foreground">{link.desc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
