'use client';

import Link from 'next/link';
import { ArrowRight, Store, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HydroHero3DViewer() {
  return (
    <section id="home" className="relative py-16 pb-24 overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-50 dark:opacity-40"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-car-mechanic-working-on-a-car-engine-41551-large.mp4" type="video/mp4" />
          <source src="https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-mechanic-working-on-a-car-engine-41560-large.mp4" type="video/mp4" />
          <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" type="video/mp4" />
        </video>
        {/* Overlay gradient to ensure text contrast and readability */}
        <div className="absolute inset-0 bg-background/60 dark:bg-background/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>
      
      {/* Background Radial Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] rounded-full bg-[#FF5500]/14 blur-[140px] z-0" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Layered Stroke Display Title (Hydroflow Signature) */}
        <div className="relative mx-auto max-w-5xl">
          <h1 className="font-hydro-display text-5xl sm:text-7xl lg:text-9xl font-bold tracking-tight leading-none uppercase">
            <span className="block text-stroke-behind select-none">REDEFINING</span>
            <span className="block text-foreground -mt-2 sm:-mt-6">CAR REPAIR</span>
          </h1>
        </div>

        {/* Dotted Line Divider */}
        <div className="my-8 mx-auto w-full max-w-xl hydro-dotted-line" />

        {/* Subheadline */}
        <h2 className="font-hydro-display text-lg sm:text-xl font-medium text-foreground">
          Precision. Performance. Transparent Garage Network.
        </h2>

        {/* Dual Role Choice CTAs */}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="bg-[#FF5500] text-white hover:bg-[#FF7700] font-hydro-display font-bold text-xs uppercase tracking-widest px-8 py-6 rounded-full shadow-2xl transition-all transform hover:scale-105"
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
            className="border-[#FF5500] text-[#FF5500] hover:bg-[#FF5500]/15 font-hydro-display font-bold text-xs uppercase tracking-widest px-8 py-6 rounded-full transition-all"
            asChild
          >
            <Link href="/register?role=garage">
              <Store className="mr-2 h-4 w-4 text-[#FF5500]" />
              <span>I Run a Garage</span>
            </Link>
          </Button>
        </div>

        <div className="mt-4">
          <Link
            href="/register?role=mechanic"
            className="inline-flex items-center text-xs font-hydro-body text-muted-foreground hover:text-[#FF5500] transition-colors"
          >
            <span>Are you an independent mechanic? Sign up for workload portal</span>
            <ChevronRight className="h-3 w-3 ml-1 text-[#FF5500]" />
          </Link>
        </div>

      </div>
    </section>
  );
}
