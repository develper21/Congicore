"use client";

import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
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
  MessageSquare,
} from "lucide-react";

interface Message {
  _id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getChats();
      if (response.chats && response.chats.length > 0) {
        const latestChat = response.chats[0];
        const chatDetail = await api.getChat(latestChat._id);
        setMessages(chatDetail.chat.messages || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch chat data");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        _id: Date.now().toString(),
        content: inputValue,
        sender: "user",
        timestamp: new Date().toISOString(),
      };

      setMessages([...messages, newMessage]);
      setInputValue("");

      try {
        // Send message to API
        // For now, simulate AI response
        setTimeout(() => {
          const aiResponse: Message = {
            _id: (Date.now() + 1).toString(),
            content:
              "I'm processing your request and searching through your knowledge base for the most relevant information...",
            sender: "ai",
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, aiResponse]);
        }, 1000);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to send message");
      }
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <Layout>
      <div className="flex h-[calc(100vh-8rem)]">
        <div className="flex-1 flex flex-col">
          <div className="border-b p-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-primary/60 flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold">AI Knowledge Twin</h2>
                <p className="text-sm text-muted-foreground">
                  Always here to help you learn
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={fetchChats}>Retry</Button>
              </div>
            ) : messages.length === 0 ? (
              <EmptyState
                icon={MessageSquare}
                title="No messages yet"
                description="Start a conversation with your AI Knowledge Twin"
                action={{
                  label: "Send a message",
                  onClick: () => {/* Focus input */},
                }}
              />
            ) : (
              messages.map((message) => (
                <div
                  key={message._id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex items-start space-x-3 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                  >
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-gradient-to-r from-primary to-primary/60 text-white"
                      }`}
                    >
                      {message.sender === "user" ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Brain className="h-4 w-4" />
                      )}
                    </div>
                    <div
                      className={`rounded-lg p-3 ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t p-4">
            <div className="flex items-end space-x-2">
              <Button variant="outline" size="icon">
                <Paperclip className="h-4 w-4" />
              </Button>
              <div className="flex-1">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything about your knowledge base..."
                  className="w-full p-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
              </div>
              <Button
                variant={isRecording ? "destructive" : "outline"}
                size="icon"
                onClick={toggleRecording}
              >
                {isRecording ? (
                  <MicOff className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
              <Button onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="w-80 border-l p-4 space-y-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center">
                <Sparkles className="h-4 w-4 mr-2" />
                AI Insights
              </h3>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-medium">Related Topics</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Based on your conversation, you might be interested in Deep
                    Learning and Neural Networks
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-medium">Knowledge Gap</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Consider exploring more about Reinforcement Learning
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Summarize recent documents
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Find related concepts
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Create study plan
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Chat Statistics</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Messages today</span>
                  <span className="font-medium">24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Topics covered</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Documents referenced
                  </span>
                  <span className="font-medium">5</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
