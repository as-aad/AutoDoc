'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ActivityItem {
  id: string;
  text: string;
  time: string;
}

const defaultActivities: ActivityItem[] = [
  { id: '1', text: 'Apex Motors completed brake service on a Toyota Corolla', time: '10m ago' },
  { id: '2', text: 'A customer requested a transmission diagnostic for a Ford F-150', time: '18m ago' },
  { id: '3', text: 'Downtown Auto Care issued a quote for a Honda Civic', time: '25m ago' },
  { id: '4', text: 'A customer approved a battery replacement for a BMW 3-Series', time: '34m ago' },
  { id: '5', text: 'Precision Repair logged a digital service history entry for a Hyundai Elantra', time: '45m ago' },
  { id: '6', text: 'Metro Garage verified an engine oil change for a Nissan X-Trail', time: '1h ago' },
];

interface ActivityTickerProps {
  items?: ActivityItem[];
  className?: string;
  speedSeconds?: number;
}

export function ActivityTicker({
  items = defaultActivities,
  className,
  speedSeconds = 90,
}: ActivityTickerProps) {
  // Quadruple list for smooth infinite scrolling marquee
  const tickerItems = [...items, ...items, ...items, ...items];

  return (
    <div
      className={cn(
        'relative flex w-full overflow-hidden border-y border-[#E2E8F0] bg-white/90 backdrop-blur-xs py-3.5 z-20',
        className
      )}
    >
      {/* Left/Right Fading Gradients */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-30 w-20 bg-gradient-to-r from-[#F8FAFC] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-30 w-20 bg-gradient-to-l from-[#F8FAFC] to-transparent" />

      {/* Ticker Track */}
      <div
        className="flex shrink-0 items-center gap-10 pl-4 activity-ticker-track"
        style={{ animationDuration: `${speedSeconds}s` }}
      >
        {tickerItems.map((item, index) => (
          <div key={`${item.id}-${index}`} className="flex items-center gap-2.5 whitespace-nowrap text-xs font-semibold text-[#334155]">
            <span className="h-2 w-2 rounded-full bg-[#606BDF] animate-pulse shrink-0" />
            <span className="text-[#0F172A] font-medium">{item.text}</span>
            <span className="text-[#64748B] font-normal">({item.time})</span>
          </div>
        ))}
      </div>
    </div>
  );
}
