import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Send,
  MessageCircle,
  Users,
  Plus,
  Search,
  Phone,
  Video,
  MoreVertical,
  Globe,
  Volume2,
  Copy,
  Trash2,
  Pin,
  Archive,
  Settings,
} from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  translatedContent?: string;
  sourceLanguage: string;
  targetLanguage: string;
  timestamp: Date;
  isTranslated: boolean;
  reactions: { emoji: string; count: number }[];
}

interface Conversation {
  id: string;
  type: "direct" | "group";
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  participants: { id: string; name: string; avatar: string; online: boolean }[];
  sourceLanguage: string;
  targetLanguage: string;
  autoTranslate: boolean;
}

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    type: "direct",
    name: "李明",
    avatar: "🇨🇳",
    lastMessage: "How are you doing today?",
    lastMessageTime: new Date(Date.now() - 5 * 60 * 1000),
    unreadCount: 2,
    participants: [
      { id: "p1", name: "李明", avatar: "🇨🇳", online: true },
    ],
    sourceLanguage: "Chinese",
    targetLanguage: "English",
    autoTranslate: true,
  },
  {
    id: "c2",
    type: "direct",
    name: "Maria García",
    avatar: "🇪🇸",
    lastMessage: "Let's practice tomorrow!",
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unreadCount: 0,
    participants: [
      { id: "p2", name: "Maria García", avatar: "🇪🇸", online: false },
    ],
    sourceLanguage: "Spanish",
    targetLanguage: "English",
    autoTranslate: false,
  },
  {
    id: "c3",
    type: "group",
    name: "Language Learners",
    avatar: "👥",
    lastMessage: "Sofia: Great session everyone!",
    lastMessageTime: new Date(Date.now() - 30 * 60 * 1000),
    unreadCount: 5,
    participants: [
      { id: "p3", name: "Yuki Tanaka", avatar: "🇯🇵", online: true },
      { id: "p4", name: "Pierre Dubois", avatar: "🇫🇷", online: true },
      { id: "p5", name: "Sofia Novak", avatar: "🇷🇺", online: false },
    ],
    sourceLanguage: "English",
    targetLanguage: "Multiple",
    autoTranslate: true,
  },
];

const MOCK_MESSAGES: Message[] = [
  {
    id: "m1",
    senderId: "p1",
    senderName: "李明",
    senderAvatar: "🇨🇳",
    content: "你好！今天怎么样？",
    translatedContent: "Hello! How are you today?",
    sourceLanguage: "Chinese",
    targetLanguage: "English",
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    isTranslated: true,
    reactions: [{ emoji: "👍", count: 1 }],
  },
  {
    id: "m2",
    senderId: "user",
    senderName: "You",
    senderAvatar: "👤",
    content: "I'm doing great! Ready for practice?",
    sourceLanguage: "English",
    targetLanguage: "Chinese",
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
    isTranslated: false,
    reactions: [],
  },
  {
    id: "m3",
    senderId: "p1",
    senderName: "李明",
    senderAvatar: "🇨🇳",
    content: "当然！我们今天讨论什么话题？",
    translatedContent: "Of course! What topic should we discuss today?",
    sourceLanguage: "Chinese",
    targetLanguage: "English",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    isTranslated: true,
    reactions: [{ emoji: "😊", count: 1 }],
  },
];

