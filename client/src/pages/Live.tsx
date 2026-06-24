import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { AlertCircle, Heart, MessageCircle, Share2, Eye, Radio } from 'lucide-react';

interface LiveStream {
  id: string;
  title: string;
  streamer: string;
  viewers: number;
  likes: number;
  comments: number;
  status: 'live' | 'ended' | 'scheduled';
  thumbnail: string;
  startTime: number;
  endTime?: number;
  category: string;
}

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: number;
  likes: number;
}

export default function Live() {
  const [activeStream, setActiveStream] = useState<LiveStream | null>(null);
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);

  // Initialize with mock data
  useEffect(() => {
    try {
      const mockStreams: LiveStream[] = [
        {
          id: '1',
          title: 'SKYCOIN4444 Live Trading Session',
          streamer: 'Skyler Spillers',
          viewers: 2543,
          likes: 1200,
          comments: 340,
          status: 'live',
          thumbnail: 'https://via.placeholder.com/400x225?text=LIVE+Trading',
          startTime: Date.now() - 3600000,
          category: 'Finance',
        },
        {
          id: '2',
          title: 'Hope AI Product Demo',
          streamer: 'Hope AI Team',
          viewers: 1890,
          likes: 950,
          comments: 280,
          status: 'live',
          thumbnail: 'https://via.placeholder.com/400x225?text=AI+Demo',
          startTime: Date.now() - 1800000,
          category: 'Technology',
        },
        {
          id: '3',
          title: 'ShadowChat Community Q&A',
          streamer: 'Community Manager',
          viewers: 756,
          likes: 420,
          comments: 150,
          status: 'live',
          thumbnail: 'https://via.placeholder.com/400x225?text=Community+QA',
          startTime: Date.now() - 900000,
          category: 'Community',
        },
      ];

      const mockComments: Comment[] = [
        {
          id: '1',
          author: 'CryptoEnthusiast',
          text: 'Amazing stream! Love the insights on market trends.',
          timestamp: Date.now() - 120000,
          likes: 45,
        },
        {
          id: '2',
          author: 'TechLover',
          text: 'The AI integration is incredible. This is the future!',
          timestamp: Date.now() - 90000,
          likes: 32,
        },
        {
          id: '3',
          author: 'SkyFan',
          text: 'Can\'t wait to see what\'s next for SKYCOIN4444',
          timestamp: Date.now() - 60000,
          likes: 28,
        },
      ];

      setStreams(mockStreams);
      setActiveStream(mockStreams[0]);
      setComments(mockComments);
      setViewerCount(mockStreams[0].viewers);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load live streams. Please try again.');
      setIsLoading(false);
    }
  }, []);

  // Simulate viewer count changes
  useEffect(() => {
    if (!activeStream) return;

    const interval = setInterval(() => {
      setViewerCount((prev) => {
        const change = Math.floor(Math.random() * 100) - 40;
        return Math.max(100, prev + change);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [activeStream]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: String(comments.length + 1),
      author: 'You',
      text: newComment,
      timestamp: Date.now(),
      likes: 0,
    };

    setComments([comment, ...comments]);
    setNewComment('');
  };

  const handleLike = () => {
    setLiked(!liked);
    if (activeStream) {
      setActiveStream({
        ...activeStream,
        likes: activeStream.likes + (liked ? -1 : 1),
      });
    }
  };

  const handleStreamSelect = (stream: LiveStream) => {
    setActiveStream(stream);
    setViewerCount(stream.viewers);
    setComments([]);
    setLiked(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <Spinner className="w-12 h-12 mx-auto mb-4" />
          <p className="text-white">Loading live streams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-black border-b border-purple-500/30 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Radio className="w-6 h-6 text-red-500 animate-pulse" />
            <h1 className="text-2xl font-bold">LIVE</h1>
          </div>
          <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-900">
            Go Live
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-500 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-200">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Stream */}
          <div className="lg:col-span-2">
            {activeStream ? (
              <div className="space-y-4">
                {/* Video Player */}
                <div className="relative bg-black rounded-lg overflow-hidden border border-purple-500/30">
                  <div className="aspect-video bg-gradient-to-br from-purple-900 to-black flex items-center justify-center relative">
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      <span className="text-sm font-bold">LIVE</span>
                    </div>
                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/70 px-3 py-1 rounded-full">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm font-semibold">{viewerCount.toLocaleString()}</span>
                    </div>
                    <div className="text-center">
                      <p className="text-4xl font-bold mb-2">▶</p>
                      <p className="text-gray-400">Live Video Stream</p>
                    </div>
                  </div>
                </div>

                {/* Stream Info */}
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{activeStream.title}</h2>
                    <p className="text-gray-400">by {activeStream.streamer}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 flex-wrap">
                    <Button
                      variant={liked ? 'default' : 'outline'}
                      className={`flex items-center gap-2 ${
                        liked ? 'bg-red-600 hover:bg-red-700' : 'border-purple-500 text-purple-400'
                      }`}
                      onClick={handleLike}
                    >
                      <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                      {activeStream.likes.toLocaleString()}
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2 border-purple-500 text-purple-400">
                      <MessageCircle className="w-5 h-5" />
                      {activeStream.comments.toLocaleString()}
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2 border-purple-500 text-purple-400">
                      <Share2 className="w-5 h-5" />
                      Share
                    </Button>
                  </div>
                </div>

                {/* Comments Section */}
                <Card className="bg-black border-purple-500/30 p-4">
                  <h3 className="text-lg font-bold mb-4">Live Chat</h3>

                  {/* Comment Input */}
                  <div className="flex gap-2 mb-4">
                    <Input
                      placeholder="Say something..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                      className="bg-gray-900 border-gray-700 text-white placeholder-gray-500"
                    />
                    <Button
                      onClick={handleAddComment}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Send
                    </Button>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {comments.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No comments yet. Be the first!</p>
                    ) : (
                      comments.map((comment) => (
                        <div key={comment.id} className="bg-gray-900/50 p-3 rounded border border-gray-800">
                          <div className="flex items-start justify-between mb-1">
                            <p className="font-semibold text-purple-400">{comment.author}</p>
                            <span className="text-xs text-gray-500">
                              {Math.floor((Date.now() - comment.timestamp) / 60000)}m ago
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm mb-2">{comment.text}</p>
                          <button className="text-xs text-gray-500 hover:text-purple-400">
                            👍 {comment.likes}
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </div>
            ) : (
              <div className="bg-gray-900 rounded-lg p-8 text-center">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                <p className="text-gray-400">No active stream selected</p>
              </div>
            )}
          </div>

          {/* Streams List */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Live Streams</h3>
            {streams.map((stream) => (
              <Card
                key={stream.id}
                className={`cursor-pointer transition-all border-2 ${
                  activeStream?.id === stream.id
                    ? 'border-purple-500 bg-purple-900/20'
                    : 'border-gray-700 bg-gray-900/50 hover:border-purple-500/50'
                }`}
                onClick={() => handleStreamSelect(stream)}
              >
                <div className="p-3 space-y-2">
                  <div className="relative">
                    <div className="aspect-video bg-gradient-to-br from-gray-800 to-black rounded overflow-hidden flex items-center justify-center">
                      <span className="text-gray-600">Stream</span>
                    </div>
                    <div className="absolute top-2 left-2 bg-red-600 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      LIVE
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {stream.viewers.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-sm line-clamp-2">{stream.title}</p>
                    <p className="text-xs text-gray-400">{stream.streamer}</p>
                  </div>
                  <div className="flex gap-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" /> {stream.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" /> {stream.comments}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
