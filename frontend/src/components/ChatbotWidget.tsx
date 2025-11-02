import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';

type Message = {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: 'Hi! I\'m your AI Career Assistant. I can help you with resume tips, career advice, skill recommendations, and answer any questions about your job search. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    'How can I improve my resume?',
    'What skills should I learn?',
    'Tips for job interviews',
    'Career path suggestions'
  ];

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(input);
      const assistantMessage: Message = {
        id: messages.length + 2,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const generateAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('resume')) {
      return 'Here are some tips to improve your resume:\n\n1. Use action verbs to describe your experience\n2. Quantify your achievements with metrics\n3. Tailor it to each job description\n4. Keep it concise (1-2 pages)\n5. Use our Resume Analyzer tool to get AI-powered suggestions!';
    }

    if (lowerQuery.includes('skill')) {
      return 'Based on current market trends, I recommend focusing on:\n\n• TypeScript for better code quality\n• Docker & Kubernetes for deployment\n• Testing frameworks like Jest\n• Cloud platforms (AWS/Azure)\n• System design principles\n\nCheck out the Career Paths section for personalized recommendations!';
    }

    if (lowerQuery.includes('interview')) {
      return 'Interview preparation tips:\n\n1. Research the company thoroughly\n2. Practice common technical questions\n3. Prepare STAR method examples\n4. Ask thoughtful questions\n5. Follow up with a thank-you email\n\nWould you like specific tips for technical or behavioral interviews?';
    }

    if (lowerQuery.includes('career') || lowerQuery.includes('path')) {
      return 'I can help you explore career paths! Based on your profile, you might be interested in:\n\n• Full Stack Development\n• Frontend Specialization\n• AI/ML Engineering\n• Data Science\n\nVisit the Career Paths section to see detailed recommendations matched to your skills!';
    }

    return 'That\'s a great question! I can help you with:\n\n• Resume building and optimization\n• Career path recommendations\n• Skill gap analysis\n• Interview preparation\n• Job search strategies\n\nCould you tell me more specifically what you\'d like help with?';
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 size-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center z-50"
      >
        <MessageSquare className="size-6" />
      </button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl flex flex-col z-50">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center gap-2">
          <div className="size-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
            <Sparkles className="size-4" />
          </div>
          <div>
            <h4>AI Career Assistant</h4>
            <p className="text-xs text-primary-foreground/80">Always here to help</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setIsOpen(false)}
          className="text-primary-foreground hover:bg-primary-foreground/20"
        >
          <X className="size-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                <p className="text-xs mt-1 opacity-60">
                  {message.timestamp.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3">
                <div className="flex gap-1">
                  <div className="size-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="size-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="size-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Quick Prompts */}
      {messages.length <= 1 && (
        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleQuickPrompt(prompt)}
                className="text-xs px-3 py-1 bg-accent hover:bg-accent/80 rounded-full transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me anything..."
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="sm">
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
