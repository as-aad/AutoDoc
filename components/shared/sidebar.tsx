'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Car,
  PlusCircle,
  ClipboardList,
  CalendarCheck,
  UserCircle,
  Wrench,
  BarChart3,
  Store,
  ShieldCheck,
  Users,
  Menu,
  X,
  LogOut,
  ChevronRight,
  ShoppingCart,
  Receipt,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRole, Role } from '@/lib/role-context';
import { NAV_ITEMS } from '@/lib/constants';
import Logo from '@/components/Logo';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Car,
  PlusCircle,
  ClipboardList,
  CalendarCheck,
  UserCircle,
  Wrench,
  BarChart3,
  Store,
  ShieldCheck,
  Users,
  ShoppingCart,
  Receipt,
};

export function Sidebar() {
  const pathname = usePathname();
  const { role, logout } = useRole();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentRole: Role = role || 'customer';
  const navItems = NAV_ITEMS[currentRole] || [];

  const sidebarContent = (
    <>
      {/* Brand Header */}
      <div className="flex items-center px-6 py-5 border-b border-[#E2E8F0]">
        <Link href="/" className="flex items-center gap-2">
          <Logo size={48} showTagline={false} />
        </Link>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 space-y-1.5 px-3 py-5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon] || LayoutDashboard;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'group flex items-center justify-between rounded-full px-4 py-2.5 type-small font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#606BDF]',
                isActive
                  ? 'bg-[#606BDF] text-white shadow-sm shadow-[#606BDF]/20'
                  : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    'h-4 w-4 transition-colors',
                    isActive ? 'text-white' : 'text-[#64748B] group-hover:text-[#0F172A]'
                  )}
                />
                <span>{item.label}</span>
              </div>
              {isActive && (
                <ChevronRight className="h-4 w-4 text-white/80" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sign Out Action */}
      <div className="p-3 border-t border-[#E2E8F0]">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            logout();
          }}
          className="flex w-full items-center gap-3 rounded-full px-4 py-2.5 type-small font-semibold text-[#64748B] hover:bg-[#F9E8E7] hover:text-[#DC2626] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#606BDF] cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-3 left-3 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white border border-[#E2E8F0] text-[#0F172A] lg:hidden focus-visible:ring-2 focus-visible:ring-[#606BDF] shadow-sm"
        aria-label="Toggle Navigation Sidebar"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-[#0F172A]/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Desktop & Mobile Sidebar Container */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-40 flex w-64 flex-col border-r border-[#E2E8F0] bg-white transition-transform duration-250 ease-out lg:static lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
