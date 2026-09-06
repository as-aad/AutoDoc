'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HydroTestimonialsCarousel() {
  const [activeIdx, setActiveIdx] = useState(0);

  const testimonials = [
    {
      quote:
        'AutoDoc seamlessly blends vehicle repair requests with transparent quote bidding, creating a revolutionary experience that redefines repair trust. Every service feels like progress toward a future where drivers and garages work hand in hand.',
      name: 'James Carter',
      title: 'Founder of Aqva Solutions',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    {
      quote:
        'AutoDoc introduces a groundbreaking concept by combining verified shop ratings with the cutting-edge possibilities of itemized quote bidding. It offers more than repairs — it sets a benchmark for automotive transparency.',
      name: 'Ethan Miller',
      title: 'CEO of Innovate Labs & Master Mechanic',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    {
      quote:
        'The brilliance of AutoDoc lies in its innovative ability to merge mechanical precision with technology, redefining how we think about car maintenance. This transparent approach is visionary.',
      name: 'Lucas Bennett',
      title: 'Managing Director of Enters Fleet',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
    {
      quote:
        'AutoDoc is more than just a repair platform; it is a revolution in the way we maintain vehicles. The seamless integration of itemized quotes and verified garage bidding demonstrates true dedication.',
      name: 'Oliver Hayes',
      title: 'Co-Founder of Us Sphere Logistics',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    },
  ];

  const handlePrev = () => {
    setActiveIdx((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="testimonials" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-b border-border relative">
      <div className="mx-auto max-w-7xl">
        
        {/* Headline */}
        <div className="text-center mx-auto max-w-3xl mb-16">
          <h2 className="font-hydro-display text-4xl sm:text-6xl font-bold uppercase tracking-tight text-foreground">
            Become part Be the first of our hood
          </h2>
        </div>

        {/* Testimonial Card Slider */}
        <div className="mx-auto max-w-4xl">
          <div className="hydro-card-surface p-8 sm:p-12 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
            <div>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[#FF5500] text-[#FF5500]" />
                ))}
              </div>

              <p className="font-hydro-body text-base sm:text-lg text-foreground leading-relaxed italic">
                "{testimonials[activeIdx].quote}"
              </p>
            </div>

            <div className="mt-8 flex items-center gap-4 pt-6 border-t border-border">
              <img
                src={testimonials[activeIdx].avatar}
                alt={testimonials[activeIdx].name}
                className="h-12 w-12 rounded-full object-cover border-2 border-[#FF5500]"
              />
              <div>
                <p className="font-hydro-display text-sm font-bold text-foreground">
                  {testimonials[activeIdx].name}
                </p>
                <p className="font-hydro-body text-xs text-muted-foreground">
                  {testimonials[activeIdx].title}
                </p>
              </div>
            </div>
          </div>

          {/* Carousel Buttons */}
          <div className="mt-8 flex items-center justify-between">
            <div className="flex gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeIdx === idx ? 'w-8 bg-[#FF5500]' : 'w-2 bg-border'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handlePrev}
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full border-border bg-card text-foreground hover:bg-[#FF5500] hover:text-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                onClick={handleNext}
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full border-border bg-card text-foreground hover:bg-[#FF5500] hover:text-white"
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
