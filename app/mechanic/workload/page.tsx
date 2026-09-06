'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Wrench, Star, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { EmptyState } from '@/components/shared/empty-state';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getBookingsByMechanic } from '@/services';
import type { Booking } from '@/lib/types';

import { useRole } from '@/lib/role-context';

import { DoodleBackground } from '@/components/shared/doodle-background';

export default function MechanicWorkloadPage() {
  const { user, userName } = useRole();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('active');

  const activeMechanicId = user?.id || user?.name || userName || 'Jordan Reyes';

  useEffect(() => {
    (async () => {
      setLoading(true);
      const b = await getBookingsByMechanic(activeMechanicId);
      setBookings(b);
      setLoading(false);
    })();
  }, [activeMechanicId]);

  if (loading) return <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-20 animate-pulse rounded-2xl bg-card border border-border" />)}</div>;

  const filtered = filter === 'all'
    ? bookings
    : filter === 'active'
    ? bookings.filter((b) => b.status !== 'completed' && b.status !== 'cancelled')
    : bookings.filter((b) => b.status === filter);

  return (
    <div className="relative space-y-8 font-sans overflow-hidden">
      <DoodleBackground />
      <div className="relative z-10 space-y-8">
        <PageHeader
          title="Mechanic Workload & Assigned Jobs"
          description="Review assigned repair tasks, record repair stage progress, and upload before/after photos."
          backHref="/dashboard"
      />

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="border-b border-slate-200 dark:border-slate-800 bg-transparent p-0 rounded-none h-auto gap-2">
          <TabsTrigger
            value="active"
            className="data-[state=active]:border-[#606BDF] data-[state=active]:text-[#606BDF] border-b-2 border-transparent rounded-none px-4 py-2.5 font-display font-semibold text-xs"
          >
            Active Jobs ({bookings.filter((b) => b.status !== 'completed' && b.status !== 'cancelled').length})
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="data-[state=active]:border-[#606BDF] data-[state=active]:text-[#606BDF] border-b-2 border-transparent rounded-none px-4 py-2.5 font-display font-semibold text-xs"
          >
            Completed Repairs ({bookings.filter((b) => b.status === 'completed').length})
          </TabsTrigger>
          <TabsTrigger
            value="all"
            className="data-[state=active]:border-[#606BDF] data-[state=active]:text-[#606BDF] border-b-2 border-transparent rounded-none px-4 py-2.5 font-display font-semibold text-xs"
          >
            All History ({bookings.length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No Jobs Assigned"
          description="Assigned repair tasks will appear here when garage managers allocate new service bookings."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => (
            <Link
              key={b.id}
              href={`/mechanic/workload/${b.id}`}
              className="saasable-card flex items-center gap-4 p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-[#606BDF]/40 transition-all shadow-sm"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#606BDF]/10 text-[#606BDF]">
                <Wrench className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate font-display text-base font-bold text-slate-900 dark:text-slate-100">{b.serviceTitle}</p>
                <p className="text-xs text-slate-500">{b.customerName} • {b.vehicleName}</p>
              </div>
              <StatusBadge status={b.status} />
            </Link>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
