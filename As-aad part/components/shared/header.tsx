'use client';

import { RoleSwitcher } from './role-switcher';
import { NotificationCenter } from './notification-center';
import { useRole } from '@/lib/role-context';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function Header() {
  const { userName, user } = useRole();
  const displayName = user?.name || userName || 'User';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#E2E8F0] bg-[#F8FAFC]/90 px-4 py-3 backdrop-blur-md lg:px-6">
      <div className="hidden lg:block" />
      <div className="flex items-center gap-3">
        {/* User-Specific Notification Center Bell */}
        <NotificationCenter />

        {/* Dynamic Role Switcher */}
        <RoleSwitcher />

        {/* User Avatar */}
        <Avatar className="h-9 w-9 border border-[#E2E8F0]">
          <AvatarFallback className="bg-[#606BDF] text-white text-xs font-bold font-display">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
