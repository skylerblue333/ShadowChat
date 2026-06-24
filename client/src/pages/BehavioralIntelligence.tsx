import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, TrendingDown, AlertTriangle, CheckCircle, Brain, Zap } from 'lucide-react';

export default function BehavioralIntelligence() {
  const [selectedSegment, setSelectedSegment] = useState('all');

  // User segments
  const segments = [
    {
      id: 'high-value',
      name: 'High-Value Users',
      count: 2450,
      churnRisk: 0.05,
      ltv: 850,
      sentiment: 0.92,
      behaviors: ['Daily active', 'High engagement', 'Premium subscribers', 'Referral drivers'],
    },
    {
      id: 'growth-potential',
      name: 'Growth Potential',
      count: 8750,
      churnRisk: 0.15,
      ltv: 350,
      sentiment: 0.78,
      behaviors: ['Weekly active', 'Moderate engagement', 'Trial users', 'Feature explorers'],
    },
    {
      id: 'at-risk',
      name: 'At-Risk Users',
      count: 1200,
      churnRisk: 0.65,
      ltv: 120,
      sentiment: 0.42,
      behaviors: ['Declining activity', 'Low engagement', 'Inactive for 2+ weeks', 'Support issues'],
    },
    {
      id: 'dormant',
      name: 'Dormant Users',
      count: 3500,
      churnRisk: 0.92,
      ltv: 0,
      sentiment: 0.15,
      behaviors: ['No activity', 'Inactive for 30+ days', 'No purchases', 'No interactions'],
    },
  ];

  // Churn prediction data
  const churnData = [
    { week: 'Week 1', predicted: 2.3, actual: 2.1, accuracy: 0.91 },
    { week: 'Week 2', predicted: 2.8, actual: 2.9, accuracy: 0.93 },
    { week: 'Week 3', predicted: 2.1, actual: 2.0, accuracy: 0.95 },
    { week: 'Week 4', predicted: 3.2, actual: 3.4, accuracy: 0.92 },
    { week: 'Week 5', predicted: 2.5, actual: 2.6, accuracy: 0.94 },
  ];

  // Engagement metrics
  const engagementData = [
    { segment: 'High-Value', engagement: 92, retention: 95, ltv: 850 },
    { segment: 'Growth', engagement: 65, retention: 78, ltv: 350 },
    { segment: 'At-Risk', engagement: 25, retention: 35, ltv: 120 },
    { segment: 'Dormant', engagement: 5, retention: 8, ltv: 0 },
  ];

  // Sentiment distribution
  const sentimentData = [
    { name: 'Very Positive', value: 35, fill: '#10b981' },
    { name: 'Positive', value: 42, fill: '#3b82f6' },
    { name: 'Neutral', value: 15, fill: '#6b7280' },
    { name: 'Negative', value: 6, fill: '#ef4444' },
    { name: 'Very Negative', value: 2, fill: '#991b1b' },
  ];

  // Churn risk factors
  const churnFactors = [
    { factor: 'No activity 2+ weeks', impact: 0.45 },
    { factor: 'Support tickets', impact: 0.38 },
    { factor: 'Feature abandonment', impact: 0.32 },
    { factor: 'Engagement drop', impact: 0.28 },
    { factor: 'Payment issues', impact: 0.25 },
  ];

  const selectedSegmentData = segments.find(s => s.id === selectedSegment);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-cyan-400" />
            <h1 className="text-4xl font-bold text-white">Behavioral Intelligence</h1>
          </div>
          <p className="text-gray-400">User research, churn detection, and behavioral analysis</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Total Users</p>
                <p className="text-3xl font-bold text-white">15.9K</p>
                <p className="text-xs text-green-400">+8% this month</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Avg Churn Risk</p>
                <p className="text-3xl font-bold text-white">28%</p>
                <p className="text-xs text-yellow-400">-5% from last month</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Churn Prediction Accuracy</p>
                <p className="text-3xl font-bold text-white">93%</p>
                <p className="text-xs text-green-400">High confidence</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Avg Sentiment</p>
                <p className="text-3xl font-bold text-white">7.8/10</p>
                <p className="text-xs text-green-400">+0.3 this month</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Churn Prediction */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Churn Prediction Accuracy</CardTitle>
            <CardDescription>Weekly churn rate predictions vs actual</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={churnData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="week" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Line type="monotone" dataKey="predicted" stroke="#3b82f6" strokeWidth={2} name="Predicted" />
                <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} name="Actual" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Segments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Segment Overview */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">User Segments</CardTitle>
              <CardDescription>Click to view detailed analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {segments.map(segment => (
                <button
                  key={segment.id}
                  onClick={() => setSelectedSegment(segment.id)}
                  className={`w-full p-4 rounded-lg border transition text-left ${
                    selectedSegment === segment.id
                      ? 'bg-cyan-900/50 border-cyan-500'
                      : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-white font-medium">{segment.name}</p>
                      <p className="text-xs text-gray-400">{segment.count.toLocaleString()} users</p>
                    </div>
                    <Badge 
                      className={
                        segment.churnRisk < 0.2 ? 'bg-green-900 text-green-300' :
                        segment.churnRisk < 0.5 ? 'bg-yellow-900 text-yellow-300' :
                        'bg-red-900 text-red-300'
                      }
                    >
                      {Math.round(segment.churnRisk * 100)}% risk
                    </Badge>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>LTV: ${segment.ltv}</span>
                    <span>Sentiment: {Math.round(segment.sentiment * 100)}/100</span>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Sentiment Distribution */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Sentiment Distribution</CardTitle>
              <CardDescription>Overall user sentiment breakdown</CardDescription>
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

        {/* Engagement Metrics */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Engagement by Segment</CardTitle>
            <CardDescription>Engagement, retention, and LTV metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="segment" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Bar dataKey="engagement" fill="#3b82f6" name="Engagement %" />
                <Bar dataKey="retention" fill="#10b981" name="Retention %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Detailed Segment Analysis */}
        {selectedSegmentData && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">{selectedSegmentData.name} Analysis</CardTitle>
              <CardDescription>Detailed behavioral insights and recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="p-3 bg-slate-700/30 rounded border border-slate-600">
                  <p className="text-xs text-gray-400">Total Users</p>
                  <p className="text-2xl font-bold text-white">{selectedSegmentData.count.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-slate-700/30 rounded border border-slate-600">
                  <p className="text-xs text-gray-400">Churn Risk</p>
                  <p className="text-2xl font-bold text-white">{Math.round(selectedSegmentData.churnRisk * 100)}%</p>
                </div>
                <div className="p-3 bg-slate-700/30 rounded border border-slate-600">
                  <p className="text-xs text-gray-400">LTV</p>
                  <p className="text-2xl font-bold text-white">${selectedSegmentData.ltv}</p>
                </div>
                <div className="p-3 bg-slate-700/30 rounded border border-slate-600">
                  <p className="text-xs text-gray-400">Sentiment</p>
                  <p className="text-2xl font-bold text-white">{Math.round(selectedSegmentData.sentiment * 100)}/100</p>
                </div>
              </div>

              <div className="p-4 bg-slate-700/30 rounded border border-slate-600">
                <p className="text-sm text-white font-medium mb-3">Key Behaviors</p>
                <ul className="space-y-2">
                  {selectedSegmentData.behaviors.map((behavior, idx) => (
                    <li key={idx} className="text-sm text-gray-300 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      {behavior}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Churn Risk Factors */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Churn Risk Factors</CardTitle>
            <CardDescription>Key indicators of user churn</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {churnFactors.map((factor, idx) => (
              <div key={idx} className="p-3 bg-slate-700/30 rounded border border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-white">{factor.factor}</p>
                  <p className="text-sm font-bold text-red-400">{Math.round(factor.impact * 100)}% impact</p>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full" 
                    style={{ width: `${factor.impact * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Behavioral Insights */}
        <Card className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 border-cyan-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Behavioral Insights
            </CardTitle>
            <CardDescription>Actionable recommendations from behavioral analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-slate-700/50 rounded border border-slate-600">
              <p className="text-sm text-white font-medium">✓ Identified 450 at-risk users</p>
              <p className="text-xs text-gray-400 mt-1">Automated retention campaigns activated</p>
            </div>
            <div className="p-3 bg-slate-700/50 rounded border border-slate-600">
              <p className="text-sm text-white font-medium">✓ Churn prediction model accuracy: 93%</p>
              <p className="text-xs text-gray-400 mt-1">Enabling proactive intervention strategies</p>
            </div>
            <div className="p-3 bg-slate-700/50 rounded border border-slate-600">
              <p className="text-sm text-white font-medium">⚠ Growth segment needs engagement boost</p>
              <p className="text-xs text-gray-400 mt-1">Recommend personalized feature recommendations</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
