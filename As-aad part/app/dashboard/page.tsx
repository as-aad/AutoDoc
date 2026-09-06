'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Car,
  ClipboardList,
  CalendarCheck,
  Wrench,
  TrendingUp,
  Users,
  ShieldCheck,
  Store,
  AlertCircle,
  Clock,
  CheckCircle2,
  Star,
  Building2,
} from 'lucide-react';
import { useRole } from '@/lib/role-context';
import { StatCard } from '@/components/shared/stat-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { StarRating } from '@/components/shared/star-rating';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import {
  getVehicles,
  getRequests,
  getBookings,
  getAdminStats,
  getGarageAnalytics,
  getBookingsByGarage,
  getBookingsByMechanic,
  getOpenRequestsNearby,
} from '@/services';
import type { Vehicle, ServiceRequest, Booking, AdminStats, GarageAnalytics, Review } from '@/lib/types';
import { MechanicDashboard } from '@/components/dashboard/mechanic-dashboard';

import { DoodleBackground } from '@/components/shared/doodle-background';

export default function DashboardPage() {
  const { role, userName, userEmail, user } = useRole();

  if (role === 'admin') return <AdminDashboard />;
  if (role === 'garage') return <GarageDashboard garageId={user?.id || 'gar-1'} />;
  if (role === 'mechanic') return <MechanicDashboard mechanicName={user?.name || userName || 'Jordan Reyes'} />;
  return (
    <CustomerDashboard
      userName={user?.name || userName || 'User'}
      userId={user?.id || ''}
      userEmail={userEmail || user?.email || ''}
    />
  );
}

