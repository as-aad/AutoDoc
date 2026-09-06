'use client';

import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // max tilt angle in degrees (default 6)
  perspective?: number; // CSS perspective in px
  activeGlow?: boolean; // optional soft ambient glow on hover
}

export function TiltCard({
  children,
  className,
  maxTilt = 6,
  perspective = 1000,
  activeGlow = true,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState('rotateX(0deg) rotateY(0deg)');
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Mouse coordinates relative to card center (-1 to 1)
    const mouseX = (e.clientX - rect.left - width / 2) / (width / 2);
    const mouseY = (e.clientY - rect.top - height / 2) / (height / 2);

    // Calculate rotation angles (invert Y for natural tilt)
    const rotateX = -mouseY * maxTilt;
    const rotateY = mouseX * maxTilt;

    setTransformStyle(`rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransformStyle('rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn('relative transition-transform duration-300 ease-out', className)}
      style={{
        perspective: `${perspective}px`,
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        className="w-full h-full transition-all duration-200 ease-out"
        style={{
          transform: transformStyle,
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </div>

      {activeGlow && isHovered && (
        <div className="pointer-events-none absolute -inset-2 -z-10 rounded-3xl radial-amber-glow opacity-70 transition-opacity duration-300" />
      )}
    </div>
  );
}
