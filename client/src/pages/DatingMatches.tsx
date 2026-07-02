import React, { useState, useEffect } from 'react';
import { MessageCircle, Heart, Flame, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/_core/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';

interface Match {
  id: number;
  user1Id: number;
  user2Id: number;
  matchType: 'like' | 'superlike' | 'mutual_like' | 'mutual_superlike';
  isMutual: boolean;
  lastMessageAt: string | null;
  createdAt: string;
  matchedUser?: {
    id: number;
    displayName: string;
    profileImageUrl: string;
    age: number;
  };
}

interface Message {
  id: number;
  matchId: number;
  senderId: number;
  recipientId: number;
  content: string;
  mediaUrl: string | null;
  mediaType: 'image' | 'video' | 'audio' | null;
  readAt: string | null;
  createdAt: string;
}

export default function DatingMatches() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(false);

  useEffect(() => {
    loadMatches();
  }, []);

  useEffect(() => {
    if (selectedMatch) {
      loadMessages(selectedMatch.id);
    }
  }, [selectedMatch]);

  const loadMatches = async () => {
    try {
      const response = await fetch('/api/dating/matches');
      const data = await response.json();
      setMatches(data.matches || []);
    } catch (error) {
      console.error('Failed to load matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (matchId: number) => {
    setMessageLoading(true);
    try {
      const response = await fetch(`/api/dating/conversations/${matchId}`);
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setMessageLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedMatch) return;

    const tempMessage: Message = {
      id: Date.now(),
      matchId: selectedMatch.id,
      senderId: user?.id || 0,
      recipientId: selectedMatch.user1Id === user?.id ? selectedMatch.user2Id : selectedMatch.user1Id,
      content: newMessage,
      mediaUrl: null,
      mediaType: null,
      readAt: null,
      createdAt: new Date().toISOString(),
    };

    setMessages([...messages, tempMessage]);
    setNewMessage('');

    try {
      await fetch('/api/dating/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId: selectedMatch.id,
          content: newMessage,
        }),
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
          {/* Matches List */}
          <div className="md:col-span-1">
            <Card className="p-4">
              <h2 className="text-2xl font-bold mb-4">Matches ({matches.length})</h2>

              {matches.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No matches yet. Start swiping!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {matches.map((match) => (
                    <button
                      key={match.id}
                      onClick={() => setSelectedMatch(match)}
                      className={`w-full p-3 rounded-lg text-left transition-colors ${
                        selectedMatch?.id === match.id
                          ? 'bg-pink-100 border-2 border-pink-500'
                          : 'bg-gray-100 hover:bg-gray-200 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {match.matchedUser?.profileImageUrl && (
                          <img
                            src={match.matchedUser.profileImageUrl}
                            alt={match.matchedUser.displayName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">
                            {match.matchedUser?.displayName}, {match.matchedUser?.age}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {match.isMutual ? (
                              <span className="flex items-center gap-1">
                                <Flame className="w-3 h-3" /> Mutual match
                              </span>
                            ) : (
                              <span>Matched</span>
                            )}
                          </p>
                        </div>
                        {match.lastMessageAt && (
                          <Clock className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Chat Area */}
          <div className="md:col-span-2">
            {selectedMatch ? (
              <Card className="p-4 h-96 flex flex-col">
                {/* Chat Header */}
                <div className="flex items-center gap-3 pb-4 border-b">
                  {selectedMatch.matchedUser?.profileImageUrl && (
                    <img
                      src={selectedMatch.matchedUser.profileImageUrl}
                      alt={selectedMatch.matchedUser.displayName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold">
                      {selectedMatch.matchedUser?.displayName}, {selectedMatch.matchedUser?.age}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {selectedMatch.isMutual ? '💕 Mutual Match' : 'Matched'}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto py-4 space-y-4">
                  {messageLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <Spinner />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <p>No messages yet. Say hello!</p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${
                            msg.senderId === user?.id
                              ? 'bg-pink-500 text-white'
                              : 'bg-gray-200 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Message Input */}
                <div className="flex gap-2 pt-4 border-t">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-pink-500 hover:bg-pink-600"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="p-8 text-center">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Select a match to start chatting</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
