import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TranslationLayer } from "@/components/TranslationLayer";
import { Heart, MessageCircle, Share2, Globe, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface Post {
  id: string;
  author: string;
  avatar: string;
  language: string;
  content: string;
  timestamp: Date;
  likes: number;
  comments: number;
  liked: boolean;
  translationEnabled: boolean;
  sourceLanguage: string;
  targetLanguage: string;
}

const MOCK_POSTS: Post[] = [
  {
    id: "p1",
    author: "李明",
    avatar: "🇨🇳",
    language: "Chinese",
    content: "今天天气真好！我在公园里散步，看到了很多美丽的花朵。",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 234,
    comments: 45,
    liked: false,
    translationEnabled: true,
    sourceLanguage: "Chinese",
    targetLanguage: "English",
  },
  {
    id: "p2",
    author: "Maria García",
    avatar: "🇪🇸",
    language: "Spanish",
    content: "¡Acabo de terminar mi clase de inglés! Fue muy divertido practicar con mis compañeros.",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    likes: 156,
    comments: 32,
    liked: false,
    translationEnabled: true,
    sourceLanguage: "Spanish",
    targetLanguage: "English",
  },
  {
    id: "p3",
    author: "Yuki Tanaka",
    avatar: "🇯🇵",
    language: "Japanese",
    content: "新しいプロジェクトに取り組んでいます。言語学習と技術の融合は本当に興味深いです。",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    likes: 189,
    comments: 28,
    liked: false,
    translationEnabled: true,
    sourceLanguage: "Japanese",
    targetLanguage: "English",
  },
  {
    id: "p4",
    author: "Pierre Dubois",
    avatar: "🇫🇷",
    language: "French",
    content: "La pratique régulière est la clé du succès en apprentissage des langues. Continuons ensemble!",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    likes: 267,
    comments: 51,
    liked: false,
    translationEnabled: true,
    sourceLanguage: "French",
    targetLanguage: "English",
  },
];

export function TranslationEnabledSocialFeed() {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [globalTranslationEnabled, setGlobalTranslationEnabled] = useState(true);
  const [selectedTargetLanguage, setSelectedTargetLanguage] = useState("English");

  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );
  };

  const handleShare = (postId: string) => {
    toast.success("Post shared!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Globe className="w-10 h-10 text-purple-400" />
            Global Social Feed
          </h1>
          <p className="text-gray-400">
            Connect with language learners worldwide with real-time translation
          </p>
        </div>

        {/* Translation Controls */}
        <Card className="bg-slate-800/50 border-slate-700 p-6 mb-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-purple-400" />
              <span className="font-semibold text-white">Translation</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-300">Target Language:</label>
                <select
                  value={selectedTargetLanguage}
                  onChange={(e) => setSelectedTargetLanguage(e.target.value)}
                  className="bg-slate-700 border border-slate-600 text-white px-3 py-1 rounded text-sm"
                >
                  <option>English</option>
                  <option>Spanish</option>
                  <option>Chinese</option>
                  <option>Japanese</option>
                  <option>French</option>
                </select>
              </div>

              <Button
                variant={globalTranslationEnabled ? "default" : "outline"}
                onClick={() => setGlobalTranslationEnabled(!globalTranslationEnabled)}
                className="gap-2"
              >
                {globalTranslationEnabled ? (
                  <>
                    <Eye className="w-4 h-4" />
                    Translations On
                  </>
                ) : (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Translations Off
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post) => (
            <Card
              key={post.id}
              className="bg-slate-800/50 border-slate-700 p-6 hover:border-purple-500/50 transition"
            >
              {/* Post Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{post.avatar}</div>
                  <div>
                    <h3 className="font-bold text-white">{post.author}</h3>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-purple-500/20 text-purple-300 text-xs">
                        {post.language}
                      </Badge>
                      <p className="text-gray-400 text-xs">
                        {post.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>

                {globalTranslationEnabled && (
                  <Badge className="bg-green-500/20 text-green-400">
                    <Globe className="w-3 h-3 mr-1" />
                    Auto-Translated
                  </Badge>
                )}
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <p className="text-gray-200 mb-3">{post.content}</p>

                {/* Translation Layer */}
                {globalTranslationEnabled && (
                  <div className="bg-slate-700/50 border border-slate-600 rounded p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-4 h-4 text-purple-400" />
                      <span className="text-xs text-gray-400">
                        {post.sourceLanguage} → {selectedTargetLanguage}
                      </span>
                    </div>
                    <p className="text-purple-200 text-sm">
                      {post.sourceLanguage === "Chinese" &&
                        "The weather is really nice today! I was taking a walk in the park and saw many beautiful flowers."}
                      {post.sourceLanguage === "Spanish" &&
                        "I just finished my English class! It was very fun to practice with my classmates."}
                      {post.sourceLanguage === "Japanese" &&
                        "I'm working on a new project. The fusion of language learning and technology is really fascinating."}
                      {post.sourceLanguage === "French" &&
                        "Regular practice is the key to success in language learning. Let's continue together!"}
                    </p>
                  </div>
                )}
              </div>

              {/* Engagement Stats */}
              <div className="flex gap-4 mb-4 pb-4 border-t border-slate-700 pt-4 text-sm text-gray-400">
                <span>{post.likes} likes</span>
                <span>{post.comments} comments</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => handleLike(post.id)}
                >
                  <Heart
                    className={`w-4 h-4 ${post.liked ? "fill-red-500 text-red-500" : ""}`}
                  />
                  Like
                </Button>
                <Button variant="outline" className="flex-1 gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Comment
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => handleShare(post.id)}
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TranslationEnabledSocialFeed;
