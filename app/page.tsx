'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { ActivityTicker } from '@/components/shared/activity-ticker';
import { ScrollAnimate } from '@/components/shared/scroll-animate';
import {
  Sparkles,
  User,
  Building2,
  FileSpreadsheet,
  Star,
  ChevronDown,
  Clock,
  BarChart3,
  Zap,
} from 'lucide-react';

import { DoodleBackground } from '@/components/shared/doodle-background';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does AutoDoc verify garages and mechanics?',
      a: 'Every garage on AutoDoc undergoes state license verification, insurance audit, and diagnostic equipment checks before receiving job dispatch access.',
    },
    {
      q: 'Is digital service history attached to my vehicle VIN?',
      a: 'Yes! Every repair, part replacement, and inspection logged on AutoDoc is permanently recorded to your vehicle VIN for resale verification.',
    },
    {
      q: 'Can garages manage mechanic work queues?',
      a: 'Garages get a dedicated management portal to assign incoming repair requests directly to certified mechanics with real-time status updates.',
    },
    {
      q: 'Are upfront diagnostic quotes guaranteed?',
      a: 'Garages issue itemized digital estimates. Once approved by the vehicle owner, quotes cannot be changed without explicit customer authorization.',
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] text-[#0F172A] font-body flex flex-col selection:bg-[#606BDF]/20 selection:text-[#606BDF] overflow-hidden scroll-smooth">
      {/* Scattered Automotive Line-Art Doodle Background */}
      <DoodleBackground />

      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-[#F8FAFC]/90 backdrop-blur-md border-b border-[#E2E8F0] px-4 py-3 sm:px-6">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
          <Link href="#hero" className="flex items-center gap-2">
            <Logo size={48} showTagline={false} />
          </Link>

          {/* Capsule Navigation Menu - Anchored to Landing Page Sections */}
          <nav className="hidden md:flex items-center gap-1 bg-[#F1F5F9] rounded-full px-3 py-1.5 border border-[#E2E8F0]">
            <a
              href="#hero"
              className="px-4 py-1.5 rounded-full type-small font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-white/50 transition-all"
            >
              Home
            </a>
            <a
              href="#features"
              className="px-4 py-1.5 rounded-full type-small font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-white/50 transition-all"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="px-4 py-1.5 rounded-full type-small font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-white/50 transition-all"
            >
              How It Works
            </a>
            <a
              href="#faq"
              className="px-4 py-1.5 rounded-full type-small font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-white/50 transition-all"
            >
              FAQ
            </a>
            <a
              href="#testimonials"
              className="px-4 py-1.5 rounded-full type-small font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-white/50 transition-all"
            >
              Testimonials
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button variant="default" size="sm" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative overflow-hidden saasable-hero-header saasable-dot-bg pt-20 pb-24 px-4 sm:px-6 lg:pb-32 border-b border-[#E2E8F0] scroll-mt-20">
        <div className="mx-auto max-w-5xl text-center flex flex-col items-center relative z-10">
          <ScrollAnimate delayMs={100}>
            {/* Display Headline */}
            <h1 className="type-display text-[#0F172A] max-w-4xl font-display text-[42px] sm:text-[56px] lg:text-[64px] leading-[1.08] tracking-tight">
              Real-time Performance & Diagnostic Intelligence
            </h1>
          </ScrollAnimate>

          <ScrollAnimate delayMs={200}>
            {/* Subtitle */}
            <p className="mt-6 type-body text-[#64748B] max-w-2xl text-[18px] sm:text-[20px] leading-relaxed mx-auto">
              Streamline customer repair requests, garage job dispatches, and certified mechanic workflows on a single unified platform.
            </p>
          </ScrollAnimate>

          <ScrollAnimate delayMs={300}>
            {/* Hero CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto justify-center">
              <Button variant="default" size="lg" asChild className="w-full sm:w-auto text-[15px] gap-2 shadow-lg shadow-[#606BDF]/25">
                <Link href="/requests/new">
                  <Sparkles className="h-4 w-4" />
                  <span>Request Diagnostic Quote</span>
                </Link>
              </Button>
              <Button variant="secondary" size="lg" asChild className="w-full sm:w-auto text-[15px] gap-2 border border-[#E2E8F0]">
                <Link href="/garage/requests">
                  <Building2 className="h-4 w-4 text-[#606BDF]" />
                  <span>Register Garage Partner</span>
                </Link>
              </Button>
            </div>
          </ScrollAnimate>
        </div>
      </section>

      {/* Animated Activity Ticker */}
      <ActivityTicker />

      {/* Core Feature Section */}
      <section id="features" className="py-24 px-4 sm:px-6 bg-[#F8FAFC] scroll-mt-20">
        <div className="mx-auto max-w-7xl">
          <ScrollAnimate className="text-center mb-16">
            <div className="saasable-pill mb-3">
              <Sparkles className="h-3.5 w-3.5 text-[#606BDF]" />
              <span>Core Features</span>
            </div>
            <h2 className="type-h1 text-[#0F172A] font-display text-[32px] sm:text-[40px]">
              Engineered for Vehicle Owners & Repair Networks
            </h2>
            <p className="mt-3 type-body text-[#64748B] max-w-xl mx-auto">
              Automated job dispatching, transparent quote comparisons, and permanent digital history.
            </p>
          </ScrollAnimate>

          <ScrollAnimate delayMs={200}>
            <div className="rounded-[32px] border border-[#E2E8F0] bg-white p-6 sm:p-10 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-[#E2E8F0]">
                {/* Feature 1 */}
                <div className="flex flex-col gap-4 p-4">
                  <div className="h-12 w-12 rounded-full bg-[#E0E3FD] text-[#606BDF] flex items-center justify-center">
                    <User className="h-6 w-6" />
                  </div>
                  <h4 className="type-h3 font-display text-[#0F172A]">Instant Quote Requests</h4>
                  <p className="type-body text-[#64748B]">
                    Post diagnostic requests with photos and description to receive competing quotes from local certified garages.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="flex flex-col gap-4 p-4 md:pl-8">
                  <div className="h-12 w-12 rounded-full bg-[#FFE8D6] text-[#FF7A29] flex items-center justify-center">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <h4 className="type-h3 font-display text-[#0F172A]">Garage Workload Manager</h4>
                  <p className="type-body text-[#64748B]">
                    Shop managers assign incoming repair jobs directly to certified technicians with real-time bay status tracking.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="flex flex-col gap-4 p-4 md:pl-8">
                  <div className="h-12 w-12 rounded-full bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center">
                    <FileSpreadsheet className="h-6 w-6" />
                  </div>
                  <h4 className="type-h3 font-display text-[#0F172A]">Permanent VIN Vault</h4>
                  <p className="type-body text-[#64748B]">
                    Every oil change, brake job, and part replacement is permanently attached to the VIN for verified vehicle resale value.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-[#E2E8F0] pt-8 mt-8 divide-y md:divide-y-0 md:divide-x divide-[#E2E8F0]">
                {/* Feature 4 */}
                <div className="flex flex-col gap-4 p-4">
                  <div className="h-12 w-12 rounded-full bg-[#E0E3FD] text-[#606BDF] flex items-center justify-center">
                    <Clock className="h-6 w-6" />
                  </div>
                  <h4 className="type-h3 font-display text-[#0F172A]">Live Repair Tracker</h4>
                  <p className="type-body text-[#64748B]">
                    Vehicle owners view step-by-step repair status from diagnostic intake to final road test completion.
                  </p>
                </div>

                {/* Feature 5 */}
                <div className="flex flex-col gap-4 p-4 md:pl-8">
                  <div className="h-12 w-12 rounded-full bg-[#FFE8D6] text-[#FF7A29] flex items-center justify-center">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <h4 className="type-h3 font-display text-[#0F172A]">Revenue & Analytics</h4>
                  <p className="type-body text-[#64748B]">
                    Garages access structured revenue dashboards, parts consumption metrics, and customer retention insights.
                  </p>
                </div>

                {/* Feature 6 */}
                <div className="flex flex-col gap-4 p-4 md:pl-8">
                  <div className="h-12 w-12 rounded-full bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center">
                    <Zap className="h-6 w-6" />
                  </div>
                  <h4 className="type-h3 font-display text-[#0F172A]">Fast Parts Procurement</h4>
                  <p className="type-body text-[#64748B]">
                    Mechanics order OEM and aftermarket replacement parts directly within their active job repair ticket.
                  </p>
                </div>
              </div>
            </div>
          </ScrollAnimate>
        </div>
      </section>

      {/* How-it-Works Process Section */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 border-t border-[#E2E8F0] bg-white scroll-mt-20">
        <div className="mx-auto max-w-7xl">
          <ScrollAnimate className="text-center mb-16">
            <div className="saasable-pill mb-3">
              <span>Step-by-Step Workflow</span>
            </div>
            <h2 className="type-h1 text-[#0F172A] font-display text-[32px] sm:text-[40px]">
              How AutoDoc Works
            </h2>
            <p className="mt-3 type-body text-[#64748B]">
              From request creation to final repair verification in 3 simple steps.
            </p>
          </ScrollAnimate>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollAnimate delayMs={100} className="h-full">
              <div className="saasable-card flex flex-col items-center text-center h-full">
                <div className="h-12 w-12 rounded-full bg-[#606BDF] text-white flex items-center justify-center font-bold text-lg mb-6">
                  1
                </div>
                <h3 className="type-h3 font-display text-[#0F172A] mb-2">Post Repair Request</h3>
                <p className="type-body text-[#64748B]">
                  Describe your vehicle issue, upload photos, and set your location to receive quotes.
                </p>
              </div>
            </ScrollAnimate>

            <ScrollAnimate delayMs={250} className="h-full">
              <div className="saasable-card flex flex-col items-center text-center h-full">
                <div className="h-12 w-12 rounded-full bg-[#FF7A29] text-white flex items-center justify-center font-bold text-lg mb-6">
                  2
                </div>
                <h3 className="type-h3 font-display text-[#0F172A] mb-2">Compare Quotes</h3>
                <p className="type-body text-[#64748B]">
                  Review itemized diagnostic quotes, garage ratings, and estimated completion times.
                </p>
              </div>
            </ScrollAnimate>

            <ScrollAnimate delayMs={400} className="h-full">
              <div className="saasable-card flex flex-col items-center text-center h-full">
                <div className="h-12 w-12 rounded-full bg-[#16A34A] text-white flex items-center justify-center font-bold text-lg mb-6">
                  3
                </div>
                <h3 className="type-h3 font-display text-[#0F172A] mb-2">Track & Log Record</h3>
                <p className="type-body text-[#64748B]">
                  Follow repair progress in real time and automatically log the completed service to your VIN vault.
                </p>
              </div>
            </ScrollAnimate>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-24 px-4 sm:px-6 border-t border-[#E2E8F0] bg-white scroll-mt-20">
        <div className="mx-auto max-w-4xl">
          <ScrollAnimate className="text-center mb-16">
            <div className="saasable-pill mb-3">
              <span>Frequently Asked Questions</span>
            </div>
            <h2 className="type-h1 text-[#0F172A] font-display text-[32px] sm:text-[40px]">
              Everything You Need to Know
            </h2>
          </ScrollAnimate>

          <ScrollAnimate delayMs={200} className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-display type-h3 text-[#0F172A]"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-[#606BDF] transition-transform duration-200 ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-6 type-body text-[#64748B] border-t border-[#E2E8F0] pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </ScrollAnimate>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-4 sm:px-6 border-t border-[#E2E8F0] bg-[#F8FAFC] scroll-mt-20">
        <div className="mx-auto max-w-7xl">
          <ScrollAnimate className="text-center mb-16">
            <div className="saasable-pill mb-3">
              <Star className="h-3.5 w-3.5 text-[#EAB308] fill-[#EAB308]" />
              <span>Customer Satisfaction</span>
            </div>
            <h2 className="type-h1 text-[#0F172A] font-display text-[32px] sm:text-[40px]">
              Trusted by 10,000+ Drivers & Technicians
            </h2>
          </ScrollAnimate>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollAnimate delayMs={100} className="h-full">
              <div className="rounded-3xl border border-[#E2E8F0] bg-white p-8 flex flex-col justify-between shadow-xs h-full">
                <div>
                  <div className="flex items-center gap-1 text-[#EAB308] mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="type-body text-[#334155] italic mb-6">
                    "Having my car's full service history documented online gave me complete confidence when selling. Buyers paid asking price immediately."
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full bg-[#606BDF] text-white flex items-center justify-center type-small font-bold">
                    DR
                  </div>
                  <div>
                    <div className="type-small font-bold text-[#0F172A]">David Reed</div>
                    <div className="type-caption text-[#64748B]">Vehicle Owner</div>
                  </div>
                </div>
              </div>
            </ScrollAnimate>

            <ScrollAnimate delayMs={250} className="h-full">
              <div className="rounded-3xl border border-[#E2E8F0] bg-white p-8 flex flex-col justify-between shadow-xs h-full">
                <div>
                  <div className="flex items-center gap-1 text-[#EAB308] mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="type-body text-[#334155] italic mb-6">
                    "AutoDoc cut our front-desk phone calls by half. Incoming requests are structured, and customers approve quotes directly from their phones."
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full bg-[#FF7A29] text-white flex items-center justify-center type-small font-bold">
                    SA
                  </div>
                  <div>
                    <div className="type-small font-bold text-[#0F172A]">Sarah Al-Mansoor</div>
                    <div className="type-caption text-[#64748B]">Owner, Apex Auto Care</div>
                  </div>
                </div>
              </div>
            </ScrollAnimate>

            <ScrollAnimate delayMs={400} className="h-full">
              <div className="rounded-3xl border border-[#E2E8F0] bg-white p-8 flex flex-col justify-between shadow-xs h-full">
                <div>
                  <div className="flex items-center gap-1 text-[#EAB308] mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="type-body text-[#334155] italic mb-6">
                    "I can review the car's past repair history before popping the hood. It cuts diagnostic time in half for complex electrical issues."
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full bg-[#16A34A] text-white flex items-center justify-center type-small font-bold">
                    MC
                  </div>
                  <div>
                    <div className="type-small font-bold text-[#0F172A]">Marcus Chen</div>
                    <div className="type-caption text-[#64748B]">Master Technician</div>
                  </div>
                </div>
              </div>
            </ScrollAnimate>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#E2E8F0] bg-[#0F172A] text-white py-12 px-6">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Logo size={48} showTagline={false} />
            <span className="type-caption text-[#94A3B8]">© 2026 AutoDoc Inc. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 type-small text-[#CBD5E1]">
            <Link href="/dashboard" className="hover:text-[#606BDF] transition-colors">Customer Portal</Link>
            <Link href="/garage/requests" className="hover:text-[#606BDF] transition-colors">Garage Portal</Link>
            <Link href="/mechanic/workload" className="hover:text-[#606BDF] transition-colors">Mechanic Portal</Link>
            <Link href="/admin/users" className="hover:text-[#606BDF] transition-colors">Admin Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
