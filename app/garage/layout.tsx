import { SharedDashboardLayout } from '@/components/shared/dashboard-layout';

export default function GarageLayout({ children }: { children: React.ReactNode }) {
  return <SharedDashboardLayout>{children}</SharedDashboardLayout>;
}
