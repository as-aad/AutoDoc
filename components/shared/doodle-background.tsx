'use client';

import React from 'react';
import {
  Wrench,
  Car,
  Gauge,
  Cog,
  Zap,
  Shield,
  BatteryCharging,
  Disc,
} from 'lucide-react';

interface DoodleConfig {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  size: number;
  top: string;
  left?: string;
  right?: string;
  duration: string;
  delay: string;
  rotation?: string;
}

// Reduced from 18 → 8 icons to cut rendering cost.
// GPU-composited via will-change: transform on each element.
const DOODLES: DoodleConfig[] = [
  { icon: Wrench,          size: 44, top: '6%',  left: '5%',  duration: '6.2s', delay: '-1.5s', rotation: '-12deg' },
  { icon: Car,             size: 52, top: '32%', left: '4%',  duration: '7.8s', delay: '-3.8s', rotation: '8deg'   },
  { icon: Gauge,           size: 38, top: '68%', left: '6%',  duration: '5.6s', delay: '-2.1s', rotation: '-5deg'  },
  { icon: Cog,             size: 48, top: '88%', left: '7%',  duration: '8.4s', delay: '-4.6s', rotation: '15deg'  },
  { icon: Zap,             size: 40, top: '8%',  right: '5%', duration: '5.8s', delay: '-1.9s', rotation: '-10deg' },
  { icon: Disc,            size: 50, top: '40%', right: '4%', duration: '6.5s', delay: '-3.1s', rotation: '-14deg' },
  { icon: Shield,          size: 44, top: '70%', right: '6%', duration: '7.6s', delay: '-2.4s', rotation: '9deg'   },
  { icon: BatteryCharging, size: 42, top: '90%', right: '5%', duration: '8.6s', delay: '-0.8s', rotation: '18deg'  },
];

export function DoodleBackground() {
  return (
    <div
      className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
      style={{ contain: 'layout style paint' }}
    >
      {DOODLES.map((d, index) => {
        const IconComponent = d.icon;
        return (
          <div
            key={index}
            className="doodle-icon"
            style={{
              top: d.top,
              left: d.left,
              right: d.right,
              animationDuration: d.duration,
              animationDelay: d.delay,
              transform: d.rotation ? `rotate(${d.rotation})` : undefined,
              willChange: 'transform',
            }}
          >
            <IconComponent
              className="text-slate-400/50 dark:text-slate-500/50"
              style={{
                width: `${d.size}px`,
                height: `${d.size}px`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
