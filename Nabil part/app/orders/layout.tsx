import { SharedDashboardLayout } from '@/components/shared/dashboard-layout';

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return <SharedDashboardLayout>{children}</SharedDashboardLayout>;
}
