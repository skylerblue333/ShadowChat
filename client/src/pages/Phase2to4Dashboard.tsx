import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

/**
 * Phase 2-4 Dashboard
 * Competitive Radar + Behavioral Intelligence + Experiments + Narrative + Connectors + Product Brain + Company Simulator
 */

export default function Phase2to4Dashboard() {
  const [activeTab, setActiveTab] = useState('competitive-radar');

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Advanced Intelligence Platform</h1>
          <p className="text-slate-400">Phase 2-4: Competitive Radar + Behavioral Intelligence + Experiments + Narrative + Connectors + Product Brain + Company Simulator</p>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-8">
            <TabsTrigger value="competitive-radar" className="text-xs">Competitive</TabsTrigger>
            <TabsTrigger value="behavioral" className="text-xs">Behavioral</TabsTrigger>
            <TabsTrigger value="experiments" className="text-xs">Experiments</TabsTrigger>
            <TabsTrigger value="narrative" className="text-xs">Narrative</TabsTrigger>
            <TabsTrigger value="connectors" className="text-xs">Connectors</TabsTrigger>
            <TabsTrigger value="product-brain" className="text-xs">Product Brain</TabsTrigger>
            <TabsTrigger value="simulator" className="text-xs">Simulator</TabsTrigger>
          </TabsList>

          {/* Competitive Radar Tab */}
          <TabsContent value="competitive-radar" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Market Positioning */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Market Positioning</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-300">Your Market Share</span>
                      <Badge className="bg-gold-900 text-gold-200">5%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-300">Competitor A</span>
                      <Badge className="bg-red-900 text-red-200">40%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-300">Competitor B</span>
                      <Badge className="bg-red-900 text-red-200">30%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-300">Others</span>
                      <Badge className="bg-slate-600 text-slate-200">25%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Market Gaps */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Market Gaps (Opportunities)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-slate-700 rounded p-3">
                    <p className="text-sm font-semibold text-white">Mobile-first + Offline Support</p>
                    <p className="text-xs text-slate-400">Market Size: $2B+ | Difficulty: Hard | Timeline: 6-9 months</p>
                    <Badge className="mt-2 bg-green-900 text-green-200">High Value</Badge>
                  </div>
                  <div className="bg-slate-700 rounded p-3">
                    <p className="text-sm font-semibold text-white">Community Collaboration Tools</p>
                    <p className="text-xs text-slate-400">Market Size: $500M+ | Difficulty: Medium | Timeline: 3-4 months</p>
                    <Badge className="mt-2 bg-blue-900 text-blue-200">Medium Value</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pricing Comparison */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Pricing Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-slate-700 rounded">
                    <span className="text-sm text-slate-300">Your Pricing (Pro)</span>
                    <span className="text-lg font-bold text-gold-400">$79/mo</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-slate-700 rounded">
                    <span className="text-sm text-slate-300">Competitor A (Pro)</span>
                    <span className="text-lg font-bold text-slate-300">$99/mo</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-slate-700 rounded">
                    <span className="text-sm text-slate-300">Competitor B (Pro)</span>
                    <span className="text-lg font-bold text-slate-300">$129/mo</span>
                  </div>
                  <div className="mt-4 p-3 bg-green-900 rounded text-green-200 text-sm">
                    ✓ Your pricing is 20% below market average - strong competitive advantage
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Behavioral Intelligence Tab */}
          <TabsContent value="behavioral" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Churn Risk */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Churn Risk Users</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-red-900 rounded p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-white">john_doe</span>
                      <Badge className="bg-red-700">Critical (85%)</Badge>
                    </div>
                    <p className="text-xs text-slate-300">Predicted churn: 3 days</p>
                  </div>
                  <div className="bg-yellow-900 rounded p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-white">jane_smith</span>
                      <Badge className="bg-yellow-700">High (72%)</Badge>
                    </div>
                    <p className="text-xs text-slate-300">Predicted churn: 7 days</p>
                  </div>
                </CardContent>
              </Card>

              {/* Sentiment Clustering */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">User Sentiment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-300">Positive (45%)</span>
                      <Progress value={45} className="h-2 flex-1 mx-2" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-300">Neutral (35%)</span>
                      <Progress value={35} className="h-2 flex-1 mx-2" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-300">Negative (20%)</span>
                      <Progress value={20} className="h-2 flex-1 mx-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Emerging Pain Patterns */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Top 3 Emerging Pain Patterns</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-slate-700 rounded p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-semibold text-white">Performance degradation during peak hours</p>
                      <p className="text-xs text-slate-400">Affecting 234 users | Growing trend</p>
                    </div>
                    <Badge className="bg-red-900 text-red-200">High</Badge>
                  </div>
                  <p className="text-xs text-slate-300">Recommended: Implement query caching and database indexing</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Experiments Tab */}
          <TabsContent value="experiments" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Active Experiments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-slate-700 rounded p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-sm font-semibold text-white">Simplified Onboarding Flow</p>
                      <p className="text-xs text-slate-400">Reduce steps from 5 to 3</p>
                    </div>
                    <Badge className="bg-green-900 text-green-200">Winner</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-slate-400">Activation Rate</p>
                      <p className="text-green-400 font-bold">+31.25%</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Time to Action</p>
                      <p className="text-green-400 font-bold">-40%</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Completion</p>
                      <p className="text-green-400 font-bold">+25%</p>
                    </div>
                  </div>
                  <Button className="w-full mt-3 bg-green-600 hover:bg-green-700">Roll Out to 100%</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Narrative Tab */}
          <TabsContent value="narrative" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Marketing Narratives</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-slate-700 rounded p-4">
                  <p className="text-sm font-semibold text-white mb-2">Enterprise Positioning</p>
                  <p className="text-xs text-slate-300 mb-3">Enterprise-Grade Solution for Fortune 500 Companies</p>
                  <p className="text-xs text-slate-400">Reduce operational costs by 40% while improving team productivity</p>
                  <Button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-xs">View Full Narrative</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Connectors Tab */}
          <TabsContent value="connectors" className="space-y-6">
            <Alert className="bg-red-900 border-red-700">
              <AlertDescription className="text-red-200">
                ⚠️ Engineering bottleneck detected in backend team (Jira) - affecting 5 dependent features
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Slack Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-300">Frustration Level</span>
                    <Badge className="bg-red-900 text-red-200">High</Badge>
                  </div>
                  <p className="text-xs text-slate-400">Performance issues (12 mentions)</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Jira Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-300">Cycle Time</span>
                    <Badge className="bg-red-900 text-red-200">12 days</Badge>
                  </div>
                  <p className="text-xs text-slate-400">Target: 5 days | Trend: Degrading</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Product Brain Tab */}
          <TabsContent value="product-brain" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Playbook Library</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-slate-700 rounded p-3">
                  <p className="text-sm font-semibold text-white">Mobile App Launch Playbook v1</p>
                  <p className="text-xs text-slate-400">Used 3 times | Reusability Score: 95%</p>
                  <p className="text-xs text-green-400 mt-2">✓ Average 4.8 star rating | 50K downloads in week 1</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Company Simulator Tab */}
          <TabsContent value="simulator" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Company Simulation Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-700 rounded p-3">
                    <p className="text-xs text-slate-400">Timeline Impact</p>
                    <p className="text-2xl font-bold text-gold-400">+14 days</p>
                  </div>
                  <div className="bg-slate-700 rounded p-3">
                    <p className="text-xs text-slate-400">Cost Impact</p>
                    <p className="text-2xl font-bold text-gold-400">$700K</p>
                  </div>
                  <div className="bg-slate-700 rounded p-3">
                    <p className="text-xs text-slate-400">Risk Level</p>
                    <Badge className="bg-red-900 text-red-200">High</Badge>
                  </div>
                  <div className="bg-slate-700 rounded p-3">
                    <p className="text-xs text-slate-400">Success Probability</p>
                    <p className="text-2xl font-bold text-green-400">68%</p>
                  </div>
                </div>

                <div className="bg-slate-700 rounded p-3">
                  <p className="text-sm font-semibold text-white mb-2">Critical Path</p>
                  <ul className="space-y-1">
                    <li className="text-xs text-slate-300">• Engineering: Database migration (14 days)</li>
                    <li className="text-xs text-slate-300">• Product: Roadmap alignment (7 days)</li>
                    <li className="text-xs text-slate-300">• Design: System updates (10 days)</li>
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
