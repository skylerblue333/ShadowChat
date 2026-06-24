import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  DollarSign,
  Users,
  Star,
  Calendar,
  Clock,
  TrendingUp,
  Award,
  MessageSquare,
  Video,
} from "lucide-react";
import { toast } from "sonner";

interface TeachingProfile {
  id: string;
  name: string;
  avatar: string;
  language: string;
  proficiency: string;
  rating: number;
  students: number;
  hourlyRate: number;
  bio: string;
  specialties: string[];
  availability: string;
  certifications: string[];
  reviews: number;
  responseTime: string;
  totalHours: number;
  earnings: number;
}

const MOCK_TEACHERS: TeachingProfile[] = [
  {
    id: "t1",
    name: "李明",
    avatar: "🇨🇳",
    language: "Chinese",
    proficiency: "Native Speaker",
    rating: 4.95,
    students: 156,
    hourlyRate: 25,
    bio: "Professional Chinese teacher with 10+ years experience. Specializing in HSK preparation and conversational fluency.",
    specialties: ["HSK Preparation", "Business Chinese", "Conversational", "Grammar"],
    availability: "Mon-Fri 6-10pm, Sat-Sun all day",
    certifications: ["CTCSOL", "HSK Examiner"],
    reviews: 342,
    responseTime: "< 1 hour",
    totalHours: 2450,
    earnings: 61250,
  },
  {
    id: "t2",
    name: "Maria García",
    avatar: "🇪🇸",
    language: "Spanish",
    proficiency: "Native Speaker",
    rating: 4.88,
    students: 203,
    hourlyRate: 22,
    bio: "Passionate Spanish teacher from Madrid. Expert in DELE exam prep and Latin American Spanish.",
    specialties: ["DELE Exam", "Business Spanish", "Latin American", "Pronunciation"],
    availability: "Daily 3-11pm CET",
    certifications: ["DELE Examiner", "Master's in Education"],
    reviews: 456,
    responseTime: "< 30 min",
    totalHours: 3120,
    earnings: 68640,
  },
  {
    id: "t3",
    name: "Yuki Tanaka",
    avatar: "🇯🇵",
    language: "Japanese",
    proficiency: "Native Speaker",
    rating: 4.92,
    students: 89,
    hourlyRate: 28,
    bio: "Tokyo-based Japanese instructor. Specializing in JLPT preparation and cultural immersion.",
    specialties: ["JLPT Prep", "Kanji Mastery", "Business Japanese", "Cultural Context"],
    availability: "Tue-Sat 7-11pm JST",
    certifications: ["JLPT N1", "Teaching Certificate"],
    reviews: 198,
    responseTime: "< 2 hours",
    totalHours: 1680,
    earnings: 47040,
  },
];

