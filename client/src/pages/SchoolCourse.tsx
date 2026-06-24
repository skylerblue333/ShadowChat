import { useState } from "react";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Users, Play, CheckCircle2, Lock, Video, FileText, HelpCircle, Award, ChevronRight, BookOpen, Download, Share2, Heart } from "lucide-react";

const COURSES: Record<string, any> = {
  "blockchain-fundamentals": { id: 1, title: "Blockchain Fundamentals", instructor: "Dr. Alex Chen", instructorBio: "PhD in Distributed Systems, 10+ years blockchain research at MIT", level: "Beginner", duration: "12h 30m", lessons: 48, students: 24891, rating: 4.9, reviews: 3241, price: 0, thumbnail: "🔗", color: "from-yellow-500/20 to-orange-500/20", border: "border-yellow-500/30", skills: ["Understand blockchain architecture", "Write basic smart contracts", "Analyze on-chain data", "Evaluate crypto projects"], sections: [{ title: "Introduction to Blockchain", lessons: [{ title: "What is Blockchain?", duration: "12:34", type: "video", free: true }, { title: "History & Evolution", duration: "8:21", type: "video", free: true }, { title: "Key Concepts Quiz", duration: "5:00", type: "quiz", free: false }, { title: "Cryptographic Hashing", duration: "18:45", type: "video", free: false }] }, { title: "Consensus Mechanisms", lessons: [{ title: "Proof of Work Explained", duration: "22:10", type: "video", free: false }, { title: "Proof of Stake Deep Dive", duration: "19:33", type: "video", free: false }, { title: "Other Consensus Models", duration: "14:22", type: "video", free: false }, { title: "Consensus Quiz", duration: "5:00", type: "quiz", free: false }] }, { title: "Smart Contracts", lessons: [{ title: "What are Smart Contracts?", duration: "16:44", type: "video", free: false }, { title: "Ethereum Virtual Machine", duration: "24:11", type: "video", free: false }, { title: "Your First Smart Contract", duration: "35:20", type: "video", free: false }, { title: "Smart Contract Quiz", duration: "5:00", type: "quiz", free: false }] }] },
  "defi-mastery": { id: 2, title: "DeFi Mastery", instructor: "Sarah Kim", instructorBio: "Former Goldman Sachs quant, DeFi researcher and yield strategist", level: "Intermediate", duration: "18h 45m", lessons: 72, students: 18234, rating: 4.8, reviews: 2187, price: 299, thumbnail: "💎", color: "from-green-500/20 to-emerald-500/20", border: "border-purple-500/30", skills: ["Navigate DeFi protocols", "Optimize yield strategies", "Manage impermanent loss", "Audit smart contracts"], sections: [{ title: "DeFi Foundations", lessons: [{ title: "What is DeFi?", duration: "14:22", type: "video", free: true }, { title: "AMM Mechanics", duration: "22:11", type: "video", free: false }, { title: "Liquidity Pools", duration: "18:44", type: "video", free: false }] }, { title: "Yield Strategies", lessons: [{ title: "Yield Farming 101", duration: "28:33", type: "video", free: false }, { title: "Impermanent Loss", duration: "19:55", type: "video", free: false }, { title: "Risk Management", duration: "24:10", type: "video", free: false }] }] },
};

const DEFAULT_COURSE = COURSES["blockchain-fundamentals"];

