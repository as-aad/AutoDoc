'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Store, Wrench, User, LogIn, UserPlus, ShieldAlert } from 'lucide-react';

export function QuickPortalBar() {
  const pathname = usePathname();

  const portals = [
    { name: 'Customer', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Garage', href: '/garage/requests', icon: Store },
    { name: 'Mechanic', href: '/mechanic/workload', icon: Wrench },
    { name: 'Admin', href: '/admin/users', icon: ShieldAlert },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Sign In', href: '/login', icon: LogIn },
    { name: 'Register', href: '/register', icon: UserPlus },
  ];

  return (
    <div className="bg-[#0F172A] border-b border-[#334155]/40 text-white text-xs py-2 px-4 overflow-x-auto whitespace-nowrap z-40">
      <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="saasable-pill-badge">SaasAble Pro</span>
          <span className="type-caption text-[#94A3B8] font-medium hidden sm:inline">
            AutoDoc Portals
          </span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {portals.map((p) => {
            const Icon = p.icon;
            const isActive = pathname.startsWith(p.href);
            return (
              <Link
                key={p.href}
                href={p.href}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full type-caption transition-all ${
                  isActive
                    ? 'bg-[#606BDF] text-white font-semibold shadow-xs'
                    : 'bg-white/10 hover:bg-white/20 text-[#CBD5E1] font-medium'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{p.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
