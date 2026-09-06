'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MapPin, AlertTriangle, ShieldCheck } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useRole } from '@/lib/role-context';
import { getRequest, getGarage, getGarageByOwner } from '@/services';
import type { ServiceRequest, Garage } from '@/lib/types';

export default function GarageRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, role } = useRole();
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [garage, setGarage] = useState<Garage | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [quote, setQuote] = useState({ price: '', eta: '', notes: '', warrantyDays: '90' });

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const ownerId = user?.id || 'user-garage-1';
        const [r, g] = await Promise.all([
          getRequest(params.id as string),
          getGarageByOwner(ownerId),
        ]);
        setRequest(r);
        setGarage(g);
      } catch (e) {
        console.error('Error fetching request details:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [params.id, user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quote.price || !quote.eta) {
      alert('Please fill in price and estimated service time.');
      return;
    }

    setSubmitting(true);
    try {
      const ownerId = user?.id || 'user-garage-1';
      let activeGarage = garage;
      if (!activeGarage) {
        activeGarage = await getGarageByOwner(ownerId);
      }

      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'quote',
          requestId: params.id,
          garageId: activeGarage?.id || 'user-garage-1',
          garageName: activeGarage?.name || user?.name || 'Apex Performance Motors',
          price: parseFloat(quote.price),
          eta: quote.eta,
          notes: quote.notes,
          warrantyDays: parseInt(quote.warrantyDays, 10) || 90,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const updated = await getRequest(params.id as string);
        setRequest(updated);
        alert('Quotation submitted successfully to customer!');
        router.push('/garage/requests');
      } else {
        alert(data.error || 'Failed to submit quotation.');
      }
    } catch (err: any) {
      console.error('Submit quote error:', err);
      alert('Failed to submit quote. Please check connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="h-96 animate-pulse rounded-2xl bg-card border border-border" />;
  if (!request) return <p className="text-muted-foreground p-6">Request record not found.</p>;

  return (
    <div className="space-y-8 font-hydro-body">
      <PageHeader
        title={request.title}
        description={request.description}
        backHref="/garage/requests"
      >
        <StatusBadge status={request.status} />
      </PageHeader>

      {/* Request Details Matrix */}
      <div className="grid gap-6 sm:grid-cols-3 hydro-card-surface p-6 rounded-2xl border border-border">
        <div>
          <p className="text-xs font-hydro-body uppercase tracking-wider text-muted-foreground">Target Vehicle</p>
          <p className="font-hydro-display font-bold text-base mt-0.5">{request.vehicleName}</p>
        </div>
        <div>
          <p className="text-xs font-hydro-body uppercase tracking-wider text-muted-foreground">Category</p>
          <p className="font-hydro-display font-bold text-base mt-0.5">{request.category}</p>
        </div>
        <div>
          <p className="text-xs font-hydro-body uppercase tracking-wider text-muted-foreground">Location</p>
          <p className="font-hydro-display font-bold text-base mt-0.5 flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-[#FF5500]" />
            {request.location}
          </p>
        </div>
      </div>

      {/* Attached Photos */}
      {request.photos.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-hydro-display font-bold text-base">Customer Issue Photos</h3>
          <div className="flex flex-wrap gap-3">
            {request.photos.map((photo, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={photo} alt={`Issue ${i + 1}`} className="h-36 w-36 rounded-2xl border border-border object-cover shadow-sm" />
            ))}
          </div>
        </div>
      )}

      {/* Warranty Claim Notice or Submit Quote Form */}
      {request.category === 'Warranty Claim' || request.title?.includes('[WARRANTY CLAIM]') ? (
        <div className="hydro-card-surface p-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 flex items-start gap-4">
          <ShieldCheck className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-hydro-display font-bold text-foreground text-base">Warranty Claim — Direct Active Job</h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              This request is a customer Warranty Claim covered under active warranty. Warranty claims do not receive quotations and are automatically dispatched directly to the repairing garage's active jobs section at $0.00 warranty cost.
            </p>
          </div>
        </div>
      ) : (request.status === 'open' || request.status === 'quoted') && (
        <div className="hydro-card-surface p-6 sm:p-8 rounded-2xl border border-border space-y-5">
          <h2 className="font-hydro-display text-lg font-bold">Submit Service Price Quote</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="price" className="text-xs font-bold uppercase tracking-wider">Your Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="320"
                  className="rounded-xl h-11 font-mono"
                  value={quote.price}
                  onChange={(e) => setQuote({ ...quote, price: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="eta" className="text-xs font-bold uppercase tracking-wider">Estimated Service Time</Label>
                <Input
                  id="eta"
                  placeholder="e.g. Same day, 1-2 business days"
                  className="rounded-xl h-11"
                  value={quote.eta}
                  onChange={(e) => setQuote({ ...quote, eta: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="warranty" className="text-xs font-bold uppercase tracking-wider">Warranty Guarantee (Days)</Label>
              <Input
                id="warranty"
                type="number"
                placeholder="90"
                className="rounded-xl h-11 font-mono"
                value={quote.warrantyDays}
                onChange={(e) => setQuote({ ...quote, warrantyDays: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="notes" className="text-xs font-bold uppercase tracking-wider">Notes & Repair Breakdown for Customer</Label>
              <Textarea
                id="notes"
                placeholder="Detail parts included, diagnostic steps, labor costs, and guarantees..."
                rows={3}
                className="rounded-xl"
                value={quote.notes}
                onChange={(e) => setQuote({ ...quote, notes: e.target.value })}
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={submitting}
                className="bg-[#FF5500] hover:bg-[#FF7700] text-white font-hydro-display font-bold uppercase text-xs tracking-wider px-8 py-3 rounded-full shadow-lg"
              >
                {submitting ? 'Transmitting Quote...' : 'Submit Quotation'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Existing Bids */}
      {request.quotes.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-hydro-display text-lg font-bold">Existing Quotes Submitted</h2>
          <div className="space-y-3">
            {request.quotes.map((q) => (
              <div key={q.id} className="hydro-card-surface p-4 rounded-2xl border border-border flex items-center justify-between">
                <div>
                  <p className="font-hydro-display font-bold text-base">{q.garageName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{q.notes}</p>
                </div>
                <p className="font-hydro-display text-xl font-bold text-[#FF5500]">${q.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
