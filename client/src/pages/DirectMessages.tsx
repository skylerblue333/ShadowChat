import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Send, Search, Plus, MoreVertical, Paperclip, Smile, Phone, Video } from "lucide-react";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
  status: "sent" | "delivered" | "read";
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unread: number;
  isOnline: boolean;
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    name: "Skyler Blue",
    avatar: "https://via.placeholder.com/40",
    lastMessage: "Thanks for the update!",
    lastMessageTime: new Date(Date.now() - 5 * 60 * 1000),
    unread: 0,
    isOnline: true,
  },
  {
    id: "2",
    name: "Hope AI",
    avatar: "https://via.placeholder.com/40",
    lastMessage: "Your stake has been confirmed",
    lastMessageTime: new Date(Date.now() - 30 * 60 * 1000),
    unread: 1,
    isOnline: true,
  },
  {
    id: "3",
    name: "Mining Pool Team",
    avatar: "https://via.placeholder.com/40",
    lastMessage: "Pool difficulty updated",
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unread: 0,
    isOnline: false,
  },
];

const mockMessages: Message[] = [
  {
    id: "1",
    sender: "Skyler Blue",
    content: "Hey! How's your staking going?",
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    isOwn: false,
    status: "read",
  },
  {
    id: "2",
    sender: "You",
    content: "Great! Just earned 50 SKY4 tokens",
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
    isOwn: true,
    status: "read",
  },
  {
    id: "3",
    sender: "Skyler Blue",
    content: "Nice! Keep it up 🚀",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    isOwn: false,
    status: "read",
  },
  {
    id: "4",
    sender: "You",
    content: "Thanks for the update!",
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    isOwn: true,
    status: "delivered",
  },
];

export function DirectMessages() {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: String(messages.length + 1),
      sender: "You",
      content: newMessage,
      timestamp: new Date(),
      isOwn: true,
      status: "sent",
    };

    setMessages([...messages, message]);
    setNewMessage("");
    toast.success("Message sent");
  };

  const filteredConversations = mockConversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-120px)]">
          {/* Conversations List */}
          <Card className="border-slate-700 bg-slate-800/50 flex flex-col">
            <CardHeader className="border-b border-slate-700">
              <CardTitle className="text-white text-lg">Messages</CardTitle>
              <div className="mt-4 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white text-sm"
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-0">
              <div className="space-y-1 p-2">
                {filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`w-full p-3 rounded-lg text-left transition ${
                      selectedConversation.id === conv.id
                        ? "bg-purple-600/30 border border-purple-500"
                        : "hover:bg-slate-700/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={conv.avatar} />
                          <AvatarFallback>{conv.name[0]}</AvatarFallback>
                        </Avatar>
                        {conv.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-slate-800" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-white truncate">{conv.name}</p>
                          {conv.unread > 0 && (
                            <Badge className="bg-red-600 text-white text-xs">{conv.unread}</Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 truncate">{conv.lastMessage}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
            <div className="border-t border-slate-700 p-3">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-sm">
                <Plus className="w-4 h-4 mr-2" />
                New Chat
              </Button>
            </div>
          </Card>

          {/* Chat Area */}
          <Card className="md:col-span-2 border-slate-700 bg-slate-800/50 flex flex-col">
            {/* Chat Header */}
            <CardHeader className="border-b border-slate-700 flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={selectedConversation.avatar} />
                  <AvatarFallback>{selectedConversation.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-white">{selectedConversation.name}</p>
                  <p className="text-xs text-slate-400">
                    {selectedConversation.isOnline ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                  <Video className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.isOwn
                        ? "bg-purple-600 text-white rounded-br-none"
                        : "bg-slate-700 text-slate-100 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${msg.isOwn ? "text-purple-200" : "text-slate-400"}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      {msg.isOwn && ` • ${msg.status}`}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Message Input */}
            <div className="border-t border-slate-700 p-4">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="text-slate-400 hover:text-white"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 bg-slate-700 border-slate-600 text-white"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="text-slate-400 hover:text-white"
                >
                  <Smile className="w-4 h-4" />
                </Button>
                <Button type="submit" size="sm" className="bg-purple-600 hover:bg-purple-700">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default DirectMessages;
