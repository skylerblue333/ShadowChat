import React, { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Clock, Users, Star, Zap, BookOpen, Play, Plus } from "lucide-react";

interface PracticeSession {
  id: string;
  partnerId: string;
  partnerName: string;
  language: string;
  level: string;
  duration: number;
  topic: string;
  scheduledAt: Date;
  status: "scheduled" | "active" | "completed" | "cancelled";
  rating?: number;
  notes?: string;
}

interface PracticeTopic {
  id: string;
  name: string;
  description: string;
  difficulty: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  estimatedDuration: number;
  resources: string[];
  xpReward: number;
}

const PRACTICE_TOPICS: PracticeTopic[] = [
  {
    id: "t1",
    name: "Daily Conversations",
    description: "Practice everyday small talk and casual conversations",
    difficulty: "A1",
    estimatedDuration: 30,
    resources: ["Vocabulary list", "Common phrases", "Audio examples"],
    xpReward: 50,
  },
  {
    id: "t2",
    name: "Business Vocabulary",
    description: "Learn professional terminology and business communication",
    difficulty: "B1",
    estimatedDuration: 45,
    resources: ["Industry glossary", "Email templates", "Meeting scripts"],
    xpReward: 100,
  },
  {
    id: "t3",
    name: "Advanced Grammar",
    description: "Master complex grammatical structures and nuances",
    difficulty: "B2",
    estimatedDuration: 60,
    resources: ["Grammar rules", "Practice exercises", "Real examples"],
    xpReward: 150,
  },
  {
    id: "t4",
    name: "Cultural Exchange",
    description: "Discuss culture, traditions, and social customs",
    difficulty: "B2",
    estimatedDuration: 45,
    resources: ["Cultural insights", "Discussion prompts", "Media clips"],
    xpReward: 120,
  },
  {
    id: "t5",
    name: "Debate & Discussion",
    description: "Develop argumentation and debate skills",
    difficulty: "C1",
    estimatedDuration: 60,
    resources: ["Debate topics", "Argument structures", "Counter-arguments"],
    xpReward: 200,
  },
  {
    id: "t6",
    name: "Storytelling",
    description: "Practice narrative skills and creative expression",
    difficulty: "B1",
    estimatedDuration: 30,
    resources: ["Story prompts", "Vocabulary", "Feedback guide"],
    xpReward: 75,
  },
];

const MOCK_SESSIONS: PracticeSession[] = [
  {
    id: "s1",
    partnerId: "p1",
    partnerName: "李明",
    language: "Chinese",
    level: "B2",
    duration: 45,
    topic: "Daily Conversations",
    scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    status: "scheduled",
  },
  {
    id: "s2",
    partnerId: "p2",
    partnerName: "Maria García",
    language: "Spanish",
    level: "C1",
    duration: 60,
    topic: "Business Vocabulary",
    scheduledAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    status: "scheduled",
  },
  {
    id: "s3",
    partnerId: "p3",
    partnerName: "Yuki Tanaka",
    language: "Japanese",
    level: "B1",
    duration: 30,
    topic: "Storytelling",
    scheduledAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: "completed",
    rating: 4.8,
    notes: "Great session! Improved pronunciation significantly.",
  },
];

