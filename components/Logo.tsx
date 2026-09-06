import React from 'react';

interface LogoProps {
  size?: number;
  markOnly?: boolean;
  className?: string;
  showTagline?: boolean;
}

export default function Logo({ size = 52, markOnly = false, className, showTagline = true }: LogoProps) {
  return (
    <svg
      width={markOnly ? size : size * (showTagline ? 4.8 : 3.8)}
      height={size}
      viewBox="10 10 650 180"
      role="img"
      aria-label="AutoDoc Logo"
      className={className}
    >
      <defs>
        <linearGradient id="saasable-logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#606BDF" />
          <stop offset="100%" stopColor="#4F59C3" />
        </linearGradient>
      </defs>

      {/* SaasAble Indigo Container Badge */}
      <rect x="20" y="20" width="160" height="160" rx="36" fill="url(#saasable-logo-gradient)" />
      
      {/* Gauge Arcs */}
      <path d="M52,132 A48,48 0 0 1 148,132" fill="none" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="10" strokeLinecap="round" />
      <path d="M52,132 A48,48 0 0 1 132,68" fill="none" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" />
      
      {/* Needle & Center Pivot */}
      <line x1="100" y1="100" x2="136" y2="64" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" />
      <circle cx="100" cy="100" r="9" fill="#FFFFFF" />

      {!markOnly && (
        <>
          <text x="210" y={showTagline ? "108" : "122"} fontFamily="var(--font-display), 'Archivo', sans-serif" fontWeight="800" fontSize="76" letterSpacing="-0.02em">
            <tspan fill="#0F172A" className="fill-slate-900 dark:fill-slate-100">Auto</tspan>
            <tspan fill="#606BDF">Doc</tspan>
          </text>
          {showTagline && (
            <text x="212" y="148" fontFamily="var(--font-body), 'Figtree', sans-serif" fontWeight="600" fontSize="20" fill="#64748B" letterSpacing="0.01em">
              Vehicle Care, Tracked
            </text>
          )}
        </>
      )}
    </svg>
  );
}
