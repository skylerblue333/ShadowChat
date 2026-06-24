import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Search,
  MoreHorizontal,
  Image,
  Smile,
  Send,
  X,
  Flame,
  TrendingUp,
  Users,
  Bookmark,
} from 'lucide-react';

interface Post {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  content: string;
  media?: string[];
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  liked: boolean;
  bookmarked: boolean;
}

interface Trend {
  id: string;
  title: string;
  posts: number;
  trend: 'up' | 'down';
  category: string;
}

const SocialFeed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: {
        name: 'Alex Chen',
        username: '@alexchen_creator',
        avatar: '👨‍💻',
        verified: true,
      },
      content: 'Just launched my new NFT collection! The response has been incredible 🚀 #NFT #Web3 #Creator',
      media: ['🎨'],
      timestamp: '2 hours ago',
      likes: 12450,
      comments: 892,
      shares: 3421,
      liked: false,
      bookmarked: false,
    },
    {
      id: '2',
      author: {
        name: 'Jordan Smith',
        username: '@jordansmith',
        avatar: '👩‍🎨',
        verified: true,
      },
      content: 'The future of commerce is here. Decentralized, transparent, and fair for everyone. #DeFi #Marketplace',
      media: ['💼'],
      timestamp: '4 hours ago',
      likes: 8934,
      comments: 567,
      shares: 2341,
      liked: false,
      bookmarked: false,
    },
    {
      id: '3',
      author: {
        name: 'Taylor Moon',
        username: '@taylor_moon',
        avatar: '🌙',
        verified: false,
      },
      content: 'Building something amazing with the community. Can\'t wait to share more soon! 🔥',
      media: ['🛠️'],
      timestamp: '6 hours ago',
      likes: 5234,
      comments: 234,
      shares: 1234,
      liked: false,
      bookmarked: false,
    },
  ]);

  const [newPostContent, setNewPostContent] = useState('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const trends: Trend[] = [
    { id: '1', title: '#Web3Revolution', posts: 245000, trend: 'up', category: 'Technology' },
    { id: '2', title: '#CreatorEconomy', posts: 189000, trend: 'up', category: 'Business' },
    { id: '3', title: '#NFTArt', posts: 156000, trend: 'down', category: 'Art' },
    { id: '4', title: '#DeFi', posts: 134000, trend: 'up', category: 'Finance' },
    { id: '5', title: '#Crypto', posts: 98000, trend: 'down', category: 'Technology' },
  ];

  const handleLike = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleBookmark = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, bookmarked: !post.bookmarked } : post
      )
    );
  };

  const handlePostCreate = () => {
    if (newPostContent.trim()) {
      const newPost: Post = {
        id: `${posts.length + 1}`,
        author: {
          name: 'You',
          username: '@yourprofile',
          avatar: '👤',
          verified: false,
        },
        content: newPostContent,
        timestamp: 'just now',
        likes: 0,
        comments: 0,
        shares: 0,
        liked: false,
        bookmarked: false,
      };
      setPosts([newPost, ...posts]);
      setNewPostContent('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6">
              <div className="flex gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg flex-shrink-0">
                  👤
                </div>
                <input
                  type="text"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="What's on your mind?"
                  className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-slate-700 rounded-lg transition">
                    <Image className="h-5 w-5 text-slate-400" />
                  </button>
                  <button className="p-2 hover:bg-slate-700 rounded-lg transition">
                    <Smile className="h-5 w-5 text-slate-400" />
                  </button>
                </div>
                <button
                  onClick={handlePostCreate}
                  disabled={!newPostContent.trim()}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Post
                </button>
              </div>
            </div>

            {/* Posts Feed */}
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6 hover:border-purple-500 transition"
                >
                  {/* Post Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex gap-3 flex-1">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg flex-shrink-0">
                        {post.author.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-bold">{post.author.name}</p>
                          {post.author.verified && (
                            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">
                              ✓
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-slate-400">{post.author.username}</p>
                        <p className="text-xs text-slate-500 mt-1">{post.timestamp}</p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-slate-700 rounded-lg transition">
                      <MoreHorizontal className="h-5 w-5 text-slate-400" />
                    </button>
                  </div>

                  {/* Post Content */}
                  <p className="mb-4 leading-relaxed">{post.content}</p>

                  {/* Media */}
                  {post.media && post.media.length > 0 && (
                    <div className="mb-4 rounded-lg overflow-hidden bg-slate-700/50 p-8 flex items-center justify-center text-6xl">
                      {post.media[0]}
                    </div>
                  )}

                  {/* Post Stats */}
                  <div className="flex items-center justify-between text-sm text-slate-400 mb-4 pb-4 border-b border-slate-700">
                    <div className="flex gap-4">
                      <span>{post.likes.toLocaleString()} likes</span>
                      <span>{post.comments.toLocaleString()} comments</span>
                      <span>{post.shares.toLocaleString()} shares</span>
                    </div>
                  </div>

                  {/* Post Actions */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition ${
                        post.liked
                          ? 'text-red-400 hover:bg-red-500/10'
                          : 'text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${post.liked ? 'fill-red-400' : ''}`} />
                      <span className="text-sm">Like</span>
                    </button>
                    <button
                      onClick={() => setSelectedPost(post)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 text-slate-400 hover:bg-slate-700 rounded-lg transition"
                    >
                      <MessageCircle className="h-5 w-5" />
                      <span className="text-sm">Comment</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-2 text-slate-400 hover:bg-slate-700 rounded-lg transition">
                      <Share2 className="h-5 w-5" />
                      <span className="text-sm">Share</span>
                    </button>
                    <button
                      onClick={() => handleBookmark(post.id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition ${
                        post.bookmarked
                          ? 'text-yellow-400 hover:bg-yellow-500/10'
                          : 'text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      <Bookmark className={`h-5 w-5 ${post.bookmarked ? 'fill-yellow-400' : ''}`} />
                      <span className="text-sm">Save</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search posts, creators..."
                className="w-full bg-slate-800 border border-slate-700 rounded-full pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Trending */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-purple-400" />
                <h2 className="text-xl font-bold">Trending Now</h2>
              </div>
              <div className="space-y-3">
                {trends.map((trend) => (
                  <div
                    key={trend.id}
                    className="p-3 hover:bg-slate-700/50 rounded-lg transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-purple-400">{trend.title}</p>
                      {trend.trend === 'up' ? (
                        <Flame className="h-4 w-4 text-red-400" />
                      ) : (
                        <TrendingUp className="h-4 w-4 text-blue-400" />
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{trend.posts.toLocaleString()} posts</p>
                    <p className="text-xs text-slate-500">{trend.category}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Creators */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-purple-400" />
                <h2 className="text-xl font-bold">Suggested Creators</h2>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Sam Rivera', username: '@samrivera', followers: '234K', avatar: '🎬' },
                  { name: 'Casey Moon', username: '@casey_moon', followers: '189K', avatar: '🌙' },
                  { name: 'Morgan Blake', username: '@morganblake', followers: '156K', avatar: '⚡' },
                ].map((creator, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 hover:bg-slate-700/50 rounded-lg transition">
                    <div className="flex items-center gap-2 flex-1">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm">
                        {creator.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{creator.name}</p>
                        <p className="text-xs text-slate-400">{creator.username}</p>
                      </div>
                    </div>
                    <button className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded-full text-xs font-semibold transition">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comment Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold">Comments</h2>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-2 hover:bg-slate-700 rounded-lg transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Original Post */}
              <div className="mb-6 pb-6 border-b border-slate-700">
                <div className="flex gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm flex-shrink-0">
                    {selectedPost.author.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">{selectedPost.author.name}</p>
                    <p className="text-sm text-slate-400">{selectedPost.author.username}</p>
                  </div>
                </div>
                <p className="text-sm">{selectedPost.content}</p>
              </div>

              {/* Comment Input */}
              <div className="flex gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm flex-shrink-0">
                  👤
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Sample Comments */}
              <div className="space-y-4">
                {[
                  { author: 'Alex Chen', comment: 'This is amazing! 🔥', avatar: '👨‍💻' },
                  { author: 'Jordan Smith', comment: 'Love this project!', avatar: '👩‍🎨' },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs flex-shrink-0">
                      {item.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{item.author}</p>
                      <p className="text-sm text-slate-300">{item.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialFeed;
