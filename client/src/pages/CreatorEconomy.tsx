import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function CreatorEconomy() {
  const [activeTab, setActiveTab] = useState<'tools' | 'guilds' | 'revenue'>('tools');

  const creators = [
    { name: 'Luna', followers: 125000, earnings: 45230, growth: '+32%' },
    { name: 'Alex', followers: 89000, earnings: 32150, growth: '+28%' },
    { name: 'Jordan', followers: 156000, earnings: 67890, growth: '+45%' },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">CREATOR ECONOMY</h1>
          <p className="text-gray-400">AI-powered tools, guilds, and revenue sharing for creators</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          {(['tools', 'guilds', 'revenue'] as const).map((tab) => (
            <Button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={tab === activeTab ? 'bg-cyan-600' : 'bg-gray-700'}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </div>

        {activeTab === 'tools' && (
          <div className="grid grid-cols-3 gap-6 mb-12">
            {[
              { name: 'AI Content Generator', desc: 'Auto-generate posts, videos, captions' },
              { name: 'Analytics Dashboard', desc: 'Real-time engagement and revenue tracking' },
              { name: 'Community Manager', desc: 'AI-powered moderation and engagement' },
            ].map((tool) => (
              <Card key={tool.name} className="bg-gray-900 border-gray-800 p-6">
                <h3 className="font-bold text-lg mb-2">{tool.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{tool.desc}</p>
                <Button className="w-full bg-cyan-600 hover:bg-cyan-700">Use Tool</Button>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'guilds' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">CREATOR GUILDS</h2>
            {[
              { name: 'Gaming Creators', members: 1250, revenue: 125000 },
              { name: 'Music Producers', members: 890, revenue: 98000 },
              { name: 'Tech Educators', members: 650, revenue: 76000 },
            ].map((guild) => (
              <Card key={guild.name} className="bg-gray-900 border-gray-800 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{guild.name}</h3>
                    <p className="text-gray-400">{guild.members} members</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-yellow-400">${guild.revenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">monthly revenue</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'revenue' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">TOP CREATORS</h2>
            {creators.map((creator) => (
              <Card key={creator.name} className="bg-gray-900 border-gray-800 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{creator.name}</h3>
                    <p className="text-gray-400">{creator.followers.toLocaleString()} followers</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-400">${creator.earnings.toLocaleString()}</p>
                    <Badge className="bg-green-600 mt-2">{creator.growth}</Badge>
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
