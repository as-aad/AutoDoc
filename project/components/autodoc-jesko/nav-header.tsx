'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, ChevronRight, Menu, X, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function JeskoNavHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? 'jesko-blur-header py-3 shadow-2xl' : 'bg-[#0B0D10]/80 backdrop-blur-md py-4 border-b border-[#C5A880]/15'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Brand Logo Emblem */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#C5A880]/30 bg-[#14171E] transition-transform duration-300 group-hover:scale-105 group-hover:border-[#C5A880]">
            <Shield className="h-5 w-5 text-[#C5A880]" />
          </div>
          <div>
            <span className="font-serif-luxury text-2xl font-bold tracking-wider gold-gradient-text">
              AutoDoc
            </span>
            <span className="hidden sm:block text-[9px] font-sans-luxury tracking-[0.25em] uppercase text-[#8E96A4]">
              Executive Telemetry
            </span>
          </div>
        </Link>

        {/* Center: Jesko Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8 font-sans-luxury text-xs tracking-widest uppercase font-medium text-[#FFF0DB]">
          <a href="#about" className="transition-colors hover:text-[#C5A880]">
            About
          </a>
          <a href="#fleet" className="transition-colors hover:text-[#C5A880]">
            Fleet & Garages
          </a>
          <a href="#services" className="transition-colors hover:text-[#C5A880]">
            Services
          </a>
          <a href="#testimonials" className="transition-colors hover:text-[#C5A880]">
            Distinction
          </a>
          <a href="#faq" className="transition-colors hover:text-[#C5A880]">
            FAQ
          </a>
        </nav>

        {/* Right: Phone/Email Contacts & Action Buttons */}
        <div className="hidden sm:flex items-center gap-4">
          <a
            href="tel:+971544325050"
            className="hidden xl:flex items-center gap-1.5 text-xs font-sans-luxury font-medium text-[#8E96A4] hover:text-[#C5A880] transition-colors"
          >
            <Phone className="h-3.5 w-3.5 text-[#C5A880]" />
            <span>+971 54 432 5050</span>
          </a>

          <Button
            variant="ghost"
            className="text-xs font-sans-luxury tracking-widest uppercase text-[#FFF0DB] hover:text-[#C5A880] hover:bg-[#14171E]"
            asChild
          >
            <Link href="/login">Sign In</Link>
          </Button>

          <Button
            className="relative group overflow-hidden border border-[#C5A880]/40 bg-gradient-to-r from-[#C5A880]/20 to-[#9E8159]/20 text-[#FFF0DB] hover:border-[#C5A880] hover:bg-[#C5A880]/30 text-xs font-sans-luxury font-semibold tracking-wider uppercase px-5 py-2.5 rounded-full transition-all duration-300 shadow-lg"
            asChild
          >
            <Link href="/register">
              <span>Get Started</span>
              <ChevronRight className="ml-1 h-3.5 w-3.5 text-[#C5A880] transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-[#C5A880]/30 bg-[#14171E] text-[#C5A880]"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#C5A880]/20 bg-[#0E1116] px-6 pt-4 pb-6 space-y-4">
          <nav className="flex flex-col space-y-3 font-sans-luxury text-xs tracking-widest uppercase text-[#FFF0DB]">
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#C5A880]"
            >
              About
            </a>
            <a
              href="#fleet"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#C5A880]"
            >
              Fleet & Garages
            </a>
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#C5A880]"
            >
              Services
            </a>
            <a
              href="#testimonials"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#C5A880]"
            >
              Distinction
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#C5A880]"
            >
              FAQ
            </a>
          </nav>

          <div className="pt-3 border-t border-[#C5A880]/15 flex flex-col gap-2">
            <Button
              variant="outline"
              className="border-[#C5A880]/30 text-[#C5A880] hover:bg-[#C5A880]/10 text-xs uppercase"
              asChild
            >
              <Link href="/login">Sign In</Link>
            </Button>
            <Button
              className="bg-[#C5A880] text-[#0B0D10] font-bold text-xs uppercase hover:bg-[#E2C799]"
              asChild
            >
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
