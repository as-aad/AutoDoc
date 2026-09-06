'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Wrench,
  CheckCircle2,
  Star,
  Building2,
  Clock,
} from 'lucide-react';
import { useRole } from '@/lib/role-context';
import { StatCard } from '@/components/shared/stat-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { StarRating } from '@/components/shared/star-rating';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { getBookingsByMechanic } from '@/services';
import type { Booking, Review } from '@/lib/types';

export function MechanicDashboard({ mechanicName }: { mechanicName: string }) {
  const { user, userName } = useRole();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [mechanicProfile, setMechanicProfile] = useState<any | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  const activeName = user?.name || userName || mechanicName || 'Jordan Reyes';
  const firstName = activeName.trim().split(' ')[0] || 'Mechanic';

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const queryId = user?.id || activeName;
        const b = await getBookingsByMechanic(queryId).catch(() => []);
        if (isMounted && b) setBookings(b);

        if (user?.id) {
          const res = await fetch(`/api/mechanics/me?userId=${encodeURIComponent(user.id)}`).catch(() => null);
          if (res) {
            const data = await res.json().catch(() => null);
            if (isMounted && data && data.success && data.data) {
              setMechanicProfile(data.data);
              if (data.data.garageId) {
                const revRes = await fetch(`/api/reviews?garageId=${encodeURIComponent(data.data.garageId)}`).catch(() => null);
                if (revRes) {
                  const revData = await revRes.json().catch(() => null);
                  if (isMounted && revData && revData.success && revData.data?.reviews) {
                    setReviews(revData.data.reviews);
                  }
                }
              }
            }
          }
        }
      } catch (e) {
        console.error('Error loading mechanic dashboard data:', e);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [mechanicName, user?.id, activeName]);

  const active = bookings.filter((b) => b.status === 'accepted' || b.status === 'in_progress');
  const completed = bookings.filter((b) => b.status === 'completed' || b.status === 'customer_approved');

  const ratingVal = mechanicProfile?.rating
    ? Number(mechanicProfile.rating)
    : (reviews.length > 0 ? (reviews.reduce((acc, r) => acc + (r.mechanicRating || r.garageRating || 0), 0) / reviews.length) : 0);

  const garageStatusText = mechanicProfile?.garageName
    ? (mechanicProfile.applicationStatus === 'ACCEPTED' ? mechanicProfile.garageName : `${mechanicProfile.garageName} (Pending)`)
    : 'Independent Staff';

  return (
    <div className="space-y-8 font-hydro-body">
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description="Here's a real-time summary of your assigned repair jobs, customer reviews, and shop affiliation status."
        showBackButton={false}
      />

      {/* Hydroflow Stat Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Assigned Jobs" value={active.length} icon={Wrench} accent />
        <StatCard label="Completed Repairs" value={completed.length} icon={CheckCircle2} />
        <StatCard label="Customer Rating" value={`${ratingVal > 0 ? ratingVal.toFixed(1) : '0'} ★`} icon={Star} />
        <StatCard label="Garage Affiliation" value={garageStatusText} icon={Building2} />
      </div>

      {/* Dynamic Mechanic Alert Banner */}
      {mechanicProfile?.applicationStatus === 'PENDING' && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 shrink-0 text-amber-500" />
            <div>
              <p className="font-hydro-display font-bold text-foreground text-sm uppercase tracking-wider">Garage Application Under Review</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Your application to join <span className="font-bold text-foreground">{mechanicProfile.garageName}</span> as a {mechanicProfile.specialization || 'Mechanic'} is pending review by the shop owner.
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild className="rounded-xl font-bold border-amber-500/40 text-amber-500 hover:bg-amber-500/10 shrink-0">
            <Link href="/profile">View Status →</Link>
          </Button>
        </div>
      )}

      {/* Main Grid: Assigned Workload Queue & Customer Reviews */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Work Queue Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-hydro-display text-lg font-bold">Assigned Workload Queue</h2>
            <Button variant="link" size="sm" asChild className="text-[#FF5500] font-hydro-display text-xs font-bold uppercase">
              <Link href="/mechanic/workload">Open Workspace ({active.length})</Link>
            </Button>
          </div>

          <div className="space-y-3">
            {active.map((b) => (
              <Link
                key={b.id}
                href="/mechanic/workload"
                className="hydro-card-surface flex items-center gap-4 p-4 rounded-2xl border border-border hover:border-[#FF5500]/40 transition-all"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF5500]/10 text-[#FF5500]">
                  <Wrench className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate font-hydro-display text-sm font-bold">{b.serviceTitle || b.serviceType}</p>
                  <p className="text-xs text-muted-foreground">{b.customerName} • {b.vehicleName}</p>
                </div>
                <StatusBadge status={b.status} />
              </Link>
            ))}
            {active.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground hydro-card-surface rounded-2xl border border-border p-6">
                No active repair jobs assigned to your queue currently.
              </p>
            )}
          </div>
        </div>

        {/* Customer Reviews Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-hydro-display text-lg font-bold">Customer Work Reviews</h2>
            <Button variant="link" size="sm" asChild className="text-[#FF5500] font-hydro-display text-xs font-bold uppercase">
              <Link href="/profile">View Profile</Link>
            </Button>
          </div>

          <div className="space-y-3">
            {reviews.length > 0 ? (
              reviews.slice(0, 4).map((r) => (
                <div key={r.id} className="hydro-card-surface p-4 rounded-2xl border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-sm text-foreground font-hydro-display">{r.customerName || 'Customer'}</p>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>
                  <StarRating rating={r.mechanicRating || r.garageRating || 5} size="sm" showValue />
                  {r.comment && (
                    <p className="text-xs text-foreground font-medium italic mt-1 bg-secondary/30 p-2.5 rounded-xl border border-border/50">
                      "{r.comment}"
                    </p>
                  )}
                  {r.garageName && (
                    <p className="text-[11px] text-muted-foreground">
                      Shop: <span className="font-bold text-foreground">{r.garageName}</span>
                    </p>
                  )}
                </div>
              ))
            ) : completed.length > 0 ? (
              completed.slice(0, 4).map((b) => (
                <div key={b.id} className="hydro-card-surface p-4 rounded-2xl border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-sm text-foreground font-hydro-display">{b.customerName || 'Customer'}</p>
                    <span className="text-[11px] text-muted-foreground font-mono">{b.scheduledDate || 'Recent'}</span>
                  </div>
                  <StarRating rating={ratingVal} size="sm" showValue />
                  <p className="text-xs text-muted-foreground">
                    Verified Completed Service: <span className="font-bold text-foreground">{b.serviceTitle || b.serviceType}</span> on {b.vehicleName}
                  </p>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground hydro-card-surface rounded-2xl border border-border p-6">
                No customer repair reviews submitted yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
