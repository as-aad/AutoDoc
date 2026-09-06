import { SharedDashboardLayout } from '@/components/shared/dashboard-layout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SharedDashboardLayout>{children}</SharedDashboardLayout>;
}
