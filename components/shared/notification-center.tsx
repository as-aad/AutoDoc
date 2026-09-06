'use client';

import { useState } from 'react';
import { Bell, Wrench, ShieldCheck, Tag, CheckCircle2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: 'quote' | 'booking' | 'warranty' | 'reminder';
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'New Garage Quote Received',
      message: 'Apex Performance submitted a quote of $280 for Brake Pad Replacement.',
      time: '10 min ago',
      unread: true,
      type: 'quote',
    },
    {
      id: 'notif-2',
      title: 'Service Booking Confirmed',
      message: 'Mechanic Jordan Reyes has started work on your vehicle.',
      time: '1 hour ago',
      unread: true,
      type: 'booking',
    },
    {
      id: 'notif-3',
      title: 'Document Expiry Warning',
      message: 'State Insurance Certificate expires in 10 days.',
      time: '5 hours ago',
      unread: false,
      type: 'reminder',
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF5500] text-[10px] font-bold text-white shadow-sm">
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 rounded-2xl border border-border shadow-2xl" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/50">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-[#FF5500]" />
            <span className="font-hydro-display font-bold text-xs uppercase tracking-wider">Notifications</span>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-[10px] font-bold text-[#FF5500] hover:underline">
              Mark all read
            </button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto divide-y divide-border">
          {notifications.map((n) => (
            <div key={n.id} className={`p-3.5 transition-colors ${n.unread ? 'bg-[#FF5500]/5' : ''}`}>
              <div className="flex items-start justify-between">
                <p className="font-hydro-display font-bold text-xs text-foreground">{n.title}</p>
                <span className="text-[9px] font-mono text-muted-foreground">{n.time}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
