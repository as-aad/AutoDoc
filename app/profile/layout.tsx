import { SharedDashboardLayout } from '@/components/shared/dashboard-layout';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <SharedDashboardLayout>{children}</SharedDashboardLayout>;
}
