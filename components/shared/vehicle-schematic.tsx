'use client';

import { useEffect, useState } from 'react';
import { ShieldCheck, Activity, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function VehicleSchematic() {
  const [scanned, setScanned] = useState(false);
  const [activeComponent, setActiveComponent] = useState<'engine' | 'brakes' | 'wheels' | null>('engine');

  useEffect(() => {
    // Single automated scan line sequence on load
    const t1 = setTimeout(() => setActiveComponent('engine'), 400);
    const t2 = setTimeout(() => setActiveComponent('brakes'), 1400);
    const t3 = setTimeout(() => setActiveComponent('wheels'), 2400);
    const t4 = setTimeout(() => {
      setActiveComponent(null);
      setScanned(true);
    }, 3500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-[#12151A] p-6 shadow-2xl blueprint-grid-bg">
      {/* Top HUD Status Bar */}
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-3 text-xs font-mono tracking-widest text-amber-500/90">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 animate-pulse text-amber-500" />
          <span>DIAGNOSTIC SCANNER v3.4 // ACTIVE</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded bg-amber-500/10 px-2 py-0.5 border border-amber-500/30">
            SYS OK · 100%
          </span>
          <span>CHASSIS #4T1-88</span>
        </div>
      </div>

      {/* Blueprint Schematic Canvas */}
      <div className="relative my-4 flex h-64 w-full items-center justify-center">
        {/* Animated Scan Line (Single Sweep on Load) */}
        <div className="absolute inset-y-0 w-1 bg-gradient-to-b from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#FF7A29] z-20 animate-diagnostic-scan pointer-events-none" />

        {/* SVG Blueprint Car Technical Line Art */}
        <svg
          viewBox="0 0 800 350"
          className="h-full w-full max-w-lg text-slate-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Grid crosshairs */}
          <line x1="0" y1="175" x2="800" y2="175" stroke="#FF7A29" strokeOpacity="0.15" strokeDasharray="4 4" />
          <line x1="240" y1="0" x2="240" y2="350" stroke="#FF7A29" strokeOpacity="0.15" strokeDasharray="4 4" />
          <line x1="560" y1="0" x2="560" y2="350" stroke="#FF7A29" strokeOpacity="0.15" strokeDasharray="4 4" />

          {/* Car Body Outline */}
          <path
            d="M 100 240 
               L 110 210 
               C 120 180, 160 170, 220 165
               L 310 120
               C 340 105, 480 105, 540 125
               L 640 165
               C 690 170, 720 190, 730 220
               L 735 240
               C 740 250, 720 260, 680 260
               L 630 260
               C 620 230, 560 230, 550 260
               L 270 260
               C 260 230, 200 230, 190 260
               L 120 260
               Z"
            stroke="#94A3B8"
            strokeWidth="2"
            className="transition-all duration-300"
          />

          {/* Windshield & Windows */}
          <path
            d="M 325 125 L 420 125 L 420 165 L 245 165 Z"
            stroke="#64748B"
            strokeWidth="1.5"
          />
          <path
            d="M 435 125 L 530 130 L 525 165 L 435 165 Z"
            stroke="#64748B"
            strokeWidth="1.5"
          />

          {/* Front Wheels Assembly */}
          <g className="transition-all duration-300">
            <circle cx="225" cy="255" r="42" stroke="#FF7A29" strokeWidth="2.5" strokeOpacity={activeComponent === 'wheels' ? "1" : "0.5"} />
            <circle cx="225" cy="255" r="28" stroke="#94A3B8" strokeWidth="1.5" />
            <circle cx="225" cy="255" r="12" fill={activeComponent === 'wheels' ? "#FF7A29" : "none"} stroke="#FF7A29" />
          </g>

          {/* Rear Wheels Assembly */}
          <g className="transition-all duration-300">
            <circle cx="585" cy="255" r="42" stroke="#FF7A29" strokeWidth="2.5" strokeOpacity={activeComponent === 'wheels' ? "1" : "0.5"} />
            <circle cx="585" cy="255" r="28" stroke="#94A3B8" strokeWidth="1.5" />
            <circle cx="585" cy="255" r="12" fill={activeComponent === 'wheels' ? "#FF7A29" : "none"} stroke="#FF7A29" />
          </g>

          {/* Engine Bay Block */}
          <rect
            x="145"
            y="180"
            width="75"
            height="45"
            rx="4"
            stroke={activeComponent === 'engine' ? "#FF7A29" : "#64748B"}
            strokeWidth={activeComponent === 'engine' ? "2.5" : "1.5"}
            fill={activeComponent === 'engine' ? "rgba(255, 122, 41, 0.15)" : "none"}
          />
          {/* Brake Rotor & Caliper Line Art */}
          <path
            d="M 205 240 A 20 20 0 0 1 245 270"
            stroke={activeComponent === 'brakes' ? "#FF7A29" : "#64748B"}
            strokeWidth="3"
          />

          {/* Target Highlight Rings */}
          {activeComponent === 'engine' && (
            <circle cx="180" cy="202" r="25" fill="none" stroke="#FF7A29" strokeWidth="2" className="animate-ping" />
          )}
          {activeComponent === 'brakes' && (
            <circle cx="225" cy="255" r="35" fill="none" stroke="#FF7A29" strokeWidth="2" className="animate-ping" />
          )}
          {activeComponent === 'wheels' && (
            <circle cx="585" cy="255" r="35" fill="none" stroke="#FF7A29" strokeWidth="2" className="animate-ping" />
          )}
        </svg>

        {/* Floating Callout Diagnostic Badges */}
        {activeComponent === 'engine' && (
          <div className="absolute top-6 left-8 flex items-center gap-2 rounded-lg border border-amber-500/50 bg-amber-950/90 px-3 py-1.5 text-xs font-mono text-amber-300 shadow-lg backdrop-blur animate-fade-in">
            <Activity className="h-4 w-4 animate-spin text-amber-400" />
            <div>
              <p className="font-bold text-amber-200">ENGINE BAY // SCANNING</p>
              <p className="text-[10px] text-amber-400/80">COMPRESSION 98% · FLUIDS OK</p>
            </div>
          </div>
        )}

        {activeComponent === 'brakes' && (
          <div className="absolute top-12 left-1/3 flex items-center gap-2 rounded-lg border border-amber-500/50 bg-amber-950/90 px-3 py-1.5 text-xs font-mono text-amber-300 shadow-lg backdrop-blur animate-fade-in">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <div>
              <p className="font-bold text-amber-200">FRONT BRAKES // INSPECT</p>
              <p className="text-[10px] text-amber-400/80">PAD WEAR 62% · ROTOR WEAR DETECTED</p>
            </div>
          </div>
        )}

        {activeComponent === 'wheels' && (
          <div className="absolute top-8 right-12 flex items-center gap-2 rounded-lg border border-amber-500/50 bg-amber-950/90 px-3 py-1.5 text-xs font-mono text-amber-300 shadow-lg backdrop-blur animate-fade-in">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <div>
              <p className="font-bold text-emerald-200">TIRES & SUSPENSION // PASS</p>
              <p className="text-[10px] text-emerald-400/80">PRESSURE 34 PSI · ALIGNMENT 0.0°</p>
            </div>
          </div>
        )}

        {scanned && (
          <div className="absolute top-4 right-4 flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-950/80 px-3 py-1.5 text-xs font-mono text-emerald-300 shadow-md backdrop-blur">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>FULL VEHICLE SCAN COMPLETE</span>
          </div>
        )}
      </div>

      {/* Bottom Diagnostic HUD Metrics */}
      <div className="grid grid-cols-2 gap-2 border-t border-amber-500/20 pt-3 text-center text-xs font-mono">
        <div className="rounded bg-slate-900/60 p-2 border border-slate-800">
          <p className="text-slate-400 text-[10px]">ACTIVE REMINDERS</p>
          <p className="text-base font-bold text-amber-400">1 ATTENTION</p>
        </div>
        <div className="rounded bg-slate-900/60 p-2 border border-slate-800">
          <p className="text-slate-400 text-[10px]">REPAIR QUOTES</p>
          <p className="text-base font-bold text-slate-200">3 VERIFIED</p>
        </div>
      </div>
    </div>
  );
}
