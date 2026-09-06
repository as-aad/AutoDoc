'use client';

import { ShieldCheck, Cpu, Wrench } from 'lucide-react';

export function HydroPartnerTicker() {
  const partners = [
    { name: 'CHAINLINK PROTOCOL', icon: Cpu },
    { name: 'TRON BLOCKCHAIN', icon: ShieldCheck },
    { name: 'BNB CHAIN VAULT', icon: Wrench },
    { name: 'OKX AUTOMOTIVE', icon: ShieldCheck },
    { name: 'BOSCH SERVICE', icon: Cpu },
    { name: 'BREMBO BRAKING', icon: Wrench },
    { name: 'SNAP-ON TOOLS', icon: Cpu },
    { name: 'MOTUL LUBRICANTS', icon: ShieldCheck },
  ];

  return (
    <div className="w-full bg-[#101216] border-y border-white/10 py-5 overflow-hidden relative">
      <div className="hydro-marquee-track flex items-center space-x-12 whitespace-nowrap">
        {partners.map((p, i) => {
          const Icon = p.icon;
          return (
            <div key={`p1-${i}`} className="flex items-center gap-3 opacity-70 hover:opacity-100 transition-opacity">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF5500]/15 text-[#FF5500]">
                <Icon className="h-4 w-4" />
              </div>
              <span className="font-hydro-display text-xs font-bold tracking-widest text-white">
                {p.name}
              </span>
            </div>
          );
        })}

        {/* Duplicated loop for infinite smooth scroll */}
        {partners.map((p, i) => {
          const Icon = p.icon;
          return (
            <div key={`p2-${i}`} className="flex items-center gap-3 opacity-70 hover:opacity-100 transition-opacity">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF5500]/15 text-[#FF5500]">
                <Icon className="h-4 w-4" />
              </div>
              <span className="font-hydro-display text-xs font-bold tracking-widest text-white">
                {p.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