export function TeachingOpportunities() {
  const [activeTab, setActiveTab] = useState("discover");
  const [selectedTeacher, setSelectedTeacher] = useState<TeachingProfile | null>(null);
  const [myProfile, setMyProfile] = useState({
    isTeacher: false,
    language: "English",
    hourlyRate: 20,
    students: 0,
    earnings: 0,
  });

  const handleBookSession = (teacher: TeachingProfile) => {
    toast.success(`Session booked with ${teacher.name}!`);
  };

  const handleBecomeTeacher = () => {
    setMyProfile({ ...myProfile, isTeacher: true });
    toast.success("Welcome to the teaching community!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <BookOpen className="w-10 h-10 text-purple-400" />
            Teaching Opportunities
          </h1>
          <p className="text-gray-400">
            Connect with learners or become a language instructor and earn
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="discover">Discover Teachers</TabsTrigger>
            <TabsTrigger value="myprofile">My Profile</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
          </TabsList>

          {/* Discover Teachers Tab */}
          <TabsContent value="discover" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {MOCK_TEACHERS.map((teacher) => (
                <Card
                  key={teacher.id}
                  className="bg-slate-800/50 border-slate-700 p-6 hover:border-purple-500/50 transition cursor-pointer"
                  onClick={() => setSelectedTeacher(teacher)}
                >
                  {/* Teacher Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-5xl">{teacher.avatar}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-lg">{teacher.name}</h3>
                      <Badge className="bg-purple-500/20 text-purple-300 mb-2">
                        {teacher.language}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-yellow-400 font-bold">{teacher.rating}</span>
                        <span className="text-gray-400 text-sm">({teacher.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-gray-300 text-sm mb-4">{teacher.bio}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-t border-slate-700 pt-4">
                    <div>
                      <p className="text-gray-400 text-xs">Students</p>
                      <p className="text-lg font-bold text-purple-400">{teacher.students}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Hourly Rate</p>
                      <p className="text-lg font-bold text-green-400">${teacher.hourlyRate}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Hours Taught</p>
                      <p className="text-lg font-bold text-blue-400">{teacher.totalHours}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Response Time</p>
                      <p className="text-lg font-bold text-orange-400">{teacher.responseTime}</p>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="mb-4">
                    <p className="text-gray-400 text-xs mb-2">Specialties</p>
                    <div className="flex flex-wrap gap-1">
                      {teacher.specialties.slice(0, 2).map((spec, idx) => (
                        <Badge key={idx} className="bg-slate-700 text-gray-300 text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-purple-600 hover:bg-purple-700 gap-2"
                      onClick={() => handleBookSession(teacher)}
                    >
                      <Video className="w-4 h-4" />
                      Book Session
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setSelectedTeacher(teacher)}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* My Profile Tab */}
          <TabsContent value="myprofile" className="space-y-6">
            {!myProfile.isTeacher ? (
              <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/30 p-8 text-center">
                <BookOpen className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">
                  Become a Language Teacher
                </h2>
                <p className="text-gray-300 mb-6 max-w-md mx-auto">
                  Share your language expertise and earn money by teaching students worldwide.
                  Set your own schedule and rates.
                </p>
                <Button
                  className="bg-purple-600 hover:bg-purple-700 gap-2"
                  onClick={handleBecomeTeacher}
                >
                  <Award className="w-4 h-4" />
                  Get Started as a Teacher
                </Button>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Profile Card */}
                <Card className="bg-slate-800/50 border-slate-700 p-6">
                  <h3 className="font-bold text-white text-xl mb-4">Teaching Profile</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-gray-400 text-sm">Language</label>
                      <p className="text-white font-bold text-lg">{myProfile.language}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Hourly Rate</label>
                      <p className="text-white font-bold text-lg">${myProfile.hourlyRate}/hour</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Active Students</label>
                      <p className="text-white font-bold text-lg">{myProfile.students}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Total Earnings</label>
                      <p className="text-white font-bold text-lg">${myProfile.earnings}</p>
                    </div>
                  </div>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-500/30 p-4">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-8 h-8 text-green-400" />
                      <div>
                        <p className="text-gray-400 text-sm">This Month</p>
                        <p className="text-2xl font-bold text-green-400">$0</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border-blue-500/30 p-4">
                    <div className="flex items-center gap-3">
                      <Users className="w-8 h-8 text-blue-400" />
                      <div>
                        <p className="text-gray-400 text-sm">Students</p>
                        <p className="text-2xl font-bold text-blue-400">{myProfile.students}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500/30 p-4">
                    <div className="flex items-center gap-3">
                      <Star className="w-8 h-8 text-purple-400" />
                      <div>
                        <p className="text-gray-400 text-sm">Rating</p>
                        <p className="text-2xl font-bold text-purple-400">—</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h3 className="font-bold text-white text-xl mb-6">Earnings Dashboard</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-700/50 rounded p-4">
                  <p className="text-gray-400 text-sm mb-1">Total Earnings</p>
                  <p className="text-3xl font-bold text-green-400">$0</p>
                  <p className="text-gray-400 text-xs mt-2">All time</p>
                </div>

                <div className="bg-slate-700/50 rounded p-4">
                  <p className="text-gray-400 text-sm mb-1">This Month</p>
                  <p className="text-3xl font-bold text-blue-400">$0</p>
                  <p className="text-gray-400 text-xs mt-2">0 sessions</p>
                </div>

                <div className="bg-slate-700/50 rounded p-4">
                  <p className="text-gray-400 text-sm mb-1">Pending Payout</p>
                  <p className="text-3xl font-bold text-purple-400">$0</p>
                  <p className="text-gray-400 text-xs mt-2">Next payout: N/A</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-white mb-4">How to Earn More</h4>
                <div className="space-y-3">
                  {[
                    { title: "Complete Your Profile", desc: "Add certifications and specialties", progress: 40 },
                    { title: "Get Your First Review", desc: "Complete 5 sessions to unlock reviews", progress: 0 },
                    { title: "Build Your Reputation", desc: "Maintain 4.5+ rating for premium badge", progress: 0 },
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between mb-2">
                        <span className="text-white font-bold">{item.title}</span>
                        <span className="text-gray-400 text-sm">{item.progress}%</span>
                      </div>
                      <Progress value={item.progress} className="h-2" />
                      <p className="text-gray-400 text-xs mt-1">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Teacher Detail Modal */}
        {selectedTeacher && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="bg-slate-800 border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4">
                    <div className="text-6xl">{selectedTeacher.avatar}</div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedTeacher.name}</h2>
                      <p className="text-gray-400">{selectedTeacher.proficiency}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-yellow-400 font-bold">{selectedTeacher.rating}</span>
                        <span className="text-gray-400">({selectedTeacher.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedTeacher(null)}
                    className="text-gray-400"
                  >
                    ✕
                  </Button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-white mb-2">About</h3>
                    <p className="text-gray-300">{selectedTeacher.bio}</p>
                  </div>

                  <div>
                    <h3 className="font-bold text-white mb-2">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTeacher.specialties.map((spec, idx) => (
                        <Badge key={idx} className="bg-purple-500/20 text-purple-300">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-white mb-2">Certifications</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTeacher.certifications.map((cert, idx) => (
                        <Badge key={idx} className="bg-green-500/20 text-green-300">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-700/50 rounded p-4">
                      <p className="text-gray-400 text-sm">Availability</p>
                      <p className="text-white font-bold text-sm mt-1">
                        {selectedTeacher.availability}
                      </p>
                    </div>
                    <div className="bg-slate-700/50 rounded p-4">
                      <p className="text-gray-400 text-sm">Response Time</p>
                      <p className="text-white font-bold text-sm mt-1">
                        {selectedTeacher.responseTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-slate-700">
                    <Button
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                      onClick={() => {
                        handleBookSession(selectedTeacher);
                        setSelectedTeacher(null);
                      }}
                    >
                      Book a Session
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Send Message
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeachingOpportunities;
