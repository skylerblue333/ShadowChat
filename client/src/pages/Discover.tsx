import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Zap, TrendingUp, Users, Sparkles, ArrowRight } from 'lucide-react';

interface Creator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  category: string;
  followers: number;
  engagement: number;
  verified: boolean;
}

interface Trend {
  id: string;
  title: string;
  category: string;
  momentum: number;
  posts: number;
  growth: number;
}

export default function Discover() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const creators: Creator[] = [
    {
      id: '1',
      name: 'Luna Crypto',
      handle: '@lunacrypto',
      avatar: '👩‍💼',
      category: 'Finance',
      followers: 124500,
      engagement: 8.7,
      verified: true,
    },
    {
      id: '2',
      name: 'Tech Visionary',
      handle: '@techvision',
      avatar: '👨‍💻',
      category: 'Technology',
      followers: 89300,
      engagement: 7.2,
      verified: true,
    },
    {
      id: '3',
      name: 'AI Explorer',
      handle: '@aiexplorer',
      avatar: '🤖',
      category: 'AI',
      followers: 156200,
      engagement: 9.1,
      verified: true,
    },
    {
      id: '4',
      name: 'Gaming Pro',
      handle: '@gamingpro',
      avatar: '🎮',
      category: 'Gaming',
      followers: 203400,
      engagement: 8.5,
      verified: true,
    },
    {
      id: '5',
      name: 'Creator Elite',
      handle: '@creatorelite',
      avatar: '🎬',
      category: 'Content',
      followers: 178900,
      engagement: 7.8,
      verified: true,
    },
    {
      id: '6',
      name: 'DeFi Master',
      handle: '@defimaster',
      avatar: '💰',
      category: 'Finance',
      followers: 95600,
      engagement: 8.3,
      verified: false,
    },
  ];

  const trends: Trend[] = [
    {
      id: '1',
      title: 'Web3 Revolution',
      category: 'Technology',
      momentum: 94,
      posts: 12400,
      growth: 23,
    },
    {
      id: '2',
      title: 'AI Gaming Boom',
      category: 'Gaming',
      momentum: 87,
      posts: 9800,
      growth: 18,
    },
    {
      id: '3',
      title: 'Crypto Adoption',
      category: 'Finance',
      momentum: 76,
      posts: 8200,
      growth: 15,
    },
    {
      id: '4',
      title: 'Creator Economy',
      category: 'Content',
      momentum: 82,
      posts: 7600,
      growth: 19,
    },
    {
      id: '5',
      title: 'NFT Renaissance',
      category: 'Digital Art',
      momentum: 71,
      posts: 6400,
      growth: 12,
    },
    {
      id: '6',
      title: 'Social Finance',
      category: 'Finance',
      momentum: 85,
      posts: 9100,
      growth: 21,
    },
  ];

  const categories = ['All', 'Finance', 'Technology', 'Gaming', 'AI', 'Content', 'Art'];

  const filteredCreators = creators.filter((creator) => {
    const matchesSearch =
      creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.handle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || creator.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-black border-b border-purple-500/30 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Discover</h1>
          <p className="text-gray-400 mt-1">Find trending creators, content, and communities</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search creators, trends, communities..."
              className="pl-12 h-12 bg-gray-900/50 border-purple-500/30 text-white placeholder-gray-500"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              onClick={() => setSelectedCategory(cat.toLowerCase())}
              variant={selectedCategory === cat.toLowerCase() ? 'default' : 'outline'}
              className={
                selectedCategory === cat.toLowerCase()
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'border-purple-500 text-purple-400 hover:bg-purple-900/20'
              }
            >
              {cat}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Creators Section */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-purple-400" />
                Top Creators
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCreators.map((creator) => (
                <Card key={creator.id} className="bg-black border-purple-500/30 p-4 hover:border-purple-500/60 transition-all cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{creator.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg">{creator.name}</h3>
                        {creator.verified && <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50 text-xs">✓ Verified</Badge>}
                      </div>
                      <p className="text-gray-400 text-sm">{creator.handle}</p>
                      <p className="text-gray-500 text-xs mt-1">{creator.category}</p>

                      <div className="flex gap-4 mt-3 text-sm">
                        <div>
                          <p className="text-gray-400 text-xs">Followers</p>
                          <p className="font-bold text-purple-400">{(creator.followers / 1000).toFixed(0)}K</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">Engagement</p>
                          <p className="font-bold text-green-400">{creator.engagement}%</p>
                        </div>
                      </div>

                      <Button className="w-full mt-3 bg-purple-600 hover:bg-purple-700 text-sm">Follow</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Trends Section */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-400" />
                Trending Now
              </h2>
            </div>

            <div className="space-y-3">
              {trends.map((trend) => (
                <Card key={trend.id} className="bg-black border-purple-500/30 p-4 hover:border-purple-500/60 transition-all cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold mb-1">{trend.title}</h3>
                      <p className="text-gray-400 text-xs mb-2">{trend.category}</p>
                      <div className="flex gap-3 text-xs">
                        <span className="text-gray-500">{trend.posts.toLocaleString()} posts</span>
                        <span className="text-green-400 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          +{trend.growth}%
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                        <span className="text-lg font-bold">{trend.momentum}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Recommended Section */}
            <div className="mt-8">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Recommended
              </h3>
              <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500/30 p-6">
                <h4 className="font-bold mb-2">Explore Communities</h4>
                <p className="text-gray-400 text-sm mb-4">Join exclusive groups and connect with like-minded creators and investors.</p>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center gap-2">
                  Browse Communities
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