export function UnifiedMessaging() {
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(
    MOCK_CONVERSATIONS[0]
  );
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [selectedLanguagePair, setSelectedLanguagePair] = useState("auto");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;

    const newMessage: Message = {
      id: `m${messages.length + 1}`,
      senderId: "user",
      senderName: "You",
      senderAvatar: "👤",
      content: messageInput,
      sourceLanguage: selectedConversation.targetLanguage,
      targetLanguage: selectedConversation.sourceLanguage,
      timestamp: new Date(),
      isTranslated: false,
      reactions: [],
    };

    setMessages([...messages, newMessage]);
    setMessageInput("");

    // Simulate response
    setTimeout(() => {
      const response: Message = {
        id: `m${messages.length + 2}`,
        senderId: selectedConversation.participants[0].id,
        senderName: selectedConversation.participants[0].name,
        senderAvatar: selectedConversation.avatar,
        content: "That's great! 很好！",
        translatedContent: "That's great!",
        sourceLanguage: selectedConversation.sourceLanguage,
        targetLanguage: selectedConversation.targetLanguage,
        timestamp: new Date(),
        isTranslated: autoTranslate,
        reactions: [],
      };
      setMessages((prev) => [...prev, response]);
    }, 1000);
  };

  const handleTranslateMessage = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, isTranslated: !msg.isTranslated } : msg
      )
    );
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    toast.success("Message deleted");
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <MessageCircle className="w-8 h-8 text-purple-400" />
            Unified Messaging
          </h1>
          <p className="text-gray-400 text-sm">
            Real-time translation across all conversations
          </p>
        </div>

        <div className="flex gap-4 flex-1 overflow-hidden">
          {/* Conversations Sidebar */}
          <div className="w-80 flex flex-col bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
            {/* Search & New */}
            <div className="p-4 border-b border-slate-700 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600"
                />
              </div>
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => setShowNewConversation(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Conversation
              </Button>
            </div>

            {/* Conversations List */}
            <ScrollArea className="flex-1">
              <div className="space-y-2 p-3">
                {filteredConversations.map((conv) => (
                  <Card
                    key={conv.id}
                    className={`p-3 cursor-pointer transition-all ${
                      selectedConversation?.id === conv.id
                        ? "bg-purple-900/50 border-purple-500"
                        : "bg-slate-700/50 border-slate-600 hover:bg-slate-600/50"
                    }`}
                    onClick={() => setSelectedConversation(conv)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{conv.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-white truncate">{conv.name}</h3>
                          {conv.unreadCount > 0 && (
                            <Badge className="bg-red-500/20 text-red-400">
                              {conv.unreadCount}
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-400 text-xs truncate">{conv.lastMessage}</p>
                        <p className="text-gray-500 text-xs mt-1">
                          {conv.lastMessageTime.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area */}
          {selectedConversation ? (
            <div className="flex-1 flex flex-col bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{selectedConversation.avatar}</div>
                  <div>
                    <h2 className="font-bold text-white">{selectedConversation.name}</h2>
                    <p className="text-gray-400 text-sm">
                      {selectedConversation.type === "group"
                        ? `${selectedConversation.participants.length} members`
                        : selectedConversation.participants[0]?.online
                        ? "Online"
                        : "Offline"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowSettings(true)}
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${msg.senderId === "user" ? "justify-end" : ""}`}
                    >
                      {msg.senderId !== "user" && (
                        <div className="text-2xl flex-shrink-0">{msg.senderAvatar}</div>
                      )}

                      <div
                        className={`max-w-xs ${
                          msg.senderId === "user"
                            ? "bg-purple-600 text-white rounded-l-lg rounded-tr-lg"
                            : "bg-slate-700 text-gray-100 rounded-r-lg rounded-tl-lg"
                        } p-3 group`}
                      >
                        {msg.senderId !== "user" && (
                          <p className="text-xs font-bold text-gray-300 mb-1">
                            {msg.senderName}
                          </p>
                        )}

                        <p className="text-sm mb-2">{msg.content}</p>

                        {msg.isTranslated && msg.translatedContent && (
                          <div className="bg-black/20 p-2 rounded text-xs mb-2">
                            <div className="flex items-center gap-1 mb-1">
                              <Globe className="w-3 h-3" />
                              <span className="text-gray-300">
                                {msg.targetLanguage}
                              </span>
                            </div>
                            <p className="text-gray-200">{msg.translatedContent}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between gap-2 mt-2 text-xs text-gray-400">
                          <span>
                            {msg.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>

                          <div className="hidden group-hover:flex gap-1">
                            {msg.translatedContent && (
                              <button
                                onClick={() => handleTranslateMessage(msg.id)}
                                title="Toggle translation"
                                className="hover:text-purple-300"
                              >
                                <Globe className="w-3 h-3" />
                              </button>
                            )}
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(msg.content);
                                toast.success("Copied to clipboard");
                              }}
                              title="Copy message"
                              className="hover:text-purple-300"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                            {msg.senderId === "user" && (
                              <button
                                onClick={() => handleDeleteMessage(msg.id)}
                                title="Delete message"
                                className="hover:text-red-400"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t border-slate-700 space-y-3">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Type your message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.ctrlKey) {
                        handleSendMessage();
                      }
                    }}
                    className="bg-slate-700 border-slate-600 resize-none"
                    rows={3}
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="bg-purple-600 hover:bg-purple-700 self-end"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>

                {autoTranslate && (
                  <div className="flex items-center gap-2 text-xs text-gray-400 bg-slate-700/50 p-2 rounded">
                    <Globe className="w-3 h-3" />
                    Auto-translating to {selectedConversation.sourceLanguage}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-slate-800/50 border border-slate-700 rounded-lg">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Conversation Dialog */}
      <Dialog open={showNewConversation} onOpenChange={setShowNewConversation}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Start New Conversation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 block mb-2">Conversation Type</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="type" defaultChecked className="w-4 h-4" />
                  <span className="text-white">Direct Message</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="type" className="w-4 h-4" />
                  <span className="text-white">Group Chat</span>
                </label>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-2">Select Participant</label>
              <Input placeholder="Search for users..." className="bg-slate-800 border-slate-700" />
            </div>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              Start Conversation
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Conversation Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-white">Auto-Translate Messages</label>
              <input
                type="checkbox"
                checked={autoTranslate}
                onChange={(e) => setAutoTranslate(e.target.checked)}
                className="w-4 h-4"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 block mb-2">Language Pair</label>
              <select className="w-full bg-slate-800 border border-slate-700 text-white rounded px-3 py-2">
                <option>Auto-detect</option>
                <option>English ↔ Chinese</option>
                <option>English ↔ Spanish</option>
                <option>English ↔ Japanese</option>
              </select>
            </div>

            <div className="space-y-2">
              <Button className="w-full bg-slate-700 hover:bg-slate-600" variant="outline">
                <Pin className="w-4 h-4 mr-2" />
                Pin Conversation
              </Button>
              <Button className="w-full bg-slate-700 hover:bg-slate-600" variant="outline">
                <Archive className="w-4 h-4 mr-2" />
                Archive Conversation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UnifiedMessaging;
