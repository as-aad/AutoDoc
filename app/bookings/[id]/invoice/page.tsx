'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Printer, ShieldCheck, Wrench, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { getInvoice } from '@/services';
import type { Invoice } from '@/lib/types';

export default function InvoicePage() {
  const params = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);

  useEffect(() => {
    (async () => {
      const id = params?.id as string;
      if (!id) return;
      const inv = await getInvoice(id);
      setInvoice(inv);
      setLoading(false);
    })();
  }, [params?.id]);

  const handleFileWarrantyClaim = async () => {
    if (!invoice) return;
    setClaiming(true);

    try {
      const res = await fetch('/api/warranty/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: invoice.bookingId,
          vehicleId: 'veh-1',
          title: `${invoice.vehicleName} - Warranty Repair Claim`,
          description: `Customer submitted a warranty claim against previous service at ${invoice.garageName}.`,
          category: 'Warranty Claim',
          ownerName: invoice.customerName,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setClaimSuccess(true);
      }
    } catch (e) {
      console.error('Warranty claim error:', e);
    } finally {
      setClaiming(false);
    }
  };

  if (loading) return <div className="h-96 animate-pulse rounded-2xl bg-card border border-border" />;
  if (!invoice) return (
    <div className="space-y-6 text-center py-12 font-hydro-body">
      <h2 className="font-hydro-display text-xl font-bold">Invoice Not Found</h2>
      <p className="text-sm text-muted-foreground">The requested invoice record could not be found.</p>
      <Button asChild variant="outline" className="rounded-full">
        <Link href="/bookings">Back to All Bookings</Link>
      </Button>
    </div>
  );

  return (
    <div className="space-y-8 font-hydro-body">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild className="text-[#FF5500]">
          <Link href={`/bookings/${invoice.bookingId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Booking
          </Link>
        </Button>
        <Button variant="outline" size="sm" onClick={() => window.print()} className="font-bold">
          <Printer className="mr-2 h-4 w-4" />
          Download / Print PDF
        </Button>
      </div>

      <PageHeader title="Official Service Invoice & Warranty Certificate" description={`Issued on ${invoice.issuedDate}`} />

      {claimSuccess && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-emerald-500" />
          <div>
            <p className="font-hydro-display font-bold text-emerald-500 text-sm">Warranty Claim Transmitted!</p>
            <p className="text-xs text-muted-foreground">A linked warranty repair request has been generated for {invoice.garageName}.</p>
          </div>
        </div>
      )}

      {/* Invoice Card */}
      <div className="hydro-card-surface p-6 sm:p-10 rounded-3xl border border-border space-y-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF5500] text-white">
                <Wrench className="h-5 w-5" />
              </div>
              <span className="font-hydro-display text-2xl font-bold tracking-wider">AUTODOC</span>
            </div>
            <div className="mt-4 text-xs space-y-0.5">
              <p className="font-hydro-display font-bold text-sm text-foreground">{invoice.garageName}</p>
              <p className="text-muted-foreground">{invoice.garageAddress}</p>
              <p className="text-muted-foreground">{invoice.garagePhone}</p>
            </div>
          </div>

          <div className="sm:text-right text-xs">
            <p className="uppercase font-bold text-muted-foreground tracking-wider text-[10px]">Invoice Reference</p>
            <p className="font-hydro-display font-bold text-xl text-[#FF5500]">{invoice.id.toUpperCase()}</p>
            <div className="mt-3">
              <p className="uppercase font-bold text-muted-foreground tracking-wider text-[10px]">Billed To</p>
              <p className="font-hydro-display font-bold text-sm text-foreground">{invoice.customerName}</p>
              <p className="text-muted-foreground">{invoice.vehicleName}</p>
            </div>
          </div>
        </div>

        {/* Itemized Parts & Labor Table */}
        <div className="overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary/50 font-hydro-display uppercase text-muted-foreground tracking-wider">
                <th className="px-4 py-3 text-left">Item Description</th>
                <th className="px-4 py-3 text-center">Qty</th>
                <th className="px-4 py-3 text-right">Unit Price</th>
                <th className="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {invoice.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3.5 font-medium text-foreground">{item.description}</td>
                  <td className="px-4 py-3.5 text-center font-mono">{item.quantity}</td>
                  <td className="px-4 py-3.5 text-right font-mono">${item.unitPrice.toFixed(2)}</td>
                  <td className="px-4 py-3.5 text-right font-hydro-display font-bold text-[#FF5500]">${item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total Calculations */}
        <div className="flex justify-end">
          <div className="w-full max-w-xs space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-mono font-medium">${invoice.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax & Service Fees</span>
              <span className="font-mono font-medium">${invoice.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-sm font-bold">
              <span className="font-hydro-display">Total Paid</span>
              <span className="font-hydro-display text-xl text-[#FF5500]">${invoice.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Warranty Certificate Banner with Claim Linker */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-emerald-500 shrink-0" />
            <div>
              <p className="font-hydro-display font-bold text-emerald-500 text-sm">
                Official {invoice.warrantyDays}-Day Service Warranty
              </p>
              <p className="text-xs text-muted-foreground">
                Coverage valid until {invoice.warrantyExpiry}
              </p>
            </div>
          </div>

          <Button
            onClick={handleFileWarrantyClaim}
            disabled={claiming || claimSuccess}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl px-4 py-2"
          >
            <AlertTriangle className="mr-1.5 h-4 w-4" />
            {claiming ? 'Filing Claim...' : claimSuccess ? 'Claim Filed' : 'File Warranty Claim'}
          </Button>
        </div>
      </div>
    </div>
  );
}
