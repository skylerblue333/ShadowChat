import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Play, Upload, Heart, MessageCircle, Share2, Flame } from 'lucide-react';
import { useAuth } from '@/_core/hooks/useAuth';

export default function VideoArea() {
  const { user } = useAuth();
  const [tab, setTab] = useState<'trending' | 'live' | 'following'>('trending');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: videos, isLoading } = trpc.video.listVideos.useQuery({ limit: 20 });
  const { data: liveStreams } = trpc.video.getTrending.useQuery({ limit: 4 });
  const uploadMutation = trpc.video.uploadVideo.useMutation();

  const filteredVideos = videos?.filter(
    (v: any) =>
      v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file) {
        // In real app, upload to S3 first, then call uploadMutation with URL
        uploadMutation.mutate({
          title: file.name,
          description: 'New video upload',
          videoUrl: 'https://example.com/video.mp4',
          videoKey: `video-${Date.now()}`,
          category: 'General',
          thumbnailUrl: 'https://example.com/thumb.jpg',
        });
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Play className="w-10 h-10 text-cyan-400" />
              Video Area
            </h1>
            <p className="text-gray-400">Watch, upload, and share videos with the community</p>
          </div>
          <Button
            onClick={handleUpload}
            disabled={uploadMutation.isPending}
            className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploadMutation.isPending ? 'Uploading...' : 'Upload Video'}
          </Button>
        </div>

        {/* Search */}
        <div className="mb-8">
          <Input
            placeholder="Search videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-900 border-gray-700 text-white"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-700">
          {(['trending', 'live', 'following'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-3 px-4 font-semibold transition-colors ${
                tab === t
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t === 'trending' && '🔥 Trending'}
              {t === 'live' && '🔴 Live Now'}
              {t === 'following' && '👥 Following'}
            </button>
          ))}
        </div>

        {/* Live Streams Banner */}
        {tab === 'live' && liveStreams && liveStreams.length > 0 && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {liveStreams?.map((stream: any) => (
              <Card
                key={stream.id}
                className="bg-gradient-to-br from-red-900/30 to-red-950/30 border-red-700/50 overflow-hidden cursor-pointer hover:border-red-500 transition-all"
              >
                <div className="relative">
                  <div className="w-full h-32 bg-gradient-to-br from-red-600/20 to-red-900/20 flex items-center justify-center">
                    <Play className="w-12 h-12 text-red-400" />
                  </div>
                  <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    LIVE
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-bold text-white text-sm">{stream.title}</h4>
                  <p className="text-xs text-red-400">{stream.viewers} watching</p>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Videos Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          </div>
        ) : filteredVideos.length === 0 ? (
          <Card className="bg-gray-900 border-gray-700 p-12 text-center">
            <p className="text-gray-400">No videos found. Be the first to upload!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredVideos?.map((video: any) => (
              <Card
                key={video.id}
                className="bg-gray-900 border-gray-700 overflow-hidden hover:border-cyan-500/50 transition-all cursor-pointer group"
              >
                {/* Thumbnail */}
                <div className="relative w-full h-40 bg-gradient-to-br from-cyan-600/20 to-purple-600/20 flex items-center justify-center overflow-hidden">
                  {video.thumbnailUrl ? (
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                  ) : (
                    <Play className="w-12 h-12 text-gray-600" />
                  )}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                  {video.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs font-semibold">
                      {video.duration}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  <h3 className="font-bold text-white text-sm mb-1 line-clamp-2">{video.title}</h3>
                  <p className="text-xs text-gray-400 mb-2">{video.channelName}</p>

                  {/* Stats */}
                  <div className="flex gap-3 text-xs text-gray-400 mb-3">
                    <span>{video.views} views</span>
                    <span>{video.uploadedAt}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded text-xs">
                      <Heart className="w-3 h-3" />
                      {video.likes}
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded text-xs">
                      <MessageCircle className="w-3 h-3" />
                      {video.comments}
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded text-xs">
                      <Share2 className="w-3 h-3" />
                    </button>
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
