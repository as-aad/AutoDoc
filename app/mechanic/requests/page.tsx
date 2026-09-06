'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ClipboardList, Car } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { EmptyState } from '@/components/shared/empty-state';
import { getOpenRequestsNearby } from '@/services';
import type { ServiceRequest } from '@/lib/types';

export default function MechanicRequestsPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const r = await getOpenRequestsNearby('garage-1');
      setRequests(r);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-24 animate-pulse rounded-xl bg-secondary" />)}</div>;

  return (
    <div className="space-y-8">
      <PageHeader title="Open Requests" description="Browse repair requests and submit quotes on behalf of your garage." />

      {requests.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No open requests"
          description="New repair requests will appear here."
        />
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
            <Link
              key={r.id}
              href={`/garage/requests/${r.id}`}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-accent/40"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-secondary">
                <Car className="h-5 w-5 text-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate font-display text-sm font-bold">{r.title}</p>
                <p className="text-caption">{r.vehicleName} — {r.category}</p>
              </div>
              <StatusBadge status={r.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
