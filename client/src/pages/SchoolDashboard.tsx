import { Link } from "wouter";
import { GraduationCap, BookOpen, Trophy, Clock, Star, ChevronRight, Play, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

const MY_COURSES = [
  { id: "1", title: "DeFi Fundamentals", progress: 75, lessons: 12, category: "Finance", color: "from-amber-500 to-orange-600" },
  { id: "2", title: "Web3 Development", progress: 40, lessons: 18, category: "Tech", color: "from-purple-500 to-violet-600" },
  { id: "3", title: "AI & Machine Learning", progress: 20, lessons: 24, category: "AI", color: "from-cyan-500 to-blue-600" },
];

export default function SchoolDashboard() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pb-24">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white mb-1">My Learning</h1>
            <p className="text-slate-400">Track your progress across all courses</p>
          </div>
          <Link href="/school">
            <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 border-0 text-white gap-2">
              <BookOpen className="h-4 w-4" /> Browse Courses
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Courses Enrolled", value: "7", color: "text-cyan-400" },
            { label: "Lessons Completed", value: "43", color: "text-emerald-400" },
            { label: "Certificates", value: "2", color: "text-amber-400" },
            { label: "XP Earned", value: "4,820", color: "text-purple-400" },
          ].map(s => (
            <div key={s.label} className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4">
              <div className="text-xs text-slate-500 mb-1">{s.label}</div>
              <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>
        <h2 className="font-bold text-white mb-4">Continue Learning</h2>
        <div className="space-y-4 mb-8">
          {MY_COURSES.map(c => (
            <Link key={c.id} href={`/school/course/${c.id}`}>
              <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-5 hover:border-slate-700 transition-all cursor-pointer flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center shrink-0`}>
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white mb-1">{c.title}</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full" style={{ width: `${c.progress}%` }} />
                    </div>
                    <span className="text-xs text-slate-400 shrink-0">{c.progress}%</span>
                  </div>
                </div>
                <Button size="sm" className="bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 gap-1 shrink-0">
                  <Play className="h-3 w-3" /> Continue
                </Button>
              </div>
            </Link>
          ))}
        </div>
        <h2 className="font-bold text-white mb-4">Certificates Earned</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["Blockchain Basics", "Crypto Trading 101"].map((cert, i) => (
            <div key={i} className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 flex items-center gap-4">
              <Award className="h-10 w-10 text-amber-400 shrink-0" />
              <div>
                <h3 className="font-bold text-white">{cert}</h3>
                <p className="text-xs text-slate-500">Minted on-chain · SKY School</p>
              </div>
              <Button size="sm" variant="outline" className="border-amber-500/30 text-amber-400 ml-auto shrink-0">View</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
