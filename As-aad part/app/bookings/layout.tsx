import { SharedDashboardLayout } from '@/components/shared/dashboard-layout';

export default function BookingsLayout({ children }: { children: React.ReactNode }) {
  return <SharedDashboardLayout>{children}</SharedDashboardLayout>;
}
