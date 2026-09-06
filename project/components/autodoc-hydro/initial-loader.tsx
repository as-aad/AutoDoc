'use client';

import { useEffect, useState } from 'react';

export function HydroInitialLoader() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      const dismissTimer = setTimeout(() => {
        setLoading(false);
      }, 600);
      return () => clearTimeout(dismissTimer);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#0A0B0D] transition-opacity duration-600 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center text-center">
        <h1 className="font-hydro-display text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FF5500] to-white sm:text-6xl animate-pulse">
          AUTODOC
        </h1>
        <p className="mt-3 font-hydro-body text-xs font-semibold uppercase tracking-[0.3em] text-[#8F96A3]">
          Next-Gen Car Repair Marketplace
        </p>
      </div>
    </div>
  );
}
