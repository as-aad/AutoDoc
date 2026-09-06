import { SharedDashboardLayout } from '@/components/shared/dashboard-layout';

export default function MechanicLayout({ children }: { children: React.ReactNode }) {
  return <SharedDashboardLayout>{children}</SharedDashboardLayout>;
}
