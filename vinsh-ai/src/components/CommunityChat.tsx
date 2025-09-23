import React, { useRef, useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Users, Send, ArrowLeft, Hash } from "lucide-react";
import Threads from "./Threads";

interface CommunityChatProps {
  onBack: () => void;
}

interface ChatMessage {
  id: string;
  author: string;
  text: string;
  timestamp: number;
}

export default function CommunityChat({ onBack }: CommunityChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "1", author: "Priya", text: "Welcome to the Community! Introduce yourself 👋", timestamp: Date.now() - 600000 },
    { id: "2", author: "Arjun", text: "Anyone from the 2025 JEE batch here?", timestamp: Date.now() - 540000 },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMessage: ChatMessage = {
      id: String(Date.now()),
      author: "You",
      text: input.trim(),
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  return (
    <div className="h-screen relative overflow-hidden" style={{ background: 'linear-gradient(to right, rgb(15, 23, 42), rgb(51, 65, 85))' }}>
      {/* Threaded Background */}
      <div className="absolute inset-0 z-0">
        <Threads
          amplitude={1}
          distance={0}
          enableMouseInteraction={true}
        />
      </div>
      <div className="flex flex-col h-full relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-4 lg:p-6">
          <div className="flex items-center gap-3">
          <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:bg-white/10 border border-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2 text-white">
              <Users className="w-5 h-5" />
              <span style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>Community</span>
            </div>
          </div>
          <div className="text-white/80 flex items-center gap-2">
            <Hash className="w-4 h-4" />
            <span className="text-sm">joint-course-general</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 lg:px-6 pb-4 space-y-3">
          {messages.map((m) => (
            <div key={m.id} className="flex">
              <Card className="bg-white/10 border-white/20 p-3 text-white w-fit max-w-[80%]">
                <div className="text-xs text-white/70 mb-1">{m.author}</div>
                <div className="text-sm" style={{ fontFamily: 'Bethaine, Arial, sans-serif' }}>{m.text}</div>
                <div className="text-[10px] text-white/50 mt-1">{new Date(m.timestamp).toLocaleTimeString()}</div>
              </Card>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 lg:p-6">
          <Card className="backdrop-blur-lg bg-white/10 border border-white/20 p-4 shadow-xl">
            <div className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Message community..."
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-full"
              />
              <Button onClick={sendMessage} disabled={!input.trim()} className="text-white border-0 rounded-full px-6 shadow-lg disabled:opacity-50 hover:opacity-90" style={{ background: 'linear-gradient(135deg, rgb(114, 4, 85), rgb(145, 10, 103))' }}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}


