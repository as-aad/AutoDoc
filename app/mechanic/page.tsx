'use client';

import { useRole } from '@/lib/role-context';
import { MechanicDashboard } from '@/components/dashboard/mechanic-dashboard';

export default function MechanicMainDashboardPage() {
  const { user, userName } = useRole();
  return <MechanicDashboard mechanicName={user?.name || userName || 'Jordan Reyes'} />;
}
