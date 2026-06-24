import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Globe,
  TrendingUp,
  Users,
  MessageSquare,
  Video,
  Award,
  Zap,
  Target,
  Activity,
  Download,
} from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalSessions: number;
  totalHours: number;
  totalTranslations: number;
  averageRating: number;
  languagesSupported: number;
  translationAccuracy: number;
}

interface LanguageStats {
  language: string;
  learners: number;
  teachers: number;
  sessions: number;
  avgRating: number;
}

const MOCK_STATS: DashboardStats = {
  totalUsers: 12847,
  activeUsers: 3456,
  totalSessions: 45230,
  totalHours: 89450,
  totalTranslations: 234567,
  averageRating: 4.7,
  languagesSupported: 42,
  translationAccuracy: 94.2,
};

const LANGUAGE_STATS: LanguageStats[] = [
  { language: "Chinese", learners: 2345, teachers: 456, sessions: 5234, avgRating: 4.8 },
  { language: "Spanish", learners: 3456, teachers: 678, sessions: 6789, avgRating: 4.7 },
  { language: "Japanese", learners: 1234, teachers: 234, sessions: 3456, avgRating: 4.6 },
  { language: "French", learners: 2567, teachers: 345, sessions: 4567, avgRating: 4.8 },
  { language: "German", learners: 1456, teachers: 234, sessions: 2345, avgRating: 4.5 },
  { language: "Korean", learners: 1789, teachers: 289, sessions: 3234, avgRating: 4.7 },
];

const ACTIVITY_DATA = [
  { date: "Mon", sessions: 234, translations: 1200, users: 456 },
  { date: "Tue", sessions: 289, translations: 1450, users: 523 },
  { date: "Wed", sessions: 245, translations: 1100, users: 478 },
  { date: "Thu", sessions: 312, translations: 1680, users: 589 },
  { date: "Fri", sessions: 378, translations: 2100, users: 678 },
  { date: "Sat", sessions: 456, translations: 2450, users: 789 },
  { date: "Sun", sessions: 389, translations: 2000, users: 645 },
];

const LANGUAGE_DISTRIBUTION = [
  { name: "Chinese", value: 2345, color: "#8b5cf6" },
  { name: "Spanish", value: 3456, color: "#3b82f6" },
  { name: "Japanese", value: 1234, color: "#ec4899" },
  { name: "French", value: 2567, color: "#10b981" },
  { name: "Others", value: 3245, color: "#f59e0b" },
];

export function UnifiedPlatformDashboard() {
  const [dateRange, setDateRange] = useState("week");
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Globe className="w-10 h-10 text-purple-400" />
              Platform Dashboard
            </h1>
            <p className="text-gray-400">
              Global language exchange platform analytics and insights
            </p>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700 gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Users</p>
                <p className="text-3xl font-bold text-purple-400">
                  {MOCK_STATS.totalUsers.toLocaleString()}
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  {MOCK_STATS.activeUsers.toLocaleString()} active
                </p>
              </div>
              <Users className="w-10 h-10 text-purple-400 opacity-50" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border-blue-500/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Sessions</p>
                <p className="text-3xl font-bold text-blue-400">
                  {MOCK_STATS.totalSessions.toLocaleString()}
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  {MOCK_STATS.totalHours.toLocaleString()} hours
                </p>
              </div>
              <Activity className="w-10 h-10 text-blue-400 opacity-50" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-500/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Translations</p>
                <p className="text-3xl font-bold text-green-400">
                  {(MOCK_STATS.totalTranslations / 1000).toFixed(0)}K
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  {MOCK_STATS.translationAccuracy.toFixed(1)}% accuracy
                </p>
              </div>
              <Globe className="w-10 h-10 text-green-400 opacity-50" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border-yellow-500/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Avg Rating</p>
                <p className="text-3xl font-bold text-yellow-400">
                  {MOCK_STATS.averageRating.toFixed(1)}
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  {MOCK_STATS.languagesSupported} languages
                </p>
              </div>
              <Award className="w-10 h-10 text-yellow-400 opacity-50" />
            </div>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="activity" className="mb-8">
          <TabsList className="bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="languages">Languages</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h3 className="font-bold text-white mb-4">Weekly Activity</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ACTIVITY_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #4b5563",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="sessions" fill="#8b5cf6" name="Sessions" />
                  <Bar dataKey="translations" fill="#3b82f6" name="Translations" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h3 className="font-bold text-white mb-4">User Growth</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={ACTIVITY_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #4b5563",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#10b981"
                    name="Active Users"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          {/* Languages Tab */}
          <TabsContent value="languages" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700 p-6">
                <h3 className="font-bold text-white mb-4">Language Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={LANGUAGE_DISTRIBUTION}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {LANGUAGE_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #4b5563",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 p-6">
                <h3 className="font-bold text-white mb-4">Language Rankings</h3>
                <div className="space-y-4">
                  {LANGUAGE_STATS.map((lang, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-white">{lang.language}</span>
                        <Badge className="bg-purple-500/20 text-purple-300">
                          {lang.sessions} sessions
                        </Badge>
                      </div>
                      <Progress value={(lang.learners / 3500) * 100} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>{lang.learners} learners</span>
                        <span>⭐ {lang.avgRating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700 p-6">
                <h3 className="font-bold text-white mb-4">Translation Accuracy</h3>
                <div className="space-y-4">
                  {[
                    { lang: "Chinese", accuracy: 96.2 },
                    { lang: "Spanish", accuracy: 94.8 },
                    { lang: "Japanese", accuracy: 92.1 },
                    { lang: "French", accuracy: 95.3 },
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between mb-2">
                        <span className="text-white text-sm">{item.lang}</span>
                        <span className="text-purple-400 font-bold">
                          {item.accuracy}%
                        </span>
                      </div>
                      <Progress value={item.accuracy} className="h-2" />
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 p-6">
                <h3 className="font-bold text-white mb-4">System Health</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-white text-sm">API Response Time</span>
                      <span className="text-green-400 font-bold">45ms</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-white text-sm">Server Uptime</span>
                      <span className="text-green-400 font-bold">99.9%</span>
                    </div>
                    <Progress value={99.9} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-white text-sm">Database Health</span>
                      <span className="text-green-400 font-bold">98.5%</span>
                    </div>
                    <Progress value={98.5} className="h-2" />
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Top Performers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              Top Teachers
            </h3>
            <div className="space-y-3">
              {[
                { name: "李明", rating: 4.95, sessions: 456 },
                { name: "Maria García", rating: 4.92, sessions: 389 },
                { name: "Yuki Tanaka", rating: 4.88, sessions: 234 },
              ].map((teacher, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-700/50 rounded">
                  <div>
                    <p className="font-bold text-white">{teacher.name}</p>
                    <p className="text-gray-400 text-xs">{teacher.sessions} sessions</p>
                  </div>
                  <Badge className="bg-yellow-500/20 text-yellow-400">
                    ⭐ {teacher.rating}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-400" />
              Recent Milestones
            </h3>
            <div className="space-y-3">
              {[
                { milestone: "1M translations completed", date: "Today" },
                { milestone: "50K active users reached", date: "Yesterday" },
                { milestone: "100 languages supported", date: "Last week" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-700/50 rounded">
                  <div>
                    <p className="font-bold text-white text-sm">{item.milestone}</p>
                    <p className="text-gray-400 text-xs">{item.date}</p>
                  </div>
                  <Award className="w-5 h-5 text-yellow-400" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default UnifiedPlatformDashboard;
