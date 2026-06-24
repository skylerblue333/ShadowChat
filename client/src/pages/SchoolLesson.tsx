import { useState } from "react";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, ChevronLeft, ChevronRight, Play, FileText, HelpCircle, Video, MessageSquare, Download, Bookmark, ThumbsUp, Zap } from "lucide-react";

const LESSONS = [
  { id: 1, title: "What is Blockchain?", duration: "12:34", completed: true, type: "video" },
  { id: 2, title: "History & Evolution", duration: "8:21", completed: true, type: "video" },
  { id: 3, title: "Cryptographic Hashing", duration: "18:45", completed: false, type: "video" },
  { id: 4, title: "Consensus Mechanisms", duration: "22:10", completed: false, type: "video" },
  { id: 5, title: "Proof of Work", duration: "19:33", completed: false, type: "video" },
  { id: 6, title: "Proof of Stake", duration: "14:22", completed: false, type: "video" },
  { id: 7, title: "Module 1 Quiz", duration: "5:00", completed: false, type: "quiz" },
  { id: 8, title: "Smart Contracts Intro", duration: "16:44", completed: false, type: "video" },
];

export default function SchoolLesson() {
  const params = useParams<{ id: string }>();
  const lessonId = parseInt(params.id || "3");
  const lesson = LESSONS.find(l => l.id === lessonId) || LESSONS[2];
  const [notes, setNotes] = useState("");
  const [activeTab, setActiveTab] = useState<"notes" | "resources" | "discussion">("notes");
  const [completed, setCompleted] = useState(false);
  const [showXP, setShowXP] = useState(false);

  const handleComplete = () => {
    setCompleted(true);
    setShowXP(true);
    setTimeout(() => setShowXP(false), 3000);
  };

  const progress = Math.round((LESSONS.filter(l => l.completed).length / LESSONS.length) * 100);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <div className="border-b border-border/50 bg-card/50 px-4 py-2 flex items-center gap-4">
        <Link href="/school/course/blockchain-fundamentals">
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground"><ChevronLeft className="h-4 w-4" />Back to Course</Button>
        </Link>
        <div className="flex-1 max-w-xs">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Course Progress</span><span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
        <span className="text-xs text-muted-foreground hidden md:block">Blockchain Fundamentals</span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="hidden lg:flex w-72 border-r border-border/50 flex-col bg-card/20">
          <div className="p-4 border-b border-border/50">
            <h3 className="font-semibold text-sm">Course Content</h3>
            <p className="text-xs text-muted-foreground mt-1">{LESSONS.filter(l => l.completed).length}/{LESSONS.length} completed</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {LESSONS.map((l) => (
              <Link key={l.id} href={`/school/lesson/${l.id}`}>
                <div className={`flex items-center gap-3 p-3 border-b border-border/20 hover:bg-card/50 cursor-pointer transition-colors ${l.id === lessonId ? "bg-primary/10 border-l-2 border-l-primary" : ""}`}>
                  {l.completed ? <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0" /> : l.type === "quiz" ? <HelpCircle className="h-4 w-4 text-yellow-400 shrink-0" /> : <Play className="h-4 w-4 text-muted-foreground shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium truncate ${l.id === lessonId ? "text-primary" : ""}`}>{l.title}</p>
                    <p className="text-xs text-muted-foreground">{l.duration}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Video */}
          <div className="bg-zinc-950 aspect-video max-h-[60vh] flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5" />
            <div className="text-center relative z-10">
              <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-white/20 transition-colors">
                <Play className="h-9 w-9 text-white ml-1" />
              </div>
              <p className="text-white/70 text-sm">{lesson.title}</p>
              <p className="text-white/40 text-xs mt-1">{lesson.duration}</p>
            </div>
            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
              <div className="h-full bg-primary w-1/3" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold mb-1">{lesson.title}</h2>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{lesson.duration}</span>
                    <span className="flex items-center gap-1"><Zap className="h-3.5 w-3.5 text-yellow-400" />+50 XP on completion</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1"><Bookmark className="h-3.5 w-3.5" />Save</Button>
                  {!completed ? (
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-600 text-white gap-1" onClick={handleComplete}><CheckCircle2 className="h-3.5 w-3.5" />Mark Complete</Button>
                  ) : (
                    <Button size="sm" className="bg-purple-600/20 text-purple-400 border border-purple-500/30 gap-1" disabled><CheckCircle2 className="h-3.5 w-3.5" />Completed!</Button>
                  )}
                </div>
              </div>

              {showXP && (
                <div className="mb-4 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center gap-2 text-yellow-400 text-sm font-medium animate-pulse">
                  <Zap className="h-4 w-4" />+50 XP Earned! Keep going!
                </div>
              )}

              <div className="flex gap-1 border-b border-border/50 mb-4">
                {(["notes", "resources", "discussion"] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-medium border-b-2 transition-all -mb-px capitalize ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{tab}</button>
                ))}
              </div>

              {activeTab === "notes" && (
                <div>
                  <p className="text-sm text-muted-foreground mb-3">Take notes while you watch. They'll be saved to your account.</p>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Start typing your notes here..." className="w-full h-40 rounded-xl border border-border/50 bg-card/50 p-4 text-sm resize-none focus:outline-none focus:border-primary/50" />
                  <Button size="sm" className="mt-2 bg-primary text-primary-foreground">Save Notes</Button>
                </div>
              )}

              {activeTab === "resources" && (
                <div className="space-y-3">
                  {[{ name: "Lesson Slides.pdf", size: "2.4 MB" }, { name: "Code Examples.zip", size: "1.1 MB" }, { name: "Further Reading.pdf", size: "890 KB" }].map(r => (
                    <div key={r.name} className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-card/30">
                      <div className="flex items-center gap-3"><FileText className="h-4 w-4 text-blue-400" /><div><p className="text-sm font-medium">{r.name}</p><p className="text-xs text-muted-foreground">{r.size}</p></div></div>
                      <Button variant="outline" size="sm" className="gap-1"><Download className="h-3.5 w-3.5" />Download</Button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "discussion" && (
                <div className="space-y-4">
                  {[{ user: "Alex M.", text: "Great explanation of hashing! The SHA-256 example really clicked for me.", likes: 12, time: "2h ago" }, { user: "Sarah K.", text: "Can someone explain the difference between SHA-256 and Keccak-256?", likes: 5, time: "4h ago" }, { user: "James P.", text: "@Sarah - Keccak-256 is used in Ethereum while SHA-256 is used in Bitcoin. Both are cryptographic hash functions but with different properties.", likes: 18, time: "3h ago" }].map((c, i) => (
                    <div key={i} className="rounded-xl border border-border/50 bg-card/30 p-4">
                      <div className="flex items-center gap-2 mb-2"><div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">{c.user[0]}</div><span className="text-sm font-medium">{c.user}</span><span className="text-xs text-muted-foreground ml-auto">{c.time}</span></div>
                      <p className="text-sm text-muted-foreground mb-2">{c.text}</p>
                      <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><ThumbsUp className="h-3 w-3" />{c.likes}</button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input placeholder="Add a comment..." className="flex-1 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm focus:outline-none focus:border-primary/50" />
                    <Button size="sm" className="bg-primary text-primary-foreground"><MessageSquare className="h-4 w-4" /></Button>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-4 border-t border-border/50">
                <Link href={`/school/lesson/${Math.max(1, lessonId - 1)}`}>
                  <Button variant="outline" className="gap-2"><ChevronLeft className="h-4 w-4" />Previous Lesson</Button>
                </Link>
                <Link href={`/school/lesson/${Math.min(LESSONS.length, lessonId + 1)}`}>
                  <Button className="bg-primary text-primary-foreground gap-2">Next Lesson<ChevronRight className="h-4 w-4" /></Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Clock({ className }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
}
