'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Car, AlertCircle } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { useRole } from '@/lib/role-context';
import { getVehicles } from '@/services';
import type { Vehicle } from '@/lib/types';

import { DoodleBackground } from '@/components/shared/doodle-background';

export default function VehiclesPage() {
  const { user } = useRole();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/vehicles?ownerId=${user.id}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setVehicles(data.data);
        }
      } catch (err) {
        console.error('Error fetching vehicles:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (loading) return <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-44 animate-pulse rounded-2xl bg-card border border-border" />)}</div>;

  return (
    <div className="relative space-y-8 font-sans overflow-hidden">
      <DoodleBackground />
      <div className="relative z-10 space-y-8">
        <PageHeader
          title="Vehicle Vault & Compliance Manager"
          description="Track registration documents, maintenance history, and post repair requests."
        >
        <Button asChild className="bg-[#606BDF] hover:bg-[#4F59C3] text-white font-semibold text-xs px-6 py-2.5 rounded-full shadow-sm">
          <Link href="/vehicles/new">
            <Plus className="mr-2 h-4 w-4" />
            Register Vehicle
          </Link>
        </Button>
      </PageHeader>

      {vehicles.length === 0 ? (
        <EmptyState
          icon={Car}
          title="No Vehicles Registered"
          description="Click the Register Vehicle button in the header above to add your vehicle to the vault."
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((v) => {
            const urgentReminders = v.reminders.filter(
              (r) => r.severity === 'urgent' || r.severity === 'warning'
            );
            return (
              <Link key={v.id} href={`/vehicles/${v.id}`}>
                <div className="saasable-card group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 transition-all hover:border-[#606BDF]/40 shadow-sm flex flex-col justify-between h-full p-5">
                  {v.imageUrl ? (
                    <div className="relative aspect-[16/10] overflow-hidden rounded-xl mb-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={v.imageUrl}
                        alt={`${v.make} ${v.model}`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : null}

                  <div className="space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">
                          {v.year} {v.make} {v.model}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">Plate: {v.plate}</p>
                    </div>

                    {urgentReminders.length > 0 && (
                      <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1.5 text-xs text-amber-600 font-semibold border border-amber-500/20">
                        <AlertCircle className="h-3.5 w-3.5" />
                        <span>{urgentReminders.length} maintenance alert(s)</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
      </div>
    </div>
  );
}