function CustomerDashboard({ userName, userId, userEmail }: { userName: string; userId: string; userEmail?: string }) {
  const { user } = useRole();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const activeName = user?.name || userName || 'User';

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (!userId) return;
      try {
        const [v, r, b] = await Promise.all([
          getVehicles(userId).catch(() => []),
          getRequests(userId).catch(() => []),
          getBookings(userId).catch(() => []),
        ]);
        if (isMounted) {
          setVehicles(v || []);
          setRequests(r || []);
          setBookings(b || []);
        }
      } catch (e) {
        console.error('Customer dashboard load error:', e);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  const activeBookings = bookings.filter(
    (b) => b.status !== 'completed' && b.status !== 'cancelled'
  );
  const openRequests = requests.filter((r) => r.status === 'open' || r.status === 'quoted');
  const urgentReminders = vehicles.flatMap((v) => v.reminders || []).filter(
    (r) => r.severity === 'urgent' || r.severity === 'warning'
  );

  const firstName = activeName.trim().split(' ')[0] || 'User';

  return (
    <div className="relative space-y-8 font-sans overflow-hidden">
      <DoodleBackground />
      <div className="relative z-10 space-y-8">
        <PageHeader
          title={`Welcome back, ${firstName}`}
          description="Here's a real-time summary of your vehicle diagnostics, service history, and active bookings."
          showBackButton={false}
        />

      {/* SaasAble Stat Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Registered Vehicles" value={vehicles.length} icon={Car} />
        <StatCard label="Open Requests" value={openRequests.length} icon={ClipboardList} accent />
        <StatCard label="Active Bookings" value={activeBookings.length} icon={CalendarCheck} />
        <StatCard label="Completed Repairs" value={bookings.filter((b) => b.status === 'completed').length} icon={CheckCircle2} />
      </div>

      {/* Urgent Reminders Alert Banner */}
      {urgentReminders.length > 0 && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 dark:bg-amber-950/20 dark:border-amber-800 p-5 shadow-sm">
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div>
            <p className="font-display font-semibold text-slate-900 dark:text-slate-100 text-sm tracking-tight">Maintenance Reminders Due</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              You have {urgentReminders.length} scheduled maintenance task(s) requiring attention.
            </p>
            <div className="mt-2 space-y-1">
              {urgentReminders.slice(0, 2).map((r) => (
                <p key={r.id} className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  • {r.title} ({r.daysUntil < 0 ? 'Expired' : `Due in ${r.daysUntil} days`})
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Vehicles & Active Requests */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Vehicles Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">Vehicle Vault Overview</h2>
            <Button variant="link" size="sm" asChild className="text-[#606BDF] hover:text-[#4F59C3] font-display text-xs font-semibold">
              <Link href="/vehicles">View All ({vehicles.length})</Link>
            </Button>
          </div>

          <div className="space-y-3">
            {vehicles.map((v) => (
              <Link
                key={v.id}
                href={`/vehicles/${v.id}`}
                className="saasable-card flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-[#606BDF]/40 transition-all shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#606BDF]/10 text-[#606BDF]">
                    <Car className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-slate-900 dark:text-slate-100 text-sm">{v.make} {v.model} ({v.year})</p>
                    <p className="text-xs text-slate-500 font-mono">{v.plate}</p>
                  </div>
                </div>
              </Link>
            ))}
            {vehicles.length === 0 && (
              <p className="py-8 text-center text-sm text-slate-500 saasable-card rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6">
                No registered vehicles in vault yet.
              </p>
            )}
          </div>
        </div>

        {/* Requests & Bookings Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">Active Repair Requests</h2>
            <Button variant="link" size="sm" asChild className="text-[#606BDF] hover:text-[#4F59C3] font-display text-xs font-semibold">
              <Link href="/requests">View Requests</Link>
            </Button>
          </div>

          <div className="space-y-3">
            {requests.map((r) => (
              <Link
                key={r.id}
                href={`/requests/${r.id}`}
                className="saasable-card flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-[#606BDF]/40 transition-all shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#606BDF]/10 text-[#606BDF]">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-slate-900 dark:text-slate-100 text-sm">{r.title}</p>
                    <p className="text-xs text-slate-500">
                      {r.vehicleName} • {r.quotes && r.quotes.length > 0 ? (
                        <span className="font-semibold text-[#606BDF]">
                          {r.quotes.length} {r.quotes.length === 1 ? 'Bid' : 'Bids'} (Lowest: ${Math.min(...r.quotes.map(q => Number(q.price || 0))).toFixed(2)})
                        </span>
                      ) : (
                        '0 Bids Received'
                      )}
                    </p>
                  </div>
                </div>
                <StatusBadge status={r.status} />
              </Link>
            ))}
            {requests.length === 0 && (
              <p className="py-8 text-center text-sm text-slate-500 saasable-card rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6">
                No active repair requests posted.
              </p>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalGarages: 0,
    totalMechanics: 0,
    activeBookings: 0,
    completedBookings: 0,
    revenueThisMonth: 0,
    pendingVerifications: 0,
    totalBookings: 0,
    userGrowth: [],
    revenueData: [],
  });

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const s = await getAdminStats().catch(() => null);
        if (isMounted && s) setStats(s);
      } catch (e) {
        console.error('Admin stats load error:', e);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="relative space-y-8 font-sans overflow-hidden">
      <DoodleBackground />
      <div className="relative z-10 space-y-8">
        <PageHeader
          title="System Administration & Platform Command"
          description="Global platform analytics, verification queues, and dispute mediation center."
          showBackButton={false}
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Registered Users" value={stats.totalUsers} icon={Users} />
          <StatCard label="Verified Garages" value={stats.totalGarages} icon={Store} />
          <StatCard label="Active Service Bookings" value={stats.activeBookings} icon={TrendingUp} accent />
          <StatCard label="Pending Verifications" value={stats.pendingVerifications} icon={ShieldCheck} />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/admin/verifications" className="saasable-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-[#606BDF]/50 transition-all space-y-2 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#606BDF]/10 text-[#606BDF]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-slate-100">Garage & Mechanic Verifications</h3>
            <p className="text-xs text-slate-500">Review submitted ASE certifications and business licenses.</p>
          </Link>
          <Link href="/admin/garages" className="saasable-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-[#606BDF]/50 transition-all space-y-2 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#606BDF]/10 text-[#606BDF]">
              <Store className="h-5 w-5" />
            </div>
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-slate-100">Manage Garages & Mechanics</h3>
            <p className="text-xs text-slate-500">Inspect operational statuses, ratings, and account permissions.</p>
          </Link>
          <Link href="/admin/users" className="saasable-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-[#606BDF]/50 transition-all space-y-2 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#606BDF]/10 text-[#606BDF]">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-slate-100">Platform User Management</h3>
            <p className="text-xs text-slate-500">Inspect customer profiles and toggle account statuses.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

function GarageDashboard({ garageId }: { garageId: string }) {
  const { user } = useRole();
  const [analytics, setAnalytics] = useState<GarageAnalytics>({
    monthlyRevenue: [],
    bookingsByStatus: [],
    totalRevenue: 0,
    totalBookings: 0,
    completedBookings: 0,
    averageRating: 5.0,
  });
  const [openRequests, setOpenRequests] = useState<ServiceRequest[]>([]);
  const [activeBookings, setActiveBookings] = useState<Booking[]>([]);
  const [pendingApps, setPendingApps] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const ownerId = user?.id || garageId || 'user-garage-1';
      try {
        const [a, r, b, appRes] = await Promise.all([
          getGarageAnalytics(garageId).catch(() => null),
          getOpenRequestsNearby(garageId).catch(() => []),
          getBookingsByGarage(garageId).catch(() => []),
          fetch(`/api/garage-owner/applications?ownerId=${encodeURIComponent(ownerId)}`)
            .then((res) => res.json())
            .catch(() => ({ success: false })),
        ]);

        if (isMounted) {
          if (a) setAnalytics(a);
          if (r) setOpenRequests(r);
          if (b) setActiveBookings(b.filter((job) => job.status !== 'completed' && job.status !== 'cancelled'));
          if (appRes && appRes.success && Array.isArray(appRes.data)) {
            setPendingApps(appRes.data);
          }
        }
      } catch (e) {
        console.error('Garage dashboard load error:', e);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [garageId, user?.id]);

  return (
    <div className="relative space-y-8 font-sans overflow-hidden">
      <DoodleBackground />
      <div className="relative z-10 space-y-8">
        <PageHeader
          title="Garage Operations & Repair Hub"
          description="Monitor active shop jobs, submit competitive quotes, and manage service bookings."
          showBackButton={false}
        />

      {pendingApps.length > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-indigo-200 bg-indigo-50/80 dark:bg-indigo-950/20 dark:border-indigo-800 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-[#606BDF] shrink-0" />
            <div>
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-slate-100">
                {pendingApps.length} Pending Mechanic {pendingApps.length === 1 ? 'Application' : 'Applications'} Awaiting Review
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Certified mechanics have submitted trade credentials to join your shop. Inspect documents and accept staff.
              </p>
            </div>
          </div>
          <Button asChild className="bg-[#606BDF] hover:bg-[#4F59C3] text-white font-semibold text-xs rounded-full h-10 px-5">
            <Link href="/garage/applications">Review Applications ({pendingApps.length})</Link>
          </Button>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Open Repair Requests" value={openRequests.length} icon={ClipboardList} accent />
        <StatCard label="Active Shop Jobs" value={activeBookings.length} icon={Wrench} />
        <StatCard label="Completed Repairs" value={analytics.completedBookings} icon={CheckCircle2} />
        <StatCard label="Average Rating" value={`${analytics.averageRating} ★`} icon={TrendingUp} />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">Open Customer Requests</h2>
            <Button variant="link" size="sm" asChild className="text-[#606BDF] hover:text-[#4F59C3] font-display text-xs font-semibold">
              <Link href="/garage/requests">View All</Link>
            </Button>
          </div>
          <div className="space-y-3">
            {openRequests.slice(0, 4).map((r) => (
              <Link
                key={r.id}
                href={`/garage/requests/${r.id}`}
                className="saasable-card flex items-center gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-[#606BDF]/40 transition-all shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#606BDF]/10 text-[#606BDF]">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate font-display text-sm font-semibold text-slate-900 dark:text-slate-100">{r.title}</p>
                  <p className="text-xs text-slate-500">{r.category} • {r.vehicleName}</p>
                </div>
                <StatusBadge status={r.status} />
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">Active Shop Bookings</h2>
            <Button variant="link" size="sm" asChild className="text-[#606BDF] hover:text-[#4F59C3] font-display text-xs font-semibold">
              <Link href="/garage/bookings">Manage Jobs</Link>
            </Button>
          </div>
          <div className="space-y-3">
            {activeBookings.map((b) => (
              <Link
                key={b.id}
                href={`/garage/bookings/${b.id}`}
                className="saasable-card flex items-center gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-[#606BDF]/40 transition-all shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#606BDF]/10 text-[#606BDF]">
                  <Wrench className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate font-display text-sm font-semibold text-slate-900 dark:text-slate-100">{b.serviceTitle}</p>
                  <p className="text-xs text-slate-500">{b.customerName} • {b.vehicleName}</p>
                </div>
                <StatusBadge status={b.status} />
              </Link>
            ))}
            {activeBookings.length === 0 && (
              <p className="py-8 text-center text-sm text-slate-500 saasable-card rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6">
                No active bookings in progress.
              </p>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8 font-sans">
      <div className="h-20 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-[#80px] animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800" />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800" />
    </div>
  );
}
