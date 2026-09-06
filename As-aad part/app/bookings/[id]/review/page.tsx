'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Star, AlertTriangle, ShieldCheck } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getBooking, submitReview } from '@/services';
import type { Booking } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [garageRating, setGarageRating] = useState(0);
  const [mechanicRating, setMechanicRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoverGarage, setHoverGarage] = useState(0);
  const [hoverMechanic, setHoverMechanic] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const b = await getBooking(params.id as string);
      setBooking(b);
      setLoading(false);
    })();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking || booking.status !== 'completed') return;

    setSubmitting(true);
    await submitReview(
      booking.garageId,
      booking.id,
      garageRating,
      mechanicRating || undefined,
      comment,
      booking.customerName || 'Customer'
    );
    setSubmitting(false);
    router.push(`/bookings/${params.id}`);
  };

  if (loading) return <div className="h-96 animate-pulse rounded-2xl bg-card border border-border" />;
  if (!booking) return <p className="text-muted-foreground p-6">Booking record not found.</p>;

  const isCompleted = booking.status === 'completed';

  return (
    <div className="space-y-8 font-hydro-body">
      <PageHeader
        title="Leave Service Review & Rating"
        description={`Rate your service experience with ${booking.garageName}`}
        backHref={`/bookings/${params.id}`}
      />

      {!isCompleted ? (
        <div className="hydro-card-surface p-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 space-y-4 max-w-xl">
          <div className="flex items-center gap-3 text-amber-500">
            <AlertTriangle className="h-6 w-6 shrink-0" />
            <h2 className="font-hydro-display font-bold text-lg">Review Restricted Until Completion</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Per AutoDoc policy, customer reviews and ratings can only be submitted after the repair job has been fully finished and marked <span className="font-bold text-foreground">Completed</span> by the garage or assigned mechanic.
          </p>
          <div className="pt-2">
            <Button asChild variant="outline" className="rounded-full px-6">
              <Link href={`/bookings/${params.id}`}>Return to Booking Workspace</Link>
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
          <div className="hydro-card-surface p-6 sm:p-8 rounded-2xl border border-border space-y-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider">Rate the Garage ({booking.garageName})</Label>
              <div className="flex gap-2 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverGarage(star)}
                    onMouseLeave={() => setHoverGarage(0)}
                    onClick={() => setGarageRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={cn(
                        'h-8 w-8',
                        (hoverGarage || garageRating) >= star
                          ? 'fill-[#FF5500] text-[#FF5500]'
                          : 'text-border fill-border'
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            {booking.mechanicName && (
              <div className="space-y-2 border-t border-border pt-5">
                <Label className="text-xs font-bold uppercase tracking-wider">Rate the Mechanic ({booking.mechanicName})</Label>
                <div className="flex gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverMechanic(star)}
                      onMouseLeave={() => setHoverMechanic(0)}
                      onClick={() => setMechanicRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={cn(
                          'h-8 w-8',
                          (hoverMechanic || mechanicRating) >= star
                            ? 'fill-[#FF5500] text-[#FF5500]'
                            : 'text-border fill-border'
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2 border-t border-border pt-5">
              <Label htmlFor="comment" className="text-xs font-bold uppercase tracking-wider">Your Written Review</Label>
              <Textarea
                id="comment"
                placeholder="Share details about repair quality, timeliness, communication, and overall experience..."
                rows={4}
                className="rounded-xl"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Button type="button" variant="outline" asChild className="rounded-full px-6">
              <Link href={`/bookings/${params.id}`}>Cancel</Link>
            </Button>
            <Button
              type="submit"
              disabled={submitting || garageRating === 0}
              className="bg-[#FF5500] hover:bg-[#FF7700] text-white font-hydro-display font-bold uppercase text-xs tracking-wider px-8 py-3 rounded-full shadow-lg"
            >
              {submitting ? 'Submitting Review...' : 'Submit Service Review'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
