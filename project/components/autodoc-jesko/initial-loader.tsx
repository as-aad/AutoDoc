'use client';

import { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';

export function JeskoInitialLoader() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      const dismissTimer = setTimeout(() => {
        setLoading(false);
      }, 700);
      return () => clearTimeout(dismissTimer);
    }, 1100);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#090B0E] transition-opacity duration-700 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center">
        {/* Pulsing Gold Halo Ring */}
        <div className="absolute -inset-8 rounded-full bg-[#C5A880]/10 blur-xl animate-pulse" />

        {/* Logo Emblem */}
        <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-[#C5A880]/30 bg-[#12151C] shadow-2xl gold-glow-border">
          <ShieldCheck className="h-10 w-10 text-[#C5A880]" />
        </div>

        {/* Brand Display Title */}
        <h1 className="font-serif-luxury text-4xl font-bold tracking-wider gold-gradient-text sm:text-5xl">
          AUTODOC
        </h1>
        <p className="mt-2 font-sans-luxury text-xs font-medium tracking-[0.3em] uppercase text-[#8E96A4]">
          Automotive Distinction & Telemetry
        </p>

        {/* Gold Shimmer Progress Bar */}
        <div className="mt-8 h-[2px] w-48 overflow-hidden rounded-full bg-[#1A1E26]">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-[#C5A880] to-transparent animate-pulse" />
        </div>
      </div>
    </div>
  );
}
