'use client';

import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
  className,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, x)));
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative aspect-video w-full cursor-ew-resize overflow-hidden rounded-xl border select-none',
        className
      )}
      onMouseDown={(e) => {
        isDragging.current = true;
        handleMove(e.clientX);
      }}
      onMouseMove={(e) => {
        if (isDragging.current) handleMove(e.clientX);
      }}
      onMouseUp={() => (isDragging.current = false)}
      onMouseLeave={() => (isDragging.current = false)}
      onTouchStart={(e) => handleMove(e.touches[0].clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
    >
      {/* After image (full width, bottom layer) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={afterImage}
        alt="After"
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
      <span className="absolute right-3 top-3 rounded-full bg-foreground/70 px-2.5 py-1 text-xs font-semibold text-background backdrop-blur">
        {afterLabel}
      </span>

      {/* Before image (clipped to left portion) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={beforeImage}
          alt="Before"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ width: `${containerRef.current?.clientWidth || 100}%`, maxWidth: 'none' }}
          draggable={false}
        />
        <span className="absolute left-3 top-3 rounded-full bg-foreground/70 px-2.5 py-1 text-xs font-semibold text-background backdrop-blur">
          {beforeLabel}
        </span>
      </div>

      {/* Divider handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-background shadow-lg"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-foreground bg-background shadow-md">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-foreground">
            <path d="M9 7l-5 5 5 5M15 7l5 5-5 5" />
          </svg>
        </div>
      </div>
    </div>
  );
}
