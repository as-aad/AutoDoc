'use client';

import { useEffect, useState, useRef } from 'react';
import { MessageSquare, Send, Wrench, User, ShieldCheck, RefreshCw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getBookingMessages, sendBookingMessage } from '@/services';
import type { BookingMessage, Role } from '@/lib/types';

interface MechanicChatDialogProps {
  bookingId: string;
  mechanicName?: string;
  customerName?: string;
  currentUserRole: Role;
  currentUserId: string;
  currentUserName: string;
  buttonVariant?: 'default' | 'outline' | 'secondary' | 'ghost';
  buttonText?: string;
}

export function MechanicChatDialog({
  bookingId,
  mechanicName = 'Shop Mechanic',
  customerName = 'Customer',
  currentUserRole,
  currentUserId,
  currentUserName,
  buttonVariant = 'default',
  buttonText,
}: MechanicChatDialogProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<BookingMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    if (!bookingId) return;
    setLoading(true);
    try {
      const msgs = await getBookingMessages(bookingId);
      setMessages(msgs);
    } catch (e) {
      console.error('Failed to load chat messages:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [open, bookingId]);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || sending) return;
    const textToSend = inputText.trim();
    setInputText('');
    setSending(true);

    try {
      const newMsg = await sendBookingMessage(
        bookingId,
        currentUserId,
        currentUserName,
        currentUserRole,
        textToSend
      );
      if (newMsg) {
        setMessages((prev) => [...prev, newMsg]);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  const chatTitle = "Unified 3-Way Repair Chat";
  const chatSubtitle = "Live connected line • Customer, Garage Owner & Mechanic";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} className="gap-2 font-display font-bold">
          <MessageSquare className="h-4 w-4 text-[#FF5500]" />
          {buttonText || (currentUserRole === 'customer' ? 'Talk to Mechanic & Garage' : currentUserRole === 'mechanic' ? 'Chat with Customer & Garage' : 'Message Customer & Mechanic')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg flex flex-col h-[580px] p-0 gap-0 overflow-hidden bg-card border-2 border-border">
        {/* Header */}
        <DialogHeader className="p-4 border-b border-border bg-muted/40 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#FF5500]/10 flex items-center justify-center border border-[#FF5500]/30 text-[#FF5500]">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold font-display">{chatTitle}</DialogTitle>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                {chatSubtitle}
              </p>
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={fetchMessages}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </DialogHeader>

        {/* Message Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-background/50">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground space-y-2">
              <MessageSquare className="h-10 w-10 text-muted-foreground/40 mb-1" />
              <p className="font-display font-semibold text-foreground">Start the Conversation</p>
              <p className="text-xs max-w-xs">
                Direct channel between customer and assigned shop mechanic. Ask repair questions or share updates!
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId === currentUserId || msg.senderRole === currentUserRole;
              const formattedTime = new Date(msg.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[11px] font-bold text-muted-foreground">{msg.senderName}</span>
                    <Badge variant="outline" className="text-[9px] px-1 py-0 uppercase">
                      {msg.senderRole}
                    </Badge>
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                      isMe
                        ? 'bg-[#FF5500] text-white rounded-br-none'
                        : 'bg-secondary text-foreground border border-border rounded-bl-none'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1 px-1">{formattedTime}</span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Footer / Input form */}
        <form onSubmit={handleSend} className="p-3 border-t border-border bg-card flex gap-2 items-center">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-xl h-11 text-sm bg-background border-border"
          />
          <Button
            type="submit"
            disabled={!inputText.trim() || sending}
            className="h-11 px-4 bg-[#FF5500] hover:bg-[#FF7700] text-white font-bold rounded-xl"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
