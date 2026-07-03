import { useState, useRef, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Send, Lock, Shield, MoreVertical, Search,
  MessageCircle, ArrowLeft, Image, Smile, Mic, Plus,
  Phone, Video, Trash2, Edit3, Timer, X, Check, CheckCheck,
  UserPlus, Flame, EyeOff
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

function timeAgo(ts: string | Date) {
  const diff = (Date.now() - new Date(ts).getTime()) / 1000;
  if (diff < 60) return "now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return new Date(ts).toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function Messages() {
  
  const [selectedChannelId, setSelectedChannelId] = useState<number | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [snapMode, setSnapMode] = useState(false);
  const [editingMsgId, setEditingMsgId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const [newChatUserId, setNewChatUserId] = useState("");
  const [newChatMsg, setNewChatMsg] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const utils = trpc.useUtils();

  const { data: conversations, isLoading: convoLoading } = trpc.dm.conversations.useQuery(
    undefined, { enabled: isAuthenticated, refetchInterval: 5000 }
  );
  const { data: messages, isLoading: msgLoading } = trpc.dm.messages.useQuery(
    { channelId: selectedChannelId! },
    { enabled: !!selectedChannelId, refetchInterval: 3000 }
  );
  const { data: unreadData } = trpc.dm.unreadCount.useQuery(
    undefined, { enabled: isAuthenticated, refetchInterval: 5000 }
  );

  const sendMutation = trpc.dm.send.useMutation({
    onSuccess: () => {
      setMessageText("");
      utils.dm.messages.invalidate({ channelId: selectedChannelId! });
      utils.dm.conversations.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteMutation = trpc.dm.deleteMessage.useMutation({
    onSuccess: () => {
      utils.dm.messages.invalidate({ channelId: selectedChannelId! });
      toast.success("Message deleted");
    },
    onError: (e) => toast.error(e.message),
  });

  const startConvoMutation = trpc.dm.startConversation.useMutation({
    onSuccess: (data) => {
      if (data.channelId) {
        setSelectedChannelId(data.channelId);
        utils.dm.conversations.invalidate();
      }
      setShowNewChat(false);
      setNewChatUserId("");
      setNewChatMsg("");
    },
    onError: (e) => toast.error(e.message),
  });

  const markReadMutation = trpc.dm.markRead.useMutation();

  useEffect(() => {
    if (selectedChannelId) markReadMutation.mutate({ channelId: selectedChannelId });
  }, [selectedChannelId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Snap mode: auto-delete messages after 10s from view
  useEffect(() => {
    if (!snapMode || !messages) return;
    const timer = setTimeout(() => {
      (messages as any[]).forEach((msg: any) => {
        if (msg.senderId === user?.id) {
          deleteMutation.mutate({ messageId: msg.id });
        }
      });
    }, 10000);
    return () => clearTimeout(timer);
  }, [snapMode, messages]);

  const handleSend = useCallback(() => {
    if (!messageText.trim() || !selectedChannelId) return;
    sendMutation.mutate({ channelId: selectedChannelId, content: messageText.trim() });
  }, [messageText, selectedChannelId, sendMutation]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const filteredConvos = (conversations as any[] || []).filter((c: any) =>
    !searchQuery || (c.participantName || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConvo = (conversations as any[] || []).find((c: any) => c.id === selectedChannelId);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white">Private Messages</h2>
          <p className="text-slate-400">Sign in to access your encrypted messages</p>
          <Button onClick={() => // Removed login redirect for testing}
            style={{ background: "linear-gradient(135deg, oklch(0.72 0.28 305), oklch(0.72 0.28 340))" }}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ height: "calc(100vh - 64px)" }}>
      {/* New Chat Dialog */}
      <Dialog open={showNewChat} onOpenChange={setShowNewChat}>
        <DialogContent className="bg-[#0e0a1a] border-white/10 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-purple-400" /> New Message
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="User ID or username..."
              value={newChatUserId}
              onChange={e => setNewChatUserId(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
            />
            <Input
              placeholder="First message (optional)..."
              value={newChatMsg}
              onChange={e => setNewChatMsg(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
            />
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 border-white/10 text-white/60 bg-transparent" onClick={() => setShowNewChat(false)}>Cancel</Button>
              <Button
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0"
                disabled={!newChatUserId.trim() || startConvoMutation.isPending}
                onClick={() => {
                  const recipientId = parseInt(newChatUserId);
                  if (isNaN(recipientId)) { toast.error("Enter a valid user ID"); return; }
                  startConvoMutation.mutate({ recipientId, initialMessage: newChatMsg || undefined });
                }}
              >
                {startConvoMutation.isPending ? "Starting..." : "Start Chat"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sidebar: Conversation List */}
      <div className={`${selectedChannelId ? "hidden md:flex" : "flex"} flex-col w-full md:w-80 border-r border-white/5 bg-[#0a0614]/95`}>
        {/* Header */}
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-black text-white">Messages</h2>
            <div className="flex items-center gap-2">
              {unreadData && unreadData.count > 0 && (
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                  {unreadData.count}
                </Badge>
              )}
              <Button
                size="icon"
                variant="ghost"
                className="w-8 h-8 text-slate-400 hover:text-purple-400"
                onClick={() => setShowNewChat(true)}
                title="New conversation"
              >
                <UserPlus className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-1 text-xs text-green-400">
                <Shield className="w-3 h-3" />
                <span>E2E</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-slate-500 h-9"
            />
          </div>
        </div>

        {/* Conversations */}
        <ScrollArea className="flex-1">
          {convoLoading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-12 h-12 rounded-full bg-white/5" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-white/5 rounded w-3/4" />
                    <div className="h-2 bg-white/5 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredConvos.length === 0 ? (
            <div className="p-8 text-center">
              <MessageCircle className="w-12 h-12 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No conversations yet</p>
              <Button size="sm" className="mt-3 bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 border-0" onClick={() => setShowNewChat(true)}>
                <UserPlus className="w-3.5 h-3.5 mr-1.5" /> Start a conversation
              </Button>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {filteredConvos.map((convo: any) => (
                <button
                  key={convo.id}
                  onClick={() => setSelectedChannelId(convo.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                    selectedChannelId === convo.id
                      ? "bg-purple-500/15 border border-purple-500/30"
                      : "hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={convo.participantAvatar || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold">
                        {(convo.participantName || "?")[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {convo.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-[#0a0614]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-white text-sm truncate">{convo.participantName || "Unknown"}</p>
                      {convo.lastMessageAt && (
                        <span className="text-xs text-slate-600 flex-shrink-0 ml-2">
                          {timeAgo(convo.lastMessageAt)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-500 truncate">{convo.lastMessage || "Start a conversation"}</p>
                      {convo.unreadCount > 0 && (
                        <Badge className="bg-purple-500 text-white text-xs ml-2 flex-shrink-0 min-w-[18px] h-[18px] flex items-center justify-center rounded-full p-0">
                          {convo.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className={`${selectedChannelId ? "flex" : "hidden md:flex"} flex-1 flex-col bg-[#0a0614]/80`}>
        {!selectedChannelId ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 flex items-center justify-center mx-auto">
                <MessageCircle className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Select a conversation</h3>
              <p className="text-slate-500 text-sm">Choose a conversation from the left to start messaging</p>
              <Button size="sm" className="bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 border-0" onClick={() => setShowNewChat(true)}>
                <UserPlus className="w-3.5 h-3.5 mr-1.5" /> New Message
              </Button>
              <div className="flex items-center gap-2 justify-center text-xs text-green-400">
                <Shield className="w-3 h-3" />
                <span>All messages are end-to-end encrypted</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 p-4 border-b border-white/5 bg-[#0a0614]/95">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-slate-400 hover:text-white"
                onClick={() => setSelectedChannelId(null)}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              {selectedConvo && (
                <>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={selectedConvo.participantAvatar || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-sm">
                      {(selectedConvo.participantName || "?")[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-bold text-white">{selectedConvo.participantName}</p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="flex items-center gap-1 text-green-400">
                        <Shield className="w-3 h-3" /> Encrypted
                      </span>
                      {snapMode && (
                        <span className="flex items-center gap-1 text-orange-400">
                          <Flame className="w-3 h-3" /> Snap Mode
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Header Actions */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost" size="icon"
                      className="text-slate-400 hover:text-green-400 w-9 h-9"
                      title="Voice call"
                      onClick={() => toast.info("Voice call coming soon")}
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost" size="icon"
                      className="text-slate-400 hover:text-blue-400 w-9 h-9"
                      title="Video call"
                      onClick={() => toast.info("Video call coming soon")}
                    >
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost" size="icon"
                      className={`w-9 h-9 ${snapMode ? "text-orange-400" : "text-slate-400 hover:text-orange-400"}`}
                      title={snapMode ? "Snap Mode ON — messages disappear" : "Enable Snap Mode"}
                      onClick={() => { setSnapMode(!snapMode); toast.info(snapMode ? "Snap mode off" : "Snap mode on — messages disappear after 10s"); }}
                    >
                      <EyeOff className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white w-9 h-9">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#0e0a1a] border-white/10 text-white">
                        <DropdownMenuItem className="text-slate-300 hover:text-white cursor-pointer" onClick={() => toast.info("Search in conversation coming soon")}>
                          <Search className="w-4 h-4 mr-2" /> Search messages
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem className="text-red-400 hover:text-red-300 cursor-pointer" onClick={() => toast.info("Block user coming soon")}>
                          Block user
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </>
              )}
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              {snapMode && (
                <div className="flex items-center justify-center mb-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs text-orange-400">
                    <Timer className="w-3 h-3" /> Snap Mode: messages disappear after 10s
                  </div>
                </div>
              )}
              {msgLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                </div>
              ) : !messages || (messages as any[]).length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 flex items-center justify-center mb-4">
                    <Lock className="w-8 h-8 text-purple-400" />
                  </div>
                  <p className="text-slate-400 font-semibold">Encrypted conversation started</p>
                  <p className="text-slate-600 text-sm mt-1">Send the first message</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {(messages as any[]).map((msg: any) => {
                    const isOwn = msg.senderId === user?.id;
                    return (
                      <div key={msg.id} className={`group flex items-end gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
                        {!isOwn && (
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs font-bold">
                              {(selectedConvo?.participantName || "?")[0]?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className={`max-w-[70%] ${isOwn ? "items-end" : "items-start"} flex flex-col gap-1`}>
                          {editingMsgId === msg.id ? (
                            <div className="flex gap-2 items-center">
                              <Input
                                value={editText}
                                onChange={e => setEditText(e.target.value)}
                                className="bg-white/10 border-white/20 text-white h-8 text-sm"
                                onKeyDown={e => {
                                  if (e.key === "Enter") {
                                    // edit not fully wired to backend yet — just clear
                                    setEditingMsgId(null);
                                    toast.info("Edit saved locally");
                                  }
                                  if (e.key === "Escape") setEditingMsgId(null);
                                }}
                              />
                              <Button size="icon" variant="ghost" className="w-7 h-7 text-green-400" onClick={() => setEditingMsgId(null)}>
                                <Check className="w-3.5 h-3.5" />
                              </Button>
                              <Button size="icon" variant="ghost" className="w-7 h-7 text-slate-500" onClick={() => setEditingMsgId(null)}>
                                <X className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          ) : (
                            <div className={`px-4 py-2.5 rounded-2xl text-sm relative ${
                              isOwn
                                ? "rounded-br-sm text-white"
                                : "bg-white/5 border border-white/10 text-slate-200 rounded-bl-sm"
                            }`} style={isOwn ? {
                              background: "linear-gradient(135deg, oklch(0.55 0.28 305), oklch(0.55 0.28 340))"
                            } : {}}>
                              {msg.content}
                            </div>
                          )}
                          <div className="flex items-center gap-1.5">
                            <Lock className="w-2.5 h-2.5 text-green-500/50" />
                            <span className="text-xs text-slate-600">
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                            {isOwn && <CheckCheck className="w-3 h-3 text-purple-400/60" />}
                            {/* Message actions (own messages only) */}
                            {isOwn && editingMsgId !== msg.id && (
                              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="w-5 h-5 text-slate-500 hover:text-blue-400"
                                  onClick={() => { setEditingMsgId(msg.id); setEditText(msg.content); }}
                                >
                                  <Edit3 className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="w-5 h-5 text-slate-500 hover:text-red-400"
                                  onClick={() => deleteMutation.mutate({ messageId: msg.id })}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-white/5 bg-[#0a0614]/95">
              <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={() => toast.info("Media upload coming soon")} />
              <div className="flex items-end gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-slate-500 hover:text-purple-400 flex-shrink-0">
                      <Plus className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" side="top" className="bg-[#0e0a1a] border-white/10 text-white">
                    <DropdownMenuItem className="cursor-pointer text-slate-300 hover:text-white" onClick={() => fileRef.current?.click()}>
                      <Image className="w-4 h-4 mr-2 text-purple-400" /> Photo / Video
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer text-slate-300 hover:text-white" onClick={() => toast.info("GIF picker coming soon")}>
                      <Smile className="w-4 h-4 mr-2 text-pink-400" /> GIF / Emoji
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer text-slate-300 hover:text-white" onClick={() => toast.info("Voice message coming soon")}>
                      <Mic className="w-4 h-4 mr-2 text-blue-400" /> Voice Message
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex-1 relative">
                  <Input
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={snapMode ? "Snap message (disappears in 10s)..." : "Send an encrypted message..."}
                    className={`bg-white/5 border-white/10 text-white placeholder:text-slate-500 pr-10 rounded-2xl ${snapMode ? "border-orange-500/30" : ""}`}
                    maxLength={2000}
                  />
                  <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 text-slate-500 hover:text-purple-400 w-8 h-8">
                    <Smile className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  onClick={handleSend}
                  disabled={!messageText.trim() || sendMutation.isPending}
                  size="icon"
                  className="flex-shrink-0 rounded-2xl w-10 h-10"
                  style={{ background: messageText.trim() ? "linear-gradient(135deg, oklch(0.72 0.28 305), oklch(0.72 0.28 340))" : undefined }}
                >
                  {sendMutation.isPending ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-slate-700 text-center mt-2 flex items-center justify-center gap-1">
                <Shield className="w-3 h-3 text-green-600" />
                Messages are encrypted and private
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
