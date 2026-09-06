'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getVehicle, updateVehicle } from '@/services';
import { VEHICLE_MAKES } from '@/lib/constants';
import type { Vehicle } from '@/lib/types';

export default function EditVehiclePage() {
  const params = useParams();
  const router = useRouter();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    plate: '',
    color: '',
    vin: '',
    mileage: '',
  });

  useEffect(() => {
    (async () => {
      const v = await getVehicle(params.id as string);
      if (v) {
        setVehicle(v);
        setFormData({
          make: v.make,
          model: v.model,
          year: String(v.year),
          plate: v.plate,
          color: v.color,
          vin: v.vin,
          mileage: String(v.mileage),
        });
      }
      setLoading(false);
    })();
  }, [params.id]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await updateVehicle(params.id as string, {
      make: formData.make,
      model: formData.model,
      year: parseInt(formData.year),
      plate: formData.plate,
      color: formData.color,
      vin: formData.vin,
      mileage: parseInt(formData.mileage),
    });
    router.push(`/vehicles/${params.id}`);
  };

  if (loading) return <div className="h-96 animate-pulse rounded-xl bg-muted" />;

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/vehicles/${params.id}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Vehicle
        </Link>
      </Button>

      <PageHeader title="Edit Vehicle" description="Update your vehicle information." />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Vehicle Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="make">Make</Label>
                <Select value={formData.make} onValueChange={(v) => handleChange('make', v)}>
                  <SelectTrigger id="make">
                    <SelectValue placeholder="Select make" />
                  </SelectTrigger>
                  <SelectContent>
                    {VEHICLE_MAKES.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => handleChange('model', e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input id="year" type="number" value={formData.year} onChange={(e) => handleChange('year', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input id="color" value={formData.color} onChange={(e) => handleChange('color', e.target.value)} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="plate">License Plate</Label>
                <Input id="plate" value={formData.plate} onChange={(e) => handleChange('plate', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mileage">Mileage</Label>
                <Input id="mileage" type="number" value={formData.mileage} onChange={(e) => handleChange('mileage', e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="vin">VIN</Label>
              <Input id="vin" value={formData.vin} onChange={(e) => handleChange('vin', e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" asChild>
            <Link href={`/vehicles/${params.id}`}>Cancel</Link>
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
