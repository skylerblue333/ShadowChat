import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Zap, Clock, CheckCircle, Award, TrendingUp, Users, Target } from "lucide-react";

interface Bounty {
  id: string;
  title: string;
  sourceLanguage: string;
  targetLanguage: string;
  wordCount: number;
  reward: number;
  difficulty: "easy" | "medium" | "hard";
  deadline: Date;
  status: "open" | "in_progress" | "completed" | "review";
  description?: string;
  requiredQualifications?: string[];
}

interface CompletedBounty {
  id: string;
  bountyId: string;
  title: string;
  reward: number;
  xpEarned: number;
  completedAt: Date;
  rating: number;
  feedback: string;
}

interface BountyStats {
  totalBountiesCompleted: number;
  totalEarned: number;
  averageRating: number;
  currentStreak: number;
  nextMilestone: string;
}

const MOCK_BOUNTIES: Bounty[] = [
  {
    id: "b1",
    title: "Translate AI Blog Post",
    sourceLanguage: "English",
    targetLanguage: "Chinese",
    wordCount: 1200,
    reward: 75,
    difficulty: "medium",
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: "open",
    description: "Translate a technical blog post about AI and machine learning",
    requiredQualifications: ["B2 English", "B1 Chinese", "Tech vocabulary"],
  },
  {
    id: "b2",
    title: "Translate Product Documentation",
    sourceLanguage: "English",
    targetLanguage: "Spanish",
    wordCount: 2500,
    reward: 150,
    difficulty: "hard",
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    status: "open",
    description: "Translate comprehensive product documentation for a SaaS platform",
    requiredQualifications: ["C1 English", "B2 Spanish", "Business terminology"],
  },
  {
    id: "b3",
    title: "Translate Marketing Copy",
    sourceLanguage: "English",
    targetLanguage: "Japanese",
    wordCount: 350,
    reward: 50,
    difficulty: "easy",
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    status: "open",
    description: "Translate marketing materials for a mobile app",
    requiredQualifications: ["B1 English", "A2 Japanese"],
  },
  {
    id: "b4",
    title: "Translate Legal Agreement",
    sourceLanguage: "English",
    targetLanguage: "French",
    wordCount: 3000,
    reward: 200,
    difficulty: "hard",
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    status: "open",
    description: "Translate a legal contract with precise terminology",
    requiredQualifications: ["C2 English", "C1 French", "Legal knowledge"],
  },
  {
    id: "b5",
    title: "Translate Tutorial Video Subtitles",
    sourceLanguage: "English",
    targetLanguage: "German",
    wordCount: 800,
    reward: 60,
    difficulty: "medium",
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    status: "open",
    description: "Translate subtitles for an educational video tutorial",
    requiredQualifications: ["B2 English", "B1 German"],
  },
  {
    id: "b6",
    title: "Translate Social Media Content",
    sourceLanguage: "English",
    targetLanguage: "Korean",
    wordCount: 500,
    reward: 40,
    difficulty: "easy",
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    status: "open",
    description: "Translate social media posts and captions",
    requiredQualifications: ["B1 English", "A2 Korean"],
  },
];

const COMPLETED_BOUNTIES: CompletedBounty[] = [
  {
    id: "c1",
    bountyId: "b7",
    title: "Translate Tech Article",
    reward: 85,
    xpEarned: 425,
    completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    rating: 4.9,
    feedback: "Excellent translation with perfect terminology!",
  },
  {
    id: "c2",
    bountyId: "b8",
    title: "Translate Marketing Email",
    reward: 45,
    xpEarned: 225,
    completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    rating: 4.7,
    feedback: "Great work, very natural tone",
  },
  {
    id: "c3",
    bountyId: "b9",
    title: "Translate Product Review",
    reward: 55,
    xpEarned: 275,
    completedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    rating: 4.8,
    feedback: "Professional quality, well done!",
  },
];

const MOCK_STATS: BountyStats = {
  totalBountiesCompleted: 23,
  totalEarned: 1850,
  averageRating: 4.8,
  currentStreak: 12,
  nextMilestone: "50 bounties completed (27 to go)",
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "easy":
      return "bg-green-500/20 text-green-400";
    case "medium":
      return "bg-yellow-500/20 text-yellow-400";
    case "hard":
      return "bg-red-500/20 text-red-400";
    default:
      return "bg-gray-500/20 text-gray-400";
  }
};

const getDifficultyIcon = (difficulty: string) => {
  switch (difficulty) {
    case "easy":
      return "⭐";
    case "medium":
      return "⭐⭐";
    case "hard":
      return "⭐⭐⭐";
    default:
      return "";
  }
};

