import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, MessageCircle, Heart, MapPin, Clock, Zap, Video, MessageSquare } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Partner {
  id: string;
  name: string;
  nativeLang: string;
  learningLang: string;
  proficiency: string;
  bio: string;
  avatar: string;
  responseTime: string;
  sessionsCompleted: number;
  rating: number;
  availability: string;
  interests: string[];
  location: string;
  age: number;
  joinedDate: string;
  videoUrl?: string;
}

const INTERESTS = [
  "Gaming",
  "Charity",
  "Collaborative Projects",
  "Travel",
  "Technology",
  "Business",
  "Art & Design",
  "Music",
  "Sports",
  "Cooking",
  "Fitness",
  "Education",
  "Entrepreneurship",
  "Open Source",
];

// Fallback mock data for initial load
const MOCK_PARTNERS: Partner[] = [
  {
    id: "p1",
    name: "李明",
    nativeLang: "Chinese",
    learningLang: "English",
    proficiency: "B2",
    bio: "Native Mandarin speaker, love teaching and gaming!",
    avatar: "🇨🇳",
    responseTime: "< 1 hour",
    sessionsCompleted: 42,
    rating: 4.9,
    availability: "weekends",
    interests: ["Gaming", "Technology", "Collaborative Projects"],
    location: "Shanghai, China",
    age: 28,
    joinedDate: "2024-01-15",
  },
  {
    id: "p2",
    name: "Maria García",
    nativeLang: "Spanish",
    learningLang: "English",
    proficiency: "C1",
    bio: "Professional tutor passionate about charity work",
    avatar: "🇪🇸",
    responseTime: "< 30 min",
    sessionsCompleted: 156,
    rating: 4.95,
    availability: "daily",
    interests: ["Charity", "Education", "Travel"],
    location: "Madrid, Spain",
    age: 32,
    joinedDate: "2023-06-20",
  },
  {
    id: "p3",
    name: "Yuki Tanaka",
    nativeLang: "Japanese",
    learningLang: "English",
    proficiency: "B1",
    bio: "Tech enthusiast, love collaborative projects",
    avatar: "🇯🇵",
    responseTime: "< 2 hours",
    sessionsCompleted: 18,
    rating: 4.8,
    availability: "evenings",
    interests: ["Technology", "Collaborative Projects", "Gaming"],
    location: "Tokyo, Japan",
    age: 25,
    joinedDate: "2024-03-10",
  },
  {
    id: "p4",
    name: "Pierre Dubois",
    nativeLang: "French",
    learningLang: "Chinese",
    proficiency: "A2",
    bio: "Entrepreneur learning Chinese for business",
    avatar: "🇫🇷",
    responseTime: "< 1 hour",
    sessionsCompleted: 7,
    rating: 4.7,
    availability: "flexible",
    interests: ["Business", "Entrepreneurship", "Technology"],
    location: "Paris, France",
    age: 35,
    joinedDate: "2024-02-01",
  },
  {
    id: "p5",
    name: "한지민",
    nativeLang: "Korean",
    learningLang: "English",
    proficiency: "B2",
    bio: "Artist and designer, open source contributor",
    avatar: "🇰🇷",
    responseTime: "< 45 min",
    sessionsCompleted: 34,
    rating: 4.85,
    availability: "weekdays",
    interests: ["Art & Design", "Open Source", "Technology"],
    location: "Seoul, South Korea",
    age: 27,
    joinedDate: "2023-11-05",
  },
  {
    id: "p6",
    name: "Amara Okonkwo",
    nativeLang: "English",
    learningLang: "Spanish",
    proficiency: "A1",
    bio: "Fitness trainer interested in charity work",
    avatar: "🇳🇬",
    responseTime: "< 3 hours",
    sessionsCompleted: 12,
    rating: 4.6,
    availability: "mornings",
    interests: ["Fitness", "Charity", "Sports"],
    location: "Lagos, Nigeria",
    age: 29,
    joinedDate: "2024-04-12",
  },
  {
    id: "p7",
    name: "Marco Rossi",
    nativeLang: "Italian",
    learningLang: "English",
    proficiency: "B1",
    bio: "Chef and food enthusiast, love cooking together",
    avatar: "🇮🇹",
    responseTime: "< 1 hour",
    sessionsCompleted: 28,
    rating: 4.75,
    availability: "evenings",
    interests: ["Cooking", "Travel", "Music"],
    location: "Rome, Italy",
    age: 31,
    joinedDate: "2023-09-22",
  },
  {
    id: "p8",
    name: "Sofia Novak",
    nativeLang: "Russian",
    learningLang: "English",
    proficiency: "B2",
    bio: "Software engineer, love collaborative coding projects",
    avatar: "🇷🇺",
    responseTime: "< 2 hours",
    sessionsCompleted: 51,
    rating: 4.88,
    availability: "flexible",
    interests: ["Technology", "Open Source", "Collaborative Projects"],
    location: "Moscow, Russia",
    age: 26,
    joinedDate: "2023-12-01",
  },
];

