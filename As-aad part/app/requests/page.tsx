'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ClipboardList, Car, MapPin, Tag, ChevronRight } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRole } from '@/lib/role-context';
import { getRequests } from '@/services';
import type { ServiceRequest } from '@/lib/types';

import { DoodleBackground } from '@/components/shared/doodle-background';

export default function RequestsPage() {
  const { user } = useRole();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    (async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      const r = await getRequests(user.id);
      setRequests(r);
      setLoading(false);
    })();
  }, [user]);

  if (loading) return <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-32 animate-pulse rounded-2xl bg-card border border-border" />)}</div>;

  const filteredRequests = filter === 'all'
    ? requests
    : filter === 'active'
    ? requests.filter((r) => r.status === 'open' || r.status === 'quoted')
    : requests.filter((r) => r.status === 'booked' || r.status === 'closed');

  return (
    <div className="relative space-y-8 font-sans overflow-hidden">
      <DoodleBackground />
      <div className="relative z-10 space-y-8">
        <PageHeader
          title="Service Requests & Quotation Matrix"
          description="Track your active vehicle repair requests, compare garage quotes, and manage service bookings."
        />

      {/* Enlarged Tabs Filter Bar Container */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-1">
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="bg-transparent p-0 rounded-none h-auto gap-4 sm:gap-6">
            <TabsTrigger
              value="all"
              className="data-[state=active]:border-[#606BDF] data-[state=active]:text-[#606BDF] border-b-2 border-transparent rounded-none px-4 py-3 font-display font-semibold text-xs tracking-wider transition-all"
            >
              All Requests ({requests.length})
            </TabsTrigger>
            <TabsTrigger
              value="active"
              className="data-[state=active]:border-[#606BDF] data-[state=active]:text-[#606BDF] border-b-2 border-transparent rounded-none px-4 py-3 font-display font-semibold text-xs tracking-wider transition-all"
            >
              Open Requests & Bids ({requests.filter((r) => r.status === 'open' || r.status === 'quoted').length})
            </TabsTrigger>
            <TabsTrigger
              value="booked"
              className="data-[state=active]:border-[#606BDF] data-[state=active]:text-[#606BDF] border-b-2 border-transparent rounded-none px-4 py-3 font-display font-semibold text-xs tracking-wider transition-all"
            >
              Booked / Closed ({requests.filter((r) => r.status === 'booked' || r.status === 'closed').length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {filteredRequests.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No Repair Requests Found"
          description="Your active vehicle repair requests and received garage bids will appear here."
        />
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((r) => (
            <Link key={r.id} href={`/requests/${r.id}`}>
              <div className="saasable-card group relative flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-[#606BDF]/50 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer">
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#606BDF]/10 text-[#606BDF] border border-[#606BDF]/20 shadow-inner group-hover:scale-105 transition-transform duration-300">
                    <Car className="h-6 w-6" />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h2 className="font-display text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#606BDF] transition-colors">
                        {r.title}
                      </h2>
                      {r.urgency === 'high' && (
                        <span className="rounded-full bg-rose-500 text-white font-semibold text-[10px] uppercase tracking-wider px-2.5 py-0.5 shadow-sm">
                          Emergency Breakdown
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
                        {r.vehicleName}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Tag className="h-3.5 w-3.5 text-[#606BDF]" /> {r.category}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-mono">
                        <MapPin className="h-3.5 w-3.5 text-[#606BDF]" /> {r.location}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-800">
                  <div className="text-left sm:text-right space-y-0.5">
                    {r.category === 'Warranty Claim' || r.title?.includes('[WARRANTY CLAIM]') ? (
                      <>
                        <p className="text-[10px] font-display uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
                          Warranty Coverage
                        </p>
                        <p className="font-display text-base font-bold text-emerald-600 dark:text-emerald-400">
                          $0.00 (Covered)
                        </p>
                        <p className="text-[10px] text-slate-500 font-mono">
                          Direct Active Job
                        </p>
                      </>
                    ) : r.quotes && r.quotes.length > 0 ? (
                      <>
                        <p className="text-[10px] font-display uppercase tracking-widest text-slate-500 font-semibold">
                          Lowest Quoted Price
                        </p>
                        <p className="font-display text-xl font-bold text-[#606BDF]">
                          ${Math.min(...r.quotes.map((q) => Number(q.price || 0))).toFixed(2)}
                        </p>
                        <p className="text-[10px] text-slate-500 font-mono">
                          {r.quotes.length} {r.quotes.length === 1 ? 'Garage Bid' : 'Garage Bids'}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-[10px] font-display uppercase tracking-widest text-slate-500 font-semibold">
                          Received Bids
                        </p>
                        <p className="font-display text-xs font-semibold text-slate-500">
                          Awaiting Garage Bids
                        </p>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge status={r.category === 'Warranty Claim' || r.title?.includes('[WARRANTY CLAIM]') ? 'booked' : r.status} />
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-[#606BDF] group-hover:text-white transition-all duration-300 shadow-sm">
                      <ChevronRight className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
