import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  BookOpen, Star, Zap, Award, Clock, Users, Search, GraduationCap, Brain,
  Coins, Shield, Code, Rocket, Bug, Cloud, Cpu, CheckCircle, Terminal, Play,
  Video, ArrowLeft, BarChart3, Lock, Trophy
} from "lucide-react";

const COURSES = [
  { id:"blockchain-101", track:"web3", category:"Blockchain", level:"Beginner", icon:"⛓️", title:"Blockchain Fundamentals", description:"Distributed ledgers, consensus, hash functions.", lessons:12, duration:"4h 30m", xpReward:500, skyReward:50, students:28400, rating:4.9, color:"oklch(0.72 0.20 200)", videoUrl:"https://cdn.example.com/blockchain-101.mp4", topics:["What is Blockchain?","Distributed Ledgers","Consensus Mechanisms","Hash Functions","Merkle Trees","Smart Contracts Intro","Public vs Private Chains","Layer 1 vs Layer 2","Blockchain Use Cases","Security Fundamentals","Wallets & Keys","Final Assessment"] },
  { id:"defi-mastery", track:"web3", category:"DeFi", level:"Intermediate", icon:"💰", title:"DeFi Mastery", description:"AMMs, yield farming, liquidity pools, protocol mechanics.", lessons:15, duration:"6h 15m", xpReward:800, skyReward:80, students:19200, rating:4.8, color:"oklch(0.72 0.20 140)", videoUrl:"https://cdn.example.com/defi-mastery.mp4", topics:["DeFi Overview","Uniswap V3","Curve Finance","Aave & Compound","Yield Strategies","Impermanent Loss","MEV & Arbitrage","Cross-chain Bridges","Risk Management","Portfolio Optimization","Tax Considerations","Advanced Strategies","Protocol Governance","Security Audits","Final Project"] },
  { id:"smart-contracts", track:"web3", category:"Development", level:"Advanced", icon:"📜", title:"Smart Contract Engineering", description:"Write, audit, and deploy production Solidity contracts.", lessons:20, duration:"9h 45m", xpReward:1500, skyReward:150, students:11800, rating:4.9, color:"oklch(0.72 0.20 305)", videoUrl:"https://cdn.example.com/smart-contracts.mp4", topics:["Solidity Deep Dive","ERC-20 Tokens","ERC-721 NFTs","ERC-1155","Access Control","Upgradeable Contracts","Gas Optimization","Security Patterns","Reentrancy Attacks","Flash Loan Exploits","Testing with Hardhat","Foundry Framework","Formal Verification","Audit Methodology","Deployment Strategies","Mainnet Forking","Protocol Design","Tokenomics Engineering","DAO Contracts","Final Audit Project"] },
  { id:"python-dev", track:"coding", category:"Python", level:"Beginner", icon:"🐍", title:"Python for Builders", description:"From zero to production — scripts, APIs, automation, data pipelines.", lessons:24, duration:"10h 00m", xpReward:900, skyReward:90, students:45200, rating:4.9, color:"oklch(0.72 0.20 250)", videoUrl:"https://cdn.example.com/python-dev.mp4", topics:["Python Basics","Data Types & Structures","Functions & Closures","OOP in Python","File I/O","Error Handling","Modules & Packages","Virtual Environments","pip & Poetry","REST APIs with FastAPI","Database with SQLAlchemy","Async/Await","Web Scraping","Data Analysis with Pandas","Visualization","Testing with pytest","Docker for Python","CI/CD Pipelines","CLI Tools","Automation Scripts","Crypto APIs","Bot Development","Deployment","Final Project"] },
  { id:"js-ts-dev", track:"coding", category:"JavaScript/TypeScript", level:"Beginner", icon:"⚡", title:"JavaScript & TypeScript Mastery", description:"Modern JS/TS from fundamentals to full-stack React + Node apps.", lessons:28, duration:"12h 30m", xpReward:1000, skyReward:100, students:52100, rating:4.9, color:"oklch(0.80 0.20 70)", videoUrl:"https://cdn.example.com/js-ts-dev.mp4", topics:["JS Fundamentals","ES2024 Features","TypeScript Basics","Type System Deep Dive","Generics","Async/Promises","Event Loop","Node.js","Express APIs","React 19","Hooks & Context","tRPC","Prisma ORM","Authentication","Testing with Vitest","Bundling with Vite","Monorepos","Performance","Security","WebSockets","GraphQL","Deployment","Edge Functions","Deno & Bun","Package Publishing","Open Source","Contributing to OSS","Final Full-Stack App"] },
  { id:"ml-fundamentals", track:"ai", category:"Machine Learning", level:"Beginner", icon:"🤖", title:"Machine Learning Fundamentals", description:"Supervised, unsupervised, and reinforcement learning from scratch.", lessons:20, duration:"9h 00m", xpReward:900, skyReward:90, students:38700, rating:4.9, color:"oklch(0.72 0.20 250)", videoUrl:"https://cdn.example.com/ml-fundamentals.mp4", topics:["What is ML?","Linear Regression","Logistic Regression","Decision Trees","Random Forests","SVM","K-Means Clustering","PCA","Neural Networks Intro","Backpropagation","Overfitting & Regularization","Cross-Validation","Feature Engineering","scikit-learn","Model Evaluation","Hyperparameter Tuning","ML Pipelines","Model Deployment","MLOps Basics","Final ML Project"] },
];

