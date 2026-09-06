'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ClipboardList, Car, MapPin, Clock } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { EmptyState } from '@/components/shared/empty-state';
import { useRole } from '@/lib/role-context';
import { getOpenRequestsNearby } from '@/services';
import type { ServiceRequest } from '@/lib/types';

import { DoodleBackground } from '@/components/shared/doodle-background';

export default function GarageRequestsPage() {
  const { user } = useRole();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const targetGarageId = user?.id || 'user-garage-1';

  useEffect(() => {
    (async () => {
      setLoading(true);
      const r = await getOpenRequestsNearby(targetGarageId);
      // Filter out warranty claims as they are pre-assigned directly to active repair jobs
      const openRequests = r.filter(
        (req) => req.category !== 'Warranty Claim' && !req.title?.includes('[WARRANTY CLAIM]')
      );
      setRequests(openRequests);
      setLoading(false);
    })();
  }, [targetGarageId]);

  if (loading) return <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-card border border-border" />)}</div>;

  return (
    <div className="relative space-y-8 font-sans overflow-hidden">
      <DoodleBackground />
      <div className="relative z-10 space-y-8">
        <PageHeader
          title="Open Repair Requests & Bidding"
          description="Browse real-time repair requests from nearby vehicle owners in database. Submit price bids and ETAs to win service jobs."
          backHref="/dashboard"
        />

      {requests.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No Open Requests in Database"
          description="New repair requests posted by vehicle owners will appear here automatically."
        />
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
            <Link
              key={r.id}
              href={`/garage/requests/${r.id}`}
              className="saasable-card flex items-center gap-4 p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-[#606BDF]/40 transition-all shadow-sm"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#606BDF]/10 text-[#606BDF]">
                <Car className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate font-display text-base font-bold text-slate-900 dark:text-slate-100">{r.title}</p>
                  {r.urgency === 'high' && (
                    <span className="rounded-full bg-rose-500 text-white font-semibold text-[10px] uppercase px-2.5 py-0.5">
                      Urgent Breakdown
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-3 mt-1 font-mono">
                  <span>{r.vehicleName}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-[#606BDF]" /> {r.location}</span>
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-slate-500 font-mono">
                  {r.quotes?.length || 0} Quotes
                </span>
                <StatusBadge status={r.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
