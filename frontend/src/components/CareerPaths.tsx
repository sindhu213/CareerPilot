
import { useState, useRef, useEffect } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Send, Sparkles } from 'lucide-react';
import type { User, Page } from '../App';

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

  // ✅ Smooth auto-scroll when messages or typing change
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isTyping]);

  const handleSendMessage = (customInput?: string) => {
    const query = customInput ?? input;
    if (!query.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      role: 'user',
      content: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = generateAIResponse(query);
      const assistantMessage: Message = {
        id: Date.now(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const generateAIResponse = (query: string): string => {
    const lower = query.toLowerCase();

    if (lower.includes('resume')) {
      return `Here are a few ways to improve your resume:\n\n• Use strong action verbs and measurable results\n• Highlight relevant technical and soft skills\n• Keep it tailored for your target role\n• Use a clean, ATS-friendly layout\n\n💡 You can also try our Resume Analyzer tool for AI-based feedback.`;
    }

    if (lower.includes('skill')) {
      return `🔥 Trending skills in the tech job market:\n\n• React, Next.js, and TypeScript\n• Generative AI & LLM APIs\n• Cloud (AWS, GCP, Azure)\n• Data Engineering (SQL, ETL, Airflow)\n• DevOps & CI/CD\n\nFocus on building real projects to showcase these skills!`;
    }

    if (lower.includes('career') || lower.includes('path')) {
      return `Based on your background, you could explore:\n\n• Full Stack Developer\n• AI/ML Engineer\n• Data Analyst / Data Scientist\n• Cloud Engineer\n• Product Management (with technical focus)\n\nWould you like me to suggest a learning roadmap for one of these?`;
    }

    if (lower.includes('interview')) {
      return `🧠 Interview Preparation Tips:\n\n• Revise your core CS fundamentals (DSA, DBMS, OS)\n• Practice coding questions daily\n• Prepare STAR-format answers for HR rounds\n• Review your resume line-by-line\n• Research the company before the interview`;
    }

    return `That's an interesting question! I can help with:\n\n• Career path suggestions\n• Skill gap analysis\n• Resume and interview tips\n• Learning resources\n\nCould you tell me what kind of role or domain you're targeting?`;
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
            className={`max-w-[75%] rounded-lg p-3 text-sm whitespace-pre-line ${
              msg.role === 'user'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted'
            }`}
          >
            {msg.content}
            <div className="text-xs opacity-60 mt-1">
              {msg.timestamp.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
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
