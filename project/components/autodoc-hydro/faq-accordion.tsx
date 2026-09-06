'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export function HydroFaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does AutoDoc quote transparency work?',
      a: 'Garages inspecting your repair request must submit broken-down quotes detailing individual parts, labor rates, estimated completion times, and warranty terms before any work begins. There are zero hidden fees.',
    },
    {
      q: 'What is the garage verification process?',
      a: 'Every garage onboarded to AutoDoc undergoes rigorous verification including business license auditing, technician ASE certification checks, insurance validation, and ongoing client review monitoring.',
    },
    {
      q: 'Which vehicle models and makes are supported?',
      a: 'AutoDoc supports all passenger cars, trucks, SUVs, European luxury models, Asian imports, and electric/hybrid vehicles.',
    },
    {
      q: 'What is your warranty policy for repairs?',
      a: 'All repairs completed through AutoDoc verified garages come with a standard 12-month / 12,000-mile parts and labor warranty protected by our platform guarantee.',
    },
    {
      q: 'How fast can I receive garage quotes?',
      a: 'Vehicle owners typically receive their first itemized quotes from verified nearby garages within 10 to 15 minutes of submitting vehicle symptoms.',
    },
    {
      q: 'Who should apply for the garage partner network?',
      a: 'Any independent garage or certified mechanic seeking to reach nearby repair customers, streamline workload allocation, and build a digital reputation should apply.',
    },
  ];

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-b border-border relative">
      <div className="mx-auto max-w-4xl">
        
        {/* Section Headline */}
        <div className="text-center mb-16">
          <h2 className="font-hydro-display text-4xl sm:text-6xl font-bold uppercase tracking-tight text-foreground">
            Frequently Asked Questions
          </h2>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="hydro-card-surface overflow-hidden transition-all duration-300 border border-border"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="font-hydro-display text-lg font-bold text-foreground">
                    {faq.q}
                  </span>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF5500]/20 text-[#FF5500]">
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 text-xs font-hydro-body text-muted-foreground leading-relaxed border-t border-border">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
