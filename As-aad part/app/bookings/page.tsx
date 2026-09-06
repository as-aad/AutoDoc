'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CalendarCheck, Wrench, ShieldCheck } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { EmptyState } from '@/components/shared/empty-state';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRole } from '@/lib/role-context';
import { getBookings } from '@/services';
import type { Booking } from '@/lib/types';
import { cn } from '@/lib/utils';

const FILTERS: { value: string; label: string }[] = [
  { value: 'all', label: 'All Jobs' },
  { value: 'pending', label: 'Pending' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

import { DoodleBackground } from '@/components/shared/doodle-background';

export default function BookingsPage() {
  const { user } = useRole();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    (async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      const b = await getBookings(user.id);
      setBookings(b);
      setLoading(false);
    })();
  }, [user]);

  if (loading) return <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-20 animate-pulse rounded-2xl bg-card border border-border" />)}</div>;

  const filtered = filter === 'all'
    ? bookings
    : bookings.filter((b) => b.status === filter);

  return (
    <div className="relative space-y-8 font-sans overflow-hidden">
      <DoodleBackground />
      <div className="relative z-10 space-y-8">
        <PageHeader title="Service Bookings & Active Repairs" description="Track live repair progress, message assigned mechanics, and view digital invoices." />

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="flex-wrap border-b border-slate-200 dark:border-slate-800 bg-transparent p-0 rounded-none h-auto gap-2">
          {FILTERS.map((f) => (
            <TabsTrigger
              key={f.value}
              value={f.value}
              className="data-[state=active]:border-[#606BDF] data-[state=active]:text-[#606BDF] border-b-2 border-transparent rounded-none px-4 py-2.5 font-display font-semibold text-xs"
            >
              {f.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title="No Active Bookings"
          description="Bookings will appear here once you accept a quotation bid from a verified garage partner."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => (
            <Link
              key={b.id}
              href={`/bookings/${b.id}`}
              className="saasable-card flex items-center gap-4 p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-[#606BDF]/40 transition-all shadow-sm"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#606BDF]/10 text-[#606BDF]">
                <Wrench className="h-5 w-5" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="truncate font-display text-base font-bold text-slate-900 dark:text-slate-100">{b.serviceTitle}</p>
                <p className="text-xs text-slate-500">{b.garageName} • {b.vehicleName}</p>
              </div>

              <div className="hidden text-right sm:block">
                <p className="text-[10px] font-display uppercase tracking-wider text-slate-500 font-semibold">Booked Cost</p>
                <p className="font-display text-base font-bold text-[#606BDF]">${b.price}</p>
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