const LEVEL_COLORS: Record<string, string> = {
  "Beginner": "bg-green-500/20 text-green-300 border-green-500/30",
  "Intermediate": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  "Advanced": "bg-red-500/20 text-red-300 border-red-500/30",
};

export default function SkySchoolFull() {
  const { isAuthenticated, user } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<typeof COURSES[0] | null>(null);
  const [selectedLesson, setSelectedLesson] = useState(0);
  const [userProgress, setUserProgress] = useState<Record<string, number>>({});

  const enrollMutation = trpc.skyschool.enroll.useMutation({
    onSuccess: () => toast.success("Enrolled successfully!"),
  });

  const filtered = COURSES.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  if (selectedCourse) {
    const progress = userProgress[selectedCourse.id] || 0;
    const lessonTitle = selectedCourse.topics[selectedLesson];
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCourse(null)}
              className="text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Button>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-400">
                Lesson {selectedLesson + 1} of {selectedCourse.lessons}
              </span>
              <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all"
                  style={{ width: `${((selectedLesson + 1) / selectedCourse.lessons) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Video Player */}
          <div className="bg-black rounded-xl overflow-hidden mb-6 aspect-video flex items-center justify-center border border-white/5">
            <div className="text-center">
              <Video className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 mb-2">{lessonTitle}</p>
              <p className="text-slate-600 text-sm">Video player: {selectedCourse.videoUrl}</p>
              <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                <Play className="w-4 h-4 mr-2" />
                Play Video
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="col-span-2">
              <Card className="bg-[#0e0a1a]/90 border border-white/5">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">{lessonTitle}</h2>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-slate-400 mb-4">
                      This is lesson {selectedLesson + 1} of the {selectedCourse.title} course. 
                      Video content and interactive exercises will appear here.
                    </p>
                    <div className="bg-slate-800/50 rounded-lg p-4 mb-4">
                      <p className="text-slate-300 text-sm">
                        <strong>Learning Objectives:</strong> Complete this lesson to earn {Math.round(selectedCourse.xpReward / selectedCourse.lessons)} XP and progress towards your certification.
                      </p>
                    </div>
                  </div>

                  {/* Lesson Navigation */}
                  <div className="flex gap-3 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedLesson(Math.max(0, selectedLesson - 1))}
                      disabled={selectedLesson === 0}
                      className="border-slate-600 text-slate-300 hover:bg-slate-800"
                    >
                      Previous
                    </Button>
                    <Button
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                      onClick={() => {
                        if (selectedLesson < selectedCourse.lessons - 1) {
                          setSelectedLesson(selectedLesson + 1);
                          setUserProgress(prev => ({
                            ...prev,
                            [selectedCourse.id]: Math.min(selectedLesson + 1, selectedCourse.lessons)
                          }));
                        } else {
                          toast.success("Course completed! 🎉");
                        }
                      }}
                    >
                      {selectedLesson === selectedCourse.lessons - 1 ? "Complete Course" : "Next Lesson"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Course Info */}
              <Card className="bg-[#0e0a1a]/90 border border-white/5">
                <CardContent className="p-4">
                  <h3 className="font-bold text-white mb-3">{selectedCourse.title}</h3>
                  <div className="space-y-2 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      {selectedCourse.lessons} lessons
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {selectedCourse.duration}
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      +{selectedCourse.skyReward} SKY
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-purple-400" />
                      +{selectedCourse.xpReward} XP
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Lessons List */}
              <Card className="bg-[#0e0a1a]/90 border border-white/5">
                <CardContent className="p-4">
                  <p className="text-sm font-semibold text-white mb-3">Lessons</p>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {selectedCourse.topics.map((topic, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedLesson(idx)}
                        className={`w-full text-left p-2 rounded transition-all text-sm ${
                          selectedLesson === idx
                            ? "bg-purple-500/30 text-purple-300 border border-purple-500/50"
                            : "text-slate-400 hover:bg-slate-800/50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {idx < selectedLesson ? (
                            <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                          ) : idx === selectedLesson ? (
                            <Play className="w-4 h-4 text-purple-400 shrink-0" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-slate-600 shrink-0" />
                          )}
                          <span className="truncate">{topic}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap className="w-8 h-8 text-cyan-400" />
            <h1 className="text-4xl font-bold text-white">Sky School</h1>
          </div>
          <p className="text-slate-400 text-lg">Learn Web3, Coding, AI, and Hacking. Earn SKY4, XP, and Certifications.</p>
        </div>

        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
          <Input
            placeholder="Search courses..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-slate-500"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-slate-800/50 border-b border-slate-700">
            <TabsTrigger value="all">All Courses</TabsTrigger>
            <TabsTrigger value="web3">Web3</TabsTrigger>
            <TabsTrigger value="coding">Coding</TabsTrigger>
            <TabsTrigger value="ai">AI & ML</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(course => (
                <Card
                  key={course.id}
                  className="bg-[#0e0a1a]/90 border border-white/5 hover:border-cyan-500/30 transition-all overflow-hidden group cursor-pointer"
                  onClick={() => setSelectedCourse(course)}
                >
                  <div className="h-1.5 w-full bg-gradient-to-r from-cyan-500 to-purple-500" />
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-3xl">{course.icon}</span>
                      <Badge className={`text-[10px] px-1.5 py-0.5 ${LEVEL_COLORS[course.level]}`}>
                        {course.level}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-white text-sm mb-1 group-hover:text-cyan-300 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-slate-500 text-xs mb-3">{course.description}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />{course.lessons} lessons
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />{course.duration}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-yellow-400 font-semibold flex items-center gap-0.5">
                          <Zap className="w-3 h-3" />+{course.skyReward} SKY
                        </span>
                        <span className="text-xs text-purple-400 flex items-center gap-0.5">
                          <Award className="w-3 h-3" />+{course.xpReward} XP
                        </span>
                      </div>
                      <Button
                        size="sm"
                        className="h-7 text-xs bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 border border-cyan-500/30"
                        onClick={e => {
                          e.stopPropagation();
                          if (!isAuthenticated) {
                            toast.error("Sign in to enroll");
                            return;
                          }
                          enrollMutation.mutate({ courseId: course.id });
                        }}
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Start
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="web3" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.filter(c => c.track === "web3").map(course => (
                <Card
                  key={course.id}
                  className="bg-[#0e0a1a]/90 border border-white/5 hover:border-cyan-500/30 transition-all cursor-pointer"
                  onClick={() => setSelectedCourse(course)}
                >
                  <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-cyan-500" />
                  <CardContent className="p-4">
                    <span className="text-3xl">{course.icon}</span>
                    <h3 className="font-bold text-white text-sm mt-2">{course.title}</h3>
                    <p className="text-slate-500 text-xs mt-1">{course.description}</p>
                    <Button className="w-full mt-4 bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 border border-cyan-500/30 text-sm">
                      <Play className="w-3 h-3 mr-2" />
                      Start Learning
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="coding" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.filter(c => c.track === "coding").map(course => (
                <Card
                  key={course.id}
                  className="bg-[#0e0a1a]/90 border border-white/5 hover:border-green-500/30 transition-all cursor-pointer"
                  onClick={() => setSelectedCourse(course)}
                >
                  <div className="h-1.5 w-full bg-gradient-to-r from-green-500 to-emerald-500" />
                  <CardContent className="p-4">
                    <span className="text-3xl">{course.icon}</span>
                    <h3 className="font-bold text-white text-sm mt-2">{course.title}</h3>
                    <p className="text-slate-500 text-xs mt-1">{course.description}</p>
                    <Button className="w-full mt-4 bg-green-500/20 hover:bg-green-500/40 text-green-300 border border-green-500/30 text-sm">
                      <Code className="w-3 h-3 mr-2" />
                      Start Coding
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ai" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.filter(c => c.track === "ai").map(course => (
                <Card
                  key={course.id}
                  className="bg-[#0e0a1a]/90 border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer"
                  onClick={() => setSelectedCourse(course)}
                >
                  <div className="h-1.5 w-full bg-gradient-to-r from-purple-500 to-violet-500" />
                  <CardContent className="p-4">
                    <span className="text-3xl">{course.icon}</span>
                    <h3 className="font-bold text-white text-sm mt-2">{course.title}</h3>
                    <p className="text-slate-500 text-xs mt-1">{course.description}</p>
                    <Button className="w-full mt-4 bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 border border-purple-500/30 text-sm">
                      <Brain className="w-3 h-3 mr-2" />
                      Start Learning
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
