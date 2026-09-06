'use client';

import React from 'react';
import {
  Wrench,
  Car,
  Gauge,
  Fuel,
  Key,
  Droplet,
  Cog,
  Zap,
  Route,
  Shield,
  Triangle,
  Compass,
  Radio,
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

const DOODLES: DoodleConfig[] = [
  // Top Left Margin
  { icon: Wrench, size: 44, top: '4%', left: '5%', duration: '6.2s', delay: '-1.5s', rotation: '-12deg' },
  { icon: Car, size: 52, top: '16%', left: '8%', duration: '7.8s', delay: '-3.8s', rotation: '8deg' },
  { icon: Gauge, size: 38, top: '28%', left: '4%', duration: '5.6s', delay: '-2.1s', rotation: '-5deg' },
  { icon: Cog, size: 48, top: '42%', left: '6%', duration: '8.4s', delay: '-4.6s', rotation: '15deg' },
  { icon: Fuel, size: 40, top: '56%', left: '3%', duration: '6.9s', delay: '-1.2s', rotation: '-8deg' },
  { icon: Key, size: 36, top: '70%', left: '7%', duration: '7.2s', delay: '-5.1s', rotation: '10deg' },
  { icon: Droplet, size: 42, top: '84%', left: '5%', duration: '5.9s', delay: '-2.7s', rotation: '-15deg' },

  // Top Right Margin
  { icon: Fuel, size: 46, top: '5%', right: '6%', duration: '7.4s', delay: '-4.2s', rotation: '12deg' },
  { icon: Zap, size: 40, top: '18%', right: '4%', duration: '5.8s', delay: '-1.9s', rotation: '-10deg' },
  { icon: Route, size: 48, top: '32%', right: '7%', duration: '8.1s', delay: '-5.4s', rotation: '6deg' },
  { icon: Disc, size: 50, top: '46%', right: '5%', duration: '6.5s', delay: '-3.1s', rotation: '-14deg' },
  { icon: Shield, size: 44, top: '60%', right: '8%', duration: '7.6s', delay: '-2.4s', rotation: '9deg' },
  { icon: Triangle, size: 36, top: '74%', right: '4%', duration: '6.1s', delay: '-4.8s', rotation: '-7deg' },
  { icon: BatteryCharging, size: 42, top: '88%', right: '6%', duration: '8.6s', delay: '-0.8s', rotation: '18deg' },

  // Additional Subtle Accents Near Margins
  { icon: Compass, size: 38, top: '10%', left: '18%', duration: '6.7s', delay: '-3.3s', rotation: '5deg' },
  { icon: Radio, size: 34, top: '12%', right: '19%', duration: '7.1s', delay: '-1.7s', rotation: '-8deg' },
  { icon: Wrench, size: 36, top: '92%', left: '16%', duration: '8.0s', delay: '-4.0s', rotation: '12deg' },
  { icon: Car, size: 46, top: '94%', right: '17%', duration: '6.4s', delay: '-2.5s', rotation: '-6deg' },
];

export function DoodleBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
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
            }}
          >
            <IconComponent
              className="text-slate-500 dark:text-slate-400"
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
