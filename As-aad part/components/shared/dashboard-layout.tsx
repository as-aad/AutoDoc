import { Sidebar } from '@/components/shared/sidebar';
import { Header } from '@/components/shared/header';
import { RouteGuard } from '@/components/shared/route-guard';

export function SharedDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard>
      <div className="flex min-h-screen bg-[#F7F5F2] text-[#1A1D23]">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header />
          <main className="flex-1 px-6 py-6 lg:px-8 lg:py-8">
            <div className="mx-auto max-w-7xl space-y-6">{children}</div>
          </main>
        </div>
      </div>
    </RouteGuard>
  );
}
