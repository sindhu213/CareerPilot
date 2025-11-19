import { useState, useRef, useEffect } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Send, Sparkles } from 'lucide-react';
import type { User, Page } from '../App';
import ReactMarkdown from "react-markdown";

type Message = {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

type CareerPathsProps = {
  user: User;
  onNavigate: (page: Page) => void;
};

export function CareerPaths({ user, onNavigate }: CareerPathsProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content:
        "Hi! I'm your AI Career Assistant 🤖\n\nI can help you explore career paths, suggest in-demand skills, give resume improvement tips, and help you plan your next step. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const quickPrompts = [
    'Suggest a career path for me',
    'What skills should I learn for AI/ML?',
    'How can I make my resume better?',
    'Tips for cracking interviews',
  ];

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (customInput?: string) => {
    const query = customInput ?? input;
    if (!query.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    const aiText = await fetchAIResponse(query);

    const assistantMessage: Message = {
      id: Date.now(),
      role: "assistant",
      content: aiText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  const fetchAIResponse = async (query: string) => {
    try {
      const res = await fetch("http://localhost:5001/api/careerChat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ message: query }),
      });

      const data = await res.json();
      return data.reply || "No response from AI.";
    } catch (err) {
      return "Error: unable to connect to AI server.";
    }
  };

 return (
  <DashboardLayout
    currentPage="career-paths"
    onNavigate={onNavigate}
    userName={user.name}
  >
    {/* Full height chat — fills the screen, no nested scroll containers */}
    <div className="flex flex-col h-screen bg-background">
  {/* Header */}
  <header className="p-6 border-b border-border flex-shrink-0">
    <h1 className="flex items-center gap-2 text-xl font-semibold">
      <Sparkles className="size-6 text-primary" />
      AI Career Chatbot
    </h1>
    <p className="text-sm text-muted-foreground">
      Chat with our AI assistant to get personalized career guidance, skill
      recommendations, and resume advice.
    </p>
  </header>

  {/* Chat Section */}
  <main className="flex flex-col flex-1 overflow-hidden">
    {/* Messages Area */}
    <div
      ref={scrollRef}
      className="flex-1 p-6 space-y-4 overflow-y-auto no-scrollbar"
    >
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${
            msg.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
            <div
              className={`max-w-[75%] rounded-lg p-3 text-sm ${
                msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              <div className="prose prose-sm max-w-none whitespace-pre-line">
                <ReactMarkdown>
                  {msg.content}
                </ReactMarkdown>
              </div>

              <div className="text-xs opacity-60 mt-1">
                {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>

        </div>
      ))}

      {isTyping && (
        <div className="flex justify-start">
          <div className="bg-muted rounded-lg p-3 flex gap-1">
            <div className="size-2 bg-muted-foreground rounded-full animate-bounce" />
            <div
              className="size-2 bg-muted-foreground rounded-full animate-bounce"
              style={{ animationDelay: '150ms' }}
            />
            <div
              className="size-2 bg-muted-foreground rounded-full animate-bounce"
              style={{ animationDelay: '300ms' }}
            />
          </div>
        </div>
      )}
    </div>

    {/* Quick Prompts */}
    {messages.length <= 1 && (
      <div className="p-4 border-t border-border bg-muted/30 flex-shrink-0">
        <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSendMessage(prompt)}
              className="text-xs px-3 py-1 bg-accent hover:bg-accent/80 rounded-full transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    )}

    {/* Input Box */}
    <footer className="p-4 border-t border-border bg-background flex-shrink-0">
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder="Ask about careers, skills, or resume tips..."
          className="flex-1"
        />
        <Button onClick={() => handleSendMessage()} size="sm">
          <Send className="size-4" />
        </Button>
      </div>
    </footer>
  </main>
</div>

  </DashboardLayout>
);
}