export default function SchoolCourse() {
  const params = useParams<{ slug: string }>();
  const course = COURSES[params.slug || ""] || DEFAULT_COURSE;
  const [activeTab, setActiveTab] = useState<"overview" | "curriculum" | "instructor" | "reviews">("overview");
  const [expandedSection, setExpandedSection] = useState(0);

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b border-border/50 bg-card/30">
        <div className="container py-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/"><span className="hover:text-foreground cursor-pointer">Home</span></Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/school"><span className="hover:text-foreground cursor-pointer">Sky School</span></Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">{course.title}</span>
        </div>
      </div>

      {/* Hero */}
      <div className={`bg-gradient-to-br ${course.color} border-b border-border/50`}>
        <div className="container py-10">
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-3">{course.level}</Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{course.title}</h1>
            <p className="text-muted-foreground mb-4">Master the fundamentals and advanced concepts with hands-on projects and real-world applications.</p>
            <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
              <span className="flex items-center gap-1 text-yellow-400"><Star className="h-4 w-4 fill-yellow-400" /><strong>{course.rating}</strong><span className="text-muted-foreground">({course.reviews.toLocaleString()} reviews)</span></span>
              <span className="flex items-center gap-1 text-muted-foreground"><Users className="h-4 w-4" />{course.students.toLocaleString()} students</span>
              <span className="flex items-center gap-1 text-muted-foreground"><Clock className="h-4 w-4" />{course.duration}</span>
              <span className="flex items-center gap-1 text-muted-foreground"><Video className="h-4 w-4" />{course.lessons} lessons</span>
            </div>
            <p className="text-sm text-muted-foreground">Created by <span className="text-primary font-medium">{course.instructor}</span></p>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Video Preview */}
            <div className="rounded-xl bg-zinc-900 border border-border/50 aspect-video flex items-center justify-center mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10" />
              <div className="text-center relative z-10">
                <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mx-auto mb-3 cursor-pointer hover:bg-primary/30 transition-colors">
                  <Play className="h-7 w-7 text-primary ml-1" />
                </div>
                <p className="text-sm text-muted-foreground">Preview: {course.sections?.[0]?.lessons?.[0]?.title}</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-border/50 mb-6">
              {(["overview", "curriculum", "instructor", "reviews"] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px capitalize ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{tab}</button>
              ))}
            </div>

            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-lg mb-3">What you'll learn</h3>
                  <div className="grid md:grid-cols-2 gap-2">
                    {course.skills?.map((s: string) => (
                      <div key={s} className="flex items-start gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-purple-400 mt-0.5 shrink-0" /><span>{s}</span></div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-3">Course includes</h3>
                  <div className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                    {[`${course.duration} on-demand video`, `${course.lessons} lessons`, "Downloadable resources", "Certificate of completion", "Lifetime access", "Mobile & desktop access"].map(item => (
                      <div key={item} className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-primary" />{item}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "curriculum" && (
              <div className="space-y-3">
                {course.sections?.map((section: any, si: number) => (
                  <div key={si} className="rounded-xl border border-border/50 overflow-hidden">
                    <button onClick={() => setExpandedSection(expandedSection === si ? -1 : si)} className="w-full flex items-center justify-between p-4 bg-card/50 hover:bg-card/80 transition-colors text-left">
                      <div>
                        <span className="font-semibold text-sm">{section.title}</span>
                        <span className="text-xs text-muted-foreground ml-2">{section.lessons.length} lessons</span>
                      </div>
                      <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${expandedSection === si ? "rotate-90" : ""}`} />
                    </button>
                    {expandedSection === si && (
                      <div className="divide-y divide-border/30">
                        {section.lessons.map((lesson: any, li: number) => (
                          <div key={li} className="flex items-center gap-3 p-3 hover:bg-card/30 transition-colors">
                            {lesson.type === "video" ? <Video className="h-4 w-4 text-blue-400 shrink-0" /> : lesson.type === "quiz" ? <HelpCircle className="h-4 w-4 text-yellow-400 shrink-0" /> : <FileText className="h-4 w-4 text-purple-400 shrink-0" />}
                            <span className="text-sm flex-1">{lesson.title}</span>
                            <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                            {lesson.free ? <Badge variant="outline" className="text-xs text-purple-400 border-purple-500/30">Free</Badge> : <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === "instructor" && (
              <div className="rounded-xl border border-border/50 bg-card/30 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center text-xl font-bold">{course.instructor?.split(" ").map((n: string) => n[0]).join("")}</div>
                  <div><h3 className="font-bold text-lg">{course.instructor}</h3><p className="text-sm text-muted-foreground">Expert Instructor</p></div>
                </div>
                <p className="text-sm text-muted-foreground">{course.instructorBio}</p>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-4">
                {[{ name: "Alex M.", rating: 5, text: "Best blockchain course I've taken. The explanations are crystal clear and the hands-on projects really solidify the concepts.", date: "2 days ago" }, { name: "Sarah K.", rating: 5, text: "Incredible depth of content. I went from zero knowledge to building my first smart contract in just 2 weeks.", date: "1 week ago" }, { name: "James P.", rating: 4, text: "Very comprehensive course. The quiz sections are challenging but fair. Would recommend to anyone serious about blockchain.", date: "2 weeks ago" }].map((r, i) => (
                  <div key={i} className="rounded-xl border border-border/50 bg-card/30 p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">{r.name[0]}</div>
                      <div><p className="font-medium text-sm">{r.name}</p><div className="flex gap-0.5">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-3 w-3 text-yellow-400 fill-yellow-400" />)}</div></div>
                      <span className="text-xs text-muted-foreground ml-auto">{r.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{r.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Enrollment Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 rounded-xl border border-border/50 bg-card/50 p-6 shadow-lg">
              <div className="text-3xl font-bold mb-1 text-center">{course.price === 0 ? <span className="text-purple-400">FREE</span> : <span className="text-primary">{course.price} SKY444</span>}</div>
              <Link href={`/school/lesson/1`}>
                <Button className="w-full bg-primary text-primary-foreground mb-3 h-12 text-base font-bold">
                  {course.price === 0 ? "Enroll Free" : "Enroll Now"}
                </Button>
              </Link>
              <Button variant="outline" className="w-full mb-4">Try Free Preview</Button>
              <p className="text-xs text-center text-muted-foreground mb-4">30-day money-back guarantee</p>
              <div className="space-y-2 text-sm">
                <p className="font-semibold mb-2">This course includes:</p>
                {[`${course.duration} video content`, `${course.lessons} lessons`, "Certificate of completion", "Lifetime access", "Mobile access", "SKY444 rewards on completion"].map(item => (
                  <div key={item} className="flex items-center gap-2 text-muted-foreground"><CheckCircle2 className="h-3.5 w-3.5 text-purple-400 shrink-0" />{item}</div>
                ))}
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-border/50">
                <Button variant="outline" size="sm" className="flex-1 gap-1"><Heart className="h-3.5 w-3.5" />Save</Button>
                <Button variant="outline" size="sm" className="flex-1 gap-1"><Share2 className="h-3.5 w-3.5" />Share</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
