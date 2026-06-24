import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MessageSquare, TrendingUp, Users, Zap, AlertCircle, CheckCircle } from 'lucide-react';
export default function FeedbackHub() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock feedback data
  const feedbackData = [
    { id: 1, category: 'feature', sentiment: 'positive', text: 'Love the new gamification system!', author: 'User123', date: '2 hours ago', votes: 45 },
    { id: 2, category: 'bug', sentiment: 'negative', text: 'Spin wheel not loading on mobile', author: 'User456', date: '4 hours ago', votes: 23 },
    { id: 3, category: 'feature', sentiment: 'positive', text: 'Battle Pass progression feels rewarding', author: 'User789', date: '6 hours ago', votes: 67 },
    { id: 4, category: 'performance', sentiment: 'negative', text: 'App crashes on slow connections', author: 'User321', date: '8 hours ago', votes: 34 },
    { id: 5, category: 'feature', sentiment: 'positive', text: 'Referral system is amazing!', author: 'User654', date: '10 hours ago', votes: 89 },
  ];

  // Sentiment analysis data
  const sentimentData = [
    { name: 'Positive', value: 65, fill: '#10b981' },
    { name: 'Neutral', value: 20, fill: '#6b7280' },
    { name: 'Negative', value: 15, fill: '#ef4444' },
  ];

  // Feedback trend data
  const trendData = [
    { date: 'Mon', feedback: 120, actionable: 45 },
    { date: 'Tue', feedback: 150, actionable: 52 },
    { date: 'Wed', feedback: 180, actionable: 68 },
    { date: 'Thu', feedback: 165, actionable: 61 },
    { date: 'Fri', feedback: 210, actionable: 79 },
    { date: 'Sat', feedback: 195, actionable: 73 },
    { date: 'Sun', feedback: 240, actionable: 89 },
  ];

  // Category breakdown
  const categoryData = [
    { name: 'Feature Requests', value: 45, color: '#3b82f6' },
    { name: 'Bug Reports', value: 25, color: '#ef4444' },
    { name: 'Performance', value: 15, color: '#f59e0b' },
    { name: 'UX/Design', value: 10, color: '#8b5cf6' },
    { name: 'Other', value: 5, color: '#6b7280' },
  ];

  const filteredFeedback = selectedCategory === 'all' 
    ? feedbackData 
    : feedbackData.filter((f: any) => f.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">Feedback Hub</h1>
          </div>
          <p className="text-gray-400">Real-time feedback collection, analysis, and auto-update system</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Total Feedback</p>
                <p className="text-3xl font-bold text-white">1,247</p>
                <p className="text-xs text-green-400">+12% this week</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Actionable Items</p>
                <p className="text-3xl font-bold text-white">467</p>
                <p className="text-xs text-blue-400">37.5% of total</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Sentiment Score</p>
                <p className="text-3xl font-bold text-white">7.2/10</p>
                <p className="text-xs text-green-400">+0.5 this month</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Response Rate</p>
                <p className="text-3xl font-bold text-white">94%</p>
                <p className="text-xs text-green-400">+3% this week</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Feedback Trend */}
          <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Feedback Trend</CardTitle>
              <CardDescription>Weekly feedback volume and actionable items</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="feedback" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="actionable" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Sentiment Distribution */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Sentiment</CardTitle>
              <CardDescription>Overall sentiment distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name} ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                    labelStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Feedback by Category</CardTitle>
            <CardDescription>Distribution of feedback across categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Feedback List */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Feedback</CardTitle>
            <CardDescription>Latest feedback from users</CardDescription>
            <Tabs defaultValue="all" className="mt-4">
              <TabsList className="bg-slate-700">
                <TabsTrigger value="all" onClick={() => setSelectedCategory('all')}>All</TabsTrigger>
                <TabsTrigger value="feature" onClick={() => setSelectedCategory('feature')}>Features</TabsTrigger>
                <TabsTrigger value="bug" onClick={() => setSelectedCategory('bug')}>Bugs</TabsTrigger>
                <TabsTrigger value="performance" onClick={() => setSelectedCategory('performance')}>Performance</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredFeedback.map(feedback => (
              <div key={feedback.id} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600 hover:border-slate-500 transition">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline"
                      className={feedback.sentiment === 'positive' ? 'border-green-500 text-green-400' : 'border-red-500 text-red-400'}
                    >
                      {feedback.sentiment === 'positive' ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                      {feedback.sentiment}
                    </Badge>
                    <Badge variant="secondary">{feedback.category}</Badge>
                  </div>
                  <span className="text-sm text-gray-400">{feedback.date}</span>
                </div>
                <p className="text-white mb-2">{feedback.text}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">by {feedback.author}</span>
                  <div className="flex items-center gap-2 text-purple-400">
                    <TrendingUp className="w-4 h-4" />
                    <span>{feedback.votes} votes</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Auto-Update Actions */}
        <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Auto-Update System
            </CardTitle>
            <CardDescription>Automatic actions triggered by feedback patterns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-slate-700/50 rounded border border-slate-600">
              <p className="text-sm text-white font-medium">✓ Identified 23 actionable patterns this week</p>
              <p className="text-xs text-gray-400 mt-1">Patterns automatically routed to product team</p>
            </div>
            <div className="p-3 bg-slate-700/50 rounded border border-slate-600">
              <p className="text-sm text-white font-medium">✓ Scheduled 5 A/B tests based on feedback</p>
              <p className="text-xs text-gray-400 mt-1">Tests will run for 7 days starting tomorrow</p>
            </div>
            <div className="p-3 bg-slate-700/50 rounded border border-slate-600">
              <p className="text-sm text-white font-medium">✓ Generated 3 feature recommendations</p>
              <p className="text-xs text-gray-400 mt-1">Ready for product review and prioritization</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
