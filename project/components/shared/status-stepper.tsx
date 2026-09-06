'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Send, Wrench, Circle, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BookingStatus } from '@/lib/types';

interface TimelineEvent {
  id: string;
  status: BookingStatus;
  label: string;
  description: string;
  timestamp: string;
  completed: boolean;
}

interface StatusStepperProps {
  timeline: TimelineEvent[];
  className?: string;
}

const stepIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  pending: Send,
  accepted: CheckCircle2,
  in_progress: Wrench,
  completed: CheckCircle2,
};

const formatTimestamp = (ts: string) => {
  if (!ts) return '';
  const parsed = new Date(ts);
  if (!isNaN(parsed.getTime())) {
    return parsed.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  }
  return ts;
};

export function StatusStepper({ timeline, className }: StatusStepperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const completedCount = timeline.filter((t) => t.completed).length;
  // Current active step is the first non-completed step or the last completed if all done
  const activeIndex = timeline.findIndex((t) => !t.completed);
  const currentStep = activeIndex === -1 ? timeline.length - 1 : activeIndex;

  return (
    <div className={cn('rounded-xl border border-border bg-card p-5 shadow-sm', className)}>
      {/* Diagnostic Header Bar */}
      <div className="mb-6 flex items-center justify-between border-b border-border pb-3 text-xs font-mono text-muted-foreground">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-accent animate-pulse" />
          <span className="font-bold tracking-widest text-foreground">LIVE REPAIR DIAGNOSTIC READOUT</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-0.5 text-accent font-semibold">
          <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
          <span>STEP {currentStep + 1} OF {timeline.length}</span>
        </div>
      </div>

      <div className="space-y-0">
        {timeline.map((event, index) => {
          const isLast = index === timeline.length - 1;
          const Icon = stepIcons[event.status] || Circle;
          const isCurrent = index === currentStep && !event.completed;
          const isDone = event.completed;

          return (
            <div key={event.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                {/* Node icon with glowing dashboard warning light animation */}
                <div
                  className={cn(
                    'relative flex h-11 w-11 items-center justify-center rounded-full border-2 transition-all duration-500',
                    isDone
                      ? 'border-emerald-500 bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                      : isCurrent
                      ? 'border-accent bg-card text-accent animate-step-pulse'
                      : 'border-border bg-card text-muted-foreground'
                  )}
                >
                  {isDone ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : isCurrent && event.status === 'in_progress' ? (
                    <Wrench className="h-5 w-5 animate-gear-spin text-accent" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>

                {/* Vertical Connector Pipeline */}
                {!isLast && (
                  <div className="relative w-1 flex-1 min-h-[2.5rem] bg-secondary my-1 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'absolute top-0 left-0 w-full transition-all duration-700 ease-out',
                        isDone ? 'h-full bg-emerald-500' : isCurrent ? 'h-1/2 bg-accent animate-pulse' : 'h-0 bg-transparent'
                      )}
                    />
                  </div>
                )}
              </div>

              <div className={cn('pb-8', isLast && 'pb-0')}>
                <div className="flex items-center gap-2">
                  <p
                    className={cn(
                      'font-display text-base font-bold',
                      isDone
                        ? 'text-foreground'
                        : isCurrent
                        ? 'text-accent'
                        : 'text-muted-foreground'
                    )}
                  >
                    {event.label}
                  </p>
                  {isCurrent && (
                    <span className="rounded bg-accent/15 px-2 py-0.5 font-mono text-[10px] font-bold text-accent uppercase tracking-wider">
                      IN PROGRESS
                    </span>
                  )}
                  {isDone && (
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                      VERIFIED
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {event.description}
                </p>
                {event.timestamp && (
                  <p className="mt-1 font-mono text-caption">
                    TIMESTAMP: {formatTimestamp(event.timestamp)}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
