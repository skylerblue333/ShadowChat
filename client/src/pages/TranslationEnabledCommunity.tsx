import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Users, MessageSquare, TrendingUp, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  community: string;
  language: string;
  title: string;
  content: string;
  timestamp: Date;
  views: number;
  replies: number;
  upvotes: number;
  sourceLanguage: string;
  targetLanguage: string;
}

const MOCK_COMMUNITIES = [
  {
    id: "c1",
    name: "Chinese Learners",
    members: 2845,
    language: "Chinese",
    description: "Learn and practice Chinese with native speakers",
  },
  {
    id: "c2",
    name: "Spanish Hub",
    members: 3124,
    language: "Spanish",
    description: "Spanish language exchange and cultural discussion",
  },
  {
    id: "c3",
    name: "Japanese Enthusiasts",
    members: 1956,
    language: "Japanese",
    description: "Explore Japanese language and culture",
  },
];

const MOCK_POSTS: CommunityPost[] = [
  {
    id: "p1",
    author: "李明",
    avatar: "🇨🇳",
    community: "Chinese Learners",
    language: "Chinese",
    title: "学习汉语的最佳方法是什么？",
    content: "我想知道如何更有效地学习汉语。有什么建议吗？我已经学了6个月了。",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    views: 342,
    replies: 18,
    upvotes: 89,
    sourceLanguage: "Chinese",
    targetLanguage: "English",
  },
  {
    id: "p2",
    author: "Maria García",
    avatar: "🇪🇸",
    community: "Spanish Hub",
    language: "Spanish",
    title: "¿Cuál es la mejor forma de practicar la pronunciación?",
    content: "Estoy buscando formas efectivas de mejorar mi pronunciación en español. ¿Alguien tiene sugerencias?",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    views: 256,
    replies: 24,
    upvotes: 112,
    sourceLanguage: "Spanish",
    targetLanguage: "English",
  },
  {
    id: "p3",
    author: "Yuki Tanaka",
    avatar: "🇯🇵",
    community: "Japanese Enthusiasts",
    language: "Japanese",
    title: "日本語の敬語について",
    content: "敬語の使い方がまだ難しいです。実践的な例を教えてもらえますか？",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    views: 198,
    replies: 15,
    upvotes: 76,
    sourceLanguage: "Japanese",
    targetLanguage: "English",
  },
];

