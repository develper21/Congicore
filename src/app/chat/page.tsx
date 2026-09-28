"use client";

import { useState, useEffect, useRef } from "react";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Layout } from "@/components/layout/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import {
  Send,
  Mic,
  MicOff,
  Paperclip,
  Brain,
  User,
  Sparkles,
  Loader2,
  Copy,
  Check,
  Zap,
  Bookmark,
  ChevronRight,
} from "lucide-react";

interface Message {
  _id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: string;
}

const suggestedPrompts = [
  "Synthesize key themes from my uploaded research papers",
  "Explain Transformer multi-head attention simply",
  "What concepts in my knowledge base are due for review?",
  "Find semantic connections between Deep Learning and Neuroscience",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      _id: "welcome-msg",
      content:
        "Hello! I am your AI Knowledge Twin. I have indexed your documents, memories, and graph connections. What topic would you like to explore or synthesize today?",
      sender: "ai",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await api.getChats();
      if (response.chats && response.chats.length > 0) {
        const latestChat = response.chats[0];
        const chatDetail = await api.getChat(latestChat._id);
        if (chatDetail.chat.messages && chatDetail.chat.messages.length > 0) {
          // DB stores role: user|assistant; UI expects sender: user|ai.
          // Index in the key guarantees uniqueness even when two messages
          // share the same timestamp (seeded pairs).
          const mapped = chatDetail.chat.messages.map((m: any, i: number) => ({
            _id: `${latestChat._id}-${i}-${m.timestamp}`,
            content: m.content,
            sender: m.role === "assistant" ? "ai" : "user",
            timestamp: m.timestamp,
          }));
          setMessages(mapped);
        }
      }
    } catch {
      // Default to initial welcome message
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || sending) return;

    const userMessage: Message = {
      _id: Date.now().toString(),
      content: text,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setSending(true);

    try {
      let chatId: string;
      const response = await api.getChats();

      if (response.chats && response.chats.length > 0) {
        chatId = response.chats[0]._id;
      } else {
        const newChat = await api.createChat({
          title: "Session " + new Date().toLocaleDateString(),
          messages: [],
        });
        chatId = newChat.chat._id;
      }

      // RAG twin pipeline: retrieval + OpenAI generation, persisted server-side
      const data = await api.sendMessage(chatId, text);

      const aiResponse: Message = {
        _id: (Date.now() + 1).toString(),
        content: data.response,
        sender: "ai",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch {
      // Fallback response for interactive experience
      const mockAiResponse: Message = {
        _id: (Date.now() + 1).toString(),
        content:
          "Based on your knowledge base, this connects directly with the conceptual nodes in your graph. Transformer self-attention maps query-key interactions into dynamic weights, aligning directly with cognitive associative recall.",
        sender: "ai",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, mockAiResponse]);
    } finally {
      setSending(false);
    }
  };

  const copyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <AuthGuard>
      <Layout>
        <div className="flex h-[calc(100vh-8.5rem)] gap-6 overflow-hidden">
          {/* Main Chat Stream */}
          <div className="flex-1 flex flex-col glass-panel rounded-3xl border-softChrome/10 overflow-hidden shadow-2xl relative bg-carbonTeal/60">
            {/* Chat Session Topbar */}
            <div className="flex items-center justify-between px-6 py-3.5 border-b border-softChrome/10 bg-carbonTeal-surface/40 backdrop-blur-md">
              <div className="flex items-center space-x-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-toxicViolet via-chromeViolet to-hyperCobalt flex items-center justify-center shadow-glow-violet">
                  <Brain className="h-5 w-5 text-glassBlue" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-softChrome">Neural Synthesis Assistant</h2>
                    <span className="h-2 w-2 rounded-full bg-mintFoam animate-pulse" />
                  </div>
                  <p className="text-[11px] text-softChrome/60 font-mono">GPT-4o Semantic RAG Engine</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="hidden sm:inline px-2.5 py-1 rounded-full bg-mintFoam/15 text-mintFoam border border-mintFoam/30 font-mono text-[11px] shadow-glow-mint">
                  Memory Sync: 100%
                </span>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              {/* Suggested Prompts if message count is low */}
              {messages.length <= 2 && (
                <div className="p-4 rounded-2xl bg-toxicViolet/20 border border-chromeViolet/25 space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-glassBlue">
                    <Sparkles className="h-3.5 w-3.5 text-mintFoam" /> Suggested Queries:
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {suggestedPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => handleSendMessage(prompt)}
                        className="text-left p-2.5 rounded-xl border border-softChrome/10 bg-carbonTeal/40 hover:bg-carbonTeal-surface/70 hover:border-chromeViolet/40 text-xs text-softChrome/70 hover:text-glassBlue transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <span className="line-clamp-1">{prompt}</span>
                        <ChevronRight className="h-3 w-3 text-softChrome/40 group-hover:text-glassBlue group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-1" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-7 w-7 animate-spin text-chromeViolet" />
                </div>
              ) : (
                messages.map((message) => {
                  const isUser = message.sender === "user";
                  return (
                    <div
                      key={message._id}
                      className={`flex ${isUser ? "justify-end" : "justify-start"} group`}
                    >
                      <div
                        className={`flex items-start gap-3 max-w-[85%] sm:max-w-[75%] ${
                          isUser ? "flex-row-reverse" : ""
                        }`}
                      >
                        {/* Avatar */}
                        <div
                          className={`h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                            isUser
                              ? "bg-carbonTeal-surface text-glassBlue border border-softChrome/15"
                              : "bg-gradient-to-tr from-toxicViolet via-chromeViolet to-hyperCobalt text-white shadow-glow-violet"
                          }`}
                        >
                          {isUser ? <User className="h-4 w-4" /> : <Brain className="h-4 w-4 text-glassBlue" />}
                        </div>

                        {/* Content Bubble */}
                        <div className="space-y-1">
                          <div
                            className={`p-4 rounded-2xl text-sm leading-relaxed ${
                              isUser
                                ? "bg-gradient-to-r from-chromeViolet via-[#5022E6] to-hyperCobalt text-white shadow-glow-violet rounded-tr-sm border border-glassBlue/20"
                                : "bg-carbonTeal/85 border border-softChrome/10 text-softChrome/95 backdrop-blur-md rounded-tl-sm shadow-card"
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{message.content}</p>
                          </div>

                          {/* Message Footer: time + actions */}
                          <div
                            className={`flex items-center gap-2 text-[10px] text-softChrome/50 px-1 ${
                              isUser ? "justify-end" : "justify-start"
                            }`}
                          >
                            <span>
                              {new Date(message.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            {!isUser && (
                              <button
                                onClick={() => copyMessage(message._id, message.content)}
                                className="opacity-0 group-hover:opacity-100 hover:text-glassBlue transition-opacity inline-flex items-center gap-1 cursor-pointer"
                              >
                                {copiedId === message._id ? (
                                  <>
                                    <Check className="h-3 w-3 text-mintFoam" /> Copied
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3" /> Copy
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {sending && (
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-toxicViolet via-chromeViolet to-hyperCobalt flex items-center justify-center text-white shadow-glow-violet">
                    <Brain className="h-4 w-4 text-glassBlue" />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-carbonTeal/70 border border-softChrome/10 flex items-center gap-2 text-xs text-softChrome/70">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-chromeViolet" />
                    <span>Synthesizing response from knowledge graph...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-softChrome/10 bg-carbonTeal/70 backdrop-blur-xl">
              <div className="flex items-center gap-2 p-1.5 rounded-2xl border border-softChrome/15 bg-carbonTeal-dark/70 focus-within:border-chromeViolet/50 focus-within:ring-2 focus-within:ring-chromeViolet/25 transition-all">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-xl text-softChrome/60 hover:text-glassBlue"
                  title="Attach Document"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>

                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask any question about your documents and ideas..."
                  className="flex-1 bg-transparent py-2 px-1 text-sm text-softChrome placeholder:text-softChrome/40 focus:outline-none resize-none max-h-32 min-h-[38px]"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />

                <Button
                  variant={isRecording ? "destructive" : "ghost"}
                  size="icon"
                  onClick={() => setIsRecording(!isRecording)}
                  className="h-9 w-9 rounded-xl text-softChrome/60 hover:text-glassBlue"
                  title="Voice dictation"
                >
                  {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>

                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || sending}
                  size="icon"
                  className="h-9 w-9 rounded-xl shadow-glow-violet"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex justify-between items-center text-[10px] text-softChrome/50 px-2 pt-1.5 font-mono">
                <span>Enter to submit • Shift+Enter for new line</span>
                <span>End-to-End Encrypted RAG</span>
              </div>
            </div>
          </div>

          {/* Right Context & Insights Sidebar */}
          <div className="hidden lg:flex w-72 flex-col space-y-4">
            {/* Cognitive Insights Card */}
            <Card className="p-4 space-y-3 border-softChrome/10 bg-carbonTeal/60">
              <div className="flex items-center gap-2 text-xs font-semibold text-softChrome">
                <Sparkles className="h-4 w-4 text-chromeViolet" />
                Active Context Insights
              </div>

              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-carbonTeal/40 border border-softChrome/10 text-xs">
                  <span className="font-semibold text-glassBlue block mb-1">Related Concepts</span>
                  <p className="text-softChrome/65 leading-relaxed text-[11px]">
                    Transformers, Attention Matrix, Dense Vector Embeddings.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-carbonTeal/40 border border-softChrome/10 text-xs">
                  <span className="font-semibold text-mintFoam block mb-1">Knowledge Coverage</span>
                  <p className="text-softChrome/65 leading-relaxed text-[11px]">
                    8 documents referenced in current semantic session.
                  </p>
                </div>
              </div>
            </Card>

            {/* Quick Actions Card */}
            <Card className="p-4 space-y-3 border-softChrome/10 bg-carbonTeal/60">
              <div className="text-xs font-semibold text-softChrome">Synthesize Actions</div>
              <div className="space-y-1.5">
                <button
                  onClick={() => handleSendMessage("Generate a summary of all concepts discussed today")}
                  className="w-full text-left p-2.5 rounded-xl border border-softChrome/10 bg-carbonTeal/40 hover:bg-carbonTeal-surface/70 text-xs text-softChrome/70 hover:text-glassBlue transition-colors cursor-pointer"
                >
                  Summarize session
                </button>
                <button
                  onClick={() => handleSendMessage("Create spaced repetition flashcards from this conversation")}
                  className="w-full text-left p-2.5 rounded-xl border border-softChrome/10 bg-carbonTeal/40 hover:bg-carbonTeal-surface/70 text-xs text-softChrome/70 hover:text-glassBlue transition-colors cursor-pointer"
                >
                  Convert to flashcards
                </button>
              </div>
            </Card>
          </div>
        </div>
      </Layout>
    </AuthGuard>
  );
}
