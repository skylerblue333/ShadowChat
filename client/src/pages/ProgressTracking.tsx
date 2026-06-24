import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Target, Award, Flame, BookOpen, Volume2, PenTool } from "lucide-react";

interface LanguageProgress {
  language: string;
  level: string;
  score: number;
  nextLevel: string;
  wordsLearned: number;
  hoursSpent: number;
  streakDays: number;
  progressToNextLevel: number;
  lastPractice: Date;
}

interface Milestone {
  id: string;
  name: string;
  description: string;
  target: number;
  current: number;
  icon: string;
  reward: number;
  completed: boolean;
}

interface DailyStats {
  date: string;
  wordsLearned: number;
  minutesPracticed: number;
  sessionsCompleted: number;
  xpEarned: number;
}

const MOCK_LANGUAGES: LanguageProgress[] = [
  {
    language: "Chinese",
    level: "B2",
    score: 75,
    nextLevel: "C1",
    wordsLearned: 2847,
    hoursSpent: 156,
    streakDays: 23,
    progressToNextLevel: 45,
    lastPractice: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    language: "Spanish",
    level: "B1",
    score: 62,
    nextLevel: "B2",
    wordsLearned: 1456,
    hoursSpent: 89,
    streakDays: 15,
    progressToNextLevel: 38,
    lastPractice: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    language: "Japanese",
    level: "A2",
    score: 48,
    nextLevel: "B1",
    wordsLearned: 654,
    hoursSpent: 42,
    streakDays: 8,
    progressToNextLevel: 22,
    lastPractice: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
];

const MILESTONES: Milestone[] = [
  {
    id: "m1",
    name: "Word Master",
    description: "Learn 1000 words",
    target: 1000,
    current: 847,
    icon: "📚",
    reward: 500,
    completed: false,
  },
  {
    id: "m2",
    name: "Streak Champion",
    description: "Maintain a 30-day streak",
    target: 30,
    current: 23,
    icon: "🔥",
    reward: 750,
    completed: false,
  },
  {
    id: "m3",
    name: "Hour Grinder",
    description: "Complete 100 hours of practice",
    target: 100,
    current: 156,
    icon: "⏱️",
    reward: 1000,
    completed: true,
  },
  {
    id: "m4",
    name: "Conversation Pro",
    description: "Complete 50 practice sessions",
    target: 50,
    current: 47,
    icon: "💬",
    reward: 600,
    completed: false,
  },
  {
    id: "m5",
    name: "Polyglot",
    description: "Reach B1 level in 3 languages",
    target: 3,
    current: 2,
    icon: "🌍",
    reward: 2000,
    completed: false,
  },
  {
    id: "m6",
    name: "Perfect Week",
    description: "Practice every day for a week",
    target: 7,
    current: 5,
    icon: "✨",
    reward: 400,
    completed: false,
  },
];

const DAILY_STATS: DailyStats[] = [
  {
    date: "Today",
    wordsLearned: 42,
    minutesPracticed: 85,
    sessionsCompleted: 2,
    xpEarned: 425,
  },
  {
    date: "Yesterday",
    wordsLearned: 38,
    minutesPracticed: 65,
    sessionsCompleted: 1,
    xpEarned: 325,
  },
  {
    date: "2 days ago",
    wordsLearned: 45,
    minutesPracticed: 95,
    sessionsCompleted: 2,
    xpEarned: 475,
  },
  {
    date: "3 days ago",
    wordsLearned: 35,
    minutesPracticed: 55,
    sessionsCompleted: 1,
    xpEarned: 275,
  },
  {
    date: "4 days ago",
    wordsLearned: 50,
    minutesPracticed: 110,
    sessionsCompleted: 3,
    xpEarned: 550,
  },
];

export function ProgressTracking() {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageProgress>(MOCK_LANGUAGES[0]);
  const [viewMode, setViewMode] = useState<"overview" | "detailed">("overview");

  const { data: stats } = trpc.languageExchange.getStats.useQuery(undefined, { retry: 1 });

  const getLevelColor = (level: string) => {
    if (level.startsWith("A")) return "text-green-400";
    if (level.startsWith("B")) return "text-yellow-400";
    return "text-red-400";
  };

  const getLevelBgColor = (level: string) => {
    if (level.startsWith("A")) return "bg-green-500/20";
    if (level.startsWith("B")) return "bg-yellow-500/20";
    return "bg-red-500/20";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <TrendingUp className="w-10 h-10 text-purple-400" />
            Progress Tracking
          </h1>
          <p className="text-gray-400">
            Monitor your language learning journey and celebrate your achievements
          </p>
        </div>

        {/* Overall Stats */}
        {stats && (
          <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/30 mb-8 p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Total Sessions</p>
                <p className="text-3xl font-bold text-purple-400">{stats.totalSessions}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Hours</p>
                <p className="text-3xl font-bold text-blue-400">{stats.totalHours}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Languages Learning</p>
                <p className="text-3xl font-bold text-green-400">{stats.languagesLearning}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Average Rating</p>
                <p className="text-3xl font-bold text-orange-400">{stats.averageRating.toFixed(2)}</p>
              </div>
            </div>
          </Card>
        )}

        <Tabs defaultValue="languages" className="mb-8">
          <TabsList className="bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="languages">Languages</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="daily">Daily Activity</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>

          {/* Languages Tab */}
          <TabsContent value="languages" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Language List */}
              <div className="space-y-3">
                {MOCK_LANGUAGES.map((lang) => (
                  <Card
                    key={lang.language}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedLanguage.language === lang.language
                        ? "bg-purple-900/50 border-purple-500"
                        : "bg-slate-800/50 border-slate-700 hover:border-purple-500/50"
                    }`}
                    onClick={() => setSelectedLanguage(lang)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-white">{lang.language}</h3>
                      <Badge className={`${getLevelBgColor(lang.level)} ${getLevelColor(lang.level)}`}>
                        {lang.level}
                      </Badge>
                    </div>
                    <Progress value={lang.score} className="h-2" />
                    <p className="text-gray-400 text-xs mt-2">{lang.score}% to next level</p>
                  </Card>
                ))}
              </div>

              {/* Detailed Progress */}
              <div className="lg:col-span-2">
                <Card className="bg-slate-800/50 border-slate-700 p-6 mb-6">
                  <h2 className="text-2xl font-bold text-white mb-6">{selectedLanguage.language}</h2>

                  {/* Progress Bar */}
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Progress to {selectedLanguage.nextLevel}</span>
                      <span className="text-purple-400 font-bold">{selectedLanguage.progressToNextLevel}%</span>
                    </div>
                    <Progress value={selectedLanguage.progressToNextLevel} className="h-3" />
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900/50 rounded p-4">
                      <p className="text-gray-400 text-sm mb-1">Words Learned</p>
                      <p className="text-2xl font-bold text-blue-400">{selectedLanguage.wordsLearned}</p>
                    </div>
                    <div className="bg-slate-900/50 rounded p-4">
                      <p className="text-gray-400 text-sm mb-1">Hours Spent</p>
                      <p className="text-2xl font-bold text-green-400">{selectedLanguage.hoursSpent}</p>
                    </div>
                    <div className="bg-slate-900/50 rounded p-4">
                      <p className="text-gray-400 text-sm mb-1 flex items-center gap-2">
                        <Flame className="w-4 h-4" />
                        Current Streak
                      </p>
                      <p className="text-2xl font-bold text-orange-400">{selectedLanguage.streakDays} days</p>
                    </div>
                    <div className="bg-slate-900/50 rounded p-4">
                      <p className="text-gray-400 text-sm mb-1">Last Practice</p>
                      <p className="text-sm font-bold text-purple-400">
                        {selectedLanguage.lastPractice.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Practice Now
                  </Button>
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <Volume2 className="w-4 h-4 mr-2" />
                    Listen
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Milestones Tab */}
          <TabsContent value="milestones" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MILESTONES.map((milestone) => (
                <Card
                  key={milestone.id}
                  className={`p-6 transition-all ${
                    milestone.completed
                      ? "bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-500/30"
                      : "bg-slate-800/50 border-slate-700"
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{milestone.icon}</span>
                      <div>
                        <h3 className="font-bold text-white">{milestone.name}</h3>
                        <p className="text-gray-400 text-sm">{milestone.description}</p>
                      </div>
                    </div>
                    {milestone.completed && (
                      <Badge className="bg-yellow-500/20 text-yellow-400">✓ Completed</Badge>
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400 text-sm">
                        {milestone.current} / {milestone.target}
                      </span>
                      <span className="text-purple-400 font-bold">
                        {Math.round((milestone.current / milestone.target) * 100)}%
                      </span>
                    </div>
                    <Progress value={(milestone.current / milestone.target) * 100} className="h-2" />
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Award className="w-4 h-4" />
                      {milestone.reward} XP
                    </div>
                    <Button
                      size="sm"
                      variant={milestone.completed ? "outline" : "default"}
                      disabled={milestone.completed}
                    >
                      {milestone.completed ? "Claimed" : "Claim"}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Daily Activity Tab */}
          <TabsContent value="daily" className="space-y-4">
            <div className="space-y-3">
              {DAILY_STATS.map((day, idx) => (
                <Card key={idx} className="bg-slate-800/50 border-slate-700 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-white">{day.date}</h3>
                    <Badge className="bg-purple-500/20 text-purple-400">
                      +{day.xpEarned} XP
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-gray-400 text-xs">Words Learned</p>
                        <p className="text-white font-bold">{day.wordsLearned}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-gray-400 text-xs">Minutes Practiced</p>
                        <p className="text-white font-bold">{day.minutesPracticed}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <PenTool className="w-5 h-5 text-orange-400" />
                      <div>
                        <p className="text-gray-400 text-xs">Sessions</p>
                        <p className="text-white font-bold">{day.sessionsCompleted}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "Speaking", level: 75, icon: "🗣️" },
                { name: "Listening", level: 82, icon: "👂" },
                { name: "Reading", level: 88, icon: "📖" },
                { name: "Writing", level: 71, icon: "✍️" },
                { name: "Vocabulary", level: 79, icon: "📚" },
                { name: "Grammar", level: 76, icon: "📝" },
              ].map((skill, idx) => (
                <Card key={idx} className="bg-slate-800/50 border-slate-700 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{skill.icon}</span>
                    <div>
                      <h3 className="font-bold text-white">{skill.name}</h3>
                      <p className="text-purple-400 font-bold">{skill.level}%</p>
                    </div>
                  </div>
                  <Progress value={skill.level} className="h-2" />
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default ProgressTracking;
