import { SharedDashboardLayout } from '@/components/shared/dashboard-layout';

export default function PartsLayout({ children }: { children: React.ReactNode }) {
  return <SharedDashboardLayout>{children}</SharedDashboardLayout>;
}
