'use client';

import { useEffect, useState } from 'react';
import { useRole, Role } from '@/lib/role-context';
import { cn } from '@/lib/utils';

const roleLabels: Record<Role, string> = {
  customer: 'Customer Portal',
  mechanic: 'Mechanic Workload',
  garage: 'Garage Partner',
  admin: 'Administrator',
};

const roleColors: Record<Role, string> = {
  customer: 'bg-[#FF5500]/10 text-[#FF5500]',
  mechanic: 'bg-[#FF5500]/15 text-[#FF5500]',
  garage: 'bg-[#FF5500]/10 text-[#FF5500]',
  admin: 'bg-red-500/10 text-red-500',
};

export function RoleSwitcher() {
  const { role, userName } = useRole();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !role) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-xs text-muted-foreground sm:inline">Active Workspace:</span>
      <div className={cn('rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider', roleColors[role])}>
        {userName ? `${userName} (${roleLabels[role]})` : roleLabels[role]}
      </div>
    </div>
  );
}
