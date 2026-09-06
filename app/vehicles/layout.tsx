import { SharedDashboardLayout } from '@/components/shared/dashboard-layout';

export default function VehiclesLayout({ children }: { children: React.ReactNode }) {
  return <SharedDashboardLayout>{children}</SharedDashboardLayout>;
}
