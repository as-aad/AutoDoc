'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Wrench, Phone, CheckCircle2, Camera } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { StatusStepper } from '@/components/shared/status-stepper';
import { PhotoUpload } from '@/components/shared/photo-upload';
import { BeforeAfterSlider } from '@/components/shared/before-after-slider';
import { MechanicChatDialog } from '@/components/shared/mechanic-chat-dialog';
import { Button } from '@/components/ui/button';
import { getBooking, updateBookingStatus, uploadBeforeAfterPhotos } from '@/services';
import type { Booking, BookingStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function MechanicWorkloadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [beforePhotos, setBeforePhotos] = useState<string[]>([]);
  const [afterPhotos, setAfterPhotos] = useState<string[]>([]);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    (async () => {
      const b = await getBooking(params.id as string);
      setBooking(b);
      if (b) {
        setBeforePhotos(b.beforePhotos || []);
        setAfterPhotos(b.afterPhotos || []);
      }
      setLoading(false);
    })();
  }, [params.id]);

  const handleStatusUpdate = async (status: BookingStatus) => {
    setUpdating(true);
    const updated = await updateBookingStatus(params.id as string, status);
    if (updated) setBooking(updated);
    setUpdating(false);
  };

  const handleSavePhotos = async (type: 'before' | 'after') => {
    setUpdating(true);
    const photos = type === 'before' ? beforePhotos : afterPhotos;
    const updated = await uploadBeforeAfterPhotos(params.id as string, type, photos);
    if (updated) {
      setBooking(updated);
      alert(`${type === 'before' ? 'Before' : 'After'} repair photos saved to database successfully!`);
    }
    setUpdating(false);
  };

  if (loading) return <div className="h-96 animate-pulse rounded-2xl bg-card border border-border" />;
  if (!booking) return <p className="text-muted-foreground p-6">Booking record not found.</p>;

  const hasBeforeAfter = (booking.beforePhotos?.length ?? 0) > 0 && (booking.afterPhotos?.length ?? 0) > 0;

  return (
    <div className="space-y-8 font-hydro-body">
      <PageHeader
        title={booking.serviceTitle || booking.serviceType || 'Repair Job'}
        description={booking.serviceDescription}
        backHref="/mechanic/workload"
      >
        <StatusBadge status={booking.status} />
      </PageHeader>

      {/* Repair Timeline Stepper */}
      <div className="hydro-card-surface p-6 sm:p-8 rounded-2xl border border-border">
        <h2 className="mb-6 font-hydro-display text-lg font-bold">Repair Stage Progress</h2>
        <StatusStepper timeline={booking.timeline || []} />
      </div>

      {/* Job Details Matrix */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 hydro-card-surface p-6 rounded-2xl border border-border">
        <div>
          <p className="text-xs font-hydro-body uppercase tracking-wider text-muted-foreground">Customer</p>
          <p className="font-hydro-display font-bold text-base mt-0.5">{booking.customerName}</p>
          {booking.customerPhone && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 font-mono">
              <Phone className="h-3 w-3 text-[#FF5500]" /> {booking.customerPhone}
            </p>
          )}
        </div>
        <div>
          <p className="text-xs font-hydro-body uppercase tracking-wider text-muted-foreground">Target Vehicle</p>
          <p className="font-hydro-display font-bold text-base mt-0.5">{booking.vehicleName}</p>
        </div>
        <div>
          <p className="text-xs font-hydro-body uppercase tracking-wider text-muted-foreground">Assigned Garage</p>
          <p className="font-hydro-display font-bold text-base mt-0.5">{booking.garageName}</p>
        </div>
        <div>
          <p className="text-xs font-hydro-body uppercase tracking-wider text-muted-foreground">Repair Cost</p>
          <p className="font-hydro-display font-bold text-xl text-[#FF5500] mt-0.5">${booking.price || booking.cost || 0}</p>
        </div>
      </div>

      {/* Live 3-Way Customer & Garage Chat */}
      <div className="hydro-card-surface p-6 rounded-2xl border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-hydro-display text-base font-bold text-foreground">3-Way Repair Communication Line</h3>
          <p className="text-xs text-muted-foreground">Connected live chat room between Customer ({booking.customerName}), Garage Owner ({booking.garageName}), and assigned Mechanic.</p>
        </div>
        <MechanicChatDialog
          bookingId={booking.id}
          mechanicName={booking.mechanicName || 'Jordan Reyes'}
          customerName={booking.customerName || 'Alex Morgan'}
          currentUserRole="mechanic"
          currentUserId="user-mechanic-1"
          currentUserName={booking.mechanicName || 'Jordan Reyes'}
          buttonVariant="default"
          buttonText="Open Connected Job Chat"
        />
      </div>

      {/* Photo Upload Stage Logs — Only Assigned Mechanic can upload before and after images */}
      {booking.status !== 'pending' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="hydro-card-surface p-6 rounded-2xl border border-border">
            <h3 className="mb-3 font-hydro-display font-bold text-base flex items-center gap-2">
              <Camera className="h-4 w-4 text-[#FF5500]" /> Before Repair Stage Photos
            </h3>
            <PhotoUpload multiple onChange={setBeforePhotos} existingPhotos={beforePhotos} />
            <Button size="sm" variant="outline" className="mt-3 font-bold bg-[#FF5500]/10 hover:bg-[#FF5500]/20 text-[#FF5500] border-[#FF5500]/30" onClick={() => handleSavePhotos('before')} disabled={updating}>
              {updating ? 'Saving...' : 'Save Before Photos'}
            </Button>
          </div>

          <div className="hydro-card-surface p-6 rounded-2xl border border-border">
            <h3 className="mb-3 font-hydro-display font-bold text-base flex items-center gap-2">
              <Camera className="h-4 w-4 text-emerald-500" /> After Repair Stage Photos
            </h3>
            <PhotoUpload multiple onChange={setAfterPhotos} existingPhotos={afterPhotos} />
            <Button size="sm" variant="outline" className="mt-3 font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border-emerald-500/30" onClick={() => handleSavePhotos('after')} disabled={updating}>
              {updating ? 'Saving...' : 'Save After Photos'}
            </Button>
          </div>
        </div>
      )}

      {/* Before/After Slider */}
      {hasBeforeAfter && (
        <div className="hydro-card-surface p-6 rounded-2xl border border-border">
          <h2 className="mb-4 font-hydro-display text-xl font-bold">Interactive Before & After Verification</h2>
          <BeforeAfterSlider
            beforeImage={booking.beforePhotos?.[0] || ''}
            afterImage={booking.afterPhotos?.[0] || ''}
            className="max-w-2xl"
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row pt-2">
        {booking.status === 'accepted' && (
          <Button onClick={() => handleStatusUpdate('in_progress')} disabled={updating} className="bg-[#FF5500] hover:bg-[#FF7700] text-white font-hydro-display font-bold uppercase text-xs tracking-wider px-8 py-3 rounded-full shadow-lg">
            {updating ? 'Updating...' : 'Start Repair Work'}
          </Button>
        )}
        {booking.status === 'in_progress' && (
          <Button onClick={() => handleStatusUpdate('completed')} disabled={updating} className="bg-emerald-600 hover:bg-emerald-700 text-white font-hydro-display font-bold uppercase text-xs tracking-wider px-8 py-3 rounded-full shadow-lg">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            {updating ? 'Completing...' : 'Mark Job Complete'}
          </Button>
        )}
      </div>
    </div>
  );
}