export default function LanguagePartnerDiscovery() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [proficiencyFilter, setProficiencyFilter] = useState<string[]>([]);
  const [availabilityFilter, setAvailabilityFilter] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"rating" | "recent" | "responsive">("rating");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [showVideoPreview, setShowVideoPreview] = useState(false);

  // Fetch real partners from tRPC
  const { data: realPartners = MOCK_PARTNERS, isLoading } = trpc.languageExchange.getPartners.useQuery({}, {
    retry: 1,
    staleTime: 60000,
  });

  // Fetch saved favorites
  const { data: savedFavorites = [] } = trpc.languageExchange.getFavorites.useQuery(undefined, {
    retry: 1,
  });

  // Wire mutations
  const connectMutation = trpc.languageExchange.requestSession.useMutation();
  const saveFavoriteMutation = trpc.languageExchange.saveFavorite.useMutation();
  const removeFavoriteMutation = trpc.languageExchange.removeFavorite.useMutation();

  // Sync favorites from DB
  React.useEffect(() => {
    if (Array.isArray(savedFavorites) && savedFavorites.length > 0) {
      setFavorites(new Set(savedFavorites.map((f: any) => f.partnerId)));
    }
  }, [savedFavorites]);

  // Filter and sort partners
  const filteredPartners = useMemo(() => {
    let result = realPartners;

    // Search by name or bio
    if (searchTerm) {
      result = result.filter(
        (p: Partner) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.bio.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by interests
    if (selectedInterests.length > 0) {
      result = result.filter((p: Partner) =>
        selectedInterests.some(interest => p.interests.includes(interest))
      );
    }

    // Filter by proficiency
    if (proficiencyFilter.length > 0) {
      result = result.filter((p: Partner) => proficiencyFilter.includes(p.proficiency));
    }

    // Filter by availability
    if (availabilityFilter.length > 0) {
      result = result.filter((p: Partner) => availabilityFilter.includes(p.availability));
    }

    // Sort
    if (sortBy === "rating") {
      result.sort((a: Partner, b: Partner) => b.rating - a.rating);
    } else if (sortBy === "recent") {
      result.sort(
        (a: Partner, b: Partner) =>
          new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime()
      );
    } else if (sortBy === "responsive") {
      const timeOrder: Record<string, number> = { "< 30 min": 0, "< 1 hour": 1, "< 2 hours": 2, "< 3 hours": 3 };
      result.sort(
        (a: Partner, b: Partner) =>
          (timeOrder[a.responseTime as keyof typeof timeOrder] || 999) -
          (timeOrder[b.responseTime as keyof typeof timeOrder] || 999)
      );
    }

    return result;
  }, [searchTerm, selectedInterests, proficiencyFilter, availabilityFilter, sortBy, realPartners]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const toggleFavorite = (partnerId: string) => {
    if (favorites.has(partnerId)) {
      removeFavoriteMutation.mutate({ partnerId }, {
        onSuccess: () => {
          setFavorites(prev => {
            const newSet = new Set(prev);
            newSet.delete(partnerId);
            return newSet;
          });
          toast.success("Removed from favorites");
        },
        onError: () => {
          toast.error("Failed to remove favorite");
        },
      });
    } else {
      saveFavoriteMutation.mutate({ partnerId }, {
        onSuccess: () => {
          setFavorites(prev => new Set([...prev, partnerId]));
          toast.success("Added to favorites");
        },
        onError: () => {
          toast.error("Failed to add favorite");
        },
      });
    }
  };

  const handleConnect = (partner: Partner) => {
    connectMutation.mutate(
      { partnerId: partner.id },
      {
        onSuccess: () => {
          toast.success(`Connection request sent to ${partner.name}!`);
        },
        onError: () => {
          toast.error("Failed to send connection request");
        },
      }
    );
  };

  const handleMessage = (partner: Partner) => {
    navigate(`/messages/${partner.id}`);
  };

  const handleVideoChat = (partner: Partner) => {
    navigate(`/video-chat/${partner.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-purple-300">Loading partners...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-950 p-4 md:p-8">
        {/* Hero Section */}
        <div className="mb-8 text-center animate-fade-in">
          <h1 className="text-5xl font-black mb-2 rainbow-text">
            Find Your Language Partner
          </h1>
          <p className="text-xl text-purple-200 mb-6">
            Connect with people who share your interests and learning goals
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Filters Section */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            {/* Left Sidebar - Filters */}
            <div className="lg:col-span-1">
              <Card className="bg-slate-900/80 border-purple-500/30 p-6 sticky top-4">
                <h2 className="text-lg font-bold text-white mb-4">Filters</h2>

                {/* Search */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-purple-200 mb-2 block">
                    Search
                  </label>
                  <Input
                    placeholder="Name or bio..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="bg-slate-800 border-purple-500/30 text-white"
                  />
                </div>

                {/* Sort */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-purple-200 mb-2 block">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as any)}
                    className="w-full bg-slate-800 border border-purple-500/30 text-white px-3 py-2 rounded-lg"
                  >
                    <option value="rating">Highest Rating</option>
                    <option value="responsive">Most Responsive</option>
                    <option value="recent">Recently Joined</option>
                  </select>
                </div>

                {/* Proficiency */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-purple-200 mb-3 block">
                    Proficiency Level
                  </label>
                  <div className="space-y-2">
                    {["A1", "A2", "B1", "B2", "C1", "C2"].map(level => (
                      <label key={level} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={proficiencyFilter.includes(level)}
                          onCheckedChange={() => {
                            setProficiencyFilter(prev =>
                              prev.includes(level)
                                ? prev.filter(l => l !== level)
                                : [...prev, level]
                            );
                          }}
                          className="border-purple-500"
                        />
                        <span className="text-sm text-purple-100">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-purple-200 mb-3 block">
                    Availability
                  </label>
                  <div className="space-y-2">
                    {["mornings", "evenings", "weekdays", "weekends", "flexible"].map(avail => (
                      <label key={avail} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={availabilityFilter.includes(avail)}
                          onCheckedChange={() => {
                            setAvailabilityFilter(prev =>
                              prev.includes(avail)
                                ? prev.filter(a => a !== avail)
                                : [...prev, avail]
                            );
                          }}
                          className="border-purple-500"
                        />
                        <span className="text-sm text-purple-100 capitalize">{avail}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {(selectedInterests.length > 0 ||
                  proficiencyFilter.length > 0 ||
                  availabilityFilter.length > 0 ||
                  searchTerm) && (
                  <Button
                    variant="outline"
                    className="w-full text-purple-300 border-purple-500/50 hover:bg-purple-500/10"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedInterests([]);
                      setProficiencyFilter([]);
                      setAvailabilityFilter([]);
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </Card>
            </div>

            {/* Right Content - Partners */}
            <div className="lg:col-span-3">
              {/* Shared Interests Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-purple-200 mb-3 uppercase tracking-wider">
                  Shared Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map(interest => (
                    <Badge
                      key={interest}
                      variant={selectedInterests.includes(interest) ? "default" : "outline"}
                      className={`cursor-pointer transition-all ${
                        selectedInterests.includes(interest)
                          ? "bg-purple-600 border-purple-500"
                          : "border-purple-500/30 text-purple-300 hover:border-purple-500"
                      }`}
                      onClick={() => toggleInterest(interest)}
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Results Count */}
              <div className="mb-4 text-sm text-purple-300">
                Showing {filteredPartners.length} partner{filteredPartners.length !== 1 ? "s" : ""}
              </div>

              {/* Partner Cards Grid */}
              {filteredPartners.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredPartners.map((partner: Partner) => (
                    <Card
                      key={partner.id}
                      className="bg-gradient-to-br from-slate-800/80 to-purple-900/40 border-purple-500/30 hover:border-purple-400/60 transition-all hover:shadow-lg hover:shadow-purple-500/20 overflow-hidden group"
                    >
                      <div className="p-5">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="text-4xl">{partner.avatar}</div>
                            <div>
                              <h3 className="font-bold text-white text-lg">{partner.name}</h3>
                              <p className="text-xs text-purple-300">
                                {partner.nativeLang} → {partner.learningLang}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => toggleFavorite(partner.id)}
                            className="text-purple-300 hover:text-red-400 transition-colors"
                            disabled={saveFavoriteMutation.isPending || removeFavoriteMutation.isPending}
                          >
                            <Heart
                              size={20}
                              fill={favorites.has(partner.id) ? "currentColor" : "none"}
                            />
                          </button>
                        </div>

                        {/* Bio */}
                        <p className="text-sm text-purple-200 mb-4">{partner.bio}</p>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                          <div className="bg-slate-900/50 rounded p-2">
                            <div className="flex items-center gap-1 text-yellow-400 mb-1">
                              <Star size={14} fill="currentColor" />
                              <span className="font-bold">{partner.rating}</span>
                            </div>
                            <div className="text-purple-300">{partner.sessionsCompleted} sessions</div>
                          </div>
                          <div className="bg-slate-900/50 rounded p-2">
                            <div className="flex items-center gap-1 text-cyan-400 mb-1">
                              <Clock size={14} />
                              <span className="font-bold">{partner.responseTime}</span>
                            </div>
                            <div className="text-purple-300 capitalize">{partner.availability}</div>
                          </div>
                          <div className="bg-slate-900/50 rounded p-2">
                            <div className="flex items-center gap-1 text-green-400 mb-1">
                              <Zap size={14} />
                              <span className="font-bold">{partner.proficiency}</span>
                            </div>
                            <div className="text-purple-300">Proficiency</div>
                          </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-2 text-xs text-purple-300 mb-4">
                          <MapPin size={14} />
                          <span>{partner.location}</span>
                        </div>

                        {/* Interests */}
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {partner.interests.map((interest: string) => (
                              <Badge
                                key={interest}
                                variant="secondary"
                                className="text-xs bg-purple-500/20 text-purple-200 border-purple-500/30"
                              >
                                {interest}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Button
                            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                            size="sm"
                            onClick={() => handleConnect(partner)}
                            disabled={connectMutation.isPending}
                          >
                            <MessageCircle size={16} className="mr-2" />
                            Connect
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1 border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
                            size="sm"
                            onClick={() => {
                              setSelectedPartner(partner);
                              setShowVideoPreview(true);
                            }}
                          >
                            View Profile
                          </Button>
                        </div>

                        {/* Quick Action Buttons */}
                        <div className="flex gap-2 mt-3 pt-3 border-t border-purple-500/20">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="flex-1 text-xs text-purple-300 hover:bg-purple-500/10"
                            onClick={() => handleMessage(partner)}
                          >
                            <MessageSquare size={14} className="mr-1" />
                            Message
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="flex-1 text-xs text-purple-300 hover:bg-purple-500/10"
                            onClick={() => handleVideoChat(partner)}
                          >
                            <Video size={14} className="mr-1" />
                            Video Chat
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-slate-900/80 border-purple-500/30 p-12 text-center">
                  <p className="text-purple-300 mb-4">No partners match your filters</p>
                  <Button
                    variant="outline"
                    className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedInterests([]);
                      setProficiencyFilter([]);
                      setAvailabilityFilter([]);
                    }}
                  >
                    Clear Filters and Try Again
                  </Button>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Video Preview Modal */}
      {selectedPartner && (
        <Dialog open={showVideoPreview} onOpenChange={setShowVideoPreview}>
          <DialogContent className="bg-slate-900 border-purple-500/30 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white">{selectedPartner.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Video Preview */}
              {selectedPartner.videoUrl && (
                <video
                  src={selectedPartner.videoUrl}
                  controls
                  className="w-full rounded-lg bg-slate-800"
                />
              )}

              {/* Partner Details */}
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-purple-300 font-semibold mb-1">About</p>
                  <p className="text-purple-200">{selectedPartner.bio}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-800 p-2 rounded">
                    <p className="text-purple-400 text-xs">Proficiency</p>
                    <p className="text-white font-bold">{selectedPartner.proficiency}</p>
                  </div>
                  <div className="bg-slate-800 p-2 rounded">
                    <p className="text-purple-400 text-xs">Rating</p>
                    <p className="text-white font-bold">{selectedPartner.rating} ⭐</p>
                  </div>
                </div>
                <div className="bg-slate-800 p-2 rounded">
                  <p className="text-purple-400 text-xs mb-1">Interests</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedPartner.interests.map(interest => (
                      <Badge key={interest} variant="secondary" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                  onClick={() => {
                    handleConnect(selectedPartner);
                    setShowVideoPreview(false);
                  }}
                >
                  Connect
                </Button>
                <Button
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700"
                  onClick={() => {
                    handleVideoChat(selectedPartner);
                    setShowVideoPreview(false);
                  }}
                >
                  <Video size={16} className="mr-2" />
                  Video Chat
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
