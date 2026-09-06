'use client';

import { useState, useEffect } from 'react';
import {
  Store,
  Search,
  MapPin,
  Star,
  Check,
  UserPlus,
  CheckCircle2,
  Users,
  Wrench,
  Building2,
  UserCheck,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StatCard } from '@/components/shared/stat-card';
import { Garage, Mechanic } from '@/lib/types';

export default function AdminGaragesPage() {
  const [garages, setGarages] = useState<Garage[]>([]);
  const [mechanicProfiles, setMechanicProfiles] = useState<Mechanic[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Assign Mechanic Modal State
  const [assigningGarage, setAssigningGarage] = useState<Garage | null>(null);
  const [selectedMechanicUserId, setSelectedMechanicUserId] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [assignedSuccess, setAssignedSuccess] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [gRes, mRes] = await Promise.all([
        fetch('/api/garages').then((r) => r.json()).catch(() => ({ success: false })),
        fetch('/api/admin/mechanics').then((r) => r.json()).catch(() => ({ success: false })),
      ]);

      if (gRes.success && Array.isArray(gRes.data)) {
        setGarages(gRes.data);
      }
      if (mRes.success && Array.isArray(mRes.data)) {
        setMechanicProfiles(mRes.data);
      }
    } catch (e) {
      console.error('Failed to load network data:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignMechanic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningGarage || !selectedMechanicUserId) return;

    setAssigning(true);
    try {
      const res = await fetch('/api/admin/mechanics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mechanicUserId: selectedMechanicUserId,
          garageId: assigningGarage.id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAssignedSuccess(true);
        await fetchData();
        setTimeout(() => {
          setAssignedSuccess(false);
          setAssigningGarage(null);
          setSelectedMechanicUserId('');
        }, 1200);
      } else {
        alert(data.error || 'Failed to assign mechanic.');
      }
    } catch (err) {
      console.error('Assign error:', err);
    } finally {
      setAssigning(false);
    }
  };

  const filteredGarages = garages.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.address.toLowerCase().includes(search.toLowerCase())
  );

  const activeStaffCount = mechanicProfiles.filter((m) => m.applicationStatus === 'ACCEPTED').length;

  return (
    <div className="space-y-8 font-hydro-body">
      <PageHeader
        title="Garage & Mechanic Network Console"
        description="Inspect shop network metrics, view which mechanics are affiliated under each garage, and allocate certified staff."
        backHref="/dashboard"
      />

      {/* Network Overview Stats */}
      <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-3">
        <StatCard label="Registered Garages" value={garages.length} icon={Building2} accent />
        <StatCard label="Network Mechanics" value={mechanicProfiles.length} icon={Users} />
        <StatCard label="Active Staff Affiliations" value={activeStaffCount} icon={UserCheck} />
      </div>

      {/* Search Bar Container */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search garage name or address..."
            className="pl-10 h-11 rounded-xl text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* GARAGE CARDS WITH AFFILIATED MECHANICS */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-card border border-border animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredGarages.map((garage) => {
            // Find mechanics affiliated under this garage
            const garageMechanics = mechanicProfiles.filter(
              (m) =>
                m.garageId === garage.id ||
                m.garageId === garage.ownerId ||
                (m.garageName && m.garageName.toLowerCase() === garage.name.toLowerCase())
            );

            return (
              <div
                key={garage.id}
                className="hydro-card-surface rounded-2xl border border-border p-6 shadow-sm hover:border-[#FF5500]/40 transition-all flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  {/* Garage Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF5500]/10 text-[#FF5500]">
                        <Store className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-hydro-display font-bold text-lg">{garage.name}</h3>
                          {garage.verified && (
                            <span className="flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-500 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-mono">
                              <Check className="h-3 w-3" /> VERIFIED
                            </span>
                          )}
                        </div>
                        <p className="flex items-center text-xs text-muted-foreground mt-0.5 font-mono">
                          <MapPin className="mr-1 h-3.5 w-3.5 text-[#FF5500]" />
                          {garage.address}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center text-xs text-[#FF5500] font-bold bg-[#FF5500]/10 px-3 py-1 rounded-full border border-[#FF5500]/20 font-mono">
                      <Star className="mr-1 h-3.5 w-3.5 fill-[#FF5500]" />
                      <span>{garage.rating}</span>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-1.5">
                    {garage.specialties.map((spec, idx) => (
                      <span key={idx} className="text-[11px] bg-secondary text-foreground px-2.5 py-1 rounded-lg font-medium">
                        {spec}
                      </span>
                    ))}
                  </div>

                  {/* Affiliated Mechanics Roster Section */}
                  <div className="rounded-xl border border-border/80 bg-secondary/20 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-hydro-display uppercase tracking-wider text-foreground flex items-center gap-2">
                        <Wrench className="h-3.5 w-3.5 text-[#FF5500]" />
                        Affiliated Mechanics ({garageMechanics.length})
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {garageMechanics.length} Staff On-Site
                      </span>
                    </div>

                    {garageMechanics.length > 0 ? (
                      <div className="space-y-2">
                        {garageMechanics.map((m) => (
                          <div
                            key={m.id || m.userId}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-background border border-border/60 text-xs"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#FF5500]/10 text-[#FF5500] font-bold text-xs">
                                {(m.userName || 'Mechanic').charAt(0)}
                              </div>
                              <div className="truncate">
                                <p className="font-bold text-foreground truncate">{m.userName || 'Mechanic'}</p>
                                <p className="text-[10px] text-muted-foreground truncate">{m.specialization}</p>
                              </div>
                            </div>

                            <span
                              className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border ${
                                m.applicationStatus === 'ACCEPTED'
                                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                  : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                              }`}
                            >
                              {m.applicationStatus === 'ACCEPTED' ? 'Active Staff' : 'Pending Review'}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic py-1 text-center bg-background/50 rounded-xl p-3 border border-dashed border-border">
                        No mechanics currently assigned under this garage shop.
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Contact & Action */}
                <div className="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground font-mono">
                  <span>Phone: {garage.phone}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setAssigningGarage(garage);
                      const firstMech = mechanicProfiles[0];
                      setSelectedMechanicUserId(firstMech?.userId || firstMech?.id || '');
                    }}
                    className="text-xs border-[#FF5500]/30 text-[#FF5500] hover:bg-[#FF5500]/10 font-hydro-display font-bold rounded-xl"
                  >
                    <UserPlus className="mr-1.5 h-3.5 w-3.5" />
                    Assign Mechanic to Garage
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Assign Mechanic Modal */}
      {assigningGarage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-card border border-border p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-[#FF5500]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF5500]/10">
                <UserPlus className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-hydro-display text-xl font-bold">Assign Mechanic</h2>
                <p className="text-xs text-muted-foreground">{assigningGarage.name}</p>
              </div>
            </div>

            {assignedSuccess ? (
              <div className="py-6 text-center text-emerald-500 font-bold flex flex-col items-center gap-2">
                <CheckCircle2 className="h-8 w-8" />
                <span>Mechanic Affiliated to Garage Successfully!</span>
              </div>
            ) : (
              <form onSubmit={handleAssignMechanic} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="mechanic-select" className="text-xs font-bold uppercase tracking-wider">Select Registered Mechanic</Label>
                  <select
                    id="mechanic-select"
                    value={selectedMechanicUserId}
                    onChange={(e) => setSelectedMechanicUserId(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background p-3 text-sm font-medium focus:outline-none"
                  >
                    <option value="">-- Choose Mechanic --</option>
                    {mechanicProfiles.map((m) => (
                      <option key={m.id || m.userId} value={m.userId || m.id}>
                        {m.userName || 'Mechanic'} ({m.specialization})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                  <Button type="button" variant="outline" onClick={() => setAssigningGarage(null)} className="rounded-full px-6">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={assigning || !selectedMechanicUserId} className="bg-[#FF5500] hover:bg-[#FF7700] text-white font-hydro-display font-bold uppercase text-xs tracking-wider px-6 py-2.5 rounded-full shadow-lg">
                    {assigning ? 'Assigning...' : 'Confirm Assignment'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
