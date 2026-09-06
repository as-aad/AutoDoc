'use client';

import Link from 'next/link';
import { Shield } from 'lucide-react';

export function JeskoGiantFooter() {
  return (
    <footer className="border-t border-[#C5A880]/20 bg-[#090B0E] pt-16 pb-12 relative overflow-hidden text-[#8E96A4]">
      {/* Background Soft Gold Spotlight */}
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 h-96 w-[800px] rounded-full bg-[#C5A880]/5 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5 pb-16 border-b border-[#C5A880]/15">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#C5A880]/30 bg-[#12151C] text-[#C5A880]">
                <Shield className="h-5 w-5" />
              </div>
              <span className="font-serif-luxury text-3xl font-bold tracking-wider gold-gradient-text">
                AUTODOC
              </span>
            </Link>
            <p className="text-xs font-sans-luxury text-[#8E96A4] leading-relaxed max-w-sm">
              The premier open vehicle diagnostic and repair marketplace empowering drivers, master mechanics, and certified local garages.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <p className="font-sans-luxury text-xs font-bold tracking-widest text-[#FFF0DB] uppercase mb-4">
              Marketplace
            </p>
            <ul className="space-y-2.5 text-xs font-sans-luxury">
              <li>
                <Link href="/requests/new" className="hover:text-[#C5A880] transition-colors">
                  Post Diagnostic Request
                </Link>
              </li>
              <li>
                <Link href="/vehicles" className="hover:text-[#C5A880] transition-colors">
                  Vehicle Health Vault
                </Link>
              </li>
              <li>
                <Link href="/bookings" className="hover:text-[#C5A880] transition-colors">
                  Live Repair Tracker
                </Link>
              </li>
            </ul>
          </div>

          {/* Portals */}
          <div>
            <p className="font-sans-luxury text-xs font-bold tracking-widest text-[#FFF0DB] uppercase mb-4">
              Portals
            </p>
            <ul className="space-y-2.5 text-xs font-sans-luxury">
              <li>
                <Link href="/register?role=customer" className="hover:text-[#C5A880] transition-colors">
                  Customer Portal
                </Link>
              </li>
              <li>
                <Link href="/register?role=garage" className="hover:text-[#C5A880] transition-colors">
                  Garage Partner Portal
                </Link>
              </li>
              <li>
                <Link href="/register?role=mechanic" className="hover:text-[#C5A880] transition-colors">
                  Mechanic Portal
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-[#C5A880] transition-colors">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Status */}
          <div>
            <p className="font-sans-luxury text-xs font-bold tracking-widest text-[#FFF0DB] uppercase mb-4">
              Telemetry Status
            </p>
            <ul className="space-y-2 text-[11px] font-mono text-[#8E96A4]">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>REST API v1 // ONLINE</span>
              </li>
              <li>OBD-II TELEMETRY: ACTIVE</li>
              <li>MOCK ENGINE: READY</li>
            </ul>
          </div>

        </div>

        {/* Giant Full-Bleed Gold Typography Header */}
        <div className="py-12 text-center overflow-hidden">
          <h1 className="font-serif-luxury text-[14vw] font-bold leading-none tracking-tight gold-gradient-text select-none opacity-20 hover:opacity-30 transition-opacity">
            AUTODOC
          </h1>
        </div>

        {/* Bottom Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-[#C5A880]/10 text-xs font-sans-luxury">
          <p>© 2026 AutoDoc Executive Telemetry Inc. All rights reserved.</p>
          <div className="flex gap-6 mt-4 sm:mt-0 text-[#8E96A4]">
            <a href="#" className="hover:text-[#C5A880] transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-[#C5A880] transition-colors">
              Terms of Distinction
            </a>
            <a href="#" className="hover:text-[#C5A880] transition-colors">
              Security
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
