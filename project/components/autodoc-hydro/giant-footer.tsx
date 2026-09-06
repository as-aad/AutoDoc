'use client';

import Link from 'next/link';

export function HydroGiantFooter() {
  return (
    <footer className="pt-16 pb-12 relative overflow-hidden border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Navigation & Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b border-border text-xs font-hydro-body text-muted-foreground">
          <div>
            <p className="font-hydro-display text-sm font-bold text-foreground uppercase tracking-wider mb-4">
              Marketplace
            </p>
            <ul className="space-y-2.5">
              <li>
                <Link href="/requests/new" className="hover:text-[#FF5500] transition-colors">
                  Post a Request
                </Link>
              </li>
              <li>
                <Link href="/vehicles" className="hover:text-[#FF5500] transition-colors">
                  Vehicle Health Vault
                </Link>
              </li>
              <li>
                <Link href="/bookings" className="hover:text-[#FF5500] transition-colors">
                  Live Repair Tracker
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-hydro-display text-sm font-bold text-foreground uppercase tracking-wider mb-4">
              Portals
            </p>
            <ul className="space-y-2.5">
              <li>
                <Link href="/dashboard" className="hover:text-[#FF5500] transition-colors">
                  Customer Portal
                </Link>
              </li>
              <li>
                <Link href="/garage/requests" className="hover:text-[#FF5500] transition-colors">
                  Garage Partner Portal
                </Link>
              </li>
              <li>
                <Link href="/mechanic/workload" className="hover:text-[#FF5500] transition-colors">
                  Mechanic Workload Portal
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-hydro-display text-sm font-bold text-foreground uppercase tracking-wider mb-4">
              Account & Admin
            </p>
            <ul className="space-y-2.5">
              <li>
                <Link href="/profile" className="hover:text-[#FF5500] transition-colors">
                  Account
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#FF5500] transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-[#FF5500] transition-colors">
                  Get Started
                </Link>
              </li>
              <li>
                <Link href="/admin/users" className="hover:text-[#FF5500] transition-colors font-semibold text-red-500">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-hydro-display text-sm font-bold text-foreground uppercase tracking-wider mb-4">
              Status
            </p>
            <ul className="space-y-2 text-[11px] font-mono text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>ALL SYSTEMS OPERATIONAL</span>
              </li>
              <li>OBD-II PROTOCOL: ACTIVE</li>
              <li>VERSION: 2026.1</li>
            </ul>
          </div>
        </div>

        {/* Giant Full-Width Display Typography Header */}
        <div className="py-12 text-center overflow-hidden">
          <h1 className="font-hydro-display text-[16vw] font-bold leading-none uppercase text-foreground/15 select-none hover:text-[#FF5500]/30 transition-colors">
            AUTODOC
          </h1>
        </div>

        {/* Bottom Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-border text-xs font-hydro-body text-muted-foreground">
          <p>© 2026 AutoDoc Platform Inc. All rights reserved.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Security
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
