'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useRole } from '@/lib/role-context';

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { role } = useRole();

  useEffect(() => {
    if (!role) return;

    // Admin routes restriction
    if (pathname.startsWith('/admin') && pathname !== '/admin/login' && role !== 'admin') {
      router.replace('/dashboard');
      return;
    }

    // Garage routes restriction
    if (pathname.startsWith('/garage') && role !== 'garage') {
      router.replace('/dashboard');
      return;
    }

    // Mechanic routes restriction
    if (pathname.startsWith('/mechanic') && role !== 'mechanic') {
      router.replace('/dashboard');
      return;
    }
  }, [pathname, role, router]);

  return <>{children}</>;
}
