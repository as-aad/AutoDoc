'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Wrench, CalendarCheck } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { EmptyState } from '@/components/shared/empty-state';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRole } from '@/lib/role-context';
import { getBookingsByGarage } from '@/services';
import type { Booking } from '@/lib/types';

export default function GarageBookingsPage() {
  const { user } = useRole();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('active');

  const targetGarageId = user?.id || 'user-garage-1';

  useEffect(() => {
    (async () => {
      setLoading(true);
      const b = await getBookingsByGarage(targetGarageId);
      setBookings(b);
      setLoading(false);
    })();
  }, [targetGarageId]);

  if (loading) return <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-20 animate-pulse rounded-xl bg-secondary" />)}</div>;

  const filtered = filter === 'all'
    ? bookings
    : filter === 'active'
    ? bookings.filter((b) => b.status !== 'completed' && b.status !== 'cancelled')
    : filter === 'completed'
    ? bookings.filter((b) => b.status === 'completed')
    : bookings.filter((b) => b.status === filter);

  return (
    <div className="space-y-8 font-hydro-body">
      <PageHeader title="Garage Bookings Hub" description="Manage all active repair bookings and completed jobs assigned to your garage shop." />

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="bg-secondary/40 p-1 rounded-xl">
          <TabsTrigger value="active" className="rounded-lg font-bold text-xs">Active Jobs</TabsTrigger>
          <TabsTrigger value="completed" className="rounded-lg font-bold text-xs">Completed</TabsTrigger>
          <TabsTrigger value="all" className="rounded-lg font-bold text-xs">All Jobs</TabsTrigger>
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title="No Bookings Found in Database"
          description="Service bookings will appear here automatically when customer quotes are accepted."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => (
            <Link
              key={b.id}
              href={`/garage/bookings/${b.id}`}
              className="hydro-card-surface flex items-center justify-between p-4.5 rounded-2xl border border-border hover:border-[#FF5500]/40 transition-all shadow-sm"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FF5500]/10 text-[#FF5500]">
                  <Wrench className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-hydro-display text-base font-bold text-foreground">{b.serviceTitle}</p>
                  <p className="text-xs text-muted-foreground">{b.customerName} — {b.vehicleName}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="hidden text-right sm:block font-mono">
                  <p className="text-[10px] text-muted-foreground uppercase">Quoted Price</p>
                  <p className="font-hydro-display font-bold text-[#FF5500] text-base">${b.price}</p>
                </div>
                <StatusBadge status={b.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
