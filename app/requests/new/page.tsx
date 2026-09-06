'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MapPin, AlertTriangle, Wrench } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { PhotoUpload } from '@/components/shared/photo-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useRole } from '@/lib/role-context';
import { getVehicles, createRequest } from '@/services';
import { SERVICE_CATEGORIES } from '@/lib/constants';
import type { Vehicle } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function NewRequestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedVehicle = searchParams.get('vehicle');
  const { user } = useRole();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [form, setForm] = useState({
    vehicleId: preselectedVehicle || '',
    title: '',
    description: '',
    category: '',
    location: 'San Francisco, CA',
    urgency: 'medium' as 'low' | 'medium' | 'high',
  });

  useEffect(() => {
    (async () => {
      const ownerId = user?.id || 'user-customer-1';
      const v = await getVehicles(ownerId);
      setVehicles(v);
      if (preselectedVehicle) setForm((f) => ({ ...f, vehicleId: preselectedVehicle }));
      else if (v.length > 0) setForm((f) => ({ ...f, vehicleId: v[0].id }));
      setLoading(false);
    })();
  }, [preselectedVehicle, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.vehicleId || !form.title || !form.category) return;

    setSaving(true);
    const vehicle = vehicles.find((v) => v.id === form.vehicleId);
    // Bug fix: use the actual user id from session (normalized to 'user-customer-1' by service layer)
    const ownerId = user?.id || 'user-customer-1';
    const ownerName = user?.name || 'Customer';

    await createRequest({
      vehicleId: form.vehicleId,
      vehicleName: vehicle ? `${vehicle.make} ${vehicle.model} (${vehicle.year})` : 'Vehicle',
      ownerId,
      ownerName,
      title: form.title,
      description: form.description,
      category: form.category,
      location: form.location,
      urgency: form.urgency,
      photos,
    });

    setSaving(false);
    router.push('/requests');
  };

  if (loading) return <div className="h-96 animate-pulse rounded-2xl bg-card border border-border" />;

  return (
    <div className="space-y-8 font-hydro-body">
      {/* Exactly ONE Back button embedded in PageHeader pointing back to portal dashboard */}
      <PageHeader
        title="Post a Repair Request"
        description="Describe your vehicle's issue and broadcast details to receive competitive quotes from verified garages."
        backHref="/dashboard"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="hydro-card-surface p-6 sm:p-8 rounded-2xl border border-border space-y-5">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF5500]/10 text-[#FF5500]">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-hydro-display font-bold text-lg">Vehicle & Repair Category</h2>
              <p className="text-xs text-muted-foreground">Select your registered vehicle and repair service type.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="vehicle" className="text-xs font-bold uppercase tracking-wider">Select Registered Vehicle</Label>
              <Select value={form.vehicleId} onValueChange={(v) => setForm({ ...form, vehicleId: v })}>
                <SelectTrigger id="vehicle" className="rounded-xl h-11">
                  <SelectValue placeholder="Choose a vehicle from your vault" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.make} {v.model} ({v.year}) — {v.plate}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="category" className="text-xs font-bold uppercase tracking-wider">Service Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger id="category" className="rounded-xl h-11">
                  <SelectValue placeholder="Select repair service category" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider">Issue Summary Title</Label>
              <Input
                id="title"
                placeholder="e.g. Grinding noise when applying front brakes or check engine light"
                className="rounded-xl h-11"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider">Detailed Issue Description</Label>
              <Textarea
                id="description"
                placeholder="Provide detailed symptoms — when it occurs, warning lights, unusual sounds, or recent parts replaced..."
                rows={4}
                className="rounded-xl"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="location" className="text-xs font-bold uppercase tracking-wider">Vehicle Drop-off / Pickup Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#FF5500]" />
                <Input
                  id="location"
                  placeholder="e.g. San Francisco, CA"
                  className="pl-10 rounded-xl h-11"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Label className="text-xs font-bold uppercase tracking-wider">Urgency Level & Priority</Label>
              <RadioGroup
                value={form.urgency}
                onValueChange={(v) => setForm({ ...form, urgency: v as 'low' | 'medium' | 'high' })}
                className="grid gap-3 sm:grid-cols-3"
              >
                {[
                  { value: 'low', label: 'Low — Flexible timing' },
                  { value: 'medium', label: 'Medium — Within 1 week' },
                  { value: 'high', label: 'High — Emergency breakdown' },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={cn(
                      'flex cursor-pointer items-center gap-2.5 rounded-xl border p-3.5 text-xs font-hydro-display font-bold transition-all',
                      form.urgency === opt.value
                        ? 'border-[#FF5500] bg-[#FF5500]/10 text-[#FF5500] shadow-sm'
                        : 'border-border text-muted-foreground hover:border-[#FF5500]/40'
                    )}
                  >
                    <RadioGroupItem value={opt.value} />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </RadioGroup>
            </div>
          </div>
        </div>

        {/* Photos Card */}
        <div className="hydro-card-surface p-6 rounded-2xl border border-border space-y-4">
          <h2 className="font-hydro-display font-bold text-base">Attach Diagnostic Photos / Videos</h2>
          <PhotoUpload
            label="Upload photos of dashboard lights, damaged parts, or fluid leaks (Recommended)"
            multiple
            onChange={setPhotos}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button type="button" variant="outline" asChild className="rounded-full px-6">
            <Link href="/dashboard">Cancel</Link>
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="bg-[#FF5500] hover:bg-[#FF7700] text-white font-hydro-display font-bold uppercase text-xs tracking-wider px-8 py-3 rounded-full shadow-lg"
          >
            {saving ? 'Transmitting Request...' : 'Post Repair Request'}
          </Button>
        </div>
      </form>
    </div>
  );
}
