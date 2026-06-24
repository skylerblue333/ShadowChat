import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/PageHeader";
import { BookOpen, Play, CheckCircle, Clock, Star, Trophy, Coins, ArrowRight, Code2, Zap, Shield } from "lucide-react";

const TRACKS = [
  { title: "Blockchain Basics", lessons: 12, completed: 0, reward: "100 SKY444", icon: Coins, color: "text-primary" },
  { title: "Solidity Smart Contracts", lessons: 18, completed: 0, reward: "500 SKY444", icon: Code2, color: "text-accent" },
  { title: "DeFi & Yield Farming", lessons: 15, completed: 0, reward: "300 SKY444", icon: Zap, color: "text-warning" },
  { title: "Security & Auditing", lessons: 10, completed: 0, reward: "250 SKY444", icon: Shield, color: "text-success" },
];

export default function Learning() {
  return (
    <div className="container py-8 max-w-5xl animate-page-in">
      <PageHeader backHref="/school" icon={BookOpen} title="Learning Center" subtitle="Structured learning paths with SKY444 rewards for every completed lesson"
        actions={<Link href="/school"><Button className="btn-primary gap-2"><Trophy className="w-4 h-4" />View All Courses</Button></Link>}
      />
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {TRACKS.map(t => (
          <div key={t.title} className="card p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0"><t.icon className={`w-5 h-5 ${t.color}`} /></div>
              <div className="flex-1">
                <div className="font-semibold mb-1">{t.title}</div>
                <div className="text-sm text-muted-foreground">{t.lessons} lessons</div>
              </div>
              <Badge variant="outline" className="text-xs font-mono">{t.reward}</Badge>
            </div>
            <div className="h-2 bg-secondary rounded-full mb-3">
              <div className="h-full bg-primary rounded-full" style={{ width: `${(t.completed/t.lessons)*100}%` }} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{t.completed}/{t.lessons} completed</span>
              <Button size="sm" className="btn-primary text-xs gap-1"><Play className="w-3 h-3" />Start</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
