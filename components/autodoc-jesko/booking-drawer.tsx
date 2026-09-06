'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, X, Calendar, Wrench, ChevronRight, Send, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function JeskoBookingDrawer() {
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    vehicle: '',
    symptom: '',
    name: '',
    phone: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      window.location.href = `/register?role=customer&vehicle=${encodeURIComponent(formData.vehicle)}`;
    }, 1200);
  };

  return (
    <>
      {/* Floating Sticky Bottom Bar (Jesko Jets Style) */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={() => setModalOpen(true)}
          className="relative group overflow-hidden border border-[#C5A880]/50 bg-[#0D0F14]/95 text-[#FFF0DB] hover:bg-[#C5A880] hover:text-[#0B0D10] text-xs font-sans-luxury font-bold uppercase tracking-widest px-6 py-6 rounded-full shadow-2xl backdrop-blur-xl transition-all duration-300 transform hover:scale-105"
        >
          <Wrench className="mr-2 h-4 w-4 text-[#C5A880] group-hover:text-[#0B0D10]" />
          <span>Request Diagnostic Quote</span>
        </Button>
      </div>

      {/* Interactive Modal Drawer */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0D10]/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="jesko-card-surface w-full max-w-xl rounded-3xl p-8 relative border border-[#C5A880]/30 shadow-2xl">
            
            {/* Close Button */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 flex h-8 w-8 items-center justify-center rounded-full border border-[#C5A880]/30 bg-[#14171E] text-[#C5A880] hover:bg-[#C5A880] hover:text-[#0B0D10] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header */}
            <div className="text-left mb-6">
              <div className="flex items-center gap-2 text-[#C5A880] text-xs font-sans-luxury font-bold uppercase tracking-widest mb-2">
                <ShieldCheck className="h-4 w-4" />
                <span>Executive Repair Dispatch</span>
              </div>
              <h3 className="font-serif-luxury text-3xl font-bold text-[#FFF0DB]">
                Request Itemized Quote
              </h3>
              <p className="mt-1 font-sans-luxury text-xs text-[#8E96A4]">
                Get broken-down diagnostic quotes from 150+ verified master garages within 15 minutes.
              </p>
            </div>

            {/* Form */}
            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#C5A880]/20 text-[#C5A880]">
                  <Send className="h-7 w-7 animate-bounce" />
                </div>
                <h4 className="font-serif-luxury text-2xl font-bold text-[#FFF0DB]">
                  Dispatching Diagnostic Request...
                </h4>
                <p className="text-xs text-[#8E96A4]">
                  Redirecting to Customer Portal for live quote matching.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-sans-luxury font-bold text-[#C5A880] uppercase tracking-wider mb-1">
                    Vehicle Year, Make & Model
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2024 Porsche 911 GT3 / BMW M5"
                    value={formData.vehicle}
                    onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                    className="w-full rounded-xl border border-[#C5A880]/20 bg-[#0B0D10] px-4 py-3 text-xs text-[#FFF0DB] placeholder-[#8E96A4]/60 focus:border-[#C5A880] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-sans-luxury font-bold text-[#C5A880] uppercase tracking-wider mb-1">
                    Repair Symptom or Service Needed
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe what you hear, see, or need (e.g. brake squeal, engine fault code P0300, oil service)..."
                    value={formData.symptom}
                    onChange={(e) => setFormData({ ...formData, symptom: e.target.value })}
                    className="w-full rounded-xl border border-[#C5A880]/20 bg-[#0B0D10] px-4 py-3 text-xs text-[#FFF0DB] placeholder-[#8E96A4]/60 focus:border-[#C5A880] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-sans-luxury font-bold text-[#C5A880] uppercase tracking-wider mb-1">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Alexander Vance"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-[#C5A880]/20 bg-[#0B0D10] px-4 py-3 text-xs text-[#FFF0DB] placeholder-[#8E96A4]/60 focus:border-[#C5A880] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-sans-luxury font-bold text-[#C5A880] uppercase tracking-wider mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 019-2834"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-xl border border-[#C5A880]/20 bg-[#0B0D10] px-4 py-3 text-xs text-[#FFF0DB] placeholder-[#8E96A4]/60 focus:border-[#C5A880] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-[#C5A880] text-[#0B0D10] font-bold text-xs uppercase hover:bg-[#E2C799] py-6 rounded-full shadow-2xl transition-all"
                  >
                    <span>Dispatch Diagnostic Request</span>
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}
    </>
  );
}
