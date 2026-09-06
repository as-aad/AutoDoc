'use client';

import { Cpu, ShieldCheck, Zap, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export function HydroGridShowcase() {
  return (
    <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-b border-border relative">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Smart Repair Bidding Card Showcase */}
          <div className="lg:col-span-6 hydro-card-surface p-8 relative overflow-hidden flex flex-col justify-between min-h-[380px]">
            <div className="flex items-center justify-between">
              <span className="font-hydro-body text-xs font-bold text-[#FF5500] uppercase tracking-widest">
                CAR REPAIR MARKETPLACE
              </span>
              <span className="h-2 w-2 rounded-full bg-[#FF5500] animate-ping" />
            </div>

            <div className="my-6">
              <h3 className="font-hydro-display text-3xl font-bold text-foreground">
                Smart Garage Bidding
              </h3>
              <p className="mt-2 font-hydro-body text-xs text-muted-foreground leading-relaxed">
                Post your car repair needs to receive instant itemized quotes, transparent parts pricing, and verified garage availability.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-card border border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF5500]/20 text-[#FF5500]">
                  <Cpu className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Verified Mechanics</p>
                  <p className="text-[10px] text-muted-foreground">150+ Certified Shops</p>
                </div>
              </div>

              <Link
                href="/requests/new"
                className="inline-flex items-center text-xs font-hydro-display font-bold text-[#FF5500] hover:underline transition-colors"
              >
                <span>Request Quote</span>
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: "Scan It, Fix It" Display Headline */}
          <div className="lg:col-span-6 space-y-6">
            <div className="hydro-card-surface p-8 sm:p-12 relative overflow-hidden flex flex-col justify-center">
              
              {/* Pixel Action Button */}
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF5500]/20 border border-[#FF5500]/40 text-[#FF5500]">
                <Zap className="h-6 w-6" />
              </div>

              <h2 className="font-hydro-display text-5xl sm:text-7xl font-bold uppercase tracking-tight text-foreground leading-none">
                Post It, <br />
                <span className="text-[#FF5500]">Fix</span> It
              </h2>

              <p className="mt-4 font-hydro-body text-xs text-muted-foreground leading-relaxed max-w-md">
                From breakdown to back on the road in minutes. AutoDoc eliminates repair guesswork with upfront transparent bidding.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
