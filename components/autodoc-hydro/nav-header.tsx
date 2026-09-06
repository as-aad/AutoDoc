'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './theme-toggle';
import { useRole } from '@/lib/role-context';
import { Wrench, ChevronDown, LayoutDashboard, Store, User, ShieldAlert, LogIn, UserPlus, LogOut } from 'lucide-react';

export function HydroNavHeader() {
  const [portalsOpen, setPortalsOpen] = useState(false);
  const { isAuthenticated, userName, role, logout } = useRole();

  return (
    <header className="sticky top-0 z-40 hydro-blur-header py-4 px-6 sm:px-12 flex items-center justify-between">
      {/* Left: Brand */}
      <Link href="/" className="flex items-center gap-2.5 group">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF5500] text-white shadow-lg transition-transform group-hover:scale-105">
          <Wrench className="h-5 w-5" />
        </div>
        <div>
          <span className="font-hydro-display text-2xl font-bold tracking-wider text-foreground">
            AUTODOC
          </span>
          <span className="hidden sm:block text-[9px] font-hydro-body tracking-[0.25em] uppercase text-muted-foreground">
            Car Service & Repair
          </span>
        </div>
      </Link>

      {/* Center: Navigation Links + Portals Dropdown */}
      <nav className="hidden md:flex items-center gap-8 font-hydro-display text-sm font-semibold text-foreground">
        <a href="#home" className="hover:text-[#FF5500] transition-colors">
          Home
        </a>
        <a href="#about" className="hover:text-[#FF5500] transition-colors">
          About
        </a>

        {/* Portals Dropdown */}
        <div className="relative" onMouseLeave={() => setPortalsOpen(false)}>
          <button
            onClick={() => setPortalsOpen(!portalsOpen)}
            onMouseEnter={() => setPortalsOpen(true)}
            className="flex items-center gap-1.5 hover:text-[#FF5500] transition-colors focus:outline-none"
          >
            <span>Portals</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${portalsOpen ? 'rotate-180 text-[#FF5500]' : ''}`} />
          </button>

          {portalsOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 rounded-2xl bg-card border border-border p-2 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-accent text-foreground hover:text-[#FF5500] transition-colors text-xs font-hydro-body"
              >
                <LayoutDashboard className="h-4 w-4 text-[#FF5500]" />
                <div>
                  <div className="font-bold">Customer Portal</div>
                  <div className="text-[10px] text-muted-foreground">Bookings & Request repair</div>
                </div>
              </Link>

              <Link
                href="/garage/requests"
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-accent text-foreground hover:text-[#FF5500] transition-colors text-xs font-hydro-body"
              >
                <Store className="h-4 w-4 text-[#FF5500]" />
                <div>
                  <div className="font-bold">Garage Partner Portal</div>
                  <div className="text-[10px] text-muted-foreground">Manage quotes & bookings</div>
                </div>
              </Link>

              <Link
                href="/mechanic/workload"
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-accent text-foreground hover:text-[#FF5500] transition-colors text-xs font-hydro-body"
              >
                <Wrench className="h-4 w-4 text-[#FF5500]" />
                <div>
                  <div className="font-bold">Mechanic Workload Portal</div>
                  <div className="text-[10px] text-muted-foreground">Assigned jobs & status</div>
                </div>
              </Link>

              <Link
                href="/profile"
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-accent text-foreground hover:text-[#FF5500] transition-colors text-xs font-hydro-body"
              >
                <User className="h-4 w-4 text-[#FF5500]" />
                <div>
                  <div className="font-bold">Account</div>
                  <div className="text-[10px] text-muted-foreground">User settings & vehicles</div>
                </div>
              </Link>

              <Link
                href="/admin/users"
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-accent text-foreground hover:text-[#FF5500] transition-colors text-xs font-hydro-body border-t border-border mt-1 pt-2"
              >
                <ShieldAlert className="h-4 w-4 text-red-500" />
                <div>
                  <div className="font-bold text-red-500">Admin Portal</div>
                  <div className="text-[10px] text-muted-foreground">User & garage verifications</div>
                </div>
              </Link>
            </div>
          )}
        </div>

        <a href="#testimonials" className="hover:text-[#FF5500] transition-colors">
          Testimonials
        </a>
        <a href="#faq" className="hover:text-[#FF5500] transition-colors">
          FAQ
        </a>
      </nav>

      {/* Right: Actions + Light/Dark Theme Switch */}
      <div className="flex items-center gap-3">
        {/* Light / Dark Mode Toggle Button */}
        <ThemeToggle />

        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <Link
              href={
                role === 'garage'
                  ? '/garage/requests'
                  : role === 'mechanic'
                  ? '/mechanic/workload'
                  : role === 'admin'
                  ? '/admin/users'
                  : '/dashboard'
              }
              className="flex items-center gap-2 text-xs font-hydro-body hover:text-[#FF5500] transition-colors"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FF5500]/20 text-[#FF5500] font-bold">
                {userName ? userName.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="hidden sm:inline font-bold">{userName}</span>
              {role && (
                <span className="uppercase text-[9px] px-2 py-0.5 rounded-full bg-[#FF5500]/10 text-[#FF5500] font-mono">
                  {role}
                </span>
              )}
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="text-xs border-red-500/30 text-red-500 hover:bg-red-500/10"
            >
              <LogOut className="h-3.5 w-3.5 mr-1" />
              Sign Out
            </Button>
          </div>
        ) : (
          <>
            <Button
              variant="ghost"
              className="text-xs font-hydro-display font-semibold uppercase text-foreground hover:text-[#FF5500]"
              asChild
            >
              <Link href="/login">
                <LogIn className="mr-1.5 h-3.5 w-3.5" />
                Sign In
              </Link>
            </Button>

            <Button
              className="bg-[#FF5500] text-white hover:bg-[#FF7700] font-hydro-display text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full shadow-lg transition-transform hover:scale-105"
              asChild
            >
              <Link href="/register">
                <UserPlus className="mr-1.5 h-3.5 w-3.5" />
                Get Started
              </Link>
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