export function TranslationEnabledCommunity() {
  const [selectedCommunity, setSelectedCommunity] = useState(MOCK_COMMUNITIES[0]);
  const [translationEnabled, setTranslationEnabled] = useState(true);
  const [targetLanguage, setTargetLanguage] = useState("English");

  const getTranslation = (sourceLanguage: string, content: string): string => {
    const translations: Record<string, Record<string, string>> = {
      Chinese: {
        "学习汉语的最佳方法是什么？":
          "What is the best way to learn Chinese?",
        "我想知道如何更有效地学习汉语。有什么建议吗？我已经学了6个月了。":
          "I want to know how to learn Chinese more effectively. Any suggestions? I've been learning for 6 months.",
      },
      Spanish: {
        "¿Cuál es la mejor forma de practicar la pronunciación?":
          "What is the best way to practice pronunciation?",
        "Estoy buscando formas efectivas de mejorar mi pronunciación en español. ¿Alguien tiene sugerencias?":
          "I'm looking for effective ways to improve my Spanish pronunciation. Does anyone have suggestions?",
      },
      Japanese: {
        "日本語の敬語について": "About Japanese honorifics",
        "敬語の使い方がまだ難しいです。実践的な例を教えてもらえますか?":
          "I still find it difficult to use honorifics. Can you teach me practical examples?",
      },
    };

    return (
      translations[sourceLanguage]?.[content] ||
      `[Translated from ${sourceLanguage}] ${content}`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Users className="w-10 h-10 text-purple-400" />
            Language Communities
          </h1>
          <p className="text-gray-400">
            Join communities and discuss with learners worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Communities Sidebar */}
          <div className="space-y-3">
            <h2 className="font-bold text-white mb-4">Communities</h2>
            {MOCK_COMMUNITIES.map((community) => (
              <Card
                key={community.id}
                className={`p-4 cursor-pointer transition-all ${
                  selectedCommunity.id === community.id
                    ? "bg-purple-900/50 border-purple-500"
                    : "bg-slate-800/50 border-slate-700 hover:border-purple-500/50"
                }`}
                onClick={() => setSelectedCommunity(community)}
              >
                <h3 className="font-bold text-white text-sm mb-1">
                  {community.name}
                </h3>
                <p className="text-gray-400 text-xs mb-2">
                  {community.description}
                </p>
                <Badge className="bg-purple-500/20 text-purple-300 text-xs">
                  {community.members} members
                </Badge>
              </Card>
            ))}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Translation Controls */}
            <Card className="bg-slate-800/50 border-slate-700 p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-purple-400" />
                  <span className="font-semibold text-white text-sm">
                    Translation
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={targetLanguage}
                    onChange={(e) => setTargetLanguage(e.target.value)}
                    className="bg-slate-700 border border-slate-600 text-white px-2 py-1 rounded text-xs"
                  >
                    <option>English</option>
                    <option>Spanish</option>
                    <option>Chinese</option>
                    <option>Japanese</option>
                  </select>

                  <Button
                    size="sm"
                    variant={translationEnabled ? "default" : "outline"}
                    onClick={() => setTranslationEnabled(!translationEnabled)}
                    className="gap-2 h-8"
                  >
                    {translationEnabled ? (
                      <>
                        <Eye className="w-3 h-3" />
                        On
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3" />
                        Off
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Community Info */}
            <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/30 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {selectedCommunity.name}
                  </h2>
                  <p className="text-gray-300 mb-4">
                    {selectedCommunity.description}
                  </p>
                  <div className="flex gap-6">
                    <div>
                      <p className="text-gray-400 text-sm">Members</p>
                      <p className="text-2xl font-bold text-purple-400">
                        {selectedCommunity.members}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Language</p>
                      <p className="text-2xl font-bold text-blue-400">
                        {selectedCommunity.language}
                      </p>
                    </div>
                  </div>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700 h-10">
                  Join Community
                </Button>
              </div>
            </Card>

            {/* Posts */}
            <div className="space-y-4">
              <h3 className="font-bold text-white">Recent Discussions</h3>

              {MOCK_POSTS.map((post) => (
                <Card
                  key={post.id}
                  className="bg-slate-800/50 border-slate-700 p-6 hover:border-purple-500/50 transition"
                >
                  {/* Post Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-3xl">{post.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-white">{post.author}</h3>
                        <Badge className="bg-purple-500/20 text-purple-300 text-xs">
                          {post.language}
                        </Badge>
                      </div>
                      <h2 className="text-lg font-bold text-white mb-2">
                        {post.title}
                      </h2>
                      <p className="text-gray-300 mb-3">{post.content}</p>

                      {/* Translation */}
                      {translationEnabled && (
                        <div className="bg-slate-700/50 border border-slate-600 rounded p-3 mb-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Globe className="w-3 h-3 text-purple-400" />
                            <span className="text-xs text-gray-400">
                              {post.sourceLanguage} → {targetLanguage}
                            </span>
                          </div>
                          <p className="text-purple-200 text-sm">
                            {getTranslation(post.sourceLanguage, post.title)}
                          </p>
                          <p className="text-purple-100 text-sm mt-2">
                            {getTranslation(post.sourceLanguage, post.content)}
                          </p>
                        </div>
                      )}

                      {/* Stats */}
                      <div className="flex gap-6 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {post.views} views
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          {post.replies} replies
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          {post.upvotes} upvotes
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-slate-700">
                    <Button variant="outline" size="sm" className="flex-1">
                      Reply
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Upvote
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Save
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TranslationEnabledCommunity;
