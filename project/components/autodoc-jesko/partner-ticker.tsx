'use client';

export function JeskoPartnerTicker() {
  const partners = [
    { name: 'BOSCH DIAGNOSTICS', code: 'OBD-II LIVE' },
    { name: 'BREMBO BRAKING', code: 'CALIPER SCAN' },
    { name: 'SNAP-ON TOOLS', code: 'PRECISION HARDWARE' },
    { name: 'MOTUL LUBRICANTS', code: 'SYNTHETIC SPEC' },
    { name: 'SOLANA TELEMETRY', code: 'IMMUTABLE LOGS' },
    { name: 'MOBIL 1 SYNTHETIC', code: 'FLUID HEALTH' },
    { name: 'MICHELIN TREAD SCAN', code: 'SAFETY PROTOCOL' },
  ];

  return (
    <div className="w-full border-y border-[#C5A880]/15 bg-[#0D0F14] py-4 overflow-hidden relative">
      <div className="jesko-ticker-track flex items-center space-x-12 whitespace-nowrap">
        {/* First Loop */}
        {partners.map((p, i) => (
          <div key={`p1-${i}`} className="flex items-center gap-3 opacity-70 transition-opacity hover:opacity-100">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C5A880]" />
            <span className="font-sans-luxury text-xs font-bold tracking-widest text-[#FFF0DB]">
              {p.name}
            </span>
            <span className="rounded bg-[#C5A880]/10 border border-[#C5A880]/20 px-2 py-0.5 font-mono text-[9px] font-semibold text-[#C5A880]">
              {p.code}
            </span>
          </div>
        ))}

        {/* Duplicated Loop for Seamless Scroll */}
        {partners.map((p, i) => (
          <div key={`p2-${i}`} className="flex items-center gap-3 opacity-70 transition-opacity hover:opacity-100">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C5A880]" />
            <span className="font-sans-luxury text-xs font-bold tracking-widest text-[#FFF0DB]">
              {p.name}
            </span>
            <span className="rounded bg-[#C5A880]/10 border border-[#C5A880]/20 px-2 py-0.5 font-mono text-[9px] font-semibold text-[#C5A880]">
              {p.code}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
