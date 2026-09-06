'use client';

import Link from 'next/link';
import { ArrowRight, Store, ChevronRight, ChevronDown, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function JeskoHeroSection() {
  return (
    <section id="hero" className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-[#0B0D10] text-[#FFF0DB] pt-12 pb-8">
      {/* Background Cloud & Sky Atmosphere Parallax Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0B0D10]/80 to-[#0B0D10] z-10" />
        <div className="flex w-[200%] animate-clouds-marquee opacity-40">
          <img
            src="https://cdn.prod.website-files.com/68b57ef5ef86011d9b251e8e/68ee74b1f45fbfb23fb6405a_clouds.webp"
            alt="Clouds"
            className="w-1/2 object-cover min-h-screen"
          />
          <img
            src="https://cdn.prod.website-files.com/68b57ef5ef86011d9b251e8e/68ee74b1f45fbfb23fb6405a_clouds.webp"
            alt="Clouds"
            className="w-1/2 object-cover min-h-screen"
          />
        </div>
      </div>

      {/* Gold Ambient Spotlight Radial Glow */}
      <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-[#C5A880]/10 blur-[130px] pointer-events-none" />

      {/* Top Badge */}
      <div className="relative z-20 mx-auto text-center pt-4 px-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#C5A880]/35 bg-[#14171E]/90 px-4 py-1.5 text-xs font-sans-luxury font-semibold tracking-[0.2em] text-[#C5A880] uppercase backdrop-blur-md shadow-2xl">
          <ShieldCheck className="h-4 w-4 text-[#C5A880]" />
          <span>AUTODOC EXECUTIVE TELEMETRY</span>
        </div>
      </div>

      {/* Jesko Split Headline: "We are movement" | "We are distinction" */}
      <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="text-left">
            <h1 className="font-serif-luxury text-5xl sm:text-7xl lg:text-8xl font-normal tracking-tight text-[#FFF0DB] leading-tight">
              We are movement
            </h1>
          </div>
          <div className="text-right">
            <h2 className="font-serif-luxury text-5xl sm:text-7xl lg:text-8xl font-normal tracking-tight gold-gradient-text leading-tight">
              We are distinction
            </h2>
          </div>
        </div>

        {/* Center Subheadline & Narrative */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-end pt-8 border-t border-[#C5A880]/20">
          <div className="md:col-span-5 text-left">
            <h3 className="font-serif-luxury text-2xl sm:text-3xl font-semibold text-[#FFF0DB]">
              Your freedom to enjoy the road
            </h3>
            <p className="mt-3 font-sans-luxury text-xs text-[#8E96A4] leading-relaxed">
              Every repair is engineered around your comfort, time, and safety — so you can focus on what truly matters, while our verified master garages handle everything else.
            </p>
          </div>

          {/* Role CTAs (Preserved Exact Functionality) */}
          <div className="md:col-span-7 flex flex-col sm:flex-row items-center justify-end gap-4">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-[#C5A880] text-[#0B0D10] hover:bg-[#E2C799] font-bold text-xs uppercase tracking-widest px-8 py-6 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105"
              asChild
            >
              <Link href="/register?role=customer">
                <span>I Need a Repair</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-[#C5A880]/40 text-[#C5A880] hover:bg-[#C5A880]/15 hover:border-[#C5A880] font-bold text-xs uppercase tracking-widest px-8 py-6 rounded-full transition-all duration-300"
              asChild
            >
              <Link href="/register?role=garage">
                <Store className="mr-2 h-4 w-4" />
                <span>I Run a Garage</span>
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/register?role=mechanic"
            className="inline-flex items-center text-xs font-sans-luxury text-[#8E96A4] hover:text-[#C5A880] transition-colors"
          >
            <span>Are you an independent mechanic? Sign up for workload portal</span>
            <ChevronRight className="h-3 w-3 ml-1 text-[#C5A880]" />
          </Link>
        </div>
      </div>

      {/* Jesko Scroll Down Indicator Bar */}
      <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full pt-6">
        <div className="flex items-center justify-between border-t border-[#C5A880]/15 pt-4 text-xs font-sans-luxury text-[#8E96A4]">
          <div className="flex items-center gap-2">
            <ChevronDown className="h-4 w-4 text-[#C5A880] animate-bounce" />
            <a href="#about" className="hover:text-[#C5A880] transition-colors uppercase tracking-widest">
              Scroll down
            </a>
          </div>
          <div className="uppercase tracking-widest text-[#C5A880]">
            To start the journey
          </div>
        </div>
      </div>
    </section>
  );
}
