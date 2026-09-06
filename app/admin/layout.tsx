import { SharedDashboardLayout } from '@/components/shared/dashboard-layout';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <SharedDashboardLayout>{children}</SharedDashboardLayout>;
}
