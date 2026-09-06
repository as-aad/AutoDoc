'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Wrench,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  FileText,
  Camera,
  CheckCircle2,
  UserCheck,
  Download,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { StatusStepper } from '@/components/shared/status-stepper';
import { BeforeAfterSlider } from '@/components/shared/before-after-slider';
import { StarRating } from '@/components/shared/star-rating';
import { MechanicChatDialog } from '@/components/shared/mechanic-chat-dialog';
import { Button } from '@/components/ui/button';
import { getBooking, getInvoiceByBooking, updateBookingStatus } from '@/services';
import type { Booking, Invoice } from '@/lib/types';

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);

  const fetchBookingData = async () => {
    const b = await getBooking(params.id as string);
    setBooking(b);
    if (b?.invoiceId || b?.status === 'completed') {
      const inv = await getInvoiceByBooking(b.id);
      setInvoice(inv);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchBookingData();
      setLoading(false);
    })();
  }, [params.id]);

  const handleApproveJob = async () => {
    setApproving(true);
    try {
      const updated = await updateBookingStatus(params.id as string, 'customer_approved');
      if (updated) {
        setBooking(updated);
        alert('You have approved the repair work! The garage will perform final handover.');
      }
    } catch (err) {
      console.error('Approve job error:', err);
    } finally {
      setApproving(false);
    }
  };

  if (loading) return <div className="h-96 animate-pulse rounded-xl bg-secondary" />;
  if (!booking) return <p className="text-muted-foreground">Booking not found.</p>;

  const hasBeforeAfter = (booking.beforePhotos?.length ?? 0) > 0 && (booking.afterPhotos?.length ?? 0) > 0;
  const isMechanicAssigned = Boolean(booking.mechanicName);

  return (
    <div className="space-y-8">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/bookings">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Bookings
        </Link>
      </Button>

      <PageHeader title={booking.serviceTitle || booking.serviceType || 'Repair Job'} description={booking.serviceDescription}>
        <StatusBadge status={booking.status} />
      </PageHeader>

      {/* Repair status timeline */}
      <div className="rounded-xl border-2 border-border bg-card p-6 sm:p-8">
        <h2 className="mb-6 font-display text-lg font-bold">Repair Status & Timeline</h2>
        <StatusStepper timeline={booking.timeline || []} />
      </div>

      {/* Assigned Mechanic & Direct Chat Banner */}
      <div className="rounded-2xl border border-border bg-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        {isMechanicAssigned ? (
          <>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-[#FF5500]/10 border border-[#FF5500]/30 flex items-center justify-center text-[#FF5500]">
                <UserCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Assigned Shop Mechanic</p>
                <h3 className="text-lg font-bold font-display text-foreground">{booking.mechanicName}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Certified Repair Technician @ {booking.garageName}</p>
              </div>
            </div>

            <MechanicChatDialog
              bookingId={booking.id}
              mechanicName={booking.mechanicName}
              customerName={booking.customerName || 'Customer'}
              currentUserRole="customer"
              currentUserId={booking.customerId || 'user-1'}
              currentUserName={booking.customerName || 'Customer'}
              buttonVariant="default"
              buttonText="Talk to Mechanic"
            />
          </>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-secondary border border-border flex items-center justify-center text-muted-foreground">
                <Wrench className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Mechanic Assignment Pending</p>
                <h3 className="text-lg font-bold font-display text-foreground">Awaiting Mechanic Assignment</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{booking.garageName} will assign a shop technician to your repair job shortly.</p>
              </div>
            </div>

            <Button disabled variant="outline" className="text-xs font-bold rounded-xl opacity-70">
              Chat Enabled Once Assigned
            </Button>
          </>
        )}
      </div>

      {/* Booking details matrix */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 rounded-xl border border-border bg-card/60 p-6">
        <div>
          <p className="text-xs font-bold uppercase text-muted-foreground">Vehicle</p>
          <p className="font-display font-bold text-base mt-1">{booking.vehicleName}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-muted-foreground">Garage Shop</p>
          <p className="font-display font-bold text-base mt-1">{booking.garageName}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-muted-foreground">Assigned Mechanic</p>
          <p className="font-display font-bold text-base mt-1 text-[#FF5500]">
            {booking.mechanicName || 'Unassigned (Awaiting Garage)'}
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-muted-foreground">Quoted Price</p>
          <p className="font-display font-bold text-xl text-[#FF5500] mt-1">${booking.price || booking.cost || 0}</p>
        </div>
      </div>

      {/* Customer Approval Section */}
      {(booking.status === 'in_progress' || (hasBeforeAfter && booking.status !== 'completed' && booking.status !== 'customer_approved')) && (
        <div className="rounded-2xl border-2 border-[#FF5500]/40 bg-[#FF5500]/5 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-[#FF5500]" />
            <div>
              <h3 className="font-display text-lg font-bold text-foreground">Review & Accept Completed Work</h3>
              <p className="text-sm text-muted-foreground">
                The mechanic has submitted diagnostic and repair work photos. Review the photos below and accept to confirm satisfaction!
              </p>
            </div>
          </div>
          <Button
            onClick={handleApproveJob}
            disabled={approving}
            className="bg-[#FF5500] hover:bg-[#FF7700] text-white font-bold h-11 px-6 rounded-xl text-sm uppercase tracking-wide shadow-md"
          >
            {approving ? 'Approving Job...' : 'Accept & Approve Repair Work'}
          </Button>
        </div>
      )}

      {booking.status === 'customer_approved' && (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-6 flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-emerald-500" />
          <div>
            <h3 className="font-display text-base font-bold text-foreground">Repair Approved by Customer</h3>
            <p className="text-sm text-muted-foreground">
              You have accepted the repair work! Awaiting garage final handover and invoice generation.
            </p>
          </div>
        </div>
      )}

      {/* Before & After repair photos uploaded by mechanic */}
      {((booking.beforePhotos?.length ?? 0) > 0 || (booking.afterPhotos?.length ?? 0) > 0) && (
        <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-[#FF5500]" />
              <h2 className="font-display text-lg font-bold text-foreground">Mechanic Diagnostic & Repair Images</h2>
            </div>
            <span className="text-xs font-bold text-[#FF5500] bg-[#FF5500]/10 border border-[#FF5500]/20 px-3 py-1 rounded-full">
              Uploaded by Mechanic: {booking.mechanicName || 'Assigned Mechanic'}
            </span>
          </div>

          {hasBeforeAfter && (
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Interactive Slider Comparison</p>
              <BeforeAfterSlider
                beforeImage={booking.beforePhotos?.[0] || ''}
                afterImage={booking.afterPhotos?.[0] || ''}
                className="max-w-2xl"
              />
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-2 pt-2">
            <div className="rounded-xl border border-border bg-secondary/30 p-4 space-y-3">
              <h3 className="font-display font-bold text-sm flex items-center gap-2">
                <Camera className="h-4 w-4 text-[#FF5500]" /> Before Repair Stage Photos ({booking.beforePhotos?.length || 0})
              </h3>
              {(booking.beforePhotos?.length ?? 0) > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {booking.beforePhotos?.map((url, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={url} alt={`Before ${i}`} className="h-24 w-32 object-cover rounded-xl border border-border shadow-sm" />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">No before repair photos uploaded yet.</p>
              )}
            </div>

            <div className="rounded-xl border border-border bg-secondary/30 p-4 space-y-3">
              <h3 className="font-display font-bold text-sm flex items-center gap-2">
                <Camera className="h-4 w-4 text-emerald-500" /> After Repair Stage Photos ({booking.afterPhotos?.length || 0})
              </h3>
              {(booking.afterPhotos?.length ?? 0) > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {booking.afterPhotos?.map((url, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={url} alt={`After ${i}`} className="h-24 w-32 object-cover rounded-xl border border-border shadow-sm" />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">Awaiting after repair photos from assigned mechanic...</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Warranty badge */}
      {booking.status === 'completed' && booking.warrantyExpiry && (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
          <ShieldCheck className="h-5 w-5 text-emerald-500" />
          <div>
            <p className="font-display font-bold text-foreground">
              {booking.warrantyDays || 90}-day warranty active
            </p>
            <p className="text-sm text-muted-foreground">
              Valid until {new Date(booking.warrantyExpiry).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      {booking.status === 'completed' && (
        <div className="flex flex-col gap-3 sm:flex-row flex-wrap">
          <Button variant="outline" asChild className="rounded-xl font-bold">
            <Link href={`/bookings/${booking.id}/invoice`}>
              <FileText className="mr-2 h-4 w-4 text-[#FF5500]" />
              View Invoice
            </Link>
          </Button>
          {invoice?.pdfUrl && (
            <Button asChild className="bg-[#FF5500] hover:bg-[#FF7700] text-white font-bold rounded-xl">
              <a href={invoice.pdfUrl} target="_blank" rel="noopener noreferrer">
                <Download className="mr-2 h-4 w-4" />
                Download Invoice PDF
              </a>
            </Button>
          )}
          {!booking.hasReview && (
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl">
              <Link href={`/bookings/${booking.id}/review`}>
                <Star className="mr-2 h-4 w-4" />
                Leave a Review
              </Link>
            </Button>
          )}
          {booking.hasReview && (
            <div className="flex items-center gap-2 rounded-xl bg-secondary px-4 py-2.5">
              <StarRating rating={5} size="sm" />
              <span className="text-xs text-muted-foreground font-medium">Review submitted</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

