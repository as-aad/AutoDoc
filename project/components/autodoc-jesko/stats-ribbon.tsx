'use client';

import { Star, ShieldCheck, Wrench, Award, DollarSign } from 'lucide-react';

export function JeskoStatsRibbon() {
  const stats = [
    {
      value: '5,000+',
      label: 'Vehicles Maintained & Tracked',
      icon: ShieldCheck,
    },
    {
      value: '150+',
      label: 'Verified Master Garages',
      icon: Wrench,
    },
    {
      value: '4.9★',
      label: 'Average Driver Rating',
      icon: Star,
    },
    {
      value: '$1.5M+',
      label: 'Saved in Upfront Bidding',
      icon: DollarSign,
    },
  ];

  return (
    <section className="border-y border-[#C5A880]/15 bg-[#090B0E] py-10 relative overflow-hidden">
      {/* Background Subtle Radial Glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-[600px] rounded-full bg-[#C5A880]/5 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="group relative flex flex-col items-center text-center p-4 rounded-xl transition-all duration-300 hover:bg-[#12151C]/60"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-[#C5A880]/20 bg-[#12151C] text-[#C5A880] transition-transform group-hover:scale-110 group-hover:border-[#C5A880]/50">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="font-serif-luxury text-3xl font-bold tracking-tight gold-gradient-text sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 font-sans-luxury text-xs font-medium uppercase tracking-wider text-[#8E96A4]">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
