import React, { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

export default function DigitalTwin() {
  const { data: twin, isLoading } = trpc.hopeIntelligence.twin.get.useQuery();
  const [activeTab, setActiveTab] = useState<'growth' | 'predictions' | 'relationships'>('growth');

  if (isLoading) return <Spinner />;

  const growthTimeline = [
    { month: 'Jun 2026', level: 1, achievements: 3, xp: 150 },
    { month: 'Jul 2026', level: 2, achievements: 8, xp: 520 },
    { month: 'Aug 2026', level: 3, achievements: 15, xp: 1200 },
    { month: 'Sep 2026', level: 4, achievements: 24, xp: 2100 },
    { month: 'Oct 2026', level: 5, achievements: 35, xp: 3500 },
  ];

  const predictions = [
    { title: 'Wealth Architect', probability: 85, timeframe: '6 months' },
    { title: 'Master Builder', probability: 72, timeframe: '9 months' },
    { title: 'Ecosystem Legend', probability: 58, timeframe: '12 months' },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">DIGITAL TWIN</h1>
          <p className="text-gray-400">Your AI reflection — personality, growth, and future paths</p>
        </div>

        {/* Twin Profile */}
        <div className="grid grid-cols-3 gap-8 mb-12">
          <Card className="bg-gray-900 border-gray-800 p-8 col-span-1">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-4xl">
                🤖
              </div>
              <h2 className="text-2xl font-bold mb-2">{'Your Twin'}</h2>
              <Badge className="bg-cyan-600 mb-4">Level {(twin as any)?.level || 1}</Badge>
              <p className="text-gray-400 text-sm mb-4">{(twin as any)?.archetype || 'Explorer'}</p>
              <p className="text-sm text-gray-500">{(twin as any)?.xp || 0} XP</p>
            </div>
          </Card>

          <Card className="bg-gray-900 border-gray-800 p-8 col-span-2">
            <h3 className="text-xl font-bold mb-6">PERSONALITY TRAITS</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { trait: 'Curiosity', score: 85 },
                { trait: 'Ambition', score: 92 },
                { trait: 'Collaboration', score: 78 },
                { trait: 'Innovation', score: 88 },
                { trait: 'Resilience', score: 81 },
                { trait: 'Leadership', score: 75 },
              ].map((item) => (
                <div key={item.trait}>
                  <p className="text-sm text-gray-400 mb-2">{item.trait}</p>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-cyan-500 h-2 rounded-full"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{item.score}%</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          {(['growth', 'predictions', 'relationships'] as const).map((tab) => (
            <Button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={tab === activeTab ? 'bg-cyan-600' : 'bg-gray-700'}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'growth' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">GROWTH TIMELINE</h3>
            {growthTimeline.map((entry, i) => (
              <Card key={i} className="bg-gray-900 border-gray-800 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-lg">{entry.month}</h4>
                    <p className="text-gray-400">Level {entry.level} • {entry.achievements} achievements</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-cyan-400">+{entry.level * 100} XP</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'predictions' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">FUTURE PATHS</h3>
            {predictions.map((pred, i) => (
              <Card key={i} className="bg-gray-900 border-gray-800 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-lg">{pred.title}</h4>
                    <p className="text-gray-400">Projected: {pred.timeframe}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-purple-400">{pred.probability}%</p>
                    <p className="text-xs text-gray-500">probability</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'relationships' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">KEY RELATIONSHIPS</h3>
            {[
              { name: 'HOPE AI', type: 'Companion', strength: 95 },
              { name: 'Community', type: 'Network', strength: 72 },
              { name: 'Mentors', type: 'Guides', strength: 68 },
            ].map((rel, i) => (
              <Card key={i} className="bg-gray-900 border-gray-800 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-lg">{rel.name}</h4>
                    <p className="text-gray-400">{rel.type}</p>
                  </div>
                  <div className="w-24 bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full"
                      style={{ width: `${rel.strength}%` }}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
