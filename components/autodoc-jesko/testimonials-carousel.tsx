'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function JeskoTestimonialsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      quote:
        'AutoDoc completely changed how our fleet handles repairs. The itemized diagnostic quotes mean zero unexpected costs, and our vehicles are back on the road in record time.',
      name: 'James Vance',
      title: 'Managing Director, Aqva Logistics',
      rating: 5,
    },
    {
      quote:
        'As a certified garage owner, AutoDoc gives us direct access to high-value diagnostic jobs. The transparent bidding model builds trust before the client even walks through our doors.',
      name: 'Ethan Miller',
      title: 'Founder & Head Mechanic, Apex Automotive',
      rating: 5,
    },
    {
      quote:
        'The permanent vehicle health history vault is invaluable. I can trace every sensor replacement and oil flush across all my luxury sports cars with zero effort.',
      name: 'Lucas Bennett',
      title: 'Private Collector & Porsche Enthusiast',
      rating: 5,
    },
    {
      quote:
        'AutoDoc bridges the gap between drivers and mechanics. No more diagnostic guesswork—just verified shop ratings and instant digital repair tracking.',
      name: 'Oliver Hayes',
      title: 'Fleet Operations Director, Sphere Transport',
      rating: 5,
    },
  ];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="testimonials" className="border-b border-[#C5A880]/15 bg-[#0D0F14] py-20 lg:py-28 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-sans-luxury text-xs font-bold tracking-[0.3em] uppercase text-[#C5A880] mb-3">
            REPUTATION & DISTINCTION
          </p>
          <h2 className="font-serif-luxury text-4xl font-bold tracking-tight gold-gradient-text sm:text-5xl">
            Trusted by Drivers & Certified Garages
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="mt-16 mx-auto max-w-4xl">
          <div className="jesko-card-surface rounded-3xl p-8 sm:p-12 relative overflow-hidden text-center gold-glow-border">
            {/* Gold Quote Emblem */}
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#C5A880]/30 bg-[#090B0E] text-[#C5A880]">
              <Quote className="h-7 w-7 text-[#C5A880]" />
            </div>

            {/* Rating Stars */}
            <div className="flex items-center justify-center gap-1 mb-6">
              {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-[#C5A880] text-[#C5A880]" />
              ))}
            </div>

            {/* Testimonial Quote */}
            <p className="font-serif-luxury text-xl sm:text-2xl text-[#FFF0DB] leading-relaxed italic max-w-2xl mx-auto">
              "{testimonials[activeIndex].quote}"
            </p>

            {/* Author Metadata */}
            <div className="mt-8 pt-6 border-t border-[#C5A880]/15">
              <p className="font-sans-luxury text-sm font-bold tracking-wider text-[#C5A880] uppercase">
                {testimonials[activeIndex].name}
              </p>
              <p className="mt-1 font-sans-luxury text-xs text-[#8E96A4]">
                {testimonials[activeIndex].title}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-2 transition-all duration-300 rounded-full ${
                    activeIndex === idx ? 'w-8 bg-[#C5A880]' : 'w-2 bg-[#1E232E]'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={handlePrev}
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full border-[#C5A880]/30 bg-[#12151C] text-[#C5A880] hover:bg-[#C5A880] hover:text-[#090B0E] transition-all"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                onClick={handleNext}
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full border-[#C5A880]/30 bg-[#12151C] text-[#C5A880] hover:bg-[#C5A880] hover:text-[#090B0E] transition-all"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
