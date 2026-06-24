import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Zap, TrendingUp, Users, DollarSign, CheckCircle } from 'lucide-react';

export default function CompanySimulator() {
  const [selectedScenario, setSelectedScenario] = useState('baseline');

  // Simulation scenarios
  const scenarios = [
    {
      id: 'baseline',
      name: 'Baseline (Current Path)',
      description: 'Continue with current strategy',
      year5Revenue: 850,
      year5Users: 45,
      year5Valuation: 8500,
      assumptions: [
        'Growth rate: 45% YoY',
        'Churn rate: 5%',
        'ARPU growth: 15% YoY',
        'Market expansion: 3 regions',
      ],
    },
    {
      id: 'aggressive',
      name: 'Aggressive Growth',
      description: 'Double marketing spend, accelerate features',
      year5Revenue: 1250,
      year5Users: 72,
      year5Valuation: 12500,
      assumptions: [
        'Growth rate: 65% YoY',
        'Churn rate: 6%',
        'ARPU growth: 20% YoY',
        'Market expansion: 6 regions',
      ],
    },
    {
      id: 'conservative',
      name: 'Conservative (Profitable)',
      description: 'Focus on profitability and retention',
      year5Revenue: 620,
      year5Users: 28,
      year5Valuation: 6200,
      assumptions: [
        'Growth rate: 25% YoY',
        'Churn rate: 3%',
        'ARPU growth: 25% YoY',
        'Market expansion: 2 regions',
      ],
    },
    {
      id: 'pivot',
      name: 'Enterprise Pivot',
      description: 'Focus on enterprise segment',
      year5Revenue: 950,
      year5Users: 15,
      year5Valuation: 9500,
      assumptions: [
        'Growth rate: 35% YoY',
        'Churn rate: 2%',
        'ARPU growth: 40% YoY',
        'Market expansion: 1 region (enterprise)',
      ],
    },
  ];

  // Simulation results
  const simulationData = [
    { year: 'Year 1', baseline: 120, aggressive: 180, conservative: 85, pivot: 140 },
    { year: 'Year 2', baseline: 174, aggressive: 297, conservative: 106, pivot: 189 },
    { year: 'Year 3', baseline: 253, aggressive: 486, conservative: 133, pivot: 263 },
    { year: 'Year 4', baseline: 367, aggressive: 794, conservative: 166, pivot: 356 },
    { year: 'Year 5', baseline: 533, aggressive: 1291, conservative: 207, pivot: 481 },
  ];

  // User growth comparison
  const userGrowthData = [
    { year: 'Year 1', baseline: 8, aggressive: 12, conservative: 5, pivot: 3 },
    { year: 'Year 2', baseline: 12, aggressive: 20, conservative: 6, pivot: 4 },
    { year: 'Year 3', baseline: 17, aggressive: 33, conservative: 8, pivot: 5 },
    { year: 'Year 4', baseline: 25, aggressive: 54, conservative: 10, pivot: 7 },
    { year: 'Year 5', baseline: 36, aggressive: 88, conservative: 13, pivot: 10 },
  ];

  const selectedScenarioData = scenarios.find(s => s.id === selectedScenario);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Zap className="w-8 h-8 text-orange-400" />
            <h1 className="text-4xl font-bold text-white">Company Simulator</h1>
          </div>
          <p className="text-gray-400">Full organization simulation from single strategic prompt</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Scenarios Simulated</p>
                <p className="text-3xl font-bold text-white">4</p>
                <p className="text-xs text-blue-400">All 5-year projections</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Best Case (Year 5)</p>
                <p className="text-3xl font-bold text-white">$1.3B</p>
                <p className="text-xs text-green-400">Aggressive growth</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Baseline (Year 5)</p>
                <p className="text-3xl font-bold text-white">$850M</p>
                <p className="text-xs text-blue-400">Current path</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Simulations Run</p>
                <p className="text-3xl font-bold text-white">1,247</p>
                <p className="text-xs text-purple-400">This quarter</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Projections */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">5-Year Revenue Projections</CardTitle>
            <CardDescription>Scenario comparison across all strategies</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={simulationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="year" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" label={{ value: 'Revenue ($M)', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#fff' }}
                  formatter={(value) => `$${value}M`}
                />
                <Legend />
                <Line type="monotone" dataKey="baseline" stroke="#3b82f6" strokeWidth={2} name="Baseline" />
                <Line type="monotone" dataKey="aggressive" stroke="#10b981" strokeWidth={2} name="Aggressive" />
                <Line type="monotone" dataKey="conservative" stroke="#f59e0b" strokeWidth={2} name="Conservative" />
                <Line type="monotone" dataKey="pivot" stroke="#8b5cf6" strokeWidth={2} name="Enterprise Pivot" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Growth */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">User Growth Projections</CardTitle>
            <CardDescription>5-year user base growth by scenario</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="year" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" label={{ value: 'Users (Millions)', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#fff' }}
                  formatter={(value) => `${value}M`}
                />
                <Legend />
                <Bar dataKey="baseline" fill="#3b82f6" name="Baseline" />
                <Bar dataKey="aggressive" fill="#10b981" name="Aggressive" />
                <Bar dataKey="conservative" fill="#f59e0b" name="Conservative" />
                <Bar dataKey="pivot" fill="#8b5cf6" name="Enterprise Pivot" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Scenario Selection */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Strategic Scenarios</CardTitle>
            <CardDescription>Select a scenario to view detailed projections</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {scenarios.map(scenario => (
              <button
                key={scenario.id}
                onClick={() => setSelectedScenario(scenario.id)}
                className={`w-full p-4 rounded-lg border transition text-left ${
                  selectedScenario === scenario.id
                    ? 'bg-orange-900/50 border-orange-500'
                    : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-white font-medium">{scenario.name}</p>
                    <p className="text-xs text-gray-400 mt-1">{scenario.description}</p>
                  </div>
                  <Badge variant="outline">${scenario.year5Revenue}M Year 5</Badge>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Detailed Scenario Analysis */}
        {selectedScenarioData && (
          <>
            <Card className="bg-gradient-to-r from-orange-900/50 to-yellow-900/50 border-orange-700">
              <CardHeader>
                <CardTitle className="text-white">{selectedScenarioData.name}</CardTitle>
                <CardDescription>{selectedScenarioData.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-700/50 rounded border border-slate-600">
                    <p className="text-xs text-gray-400">Year 5 Revenue</p>
                    <p className="text-3xl font-bold text-white">${selectedScenarioData.year5Revenue}M</p>
                  </div>
                  <div className="p-4 bg-slate-700/50 rounded border border-slate-600">
                    <p className="text-xs text-gray-400">Year 5 Users</p>
                    <p className="text-3xl font-bold text-white">{selectedScenarioData.year5Users}M</p>
                  </div>
                  <div className="p-4 bg-slate-700/50 rounded border border-slate-600">
                    <p className="text-xs text-gray-400">Year 5 Valuation</p>
                    <p className="text-3xl font-bold text-white">${selectedScenarioData.year5Valuation}B</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-700/30 rounded border border-slate-600">
                  <p className="text-sm text-white font-medium mb-3">Key Assumptions</p>
                  <ul className="space-y-2">
                    {selectedScenarioData.assumptions.map((assumption, idx) => (
                      <li key={idx} className="text-sm text-gray-300 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        {assumption}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Simulation Insights */}
            <Card className="bg-gradient-to-r from-orange-900/50 to-red-900/50 border-orange-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-yellow-400" />
                  Simulation Insights
                </CardTitle>
                <CardDescription>Strategic recommendations from full org simulation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-slate-700/50 rounded border border-slate-600">
                  <p className="text-sm text-white font-medium">✓ Aggressive growth scenario shows 52% higher revenue</p>
                  <p className="text-xs text-gray-400 mt-1">Requires 2x marketing spend but achieves $1.3B by Year 5</p>
                </div>
                <div className="p-3 bg-slate-700/50 rounded border border-slate-600">
                  <p className="text-sm text-white font-medium">✓ Enterprise pivot maintains profitability</p>
                  <p className="text-xs text-gray-400 mt-1">Lower user growth but 40% ARPU increase offsets volume</p>
                </div>
                <div className="p-3 bg-slate-700/50 rounded border border-slate-600">
                  <p className="text-sm text-white font-medium">✓ Baseline path is sustainable and achievable</p>
                  <p className="text-xs text-gray-400 mt-1">$850M revenue, 36M users - balanced risk/reward</p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
