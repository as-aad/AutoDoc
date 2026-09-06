'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Clock, ShieldCheck, CheckCircle2, AlertTriangle, Building2, X, MessageSquare } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { StarRating } from '@/components/shared/star-rating';
import { Button } from '@/components/ui/button';
import { getRequest, acceptQuote } from '@/services';
import { getGarageReviews } from '@/services/garage-service';
import type { ServiceRequest, Review } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function RequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState<string | null>(null);

  const [reviewsModal, setReviewsModal] = useState<{
    open: boolean;
    garageName: string;
    rating: number;
    reviewCount: number;
    reviews: Review[];
    loading: boolean;
  } | null>(null);

  useEffect(() => {
    (async () => {
      const r = await getRequest(params.id as string);
      setRequest(r);
      setLoading(false);
    })();
  }, [params.id]);

  const handleAccept = async (quoteId: string) => {
    setAccepting(quoteId);
    const booking = await acceptQuote(params.id as string, quoteId);
    if (booking) router.push(`/bookings/${booking.id}`);
  };

  const handleOpenReviews = async (garageId: string, garageName: string, rating: number, reviewCount: number) => {
    setReviewsModal({
      open: true,
      garageName,
      rating,
      reviewCount,
      reviews: [],
      loading: true,
    });
    const data = await getGarageReviews(garageId);
    setReviewsModal({
      open: true,
      garageName,
      rating: data.rating,
      reviewCount: data.reviewCount,
      reviews: data.reviews || [],
      loading: false,
    });
  };

  if (loading) return <div className="h-96 animate-pulse rounded-2xl bg-card border border-border" />;
  if (!request) return <p className="text-muted-foreground p-6">Service request record not found.</p>;

  const quotes = request?.quotes || [];
  const sortedQuotes = [...quotes].sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
  const isBooked = request.status === 'booked' || Boolean(request.acceptedQuoteId);
  const bookedQuoteId = request.acceptedQuoteId || (isBooked && sortedQuotes.length > 0 ? sortedQuotes[0].id : null);

  return (
    <div className="space-y-8 font-hydro-body">
      <Button variant="ghost" size="sm" asChild className="text-[#FF5500] hover:text-[#FF7700]">
        <Link href="/requests">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Service Requests
        </Link>
      </Button>

      <PageHeader title={request.title} description={request.description}>
        <div className="flex items-center gap-3">
          {request.urgency === 'high' && (
            <span className="rounded-full bg-red-500 text-white font-bold text-xs uppercase tracking-wider px-3.5 py-1 flex items-center gap-1.5 shadow-md animate-pulse">
              <AlertTriangle className="h-4 w-4" /> Emergency Breakdown
            </span>
          )}
          <StatusBadge status={request.status} />
        </div>
      </PageHeader>

      {/* Summary Matrix */}
      <div className="grid gap-6 sm:grid-cols-3 hydro-card-surface p-6 rounded-2xl border border-border">
        <div>
          <p className="text-xs font-hydro-body uppercase tracking-wider text-muted-foreground">Target Vehicle</p>
          <p className="font-hydro-display font-bold text-base mt-0.5">{request.vehicleName}</p>
        </div>
        <div>
          <p className="text-xs font-hydro-body uppercase tracking-wider text-muted-foreground">Service Category</p>
          <p className="font-hydro-display font-bold text-base mt-0.5">{request.category}</p>
        </div>
        <div>
          <p className="text-xs font-hydro-body uppercase tracking-wider text-muted-foreground">Service Location</p>
          <p className="font-hydro-display font-bold text-base mt-0.5 flex items-center gap-1">
            <MapPin className="h-4 w-4 text-[#FF5500]" /> {request.location}
          </p>
        </div>
      </div>

      {/* Photos */}
      {request.photos.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Submitted Issue Photos</p>
          <div className="flex flex-wrap gap-3">
            {request.photos.map((photo, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={photo} alt={`Issue ${i + 1}`} className="h-32 w-32 rounded-2xl border border-border object-cover shadow-sm" />
            ))}
          </div>
        </div>
      )}

      {/* Warranty Claim Card or Bidding Section */}
      {request.category === 'Warranty Claim' || request.title?.includes('[WARRANTY CLAIM]') ? (
        <div className="hydro-card-surface p-6 sm:p-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-hydro-display text-lg font-bold text-foreground">
                Warranty Claim — Direct Active Repair Job
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                This claim is covered $0.00 under active warranty and has been automatically assigned directly to your original repairing garage's active jobs list. No quotation bidding is required.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            <Button asChild className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl">
              <Link href="/bookings">
                View Active Bookings & Repair Progress
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="hydro-card-surface p-6 sm:p-8 rounded-2xl border border-border space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", isBooked ? "bg-emerald-500/10 text-emerald-500" : "bg-[#FF5500]/10 text-[#FF5500]")}>
                {isBooked ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <Clock className={cn("h-5 w-5", sortedQuotes.length === 0 && "animate-spin")} />
                )}
              </div>
              <div>
                <h2 className="font-hydro-display text-lg font-bold">
                  {isBooked ? 'Quotation Accepted & Booking Confirmed' : 'Broadcasting Request to Nearby Garages'}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {isBooked
                    ? 'A garage quotation was accepted. This repair request is now booked and locked from further bidding.'
                    : sortedQuotes.length > 0
                    ? `${sortedQuotes.length} verified garage partner ${sortedQuotes.length === 1 ? 'quote received' : 'quotes received'}. Select a bid to book your repair service.`
                    : 'Verified garage partners in your area will submit price quotations shortly.'}
                </p>
              </div>
            </div>

            {sortedQuotes.length > 0 && (
              <span className={cn("rounded-full border text-xs font-bold font-mono px-3.5 py-1.5 self-start sm:self-center", isBooked ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30" : "bg-[#FF5500]/10 text-[#FF5500] border-[#FF5500]/30")}>
                {isBooked ? '1 Accepted Bid' : `${sortedQuotes.length} ${sortedQuotes.length === 1 ? 'Bid Available' : 'Bids Available'}`}
              </span>
            )}
          </div>

        {isBooked && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-500 font-bold font-hydro-display text-sm">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <span>Service Quote Accepted & Repair Job Booked</span>
            </div>
            <span className="text-[11px] text-muted-foreground bg-background px-3 py-1 rounded-full border border-border font-mono">
              Booking Locked — No duplicate quotes allowed
            </span>
          </div>
        )}

        {sortedQuotes.length > 0 ? (
          <div className="space-y-4">
            {/* Desktop Side-by-Side Comparison Matrix */}
            <div className="hidden overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/50 font-hydro-display text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-5 py-4 text-left">Garage Partner</th>
                    <th className="px-5 py-4 text-left">Rating & Real Reviews</th>
                    <th className="px-5 py-4 text-left">Price Bid</th>
                    <th className="px-5 py-4 text-left">Estimated Repair ETA</th>
                    <th className="px-5 py-4 text-left">Warranty Terms</th>
                    <th className="px-5 py-4 text-right">Booking Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm">
                  {sortedQuotes.map((quote) => {
                    const isThisAccepted = isBooked && (bookedQuoteId ? quote.id === bookedQuoteId : true);
                    const reviewCountNum = Number(quote.garageReviewCount ?? 0);
                    const ratingNum = Number(quote.garageRating ?? 0);

                    return (
                      <tr
                        key={quote.id}
                        className={cn(
                          'transition-colors',
                          isThisAccepted
                            ? 'bg-emerald-500/10 font-medium'
                            : isBooked
                            ? 'opacity-50 bg-secondary/10'
                            : 'hover:bg-secondary/30'
                        )}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            {quote.garageVerified && (
                              <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-hydro-display text-base font-bold text-foreground">{quote.garageName}</p>
                                {isThisAccepted && (
                                  <span className="rounded-full bg-emerald-500 text-white font-bold text-[10px] uppercase px-2.5 py-0.5 shadow-sm">
                                    ✓ Booked Quote
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {quote.notes ? (quote.notes.length > 60 ? `${quote.notes.slice(0, 60)}...` : quote.notes) : 'Full diagnostic and warranty included.'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() => handleOpenReviews(quote.garageId, quote.garageName, ratingNum, reviewCountNum)}
                            className="flex flex-col items-start hover:opacity-80 transition-opacity text-left group"
                          >
                            <StarRating rating={ratingNum} size="sm" showValue reviewCount={reviewCountNum} />
                            <span className="text-[11px] text-[#FF5500] font-medium underline underline-offset-2 group-hover:text-[#FF7700] mt-0.5">
                              {reviewCountNum > 0 ? `Read ${reviewCountNum} real ${reviewCountNum === 1 ? 'review' : 'reviews'}` : 'View garage reviews'}
                            </span>
                          </button>
                        </td>
                        <td className="px-5 py-4">
                          <p className={cn("font-hydro-display text-xl font-bold", isThisAccepted ? "text-emerald-500" : "text-[#FF5500]")}>
                            ${Number(quote.price || 0).toFixed(2)}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5 font-mono text-xs">
                            <Clock className="h-4 w-4 text-[#FF5500]" />
                            <span>{quote.eta}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-mono text-xs">
                          <span className="rounded-full bg-emerald-500/10 text-emerald-500 font-bold px-2.5 py-1">
                            {quote.warrantyDays} Days Warranty
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          {isThisAccepted ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/20 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                              <CheckCircle2 className="h-4 w-4" /> Booked & Locked
                            </span>
                          ) : isBooked ? (
                            <Button
                              size="sm"
                              disabled
                              variant="ghost"
                              className="text-xs font-medium text-muted-foreground cursor-not-allowed"
                            >
                              Booking Closed
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleAccept(quote.id)}
                              disabled={accepting !== null}
                              className="bg-[#FF5500] hover:bg-[#FF7700] text-white font-bold text-xs rounded-xl px-5 py-2 shadow-md transition-transform hover:scale-105"
                            >
                              {accepting === quote.id ? 'Booking Job...' : 'Accept & Book'}
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Comparison Cards */}
            <div className="space-y-4 lg:hidden">
              {sortedQuotes.map((quote) => {
                const isThisAccepted = isBooked && (bookedQuoteId ? quote.id === bookedQuoteId : true);
                const reviewCountNum = Number(quote.garageReviewCount ?? 0);
                const ratingNum = Number(quote.garageRating ?? 0);

                return (
                  <div
                    key={quote.id}
                    className={cn(
                      "hydro-card-surface p-5 rounded-2xl border space-y-3 transition-all",
                      isThisAccepted
                        ? "border-emerald-500 bg-emerald-500/10 shadow-lg"
                        : isBooked
                        ? "opacity-50 border-border"
                        : "border-border"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {quote.garageVerified && <ShieldCheck className="h-5 w-5 text-emerald-500" />}
                        <p className="font-hydro-display text-base font-bold">{quote.garageName}</p>
                        {isThisAccepted && (
                          <span className="rounded-full bg-emerald-500 text-white font-bold text-[10px] uppercase px-2 py-0.5">
                            ✓ Booked
                          </span>
                        )}
                      </div>
                      <p className={cn("font-hydro-display text-xl font-bold", isThisAccepted ? "text-emerald-500" : "text-[#FF5500]")}>
                        ${Number(quote.price || 0).toFixed(2)}
                      </p>
                    </div>

                    <p className="text-xs text-muted-foreground">{quote.notes}</p>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs pt-2 border-t border-border gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenReviews(quote.garageId, quote.garageName, ratingNum, reviewCountNum)}
                        className="flex flex-col items-start hover:opacity-80 transition-opacity text-left group"
                      >
                        <StarRating rating={ratingNum} size="sm" showValue reviewCount={reviewCountNum} />
                        <span className="text-[11px] text-[#FF5500] font-medium underline underline-offset-2 group-hover:text-[#FF7700] mt-0.5">
                          {reviewCountNum > 0 ? `Read ${reviewCountNum} real ${reviewCountNum === 1 ? 'review' : 'reviews'}` : 'View garage reviews'}
                        </span>
                      </button>
                      <span className="font-mono text-muted-foreground">{quote.eta} • {quote.warrantyDays} Days Warranty</span>
                    </div>

                    {isThisAccepted ? (
                      <div className="w-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-500 font-bold text-xs rounded-xl py-2.5 text-center flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4" /> Quote Accepted & Job Booked
                      </div>
                    ) : isBooked ? (
                      <Button
                        disabled
                        variant="secondary"
                        className="w-full text-xs font-medium text-muted-foreground cursor-not-allowed py-2.5"
                      >
                        Booking Closed
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleAccept(quote.id)}
                        disabled={accepting !== null}
                        className="w-full bg-[#FF5500] hover:bg-[#FF7700] text-white font-bold text-xs rounded-xl py-2.5 shadow-md"
                      >
                        {accepting === quote.id ? 'Booking Job...' : 'Accept & Book Garage'}
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="py-10 text-center space-y-3">
            <Clock className="mx-auto h-10 w-10 text-[#FF5500] animate-spin" />
            <p className="font-hydro-display text-base font-bold">Waiting for Garage Quotations</p>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Verified garage partners in your area will submit price quotations shortly. You can accept and book service as soon as a bid is received.
            </p>
          </div>
        )}
      </div>
      )}

      {/* Real Reviews Modal */}
      {reviewsModal?.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl max-h-[85vh] overflow-hidden rounded-2xl bg-card border border-border shadow-2xl flex flex-col font-hydro-body">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border p-5 bg-secondary/30">
              <div>
                <h3 className="font-hydro-display text-lg font-bold flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-[#FF5500]" />
                  {reviewsModal.garageName} Reviews
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <StarRating rating={reviewsModal.rating} size="sm" showValue reviewCount={reviewsModal.reviewCount} />
                  <span className="text-xs text-muted-foreground">• Verified Database Reviews</span>
                </div>
              </div>
              <button
                onClick={() => setReviewsModal(null)}
                className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {reviewsModal.loading ? (
                <div className="py-12 text-center text-muted-foreground space-y-2">
                  <Clock className="mx-auto h-8 w-8 text-[#FF5500] animate-spin" />
                  <p className="text-xs">Fetching real customer reviews...</p>
                </div>
              ) : reviewsModal.reviews.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground space-y-3">
                  <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground/50" />
                  <p className="font-hydro-display font-bold text-foreground text-sm">No Customer Reviews Yet</p>
                  <p className="text-xs max-w-sm mx-auto">
                    This garage does not have any verified customer reviews submitted yet. Be the first to leave a review after your repair service!
                  </p>
                </div>
              ) : (
                reviewsModal.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl bg-secondary/20 border border-border/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-sm text-foreground font-hydro-display">{rev.customerName || 'Verified Customer'}</p>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {new Date(rev.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <StarRating rating={rev.garageRating} size="sm" showValue />
                    {rev.comment ? (
                      <p className="text-xs text-foreground/90 leading-relaxed bg-background/50 p-2.5 rounded-lg border border-border/40">
                        "{rev.comment}"
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">No written comment provided.</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
