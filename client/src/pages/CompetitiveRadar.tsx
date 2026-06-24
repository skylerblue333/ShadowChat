import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { Radar, AlertTriangle, TrendingUp, Target, Zap } from 'lucide-react';

export default function CompetitiveRadar() {
  const [selectedCompetitor, setSelectedCompetitor] = useState('all');

  // Competitor data
  const competitors = [
    {
      id: 'discord',
      name: 'Discord',
      category: 'Communication',
      marketShare: 0.35,
      growthRate: 0.15,
      features: 45,
      userSentiment: 0.82,
      threats: ['Voice quality', 'Community features', 'Streaming integration'],
      opportunities: ['Mobile optimization', 'Gaming integration', 'Enterprise features'],
    },
    {
      id: 'twitch',
      name: 'Twitch',
      category: 'Streaming',
      marketShare: 0.42,
      growthRate: 0.12,
      features: 52,
      userSentiment: 0.78,
      threats: ['Creator monetization', 'Live streaming', 'Community engagement'],
      opportunities: ['Gaming marketplace', 'Social features', 'AI moderation'],
    },
    {
      id: 'roblox',
      name: 'Roblox',
      category: 'Gaming',
      marketShare: 0.28,
      growthRate: 0.25,
      features: 48,
      userSentiment: 0.85,
      threats: ['Game creation', 'User-generated content', 'Monetization'],
      opportunities: ['AI game generation', 'Cross-platform play', 'Enterprise tools'],
    },
    {
      id: 'opensea',
      name: 'OpenSea',
      category: 'Marketplace',
      marketShare: 0.38,
      growthRate: 0.08,
      features: 35,
      userSentiment: 0.72,
      threats: ['NFT marketplace', 'Web3 integration', 'Creator tools'],
      opportunities: ['Improved UX', 'Mobile app', 'Gamification'],
    },
  ];

  // Market trend data
  const marketTrendData = [
    { month: 'Jan', skycoin: 45, discord: 48, twitch: 52, roblox: 35, opensea: 38 },
    { month: 'Feb', skycoin: 52, discord: 49, twitch: 53, roblox: 38, opensea: 36 },
    { month: 'Mar', skycoin: 62, discord: 50, twitch: 54, roblox: 42, opensea: 35 },
    { month: 'Apr', skycoin: 75, discord: 51, twitch: 55, roblox: 45, opensea: 34 },
    { month: 'May', skycoin: 88, discord: 52, twitch: 56, roblox: 48, opensea: 33 },
    { month: 'Jun', skycoin: 105, discord: 53, twitch: 57, roblox: 52, opensea: 32 },
  ];

  // Feature comparison
  const featureComparisonData = [
    { feature: 'Social', skycoin: 95, discord: 88, twitch: 75, roblox: 82, opensea: 45 },
    { feature: 'Gaming', skycoin: 92, discord: 70, twitch: 65, roblox: 98, opensea: 30 },
    { feature: 'Commerce', skycoin: 88, discord: 45, twitch: 60, roblox: 75, opensea: 95 },
    { feature: 'AI', skycoin: 98, discord: 50, twitch: 55, roblox: 60, opensea: 35 },
    { feature: 'Creator Tools', skycoin: 85, discord: 80, twitch: 92, roblox: 88, opensea: 70 },
  ];

  // Competitive positioning
  const positioningData = [
    { name: 'SKYCOIN4444', marketShare: 0.15, growth: 0.45, innovation: 0.95 },
    { name: 'Discord', marketShare: 0.35, growth: 0.15, innovation: 0.65 },
    { name: 'Twitch', marketShare: 0.42, growth: 0.12, innovation: 0.60 },
    { name: 'Roblox', marketShare: 0.28, growth: 0.25, innovation: 0.75 },
    { name: 'OpenSea', marketShare: 0.38, growth: 0.08, innovation: 0.55 },
  ];

  const selectedCompetitorData = competitors.find(c => c.id === selectedCompetitor);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Radar className="w-8 h-8 text-red-400" />
            <h1 className="text-4xl font-bold text-white">Competitive Radar</h1>
          </div>
          <p className="text-gray-400">Always-on market sensing and competitive intelligence</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Competitors Tracked</p>
                <p className="text-3xl font-bold text-white">24</p>
                <p className="text-xs text-blue-400">Real-time monitoring</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Market Position</p>
                <p className="text-3xl font-bold text-white">#2</p>
                <p className="text-xs text-green-400">Up from #5 (3 months)</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Growth Rate</p>
                <p className="text-3xl font-bold text-white">45%</p>
                <p className="text-xs text-green-400">vs 15% market avg</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Threats Detected</p>
                <p className="text-3xl font-bold text-white">3</p>
                <p className="text-xs text-yellow-400">Requires action</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Market Trend Chart */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Market Trend (6 Months)</CardTitle>
            <CardDescription>User growth comparison across major platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={marketTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Line type="monotone" dataKey="skycoin" stroke="#8b5cf6" strokeWidth={3} name="SKYCOIN4444" />
                <Line type="monotone" dataKey="discord" stroke="#3b82f6" strokeWidth={2} name="Discord" />
                <Line type="monotone" dataKey="twitch" stroke="#f59e0b" strokeWidth={2} name="Twitch" />
                <Line type="monotone" dataKey="roblox" stroke="#10b981" strokeWidth={2} name="Roblox" />
                <Line type="monotone" dataKey="opensea" stroke="#ef4444" strokeWidth={2} name="OpenSea" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Competitive Positioning */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Competitive Positioning</CardTitle>
            <CardDescription>Market share vs growth rate vs innovation</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="marketShare" stroke="#9ca3af" name="Market Share" />
                <YAxis dataKey="growth" stroke="#9ca3af" name="Growth Rate" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#fff' }}
                  cursor={{ strokeDasharray: '3 3' }}
                />
                <Scatter name="Platforms" data={positioningData} fill="#8b5cf6" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Feature Comparison */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Feature Comparison</CardTitle>
            <CardDescription>Capability score across key dimensions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={featureComparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="feature" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Bar dataKey="skycoin" fill="#8b5cf6" name="SKYCOIN4444" />
                <Bar dataKey="discord" fill="#3b82f6" name="Discord" />
                <Bar dataKey="twitch" fill="#f59e0b" name="Twitch" />
                <Bar dataKey="roblox" fill="#10b981" name="Roblox" />
                <Bar dataKey="opensea" fill="#ef4444" name="OpenSea" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Competitor Details */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Competitor Analysis</CardTitle>
            <CardDescription>Select a competitor to view detailed intelligence</CardDescription>
            <Tabs defaultValue="all" className="mt-4">
              <TabsList className="bg-slate-700">
                <TabsTrigger value="all" onClick={() => setSelectedCompetitor('all')}>All</TabsTrigger>
                {competitors.map(c => (
                  <TabsTrigger key={c.id} value={c.id} onClick={() => setSelectedCompetitor(c.id)}>
                    {c.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedCompetitor === 'all' ? (
              <div className="space-y-4">
                {competitors.map(competitor => (
                  <div key={competitor.id} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-white font-medium">{competitor.name}</h3>
                        <p className="text-xs text-gray-400">{competitor.category}</p>
                      </div>
                      <Badge variant="outline">{Math.round(competitor.marketShare * 100)}% market share</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-400">Growth</p>
                        <p className="text-white font-medium">{Math.round(competitor.growthRate * 100)}%</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Features</p>
                        <p className="text-white font-medium">{competitor.features}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Sentiment</p>
                        <p className="text-white font-medium">{Math.round(competitor.userSentiment * 100)}/100</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : selectedCompetitorData && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                  <h3 className="text-white font-medium mb-3">{selectedCompetitorData.name}</h3>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Market Share</p>
                      <p className="text-white font-medium">{Math.round(selectedCompetitorData.marketShare * 100)}%</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Growth Rate</p>
                      <p className="text-white font-medium">{Math.round(selectedCompetitorData.growthRate * 100)}%</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Features</p>
                      <p className="text-white font-medium">{selectedCompetitorData.features}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">User Sentiment</p>
                      <p className="text-white font-medium">{Math.round(selectedCompetitorData.userSentiment * 100)}/100</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-red-900/20 rounded-lg border border-red-700">
                  <p className="text-red-300 font-medium flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    Key Threats
                  </p>
                  <ul className="space-y-1">
                    {selectedCompetitorData.threats.map((threat, idx) => (
                      <li key={idx} className="text-sm text-red-200">• {threat}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-green-900/20 rounded-lg border border-green-700">
                  <p className="text-green-300 font-medium flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4" />
                    Our Opportunities
                  </p>
                  <ul className="space-y-1">
                    {selectedCompetitorData.opportunities.map((opp, idx) => (
                      <li key={idx} className="text-sm text-green-200">• {opp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Intelligence Insights */}
        <Card className="bg-gradient-to-r from-red-900/50 to-orange-900/50 border-red-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Intelligence Insights
            </CardTitle>
            <CardDescription>Key findings from competitive analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-slate-700/50 rounded border border-slate-600">
              <p className="text-sm text-white font-medium">✓ Market leadership trajectory confirmed</p>
              <p className="text-xs text-gray-400 mt-1">Growth rate 3x higher than nearest competitor</p>
            </div>
            <div className="p-3 bg-slate-700/50 rounded border border-slate-600">
              <p className="text-sm text-white font-medium">⚠ Twitch accelerating in creator tools</p>
              <p className="text-xs text-gray-400 mt-1">Recommend feature parity within 60 days</p>
            </div>
            <div className="p-3 bg-slate-700/50 rounded border border-slate-600">
              <p className="text-sm text-white font-medium">✓ AI capabilities are major differentiator</p>
              <p className="text-xs text-gray-400 mt-1">No competitor has comparable AI integration</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
