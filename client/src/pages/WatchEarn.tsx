import { useState, useEffect, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Play, Pause, Volume2, VolumeX, Maximize, Coins, Zap, Trophy, Star, Gift, Clock, TrendingUp, Eye, Heart } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Video {
  id: number;
  title: string;
  creator: string;
  thumbnail: string;
  duration: number;
  views: number;
  likes: number;
  xpPerMinute: number;
  skyPerMinute: number;
  category: string;
  url?: string;
}

interface PuzzleQuestion {
  question: string;
  options: string[];
  correct: number;
  reward: number;
}

// ─── Seed Videos ─────────────────────────────────────────────────────────────
const FEATURED_VIDEOS: Video[] = [
  { id: 1, title: "How to Build a DeFi Protocol from Scratch", creator: "DeFi Dev", thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=640", duration: 2340, views: 48200, likes: 3400, xpPerMinute: 12, skyPerMinute: 0.5, category: "Education" },
  { id: 2, title: "Valorant Radiant Ranked Gameplay — Best Clips", creator: "GamerX", thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=640", duration: 1820, views: 92000, likes: 7800, xpPerMinute: 8, skyPerMinute: 0.3, category: "Gaming" },
  { id: 3, title: "NFT Art Process — Neon Phantom Series", creator: "NFT Queen 👑", thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=640", duration: 3600, views: 31000, likes: 4200, xpPerMinute: 10, skyPerMinute: 0.4, category: "Art" },
  { id: 4, title: "Bitcoin Technical Analysis — Is $100k Next?", creator: "CryptoKid", thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=640", duration: 1200, views: 156000, likes: 12000, xpPerMinute: 15, skyPerMinute: 0.6, category: "Finance" },
  { id: 5, title: "Clean Water Campaign — Impact Report 2025", creator: "Maya Gives", thumbnail: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=640", duration: 900, views: 28000, likes: 5600, xpPerMinute: 20, skyPerMinute: 0.8, category: "Charity" },
  { id: 6, title: "M4 MacBook Pro — Honest 3-Week Review", creator: "TechSam", thumbnail: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=640", duration: 780, views: 89000, likes: 6700, xpPerMinute: 10, skyPerMinute: 0.4, category: "Tech" },
  { id: 7, title: "Streetwear Thrift Haul — $200 Budget", creator: "Jordan Fits", thumbnail: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=640", duration: 1080, views: 44000, likes: 3800, xpPerMinute: 8, skyPerMinute: 0.3, category: "Fashion" },
  { id: 8, title: "SkyCoin4444 Platform Tour — Full Walkthrough", creator: "Skyler Blue", thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=640", duration: 2700, views: 67000, likes: 8900, xpPerMinute: 18, skyPerMinute: 0.7, category: "Platform" },
];

const PUZZLE_QUESTIONS: PuzzleQuestion[] = [
  { question: "What does DeFi stand for?", options: ["Decentralized Finance", "Digital Finance", "Distributed Fiat", "Direct Funding"], correct: 0, reward: 50 },
  { question: "What is the max supply of Bitcoin?", options: ["100 million", "21 million", "1 billion", "No limit"], correct: 1, reward: 50 },
  { question: "What does NFT stand for?", options: ["New Financial Token", "Non-Fungible Token", "Network Finance Tool", "Node Funding Transfer"], correct: 1, reward: 50 },
  { question: "What is a smart contract?", options: ["A legal document", "Self-executing code on blockchain", "A bank agreement", "A crypto wallet"], correct: 1, reward: 75 },
  { question: "What is staking in crypto?", options: ["Mining new coins", "Locking tokens to earn rewards", "Selling tokens", "Buying NFTs"], correct: 1, reward: 75 },
  { question: "What blockchain is Ethereum on?", options: ["Bitcoin", "Solana", "Its own", "Cardano"], correct: 2, reward: 50 },
  { question: "What is a gas fee?", options: ["Fuel cost", "Transaction fee on Ethereum", "Mining reward", "Wallet charge"], correct: 1, reward: 50 },
  { question: "What does HODL mean?", options: ["Hold On for Dear Life", "High Output Digital Ledger", "Hybrid On-chain DeFi Layer", "None of the above"], correct: 0, reward: 50 },
];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatViews(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

export default function WatchEarn() {
  const { user } = useAuth();
  const [selectedVideo, setSelectedVideo] = useState<Video>(FEATURED_VIDEOS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalXpEarned, setTotalXpEarned] = useState(0);
  const [totalSkyEarned, setTotalSkyEarned] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);
  const [sessionSky, setSessionSky] = useState(0);
  const [streak, setStreak] = useState(1);
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [currentPuzzle, setCurrentPuzzle] = useState<PuzzleQuestion | null>(null);
  const [puzzleAnswered, setPuzzleAnswered] = useState(false);
  const [earnAnimation, setEarnAnimation] = useState(false);
  const [likedVideos, setLikedVideos] = useState<Set<number>>(new Set());
  const [watchedMinutes, setWatchedMinutes] = useState(0);
  const [nextPuzzleAt, setNextPuzzleAt] = useState(5); // minutes
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const puzzleIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Simulate watching — earn XP and SKY every real second (scaled to video time)
  useEffect(() => {
    if (isPlaying && !showPuzzle) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(t => {
          const next = t + 1;
          if (next >= selectedVideo.duration) {
            setIsPlaying(false);
            toast.success(`Video complete! +${Math.round(selectedVideo.duration / 60 * selectedVideo.xpPerMinute)} XP earned`);
            return selectedVideo.duration;
          }
          return next;
        });

        // Earn every 3 real seconds (represents 1 video minute at 20x speed for demo)
        if (Math.random() < 0.33) {
          const xpGain = Math.round(selectedVideo.xpPerMinute * streak * 0.1);
          const skyGain = parseFloat((selectedVideo.skyPerMinute * streak * 0.1).toFixed(4));
          setSessionXp(x => x + xpGain);
          setSessionSky(s => parseFloat((s + skyGain).toFixed(4)));
          setTotalXpEarned(x => x + xpGain);
          setTotalSkyEarned(s => parseFloat((s + skyGain).toFixed(4)));
          setEarnAnimation(true);
          setTimeout(() => setEarnAnimation(false), 600);
        }

        setWatchedMinutes(m => {
          const newM = m + (1 / 60);
          return newM;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, showPuzzle, selectedVideo, streak]);

  // Trigger puzzle every 5 minutes of watching
  useEffect(() => {
    if (watchedMinutes >= nextPuzzleAt && isPlaying && !showPuzzle) {
      const q = PUZZLE_QUESTIONS[Math.floor(Math.random() * PUZZLE_QUESTIONS.length)];
      setCurrentPuzzle(q);
      setShowPuzzle(true);
      setPuzzleAnswered(false);
      setIsPlaying(false);
      setNextPuzzleAt(n => n + 5);
      toast.info("Puzzle time! Answer to earn bonus SKY444 🧩");
    }
  }, [watchedMinutes, nextPuzzleAt, isPlaying, showPuzzle]);

  const handlePuzzleAnswer = (idx: number) => {
    if (!currentPuzzle || puzzleAnswered) return;
    setPuzzleAnswered(true);
    if (idx === currentPuzzle.correct) {
      setSessionSky(s => parseFloat((s + currentPuzzle.reward * 0.01).toFixed(4)));
      setSessionXp(x => x + currentPuzzle.reward);
      setStreak(s => Math.min(s + 0.5, 5));
      toast.success(`Correct! +${currentPuzzle.reward} XP +${(currentPuzzle.reward * 0.01).toFixed(2)} SKY444 🎉`);
    } else {
      toast.error(`Wrong! The answer was: ${currentPuzzle.options[currentPuzzle.correct]}`);
    }
    setTimeout(() => {
      setShowPuzzle(false);
      setIsPlaying(true);
    }, 2000);
  };

  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const handleLike = (videoId: number) => {
    setLikedVideos(prev => {
      const next = new Set(prev);
      if (next.has(videoId)) next.delete(videoId);
      else { next.add(videoId); toast.success("+5 XP for liking!"); setSessionXp(x => x + 5); }
      return next;
    });
  };

  const progress = selectedVideo.duration > 0 ? (currentTime / selectedVideo.duration) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0d1220]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
              <Play className="w-4 h-4 text-white fill-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Watch & Earn</h1>
              <p className="text-xs text-gray-400">Earn SKY444 just by watching</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 transition-all ${earnAnimation ? "scale-110 border-cyan-400" : ""}`}>
              <Coins className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-bold text-cyan-400">{sessionSky.toFixed(3)} SKY</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-bold text-purple-400">{sessionXp} XP</span>
            </div>
            {streak > 1 && (
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30">
                <Star className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-bold text-orange-400">{streak}x Streak</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Video Player */}
        <div className="lg:col-span-2 space-y-4">
          {/* Video Area */}
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-video group">
            <img
              src={selectedVideo.thumbnail}
              alt={selectedVideo.title}
              className="w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              {!isPlaying && (
                <button
                  onClick={() => setIsPlaying(true)}
                  className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all hover:scale-110"
                >
                  <Play className="w-8 h-8 text-white fill-white ml-1" />
                </button>
              )}
            </div>

            {/* Earning indicator */}
            {isPlaying && (
              <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-600/20 border border-purple-500/40 backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                <span className="text-xs font-bold text-purple-400">EARNING</span>
                <Coins className="w-3 h-3 text-cyan-400" />
                <span className="text-xs text-cyan-400">+{selectedVideo.skyPerMinute * streak}/min</span>
              </div>
            )}

            {/* Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Progress value={progress} className="h-1 mb-3 bg-white/20" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={() => setIsPlaying(p => !p)} className="text-white hover:text-cyan-400 transition-colors">
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                  </button>
                  <button onClick={() => setIsMuted(m => !m)} className="text-white hover:text-cyan-400 transition-colors">
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <span className="text-xs text-gray-300">{formatTime(currentTime)} / {formatTime(selectedVideo.duration)}</span>
                </div>
                <Maximize className="w-5 h-5 text-white hover:text-cyan-400 cursor-pointer transition-colors" />
              </div>
            </div>
          </div>

          {/* Video Info */}
          <div className="bg-[#111827] rounded-2xl p-5 border border-white/5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-1">{selectedVideo.title}</h2>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <span>{selectedVideo.creator}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatViews(selectedVideo.views)}</span>
                  <span>·</span>
                  <Badge variant="outline" className="text-xs border-cyan-500/30 text-cyan-400">{selectedVideo.category}</Badge>
                </div>
              </div>
              <button
                onClick={() => handleLike(selectedVideo.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${likedVideos.has(selectedVideo.id) ? "bg-red-500/20 border-red-500/40 text-red-400" : "border-white/10 text-gray-400 hover:border-red-500/30 hover:text-red-400"}`}
              >
                <Heart className={`w-4 h-4 ${likedVideos.has(selectedVideo.id) ? "fill-current" : ""}`} />
                <span className="text-sm">{formatViews(selectedVideo.likes + (likedVideos.has(selectedVideo.id) ? 1 : 0))}</span>
              </button>
            </div>

            {/* Earn Rate */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3 text-center">
                <Coins className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-cyan-400">{selectedVideo.skyPerMinute * streak}</div>
                <div className="text-xs text-gray-400">SKY/min</div>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 text-center">
                <Zap className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-purple-400">{selectedVideo.xpPerMinute * streak}</div>
                <div className="text-xs text-gray-400">XP/min</div>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 text-center">
                <Clock className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-orange-400">{formatTime(selectedVideo.duration)}</div>
                <div className="text-xs text-gray-400">Duration</div>
              </div>
            </div>
          </div>

          {/* Session Stats */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-5">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              Session Earnings
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-3xl font-black text-cyan-400">{sessionSky.toFixed(3)}</div>
                <div className="text-sm text-gray-400">SKY444 earned this session</div>
              </div>
              <div>
                <div className="text-3xl font-black text-purple-400">{sessionXp}</div>
                <div className="text-sm text-gray-400">XP earned this session</div>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              Total all-time: {totalSkyEarned.toFixed(3)} SKY · {totalXpEarned} XP
            </div>
          </div>
        </div>

        {/* Sidebar — Video List */}
        <div className="space-y-3">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Up Next — Earn More
          </h3>
          {FEATURED_VIDEOS.map(video => (
            <button
              key={video.id}
              onClick={() => handleVideoSelect(video)}
              className={`w-full text-left rounded-xl overflow-hidden border transition-all hover:border-cyan-500/40 ${selectedVideo.id === video.id ? "border-cyan-500/60 bg-cyan-500/5" : "border-white/5 bg-[#111827]"}`}
            >
              <div className="flex gap-3 p-3">
                <div className="relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                  <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                    {formatTime(video.duration)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-2 leading-tight">{video.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{video.creator}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-cyan-400 flex items-center gap-1">
                      <Coins className="w-3 h-3" />{video.skyPerMinute}/min
                    </span>
                    <span className="text-xs text-purple-400 flex items-center gap-1">
                      <Zap className="w-3 h-3" />{video.xpPerMinute} XP
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}

          {/* How it works */}
          <div className="bg-[#111827] border border-white/5 rounded-2xl p-4 mt-4">
            <h4 className="font-bold mb-3 flex items-center gap-2">
              <Gift className="w-4 h-4 text-yellow-400" />
              How You Earn
            </h4>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</div>
                <span>Watch any video — earn SKY444 every minute</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</div>
                <span>Answer puzzle questions for bonus SKY444</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</div>
                <span>Build a streak to multiply your earnings up to 5x</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-purple-600/20 text-purple-400 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">4</div>
                <span>Withdraw or stake your SKY444 anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Puzzle Modal */}
      {showPuzzle && currentPuzzle && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111827] border border-cyan-500/30 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Bonus Puzzle!</h3>
                <p className="text-sm text-gray-400">Answer correctly for +{currentPuzzle.reward} XP & +{(currentPuzzle.reward * 0.01).toFixed(2)} SKY444</p>
              </div>
            </div>
            <p className="text-white font-medium mb-4">{currentPuzzle.question}</p>
            <div className="space-y-2">
              {currentPuzzle.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePuzzleAnswer(idx)}
                  disabled={puzzleAnswered}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                    puzzleAnswered
                      ? idx === currentPuzzle.correct
                        ? "border-purple-500 bg-purple-600/20 text-purple-400"
                        : "border-white/10 text-gray-500"
                      : "border-white/10 hover:border-cyan-500/40 hover:bg-cyan-500/5"
                  }`}
                >
                  <span className="font-medium mr-2">{String.fromCharCode(65 + idx)}.</span>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
