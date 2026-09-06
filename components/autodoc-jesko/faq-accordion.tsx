'use client';

import { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

export function JeskoFaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does AutoDoc guarantee itemized quote transparency?',
      a: 'Garages inspecting your repair request must submit broken-down quotes detailing individual parts, labor rates, estimated completion times, and warranty terms before any work begins. There are zero hidden fees.',
    },
    {
      q: 'What is the verification process for AutoDoc garages & mechanics?',
      a: 'Every garage onboarded to AutoDoc undergoes rigorous verification including business license auditing, technician ASE certification checks, insurance validation, and ongoing client review monitoring.',
    },
    {
      q: 'How does the digital vehicle health vault work?',
      a: 'When repairs or diagnostics are performed through AutoDoc, all diagnostic trouble codes (DTCs), sensor readings, replaced parts, and invoices are automatically archived in your permanent vehicle vault.',
    },
    {
      q: 'Can independent mechanics sign up without owning a full garage facility?',
      a: 'Yes. Certified independent mechanics can register for our Workload Portal to contract on active repair jobs, assist local garages, or manage mobile diagnostic services.',
    },
    {
      q: 'How fast can I receive repair quotes after posting a request?',
      a: 'Vehicle owners typically receive their first itemized quotes from verified nearby garages within 10 to 15 minutes of submitting vehicle symptoms.',
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="border-b border-[#C5A880]/15 bg-[#090B0E] py-20 lg:py-28 relative">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mx-auto max-w-3xl mb-16">
          <p className="font-sans-luxury text-xs font-bold tracking-[0.3em] uppercase text-[#C5A880] mb-3">
            EXECUTIVE INQUIRIES
          </p>
          <h2 className="font-serif-luxury text-4xl font-bold tracking-tight gold-gradient-text sm:text-5xl">
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
                className="jesko-card-surface rounded-2xl overflow-hidden transition-all duration-300 border border-[#C5A880]/15 hover:border-[#C5A880]/40"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="font-serif-luxury text-xl font-semibold text-[#FFF0DB]">
                    {faq.q}
                  </span>
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors ${
                      isOpen
                        ? 'border-[#C5A880] bg-[#C5A880] text-[#090B0E]'
                        : 'border-[#C5A880]/30 bg-[#12151C] text-[#C5A880]'
                    }`}
                  >
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 text-xs font-sans-luxury text-[#8E96A4] leading-relaxed border-t border-[#C5A880]/10">
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
