import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

/**
 * Phase 1 Dashboard
 * Living Loop + Adaptive Roadmap + Multi-Agent Orchestrator
 */

export default function Phase1Dashboard() {
  const [activeTab, setActiveTab] = useState('living-loop');

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Product Organization Engine</h1>
          <p className="text-slate-400">Phase 1: Living Loop + Adaptive Roadmap + Multi-Agent Orchestrator</p>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="living-loop">Living Loop</TabsTrigger>
            <TabsTrigger value="roadmap">Adaptive Roadmap</TabsTrigger>
            <TabsTrigger value="agents">Agent Debate</TabsTrigger>
          </TabsList>

          {/* Living Loop Tab */}
          <TabsContent value="living-loop" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Feedback Summary */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Feedback Summary</CardTitle>
                  <CardDescription>Feature: Mobile App</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-slate-300">Average Rating</span>
                      <span className="text-lg font-bold text-gold-400">4.2 / 5.0</span>
                    </div>
                    <Progress value={84} className="h-2" />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-slate-700 rounded p-2 text-center">
                      <div className="text-green-400 font-bold">8</div>
                      <div className="text-xs text-slate-400">Positive</div>
                    </div>
                    <div className="bg-slate-700 rounded p-2 text-center">
                      <div className="text-yellow-400 font-bold">2</div>
                      <div className="text-xs text-slate-400">Neutral</div>
                    </div>
                    <div className="bg-slate-700 rounded p-2 text-center">
                      <div className="text-red-400 font-bold">1</div>
                      <div className="text-xs text-slate-400">Negative</div>
                    </div>
                  </div>

                  <div className="bg-slate-700 rounded p-3">
                    <p className="text-sm text-slate-300">
                      <strong>Recommended Action:</strong> Expand this feature
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Churn Risk Signals */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Churn Risk Signals</CardTitle>
                  <CardDescription>User engagement trends</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-slate-700 rounded p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-300">Overall Risk</span>
                      <Badge variant="outline" className="bg-yellow-900 text-yellow-200">
                        Medium (25%)
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-yellow-900 text-yellow-200">Medium</Badge>
                      <span className="text-sm text-slate-300">Low engagement (7 days)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-900 text-green-200">Low</Badge>
                      <span className="text-sm text-slate-300">Negative feedback (3 days)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-yellow-900 text-yellow-200">Medium</Badge>
                      <span className="text-sm text-slate-300">Feature abandonment (14 days)</span>
                    </div>
                  </div>

                  <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                    Send Re-engagement Email
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Feedback Trends */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Feedback Trends (30 days)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-slate-300">Rating Trend</span>
                      <span className="text-sm text-green-400">↑ Improving</span>
                    </div>
                    <div className="flex gap-1">
                      {[3.2, 3.4, 3.6, 3.8, 4.0].map((rating, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-slate-700 rounded h-12 flex items-end justify-center"
                          style={{ height: `${rating * 30}px` }}
                        >
                          <span className="text-xs text-slate-300">{rating.toFixed(1)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-slate-300">Feedback Volume</span>
                      <span className="text-sm text-green-400">↑ Growing</span>
                    </div>
                    <div className="flex gap-1">
                      {[5, 8, 12, 15, 18].map((volume, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-slate-700 rounded flex items-end justify-center"
                          style={{ height: `${volume * 5}px` }}
                        >
                          <span className="text-xs text-slate-300">{volume}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Adaptive Roadmap Tab */}
          <TabsContent value="roadmap" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Roadmap Metrics */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Roadmap Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-700 rounded p-3">
                      <div className="text-2xl font-bold text-gold-400">4</div>
                      <div className="text-xs text-slate-400">Total Items</div>
                    </div>
                    <div className="bg-slate-700 rounded p-3">
                      <div className="text-2xl font-bold text-green-400">2</div>
                      <div className="text-xs text-slate-400">High Priority</div>
                    </div>
                    <div className="bg-slate-700 rounded p-3">
                      <div className="text-2xl font-bold text-blue-400">0.78</div>
                      <div className="text-xs text-slate-400">Avg Feedback</div>
                    </div>
                    <div className="bg-slate-700 rounded p-3">
                      <div className="text-2xl font-bold text-purple-400">0.82</div>
                      <div className="text-xs text-slate-400">Avg Revenue</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Priority Changes */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Changes</CardTitle>
                  <CardDescription>Roadmap reshuffled based on signals</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-slate-700 rounded p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-sm font-semibold text-white">Community Features</p>
                        <p className="text-xs text-slate-400">Priority: 3 → 7</p>
                      </div>
                      <Badge className="bg-green-900 text-green-200">↑ +4</Badge>
                    </div>
                    <p className="text-xs text-slate-300">High user feedback (0.9 score)</p>
                  </div>

                  <div className="bg-slate-700 rounded p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-sm font-semibold text-white">Enterprise API</p>
                        <p className="text-xs text-slate-400">Priority: 4 → 6</p>
                      </div>
                      <Badge className="bg-green-900 text-green-200">↑ +2</Badge>
                    </div>
                    <p className="text-xs text-slate-300">Strong revenue potential (0.85)</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Prioritized Roadmap */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Prioritized Roadmap</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    name: 'Mobile App',
                    priority: 9,
                    feedback: 0.85,
                    revenue: 0.9,
                    impact: 'high',
                  },
                  {
                    name: 'AI Personalization',
                    priority: 8,
                    feedback: 0.75,
                    revenue: 0.8,
                    impact: 'high',
                  },
                  {
                    name: 'Community Features',
                    priority: 7,
                    feedback: 0.9,
                    revenue: 0.5,
                    impact: 'medium',
                  },
                  {
                    name: 'Enterprise API',
                    priority: 6,
                    feedback: 0.6,
                    revenue: 0.85,
                    impact: 'medium',
                  },
                ].map((item, i) => (
                  <div key={i} className="bg-slate-700 rounded p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-white">{item.name}</p>
                        <Badge className="mt-1 bg-slate-600">{item.impact}</Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gold-400">{item.priority}</div>
                        <div className="text-xs text-slate-400">Priority</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="text-xs text-slate-400 mb-1">Feedback</div>
                        <Progress value={item.feedback * 100} className="h-1" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 mb-1">Revenue</div>
                        <Progress value={item.revenue * 100} className="h-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Agent Debate Tab */}
          <TabsContent value="agents" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Multi-Agent Debate</CardTitle>
                <CardDescription>Internal team consensus on feature prioritization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Consensus Level */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold text-white">Team Consensus</span>
                    <span className="text-sm text-green-400">87% Agreement</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>

                {/* Agent Perspectives */}
                <div className="space-y-4">
                  {[
                    {
                      role: 'Market Analyst',
                      icon: '📊',
                      recommendation:
                        'Prioritize features that address personalization and mobile experience to capture market share.',
                      confidence: 0.85,
                    },
                    {
                      role: 'UX Designer',
                      icon: '🎨',
                      recommendation:
                        'Implement progressive disclosure pattern and contextual onboarding to improve activation.',
                      confidence: 0.9,
                    },
                    {
                      role: 'Backend Architect',
                      icon: '⚙️',
                      recommendation:
                        'Proceed with implementation. Estimated effort: 4-6 weeks. No major architectural changes needed.',
                      confidence: 0.88,
                    },
                    {
                      role: 'Growth Marketer',
                      icon: '📈',
                      recommendation:
                        'Launch with referral incentives and viral loops. Target 1000 DAU in first month.',
                      confidence: 0.82,
                    },
                    {
                      role: 'QA / Risk',
                      icon: '🛡️',
                      recommendation:
                        'Proceed with risk mitigation plan. Implement comprehensive testing strategy.',
                      confidence: 0.87,
                    },
                  ].map((agent, i) => (
                    <div key={i} className="bg-slate-700 rounded p-4">
                      <div className="flex items-start gap-3 mb-2">
                        <span className="text-2xl">{agent.icon}</span>
                        <div className="flex-1">
                          <p className="font-semibold text-white">{agent.role}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress value={agent.confidence * 100} className="h-1 flex-1" />
                            <span className="text-xs text-slate-400">{(agent.confidence * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-slate-300">{agent.recommendation}</p>
                    </div>
                  ))}
                </div>

                {/* Merged Recommendation */}
                <div className="bg-gradient-to-r from-gold-900 to-slate-700 rounded p-4 border border-gold-700">
                  <p className="text-sm font-semibold text-gold-200 mb-2">Merged Recommendation</p>
                  <p className="text-sm text-slate-100">
                    Based on internal team debate: Proceed with implementation, prioritizing UX improvements and
                    growth strategies while maintaining technical quality and risk mitigation.
                  </p>
                </div>

                {/* Action Items */}
                <div>
                  <p className="text-sm font-semibold text-white mb-3">Action Items</p>
                  <ul className="space-y-2">
                    {[
                      'Implement progressive disclosure pattern',
                      'Create contextual onboarding flow',
                      'Design responsive mobile experience',
                      'Plan database migration',
                      'Design referral program',
                      'Write 100+ unit tests',
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                        <span className="text-green-400">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
