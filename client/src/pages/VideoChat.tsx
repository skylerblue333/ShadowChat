import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Share2,
  Settings,
  Globe,
  MessageSquare,
  MoreVertical,
  Volume2,
  VolumeX,
  ScreenShare,
  ScreenShareOff,
  Dot,
  StopCircle,
  Copy,
} from "lucide-react";

interface CallSession {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerAvatar: string;
  status: "calling" | "connected" | "ended";
  duration: number;
  language: string;
  translationEnabled: boolean;
}

interface TranslationOverlay {
  text: string;
  language: string;
  timestamp: Date;
  speaker: "local" | "remote";
}

const MOCK_PARTNER = {
  id: "p1",
  name: "李明",
  avatar: "🇨🇳",
  language: "Chinese",
  proficiency: "B2",
  responseTime: "< 1 hour",
  rating: 4.9,
};

export function VideoChat() {
  const [callSession, setCallSession] = useState<CallSession | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [translationEnabled, setTranslationEnabled] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [translationOverlays, setTranslationOverlays] = useState<TranslationOverlay[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [transcript, setTranscript] = useState<
    Array<{ speaker: string; text: string; timestamp: string; translated?: string }>
  >([]);
  const [selectedLanguagePair, setSelectedLanguagePair] = useState("auto");
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate call timer
  useEffect(() => {
    if (isCallActive) {
      callTimerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    }

    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, [isCallActive]);

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartCall = () => {
    const session: CallSession = {
      id: `call_${Date.now()}`,
      partnerId: MOCK_PARTNER.id,
      partnerName: MOCK_PARTNER.name,
      partnerAvatar: MOCK_PARTNER.avatar,
      status: "connected",
      duration: 0,
      language: MOCK_PARTNER.language,
      translationEnabled,
    };

    setCallSession(session);
    setIsCallActive(true);
    toast.success(`Connected with ${MOCK_PARTNER.name}`);

    // Simulate translation overlays
    setTimeout(() => {
      setTranslationOverlays([
        {
          text: "你好！很高兴见到你",
          language: "Chinese",
          timestamp: new Date(),
          speaker: "remote",
        },
      ]);

      setTranscript([
        {
          speaker: MOCK_PARTNER.name,
          text: "你好！很高兴见到你",
          timestamp: new Date().toLocaleTimeString(),
          translated: "Hello! Nice to meet you",
        },
      ]);
    }, 2000);
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setCallSession(null);
    setCallDuration(0);
    setTranslationOverlays([]);
    toast.success("Call ended");
  };

  const handleToggleMic = () => {
    setIsMuted(!isMuted);
    toast.success(isMuted ? "Microphone on" : "Microphone muted");
  };

  const handleToggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    toast.success(isVideoOn ? "Camera off" : "Camera on");
  };

  const handleToggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    toast.success(isScreenSharing ? "Screen sharing stopped" : "Screen sharing started");
  };

  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
    toast.success(isRecording ? "Recording stopped" : "Recording started");
  };

  const handleCopyTranslation = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Translation copied to clipboard");
  };

  if (!isCallActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Video className="w-10 h-10 text-purple-400" />
              Video Chat
            </h1>
            <p className="text-gray-400">
              Practice languages with real-time translation
            </p>
          </div>

          {/* Partner Card */}
          <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30 p-8 mb-8">
            <div className="flex items-center gap-6">
              <div className="text-8xl">{MOCK_PARTNER.avatar}</div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {MOCK_PARTNER.name}
                </h2>
                <div className="space-y-2 mb-4">
                  <p className="text-gray-300">
                    <span className="text-gray-400">Language:</span> {MOCK_PARTNER.language}
                  </p>
                  <p className="text-gray-300">
                    <span className="text-gray-400">Proficiency:</span>{" "}
                    {MOCK_PARTNER.proficiency}
                  </p>
                  <p className="text-gray-300">
                    <span className="text-gray-400">Response Time:</span>{" "}
                    {MOCK_PARTNER.responseTime}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400">★</span>
                    <span className="text-gray-300">{MOCK_PARTNER.rating}/5</span>
                  </div>
                </div>
              </div>
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 h-16 px-8"
                onClick={handleStartCall}
              >
                <Phone className="w-6 h-6 mr-2" />
                Start Call
              </Button>
            </div>
          </Card>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <Globe className="w-8 h-8 text-purple-400 mb-3" />
              <h3 className="font-bold text-white mb-2">Real-Time Translation</h3>
              <p className="text-gray-400 text-sm">
                Automatic translation of spoken words with on-screen overlays
              </p>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <MessageSquare className="w-8 h-8 text-blue-400 mb-3" />
              <h3 className="font-bold text-white mb-2">Live Transcript</h3>
              <p className="text-gray-400 text-sm">
                Full conversation transcript with timestamps and translations
              </p>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <ScreenShare className="w-8 h-8 text-green-400 mb-3" />
              <h3 className="font-bold text-white mb-2">Screen Sharing</h3>
              <p className="text-gray-400 text-sm">
                Share your screen for collaborative learning and presentations
              </p>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Call Header */}
        <div className="flex justify-between items-center mb-6 bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl">{MOCK_PARTNER.avatar}</div>
            <div>
              <h2 className="text-xl font-bold text-white">{MOCK_PARTNER.name}</h2>
              <p className="text-gray-400 text-sm">
                {MOCK_PARTNER.language} • {formatDuration(callDuration)}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowSettings(true)}
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowTranscript(true)}
            >
              <MessageSquare className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Video Area */}
          <div className="lg:col-span-2 space-y-4">
            {/* Remote Video */}
            <Card className="bg-slate-800/50 border-slate-700 aspect-video flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20" />
              <div className="text-center z-10">
                <div className="text-8xl mb-4">{MOCK_PARTNER.avatar}</div>
                <p className="text-white font-bold">{MOCK_PARTNER.name}</p>
                <p className="text-gray-400 text-sm">Connected</p>
              </div>

              {/* Translation Overlay */}
              {translationOverlays.length > 0 && translationEnabled && (
                <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur p-3 rounded z-20">
                  {translationOverlays.map((overlay, idx) => (
                    <div key={idx}>
                      <p className="text-white text-sm mb-1">{overlay.text}</p>
                      <p className="text-purple-300 text-xs">
                        {overlay.language}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Local Video */}
            <Card className="bg-slate-800/50 border-slate-700 aspect-video flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 to-slate-800/50" />
              <div className="text-center z-10">
                <div className="text-6xl mb-2">👤</div>
                <p className="text-white font-bold">You</p>
                {isMuted && (
                  <Badge className="bg-red-500/20 text-red-400 mt-2">
                    Muted
                  </Badge>
                )}
              </div>

              {isScreenSharing && (
                <Badge className="absolute top-4 right-4 bg-green-500/20 text-green-400 z-20">
                  <ScreenShare className="w-3 h-3 mr-1" />
                  Screen Sharing
                </Badge>
              )}

              {isRecording && (
                <Badge className="absolute top-4 left-4 bg-red-500/20 text-red-400 z-20">
                  <Dot className="w-3 h-3 mr-1" />
                  Recording
                </Badge>
              )}
            </Card>

            {/* Controls */}
            <div className="flex justify-center gap-4 bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <Button
                size="lg"
                variant={isMuted ? "destructive" : "outline"}
                onClick={handleToggleMic}
                className="rounded-full w-14 h-14 p-0"
              >
                {isMuted ? (
                  <MicOff className="w-6 h-6" />
                ) : (
                  <Mic className="w-6 h-6" />
                )}
              </Button>

              <Button
                size="lg"
                variant={!isVideoOn ? "destructive" : "outline"}
                onClick={handleToggleVideo}
                className="rounded-full w-14 h-14 p-0"
              >
                {isVideoOn ? (
                  <Video className="w-6 h-6" />
                ) : (
                  <VideoOff className="w-6 h-6" />
                )}
              </Button>

              <Button
                size="lg"
                variant={isScreenSharing ? "default" : "outline"}
                onClick={handleToggleScreenShare}
                className="rounded-full w-14 h-14 p-0"
              >
                {isScreenSharing ? (
                  <ScreenShareOff className="w-6 h-6" />
                ) : (
                  <ScreenShare className="w-6 h-6" />
                )}
              </Button>

              <Button
                size="lg"
                variant={isRecording ? "destructive" : "outline"}
                onClick={handleToggleRecording}
                className="rounded-full w-14 h-14 p-0"
              >
                {isRecording ? (
                  <StopCircle className="w-6 h-6" />
                ) : (
                  <Dot className="w-6 h-6" />
                )}
              </Button>

              <Button
                size="lg"
                variant="destructive"
                onClick={handleEndCall}
                className="rounded-full w-14 h-14 p-0"
              >
                <PhoneOff className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {/* Translation Panel */}
          <Card className="bg-slate-800/50 border-slate-700 p-4 flex flex-col h-fit">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-purple-400" />
              <h3 className="font-bold text-white">Translation</h3>
              <input
                type="checkbox"
                checked={translationEnabled}
                onChange={(e) => setTranslationEnabled(e.target.checked)}
                className="ml-auto w-4 h-4"
              />
            </div>

            {translationEnabled && (
              <div className="space-y-3 flex-1">
                {translationOverlays.length > 0 ? (
                  translationOverlays.map((overlay, idx) => (
                    <div key={idx} className="bg-slate-700/50 p-3 rounded">
                      <p className="text-xs text-gray-400 mb-1">
                        {overlay.speaker === "remote"
                          ? MOCK_PARTNER.name
                          : "You"}
                      </p>
                      <p className="text-white text-sm mb-2">{overlay.text}</p>
                      <p className="text-purple-300 text-xs">
                        {overlay.language}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm text-center py-8">
                    Waiting for translation...
                  </p>
                )}
              </div>
            )}

            <Button
              className="w-full bg-purple-600 hover:bg-purple-700 mt-4"
              onClick={() => setShowTranscript(true)}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              View Transcript
            </Button>
          </Card>
        </div>
      </div>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Call Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 block mb-2">
                Language Pair
              </label>
              <select
                value={selectedLanguagePair}
                onChange={(e) => setSelectedLanguagePair(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded px-3 py-2"
              >
                <option>Auto-detect</option>
                <option>English ↔ Chinese</option>
                <option>English ↔ Spanish</option>
                <option>English ↔ Japanese</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-white">Translation Overlay</label>
              <input
                type="checkbox"
                checked={translationEnabled}
                onChange={(e) => setTranslationEnabled(e.target.checked)}
                className="w-4 h-4"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-white">Background Blur</label>
              <input type="checkbox" className="w-4 h-4" />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Transcript Dialog */}
      <Dialog open={showTranscript} onOpenChange={setShowTranscript}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl max-h-96">
          <DialogHeader>
            <DialogTitle className="text-white">Call Transcript</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 overflow-y-auto max-h-80">
            {transcript.length > 0 ? (
              transcript.map((entry, idx) => (
                <div key={idx} className="bg-slate-800/50 p-3 rounded">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-bold text-white text-sm">
                      {entry.speaker}
                    </p>
                    <p className="text-gray-400 text-xs">{entry.timestamp}</p>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{entry.text}</p>
                  {entry.translated && (
                    <div className="bg-slate-700/50 p-2 rounded flex justify-between items-start">
                      <p className="text-purple-300 text-xs flex-1">
                        {entry.translated}
                      </p>
                      <button
                        onClick={() => handleCopyTranslation(entry.translated!)}
                        className="ml-2 text-purple-400 hover:text-purple-300"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-8">
                No transcript yet
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default VideoChat;
