import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Library, BookMarked, TrendingUp, CheckCircle, Zap } from 'lucide-react';

export default function ProductBrain() {
  const [selectedPlaybook, setSelectedPlaybook] = useState('growth');

  // Playbooks
  const playbooks = [
    {
      id: 'growth',
      name: 'Growth Playbook',
      version: '3.2',
      lastUpdated: '2 days ago',
      usage: 45,
      effectiveness: 0.92,
      sections: [
        'User Acquisition Strategy',
        'Viral Loop Optimization',
        'Referral Program Design',
        'Community Building',
        'Content Strategy',
      ],
      lessons: [
        'Viral coefficient of 0.65 achievable with proper incentives',
        'Referral programs generate 40% of new users',
        'Community challenges drive 3x engagement',
      ],
    },
    {
      id: 'monetization',
      name: 'Monetization Playbook',
      version: '2.8',
      lastUpdated: '5 days ago',
      usage: 32,
      effectiveness: 0.88,
      sections: [
        'Pricing Strategy',
        'Subscription Tiers',
        'In-App Purchases',
        'Creator Revenue Sharing',
        'Enterprise Licensing',
      ],
      lessons: [
        'Freemium model generates 3x more users',
        'Premium tier conversion: 8-12%',
        'Creator revenue sharing improves retention by 25%',
      ],
    },
    {
      id: 'retention',
      name: 'Retention Playbook',
      version: '2.5',
      lastUpdated: '1 week ago',
      usage: 28,
      effectiveness: 0.85,
      sections: [
        'Engagement Mechanics',
        'Gamification Strategy',
        'Personalization Engine',
        'Churn Prevention',
        'Win-Back Campaigns',
      ],
      lessons: [
        'Gamification increases retention by 35%',
        'Daily active users correlate with 5x LTV',
        'Personalized notifications improve engagement by 40%',
      ],
    },
    {
      id: 'product',
      name: 'Product Development Playbook',
      version: '3.0',
      lastUpdated: '3 days ago',
      usage: 38,
      effectiveness: 0.90,
      sections: [
        'Feature Prioritization',
        'User Research',
        'MVP Development',
        'Launch Strategy',
        'Post-Launch Optimization',
      ],
      lessons: [
        'User research reduces feature failures by 60%',
        'MVP launch time: 2-3 weeks',
        'Post-launch optimization generates 20% improvement',
      ],
    },
  ];

  // Memory bank stats
  const memoryStats = [
    { category: 'Playbooks', count: 12, updated: '2 days ago' },
    { category: 'Lessons Learned', count: 156, updated: '1 day ago' },
    { category: 'Case Studies', count: 34, updated: '3 days ago' },
    { category: 'Best Practices', count: 89, updated: '2 days ago' },
  ];

  // Usage trends
  const usageData = [
    { week: 'Week 1', growth: 12, monetization: 8, retention: 7, product: 10 },
    { week: 'Week 2', growth: 18, monetization: 11, retention: 9, product: 14 },
    { week: 'Week 3', growth: 25, monetization: 15, retention: 12, product: 18 },
    { week: 'Week 4', growth: 45, monetization: 32, retention: 28, product: 38 },
  ];

  const selectedPlaybookData = playbooks.find(p => p.id === selectedPlaybook);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Library className="w-8 h-8 text-indigo-400" />
            <h1 className="text-4xl font-bold text-white">Product Brain</h1>
          </div>
          <p className="text-gray-400">Institutional memory, playbooks, and versioned knowledge base</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Total Playbooks</p>
                <p className="text-3xl font-bold text-white">12</p>
                <p className="text-xs text-blue-400">All active</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Lessons Captured</p>
                <p className="text-3xl font-bold text-white">156</p>
                <p className="text-xs text-green-400">+23 this month</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Avg Effectiveness</p>
                <p className="text-3xl font-bold text-white">89%</p>
                <p className="text-xs text-green-400">High impact</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Usage This Month</p>
                <p className="text-3xl font-bold text-white">143</p>
                <p className="text-xs text-blue-400">+45% from last month</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Memory Bank */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Knowledge Base</CardTitle>
            <CardDescription>Institutional memory and documented learnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              {memoryStats.map(stat => (
                <div key={stat.category} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                  <p className="text-sm text-gray-400">{stat.category}</p>
                  <p className="text-3xl font-bold text-white mt-2">{stat.count}</p>
                  <p className="text-xs text-gray-400 mt-2">Updated {stat.updated}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Usage Trends */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Playbook Usage Trends</CardTitle>
            <CardDescription>Weekly usage of playbooks over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="week" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Bar dataKey="growth" fill="#3b82f6" name="Growth" />
                <Bar dataKey="monetization" fill="#10b981" name="Monetization" />
                <Bar dataKey="retention" fill="#f59e0b" name="Retention" />
                <Bar dataKey="product" fill="#8b5cf6" name="Product" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Playbook Selection */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Playbooks</CardTitle>
            <CardDescription>Select a playbook to view details and lessons</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {playbooks.map(playbook => (
              <button
                key={playbook.id}
                onClick={() => setSelectedPlaybook(playbook.id)}
                className={`w-full p-4 rounded-lg border transition text-left ${
                  selectedPlaybook === playbook.id
                    ? 'bg-indigo-900/50 border-indigo-500'
                    : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-white font-medium">{playbook.name}</p>
                    <p className="text-xs text-gray-400 mt-1">v{playbook.version} • Updated {playbook.lastUpdated}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{playbook.usage} uses</Badge>
                    <Badge className="bg-green-900 text-green-300">{Math.round(playbook.effectiveness * 100)}%</Badge>
                  </div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Detailed Playbook */}
        {selectedPlaybookData && (
          <>
            <Card className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border-indigo-700">
              <CardHeader>
                <CardTitle className="text-white">{selectedPlaybookData.name}</CardTitle>
                <CardDescription>v{selectedPlaybookData.version} • Last updated {selectedPlaybookData.lastUpdated}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-slate-700/50 rounded border border-slate-600">
                    <p className="text-xs text-gray-400">Usage Count</p>
                    <p className="text-2xl font-bold text-white">{selectedPlaybookData.usage}</p>
                  </div>
                  <div className="p-3 bg-slate-700/50 rounded border border-slate-600">
                    <p className="text-xs text-gray-400">Effectiveness</p>
                    <p className="text-2xl font-bold text-white">{Math.round(selectedPlaybookData.effectiveness * 100)}%</p>
                  </div>
                  <div className="p-3 bg-slate-700/50 rounded border border-slate-600">
                    <p className="text-xs text-gray-400">Sections</p>
                    <p className="text-2xl font-bold text-white">{selectedPlaybookData.sections.length}</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-700/30 rounded border border-slate-600">
                  <p className="text-sm text-white font-medium mb-3">Playbook Sections</p>
                  <ul className="space-y-2">
                    {selectedPlaybookData.sections.map((section, idx) => (
                      <li key={idx} className="text-sm text-gray-300 flex items-center gap-2">
                        <BookMarked className="w-4 h-4 text-indigo-400" />
                        {section}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-slate-700/30 rounded border border-slate-600">
                  <p className="text-sm text-white font-medium mb-3">Key Lessons Learned</p>
                  <ul className="space-y-2">
                    {selectedPlaybookData.lessons.map((lesson, idx) => (
                      <li key={idx} className="text-sm text-gray-300 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        {lesson}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700">View Full Playbook</Button>
                  <Button variant="outline" className="flex-1">Create New Version</Button>
                </div>
              </CardContent>
            </Card>

            {/* Product Brain Insights */}
            <Card className="bg-gradient-to-r from-indigo-900/50 to-blue-900/50 border-indigo-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  Product Brain Insights
                </CardTitle>
                <CardDescription>Institutional knowledge and strategic recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-slate-700/50 rounded border border-slate-600">
                  <p className="text-sm text-white font-medium">✓ Growth playbook driving 45 implementations</p>
                  <p className="text-xs text-gray-400 mt-1">Highest adoption rate among all playbooks</p>
                </div>
                <div className="p-3 bg-slate-700/50 rounded border border-slate-600">
                  <p className="text-sm text-white font-medium">✓ 156 lessons captured from product decisions</p>
                  <p className="text-xs text-gray-400 mt-1">Creating institutional knowledge base for future teams</p>
                </div>
                <div className="p-3 bg-slate-700/50 rounded border border-slate-600">
                  <p className="text-sm text-white font-medium">✓ Playbook effectiveness averaging 89%</p>
                  <p className="text-xs text-gray-400 mt-1">Proven frameworks driving consistent results</p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
