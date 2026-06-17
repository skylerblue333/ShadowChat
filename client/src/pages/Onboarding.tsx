import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ArrowRight, Zap, BookOpen, Gamepad2, Vote, TrendingUp, Heart, ShoppingCart, Users, Mic } from "lucide-react";

const ONBOARDING_STEPS = [
  {
    id: 1,
    title: "Welcome to SKYCOIN4444",
    description: "A comprehensive AI-powered digital ecosystem",
    icon: Zap,
    color: "from-cyan-500 to-blue-600",
    details: "Learn, create, trade, and collaborate on one unified platform",
  },
  {
    id: 2,
    title: "HopeAI - Code Generation",
    description: "AI-powered software engineer workspace",
    icon: BookOpen,
    color: "from-purple-500 to-pink-600",
    details: "Generate, review, and optimize code with real LLM integration",
    action: "/engineer",
  },
  {
    id: 3,
    title: "Sky School - Learning",
    description: "Personalized AI learning paths",
    icon: BookOpen,
    color: "from-green-500 to-emerald-600",
    details: "Take courses, track progress, earn certificates",
    action: "/school",
  },
  {
    id: 4,
    title: "Arcade - Gaming",
    description: "Play games, earn rewards",
    icon: Gamepad2,
    color: "from-yellow-500 to-orange-600",
    details: "5 playable games with real-time leaderboards",
    action: "/arcade",
  },
  {
    id: 5,
    title: "Governance - Voting",
    description: "DAO voting with DODGE & Trump Coin",
    icon: Vote,
    color: "from-red-500 to-rose-600",
    details: "Vote on proposals, earn staking rewards",
    action: "/governance",
  },
  {
    id: 6,
    title: "Analytics - Insights",
    description: "Business intelligence dashboard",
    icon: TrendingUp,
    color: "from-indigo-500 to-purple-600",
    details: "Real-time metrics, revenue trends, predictions",
    action: "/analytics",
  },
  {
    id: 7,
    title: "Charity - Impact",
    description: "Community fundraising campaigns",
    icon: Heart,
    color: "from-pink-500 to-rose-600",
    details: "Support causes, track impact, earn badges",
    action: "/charity",
  },
  {
    id: 8,
    title: "Marketplace - Commerce",
    description: "Buy, sell, trade digital assets",
    icon: ShoppingCart,
    color: "from-cyan-500 to-teal-600",
    details: "Multi-token payments (SKY444, DODGE, TRUMP)",
    action: "/marketplace",
  },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const [, navigate] = useLocation();

  const step = ONBOARDING_STEPS[currentStep];
  const Icon = step.icon;
  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCompleted([...completed, currentStep]);
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNavigate = (action?: string) => {
    // Mark current step as complete
    if (!completed.includes(currentStep)) {
      setCompleted([...completed, currentStep]);
    }
    // Move to next step
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-white">Getting Started</h1>
            <Button variant="ghost" onClick={handleSkip} className="text-slate-400 hover:text-slate-200">
              Skip Tour
            </Button>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-slate-400 mt-2">
            Step {currentStep + 1} of {ONBOARDING_STEPS.length}
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Sidebar - Steps */}
          <div className="space-y-2">
            {ONBOARDING_STEPS.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentStep(idx)}
                className={`w-full text-left p-3 rounded-lg transition-all ${
                  idx === currentStep
                    ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50"
                    : completed.includes(idx)
                    ? "bg-green-500/10 border border-green-500/30"
                    : "bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  {completed.includes(idx) ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-500" />
                  )}
                  <span className="text-sm font-medium text-slate-300">{s.title}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Main - Current Step */}
          <div className="col-span-2">
            <Card className={`bg-gradient-to-br ${step.color} bg-opacity-10 border-opacity-30 border p-8 mb-6`}>
              <div className="flex items-start gap-6">
                <div className={`p-4 bg-gradient-to-br ${step.color} rounded-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">{step.title}</h2>
                  <p className="text-slate-300 mb-4">{step.description}</p>
                  <p className="text-sm text-slate-400">{step.details}</p>
                </div>
              </div>
            </Card>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { icon: Zap, label: "AI-Powered", desc: "Real LLM integration" },
                { icon: Users, label: "Community", desc: "Connect with millions" },
                { icon: TrendingUp, label: "Analytics", desc: "Real-time insights" },
                { icon: Mic, label: "Voice Commands", desc: "444+ commands" },
              ].map((feature, idx) => (
                <Card key={idx} className="bg-slate-800/50 border-slate-700/50 p-4">
                  <div className="flex items-center gap-3">
                    <feature.icon className="w-5 h-5 text-cyan-400" />
                    <div>
                      <p className="text-sm font-semibold text-white">{feature.label}</p>
                      <p className="text-xs text-slate-400">{feature.desc}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                variant="outline"
                className="border-slate-700 hover:bg-slate-800"
              >
                Previous
              </Button>
              <Button
                onClick={() => handleNavigate()}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              >
                {currentStep === ONBOARDING_STEPS.length - 1 ? "Complete" : "Next"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Completion Message */}
        {currentStep === ONBOARDING_STEPS.length - 1 && (
          <Card className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-500/30 p-6">
            <div className="flex items-center gap-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <div>
                <h3 className="font-semibold text-white">Tour Complete!</h3>
                <p className="text-sm text-slate-300">You're ready to explore SKYCOIN4444. Happy exploring!</p>
              </div>
              <Button onClick={handleSkip} className="ml-auto bg-green-600 hover:bg-green-700">
                Go to Dashboard
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
