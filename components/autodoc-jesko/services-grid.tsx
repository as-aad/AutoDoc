'use client';

import { Receipt, FileCheck2, TrendingUp, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export function JeskoServicesGrid() {
  const cards = [
    {
      title: 'Upfront Transparent Quotes',
      subtitle: 'FOR DISCERNING DRIVERS',
      description:
        'Receive comprehensive itemized quotes with parts and labor completely unbundled. Compare verified shop ratings, warranty coverage, and completion ETAs with zero pressure.',
      icon: Receipt,
      accent: '#C5A880',
      badge: 'ITEMIZED QUOTES',
      href: '/register?role=customer',
      cta: 'Request Diagnostic',
    },
    {
      title: 'Immutable Vehicle Vault',
      subtitle: 'PERMANENT TELEMETRY LOGS',
      description:
        'Maintain a tamper-proof digital history of all annual maintenance, diagnostic reports, and parts installations. Protect your vehicle health score and resale value.',
      icon: FileCheck2,
      accent: '#E2C799',
      badge: 'DIGITAL HISTORY',
      href: '/vehicles',
      cta: 'Explore Health Vault',
    },
    {
      title: 'Verified Garage Expansion',
      subtitle: 'FOR MASTER MECHANICS',
      description:
        'Access nearby repair requests instantly, submit custom itemized bids, manage technician workload allocation, and scale business reputation through verified client reviews.',
      icon: TrendingUp,
      accent: '#C5A880',
      badge: 'GARAGE PARTNER',
      href: '/register?role=garage',
      cta: 'Join Garage Network',
    },
  ];

  return (
    <section id="services" className="border-b border-[#C5A880]/15 bg-[#090B0E] py-20 lg:py-28 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-sans-luxury text-xs font-bold tracking-[0.3em] uppercase text-[#C5A880] mb-3">
            EXECUTIVE STANDARDS
          </p>
          <h2 className="font-serif-luxury text-4xl font-bold tracking-tight gold-gradient-text sm:text-5xl">
            Built for Drivers, Mechanics & Garages
          </h2>
          <p className="mt-4 font-sans-luxury text-sm text-[#8E96A4] leading-relaxed max-w-xl mx-auto">
            An open marketplace balancing fair bidding competition, diagnostic precision, and complete repair transparency.
          </p>
        </div>

        {/* 3-Column Luxury Card Grid */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                className="jesko-card-surface rounded-2xl p-8 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Top Badge & Icon */}
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#C5A880]/30 bg-[#090B0E] text-[#C5A880] transition-transform duration-300 group-hover:scale-110 group-hover:border-[#C5A880]">
                      <Icon className="h-6 w-6 text-[#C5A880]" />
                    </div>
                    <span className="rounded-full bg-[#C5A880]/10 border border-[#C5A880]/20 px-3 py-1 font-sans-luxury text-[10px] font-bold tracking-wider text-[#C5A880] uppercase">
                      {card.badge}
                    </span>
                  </div>

                  <p className="mt-6 font-sans-luxury text-[10px] font-bold tracking-[0.25em] uppercase text-[#8E96A4]">
                    {card.subtitle}
                  </p>
                  <h3 className="mt-2 font-serif-luxury text-2xl font-bold text-[#FFF0DB] group-hover:text-[#C5A880] transition-colors">
                    {card.title}
                  </h3>
                  <p className="mt-3 font-sans-luxury text-xs text-[#8E96A4] leading-relaxed">
                    {card.description}
                  </p>
                </div>

                {/* Bottom CTA Link */}
                <div className="mt-8 pt-4 border-t border-[#C5A880]/10">
                  <Link
                    href={card.href}
                    className="inline-flex items-center text-xs font-sans-luxury font-semibold uppercase tracking-wider text-[#C5A880] hover:text-[#FFF0DB] transition-colors group/link"
                  >
                    <span>{card.cta}</span>
                    <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
