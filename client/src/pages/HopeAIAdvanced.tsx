import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Send, Zap, Code, Brain, Sparkles, Copy, Download, Share2, Settings,
  RotateCcw, Maximize2, Minimize2, MessageSquare, Lightbulb, BookOpen,
  Cpu, Wand2, Play, Square, ChevronDown, ChevronUp, Clock, AlertCircle
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  mode?: "chat" | "code" | "reasoning" | "creative";
  metadata?: {
    tokensUsed?: number;
    thinkingTime?: number;
    confidence?: number;
  };
}

interface AICapability {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  examples: string[];
}

export default function HopeAIAdvanced() {
  const { isAuthenticated, user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"chat" | "code" | "reasoning" | "creative">("chat");
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const capabilities: AICapability[] = [
    {
      id: "code-generation",
      name: "Code Generation",
      description: "Write, debug, and optimize code in any language",
      icon: <Code className="w-5 h-5" />,
      examples: [
        "Write a React component for a crypto wallet",
        "Debug this Python script",
        "Optimize this SQL query"
      ]
    },
    {
      id: "reasoning",
      name: "Advanced Reasoning",
      description: "Deep analysis with step-by-step thinking",
      icon: <Brain className="w-5 h-5" />,
      examples: [
        "Explain DeFi arbitrage opportunities",
        "Analyze smart contract security",
        "Design a tokenomics model"
      ]
    },
    {
      id: "creative",
      name: "Creative Writing",
      description: "Generate content, stories, and creative text",
      icon: <Sparkles className="w-5 h-5" />,
      examples: [
        "Write a compelling product description",
        "Create a marketing campaign",
        "Write a sci-fi story about AI"
      ]
    },
    {
      id: "learning",
      name: "Learning & Tutoring",
      description: "Explain concepts and teach new skills",
      icon: <BookOpen className="w-5 h-5" />,
      examples: [
        "Explain blockchain technology",
        "Teach me machine learning",
        "How does quantum computing work?"
      ]
    },
    {
      id: "analysis",
      name: "Data Analysis",
      description: "Analyze data, trends, and patterns",
      icon: <Cpu className="w-5 h-5" />,
      examples: [
        "Analyze this crypto market data",
        "What are the trends in this dataset?",
        "Generate insights from this data"
      ]
    },
    {
      id: "problem-solving",
      name: "Problem Solving",
      description: "Solve complex problems step by step",
      icon: <Lightbulb className="w-5 h-5" />,
      examples: [
        "Help me design a scalable architecture",
        "How do I approach this challenge?",
        "What's the best solution for this?"
      ]
    }
  ];

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: Date.now(),
      mode
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Simulate AI response with different modes
      await new Promise(resolve => setTimeout(resolve, 1500));

      let responseContent = "";
      const thinkingTime = Math.random() * 2000 + 500;

      switch (mode) {
        case "code":
          responseContent = `\`\`\`javascript
// Generated code for: ${input}
function solution() {
  // Implementation here
  return result;
}
\`\`\`

This code implements the solution you requested. Key features:
- Efficient algorithm
- Well-commented
- Production-ready`;
          break;

        case "reasoning":
          responseContent = `Let me think through this step-by-step:

**Step 1: Understanding the problem**
${input}

**Step 2: Analysis**
Breaking down the key components...

**Step 3: Solution**
The optimal approach is...

**Step 4: Verification**
This solution is effective because...

**Confidence Level:** 95%`;
          break;

        case "creative":
          responseContent = `Here's a creative response to your request:

${input}

---

This captures the essence of what you're looking for while maintaining originality and engagement. Feel free to ask for variations or refinements!`;
          break;

        default:
          responseContent = `I'm Hope AI, your advanced AI assistant. I can help with:

✓ **Code Generation** - Write and debug code in any language
✓ **Advanced Reasoning** - Deep analysis with step-by-step thinking
✓ **Creative Writing** - Generate compelling content
✓ **Learning & Tutoring** - Explain complex concepts
✓ **Data Analysis** - Analyze trends and patterns
✓ **Problem Solving** - Tackle complex challenges

What would you like help with? You can also switch modes using the buttons above.`;
      }

      const assistantMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: responseContent,
        timestamp: Date.now(),
        mode,
        metadata: {
          tokensUsed: Math.floor(Math.random() * 1000) + 100,
          thinkingTime: Math.floor(thinkingTime),
          confidence: Math.random() * 0.3 + 0.7
        }
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast.error("Failed to get response");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard");
  };

  const handleDownloadConversation = () => {
    const content = messages
      .map(m => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n\n");
    const element = document.createElement("a");
    element.setAttribute("href", `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`);
    element.setAttribute("download", `hope-ai-conversation-${Date.now()}.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsExpanded(true)}
          className="rounded-full w-14 h-14 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 shadow-lg"
        >
          <MessageSquare className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Hope AI</h1>
              <p className="text-xs text-slate-400">Advanced AI Assistant - Better than ChatGPT</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="text-slate-400 hover:text-white"
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="text-slate-400 hover:text-white"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <Card className="bg-[#0e0a1a]/90 border border-white/5 mb-4">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-300 block mb-2">Temperature: {temperature.toFixed(1)}</label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={temperature}
                    onChange={e => setTemperature(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-slate-500 mt-1">Lower = more focused, Higher = more creative</p>
                </div>
                <div>
                  <label className="text-sm text-slate-300 block mb-2">Max Tokens: {maxTokens}</label>
                  <input
                    type="range"
                    min="256"
                    max="4096"
                    step="256"
                    value={maxTokens}
                    onChange={e => setMaxTokens(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mode Selector */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: "chat", label: "Chat", icon: <MessageSquare className="w-4 h-4" /> },
            { id: "code", label: "Code", icon: <Code className="w-4 h-4" /> },
            { id: "reasoning", label: "Reasoning", icon: <Brain className="w-4 h-4" /> },
            { id: "creative", label: "Creative", icon: <Sparkles className="w-4 h-4" /> }
          ].map(m => (
            <Button
              key={m.id}
              onClick={() => setMode(m.id as any)}
              className={`flex items-center gap-2 whitespace-nowrap ${
                mode === m.id
                  ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
                  : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
              }`}
            >
              {m.icon}
              {m.label}
            </Button>
          ))}
        </div>

        {/* Chat Area */}
        <Card className="bg-[#0e0a1a]/90 border border-white/5 mb-4 h-96 flex flex-col">
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Sparkles className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">Start a conversation with Hope AI</p>
                  <p className="text-slate-500 text-sm mt-2">Ask anything - code, reasoning, creative writing, and more</p>
                </div>
              </div>
            ) : (
              <>
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
                          : "bg-slate-800/50 text-slate-300 border border-slate-700"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      {msg.metadata && (
                        <div className="text-xs text-slate-400 mt-2 flex gap-2">
                          <span>⏱️ {msg.metadata.thinkingTime}ms</span>
                          <span>📊 {msg.metadata.tokensUsed} tokens</span>
                        </div>
                      )}
                      {msg.role === "assistant" && (
                        <div className="flex gap-2 mt-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCopyMessage(msg.content)}
                            className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-800/50 text-slate-300 px-4 py-2 rounded-lg border border-slate-700">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </CardContent>
        </Card>

        {/* Input Area */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && e.ctrlKey) {
                  handleSendMessage();
                }
              }}
              placeholder="Ask Hope AI anything... (Ctrl+Enter to send)"
              className="flex-1 bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 resize-none"
              rows={3}
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white h-full"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMessages([])}
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadConversation}
              disabled={messages.length === 0}
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Capabilities Showcase */}
        {messages.length === 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-white mb-4">What Hope AI Can Do</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {capabilities.map(cap => (
                <Card
                  key={cap.id}
                  className="bg-[#0e0a1a]/90 border border-white/5 hover:border-cyan-500/30 cursor-pointer transition-all"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-cyan-400">{cap.icon}</div>
                      <h3 className="font-semibold text-white">{cap.name}</h3>
                    </div>
                    <p className="text-sm text-slate-400 mb-3">{cap.description}</p>
                    <div className="space-y-1">
                      {cap.examples.map((ex, idx) => (
                        <button
                          key={idx}
                          onClick={() => setInput(ex)}
                          className="text-xs text-slate-500 hover:text-cyan-400 text-left block truncate"
                        >
                          → {ex}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
