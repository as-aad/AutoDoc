import { SharedDashboardLayout } from '@/components/shared/dashboard-layout';

export default function RequestsLayout({ children }: { children: React.ReactNode }) {
  return <SharedDashboardLayout>{children}</SharedDashboardLayout>;
}
