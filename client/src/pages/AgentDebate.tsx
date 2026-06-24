import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Brain, Users, Zap, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';

export default function AgentDebate() {
  const [selectedDecision, setSelectedDecision] = useState('mobile-launch');

  // Multi-agent perspectives
  const agents = [
    {
      id: 'product',
      name: 'Product Agent',
      role: 'Product Strategy',
      perspective: 'Mobile launch is critical. User demand is 92%, and competitors are moving fast. We should accelerate to Q2.',
      confidence: 0.94,
      recommendation: 'ACCELERATE',
      reasoning: [
        'User demand: 92%',
        'Market timing: Optimal window',
        'Competitive pressure: High',
        'Resource availability: Sufficient',
      ],
    },
    {
      id: 'engineering',
      name: 'Engineering Agent',
      role: 'Technical Feasibility',
      perspective: 'Mobile launch is feasible but requires careful planning. Current tech debt needs addressing first. Q3 is more realistic.',
      confidence: 0.87,
      recommendation: 'DEFER',
      reasoning: [
        'Tech debt: 3 months to resolve',
        'Team capacity: 70% available',
        'Infrastructure: Needs upgrade',
        'Testing: 4 weeks minimum',
      ],
    },
    {
      id: 'finance',
      name: 'Finance Agent',
      role: 'Financial Impact',
      perspective: 'Q2 launch maximizes revenue potential. Estimated $2.5M additional revenue in 2026. ROI is 450%.',
      confidence: 0.91,
      recommendation: 'ACCELERATE',
      reasoning: [
        'Revenue potential: $2.5M',
        'Development cost: $500K',
        'ROI: 450%',
        'Payback period: 3 months',
      ],
    },
    {
      id: 'customer',
      name: 'Customer Agent',
      role: 'Customer Success',
      perspective: 'Customers are asking for mobile daily. Support tickets up 45%. Launch ASAP to reduce churn.',
      confidence: 0.89,
      recommendation: 'ACCELERATE',
      reasoning: [
        'Support tickets: +45%',
        'Churn risk: High',
        'Customer satisfaction: 72%',
        'Retention impact: +25%',
      ],
    },
  ];

  // Decision scenarios
  const decisions = [
    {
      id: 'mobile-launch',
      title: 'Mobile App Launch Timeline',
      description: 'Should we launch mobile in Q2 or defer to Q3?',
      consensus: 'ACCELERATE (75% agreement)',
      finalDecision: 'Launch in Q2 with phased rollout',
    },
    {
      id: 'pricing-change',
      title: 'Pricing Model Change',
      description: 'Implement usage-based pricing vs fixed tiers?',
      consensus: 'MIXED (50% agreement)',
      finalDecision: 'Hybrid model with A/B testing',
    },
    {
      id: 'market-expansion',
      title: 'Geographic Expansion',
      description: 'Expand to Asia-Pacific in 2026?',
      consensus: 'STRONG CONSENSUS (88% agreement)',
      finalDecision: 'Approved for Q3 2026 launch',
    },
  ];

  // Agent capability scores
  const capabilityData = [
    { category: 'Strategic Thinking', product: 95, engineering: 85, finance: 92, customer: 80 },
    { category: 'Data Analysis', product: 88, engineering: 92, finance: 96, customer: 75 },
    { category: 'Risk Assessment', product: 90, engineering: 88, finance: 94, customer: 82 },
    { category: 'Innovation', product: 94, engineering: 91, finance: 78, customer: 85 },
    { category: 'Execution', product: 85, engineering: 96, finance: 80, customer: 88 },
  ];

  // Consensus metrics
  const consensusData = [
    { name: 'Agreement Level', value: 75 },
    { name: 'Confidence', value: 90 },
    { name: 'Recommendation Strength', value: 82 },
  ];

  const selectedDecisionData = decisions.find(d => d.id === selectedDecision);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">Agent Debate</h1>
          </div>
          <p className="text-gray-400">Multi-perspective decision-making with transparent agent reasoning</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Active Agents</p>
                <p className="text-3xl font-bold text-white">4</p>
                <p className="text-xs text-purple-400">All perspectives covered</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Avg Confidence</p>
                <p className="text-3xl font-bold text-white">90%</p>
                <p className="text-xs text-green-400">High confidence</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Consensus Level</p>
                <p className="text-3xl font-bold text-white">75%</p>
                <p className="text-xs text-blue-400">Strong agreement</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Decisions Made</p>
                <p className="text-3xl font-bold text-white">127</p>
                <p className="text-xs text-green-400">+15 this month</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Decision Selection */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Decisions</CardTitle>
            <CardDescription>Select a decision to view agent perspectives</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {decisions.map(decision => (
                <button
                  key={decision.id}
                  onClick={() => setSelectedDecision(decision.id)}
                  className={`w-full p-4 rounded-lg border transition text-left ${
                    selectedDecision === decision.id
                      ? 'bg-purple-900/50 border-purple-500'
                      : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-white font-medium">{decision.title}</p>
                      <p className="text-sm text-gray-400 mt-1">{decision.description}</p>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {decision.consensus}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Agent Perspectives */}
        {selectedDecisionData && (
          <>
            <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-700">
              <CardHeader>
                <CardTitle className="text-white">{selectedDecisionData.title}</CardTitle>
                <CardDescription>{selectedDecisionData.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-slate-700/50 rounded border border-slate-600">
                  <p className="text-sm text-white font-medium">Final Decision</p>
                  <p className="text-lg text-green-400 font-bold mt-2">{selectedDecisionData.finalDecision}</p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Agent Perspectives */}
              <div className="space-y-4">
                {agents.map(agent => (
                  <Card key={agent.id} className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-white text-lg">{agent.name}</CardTitle>
                          <CardDescription>{agent.role}</CardDescription>
                        </div>
                        <Badge 
                          className={
                            agent.recommendation === 'ACCELERATE' 
                              ? 'bg-green-900 text-green-300'
                              : agent.recommendation === 'DEFER'
                              ? 'bg-yellow-900 text-yellow-300'
                              : 'bg-blue-900 text-blue-300'
                          }
                        >
                          {agent.recommendation}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-300">{agent.perspective}</p>
                      
                      <div className="space-y-2">
                        <p className="text-xs text-gray-400 font-medium">Confidence: {Math.round(agent.confidence * 100)}%</p>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full" 
                            style={{ width: `${agent.confidence * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs text-gray-400 font-medium">Key Reasoning:</p>
                        <ul className="space-y-1">
                          {agent.reasoning.map((reason, idx) => (
                            <li key={idx} className="text-xs text-gray-300 flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 text-green-400" />
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Capability Radar */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Agent Capabilities</CardTitle>
                  <CardDescription>Comparative analysis across dimensions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={capabilityData}>
                      <PolarGrid stroke="#374151" />
                      <PolarAngleAxis dataKey="category" stroke="#9ca3af" />
                      <PolarRadiusAxis stroke="#9ca3af" />
                      <Radar name="Product" dataKey="product" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.25} />
                      <Radar name="Engineering" dataKey="engineering" stroke="#10b981" fill="#10b981" fillOpacity={0.25} />
                      <Radar name="Finance" dataKey="finance" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.25} />
                      <Radar name="Customer" dataKey="customer" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.25} />
                      <Legend />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                        labelStyle={{ color: '#fff' }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Consensus Analysis */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Consensus Analysis</CardTitle>
                <CardDescription>Agreement level and recommendation strength</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {consensusData.map(item => (
                    <div key={item.name} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                      <p className="text-sm text-gray-400 mb-2">{item.name}</p>
                      <p className="text-3xl font-bold text-white mb-2">{item.value}%</p>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full" 
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Debate Insights */}
        <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Debate Insights
            </CardTitle>
            <CardDescription>Key findings from multi-agent analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-slate-700/50 rounded border border-slate-600">
              <p className="text-sm text-white font-medium">✓ Strong consensus on acceleration</p>
              <p className="text-xs text-gray-400 mt-1">3 of 4 agents recommend moving forward immediately</p>
            </div>
            <div className="p-3 bg-slate-700/50 rounded border border-slate-600">
              <p className="text-sm text-white font-medium">⚠ Engineering concerns identified</p>
              <p className="text-xs text-gray-400 mt-1">Tech debt mitigation plan needed before launch</p>
            </div>
            <div className="p-3 bg-slate-700/50 rounded border border-slate-600">
              <p className="text-sm text-white font-medium">✓ Strong financial case</p>
              <p className="text-xs text-gray-400 mt-1">450% ROI justifies resource allocation</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
