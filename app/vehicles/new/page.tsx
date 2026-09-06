'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, FileText, Car } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { PhotoUpload } from '@/components/shared/photo-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRole } from '@/lib/role-context';
import { createVehicle } from '@/services';
import { VEHICLE_MAKES } from '@/lib/constants';

export default function RegisterVehiclePage() {
  const router = useRouter();
  const { user } = useRole();
  const [saving, setSaving] = useState(false);
  const [photo, setPhoto] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '2024',
    plate: '',
    color: 'Black',
    vin: '',
    mileage: '15000',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.make || !formData.model || !formData.plate) return;

    setSaving(true);
    const ownerId = user?.id || 'user-1';

    try {
      const res = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerId,
          make: formData.make,
          model: formData.model,
          year: parseInt(formData.year) || new Date().getFullYear(),
          plate: formData.plate,
          color: formData.color,
          vin: formData.vin,
          mileage: parseInt(formData.mileage) || 15000,
          imageUrl: photo[0] || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
        }),
      });

      const data = await res.json();
      if (!data.success) {
        alert(data.error || 'Failed to register vehicle');
      } else {
        router.push('/vehicles');
      }
    } catch (err) {
      console.error('Error registering vehicle:', err);
      alert('Error registering vehicle');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 font-hydro-body">
      <PageHeader
        title="Vehicle Registration & Vault Setup"
        description="Register your vehicle specs, plate info, and initial mileage."
        backHref="/vehicles"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Specs Card */}
        <div className="hydro-card-surface p-6 sm:p-8 rounded-2xl border border-border space-y-5">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF5500]/10 text-[#FF5500]">
              <Car className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-hydro-display font-bold text-lg">Vehicle Specification Details</h2>
              <p className="text-xs text-muted-foreground">Provide basic make, model, and registration credentials.</p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="make" className="text-xs font-bold uppercase tracking-wider">Vehicle Make</Label>
              <Select value={formData.make} onValueChange={(v) => handleChange('make', v)}>
                <SelectTrigger id="make" className="rounded-xl h-11">
                  <SelectValue placeholder="Select vehicle make" />
                </SelectTrigger>
                <SelectContent>
                  {VEHICLE_MAKES.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="model" className="text-xs font-bold uppercase tracking-wider">Model Name</Label>
              <Input
                id="model"
                placeholder="e.g. Accord, Camry, Model 3"
                className="rounded-xl h-11"
                value={formData.model}
                onChange={(e) => handleChange('model', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="year" className="text-xs font-bold uppercase tracking-wider">Model Year</Label>
              <Input
                id="year"
                type="number"
                placeholder="2024"
                className="rounded-xl h-11 font-mono"
                value={formData.year}
                onChange={(e) => handleChange('year', e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="color" className="text-xs font-bold uppercase tracking-wider">Vehicle Color</Label>
              <Input
                id="color"
                placeholder="e.g. Midnight Black, Silver"
                className="rounded-xl h-11"
                value={formData.color}
                onChange={(e) => handleChange('color', e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="plate" className="text-xs font-bold uppercase tracking-wider">License Plate Number</Label>
              <Input
                id="plate"
                placeholder="e.g. 7XYZ99"
                className="rounded-xl h-11 font-mono font-bold"
                value={formData.plate}
                onChange={(e) => handleChange('plate', e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="mileage" className="text-xs font-bold uppercase tracking-wider">Current Odometer Mileage</Label>
              <Input
                id="mileage"
                type="number"
                placeholder="15000"
                className="rounded-xl h-11 font-mono"
                value={formData.mileage}
                onChange={(e) => handleChange('mileage', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="vin" className="text-xs font-bold uppercase tracking-wider">Vehicle Identification Number (VIN)</Label>
            <Input
              id="vin"
              placeholder="e.g. 1HGCR2F83HA928374"
              className="rounded-xl h-11 font-mono uppercase"
              value={formData.vin}
              onChange={(e) => handleChange('vin', e.target.value)}
            />
          </div>
        </div>

        {/* Photo Upload Card */}
        <div className="hydro-card-surface p-6 rounded-2xl border border-border space-y-4">
          <h2 className="font-hydro-display font-bold text-base">Vehicle Cover Photo</h2>
          <PhotoUpload
            label="Upload high-res vehicle exterior photo"
            multiple={false}
            onChange={setPhoto}
          />
        </div>

        {/* Single CTA Action Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button type="button" variant="outline" asChild className="rounded-full px-6">
            <Link href="/vehicles">Cancel</Link>
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="bg-[#FF5500] hover:bg-[#FF7700] text-white font-hydro-display font-bold uppercase text-xs tracking-wider px-8 py-3 rounded-full shadow-lg"
          >
            {saving ? 'Registering Vehicle...' : 'Register Vehicle'}
          </Button>
        </div>
      </form>
    </div>
  );
}
