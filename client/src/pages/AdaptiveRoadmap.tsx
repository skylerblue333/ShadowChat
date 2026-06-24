import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { Zap, TrendingUp, AlertCircle, CheckCircle, Clock, Target } from 'lucide-react';
export default function AdaptiveRoadmap() {
  const [selectedQuarter, setSelectedQuarter] = useState('Q2');

  // Roadmap items with dynamic prioritization
  const roadmapItems = [
    {
      id: 1,
      title: 'Mobile App Launch',
      quarter: 'Q2',
      priority: 95,
      impact: 'High',
      effort: 'High',
      status: 'in-progress',
      completion: 65,
      signals: { userDemand: 0.92, marketTiming: 0.88, resourceAvailability: 0.75 },
    },
    {
      id: 2,
      title: 'AI Personalization v2',
      quarter: 'Q2',
      priority: 88,
      impact: 'High',
      effort: 'Medium',
      status: 'planned',
      completion: 0,
      signals: { userDemand: 0.85, marketTiming: 0.90, resourceAvailability: 0.80 },
    },
    {
      id: 3,
      title: 'Enterprise SSO Integration',
      quarter: 'Q3',
      priority: 72,
      impact: 'Medium',
      effort: 'Medium',
      status: 'planned',
      completion: 0,
      signals: { userDemand: 0.68, marketTiming: 0.75, resourceAvailability: 0.70 },
    },
    {
      id: 4,
      title: 'Global Expansion (50+ countries)',
      quarter: 'Q3',
      priority: 85,
      impact: 'High',
      effort: 'High',
      status: 'planned',
      completion: 0,
      signals: { userDemand: 0.88, marketTiming: 0.82, resourceAvailability: 0.65 },
    },
    {
      id: 5,
      title: 'Metaverse Integration',
      quarter: 'Q4',
      priority: 62,
      impact: 'Medium',
      effort: 'High',
      status: 'research',
      completion: 0,
      signals: { userDemand: 0.55, marketTiming: 0.70, resourceAvailability: 0.50 },
    },
  ];

  // Priority signal data
  const priorityData = [
    { name: 'User Demand', value: 0.87 },
    { name: 'Market Timing', value: 0.82 },
    { name: 'Resource Availability', value: 0.71 },
    { name: 'Strategic Alignment', value: 0.89 },
    { name: 'Competitive Pressure', value: 0.65 },
  ];

  // Effort vs Impact scatter
  const effortImpactData = roadmapItems.map(item => ({
    name: item.title,
    effort: item.effort === 'Low' ? 1 : item.effort === 'Medium' ? 2 : 3,
    impact: item.impact === 'Low' ? 1 : item.impact === 'Medium' ? 2 : 3,
    priority: item.priority,
  }));

  // Timeline progression
  const timelineData = [
    { quarter: 'Q1', planned: 8, completed: 8, inProgress: 0 },
    { quarter: 'Q2', planned: 12, completed: 0, inProgress: 5 },
    { quarter: 'Q3', planned: 10, completed: 0, inProgress: 0 },
    { quarter: 'Q4', planned: 8, completed: 0, inProgress: 0 },
  ];

  const filteredItems = roadmapItems.filter(item => item.quarter === selectedQuarter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Target className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">Adaptive Roadmap</h1>
          </div>
          <p className="text-gray-400">Dynamic prioritization based on real-time signals and market conditions</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Total Initiatives</p>
                <p className="text-3xl font-bold text-white">38</p>
                <p className="text-xs text-blue-400">Across 4 quarters</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Q2 Completion</p>
                <p className="text-3xl font-bold text-white">65%</p>
                <p className="text-xs text-green-400">On track</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Avg Priority Score</p>
                <p className="text-3xl font-bold text-white">8.0/10</p>
                <p className="text-xs text-blue-400">+0.3 this month</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Signal Confidence</p>
                <p className="text-3xl font-bold text-white">87%</p>
                <p className="text-xs text-green-400">High confidence</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Priority Signals */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Priority Signals</CardTitle>
              <CardDescription>Factors influencing roadmap prioritization</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={priorityData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" stroke="#9ca3af" />
                  <YAxis dataKey="name" type="category" stroke="#9ca3af" width={120} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Effort vs Impact */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Effort vs Impact</CardTitle>
              <CardDescription>Initiative prioritization matrix</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="effort" stroke="#9ca3af" name="Effort" />
                  <YAxis dataKey="impact" stroke="#9ca3af" name="Impact" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                    labelStyle={{ color: '#fff' }}
                    cursor={{ strokeDasharray: '3 3' }}
                  />
                  <Scatter name="Initiatives" data={effortImpactData} fill="#8b5cf6" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Timeline */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Timeline Progression</CardTitle>
            <CardDescription>Planned vs completed initiatives by quarter</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="quarter" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Bar dataKey="planned" fill="#3b82f6" />
                <Bar dataKey="completed" fill="#10b981" />
                <Bar dataKey="inProgress" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Roadmap Items */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Roadmap Items</CardTitle>
            <CardDescription>Select quarter to view details</CardDescription>
            <div className="flex gap-2 mt-4">
              {['Q1', 'Q2', 'Q3', 'Q4'].map(q => (
                <Button
                  key={q}
                  variant={selectedQuarter === q ? 'default' : 'outline'}
                  onClick={() => setSelectedQuarter(q)}
                  className="text-xs"
                >
                  {q}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredItems.map(item => (
              <div key={item.id} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600 hover:border-slate-500 transition">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-white font-medium">{item.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">Priority Score: {item.priority}/100</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline"
                      className={
                        item.status === 'completed' ? 'border-green-500 text-green-400' :
                        item.status === 'in-progress' ? 'border-blue-500 text-blue-400' :
                        item.status === 'planned' ? 'border-yellow-500 text-yellow-400' :
                        'border-gray-500 text-gray-400'
                      }
                    >
                      {item.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {item.status === 'in-progress' && <Clock className="w-3 h-3 mr-1" />}
                      {item.status === 'planned' && <AlertCircle className="w-3 h-3 mr-1" />}
                      {item.status}
                    </Badge>
                  </div>
                </div>

                {item.status === 'in-progress' && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-gray-400">{item.completion}%</span>
                    </div>
                    <Progress value={item.completion} className="h-2" />
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <p className="text-gray-400">Impact</p>
                    <p className="text-white font-medium">{item.impact}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Effort</p>
                    <p className="text-white font-medium">{item.effort}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Signal Confidence</p>
                    <p className="text-white font-medium">{Math.round((item.signals.userDemand + item.signals.marketTiming + item.signals.resourceAvailability) / 3 * 100)}%</p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-600">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Signal Breakdown:</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">User Demand:</span>
                      <span className="text-blue-400">{Math.round(item.signals.userDemand * 100)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Market Timing:</span>
                      <span className="text-purple-400">{Math.round(item.signals.marketTiming * 100)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Resources:</span>
                      <span className="text-green-400">{Math.round(item.signals.resourceAvailability * 100)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Auto-Optimization */}
        <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Adaptive Optimization
            </CardTitle>
            <CardDescription>Automatic roadmap adjustments based on real-time signals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-slate-700/50 rounded border border-slate-600">
              <p className="text-sm text-white font-medium">✓ Reprioritized 3 initiatives based on user demand surge</p>
              <p className="text-xs text-gray-400 mt-1">Mobile App Launch moved up to highest priority</p>
            </div>
            <div className="p-3 bg-slate-700/50 rounded border border-slate-600">
              <p className="text-sm text-white font-medium">✓ Identified resource bottleneck in Q3</p>
              <p className="text-xs text-gray-400 mt-1">Recommended deferring 2 lower-impact initiatives</p>
            </div>
            <div className="p-3 bg-slate-700/50 rounded border border-slate-600">
              <p className="text-sm text-white font-medium">✓ Detected market timing opportunity</p>
              <p className="text-xs text-gray-400 mt-1">Accelerating Global Expansion to Q2.5 (mid-quarter)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
