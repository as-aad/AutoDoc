'use client';

import { useState } from 'react';
import { Send, MessageSquare, User, Wrench, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatMessage {
  id: string;
  sender: 'customer' | 'garage' | 'mechanic';
  senderName: string;
  text: string;
  timestamp: string;
}

export function InAppChat({ bookingId, garageName }: { bookingId: string; garageName: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'garage',
      senderName: garageName,
      text: 'Hello! We have received your booking and assigned mechanic Jordan Reyes to your vehicle.',
      timestamp: '10:15 AM',
    },
    {
      id: 'msg-2',
      sender: 'customer',
      senderName: 'You',
      text: 'Great! Can I drop off the car around 1:00 PM today?',
      timestamp: '10:18 AM',
    },
    {
      id: 'msg-3',
      sender: 'garage',
      senderName: garageName,
      text: 'Yes, 1:00 PM works perfectly. See you soon!',
      timestamp: '10:20 AM',
    },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'customer',
      senderName: 'You',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
  };

  return (
    <div className="hydro-card-surface rounded-2xl border border-border flex flex-col h-[400px]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-secondary/30">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-[#FF5500]" />
          <span className="font-hydro-display font-bold text-sm">Booking Workspace Chat</span>
        </div>
        <span className="text-[10px] font-mono font-bold text-[#FF5500] uppercase bg-[#FF5500]/10 px-2 py-0.5 rounded-full">
          Live Session #{bookingId.slice(-6)}
        </span>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'customer' ? 'items-end' : 'items-start'}`}
          >
            <span className="text-[10px] text-muted-foreground font-mono mb-1">{m.senderName} • {m.timestamp}</span>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs ${
                m.sender === 'customer'
                  ? 'bg-[#FF5500] text-white font-medium rounded-tr-none'
                  : 'bg-secondary text-foreground rounded-tl-none border border-border'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-border flex gap-2">
        <Input
          placeholder="Ask a question or update garage..."
          className="h-10 text-xs rounded-xl"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <Button type="submit" className="h-10 bg-[#FF5500] hover:bg-[#FF7700] text-white font-bold rounded-xl px-4">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
