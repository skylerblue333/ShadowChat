import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BookOpen, Users, Zap, TrendingUp, CheckCircle } from 'lucide-react';

export default function NarrativeEngine() {
  const [selectedNarrative, setSelectedNarrative] = useState('investor');

  // Narrative variants
  const narratives = [
    {
      id: 'investor',
      audience: 'Investors',
      title: 'SKYCOIN4444: The $10B Opportunity',
      focus: 'Market size, growth potential, ROI',
      variant: `SKYCOIN4444 is a fully integrated AI-powered digital ecosystem combining social, gaming, finance, and enterprise tools into one addictive platform. With a $14.2T TAM and 0.65 viral coefficient, we project $100M Year 1 revenue and $100B+ valuation by Year 10. Our 1000x AI advantage creates an unassailable competitive moat.`,
      engagement: 0.94,
      persuasiveness: 0.92,
      ctr: 0.18,
    },
    {
      id: 'users',
      audience: 'Users',
      title: 'SKYCOIN4444: Earn, Play, Connect',
      focus: 'Value, fun, community',
      variant: `Join 100M+ users earning real money while having fun. Stake tokens, play games, create content, and build your empire. SKYCOIN4444 is the only platform where chat executes real actions—ask Hope AI to buy products, tip creators, or launch campaigns from a single message.`,
      engagement: 0.88,
      persuasiveness: 0.85,
      ctr: 0.22,
    },
    {
      id: 'enterprise',
      audience: 'Enterprise',
      title: 'SKYCOIN4444: Enterprise Platform',
      focus: 'Security, compliance, ROI',
      variant: `SKYCOIN4444 Enterprise provides SOC 2 Type II, ISO 27001, and GDPR-compliant infrastructure for 1M+ concurrent users. White-label capabilities, advanced analytics, and dedicated support enable Fortune 500 companies to launch branded digital ecosystems in weeks, not years.`,
      engagement: 0.82,
      persuasiveness: 0.88,
      ctr: 0.14,
    },
    {
      id: 'creator',
      audience: 'Creators',
      title: 'SKYCOIN4444: Creator Economy',
      focus: 'Monetization, audience, tools',
      variant: `Monetize every interaction. Earn 40% lifetime commission on referrals, 85% on marketplace sales, and direct tips from fans. SKYCOIN4444 provides AI-powered analytics, content recommendations, and audience growth tools to help creators scale to millions.`,
      engagement: 0.91,
      persuasiveness: 0.89,
      ctr: 0.25,
    },
  ];

  // Narrative performance data
  const performanceData = [
    { metric: 'Engagement', investor: 94, users: 88, enterprise: 82, creator: 91 },
    { metric: 'Persuasiveness', investor: 92, users: 85, enterprise: 88, creator: 89 },
    { metric: 'CTR', investor: 18, users: 22, enterprise: 14, creator: 25 },
    { metric: 'Conversion', investor: 8.5, users: 12.3, enterprise: 6.2, creator: 15.8 },
  ];

  // Narrative testing results
  const testingData = [
    { variant: 'Original', engagement: 72, conversion: 5.2, sentiment: 0.68 },
    { variant: 'v1 (Optimized)', engagement: 81, conversion: 7.1, sentiment: 0.76 },
    { variant: 'v2 (AI-Generated)', engagement: 88, conversion: 12.3, sentiment: 0.85 },
    { variant: 'v3 (Current)', engagement: 94, conversion: 18.0, sentiment: 0.92 },
  ];

  const selectedNarrativeData = narratives.find(n => n.id === selectedNarrative);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-amber-400" />
            <h1 className="text-4xl font-bold text-white">Narrative Engine</h1>
          </div>
          <p className="text-gray-400">Multi-audience story generation and positioning optimization</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Narratives Generated</p>
                <p className="text-3xl font-bold text-white">47</p>
                <p className="text-xs text-blue-400">4 core audiences</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Avg Engagement</p>
                <p className="text-3xl font-bold text-white">89%</p>
                <p className="text-xs text-green-400">+12% from baseline</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Avg CTR</p>
                <p className="text-3xl font-bold text-white">20%</p>
                <p className="text-xs text-green-400">+8% from v1</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Sentiment Score</p>
                <p className="text-3xl font-bold text-white">8.7/10</p>
                <p className="text-xs text-green-400">Highly positive</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Narrative Performance */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Narrative Performance by Audience</CardTitle>
            <CardDescription>Comparative metrics across audience segments</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="metric" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Bar dataKey="investor" fill="#3b82f6" name="Investors" />
                <Bar dataKey="users" fill="#10b981" name="Users" />
                <Bar dataKey="enterprise" fill="#f59e0b" name="Enterprise" />
                <Bar dataKey="creator" fill="#8b5cf6" name="Creators" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Narrative Testing */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Narrative Evolution</CardTitle>
            <CardDescription>Performance improvements through iterations</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={testingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="variant" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Bar dataKey="engagement" fill="#3b82f6" name="Engagement %" />
                <Bar dataKey="conversion" fill="#10b981" name="Conversion %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Narrative Selection */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Audience Narratives</CardTitle>
            <CardDescription>Select an audience to view tailored narrative</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {narratives.map(narrative => (
              <button
                key={narrative.id}
                onClick={() => setSelectedNarrative(narrative.id)}
                className={`w-full p-4 rounded-lg border transition text-left ${
                  selectedNarrative === narrative.id
                    ? 'bg-amber-900/50 border-amber-500'
                    : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-white font-medium">{narrative.audience}</p>
                    <p className="text-sm text-gray-400 mt-1">{narrative.title}</p>
                  </div>
                  <Badge variant="outline">{narrative.focus}</Badge>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Engagement: {narrative.engagement * 100}%</span>
                  <span>CTR: {narrative.ctr * 100}%</span>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Detailed Narrative */}
        {selectedNarrativeData && (
          <>
            <Card className="bg-gradient-to-r from-amber-900/50 to-orange-900/50 border-amber-700">
              <CardHeader>
                <CardTitle className="text-white">{selectedNarrativeData.title}</CardTitle>
                <CardDescription>Tailored for {selectedNarrativeData.audience}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-slate-700/50 rounded border border-slate-600">
                  <p className="text-white leading-relaxed">{selectedNarrativeData.variant}</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-slate-700/30 rounded border border-slate-600">
                    <p className="text-xs text-gray-400">Engagement</p>
                    <p className="text-2xl font-bold text-white">{Math.round(selectedNarrativeData.engagement * 100)}%</p>
                  </div>
                  <div className="p-3 bg-slate-700/30 rounded border border-slate-600">
                    <p className="text-xs text-gray-400">Persuasiveness</p>
                    <p className="text-2xl font-bold text-white">{Math.round(selectedNarrativeData.persuasiveness * 100)}%</p>
                  </div>
                  <div className="p-3 bg-slate-700/30 rounded border border-slate-600">
                    <p className="text-xs text-gray-400">CTR</p>
                    <p className="text-2xl font-bold text-white">{Math.round(selectedNarrativeData.ctr * 100)}%</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 bg-amber-600 hover:bg-amber-700">Copy Narrative</Button>
                  <Button variant="outline" className="flex-1">Generate Variants</Button>
                </div>
              </CardContent>
            </Card>

            {/* Narrative Insights */}
            <Card className="bg-gradient-to-r from-amber-900/50 to-yellow-900/50 border-amber-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  Narrative Insights
                </CardTitle>
                <CardDescription>Key findings and recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-slate-700/50 rounded border border-slate-600">
                  <p className="text-sm text-white font-medium">✓ Creator narrative shows highest engagement</p>
                  <p className="text-xs text-gray-400 mt-1">25% CTR - recommend prioritizing creator outreach</p>
                </div>
                <div className="p-3 bg-slate-700/50 rounded border border-slate-600">
                  <p className="text-sm text-white font-medium">✓ Investor narrative emphasizes market opportunity</p>
                  <p className="text-xs text-gray-400 mt-1">94% engagement - strong for fundraising</p>
                </div>
                <div className="p-3 bg-slate-700/50 rounded border border-slate-600">
                  <p className="text-sm text-white font-medium">⚠ Enterprise narrative needs refinement</p>
                  <p className="text-xs text-gray-400 mt-1">Lower CTR (14%) - recommend emphasizing ROI</p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
