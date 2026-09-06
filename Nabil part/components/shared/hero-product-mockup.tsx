'use client';

import { TiltCard } from './tilt-card';
import { StatusBadge } from './status-badge';
import { StatusStepper } from './status-stepper';
import { Car, Wrench, ShieldCheck, Clock, CheckCircle2, MapPin } from 'lucide-react';

export function HeroProductMockup() {
  const mockTimeline = [
    {
      id: 'h-1',
      status: 'pending' as const,
      label: 'Request Submitted',
      description: 'Vehicle diagnostic log created by owner',
      timestamp: '2026-09-02T08:00:00Z',
      completed: true,
    },
    {
      id: 'h-2',
      status: 'accepted' as const,
      label: 'Quote Accepted',
      description: 'Patel Auto Works quote accepted ($320)',
      timestamp: '2026-09-02T09:30:00Z',
      completed: true,
    },
    {
      id: 'h-3',
      status: 'in_progress' as const,
      label: 'Diagnostic & Repair In Progress',
      description: 'Mechanic Jordan Reyes performing brake pad & rotor replacement',
      timestamp: '2026-09-02T10:15:00Z',
      completed: false,
    },
    {
      id: 'h-4',
      status: 'completed' as const,
      label: 'Final Quality Scan & Invoice',
      description: 'Road test & 12-month warranty activation',
      timestamp: '',
      completed: false,
    },
  ];

  return (
    <div className="relative mx-auto w-full max-w-xl">
      {/* Soft Radial Amber Glow Spotlight anchored behind card */}
      <div className="pointer-events-none absolute -inset-6 -z-10 rounded-full radial-amber-glow opacity-90 blur-xl" />

      {/* 3D Tilted App Product Mockup Card */}
      <TiltCard maxTilt={7} perspective={1200} activeGlow={false}>
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl transition-all">
          
          {/* App Header Bar Mockup */}
          <div className="flex items-center justify-between border-b border-border bg-muted/50 px-5 py-3.5 text-xs font-mono text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
              </div>
              <span className="ml-2 font-bold text-foreground">AUTODOC PLATFORM // LIVE REPAIR TRACKER</span>
            </div>
            <div className="flex items-center gap-2 font-semibold text-accent">
              <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
              <span>LIVE TRACKING</span>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6 space-y-6">
            
            {/* Vehicle & Repair Summary Banner (Third Person Data) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border bg-secondary/30 p-4">
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Car className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-base text-foreground">
                      Toyota Corolla
                    </h3>
                    <span className="text-caption font-mono">2021 · ABC-1234</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 mt-0.5">
                    <Wrench className="h-3.5 w-3.5 text-accent" />
                    Front Brake Replacement & Rotor Resurfacing
                  </p>
                </div>
              </div>
              <div className="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 border-border pt-2 sm:pt-0">
                <StatusBadge status="in_progress" />
                <span className="mt-1 text-xs font-mono font-bold text-foreground">$320.00</span>
              </div>
            </div>

            {/* Garage & Location Detail */}
            <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span className="font-semibold text-foreground">Patel Auto Works</span>
                <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600">VERIFIED GARAGE</span>
              </div>
              <div className="flex items-center gap-1 text-caption">
                <MapPin className="h-3.5 w-3.5" />
                <span>San Francisco, CA</span>
              </div>
            </div>

            {/* Diagnostic Status Stepper Tracker */}
            <StatusStepper timeline={mockTimeline} />

          </div>

          {/* Footer Status Banner */}
          <div className="flex items-center justify-between border-t border-border bg-secondary/40 px-5 py-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-accent" />
              <span>ESTIMATED COMPLETION: <strong className="text-foreground">Today, 2:30 PM</strong></span>
            </div>
            <div className="flex items-center gap-1 font-semibold text-emerald-600">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>12-Month Warranty Included</span>
            </div>
          </div>

        </div>
      </TiltCard>
    </div>
  );
}
