'use client';

import { Globe, ShieldCheck, Sparkles, Award } from 'lucide-react';

export function JeskoAboutSection() {
  const features = [
    {
      title: 'Direct Access to Private Repairs',
      description:
        'Drive beyond repair guesswork with AutoDoc. Our verified garage network ensures seamless, personalized service — from your initial diagnostic quote to completion.',
    },
    {
      title: 'Your Freedom to Enjoy the Road',
      description:
        'We value your time above all. AutoDoc gives you the freedom to live, work, and drive wherever life takes you — without compromise or unexpected costs.',
    },
    {
      title: 'Precision and Diagnostic Excellence',
      description:
        'Each detail of your service — from OBD-II telemetry scan to itemized quote breakdowns — reflects our dedication to perfection and master mechanic standards.',
    },
    {
      title: 'Global Reach, Certified Local Garages',
      description:
        'With verified shop coverage across 150+ cities, AutoDoc brings certified mechanics directly to you, guaranteeing smooth and effortless maintenance.',
    },
  ];

  return (
    <section id="about" className="border-b border-[#C5A880]/18 bg-[#0B0D10] py-20 lg:py-28 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Lead Quote Statement */}
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-sans-luxury text-xs font-bold tracking-[0.3em] uppercase text-[#C5A880] mb-4">
            EXECUTIVE STANDARDS
          </p>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-normal leading-relaxed text-[#FFF0DB]">
            AutoDoc<sup>®</sup> is an executive automotive diagnostic platform with over <span className="gold-gradient-text font-bold">5,000 repairs completed</span> across <span className="gold-gradient-text font-bold">150+ verified garages</span>. From daily drivers to luxury fleets, our clients trust us to deliver on time, every time.
          </h2>
        </div>

        {/* Globe & Emblem Ribbon Divider */}
        <div className="my-16 flex items-center justify-center gap-6 border-y border-[#C5A880]/15 py-6">
          <div className="flex items-center gap-3">
            <Globe className="h-6 w-6 text-[#C5A880]" />
            <span className="font-serif-luxury text-xl font-bold text-[#FFF0DB]">AutoDoc</span>
            <span className="font-sans-luxury text-xs font-semibold uppercase tracking-widest text-[#8E96A4]">
              Global Automotive Operations
            </span>
          </div>
        </div>

        {/* 4-Column Feature List (Jesko Card Layout) */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="jesko-card-surface rounded-2xl p-6 flex flex-col justify-between group"
            >
              <div>
                <span className="font-mono text-xs font-bold text-[#C5A880]">0{idx + 1}.</span>
                <h3 className="mt-3 font-serif-luxury text-2xl font-bold text-[#FFF0DB] group-hover:text-[#C5A880] transition-colors">
                  {item.title}
                </h3>
                <div className="my-4 h-[1px] w-full bg-[#C5A880]/15" />
                <p className="font-sans-luxury text-xs text-[#8E96A4] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
