'use client';

import { useState } from 'react';
import { Gauge, Cpu, ShieldCheck, Wrench, ChevronRight, Activity, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function JeskoFleetInspector() {
  const [activeTab, setActiveTab] = useState(0);

  const models = [
    {
      name: 'V8 Twin Turbo Telemetry',
      code: 'SPEC 650ER',
      tag: 'ULTRA PERFORMANCE',
      description:
        'Powered by high-thrust diagnostic scanners and dual ECU telemetry nodes, the AutoDoc Spec 650ER is engineered for exceptional speed, zero quote ambiguity, and top-end engine calibration.',
      overview: [
        { label: 'Maximum Diagnostic Range', value: '330-Point Cloud Scan' },
        { label: 'OBD Baud Rate Speed', value: '480 Live Rate' },
        { label: 'Garage & Mechanic Network', value: '150+ Verified Garages' },
        { label: 'Concierge Endurance', value: '24/7 Dedicated Support' },
        { label: 'Baggage Vault Capacity', value: '5.52 m³ Digital History' },
        { label: 'Operating Altitude', value: 'High Performance ECU Tuning' },
      ],
      specs: [
        { name: 'Chassis Length', data: '14.05 m²' },
        { name: 'Engine Bay Width', data: '2.49 m²' },
        { name: 'Underbody Clearance', data: '1.92 m²' },
      ],
    },
    {
      name: 'ECU Performance Calibration',
      code: 'SPEC 7500',
      tag: 'PRECISION TUNING',
      description:
        'Designed for high-performance sports cars and luxury sedans, offering real-time torque curve optimization, brake fluid safety testing, and instant itemized garage quotes.',
      overview: [
        { label: 'Maximum Diagnostic Range', value: '410-Point ECU Telemetry' },
        { label: 'OBD Baud Rate Speed', value: '960 Super Rate' },
        { label: 'Garage & Mechanic Network', value: '150+ Verified Garages' },
        { label: 'Concierge Endurance', value: '24/7 Dedicated Support' },
        { label: 'Baggage Vault Capacity', value: '7.80 m³ Digital History' },
        { label: 'Operating Altitude', value: 'Track-Ready Tuning' },
      ],
      specs: [
        { name: 'Chassis Length', data: '16.50 m²' },
        { name: 'Engine Bay Width', data: '2.65 m²' },
        { name: 'Underbody Clearance', data: '2.05 m²' },
      ],
    },
    {
      name: 'EV & Hybrid Battery Vault',
      code: 'SPEC FALCON',
      tag: 'ELECTRIC TELEMETRY',
      description:
        'Advanced high-voltage battery cell diagnostics, thermal management checks, and regenerative brake calibration for luxury electric and hybrid vehicles.',
      overview: [
        { label: 'Maximum Diagnostic Range', value: '500-Cell High Voltage Scan' },
        { label: 'OBD Baud Rate Speed', value: '1200 CAN-Bus Rate' },
        { label: 'Garage & Mechanic Network', value: '150+ Verified Garages' },
        { label: 'Concierge Endurance', value: '24/7 Dedicated Support' },
        { label: 'Baggage Vault Capacity', value: '6.20 m³ Digital History' },
        { label: 'Operating Altitude', value: 'Zero-Emission Health Scan' },
      ],
      specs: [
        { name: 'Chassis Length', data: '15.20 m²' },
        { name: 'Engine Bay Width', data: '2.55 m²' },
        { name: 'Underbody Clearance', data: '1.98 m²' },
      ],
    },
  ];

  const current = models[activeTab];

  return (
    <section id="fleet" className="border-b border-[#C5A880]/18 bg-[#0D0F14] py-20 lg:py-28 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#C5A880]/20 pb-8 gap-6">
          <div>
            <p className="font-sans-luxury text-xs font-bold tracking-[0.3em] uppercase text-[#C5A880] mb-2">
              DIAGNOSTIC FLEET INSPECTOR
            </p>
            <h2 className="font-serif-luxury text-4xl sm:text-6xl font-normal text-[#FFF0DB]">
              Diagnose in <span className="gold-gradient-text italic font-bold">Distinction</span>
            </h2>
          </div>

          {/* Model Switcher Tabs */}
          <div className="flex flex-wrap gap-2">
            {models.map((m, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`px-5 py-2.5 rounded-full font-sans-luxury text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeTab === idx
                    ? 'bg-[#C5A880] text-[#0B0D10] shadow-xl'
                    : 'bg-[#14171E] border border-[#C5A880]/20 text-[#8E96A4] hover:text-[#FFF0DB] hover:border-[#C5A880]/50'
                }`}
              >
                {m.code}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Model Description */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4">
            <span className="font-mono text-xs font-bold text-[#C5A880]">{current.tag}</span>
            <h3 className="mt-1 font-serif-luxury text-3xl font-bold text-[#FFF0DB]">
              {current.name}
            </h3>
            <p className="mt-3 font-sans-luxury text-xs text-[#8E96A4] leading-relaxed">
              {current.description}
            </p>
          </div>

          {/* Blueprint Layout Cutout Visual */}
          <div className="md:col-span-8 jesko-card-surface rounded-3xl p-8 relative overflow-hidden flex flex-col items-center justify-center border border-[#C5A880]/25">
            <div className="absolute top-4 left-4 flex items-center gap-2 font-mono text-[10px] text-[#C5A880]">
              <Activity className="h-4 w-4 animate-pulse" />
              <span>LIVE DIAGNOSTIC BLUEPRINT MASK // ACTIVE</span>
            </div>

            {/* Automotive Blueprint Vector Graphic */}
            <div className="my-8 w-full max-w-lg relative flex flex-col items-center">
              <div className="w-full h-48 rounded-2xl border border-[#C5A880]/30 bg-[#0B0D10]/90 p-6 flex flex-col justify-between relative shadow-2xl">
                {/* Engine Rib Lines */}
                <div className="flex justify-between border-b border-[#C5A880]/20 pb-3">
                  <span className="font-mono text-xs text-[#C5A880]">FRONT AXLE & BRAKES</span>
                  <span className="font-mono text-xs text-[#FFF0DB]">ECU MAIN NODE</span>
                  <span className="font-mono text-xs text-[#C5A880]">REAR DIFFERENTIAL</span>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center my-4">
                  <div className="p-2 rounded-lg bg-[#14171E] border border-[#C5A880]/15">
                    <p className="text-[10px] text-[#8E96A4]">Brake Pad Wear</p>
                    <p className="text-xs font-bold text-[#C5A880]">94% Optimal</p>
                  </div>
                  <div className="p-2 rounded-lg bg-[#14171E] border border-[#C5A880]/15">
                    <p className="text-[10px] text-[#8E96A4]">Fluid Viscosity</p>
                    <p className="text-xs font-bold text-[#FFF0DB]">0W-40 Synthetic</p>
                  </div>
                  <div className="p-2 rounded-lg bg-[#14171E] border border-[#C5A880]/15">
                    <p className="text-[10px] text-[#8E96A4]">Compression</p>
                    <p className="text-xs font-bold text-[#C5A880]">10.5:1 Ratio</p>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] font-mono text-[#8E96A4]">
                  <span>OBD PROTOCOL: CAN 2.0B</span>
                  <span className="text-[#C5A880]">100% TRANSPARENT ITEMIZATION</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Overview & Specifications Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Overview List */}
          <div className="md:col-span-7 jesko-card-surface rounded-2xl p-6">
            <h4 className="font-serif-luxury text-xl font-bold text-[#FFF0DB] mb-4 border-b border-[#C5A880]/15 pb-3">
              Diagnostic Overview
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {current.overview.map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-[#0B0D10]/80 border border-[#C5A880]/10">
                  <p className="text-[10px] font-sans-luxury text-[#8E96A4] uppercase tracking-wider">
                    {item.label}
                  </p>
                  <p className="mt-1 text-xs font-bold text-[#FFF0DB]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Specs Table */}
          <div className="md:col-span-5 jesko-card-surface rounded-2xl p-6">
            <h4 className="font-serif-luxury text-xl font-bold text-[#FFF0DB] mb-4 border-b border-[#C5A880]/15 pb-3">
              Engine & Chassis Specs
            </h4>
            <div className="space-y-3">
              {current.specs.map((s, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-[#C5A880]/10 text-xs font-sans-luxury">
                  <span className="text-[#8E96A4]">{s.name}</span>
                  <span className="text-[#C5A880] font-bold">{s.data}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-[#C5A880]/15">
              <Button
                className="w-full bg-[#C5A880] text-[#0B0D10] font-bold text-xs uppercase hover:bg-[#E2C799] py-5 rounded-full"
                asChild
              >
                <a href="/register?role=customer">
                  Request Diagnostic for {current.code}
                </a>
              </Button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