export function PracticeSessions() {
  const [sessions, setSessions] = useState<PracticeSession[]>(MOCK_SESSIONS);
  const [selectedTopic, setSelectedTopic] = useState<PracticeTopic | null>(null);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showTopicDetails, setShowTopicDetails] = useState(false);
  const [selectedSession, setSelectedSession] = useState<PracticeSession | null>(null);
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const { data: proficiency } = trpc.languageExchange.getProficiency.useQuery(
    { language: "English" },
    { retry: 1 }
  );

  const logSessionMutation = trpc.languageExchange.logSession.useMutation();

  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      if (filterLevel !== "all" && s.level !== filterLevel) return false;
      if (filterStatus !== "all" && s.status !== filterStatus) return false;
      return true;
    });
  }, [sessions, filterLevel, filterStatus]);

  const handleScheduleSession = (topic: PracticeTopic) => {
    setSelectedTopic(topic);
    setShowScheduleDialog(true);
  };

  const handleCompleteSession = (session: PracticeSession) => {
    logSessionMutation.mutate(
      {
        partnerId: session.partnerId,
        language: session.language,
        durationMinutes: session.duration,
        topicsDiscussed: [session.topic],
        rating: 4.5,
        notes: "Great practice session!",
      },
      {
        onSuccess: (result) => {
          setSessions((prev) =>
            prev.map((s) =>
              s.id === session.id
                ? { ...s, status: "completed", rating: 4.5 }
                : s
            )
          );
          toast.success(`Session completed! +${result.xpEarned} XP earned`);
        },
        onError: () => {
          toast.error("Failed to complete session");
        },
      }
    );
  };

  const handleCancelSession = (sessionId: string) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId ? { ...s, status: "cancelled" } : s
      )
    );
    toast.success("Session cancelled");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-500/20 text-blue-400";
      case "active":
        return "bg-green-500/20 text-green-400";
      case "completed":
        return "bg-purple-500/20 text-purple-400";
      case "cancelled":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "A1":
      case "A2":
        return "bg-green-500/20 text-green-400";
      case "B1":
      case "B2":
        return "bg-yellow-500/20 text-yellow-400";
      case "C1":
      case "C2":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <BookOpen className="w-10 h-10 text-purple-400" />
            Practice Sessions
          </h1>
          <p className="text-gray-400">
            Improve your language skills through interactive practice with native speakers
          </p>
        </div>

        {/* Current Level & Stats */}
        {proficiency && (
          <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/30 mb-8 p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Current Level</p>
                <p className="text-2xl font-bold text-purple-400">{proficiency.level}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Words Learned</p>
                <p className="text-2xl font-bold text-blue-400">{proficiency.wordsLearned}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Hours Spent</p>
                <p className="text-2xl font-bold text-green-400">{proficiency.hoursSpent}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Current Streak</p>
                <p className="text-2xl font-bold text-orange-400">{proficiency.streakDays} days</p>
              </div>
            </div>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="available" className="mb-8">
          <TabsList className="bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="available">Available Topics</TabsTrigger>
            <TabsTrigger value="sessions">My Sessions</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Available Topics */}
          <TabsContent value="available" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PRACTICE_TOPICS.map((topic) => (
                <Card
                  key={topic.id}
                  className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all cursor-pointer group"
                  onClick={() => {
                    setSelectedTopic(topic);
                    setShowTopicDetails(true);
                  }}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-white group-hover:text-purple-400 transition">
                        {topic.name}
                      </h3>
                      <Badge className={getDifficultyColor(topic.difficulty)}>
                        {topic.difficulty}
                      </Badge>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">{topic.description}</p>
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                      <Clock className="w-4 h-4" />
                      {topic.estimatedDuration} min
                    </div>
                    <div className="flex gap-2 mb-4">
                      {topic.resources.slice(0, 2).map((res, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {res}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Zap className="w-4 h-4" />
                        {topic.xpReward} XP
                      </div>
                      <Button
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleScheduleSession(topic);
                        }}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Schedule
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* My Sessions */}
          <TabsContent value="sessions" className="space-y-4">
            <div className="flex gap-4 mb-6">
              <div>
                <label className="text-sm text-gray-400 block mb-2">Filter by Level</label>
                <select
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-white rounded px-3 py-2"
                >
                  <option value="all">All Levels</option>
                  <option value="A1">A1 - Beginner</option>
                  <option value="B1">B1 - Intermediate</option>
                  <option value="B2">B2 - Upper Intermediate</option>
                  <option value="C1">C1 - Advanced</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-2">Filter by Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-white rounded px-3 py-2"
                >
                  <option value="all">All Status</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {filteredSessions.length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700 p-8 text-center">
                <p className="text-gray-400">No sessions found. Schedule one to get started!</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredSessions.map((session) => (
                  <Card
                    key={session.id}
                    className="bg-slate-800/50 border-slate-700 p-6 hover:border-purple-500/50 transition"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-white text-lg">{session.partnerName}</h3>
                        <p className="text-gray-400 text-sm">
                          {session.language} • {session.topic}
                        </p>
                      </div>
                      <Badge className={getStatusColor(session.status)}>
                        {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock className="w-4 h-4" />
                        {session.duration} min
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Users className="w-4 h-4" />
                        Level {session.level}
                      </div>
                      {session.rating && (
                        <div className="flex items-center gap-2 text-yellow-400">
                          <Star className="w-4 h-4 fill-current" />
                          {session.rating.toFixed(1)}
                        </div>
                      )}
                    </div>

                    {session.notes && (
                      <p className="text-gray-400 text-sm mb-4 italic">"{session.notes}"</p>
                    )}

                    <div className="flex gap-2">
                      {session.status === "scheduled" && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleCompleteSession(session)}
                          >
                            <Play className="w-4 h-4 mr-1" />
                            Start Session
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCancelSession(session.id)}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      {session.status === "completed" && (
                        <Button size="sm" variant="outline" disabled>
                          ✓ Completed
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* History */}
          <TabsContent value="history" className="space-y-4">
            <div className="space-y-4">
              {sessions
                .filter((s) => s.status === "completed")
                .map((session) => (
                  <Card key={session.id} className="bg-slate-800/50 border-slate-700 p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-white">{session.partnerName}</h3>
                        <p className="text-gray-400 text-sm">
                          {session.language} • {session.topic}
                        </p>
                        <p className="text-gray-500 text-xs mt-2">
                          {session.scheduledAt.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-yellow-400 mb-2">
                          <Star className="w-4 h-4 fill-current" />
                          {session.rating?.toFixed(1)}
                        </div>
                        <p className="text-gray-400 text-sm">{session.duration} min</p>
                      </div>
                    </div>
                    {session.notes && (
                      <p className="text-gray-400 text-sm mt-3 italic">"{session.notes}"</p>
                    )}
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Topic Details Dialog */}
      {selectedTopic && (
        <Dialog open={showTopicDetails} onOpenChange={setShowTopicDetails}>
          <DialogContent className="bg-slate-900 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">{selectedTopic.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-400">{selectedTopic.description}</p>
              <div>
                <h4 className="font-bold text-white mb-2">Resources</h4>
                <ul className="space-y-2">
                  {selectedTopic.resources.map((res, i) => (
                    <li key={i} className="text-gray-400 flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-400 rounded-full" />
                      {res}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-700">
                <div>
                  <p className="text-gray-400 text-sm">Estimated Duration</p>
                  <p className="text-white font-bold">{selectedTopic.estimatedDuration} minutes</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">XP Reward</p>
                  <p className="text-yellow-400 font-bold">{selectedTopic.xpReward} XP</p>
                </div>
              </div>
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => {
                  handleScheduleSession(selectedTopic);
                  setShowTopicDetails(false);
                }}
              >
                Schedule Practice Session
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Schedule Dialog */}
      {selectedTopic && (
        <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
          <DialogContent className="bg-slate-900 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Schedule Practice Session</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-2">Select Partner</label>
                <select className="w-full bg-slate-800 border border-slate-700 text-white rounded px-3 py-2">
                  <option>李明 (Chinese, B2)</option>
                  <option>Maria García (Spanish, C1)</option>
                  <option>Yuki Tanaka (Japanese, B1)</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-2">Preferred Date & Time</label>
                <Input type="datetime-local" className="bg-slate-800 border-slate-700" />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-2">Additional Notes</label>
                <Textarea
                  placeholder="Any specific topics or focus areas?"
                  className="bg-slate-800 border-slate-700"
                />
              </div>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Schedule Session
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default PracticeSessions;
