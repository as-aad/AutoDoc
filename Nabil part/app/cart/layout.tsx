import { SharedDashboardLayout } from '@/components/shared/dashboard-layout';

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <SharedDashboardLayout>{children}</SharedDashboardLayout>;
}