export function BountySystem() {
  const [bounties, setBounties] = useState<Bounty[]>(MOCK_BOUNTIES);
  const [selectedBounty, setSelectedBounty] = useState<Bounty | null>(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [translatedText, setTranslatedText] = useState("");
  const [notes, setNotes] = useState("");

  const { data: bountyList } = trpc.languageExchange.getBounties.useQuery(
    { language: "Chinese", limit: 20 },
    { retry: 1 }
  );

  const completeBountyMutation = trpc.languageExchange.completeBounty.useMutation();

  const handleAcceptBounty = (bounty: Bounty) => {
    setSelectedBounty(bounty);
    setShowSubmitDialog(true);
  };

  const handleSubmitTranslation = () => {
    if (!selectedBounty || !translatedText.trim()) {
      toast.error("Please enter your translation");
      return;
    }

    completeBountyMutation.mutate(
      {
        bountyId: selectedBounty.id,
        translatedText,
        notes,
      },
      {
        onSuccess: (result) => {
          toast.success(`Translation submitted! +${result.xpEarned} XP earned`);
          setShowSubmitDialog(false);
          setTranslatedText("");
          setNotes("");
          setSelectedBounty(null);
        },
        onError: () => {
          toast.error("Failed to submit translation");
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Target className="w-10 h-10 text-purple-400" />
            Translation Bounty System
          </h1>
          <p className="text-gray-400">
            Earn rewards by translating content and helping global businesses communicate
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30 p-6">
            <p className="text-gray-400 text-sm mb-1">Bounties Completed</p>
            <p className="text-3xl font-bold text-purple-400">{MOCK_STATS.totalBountiesCompleted}</p>
          </Card>
          <Card className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-500/30 p-6">
            <p className="text-gray-400 text-sm mb-1">Total Earned</p>
            <p className="text-3xl font-bold text-green-400">${MOCK_STATS.totalEarned}</p>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border-yellow-500/30 p-6">
            <p className="text-gray-400 text-sm mb-1">Average Rating</p>
            <p className="text-3xl font-bold text-yellow-400">{MOCK_STATS.averageRating.toFixed(1)}</p>
          </Card>
          <Card className="bg-gradient-to-br from-red-900/50 to-pink-900/50 border-red-500/30 p-6">
            <p className="text-gray-400 text-sm mb-1">Current Streak</p>
            <p className="text-3xl font-bold text-red-400">{MOCK_STATS.currentStreak} days</p>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="available" className="mb-8">
          <TabsList className="bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="available">Available Bounties</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          {/* Available Bounties */}
          <TabsContent value="available" className="space-y-4">
            <div className="space-y-4">
              {bounties
                .filter((b) => b.status === "open")
                .map((bounty) => (
                  <Card
                    key={bounty.id}
                    className="bg-slate-800/50 border-slate-700 p-6 hover:border-purple-500/50 transition"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">{bounty.title}</h3>
                        <p className="text-gray-400 text-sm mb-3">{bounty.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {bounty.requiredQualifications?.map((qual, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {qual}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-3xl font-bold text-yellow-400 mb-2">
                          ${bounty.reward}
                        </div>
                        <Badge className={getDifficultyColor(bounty.difficulty)}>
                          {getDifficultyIcon(bounty.difficulty)} {bounty.difficulty}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-4 pb-4 border-t border-slate-700">
                      <div>
                        <p className="text-gray-400 text-xs">Language Pair</p>
                        <p className="text-white font-bold text-sm">
                          {bounty.sourceLanguage} → {bounty.targetLanguage}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Word Count</p>
                        <p className="text-white font-bold text-sm">{bounty.wordCount} words</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Deadline</p>
                        <p className="text-white font-bold text-sm">
                          {Math.ceil(
                            (bounty.deadline.getTime() - Date.now()) / (24 * 60 * 60 * 1000)
                          )}{" "}
                          days
                        </p>
                      </div>
                      <div className="text-right">
                        <Button
                          className="bg-purple-600 hover:bg-purple-700 w-full"
                          onClick={() => handleAcceptBounty(bounty)}
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Accept
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </TabsContent>

          {/* In Progress */}
          <TabsContent value="in_progress" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700 p-8 text-center">
              <p className="text-gray-400">No bounties in progress</p>
            </Card>
          </TabsContent>

          {/* Completed */}
          <TabsContent value="completed" className="space-y-4">
            {COMPLETED_BOUNTIES.map((completed) => (
              <Card key={completed.id} className="bg-slate-800/50 border-slate-700 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <h3 className="text-lg font-bold text-white">{completed.title}</h3>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Completed {completed.completedAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-400 mb-1">
                      +${completed.reward}
                    </div>
                    <div className="text-sm text-purple-400">+{completed.xpEarned} XP</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-3 pb-3 border-t border-slate-700">
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Award className="w-4 h-4" />
                    Rating: {completed.rating.toFixed(1)}/5
                  </div>
                </div>

                <p className="text-gray-400 text-sm italic">"{completed.feedback}"</p>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Submit Translation Dialog */}
      {selectedBounty && (
        <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
          <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">{selectedBounty.title}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="bg-slate-800/50 p-4 rounded">
                <p className="text-gray-400 text-sm mb-2">Original Text (Sample)</p>
                <p className="text-white">
                  "Artificial Intelligence is transforming how we work and live. From healthcare to
                  finance, AI applications are revolutionizing industries..."
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-2">Your Translation</label>
                <Textarea
                  placeholder="Paste your translation here..."
                  value={translatedText}
                  onChange={(e) => setTranslatedText(e.target.value)}
                  className="bg-slate-800 border-slate-700 min-h-32"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-2">Notes (Optional)</label>
                <Textarea
                  placeholder="Any notes about your translation, terminology choices, etc."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-slate-800 border-slate-700 min-h-20"
                />
              </div>

              <div className="bg-slate-800/50 p-4 rounded">
                <p className="text-gray-400 text-sm mb-2">Reward</p>
                <p className="text-2xl font-bold text-yellow-400">${selectedBounty.reward}</p>
              </div>

              <Button
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={handleSubmitTranslation}
                disabled={completeBountyMutation.isPending}
              >
                {completeBountyMutation.isPending ? "Submitting..." : "Submit Translation"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default BountySystem;
